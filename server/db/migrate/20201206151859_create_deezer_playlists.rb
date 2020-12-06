# frozen_string_literal: true

class CreateDeezerPlaylists < ActiveRecord::Migration[6.0]
  def change
    create_table :deezer_playlists do |t|
      t.column :playlists, :json, default: []

      t.timestamps
    end
  end
end
