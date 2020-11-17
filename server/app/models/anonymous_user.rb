class AnonymousUser < ApplicationRecord
  has_many :answers, as: :userable

  def anonymous?
    true
  end

  def self.create_one!
    create!(name: "anonymous_#{Random.new.rand(1000)}")
  end
end
