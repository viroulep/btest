json.array! @users do |u|
  json.id u.id
  json.deezer_id u.deezer_user&.id
end
