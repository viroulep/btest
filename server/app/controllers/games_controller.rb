class GamesController < ApplicationController
  skip_before_action :sign_in_or_anon!, only: [:next]

  TOKEN = ENVied.GAMES_SECRET.freeze

  # TODO: make this admin only?
  def index
    @games = Game.all.order(created_at: :desc)
  end

  # TODO: user management
  def create
    game, err = Game.create_one!
    render json: {
      success: err.nil?,
      message: err ? err : "Created game #{game.slug}",
    }
  end

  def show
    game = Game.find_by_slug!(params[:id])
    render json: game.to_json
  end

  def start
    game = Game.find_by_slug!(params[:game_id])
    if game.started?
      return render json: { success: false, message: "Already started" }
    end
    # Start game and return
    game.update!(started_at: Time.now)
    GameStepJob.set(wait: Game::START_DELAY).perform_later(game_next_url(game.slug))
    GameChannel.broadcast_to(game, {
      action: "game_started",
    })
    return render json: { success: true, message: "Started" }
  end

  def mine
    game = Game.find_by_slug!(params[:game_id])
    answers_by_index = game.answers_for(current_user)
      .group_by(&:track_index).map do |i, a|
      [i, a.first.to_json]
    end.to_h
    render json: answers_by_index
  end

  def abort
    game = Game.find_by_slug!(params[:game_id])
    unless game.available?
      return render json: { success: false, message: "Already finished or aborted" }
    end
    game.update!(aborted_at: Time.now)
    render json: { success: true, message: "Aborted" }
  end

  def next
    # TODO: maybe do nothing if a job is already in the queue!
    game = Game.find_by_slug!(params.require([:game_id]))
    token = params.require(:token)
    unless token == TOKEN
      raise ActiveRecord::RecordNotFound
    end

    # If the game does not run anymore, just return
    return render json: { status: "finished" } unless game.running?

    current_track = game.current_track
    next_track = current_track + 1
    if next_track < game.tracks.size
      # To next song!
      game.update!(current_track: next_track, current_track_started_at: Time.now)

      # FIXME: we should probably give an estimate during the round, but that
      # computing should prevail in case some request was somehow delayed.
      # Rank correct answers (note that this is fine to do this for
      # current_track=-1)
      game.rank_correct_answers(current_track)

      # Broadcast current song and state
      GameChannel.broadcast_to(game, {
        state: game.to_json,
        preview: game.tracks[next_track].sample_url,
      })

      # Set next step
      GameStepJob.set(wait: Game::SONG_DURATION + Game::SONG_DELAY).perform_later(game_next_url(game.slug))
    else
      # Finish the game
      game.update!(finished_at: Time.now)
      # Broadcast the final state
      GameChannel.broadcast_to(game, {
        action: "game_finished",
      })
    end
    render json: { status: "running" }
  end

  def attempt
    attempt_timestamp = Time.now
    game = Game.find_by_slug!(params[:game_id])
    query = params.require(:q)
    answer = game.find_or_create_answer_for!(current_user)
    unless answer
      return render json: {
        success: false,
        message: "Game is not going on",
      }
    end

    res, msg = answer.process_attempt!(query, attempt_timestamp)

    if res
      # Broadcast new rankings
      GameChannel.broadcast_to(game, {
        rankings: game.rankings,
      })
    end

    render json: {
      success: res,
      message: msg,
    }
  end
end
