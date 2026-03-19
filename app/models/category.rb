class Category < ApplicationRecord
  belongs_to :parent, class_name: 'Category', optional: true
  has_many :children, class_name: 'Category', foreign_key: 'parent_id', dependent: :destroy
  has_many :products, dependent: :restrict_with_exception

  validates :name, presence: true, uniqueness: { scope: :parent_id }
  validates :level, presence: true, inclusion: { in: 1..10 }

  scope :roots, -> { where(parent_id: nil) }
  scope :by_level, ->(level) { where(level: level) }

  before_validation :set_level

  def root?
    parent_id.nil?
  end

  def leaf?
    children.empty?
  end

  def ancestors
    return [] if root?
    parent.ancestors + [parent]
  end

  def descendants
    children + children.flat_map(&:descendants)
  end

  def all_products
    Product.joins(:category).where(categories: { id: [id] + descendant_ids })
  end

  def set_level
    self.level = parent ? parent.level + 1 : 1
  end

  def descendant_ids
    descendants.pluck(:id)
  end
end
