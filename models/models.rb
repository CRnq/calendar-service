require 'bundler/setup'
require 'bcrypt'
Bundler.require

ActiveRecord::Base.establish_connection

class User < ActiveRecord::Base
    has_secure_password
    has_many :user_calendars
    has_many :calendars, through: :user_calendars
end

class Calendar < ActiveRecord::Base
    has_many :user_calendars
    has_many :users, through: :user_calendars
    has_many :tasks
end

class UserCalendar < ActiveRecord::Base
    belongs_to :user
    belongs_to :calendar
end

class Task < ActiveRecord::Base
    belongs_to :calendar
    belongs_to :tagcolor, foreign_key: 'tag_color_id'
end

class Tagcolor < ActiveRecord::Base
    has_many :tasks
end

class Area < ActiveRecord::Base
end