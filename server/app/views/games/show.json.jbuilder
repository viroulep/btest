json.id @game.id
json.current_song @game.current_track
json.tracks @game.finished_tracks, :title, :artist, :cover_url, :sample_url
