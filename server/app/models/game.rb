class Game < ApplicationRecord
  SONG_SOURCE="https://api.deezer.com/radio/38325/tracks"
  START_DELAY = 15.seconds
  SONG_DURATION = 30.seconds
  SONG_DELAY = 5.seconds

  serialize :tracks, Tracklist
  has_many :answers

  def available?
    !(aborted? || finished?)
  end

  def started?
    !started_at.nil?
  end

  def finished?
    !finished_at.nil?
  end

  def aborted?
    !aborted_at.nil?
  end

  def running?
    available? && started?
  end

  def finished_tracks
    current_track > 0 ? tracks.first(current_track - 1) : []
  end

  def find_or_create_answer_for!(user)
    return nil unless running?

    existing = user.answers.find_by(game: self, track_index: current_track)
    return existing if existing

    track = tracks[current_track]
    attrs = {
      artist_parts: track.artist_parts,
      title_parts: track.title_parts,
      track_index: current_track,
      track_started_at: current_track_started_at,
      userable: user,
    }
    answers.create!(attrs)
  end

  def rank_correct_answers(track_index)
    # Technically it only makes sense to do so for past or current track,
    # but there is no harm in running this for arbitrary track_index.
    correct_answers = answers
      .where(track_index: track_index)
      .where.not(validated_at: nil)
      .order(validated_at: :asc)
      .limit(3)
    correct_answers.each.with_index(1) do |a, pos|
      a.update(worthy_position: pos)
    end
  end

  def self.generate_slug
    Random.new.rand(1_000_000).to_s.rjust(6, "0")
  end

  def self.create_one!
    # FIXME: proper "music source" class with providers
    # for testing purpose, this is the "2000" mix
    begin
      mix = RestClient.get("https://api.deezer.com/radio/38325/tracks?limit=15")
      data = JSON.parse(mix.body)
      # FIXME: create a tracklist object
      tracks = Tracklist.from_deezer(data)
      puts "there are #{tracks.size} songs"
      [Game.create!(slug: Game.generate_slug, tracks: tracks), nil]
    rescue RestClient::ExceptionWithResponse => err
      [nil, err]
    end
  end
end
