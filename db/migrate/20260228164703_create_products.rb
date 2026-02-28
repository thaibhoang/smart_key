class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products do |t|
      t.references :category, null: false, foreign_key: true
      t.string :name
      t.string :brand
      t.text :description
      t.jsonb :metadata

      t.timestamps
    end
  end
end
