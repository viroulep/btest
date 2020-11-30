# frozen_string_literal: true

class GameStepJob < ApplicationJob
  queue_as :default

  def perform(next_url)
    RestClient.post(next_url, { token: GamesController::TOKEN })
  end
end
