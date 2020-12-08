# frozen_string_literal: true

class Answer < ApplicationRecord
  FAST_DELAY = 10
  belongs_to :userable, polymorphic: true, inverse_of: :answers
  belongs_to :game, inverse_of: :answers
  before_save :set_total_points
  delegate :validator, to: :game

  # NOTE: 'input' is a user-provided string, we don't want to do anything fancy
  # with it!
  # returns a boolean with a reason. (true if something validated, false otherwise)
  def process_attempt!(input, timestamp)
    reason = reason_to_reject(timestamp)
    return [false, reason] if reason

    anything_changed, found_artist, found_title = update_from_input(input)

    self.validated_at = timestamp if correct?

    save!

    if correct?
      # We may have to update top3!
      game.rank_correct_answers(track_index)
      [true, "Great job, you got everything!"]
    elsif found_title
      [true, "You just need the artist now!"]
    elsif found_artist
      [true, "Alright, do you know the song's title now?"]
    elsif anything_changed
      [false, "Not quite complete, but you found something!"]
    else
      [false, "Nop"]
    end
  end

  def correct?
    correct_title? && correct_artist?
  end

  def correct_artist?
    artist_parts.empty?
  end

  def correct_title?
    title_parts.empty?
  end

  def delay_or_nil
    (validated_at - track_started_at) if correct?
  end

  # Returns true if the title was found fast (arbitrarily set to 10 seconds)
  def fast?
    (delay_or_nil || FAST_DELAY) < FAST_DELAY
  end

  def to_json(*_args)
    {
      track_index: track_index,
      total_points: total_points,
      worthy_position: worthy_position,
      fast: fast?,
      artist: correct_artist?,
      title: correct_title?,
      delay: delay_or_nil,
    }
  end

  private

  def set_total_points
    return if track_index.negative?

    # Base point
    total = [correct?, correct_title?, correct_artist?].count(true)

    # Speed bonus
    total += 0.5 if fast?

    # Top N bonus
    total += (4 - worthy_position) * 0.5 if worthy_position.positive?

    self.total_points = total
  end

  def reason_to_reject(timestamp)
    # Let one more second for the delay
    if (timestamp - track_started_at) > Game::SONG_DURATION + 1
      "You are too late!"
    elsif correct?
      "You already found all about this song."
    end
  end

  def update_from_input(input)
    parts = validator.build_ref(input)

    found_artist = validator.validate(artist_parts, parts) unless correct_artist?
    found_title = validator.validate(title_parts, parts) unless correct_title?
    found_something = artist_parts_changed? || title_parts_changed?

    [found_something, found_artist, found_title]
  end
end
