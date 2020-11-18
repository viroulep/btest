module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_user_session
    end

    private def find_user_session
      user = User.find_by(id: cookies.encrypted[:user_id])
      unless user
        user = AnonymousUser.find_by(id: cookies.encrypted[:anonymous_user_id])
      end
      unless user
        reject_unauthorized_connection
      end
      user
    end
  end
end
