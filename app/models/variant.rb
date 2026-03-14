class Variant < ApplicationRecord
  belongs_to :product
  
  has_many_attached :images do |attachable|
    attachable.variant :thumb, resize_to_fill: [96, 96]

    attachable.variant :standard, 
      resize_to_limit: [1500, 1500], 
      format: :webp, 
      saver: { 
        quality: 88,          # Độ nén tối ưu (85 là mức "vàng" cho WebP)
        subsample_mode: "on", # Giữ chi tiết sắc cạnh, cực kỳ quan trọng cho đồ kim khí
        strip: true           # Loại bỏ metadata để file nhẹ nhất có thể
      }
  end

  validates :sku, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true


  # app/models/variant.rb
  def effective_price
    (sale.to_f > 0 && sale < price) ? sale : price
  end

  # Trong file app/models/variant.rb (hoặc xử lý trực tiếp ở View)
  def main_image
    return nil unless images.attached?
    
    # Sắp xếp các attachment theo slot tăng dần và lấy cái đầu tiên
    images.attachments.min_by { |a| a.metadata[:slot].to_i }
  end

  def sorted_images
    return [] unless images.attached?
    
    # Lấy danh sách ảnh đã sắp xếp theo thứ tự slot để hiện gallery
    images.attachments.sort_by { |a| a.metadata[:slot].to_i }
  end
end
