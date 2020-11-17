class GamesController < ApplicationController
  def show
    @game = Game.find_by_slug!(params[:id])
  end
end
