# frozen_string_literal: true

# Known mixes:
# 37635 - electro swing
# 38305 - the 80's
# 38315 - the 90's
# 38325 - the 2000
# 38395 - french
# 38405 - french new scene
# 39071 - gospel
# 42182 - rock
# 42202 - hard rock
class DeezerMix < ApplicationRecord
  validates :tracklist, :title, :description, :picture, presence: true
  validates :id, uniqueness: true
  has_many :games, as: :sourceable, dependent: :destroy

  def get_tracklist(quantity)
    # Return a Tracklist with 'quantity' random songs from the mix,
    # or nil if we can't get them.
    response = RestClient.get("#{tracklist}?limit=50")
    data = JSON.parse(response.body)
    # Filter out non-readable tracks
    tracks = data["data"].select { |track| track["readable"] }.sample(quantity)
    [Tracklist.from_deezer(tracks), nil]
  rescue RestClient::ExceptionWithResponse => e
    [nil, e]
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

  def to_json(*_args)
    {
      id: id,
      title: title,
    }
  end
end
