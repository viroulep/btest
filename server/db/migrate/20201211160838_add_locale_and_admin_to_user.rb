# frozen_string_literal: true

class AddLocaleAndAdminToUser < ActiveRecord::Migration[6.0]
  def change
    change_table(:users, bulk: true) do |t|
      t.column :admin, :boolean, null: false, default: false
      t.column :locale, :string
    end
    add_column :anonymous_users, :locale, :string
  end
end
