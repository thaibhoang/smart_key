class Product < ApplicationRecord
  belongs_to :category
  has_many :variants, -> { order(id: :asc) }, dependent: :destroy

  has_rich_text :main_features
  has_rich_text :details

  has_many :specifications, -> { order(position: :asc, id: :asc) }, dependent: :destroy
  accepts_nested_attributes_for :specifications, allow_destroy: true
  accepts_nested_attributes_for :variants, allow_destroy: true

  # app/models/product.rb
  def cheapest_variant
    # Tính toán trên tập hợp đã được eager load (không gây N+1)
    variants.min_by(&:effective_price)
  end
end
