class GameChannel < ApplicationCable::Channel
  def subscribed
    game = Game.find_by_slug!(params[:id])
    stream_for game
    GameChannel.broadcast_to(game, {
      action: "someone joined",
    })
  end

end
