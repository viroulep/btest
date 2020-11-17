class Track
  attr_accessor :title
  attr_accessor :artist
  attr_accessor :cover_url
  attr_accessor :sample_url

  attr_reader :artist_parts
  attr_reader :title_parts

  def initialize(title, artist, cover_url, sample_url)
    @title = title
    @artist = artist
    @cover_url = cover_url
    @sample_url = sample_url
    @title_parts = StringTransform.tokenize(title)
    @artist_parts = StringTransform.tokenize(artist)
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

  def to_json
    {
      "title" => title,
      "artist" => artist,
      "cover_url" => cover_url,
      "sample_url" => sample_url,
    }
  end
end
