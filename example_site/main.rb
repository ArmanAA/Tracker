require 'sinatra'
set :port, 80

get '/' do
  erb :index
end
get "/info" do
  erb :info
end
get "/aboutus" do
  erb :aboutus
end
get "/contactus" do
  erb :contactus
end