class RenameTable < ActiveRecord::Migration[6.1]
  def change
    rename_table :user_calemdars, :user_calendars
  end
end
