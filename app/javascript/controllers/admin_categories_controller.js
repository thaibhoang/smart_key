import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "modalOverlay", "modalTitle", "form", "categoryId", "parentId", 
    "nameInput", "parentSelect", "parentSelectField", "submitText"
  ]

  connect() {
    this.isEditing = false
  }

  openCreateModal(event) {
    this.isEditing = false
    const parentId = event.currentTarget.dataset.parentId || ""
    
    this.modalTitleTarget.textContent = "Thêm danh mục mới"
    this.submitTextTarget.textContent = "Thêm"
    this.categoryIdTarget.value = ""
    this.parentIdTarget.value = parentId
    this.nameInputTarget.value = ""
    
    if (parentId) {
      this.parentSelectFieldTarget.value = parentId
      this.parentSelectTarget.style.display = "none"
    } else {
      this.parentSelectTarget.style.display = "block"
    }
    
    this.showModal()
  }

  openEditModal(event) {
    this.isEditing = true
    const categoryId = event.currentTarget.dataset.categoryId
    const categoryName = event.currentTarget.dataset.categoryName
    const parentId = event.currentTarget.dataset.categoryParentId || ""
    
    this.modalTitleTarget.textContent = "Sửa danh mục"
    this.submitTextTarget.textContent = "Cập nhật"
    this.categoryIdTarget.value = categoryId
    this.parentIdTarget.value = parentId
    this.nameInputTarget.value = categoryName
    this.parentSelectFieldTarget.value = parentId
    this.parentSelectTarget.style.display = "block"
    
    this.showModal()
  }

  closeModal() {
    this.hideModal()
  }

  async submitForm(event) {
    event.preventDefault()
    
    const formData = new FormData(this.formTarget)
    const categoryData = {
      name: formData.get('name'),
      parent_id: formData.get('parent_id') || null
    }

    try {
      let response
      if (this.isEditing) {
        const categoryId = this.categoryIdTarget.value
        response = await fetch(`/admin/categories/${categoryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify({ category: categoryData })
        })
      } else {
        response = await fetch('/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify({ category: categoryData })
        })
      }

      if (response.ok) {
        this.hideModal()
        // Reload page to show updated categories
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert('Lỗi: ' + errorData.errors.join(', '))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Đã có lỗi xảy ra khi kết nối server.')
    }
  }

  async deleteCategory(event) {
    const categoryId = event.currentTarget.dataset.categoryId
    
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return
    }

    try {
      const response = await fetch(`/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      })

      if (response.ok) {
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert('Lỗi: ' + errorData.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Đã có lỗi xảy ra khi kết nối server.')
    }
  }

  toggleExpand(event) {
    const categoryItem = event.currentTarget.closest('.category-item')
    const childrenContainer = categoryItem.querySelector('.children-container')
    const toggleIcon = event.currentTarget.querySelector('svg')
    
    if (childrenContainer.classList.contains('hidden')) {
      childrenContainer.classList.remove('hidden')
      toggleIcon.style.transform = 'rotate(0deg)'
      categoryItem.classList.add('expanded')
    } else {
      childrenContainer.classList.add('hidden')
      toggleIcon.style.transform = 'rotate(-90deg)'
      categoryItem.classList.remove('expanded')
    }
  }

  showModal() {
    this.modalOverlayTarget.classList.remove("opacity-0", "invisible")
    this.modalOverlayTarget.classList.add("opacity-100", "visible")
    document.body.classList.add("overflow-hidden")
    
    // Focus on name input
    setTimeout(() => {
      this.nameInputTarget.focus()
    }, 100)
  }

  hideModal() {
    this.modalOverlayTarget.classList.add("opacity-0", "invisible")
    this.modalOverlayTarget.classList.remove("opacity-100", "visible")
    document.body.classList.remove("overflow-hidden")
  }
}