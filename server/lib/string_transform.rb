# frozen_string_literal: true

module StringTransform
  # Returns an array of "cleaned up" token from the given string.
  # Eg: "jEan-jaccques GOLDMAN" -> ["jean", "jaccques", "goldman"]
  # We don't do any kind of "correction" on the tokens: the levenshtein distance
  # will take care of this.
  def self.tokenize(input)
    # First transliterate the string to remove any non ascii char (like the 'e' acute)
    input = I18n.transliterate(input)

    # Remove any parenthesized stuff (usually used to indicate featuring or
    # complement song titles).
    input.gsub!(/\([^)]*\)/, "")

    # And stuff in brackets
    input.gsub!(/\[[^\]]*\]/, "")

    # Turn any non alphanumeric char into blanks
    input.gsub!(/[^0-9a-zA-Z]/, " ")

    # Downcase to normalize
    input.downcase!

    # Squeeze the thing, so that spliting by " " makes sense
    input.squeeze!(" ")

    # Finally return the thing as an array
    input.split
  end
end
