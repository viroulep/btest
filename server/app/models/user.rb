# frozen_string_literal: true

class User < ApplicationRecord
  @@min_name_length = 1 # rubocop:disable Style/ClassVars
  include Userable

  has_many :created_games, class_name: "Game", foreign_key: :created_by, inverse_of: :creator, dependent: :destroy

  def anonymous?
    false
  end

  def admin?
    admin
  end

  def self.find_or_create_from_auth_hash(auth_hash)
    User.find_or_create_by!(uid: auth_hash.uid, provider: auth_hash.provider) do |u|
      u.provided_name = auth_hash.info.name
      # Set the name if we're just creating the user
      u.name = auth_hash.info.name if u.new_record?
      # Technically this one is not always provided, but our providers' scopes
      # are configured to do so.
      u.provided_email = auth_hash.info.email
    end
  end
end
