class GameChannel < ApplicationCable::Channel
  def subscribed
    # TODO: if user-restricted game, one can use 'reject' to reject it
    game = Game.find_by_slug!(params[:id])
    stream_for game
    GameChannel.broadcast_to(game, {
      rankings: game.rankings,
    })
  end

  def unsubscribed
    game = Game.find_by_slug!(params[:id])
    GameChannel.broadcast_to(game, {
      rankings: game.rankings,
    })
  end
end
