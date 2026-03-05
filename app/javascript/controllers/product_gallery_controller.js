import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["mainImage", "thumbnail", "price", "dot", "variantGallery"]

  connect() {
    this.refreshImageList()
    this.currentIndex = 0
    
    this.touchStartX = 0
    this.touchEndX = 0

    // Đảm bảo ảnh đầu tiên được highlight
    this._updateDisplay()
  }

  refreshImageList() {
    // Lấy URL từ thuộc tính data-url của các thẻ thumbnail targets
    this.images = this.thumbnailTargets.map(t => t.dataset.url).filter(url => url !== undefined)
    console.log("Tổng số ảnh lấy được:", this.images.length)
  }

  selectImage(event) {
    const url = event.currentTarget.dataset.url
    this.currentIndex = this.images.indexOf(url)
    this._updateDisplay()
  }

  goToDot(event) {
    const targetIndex = parseInt(event.currentTarget.dataset.targetIndex)
    if (!isNaN(targetIndex)) {
      this.currentIndex = targetIndex
      this._updateDisplay()
    }
  }

  next() {
    if (this.images.length <= 1) return
    this.currentIndex = (this.currentIndex + 1) % this.images.length
    this._updateDisplay()
  }

  previous() {
    if (this.images.length <= 1) return
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    this._updateDisplay()
  }

  // --- SWIPE LOGIC ---
  touchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX
  }

  touchEnd(event) {
    this.touchEndX = event.changedTouches[0].screenX
    const threshold = 50
    if (this.touchEndX < this.touchStartX - threshold) this.next()
    if (this.touchEndX > this.touchStartX + threshold) this.previous()
  }

  _updateDisplay() {
    if (!this.images || this.images.length === 0) {
      // Nếu chưa có list ảnh, thử lấy lại lần nữa
      this.refreshImageList();
    }
    
    if (this.images.length === 0) return;
  
    const currentUrl = this.images[this.currentIndex];
    
    // 1. Cập nhật ảnh chính
    if (this.hasMainImageTarget && currentUrl) {
      this.mainImageTarget.src = currentUrl;
    }
  
    // 2. Cập nhật Thumbnails (giữ nguyên logic của bạn)
    this.thumbnailTargets.forEach((t) => {
      const isActive = t.dataset.url === currentUrl;
      t.classList.toggle('border-blue-600', isActive);
      t.classList.toggle('ring-1', isActive);
      t.classList.toggle('ring-blue-600', isActive);
      t.classList.toggle('opacity-100', isActive);
      t.classList.toggle('border-transparent', !isActive);
      t.classList.toggle('opacity-60', !isActive);
      
      if (isActive) {
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  
    // 3. Quan trọng: Luôn gọi render dots ở đây
    this._renderDots();
  }

  _renderDots() {
    const total = this.images.length
    const current = this.currentIndex
  
    // Tính toán cửa sổ 5 dot
    let start = current - 2
    if (start < 0) start = 0
    if (start + 5 > total) start = Math.max(0, total - 5)
  
    this.dotTargets.forEach((dot, i) => {
      const imageIndex = start + i
  
      if (imageIndex < total) {
        // Gán lại toàn bộ class dựa trên trạng thái active/inactive
        // Cách này sẽ xóa sạch class "hidden" cũ nếu có
        if (imageIndex === current) {
          dot.className = "h-2 w-4 bg-blue-600 rounded-full shadow-sm transition-all duration-300"
        } else {
          dot.className = "h-2 w-2 bg-white/60 rounded-full shadow-sm transition-all duration-300"
        }
        
        dot.dataset.targetIndex = imageIndex
      } else {
        // Chỉ những dot thừa (ngoài phạm vi ảnh) mới bị ẩn
        dot.className = "hidden"
      }
    })
  }
}