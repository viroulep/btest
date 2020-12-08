# frozen_string_literal: true

class Validators::Levenshtein
  # Remove the parts' "matching" elements from ref
  def self.validate(ref, parts)
    parts.each do |p|
      # Early exit if we found everything already
      break if ref.empty?

      ref.delete_if do |r|
        # Set the max allowed Levenshtein distance
        # Past 3 chars, allow one mistake per 6 chars
        max_distance = if r.size < 4
                         0
                       else
                         (r.size / 6) + 1
                       end
        # Set the depth to max_distance + 1, since we do want to now if the
        # difference goes over the max_distance.
        Text::Levenshtein.distance(r, p, max_distance + 1) <= max_distance
      end
    end
    ref.empty?
  end

  # Create the ref tokens from the actual artist/title string
  # It must return an array
  def self.build_ref(input)
    StringTransform.tokenize(input)
  end
end
