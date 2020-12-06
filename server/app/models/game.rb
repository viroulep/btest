# frozen_string_literal: true

class Game < ApplicationRecord
  START_DELAY = 5.seconds
  SONG_DURATION = 30.seconds
  SONG_DELAY = 5.seconds

  validates :slug, uniqueness: true

  serialize :tracks, Tracklist

  has_many :answers, dependent: :destroy
  belongs_to :creator, class_name: "User", foreign_key: :created_by, inverse_of: :created_games
  belongs_to :sourceable, polymorphic: true

  after_save :post_game_cleanup, if: :saved_change_to_finished_at?

  default_scope { order(created_at: :desc) }

  scope :available, -> { where(aborted_at: nil, finished_at: nil) }
  def available?
    !(aborted? || finished?)
  end

  def started?
    !started_at.nil?
  end

  scope :past, -> { where.not(aborted_at: nil).or(where.not(finished_at: nil)) }
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
    if finished?
      tracks.reverse
    else
      current_track >= 0 ? tracks.first(current_track).reverse : []
    end
  end

  def active_track?
    running? && current_track >= 0
  end

  def find_or_create_answer_for!(user)
    return nil unless active_track?

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
                      track_started_at: Time.now.iso8601,
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

  def rankings # rubocop:disable Metrics/AbcSize
    raw_rankings = answers.includes(:userable)
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
    end
    raw_rankings.sort_by! { |a| -a[:points] }
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

  def next_song!
    next_track = current_track + 1
    raise "Invalid call to next_song!" unless next_track < tracks.size

    update!(current_track: next_track, current_track_started_at: Time.current)

    # FIXME: we should probably give an estimate during the round, but that
    # computing should prevail in case some request was somehow delayed.
    # Rank correct answers (note that this is fine to do this for
    # current_track=-1)
    rank_correct_answers(current_track)

    # Broadcast current song and state
    GameChannel.broadcast_to(self, {
                               state: to_json,
                               preview: tracks[next_track].sample_url,
                             })
  end

  def finish!
    # Finish the game
    update!(finished_at: Time.current)
    # Broadcast the final state
    GameChannel.broadcast_to(self, {
                               event: "game_finished",
                               state: to_json,
                             })
  end

  def abort!
    update!(aborted_at: Time.current)
    GameChannel.broadcast_to(self, {
                               event: "game_aborted",
                               state: to_json,
                             })
  end

  def can_be_managed_by?(user)
    user.admin? || creator == user
  end

  def to_json(*_args)
    {
      slug: slug,
      currentTrack: current_track,
      rankings: rankings,
      tracks: finished_tracks,
      totalTracks: tracks.size,
      available: available?,
      started: started?,
      createdBy: creator.identifiable_attrs,
    }
  end

  def self.generate_slug
    slug = ""
    loop do
      slug = Words::Generate.random(3)
      break if Game.find_by(slug: slug).nil?
    end
    slug
  end

  def self.create_one!(creator, number_of_tracks, source)
    tracks, err = source.get_tracklist(number_of_tracks)
    if err.nil?
      [Game.create!(
        slug: Game.generate_slug,
        tracks: tracks,
        created_by: creator.id,
        sourceable: source,
      ), nil]
    else
      [nil, err] unless err.nil?
    end
  end

  private

  def post_game_cleanup
    return unless finished_at

    # Remove any active user
    answers.where(track_index: -1).destroy_all
  end
end
