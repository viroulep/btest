# frozen_string_literal: true

class DeezerPlaylist < ApplicationRecord
  DEEZER_API_PLAYLIST_URL = "https://api.deezer.com/playlist/%<id>s"
  has_many :games, as: :sourceable, dependent: :destroy
  validate :playlists_are_valid

  def playlists_are_valid
    playlists.each do |playlist|
      errors.add(:playlists, "missing id") if playlist["id"].blank?
      errors.add(:playlists, "missing title") if playlist["title"].blank?
      errors.add(:playlists, "missing tracklist") if playlist["tracklist"].blank?
    end
  end

  def self.from_ids(input_string) # rubocop:disable Metrics/AbcSize
    ids = input_string.split(",").map(&:to_i)
    return [nil, "one of the playlists has an invalid id"] if ids.count(0).positive?
    return [nil, "no playlists to take songs from"] if ids.empty?

    new_playlist = DeezerPlaylist.new
    ids.each do |playlist_id|
      response = RestClient.get(format(DEEZER_API_PLAYLIST_URL, id: playlist_id))
      data = JSON.parse(response.body)
      new_playlist.playlists << {
        "id" => data["id"],
        "title" => data["title"],
        "nb_tracks" => data["nb_tracks"],
        "description" => data["description"],
        "tracklist" => data["tracklist"],
      }
    end
    if new_playlist.save
      [new_playlist, nil]
    else
      [nil, "Couldn't successfully create the playlist"]
    end
  rescue RestClient::ExceptionWithResponse => e
    [nil, e]
  end

  def get_tracklist(quantity) # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    tracklists_data = playlists.map do |playlist|
      # By default deezer gives only 25 tracks.
      # If available, set the nb_tracks as the limit, with an arbitrary upper
      # bound to 200.
      limit = [playlist["nb_tracks"] || 25, 200].min
      response = RestClient.get(playlist["tracklist"], { params: { limit: limit } })
      data = JSON.parse(response.body)
      # Filter out non-readable tracks
      data["data"].select { |track| track["readable"] }
    end

    quantity_available = tracklists_data.map(&:size).reduce(:+)
    if quantity > quantity_available
      return [
        nil,
        "There are not enough tracks in the playlists (it may be that the playlist"\
        "is empty, or that all the tracks in the playlists are not available through Deezer's API)",
      ]
    end

    # Clear out any playlist that may have ended up empty (due to unreadable tracks)
    tracklists_data.select!(&:any?)

    picked = []
    # Shortcut if we have a single playlist source
    if tracklists_data.size == 1
      picked = tracklists_data.first.sample(quantity)
    else
      quantity.times do
        source = tracklists_data.sample
        picked << source.delete(source.sample)
        tracklists_data.delete(source) if source.empty?
      end
    end

    [Tracklist.from_deezer(picked), nil]
  rescue RestClient::ExceptionWithResponse => e
    [nil, e]
  end

  def to_json(*_args)
    {
      id: id,
      playlists: playlists,
    }
  end
end
