class Variant < ApplicationRecord
  belongs_to :product
  
  has_many_attached :images do |attachable|
    attachable.variant :thumb, resize_to_fill: [96, 96]

    attachable.variant :standard, resize_to_limit: [800, 800]
  end
end
