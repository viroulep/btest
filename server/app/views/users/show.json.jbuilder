json.id @user.id
json.name @user.name
json.anonymous @user.anonymous?
unless @user.anonymous?
  json.extract! @user, :provider, :provided_name, :provided_email
end
