class AddTaskNameColumn < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :task_name, :string
  end
end
