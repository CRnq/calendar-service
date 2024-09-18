class AddDefaultTagColors < ActiveRecord::Migration[6.1]
  def up
    Tagcolor.create([{ color_code: '#D50000', color_name: 'Red'},
                     { color_code: '#F4511E', color_name: 'Orange'},
                     { color_code: '#F68F26', color_name: 'Yellow'},
                     { color_code: '#31B679', color_name: 'Green'},
                     { color_code: '#039BE5', color_name: 'Blue'},
                     { color_code: '#7886CB', color_name: 'Purple'},
                     { color_code: '#8E24AA', color_name: 'Deep-purple'}])
  end
  
  def down
    Tagcolor.where(color_name: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Deep-purple']).delete_al
  end
end
