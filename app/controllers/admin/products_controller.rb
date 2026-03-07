class Admin::ProductsController < ApplicationController
  USERNAME = ENV.fetch("ADMIN_USERNAME", "admin_parama")
  PASSWORD = ENV.fetch("ADMIN_PASSWORD", "parama@123.456")

  http_basic_authenticate_with name: USERNAME, password: PASSWORD

  before_action :set_product, only: [:edit, :update, :destroy]
  before_action :set_categories, only: [:index, :new, :edit, :create, :update]

  def index
    @q = params[:q].to_s.strip
    @selected_category_id = params[:category_id].presence

    scope = Product.includes(:category, variants: { images_attachments: :blob })

    if @q.present?
      scope = scope.joins(:variants)
                   .where("products.name ILIKE :q OR variants.sku ILIKE :q", q: "%#{@q}%")
                   .distinct
    end

    if @selected_category_id
      scope = scope.where(category_id: @selected_category_id)
    end

    @pagy, @products = pagy(scope.order(created_at: :desc), limit:10)
  end

  def new
    @product = Product.new
    build_associations
  end

  def create
    @product = Product.new(admin_product_params)
    build_associations_if_empty

    if @product.save
      redirect_to edit_admin_product_path(@product), notice: "Đã tạo sản phẩm thành công."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    build_associations_if_empty
  end

  def update
    if @product.update(admin_product_params)
      attach_additional_variant_images
      redirect_to edit_admin_product_path(@product), notice: "Đã lưu sản phẩm."
    else
      build_associations_if_empty
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    redirect_to admin_products_path, notice: "Đã xoá sản phẩm."
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def set_categories
    @categories = Category.order(:name)
  end

  def build_associations
    @product.variants.build if @product.variants.empty?
    if @product.specifications.empty?
      @product.specifications.build(position: 0)
    end
  end

  def build_associations_if_empty
    build_associations
  end

  def attach_additional_variant_images
    variants_param = params.dig(:product, :variants_attributes)
    return unless variants_param

    variants_param.each_value do |attrs|
      variant_id = attrs[:id]
      images = attrs[:images]
      next if variant_id.blank? || images.blank?

      variant = @product.variants.find_by(id: variant_id)
      next unless variant

      Array(images).each do |upload|
        next if upload.blank?
        variant.images.attach(upload)
      end
    end
  end

  def admin_product_params
    permitted = params.require(:product).permit(
      :name,
      :brand,
      :category_id,
      :main_features,
      :details,
      variants_attributes: [:id, :sku, :price, :stock, :color, :_destroy, { images: [] }],
      specifications_attributes: [:id, :name, :content, :position, :_destroy]
    )

    # Với variant đã tồn tại (có id), không để mass-assignment thay toàn bộ images
    # mà sẽ xử lý append thủ công trong attach_additional_variant_images.
    if permitted[:variants_attributes]
      permitted[:variants_attributes].each do |_, v_attrs|
        v_attrs.delete(:images) if v_attrs[:id].present?
      end
    end

    permitted
  end
end

