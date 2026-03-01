class Product < ApplicationRecord
  belongs_to :category
  has_many :variants, dependent: :destroy

  has_rich_text :main_features
  has_rich_text :details

  has_many :specifications, dependent: :destroy
  accepts_nested_attributes_for :specifications, allow_destroy: true
  accepts_nested_attributes_for :variants, allow_destroy: true
end
