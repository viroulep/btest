# frozen_string_literal: true

class Validators::Metaphone
  # Remove the parts' "matching" elements from ref
  def self.validate(ref, parts)
    parts.each do |p|
      # Early exit if we found everything already
      break if ref.empty?

      ref.delete_if do |r|
        !(r & p).empty?
      end
    end
    ref.empty?
  end

  # Create the ref tokens from the actual artist/title string
  # It must return an array
  def self.build_ref(input)
    StringTransform.tokenize(input).map { |t| Text::Metaphone.double_metaphone(t).compact }
  end
end
