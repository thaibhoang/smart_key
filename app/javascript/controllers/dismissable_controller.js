import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.timeout = setTimeout(() => {
      this.hide()
    }, 5000)
  }

  hide() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.element.classList.add("opacity-0", "translate-y-1")
    setTimeout(() => {
      this.element.remove()
    }, 150)
  }
}

