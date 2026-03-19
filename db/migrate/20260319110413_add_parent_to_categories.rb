class AddParentToCategories < ActiveRecord::Migration[7.1]
  def change
    add_reference :categories, :parent, null: true, foreign_key: { to_table: :categories }
    add_column :categories, :level, :integer, default: 1
    add_index :categories, [:parent_id, :level]
  end
end
