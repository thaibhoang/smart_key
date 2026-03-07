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

  touchStart(event) {
    // Lấy tọa độ bắt đầu
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY; // Lưu thêm Y để tránh nhầm với cuộn trang
    this.isSwiping = true;
  }
  
  touchMove(event) {
    if (!this.isSwiping) return;
    // Cập nhật tọa độ khi đang di chuyển
    this.touchEndX = event.touches[0].clientX;
  }
  
  touchEnd(event) {
    if (!this.isSwiping) return;
  
    // QUAN TRỌNG: Dùng changedTouches thay vì touches
    this.touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
  
    const threshold = 50; // Khoảng cách tối thiểu để tính là vuốt
    const xDistance = this.touchEndX - this.touchStartX;
    const yDistance = Math.abs(touchEndY - this.touchStartY);
  
    // Chỉ chuyển ảnh nếu vuốt ngang mạnh hơn vuốt dọc (tránh nhảy ảnh khi đang cuộn trang)
    if (Math.abs(xDistance) > threshold && Math.abs(xDistance) > yDistance) {
      if (xDistance < 0) {
        this.next();
      } else {
        this.previous();
      }
    }
  
    // Reset
    this.isSwiping = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
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
      t.classList.toggle('border-primary', isActive);
      t.classList.toggle('ring-1', isActive);
      t.classList.toggle('ring-primary', isActive);
      t.classList.toggle('opacity-100', isActive);
      t.classList.toggle('border-transparent', !isActive);
      
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
          dot.className = "h-2 w-4 bg-primary rounded-full shadow-sm transition-all duration-300"
        } else {
          dot.className = "h-2 w-2 bg-gray-200 rounded-full shadow-sm transition-all duration-300"
        }
        
        dot.dataset.targetIndex = imageIndex
      } else {
        // Chỉ những dot thừa (ngoài phạm vi ảnh) mới bị ẩn
        dot.className = "hidden"
      }
    })
  }
}