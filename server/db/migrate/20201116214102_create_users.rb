class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.timestamps
    end
    create_table :deezer_users do |t|
      t.string :name
      t.string :email
      t.string :avatar_url
      t.references :user, null: false

      t.timestamps
    end
  end
end
