class ApplicationController < ActionController::API
  include ActionController::Cookies
  before_action :sign_in_or_anon!

  helper_method :current_user

  rescue_from ActiveRecord::RecordNotFound, with: -> {
    render status: 404, json: {
      message: "Object not found"
    }
  }

  def current_anonymous
    @current_anonymous ||= AnonymousUser.find_by(id: cookies.encrypted[:anonymous_user_id])
  end

  def current_user
    begin
      @current_user ||= User.find_by(id: cookies.encrypted[:user_id])
    rescue Exception => e
      nil
    end
    @current_user ? @current_user : current_anonymous
  end

  def clear_session
    cookies.delete(:anonymous_user_id)
    cookies.delete(:user_id)
  end

  def reset_session_user(user)
    clear_session
    cookies.encrypted[:user_id] = user.id
  end

  def sign_in_or_anon!
    return if current_user
    anon_user = AnonymousUser.create_one!
    cookies.encrypted[:anonymous_user_id] = anon_user.id
    current_anonymous
  end

  def check_not_anon!
    if current_user.anonymous?
      render status: 403, json: {
        message: "Can't access this page",
      }
    end
  end
end
