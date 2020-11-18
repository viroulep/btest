class GameStepJob < ApplicationJob
  queue_as :default

  def perform(game)
    # Do something later
    unless game.started?
      # Start game and return
      game.update!(started_at: Time.now)
      # Enqueue the step in 15s
      GameStepJob.set(wait: Game::START_DELAY).perform_later(game)
      return
    end

    # If the game does not run anymore, just return
    return unless game.running?

    current_track = game.current_track
    next_track = current_track + 1
    if next_track < game.tracks.size
      # To next song!
      game.update!(current_track: next_track, current_track_started_at: Time.now)

      # FIXME: we should probably give an estimate during the round, but that
      # computing should prevail in case some request was somehow delayed.
      # Rank correct answers
      game.rank_correct_answers(current_track)

      # Broadcast current song and state
      GameStepJob.set(wait: Game::SONG_DURATION + Game::SONG_DELAY).perform_later(game)
    else
      # Finish the game
      game.update!(finished_at: Time.now)
      # Broadcast the final state
    end
  end
end
