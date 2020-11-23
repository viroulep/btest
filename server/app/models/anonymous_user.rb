class AnonymousUser < ApplicationRecord
  ANONYMOUS_PREFIX = "anonymous_"
  has_many :answers, as: :userable, dependent: :destroy

  validate :name_is_correct
  def name_is_correct
    errors.add(:name, "must start with '#{ANONYMOUS_PREFIX}'") unless name.start_with?(ANONYMOUS_PREFIX)
  end

  # FIXME: create some concern to factorize this
  # This restriction is here mainly to have a nicely displayed name
  # Only validate on update, in case the provider gives us something above that.
  validates_length_of :name,
    minimum: (ANONYMOUS_PREFIX.length + 1),
    maximum: 50, on: :update

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
    create!(name: "#{ANONYMOUS_PREFIX}#{Random.new.rand(1000)}")
  end
end
