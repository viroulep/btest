# frozen_string_literal: true

class DeezerMix < ApplicationRecord
  validates :tracklist, :title, :description, :picture, presence: true

  def get_tracklist(quantity)
    # Return a Tracklist with 'quantity' random songs from the mix,
    # or nil if we can't get them.
    response = RestClient.get("#{tracklist}?limit=50")
    data = JSON.parse(response.body)
    data["data"] = data["data"].sample(quantity)
    [Tracklist.from_deezer(data), nil]
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
end
