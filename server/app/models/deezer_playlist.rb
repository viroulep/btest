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

  def get_tracklist(quantity) # rubocop:disable Metrics/AbcSize
    tracklists_data = playlists.map do |playlist|
      response = RestClient.get(playlist["tracklist"])
      data = JSON.parse(response.body)
      # Filter out non-readable tracks
      data["data"].select { |track| track["readable"] }
    end

    quantity_available = tracklists_data.map(&:size).reduce(:+)
    return [nil, "There are not enough tracks in the playlists"] if quantity > quantity_available

    picked = []
    # Shortcut if we have a single playlist source
    if tracklists_data.size == 1
      picked = tracklists_data.first.sample(quantity)
    else
      quantity.times do
        source = tracklists_data.sample
        picked << source.delete(source.sample)
      end
    end

    [Tracklist.from_deezer(picked), nil]
  rescue RestClient::ExceptionWithResponse => e
    [nil, e]
  end
end
