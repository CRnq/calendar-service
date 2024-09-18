class AddTable < ActiveRecord::Migration[6.1]
  def change
    create_table :tagcolors do |t|
      t.string :color_code
      t.string :color_name
    end
    
    create_table :areas do |t|
      t.string :area_name
    end
  end
end
