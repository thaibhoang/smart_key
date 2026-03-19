class ProductsController < ApplicationController
  def index
    # 1. Khởi tạo query với includes để tránh N+1
    @products = Product.includes(variants: { images_attachments: :blob })
    @categories = Category.roots.includes(:children)
  
    # 2. Filter theo search và category
    @products = @products.where("LOWER(name) LIKE ?", "%#{params[:search].downcase}%") if params[:search].present?
    
    # Filter theo category (bao gồm cả subcategories)
    if params[:category].present?
      category = Category.find(params[:category])
      @products = @products.joins(:category).where(categories: { id: [category.id] + category.descendant_ids })
      @selected_category = category
      @breadcrumb = @selected_category.ancestors.reverse + [@selected_category]
    end
  
    # 3. Logic tính toán giá thực tế (Effective Price)
    # Nếu sale > 0 thì lấy sale, ngược lại lấy price
    effective_price_sql = "MIN(CASE WHEN variants.sale > 0 AND variants.sale IS NOT NULL 
                               THEN variants.sale 
                               ELSE variants.price 
                          END)"
  
    # 4. Logic sort
    case params[:sort]
    when 'price_asc'
      @products = @products.joins(:variants)
                           .group('products.id')
                           .order(Arel.sql("#{effective_price_sql} ASC"))
    when 'price_desc'
      @products = @products.joins(:variants)
                           .group('products.id')
                           .order(Arel.sql("#{effective_price_sql} DESC"))
    else
      @products = @products.order(created_at: :desc)
    end
  
    @pagy, @products = pagy(@products, limit: 8)
  end

  def show
    @product = Product.includes(variants: { images_attachments: :blob }, specifications: {}).find(params[:id])
    @categories = Category.roots.includes(:children)

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
    
    # Breadcrumb cho trang chi tiết sản phẩm
    @selected_category = @product.category
    @breadcrumb = @selected_category.ancestors.reverse + [@selected_category]
  end
end
