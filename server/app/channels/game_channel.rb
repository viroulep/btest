# frozen_string_literal: true

class GameChannel < ApplicationCable::Channel
  def subscribed
    # TODO: if user-restricted game, one can use 'reject' to reject it
    game = Game.find_by!(slug: params[:id])
    stream_for game
    game.add_active_user(current_user)
    GameChannel.broadcast_to(game, {
                               rankings: game.rankings,
                             })
  end

  def unsubscribed
    game = Game.find_by!(slug: params[:id])
    game.remove_active_user(current_user)
    GameChannel.broadcast_to(game, {
                               rankings: game.rankings,
                             })
  end
end
