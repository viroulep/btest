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

  def get_tracklist(quantity) # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    unreadable_by_tracklist = {}
    tracklists_data = playlists.map do |playlist|
      response = RestClient.get(playlist["tracklist"])
      data = JSON.parse(response.body)
      # Partition readable/non-readable tracks
      readable, unreadable = data["data"].partition { |track| track["readable"] }
      if unreadable.any?
        unreadable_by_tracklist[playlist["id"]] = {
          size: unreadable.size,
          title: playlist["title"],
        }
      end
      # Return only readable tracks
      readable
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

    # Craft a nice warning message if there were unreadable tracks.
    warning = unreadable_by_tracklist.values.map do |playlist|
      "  - #{playlist[:size]} from the playlist '#{playlist[:title]}'"
    end.join("\n")
    warning = if unreadable_by_tracklist.empty?
                nil
              else
                "\nSome tracks in your playlist(s) are not able to be read through Deezer's API:\n#{warning}"
              end

    [Tracklist.from_deezer(picked), nil, warning]
  rescue RestClient::ExceptionWithResponse => e
    [nil, e, nil]
  end

  def to_json(*_args)
    {
      id: id,
      playlists: playlists,
    }
  end
end
