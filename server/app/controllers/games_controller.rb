# frozen_string_literal: true

class GamesController < ApplicationController
  skip_before_action :sign_in_or_anon!, only: [:next]
  before_action :validate_token!, only: [:next]
  before_action :check_not_anon!, only: [:create]
  before_action :set_game!, only: [:show, :start, :next, :abort, :attempt, :my_answers]
  before_action :redirect_unless_can_manage!, only: [:start, :abort]
  before_action :redirect_unless_admin!, only: [:index], if: :admin_requested?

  TOKEN = ENVied.GAMES_SECRET.freeze

  def index # rubocop:disable Metrics/AbcSize
    @games = current_user.games
    @created_games = current_user.created_games
    @games = case params[:scope]
             when "available"
               @games.available + @created_games.available
             when "past"
               @games.past + @created_games.past
             when "admin"
               Game.all.to_a
             else
               @games + @created_games
             end
    @games.uniq.sort_by! { |g| -g.created_at.to_i }
  end

  # TODO: user management
  def create
    game, err = Game.create_one!(current_user)
    render json: {
      success: err.nil?,
      message: err || "Created game #{game.slug}",
    }
  end

  def show
    render json: @game.to_json
  end

  def start
    return render json: { success: false, message: "Already started" } if @game.started?

    # Start game and return
    @game.update!(started_at: Time.current)
    GameStepJob.set(wait: Game::START_DELAY).perform_later(game_next_url(@game.slug))
    GameChannel.broadcast_to(@game, {
                               event: "game_started",
                               state: @game.to_json,
                             })
    render json: { success: true, message: "Started" }
  end

  def my_answers
    answers_by_index = @game.answers_for(current_user)
                            .group_by(&:track_index).transform_values do |a|
      a.first.to_json
    end
    render json: answers_by_index
  end

  def abort
    return render json: { success: false, message: "Already finished or aborted" } unless @game.available?

    @game.abort!
    render json: { success: true, message: "Aborted" }
  end

  def next
    # TODO: maybe do nothing if a job is already in the queue!

    # If the game does not run anymore, just return
    return render json: { status: "finished" } unless @game.running?

    if @game.current_track + 1 < @game.tracks.size
      @game.next_song!

      # Enqueue next step
      GameStepJob.set(wait: Game::SONG_DURATION + Game::SONG_DELAY).perform_later(game_next_url(@game.slug))
    else
      @game.finish!
    end

    render json: { status: "running" }
  end

  def attempt
    attempt_timestamp = Time.current
    query = params.require(:q)
    answer = @game.find_or_create_answer_for!(current_user)
    unless answer
      return render json: {
        success: false,
        message: "Game is not going on",
      }
    end

    res, msg = answer.process_attempt!(query, attempt_timestamp)

    if res
      # Broadcast new rankings
      GameChannel.broadcast_to(@game, {
                                 rankings: @game.rankings,
                               })
    end

    render json: {
      success: res,
      message: msg,
    }
  end

  private

  def validate_token!
    token = params.require(:token)
    raise ActiveRecord::RecordNotFound unless token == TOKEN
  end

  def redirect_unless_can_manage!
    return if !current_user.anonymous? && @game.can_be_managed_by?(current_user)

    render status: :forbidden, json: {
      message: "Can't access this page",
    }
  end

  def set_game!
    @game = Game.find_by!(slug: params[:game_id] || params[:id])
  end

  def admin_requested?
    params[:scope] == "admin"
  end
end
