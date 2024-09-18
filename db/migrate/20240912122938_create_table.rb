class CreateTable < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :username
      t.string :password_digest
      t.string :user_img
      t.integer :area_id
    end
    
    create_table :calendars do |t|
      t.string :calendar_name
      t.integer :user_id
      t.boolean :is_shared
    end
    
    create_table :user_calemdars do |t|
      t.integer :user_id
      t.integer :calendar_id
    end
    
    create_table :tasks do |t|
      t.integer :calendar_id
      t.datetime :start
      t.datetime :end
      t.integer :tag_color_id
      t.integer :area_id
    end
    
  end
end
