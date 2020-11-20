class Answer < ApplicationRecord
  FAST_DELAY = 10
  belongs_to :userable, polymorphic: true
  belongs_to :game
  before_save :set_total_points

  # NOTE: 's' is a user-provided string, we don't want to do anything fancy
  # with it!
  # returns a boolean with a reason. (true if something validated, false if
  # nothing worked)
  def process_attempt!(s, timestamp)
    # Let one more second for the delay
    if (timestamp - track_started_at) > Game::SONG_DURATION + 1
      return [false, "You are too late!"]
    end

    return [false, "You already found all about this song."] if correct?

    tokens = StringTransform.tokenize(s)

    newly_found_artist = false
    unless correct_artist?
      self.artist_parts = artist_parts - tokens
      newly_found_artist = correct_artist?
    end

    newly_found_title = false
    unless correct_title?
      self.title_parts = title_parts - tokens
      newly_found_title = correct_title?
    end

    if correct?
      self.validated_at = timestamp
    end

    save!

    if correct?
      # We may have to update top3!
      game.rank_correct_answers(track_index)
      return [true, "Great job, you got everything!"]
    elsif newly_found_title
      return [true, "You just need the artist now!"]
    elsif newly_found_artist
      return [true, "Alright, do you know the song's title now?"]
    else
      return [false, "Nop"]
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

  def to_json
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

  private def set_total_points
    return if track_index < 0
    # Base point
    total = [correct?, correct_title?, correct_artist?].count(true)

    # Speed bonus
    total += 0.5 if fast?

    # Top N bonus
    total += (4 - worthy_position) * 0.5 if worthy_position > 0

    self.total_points = total
  end
end
