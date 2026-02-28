class Product < ApplicationRecord
  belongs_to :category
  has_many :variants, dependent: :destroy
end
