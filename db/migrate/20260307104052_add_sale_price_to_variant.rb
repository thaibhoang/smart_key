class AddSalePriceToVariant < ActiveRecord::Migration[7.1]
  def change
    add_column :variants, :sale, :decimal, precision: 10, scale: 0, default: 0
  end
end
