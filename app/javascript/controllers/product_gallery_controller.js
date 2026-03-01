import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["mainImage", "thumbnail", "price"]

  connect() {
    this.refreshImageList()
    this.currentIndex = 0
    
    // Khởi tạo biến cho tính năng Swipe
    this.touchStartX = 0
    this.touchEndX = 0
  }

  // Cập nhật danh sách ảnh hiện có
  refreshImageList() {
    this.images = Array.from(this.thumbnailTargets).map(t => t.dataset.url)
  }

  // Click vào thumbnail
  selectImage(event) {
    const url = event.currentTarget.dataset.url
    this.currentIndex = this.images.indexOf(url)
    this._updateDisplay()
  }

  // Nút Next
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length
    this._updateDisplay()
  }

  // Nút Previous
  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    this._updateDisplay()
  }

  // --- LOGIC CHO SWIPE TRÊN MOBILE ---
  
  touchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX
  }

  touchEnd(event) {
    this.touchEndX = event.changedTouches[0].screenX
    this._handleGesture()
  }

  _handleGesture() {
    const threshold = 50 // Khoảng cách tối thiểu để tính là một cú vuốt
    if (this.touchEndX < this.touchStartX - threshold) {
      // Vuốt sang trái -> Xem ảnh tiếp theo
      this.next()
    }
    if (this.touchEndX > this.touchStartX + threshold) {
      // Vuốt sang phải -> Xem ảnh trước đó
      this.previous()
    }
  }

  // --- THAY ĐỔI VARIANT ---

  switchVariant(event) {
    const newImages = JSON.parse(event.currentTarget.dataset.images)
    this.priceTarget.innerText = event.currentTarget.dataset.price

    // Cập nhật lại toàn bộ thumbnail trong DOM (cả PC và Mobile)
    const containers = document.querySelectorAll('[data-product-gallery-target="variantGallery"]')
    containers.forEach(container => {
      container.innerHTML = newImages.map((url, index) => `
        <div class="flex-shrink-0 w-20 h-20 lg:w-full aspect-square rounded border-2 ${index === 0 ? 'border-blue-600' : 'border-transparent'} cursor-pointer overflow-hidden bg-gray-50"
             data-product-gallery-target="thumbnail"
             data-action="click->product-gallery#selectImage"
             data-url="${url}">
          <img src="${url}" class="w-full h-full object-contain p-1">
        </div>
      `).join('')
    })

    this.refreshImageList()
    this.currentIndex = 0
    this._updateDisplay()
  }

  _updateDisplay() {
    const currentUrl = this.images[this.currentIndex]
    
    // 1. Cập nhật ảnh chính
    if (this.hasMainImageTarget) {
      this.mainImageTarget.src = currentUrl
    }
  
    // 2. Cập nhật Highlight cho TẤT CẢ thumbnail (Cả bản PC và Mobile)
    this.thumbnailTargets.forEach((t) => {
      // Kiểm tra xem thumbnail này có trùng URL với ảnh đang hiển thị không
      if (t.dataset.url === currentUrl) {
        // TRẠNG THÁI ACTIVE
        t.classList.add('border-blue-600', 'ring-1', 'ring-blue-600', 'opacity-100')
        t.classList.remove('border-transparent', 'opacity-60')
        
        // Chỉ cuộn thumbnail vào vùng nhìn thấy nếu nó đang hiển thị (không bị hidden)
        if (t.offsetWidth > 0 || t.offsetHeight > 0) {
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
      } else {
        // TRẠNG THÁI ĐỢI
        t.classList.remove('border-blue-600', 'ring-1', 'ring-blue-600', 'opacity-100')
        t.classList.add('border-transparent', 'opacity-60') // Để hơi mờ nhẹ để phân biệt, hoặc xóa opacity-60 nếu muốn rõ 100%
      }
    })
  }
}