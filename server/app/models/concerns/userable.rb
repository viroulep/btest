# frozen_string_literal: true

module Userable
  extend ActiveSupport::Concern

  included do
    has_many :answers, as: :userable, dependent: :destroy
    has_many :games, -> { distinct }, through: :answers
    validates :name, length: { minimum: class_variable_get(:@@min_name_length), maximum: 50, on: :update }
    validates :locale, inclusion: { in: [nil, *I18n.available_locales.map(&:to_s)].freeze }

    def identifiable_attrs
      {
        id: id,
        name: name,
        anonymous: anonymous?,
      }
    end
  end
end
