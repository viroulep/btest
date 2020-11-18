class User < ApplicationRecord
  has_one :deezer_user
  has_many :answers, as: :userable

  # FIXME: create some concern to factorize this
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
end
