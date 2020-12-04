# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    reset_session_user(User.find_or_create_from_auth_hash(auth_hash))
    redirect_to ENVied.CLIENT_ORIGIN
  end

  def destroy
    clear_session
    redirect_to ENVied.CLIENT_ORIGIN
  end

  protected

  def auth_hash
    request.env["omniauth.auth"]
  end
end
