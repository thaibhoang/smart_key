import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "input", "select"]

  open() {
    this.modalTarget.classList.remove("hidden")
    this.inputTarget.focus()
  }

  close() {
    this.modalTarget.classList.add("hidden")
    this.inputTarget.value = ""
  }

  async submit() {
    const name = this.inputTarget.value
    if (!name) return alert("Vui lòng nhập tên danh mục")

    try {
      const response = await fetch("/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ category: { name: name } })
      })

      if (response.ok) {
        const data = await response.json()
        
        // 1. Thêm option mới vào select
        const option = new Option(data.name, data.id, true, true)
        this.selectTarget.add(option)
        
        // 2. Đóng modal
        this.close()
      } else {
        const errorData = await response.json()
        alert("Lỗi: " + errorData.errors.join(", "))
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Đã có lỗi xảy ra khi kết nối server.")
    }
  }
}
