require 'dotenv/load'
require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?

require './models/models.rb'
require 'json'
require 'bcrypt'
require 'httparty'

require 'cloudinary'
require 'cloudinary/uploader'
require 'cloudinary/utils'
require 'firebase_id_token'
require_relative './patch/firebase_patch'

FirebaseIdToken.configure do |config|
  config.project_ids = [ENV['FIREBASE_PROJECT_ID']]
#   config.redis = nil
end

enable :sessions

before do
    Dotenv.load
    Cloudinary.config do |config|
        config.cloud_name = ENV['CLOUD_NAME']
        config.api_key = ENV['CLOUDINARY_API_KEY']
        config.api_secret = ENV['CLOUDINARY_API_SECRET']
        config.secure = true
    end
end

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
    # file = params[:file][:tempfile]
    # filename = params[:file][:filename]
    
    # File.open("./public/user_images/#{filename}", "wb") do |f|
    #     f.write(file.read)
    # end
    
    # img_path = "user_images/#{filename}"
    img_url = nil
    
    if params[:upload_photo]
        tempfile = params[:upload_photo][:tempfile]
        upload = Cloudinary::Uploader.upload(tempfile.path)
        img_url = upload['url']
    end
    
    pw = params[:password]
    pwc = params[:password_confirmation]
    
    if pw == pwc
        user = User.create(
            username: params[:username],
            password: pw,
            password_confirmation: pwc,
            user_img: img_url,
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
  

post '/login/google' do
    begin
      request.body.rewind
      data = JSON.parse(request.body.read)
      puts "[DEBUG] idToken: #{data['idToken']}"
  
      id_token = data['idToken']
      payload = FirebaseIdToken::Signature.verify(id_token)
      puts "[DEBUG] Firebase payload: #{payload.inspect}"
  
      email = payload['email']
      user = User.find_by(email: email)
      puts "[DEBUG] User found: #{user.inspect}"
  
      unless user
        user = User.create(
          username: payload['name'],
          email: payload['email'],
          password: SecureRandom.hex(10),
          user_img: payload['picture'],
          area_id: Area.first&.id || 1
        )
        puts "[DEBUG] User created: #{user.inspect}"
  
        calendar = Calendar.create(
          calendar_name: user.username,
          user_id: user.id,
          is_shared: false
        )
  
        UserCalendar.create(
          user_id: user.id,
          calendar_id: calendar.id
        )
      end
  
      session[:user] = user.id
      status 200
      body "ログイン成功"
    
    rescue => e
      puts "[ERROR] #{e.class}: #{e.message}"
      puts e.backtrace.join("\n")
      halt 500, "Internal Server Error"
    end
end
  
get '/logout' do
    session[:user] = nil
    redirect '/login'
end

get '/calendar/:id' do
    @current_user = current_user
    @user_calendars = UserCalendar.where(user_id: @current_user.id)
    @calendar = Calendar.find(params[:id])
    @colors = Tagcolor.all
    @tasks = Task.where(calendar_id: @calendar.id)
    
    @tag_colors = @colors.map { |c| [c.id, c.color_code] }.to_h
    
    # ユーザーの住んでいる都道府県
    prefecture_id = @current_user.area_id 
    # そのIDをもとに都道府県のレコードを呼び出し、都道府県名をprefectureに入れる
    prefecture_record = Area.find_by(id: prefecture_id)
    prefecture = prefecture_record.area_name
    
    query = { q: prefecture, appid: "5553ec910818588b1fbca3e0a14cd70e", units: 'metric', lang: 'ja' }
    response = HTTParty.get('https://api.openweathermap.org/data/2.5/forecast', query: query)
    
    weather_data = JSON.parse(response.body)
    
    # 日ごとの天気情報を抽出
    @daily_weather = weather_data['list'].each_with_object({}) do |forecast, acc|
        date = forecast['dt_txt'].split(' ')[0]
        acc[date] ||= forecast['weather'][0]['icon'] # 一日の最初の天気アイコンを格納
    end
    
    erb :index
end

get '/new' do
    erb :calendar_new
end

post '/new' do
    user = current_user
    
    calendar_name = params[:calendar_name]
    if calendar_name && !calendar_name.empty?
        existing_calendar = Calendar.find_by(calendar_name: calendar_name)

        if existing_calendar
            redirect '/new'
        else
            calendar = Calendar.create(
                calendar_name: calendar_name,
                user_id: user.id,
                is_shared: true
            )
            UserCalendar.create(
                user_id: user.id,
                calendar_id: calendar.id
            )
            redirect "calendar/#{calendar.id}"
        end
    else
        redirect '/new'
    end
end

get '/join' do
    erb :calendar_join
end

post '/join' do
    cal_id = params[:calendar_id]
    
    calendar = Calendar.find_by(id: cal_id)
    if calendar && calendar.is_shared == true
        user_calendars = UserCalendar.new(
            user_id: current_user.id,
            calendar_id: cal_id
        )
        if user_calendars.save
            redirect "calendar/#{calendar.id}"
        else
            redirect '/join'
        end
    else
        redirect '/join'
    end
end

post '/calendar/:id/delete' do
    calendar = Calendar.find_by(id: params[:id])
    if calendar.user_id != current_user.id
        user_calendars = UserCalendar.find_by(calendar_id: calendar.id)
        user_calendars.destroy
        my_calendar = Calendar.find_by(user_id: current_user.id)
        redirect "/calendar/#{my_calendar.id}"
    else
        calendar.destroy
        redirect "/calendar"
    end
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

get '/calendar/:calendar_id/task/:task_id/edit' do
    calendar = Calendar.find(params[:calendar_id])
    task = Task.find(params[:task_id])
    
    content_type :json
    task.to_json
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

get '/calendar/:calendar_id/task/:task_id/delete' do
    calendar = Calendar.find(params[:calendar_id])
    task = Task.find(params[:task_id])

    task.destroy

    redirect "/calendar/#{calendar.id}"
end