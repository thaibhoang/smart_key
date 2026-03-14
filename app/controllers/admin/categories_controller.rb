# app/controllers/admin/categories_controller.rb
class Admin::CategoriesController < ApplicationController
  USERNAME = ENV.fetch("ADMIN_USERNAME", "admin_parama")
  PASSWORD = ENV.fetch("ADMIN_PASSWORD", "parama@123.456")

  http_basic_authenticate_with name: USERNAME, password: PASSWORD

    def create
        @category = Category.new(category_params)

        if @category.save
        # Trả về JSON để Stimulus xử lý
        render json: { id: @category.id, name: @category.name }, status: :created
        else
        render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def category_params
        params.require(:category).permit(:name)
    end
end
