class RenameNameColumn < ActiveRecord::Migration[6.1]
  def change
    rename_column :tasks, :start, :start_time
    rename_column :tasks, :end, :end_time
  end
end
