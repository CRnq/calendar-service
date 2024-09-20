class RenameNameColorColumn < ActiveRecord::Migration[6.1]
  def change
    rename_column :Tagcolors, :color_cord, :color_code
  end
end
