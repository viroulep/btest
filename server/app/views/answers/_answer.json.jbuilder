json.extract! answer, :track_index, :total_points, :worthy_position
json.fast answer.fast?
json.artist answer.correct_artist?
json.title answer.correct_title?
json.delay answer.delay_or_nil
