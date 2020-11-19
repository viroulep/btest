json.extract! game, :id, :slug
json.finished game.finished?
json.aborted game.aborted?
json.running game.running?
json.available game.available?
