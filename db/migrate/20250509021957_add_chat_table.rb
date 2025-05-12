class AddChatTable < ActiveRecord::Migration[6.1]
  def change
    create_table :chats do |t|
      t.integer :calendar_id
      t.integer :user_id
      t.string :message
      t.timestamps
    end
  end
end
