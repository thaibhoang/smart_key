# Bước 1: Dọn dẹp dữ liệu cũ (Cẩn thận: Lệnh này sẽ xóa sạch DB cũ mỗi khi chạy seed)
puts "Đang dọn dẹp dữ liệu cũ..."
Product.destroy_all
Category.destroy_all

# Bước 2: Tạo Categories
categories = [
  Category.find_or_create_by!(name: "Khóa vân tay"),
  Category.find_or_create_by!(name: "Khóa thẻ từ"),
  Category.find_or_create_by!(name: "Khóa mã số")
]

# Bước 3: Tạo 10 Sản phẩm mẫu bằng vòng lặp
puts "Đang tạo 10 sản phẩm..."

10.times do |i|
  category = categories.sample # Lấy ngẫu nhiên 1 category
  brand = ["Samsung", "Kaadas", "Xiaomi", "Yale"].sample
  
  product = Product.create!(
    name: "Smart Lock Model #{i + 1}",
    brand: brand,
    category: category,
    # Action Text xử lý description
    description: "Đây là mô tả ngắn cho sản phẩm thứ #{i + 1}. Khóa thông minh bảo mật cao."
  )

  image_path_1 = Rails.root.join("app/assets/images/smart_key.jpg")
  image_path_2 = Rails.root.join("app/assets/images/key_2.jpg")
  images_array = [image_path_1, image_path_2]    
  2.times do |v_index|
    variant = product.variants.create!(
      sku: "SKU-#{product.id}-V#{v_index}",
      price: rand(5_000_000..10_000_000),
      color: v_index == 0 ? "Đen Tuyển" : "Vàng Đồng"
    )

    # Đính kèm 8 ảnh cho mỗi variant
    if File.exist?(image_path_2)
      8.times do |img_i|
        variant.images.attach(
          io: File.open(images_array.sample),
          filename: "v_#{v_index}_img_#{img_i}.jpg",
          content_type: "image/jpeg"
        )
      end
    end
  end

  # Gán Rich Text cho Main Features (Dạng List)
  product.update!(
    main_features: "<ul>
      <li>Mở khóa trong 0.#{rand(1..9)}s</li>
      <li>Pin dùng được #{rand(6..12)} tháng</li>
      <li>Chất liệu hợp kim nhôm siêu bền</li>
    </ul>"
  )

  # Gán Rich Text cho Details (Dạng đoạn văn + ảnh mẫu)
  product.update!(
    details: "<h3>Công nghệ dẫn đầu</h3>
      <p>Sản phẩm #{product.name} tích hợp cảm biến FPC từ Thụy Điển...</p>
      <p>Bảo mật 2 lớp cực kỳ an toàn cho gia đình bạn.</p>"
  )

  # Bước 4: Tạo Specifications (Bảng con - Key/Value)
  # Chúng ta tạo các thông số cố định cho mỗi sản phẩm
  specs_data = [
    { name: "Kích thước", content: "#{rand(300..400)}x#{rand(70..90)}mm", position: 1 },
    { name: "Trọng lượng", content: "#{rand(3..6)}kg", position: 2 },
    { name: "Nguồn điện", content: "4 Pin AA", position: 3 },
    { name: "Màu sắc", content: ["Đen", "Đồng", "Bạc"].sample, position: 4 }
  ]

  specs_data.each do |spec|
    product.specifications.create!(spec)
  end
end

puts "Đã tạo thành công 10 sản phẩm kèm thông số và ảnh!"