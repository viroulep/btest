json.extract! game, :id, :slug
json.finished game.finished?
json.running game.running?
json.available game.available?
