json.extract! @game, :slug, :current_track, :rankings
json.tracks @game.finished_tracks, :title, :artist, :cover_url, :sample_url
json.user_answers @game.answers_for(current_user), partial: 'answers/answer', as: :answer
# fixme: remove that...
json.current @game.tracks[@game.current_track]
