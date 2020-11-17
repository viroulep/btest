class User < ApplicationRecord
  has_one :deezer_user
  has_many :answers, as: :userable

  def anonymous?
    false
  end
end
