class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.datetime :started_at
      t.datetime :aborted_at
      t.datetime :finished_at
      t.integer :current_track, default: -1, null: false
      t.datetime :current_track_started_at
      t.text :tracks
      t.string :slug

      t.timestamps
    end
  end
end
