import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slot", "fileInput", "grid"]
  static values = {
    maxSlots: Number,
  }

  select(event) {
    const slot = event.currentTarget.closest("[data-variant-images-target='slot']")
    if (!slot) return

    const input = slot.querySelector("[data-variant-images-target='fileInput']")
    if (input) {
      input.click()
    }
  }

  changed(event) {
    const input = event.currentTarget
    const slot = input.closest("[data-variant-images-target='slot']")
    if (!slot || !input.files || input.files.length === 0) return

    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      this._renderPreview(slot, reader.result, input)
    }
    reader.readAsDataURL(file)
  }

  _renderPreview(slot, dataUrl, input) {
    // Xoá mọi child trừ input file hiện tại
    Array.from(slot.children).forEach((child) => {
      if (child !== input) {
        slot.removeChild(child)
      }
    })

    const img = document.createElement("img")
    img.src = dataUrl
    img.className = "h-full w-full object-cover"

    const hover = document.createElement("div")
    hover.className =
      "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"

    const icon = document.createElement("span")
    icon.className = "material-symbols-outlined text-[18px] text-white"
    icon.textContent = "edit"

    const label = document.createElement("span")
    label.className = "text-[11px] font-medium text-white"
    label.textContent = "Đổi ảnh"

    hover.appendChild(icon)
    hover.appendChild(label)

    slot.insertBefore(img, input)
    slot.insertBefore(hover, input)
  }
}

