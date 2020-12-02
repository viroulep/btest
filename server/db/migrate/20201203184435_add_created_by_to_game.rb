# frozen_string_literal: true

class AddCreatedByToGame < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :created_by, :integer, null: false, default: 1
    add_index :games, :created_by
  end
end
