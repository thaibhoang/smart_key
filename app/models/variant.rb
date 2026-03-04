class Variant < ApplicationRecord
  belongs_to :product
  
  has_many_attached :images do |attachable|
    attachable.variant :thumb, resize_to_fill: [96, 96]

    attachable.variant :standard, resize_to_limit: [800, 800]
  end

  validates :sku, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
end
