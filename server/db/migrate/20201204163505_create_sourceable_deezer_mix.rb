# frozen_string_literal: true

class CreateSourceableDeezerMix < ActiveRecord::Migration[6.0]
  def change
    create_table :deezer_mixes do |t|
      t.string :title
      t.string :picture
      t.string :description
      t.string :tracklist

      t.timestamps
    end

    add_reference :games, :sourceable, polymorphic: true
  end
end
