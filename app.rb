require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?
require './models/models.rb'
require 'json'
require 'bcrypt'

enable :sessions

helpers do
    def logged_in?
        session[:user]
    end
    
    def current_user
        User.find(session[:user])
    end
end

get '/' do
    if logged_in?
        user = current_user
        calendars = user.calendars
        calendar = calendars[0]
        redirect "/calendar/#{calendar.id}"
        # カレンダー表示の処理をかく
    else
        redirect '/login'
    end
end

get '/signup' do
    @areas = Area.all
    erb :signup
end

post '/signup' do
    @areas = Area.all
    file = params[:file][:tempfile]
    filename = params[:file][:filename]
    
    File.open("./public/user_images/#{filename}", "wb") do |f|
        f.write(file.read)
    end
    
    img_path = "user_images/#{filename}"
    
    pw = params[:password]
    pwc = params[:password_confirmation]
    
    if pw == pwc
    user = User.create(
        username: params[:username],
        password: pw,
        password_confirmation: pwc,
        user_img: img_path,
        area_id: params[:area_id]
        )
    
    calendar = Calendar.create(
        calendar_name: user.username,
        user_id: user.id,
        is_shared: false
        )
        
    UserCalendar.create(
        user_id: user.id,
        calendar_id: calendar.id
        )
    else
        redirect '/signup'
    end
    
    if user.persisted?
        session[:user] = user.id
        redirect '/'
    else    
        redirect '/signup'
    end
end

get '/login' do
    erb :login
end

post '/login' do
    user = User.find_by(username: params[:username])
    if user && user.authenticate(params[:password])
        session[:user] = user.id
        redirect '/'
    else
        redirect '/login'
    end
end

get '/logout' do
    session[:user] = nil
    redirect '/login'
end

get '/calendar/:id' do
    @current_user = current_user
    @calendar = Calendar.find(params[:id])
    @colors = Tagcolor.all
    
    @tasks = Task.where(calendar_id: @calendar.id)
    
    erb :index
end

post '/calendar/new' do
    user = current_user
    
    calendar_name = params[:calendar_name]
    # カレンダーの名前入力されたことを確認
    if calendar_name && !calendar_name.empty?
    # すでに同じ名前のカレンダーが存在するか確認
    existing_calendar = Calendar.find_by(calendar_name: calendar_name)

        if existing_calendar
            # 既に同じカレンダー名が存在する場合は作成しない
            redirect '/calendar/new'
        else
            # 同じカレンダー名が存在しない場合、新しいカレンダーを作成
            calendar = Calendar.create(
                calendar_name: calendar_name,
                user_id: user.id,
                is_shared: true
            )
    
            redirect "calendar/#{calendar.id}"
        end
    else
        redirect '/calendar/new'
    end

end

post '/calendar/join' do
    cal_id = params[:calendar_id]
    
    calendar = Calendar.find_by(id: cal_id)
    if calendar && calendar.is_shared == true
        redirect "calendar/#{calendar.id}"
    else
        redirect '/calendar/join'
    end
end

post '/calendar/:id/delete' do
    calendar = Calendar.find_by(id: params[:caledar_id])
    calendar.destroy
    # redirect "/"ユーザーの個人カレンダーにリダイレクト
end

post '/calendar/:id/task/new' do
    calendar = Calendar.find(params[:id])
    
    start_datetime = DateTime.parse("#{params[:'start-date']} #{params[:'start-time']}")
    end_datetime = DateTime.parse("#{params[:'end-date']} #{params[:'end-time']}")
    
    task = Task.create(
        task_name: params[:task_name],
        calendar_id: calendar.id,
        start_time: start_datetime,
        end_time: end_datetime,
        tag_color_id: params[:tag_color_id]
        # area_id: params[:area_id]
        )
        
    if task.save
        redirect "/calendar/#{calendar.id}"
    else
        redirect "/calendar/#{calendar.id}/task/new"
    end
end


post '/calendar/:calendar_id/task/:task_id/edit' do
    calendar = Calendar.find(params[:calendar_id])
    task = Task.find(params[:task_id])
    
    task.update(
        task_name: params[:task_name],
        start_time: "#{params[:'start-date']} #{params[:'start-time']}",
        end_time: "#{params[:'end-date']} #{params[:'end-time']}",
        tag_color_id: params[:tag_color_id]
        )
    
    redirect "/calendar/#{calendar.id}"
end