class AddForeignKey < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key "user_calendars", "calendars"
    add_foreign_key "user_calendars", "users"
  end
end
