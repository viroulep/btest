# frozen_string_literal: true

class Words::Generate
  DICT_PATH = Rails.root.join("lib/words/data.txt").freeze
  WORDS = File.open(DICT_PATH) do |file|
    file.map(&:chomp)
  end.freeze
  WORDS_SIZE = WORDS.size

  # Generate a string based on concatenating 'total_words' words
  def self.random(total_words)
    (1..total_words).map do
      WORDS[rand(0..WORDS_SIZE)]
    end.join
  end
end
