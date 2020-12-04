# frozen_string_literal: true

class DeezerMix < ApplicationRecord
  validates :tracklist, :title, :description, :picture, presence: true

  def get_random_track(_quantity)
    # Return 'quantity' random song from the mix, or nil if we can't get them.
    []
  end

  def self.from_api(data)
    # Construct a DeezerMix object from Deezer's API data
    DeezerMix.create(
      id: data["id"],
      title: data["title"],
      description: data["description"],
      picture: data["picture"],
      tracklist: data["tracklist"],
    )
  end
end
