module StringTransform
  # Returns an array of "cleaned up" token from the given string.
  # Eg: "jEan-jaccques GOLDMAN" -> ["jean", "jacques", "goldman"]
  def self.tokenize(s)
    # First transliterate the string to remove any non ascii char (like 'é')
    s = I18n.transliterate(s)

    # Remove any parenthesized stuff (usually used to indicate featuring or
    # complement song titles).
    s.gsub!(/\([^)]*\)/, '')

    # TODO: remove also "[some text]"

    # Turn any non alphanumeric char into blanks
    s.gsub!(/[^0-9a-zA-Z]/, ' ')

    # Downcase to normalize
    s.downcase!

    # Be tolerant for some chars
    s.tr!('y', 'i')

    # Squeeze the thing, this both:
    #   - get rid of duplicate blank spaces
    #   - introduce a tolerance for duplicate letters by removing them
    s.squeeze!

    # Finally return the thing as an array
    s.split(" ")
  end
end
