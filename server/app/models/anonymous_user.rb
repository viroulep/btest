# frozen_string_literal: true

class AnonymousUser < ApplicationRecord
  ANONYMOUS_PREFIX = "anonymous_"
  @@min_name_length = ANONYMOUS_PREFIX.length + 1 # rubocop:disable Style/ClassVars
  include Userable

  validate :name_is_correct
  def name_is_correct
    errors.add(:name, "must start with '#{ANONYMOUS_PREFIX}'") unless name.start_with?(ANONYMOUS_PREFIX)
  end

  def created_games
    Game.none
  end

  def anonymous?
    true
  end

  def admin?
    false
  end

  def self.create_one!
    create!(name: "#{ANONYMOUS_PREFIX}#{Random.new.rand(1000)}")
  end
end
