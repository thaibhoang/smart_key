class Api::CategoriesController < ApplicationController
  def children
    category = Category.find(params[:id])
    children = category.children.map do |child|
      {
        id: child.id,
        name: child.name,
        level: child.level,
        has_children: child.children.any?
      }
    end
    
    render json: children
  end
end