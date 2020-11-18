class AnonymousUser < ApplicationRecord
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
    true
  end

  def self.create_one!
    create!(name: "anonymous_#{Random.new.rand(1000)}")
  end
end
