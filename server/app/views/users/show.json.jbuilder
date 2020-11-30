# frozen_string_literal: true

json.id @user.id
json.name @user.name
json.anonymous @user.anonymous?
json.extract! @user, :provider, :provided_name, :provided_email unless @user.anonymous?
