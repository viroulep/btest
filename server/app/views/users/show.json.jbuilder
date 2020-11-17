json.id @user.id
json.name @user.name
json.anonymous @user.anonymous?
unless @user.anonymous?
  json.email "todo"
end
