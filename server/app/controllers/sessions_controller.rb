class SessionsController < ApplicationController
  def create
    # FIXME: only allow my id to login for now.
    # Google is supposed to do that for me but it doesn't quite work.
    if auth_hash.info.email == "philippe.44@gmail.com"
      reset_session_user(User.find_or_create_from_auth_hash(auth_hash))
    else
      sign_in_or_anon!
    end
    redirect_to ENVied.CLIENT_ORIGIN
  end

  def destroy
    clear_session
    redirect_to ENVied.CLIENT_ORIGIN
  end

  protected

  def auth_hash
    request.env['omniauth.auth']
  end
end
