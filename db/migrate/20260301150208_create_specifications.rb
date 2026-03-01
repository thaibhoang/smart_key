class CreateSpecifications < ActiveRecord::Migration[7.1]
  def change
    create_table :specifications do |t|
      t.references :product, null: false, foreign_key: true
      t.string :name
      t.text :content
      t.integer :position, default: 0

      t.timestamps
    end
  end
end
