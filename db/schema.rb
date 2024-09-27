# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_09_27_061801) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "areas", force: :cascade do |t|
    t.string "area_name"
  end

  create_table "calendars", force: :cascade do |t|
    t.string "calendar_name"
    t.integer "user_id"
    t.boolean "is_shared"
  end

  create_table "tagcolors", force: :cascade do |t|
    t.string "color_code"
    t.string "color_name"
  end

  create_table "tasks", force: :cascade do |t|
    t.integer "calendar_id"
    t.datetime "start_time"
    t.datetime "end_time"
    t.integer "tag_color_id"
    t.integer "area_id"
    t.string "task_name"
  end

  create_table "user_calendars", force: :cascade do |t|
    t.integer "user_id"
    t.integer "calendar_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.string "user_img"
    t.integer "area_id"
  end

end
