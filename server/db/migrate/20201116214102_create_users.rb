class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :uid, null: false
      t.string :provider, null: false
      t.string :provided_name, null: false
      t.string :provided_email, null: false
      t.timestamps
    end

    add_index :users, [:uid, :provider], unique: true

    create_table :anonymous_users do |t|
      t.string :name
      t.timestamps
    end
  end
end
