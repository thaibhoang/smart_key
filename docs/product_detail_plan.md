## Kế hoạch triển khai màn hình chi tiết sản phẩm (`products#show`)

### 1. Backend (`ProductsController#show` + model)

- Sửa method `show` trong `ProductsController`:
  - Loại bỏ `def show` lồng nhau.
  - Đảm bảo:
    - `@product = Product.includes(variants: { images_attachments: :blob }, specifications: {}).find(params[:id])`
    - `@selected_variant = params[:variant_id].present? ? @product.variants.find(params[:variant_id]) : @product.variants.first`
    - `@specifications = @product.specifications`
    - `@related_products = Product.where(category_id: @product.category_id).where.not(id: @product.id).limit(4)`

### 2. View `app/views/products/show.html.erb`

Giữ layout/visual theo `design/product_detail.html` nhưng thay toàn bộ nội dung tĩnh bằng data thật.

1. Header + container
   - Dùng `@product.name` (và/hoặc `@product.brand`) cho tiêu đề.

2. Khu vực ảnh lớn + dots
   - Lấy danh sách ảnh của `@selected_variant`:
     - `images = @selected_variant&.images || []`
     - Dùng variant `:standard` cho ảnh lớn.
   - Ảnh lớn:
     - Hiển thị ảnh đầu tiên trong danh sách (hoặc placeholder nếu không có).
     - Gắn các `data-*` để JS biết danh sách ảnh và index hiện tại.
   - Dots (tối đa 4 chấm):
     - Nếu số ảnh > 1 thì hiển thị tối đa 4 dot để điều hướng ảnh trước/sau tương đối với ảnh hiện tại.
     - Dot active có màu xanh, dot khác màu trắng/translucent.

3. Thumbnails bên dưới ảnh
   - Hiển thị toàn bộ ảnh dưới dạng thumbnail ngang scrollable.
   - Ảnh đang active có viền xanh.
   - Click vào thumbnail sẽ set current ảnh lớn tương ứng (qua JS).

4. Thông tin sản phẩm (collection, tên, giá)
   - Collection: lấy từ `@product.category.name` hoặc `@product.brand`.
   - Tên: `@product.name`.
   - Giá:
     - Lấy từ `@selected_variant.price`.
     - Vì chưa có giá giảm, hiển thị 2 mức giá giống nhau (hoặc bỏ giá gạch ngang nếu cần sau).

5. Bỏ rating
   - Xoá block rating (sao, số đánh giá) khỏi view.

6. Chọn variant
   - Dùng danh sách `@product.variants`.
   - Hiển thị mỗi variant là một button với label = `variant.color` (sau này đổi sang `variant.name` nếu đổi DB).
   - Variant đang chọn (`@selected_variant`) được highlight.
   - Click button link tới `product_path(@product, variant_id: variant.id)` để server render lại.

7. Rich text `main_features`
   - Thay block "Tính năng nổi bật" tĩnh bằng:
     - `<%= render @product.main_features %>` nếu có, giữ title và styling.

8. Rich text `details`
   - Thay phần "Mô tả chi tiết" tĩnh bằng:
     - `<%= render @product.details %>`.

9. Thông số kỹ thuật (specifications)
   - Dùng `@specifications` (đã order theo `position ASC, id ASC`).
   - Render dạng bảng 3 cột như design:
     - Cột 1: `spec.name`.
     - Cột 2–3: `spec.content`.
   - Xen kẽ nền dòng lẻ/chẵn theo index.

10. Sản phẩm liên quan
    - Dùng `@related_products`.
    - Mỗi card:
      - Ảnh: dùng ảnh đầu tiên của variant đầu tiên của product (nếu có), variant `:thumb`.
      - Tên: `product.name`.
      - Mô tả ngắn: `truncate(product.description, length: 60)` (hoặc trường khác nếu có).
      - Giá: lấy từ variant đầu tiên (`product.variants.first&.price`).
      - Link tới `product_path(product)`.
    - Nút "Xem tất cả" link tới `products_path`.

### 3. JavaScript gallery (ảnh chính, dots, thumbnails, swipe)

Có thể triển khai nhanh bằng script inline trong `show.html.erb` (hoặc Stimulus controller nếu project đã dùng).

- State:
  - `images`: array URLs (đọc từ `data-images` JSON trên container).
  - `currentIndex`: index của ảnh đang active.
- Hành vi:
  - Cập nhật UI khi đổi `currentIndex`:
    - Thay `src` ảnh chính.
    - Cập nhật class active cho thumbnails.
    - Cập nhật class active cho dots.
  - Click thumbnail:
    - Đọc `data-thumb-index`, set `currentIndex`.
  - Click dot:
    - Mỗi dot có `data-target-index`, set `currentIndex` trong khoảng `[0, images.length - 1]`.
  - Swipe trên mobile:
    - Lắng nghe `touchstart` / `touchend` trên container ảnh.
    - Nếu chênh lệch X > threshold thì chuyển ảnh trước/sau.

### 4. Kiểm thử

- Trường hợp nhiều ảnh (>= 10):
  - Đảm bảo dots vẫn chỉ 4 nhưng có thể điều hướng qua toàn bộ ảnh bằng dots/thumbnails/swipe.
- Trường hợp ít ảnh (0, 1, 2):
  - Fallback hợp lý (ẩn dots nếu 1 ảnh, placeholder nếu 0 ảnh).
- Trường hợp product không có variants:
  - Ẩn vùng chọn variant, gallery có thể fallback placeholder.
- Kiểm tra section sản phẩm liên quan:
  - Nếu không có sản phẩm liên quan thì ẩn section.

