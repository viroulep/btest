# frozen_string_literal: true

json.array! @games, partial: "games/game_short", as: :game
