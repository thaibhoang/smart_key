class CreateVariants < ActiveRecord::Migration[7.1]
  def change
    create_table :variants do |t|
      t.references :product, null: false, foreign_key: true
      t.string :sku
      t.decimal :price, precision: 10, scale: 0, default: 0
      t.integer :stock
      t.string :color

      t.timestamps
    end
  end
end
