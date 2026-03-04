class Admin::ProductsController < ApplicationController
  USERNAME = ENV.fetch("ADMIN_USERNAME", "admin_zatos")
  PASSWORD = ENV.fetch("ADMIN_PASSWORD", "zatos@123.456")

  http_basic_authenticate_with name: USERNAME, password: PASSWORD

  def index
    @categories = Category.order(:name)
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
end

