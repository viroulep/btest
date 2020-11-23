class User < ApplicationRecord
  has_many :answers, as: :userable, dependent: :destroy

  # FIXME: create some concern to factorize this
  # This restriction is here mainly to have a nicely displayed name
  # Only validate on update, in case the provider gives us something above that.
  validates_length_of :name, minimum: 1, maximum: 50, on: :update

  def identifiable_attrs
    {
      id: id,
      name: name,
      anonymous: anonymous?,
    }
  end

  def anonymous?
    false
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
