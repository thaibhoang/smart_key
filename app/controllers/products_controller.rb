class ProductsController < ApplicationController
  def index
    # Load Product kèm theo Variants và Ảnh của từng Variant để tránh N+1 query
    @products = Product.includes(variants: { images_attachments: :blob }).all
  end

  def show
    @product = Product.find(params[:id])
    @variants = @product.variants.with_attached_images
  end
end