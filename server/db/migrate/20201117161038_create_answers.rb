class CreateAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :anonymous_users do |t|
      t.string :name
      t.timestamps
    end

    create_table :answers do |t|
      t.references :userable, polymorphic: true
      t.references :game, null: false
      t.column :artist_parts, :json
      t.column :title_parts, :json
      t.integer :track_index, null: false, index: true
      t.datetime :track_started_at
      t.datetime :validated_at
      t.integer :worthy_position, null: false, default: 0
      t.decimal :total_points, null: false, default: 0

      t.timestamps
    end
  end
end
