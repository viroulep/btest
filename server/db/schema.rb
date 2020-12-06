# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_12_06_151859) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "anonymous_users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "answers", force: :cascade do |t|
    t.string "userable_type"
    t.bigint "userable_id"
    t.bigint "game_id", null: false
    t.json "artist_parts"
    t.json "title_parts"
    t.integer "track_index", null: false
    t.datetime "track_started_at"
    t.datetime "validated_at"
    t.integer "worthy_position", default: 0, null: false
    t.decimal "total_points", default: "0.0", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["game_id"], name: "index_answers_on_game_id"
    t.index ["track_index"], name: "index_answers_on_track_index"
    t.index ["userable_type", "userable_id"], name: "index_answers_on_userable_type_and_userable_id"
  end

  create_table "deezer_mixes", force: :cascade do |t|
    t.string "title"
    t.string "picture"
    t.string "description"
    t.string "tracklist"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "deezer_playlists", force: :cascade do |t|
    t.json "playlists", default: []
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "games", force: :cascade do |t|
    t.datetime "started_at"
    t.datetime "aborted_at"
    t.datetime "finished_at"
    t.integer "current_track", default: -1, null: false
    t.datetime "current_track_started_at"
    t.text "tracks"
    t.string "slug", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "created_by", default: 1, null: false
    t.string "sourceable_type"
    t.bigint "sourceable_id"
    t.index ["created_by"], name: "index_games_on_created_by"
    t.index ["slug"], name: "index_games_on_slug", unique: true
    t.index ["sourceable_type", "sourceable_id"], name: "index_games_on_sourceable_type_and_sourceable_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "uid", null: false
    t.string "provider", null: false
    t.string "provided_name", null: false
    t.string "provided_email", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

end
