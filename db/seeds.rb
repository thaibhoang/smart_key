# Bước 1: Dọn dẹp dữ liệu cũ (Cẩn thận: Lệnh này sẽ xóa sạch DB cũ mỗi khi chạy seed)
puts "Đang dọn dẹp dữ liệu cũ..."
Product.destroy_all
Category.destroy_all

# Bước 2: Tạo nested categories structure
puts "Đang tạo cấu trúc danh mục nhiều cấp..."

# Level 1 categories
giay = Category.create!(name: "GIÀY")
nam = Category.create!(name: "NAM")  
nu = Category.create!(name: "NỮ")
tre_em = Category.create!(name: "TRẺ EM")
the_thao = Category.create!(name: "THỂ THAO")
cac_nhan_hieu = Category.create!(name: "CÁC NHÃN HIỆU")
outlet = Category.create!(name: "OUTLET")

# Level 2 categories under GIÀY
originals = Category.create!(name: "Originals", parent: giay)
chay_bo = Category.create!(name: "Chạy bộ", parent: giay)
tap_luyen = Category.create!(name: "Tập luyện", parent: giay)
dep_dep_xo_ngan = Category.create!(name: "Dép & Dép xỏ ngón", parent: giay)
quan_vot = Category.create!(name: "Quần vợt", parent: giay)
sportswear = Category.create!(name: "Sportswear", parent: giay)
sneakers = Category.create!(name: "Sneakers", parent: giay)
golf = Category.create!(name: "Golf", parent: giay)
giay_sneaker_den = Category.create!(name: "Giày sneaker đen", parent: giay)
giay_must_have = Category.create!(name: "GIÀY \"MUST-HAVE\"", parent: giay)
bong_da = Category.create!(name: "Bóng đá", parent: giay)
ngoai_troi = Category.create!(name: "Ngoài Trời", parent: giay)
bong_ro = Category.create!(name: "Bóng rổ", parent: giay)
walking_shoes = Category.create!(name: "Walking Shoes", parent: giay)

# Level 2 categories under NAM
quan_ao_nam = Category.create!(name: "QUẦN ÁO", parent: nam)
phu_kien_nam = Category.create!(name: "PHỤ KIỆN", parent: nam)
the_thao_nam = Category.create!(name: "THỂ THAO", parent: nam)
sale_nam = Category.create!(name: "SALE", parent: nam)

# Level 3 categories under Originals
Category.create!(name: "Stan Smith", parent: originals)
Category.create!(name: "Superstar", parent: originals)
Category.create!(name: "Gazelle", parent: originals)

# Level 3 categories under QUẦN ÁO (NAM)
Category.create!(name: "Áo thun & croptop", parent: quan_ao_nam)
Category.create!(name: "Áo Nỉ", parent: quan_ao_nam)
Category.create!(name: "Áo ngực thể thao", parent: quan_ao_nam)
Category.create!(name: "Áo Jersey", parent: quan_ao_nam)
Category.create!(name: "Áo Hoodie", parent: quan_ao_nam)
Category.create!(name: "Áo khoác", parent: quan_ao_nam)
Category.create!(name: "Quần", parent: quan_ao_nam)
Category.create!(name: "Leggings", parent: quan_ao_nam)
Category.create!(name: "Quần short", parent: quan_ao_nam)
Category.create!(name: "Đầm", parent: quan_ao_nam)
Category.create!(name: "Chân váy", parent: quan_ao_nam)
Category.create!(name: "Sportswear", parent: quan_ao_nam)
Category.create!(name: "CƠ BẢN", parent: quan_ao_nam)
Category.create!(name: "Tracksuits", parent: quan_ao_nam)

# Level 3 categories under PHỤ KIỆN (NAM)
Category.create!(name: "Tất Cả Túi", parent: phu_kien_nam)
Category.create!(name: "Tất", parent: phu_kien_nam)
Category.create!(name: "Mũ lưỡi Trai & Đội đầu", parent: phu_kien_nam)
Category.create!(name: "Găng tay", parent: phu_kien_nam)

# Level 3 categories under THỂ THAO (NAM)
Category.create!(name: "Chạy", parent: the_thao_nam)
Category.create!(name: "Tập luyện", parent: the_thao_nam)
Category.create!(name: "Tập Yoga", parent: the_thao_nam)
Category.create!(name: "Golf", parent: the_thao_nam)
Category.create!(name: "Bóng rổ", parent: the_thao_nam)
Category.create!(name: "Quần vợt", parent: the_thao_nam)
Category.create!(name: "Pickleball", parent: the_thao_nam)
Category.create!(name: "Padel", parent: the_thao_nam)
Category.create!(name: "Cầu lông", parent: the_thao_nam)
Category.create!(name: "Trên sân", parent: the_thao_nam)

# Level 3 categories under SALE (NAM)
Category.create!(name: "Giày", parent: sale_nam)
Category.create!(name: "Quần Áo", parent: sale_nam)
Category.create!(name: "Phụ Kiện", parent: sale_nam)
Category.create!(name: "Last Sizes", parent: sale_nam)

categories = Category.all

# Bước 3: Tạo 10 Sản phẩm mẫu bằng vòng lặp
puts "Đang tạo 10 sản phẩm..."

20.times do |i|
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
    if File.exist?(image_path_1) # Kiểm tra file tồn tại
      8.times do |img_i|
        variant.images.attach(
          io: File.open(images_array.sample),
          filename: "v_#{v_index}_img_#{img_i}.jpg",
          content_type: "image/jpeg",
          metadata: { slot: img_i.to_s } # <--- Thêm dòng này để gán slot từ 0-7
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