# frozen_string_literal: true

json.extract! @user, :id, :name
json.anonymous @user.anonymous?
json.admin @user.admin?
json.locale @user.locale || I18n.default_locale
json.extract! @user, :provider, :provided_name, :provided_email unless @user.anonymous?
