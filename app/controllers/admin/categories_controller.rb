# app/controllers/admin/categories_controller.rb
class Admin::CategoriesController < ApplicationController
  USERNAME = ENV.fetch("ADMIN_USERNAME", "admin_prama")
  PASSWORD = ENV.fetch("ADMIN_PASSWORD", "prama@123.456")

  http_basic_authenticate_with name: USERNAME, password: PASSWORD

  def index
    @categories = Category.roots.includes(:children)
  end

  def create
    @category = Category.new(category_params)
    
    if @category.save
      render json: { 
        id: @category.id, 
        name: @category.name, 
        parent_id: @category.parent_id,
        level: @category.level 
      }, status: :created
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @category = Category.find(params[:id])
    
    if @category.update(category_params)
      render json: { id: @category.id, name: @category.name }
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @category = Category.find(params[:id])
    
    if @category.products.any? || @category.children.any?
      render json: { error: "Không thể xóa danh mục có sản phẩm hoặc danh mục con" }, status: :unprocessable_entity
    else
      @category.destroy
      render json: { success: true }
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :parent_id)
  end
end
