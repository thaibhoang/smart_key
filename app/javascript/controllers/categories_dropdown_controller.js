import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item", "dropdown"]

  connect() {
    this.setupHoverEvents()
  }

  setupHoverEvents() {
    this.itemTargets.forEach((item, index) => {
      const dropdown = this.dropdownTargets[index]
      if (!dropdown) return

      let hoverTimeout

      item.addEventListener("mouseenter", () => {
        clearTimeout(hoverTimeout)
        this.hideAllDropdowns()
        dropdown.classList.remove("opacity-0", "invisible")
        dropdown.classList.add("opacity-100", "visible")
      })

      item.addEventListener("mouseleave", () => {
        hoverTimeout = setTimeout(() => {
          dropdown.classList.add("opacity-0", "invisible")
          dropdown.classList.remove("opacity-100", "visible")
        }, 150)
      })

      dropdown.addEventListener("mouseenter", () => {
        clearTimeout(hoverTimeout)
      })

      dropdown.addEventListener("mouseleave", () => {
        dropdown.classList.add("opacity-0", "invisible")
        dropdown.classList.remove("opacity-100", "visible")
      })
    })
  }

  hideAllDropdowns() {
    this.dropdownTargets.forEach(dropdown => {
      dropdown.classList.add("opacity-0", "invisible")
      dropdown.classList.remove("opacity-100", "visible")
    })
  }
}