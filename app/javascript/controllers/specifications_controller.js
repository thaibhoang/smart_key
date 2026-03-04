import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list", "template", "item", "positionField", "destroyField"]

  connect() {
    this.draggedElement = null
    this.updatePositions()
  }

  add() {
    if (!this.hasTemplateTarget) return

    const content = this.templateTarget.innerHTML
    const newId = Date.now().toString()
    const html = content.replace(/NEW_RECORD/g, newId)

    const wrapper = document.createElement("div")
    wrapper.innerHTML = html.trim()
    const element = wrapper.firstElementChild

    this.listTarget.appendChild(element)
    this.updatePositions()
  }

  remove(event) {
    const button = event.currentTarget
    const item = button.closest("[data-specifications-target='item']")
    if (!item) return

    const destroyField = item.querySelector("[data-specifications-target='destroyField']")
    if (destroyField) {
      destroyField.value = "1"
    }

    item.classList.add("opacity-50")
    item.style.display = "none"
    this.updatePositions()
  }

  dragStart(event) {
    this.draggedElement = event.currentTarget
    event.dataTransfer.effectAllowed = "move"
  }

  dragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"

    const target = event.currentTarget
    if (!this.draggedElement || this.draggedElement === target) return

    const bounding = target.getBoundingClientRect()
    const offset = event.clientY - bounding.top
    const shouldInsertBefore = offset < bounding.height / 2

    if (shouldInsertBefore) {
      this.listTarget.insertBefore(this.draggedElement, target)
    } else {
      this.listTarget.insertBefore(this.draggedElement, target.nextSibling)
    }
  }

  drop(event) {
    event.preventDefault()
    this.draggedElement = null
    this.updatePositions()
  }

  updatePositions() {
    this.itemTargets.forEach((item, index) => {
      const positionField = item.querySelector("[data-specifications-target='positionField']")
      if (positionField) {
        positionField.value = index
      }
    })
  }
}

