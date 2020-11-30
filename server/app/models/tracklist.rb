# frozen_string_literal: true

class Tracklist < Array
  # FIXME: create this as part of a "provider" object
  def self.from_deezer(json)
    json["data"].map { |t| Track.from_deezer(t) }
  end

  def self.load(json)
    return if json.nil?

    json = JSON.parse(json) unless json.is_a?(Hash)
    Tracklist.new(json.map { |t| Track.from_json(t) })
  end

  def self.dump(tracklist)
    tracklist ? JSON.dump(tracklist.map(&:to_json)) : nil
  end
end
