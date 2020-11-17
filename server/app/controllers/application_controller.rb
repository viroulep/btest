class ApplicationController < ActionController::API
  before_action :sign_in_or_anon!

  helper_method :current_user

  rescue_from ActiveRecord::RecordNotFound, with: -> {
    render status: 404, json: {
      message: "Object not found"
    }
  }

  def current_anonymous
    @current_anonymous ||= AnonymousUser.find(session[:anonymous_user_id]) if session[:anonymous_user_id]
  end

  def current_user
    begin
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    rescue Exception => e
      nil
    end
    @current_user ? @current_user : current_anonymous
  end

  def sign_in_or_anon!
    return if current_user
    anon_user = AnonymousUser.create_one!
    session[:anonymous_user_id] = anon_user.id
    current_anonymous
  end
end
