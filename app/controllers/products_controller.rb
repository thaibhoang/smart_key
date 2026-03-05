class ProductsController < ApplicationController
  def index
    # Load Product kèm theo Variants và Ảnh của từng Variant để tránh N+1 query
    @products = Product.includes(variants: { images_attachments: :blob }).all
    @categories = Category.all
    @products = @products.where("name LIKE ?", "%#{params[:search]}%") if params[:search].present?

    # Logic filter theo category
    @products = @products.where(category_id: params[:category]) if params[:category].present?

    # Logic sort
    case params[:sort]
    when 'price_asc'
      @products = @products.joins(:variants).order('variants.price ASC').distinct
    when 'price_desc'
      @products = @products.joins(:variants).order('variants.price DESC').distinct
    else
      @products = @products.order(created_at: :desc)
    end

    @pagy, @products = pagy(@products, items: 12)
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
