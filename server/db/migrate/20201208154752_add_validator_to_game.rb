# frozen_string_literal: true

class AddValidatorToGame < ActiveRecord::Migration[6.0]
  def change
    add_column :games, :validator_name, :string, null: false, default: "levenshtein"
  end
end
