import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list", "template", "item", "destroyField"]

  add() {
    if (!this.hasTemplateTarget) return

    const content = this.templateTarget.innerHTML
    const newId = Date.now().toString()
    const html = content.replace(/NEW_RECORD/g, newId)

    const wrapper = document.createElement("tbody")
    wrapper.innerHTML = html.trim()
    const row = wrapper.firstElementChild

    this.listTarget.appendChild(row)
  }

  remove(event) {
    const button = event.currentTarget
    const row = button.closest("[data-variants-target='item']")
    if (!row) return

    const destroyField = row.querySelector("[data-variants-target='destroyField']")
    if (destroyField) {
      destroyField.value = "1"
    }

    row.classList.add("opacity-50")
    row.style.display = "none"
  }
}

