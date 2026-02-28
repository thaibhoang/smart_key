# Bước 1: Tạo Category
c1 = Category.find_or_create_by!(name: "Khóa thông minh vân tay")
c2 = Category.find_or_create_by!(name: "Khóa thông minh thẻ từ")

# Bước 2: Tạo Product
p1 = Product.find_or_create_by!(name: "Smart Lock X1", category: c1) do |p|
  p.brand = "Samsung"
  p.description = "Khóa vân tay cao cấp chống nước."
end

p2 = Product.find_or_create_by!(name: "Smart Lock Y2", category: c2) do |p|
  p.brand = "Kaadas"
  p.description = "Khóa thẻ từ dành cho văn phòng."
end

# Bước 3: Tạo Variant và đính kèm ảnh
# Lưu ý: Chúng ta dùng phương thức .attach để Active Storage xử lý file
[p1, p2].each_with_index do |product, index|
  variant = Variant.find_or_create_by!(
    product: product, 
    sku: "SKU-#{product.name.parameterize}-#{index}",
    price: 5_000_000 + (index * 1_000_000)
  )

  # Chỉ đính kèm ảnh nếu chưa có (để tránh lặp ảnh khi chạy seed nhiều lần)
  unless variant.images.attached?
    image_path = Rails.root.join("app/assets/images/smart_key.jpg")
    
    if File.exist?(image_path)
      variant.images.attach(
        io: File.open(image_path),
        filename: "smart_key.jpg",
        content_type: "image/jpeg"
      )
      puts "Attached image to #{product.name} variant"
    else
      puts "Cảnh báo: Không tìm thấy file ảnh tại #{image_path}"
    end
  end
end

puts "Seed dữ liệu thành công!"
