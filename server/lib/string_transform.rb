# frozen_string_literal: true

module StringTransform
  # Returns an array of "cleaned up" token from the given string.
  # Eg: "jEan-jaccques GOLDMAN" -> ["jean", "jacques", "goldman"]
  def self.tokenize(input)
    # First transliterate the string to remove any non ascii char (like the 'e' acute)
    input = I18n.transliterate(input)

    # Remove any parenthesized stuff (usually used to indicate featuring or
    # complement song titles).
    input.gsub!(/\([^)]*\)/, "")

    # TODO: remove also "[some text]"

    # Turn any non alphanumeric char into blanks
    input.gsub!(/[^0-9a-zA-Z]/, " ")

    # Downcase to normalize
    input.downcase!

    # Be tolerant for some chars
    input.tr!("y", "i")

    # Squeeze the thing, this both:
    #   - get rid of duplicate blank spaces
    #   - introduce a tolerance for duplicate letters by removing them
    input.squeeze!

    # Finally return the thing as an array
    input.split
  end
end
