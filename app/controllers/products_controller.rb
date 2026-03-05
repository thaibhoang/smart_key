class ProductsController < ApplicationController
  def index
    # Load Product kèm theo Variants và Ảnh của từng Variant để tránh N+1 query
    @products = Product.includes(variants: { images_attachments: :blob }).all
  end

  def show
    @product = Product.includes(variants: { images_attachments: :blob }, specifications: {}).find(params[:id])

    # Lấy variant đầu tiên làm mặc định hoặc theo params
    @selected_variant =
      if params[:variant_id].present?
        @product.variants.find_by(id: params[:variant_id]) || @product.variants.first
      else
        @product.variants.first
      end

    @specifications = @product.specifications

    @related_products = Product.where(category_id: @product.category_id)
                               .where.not(id: @product.id)
                               .limit(4)
  end
end
