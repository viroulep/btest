class GameChannel < ApplicationCable::Channel
  def subscribed
    # TODO: if user-restricted game, one can use 'reject' to reject it
    game = Game.find_by_slug!(params[:id])
    stream_for game
    GameChannel.broadcast_to(game, {
      action: "users_updated",
      users: game.user_connected.append(current_user),
    })
  end

  def unsubscribed
    game = Game.find_by_slug!(params[:id])
    GameChannel.broadcast_to(game, {
      action: "users_updated",
      users: game.user_connected,
    })
  end
end
