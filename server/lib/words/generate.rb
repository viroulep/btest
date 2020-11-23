module Words
  class Generate
    DICT_PATH = "#{Rails.root.to_s }/lib/words/data.txt"
    WORDS = File.open(DICT_PATH) do |file|
      file.map(&:chomp)
    end.freeze
    WORDS_SIZE = WORDS.size


    # Generate a string based on concatenating 'n' words
    def self.random(n)
      (1..n).map do
        WORDS[rand(0..WORDS_SIZE)]
      end.join("")
    end
  end
end
