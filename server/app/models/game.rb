class Game < ApplicationRecord
  SONG_SOURCE="https://api.deezer.com/radio/38325/tracks"
  START_DELAY = 5.seconds
  SONG_DURATION = 30.seconds
  SONG_DELAY = 5.seconds

  serialize :tracks, Tracklist
  has_many :answers
  after_save :post_game_cleanup, if: :saved_change_to_finished_at?

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
    current_track >= 0 ? tracks.first(current_track).reverse : []
  end

  def has_active_track?
    running? && current_track >= 0
  end

  def find_or_create_answer_for!(user)
    return nil unless has_active_track?

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

  def add_active_user(user)
    return unless available?
    answers.create!({
      artist_parts: [],
      title_parts: [],
      track_index: -1,
      track_started_at: Time.now,
      userable: user,
    })
  end

  def remove_active_user(user)
    answers.where(userable: user, track_index: -1).destroy_all
  end

  def answers_for(user)
    answers.where(userable: user)
      .where.not(track_index: -1)
      .order(track_index: :desc)
  end

  def rankings
    answers.includes(:userable)
      .group_by(&:userable)
      .map do |user, valid|
      current_answer = valid.find { |a| a.track_index == current_track }&.to_json if current_track >= 0
      {
        name: user.name,
        id: user.id,
        anonymous: user.anonymous?,
        points: valid.sum(&:total_points),
        current: current_answer,
      }
    end.sort_by! { |a| -a[:points] }
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

  def to_json
    {
      slug: slug,
      current_track: current_track,
      rankings: rankings,
      tracks: finished_tracks,
      # fixme: remove that...
      current: tracks[current_track].to_json,
    }
  end

  def self.generate_slug
    Random.new.rand(1_000_000).to_s.rjust(6, "0")
  end

  def self.create_one!
    # FIXME: proper "music source" class with providers
    # for testing purpose, this is the "2000" mix
    begin
      # Request 50, because the 15 first tend to be very similar
      mix = RestClient.get("https://api.deezer.com/radio/38325/tracks?limit=50")
      data = JSON.parse(mix.body)
      data["data"] = data["data"].shuffle.first(15)
      # FIXME: create a tracklist object
      tracks = Tracklist.from_deezer(data)
      puts "there are #{tracks.size} songs"
      # FIXME: make sure slug is unique!
      [Game.create!(slug: Game.generate_slug, tracks: tracks), nil]
    rescue RestClient::ExceptionWithResponse => err
      [nil, err]
    end
  end

  private def post_game_cleanup
    return unless finished_at
    # Remove any active user
    answers.where(track_index: -1).destroy_all
  end
end
