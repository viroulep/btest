class GamesController < ApplicationController
  # TODO: make this admin only?
  def index
    @games = Game.all.order(created_at: :desc)
  end

  def show
    @game = Game.find_by_slug!(params[:id])
  end

  def attempt
    attempt_timestamp = Time.now
    @game = Game.find_by_slug!(params[:game_id])
    @query = params.require(:q)
    @answer = @game.find_or_create_answer_for!(current_user)
    unless @answer
      return render json: {
        success: false,
        message: "Game is not going on",
      }
    end

    res, msg = @answer.process_attempt!(@query)

    render json: {
      success: res,
      message: msg,
    }
  end
end
