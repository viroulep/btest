# frozen_string_literal: true

class Track
  attr_accessor :title, :artist, :cover_url, :sample_url

  def initialize(title, artist, cover_url, sample_url)
    @title = title
    @artist = artist
    @cover_url = cover_url
    @sample_url = sample_url
  end

  # FIXME: create this as part of a "provider" object
  # FIXME: some validation that these make sense
  def self.from_deezer(json)
    json["title"] = json["title_short"]
    json["artist"] = json["artist"]["name"]
    json["cover_url"] = json["album"]["cover"]
    json["sample_url"] = json["preview"]
    Track.from_json(json)
  end

  def self.from_json(json)
    Track.new(json["title"],
              json["artist"],
              json["cover_url"],
              json["sample_url"])
  end

  def to_json(*_args)
    {
      "title" => title,
      "artist" => artist,
      "cover_url" => cover_url,
      "sample_url" => sample_url,
    }
  end
end
