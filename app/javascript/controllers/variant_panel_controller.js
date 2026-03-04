import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list", "item", "panel", "template", "destroyField"]

  new() {
    if (!this.hasTemplateTarget || !this.hasListTarget) return

    const html = this.templateTarget.innerHTML
    const newId = Date.now().toString()
    const processed = html.replace(/NEW_RECORD/g, newId)

    const wrapper = document.createElement("div")
    wrapper.innerHTML = processed.trim()

    const newItems = wrapper.querySelectorAll("[data-variant-panel-target='item']")
    const newPanels = wrapper.querySelectorAll("[data-variant-panel-target='panel']")

    newItems.forEach((node) => this.listTarget.appendChild(node))
    newPanels.forEach((node) => this.listTarget.appendChild(node))

    const lastPanel = Array.from(this.panelTargets).find(
      (p) => p.dataset.variantPanelIdValue === newId
    )
    if (lastPanel) {
      this._showPanel(lastPanel)
    }
  }

  edit(event) {
    const item = event.currentTarget.closest("[data-variant-panel-target='item']")
    if (!item) return
    const id = item.dataset.variantPanelIdValue
    const panel = this._panelForId(id)
    if (panel) this._showPanel(panel)
  }

  close(event) {
    const panel = event.currentTarget.closest("[data-variant-panel-target='panel']")
    if (panel) {
      panel.classList.add("hidden")
    }
  }

  remove(event) {
    if (!window.confirm("Bạn có chắc muốn xóa phiên bản này không?")) {
      return
    }

    const item = event.currentTarget.closest("[data-variant-panel-target='item']")
    if (!item) return
    const id = item.dataset.variantPanelIdValue
    const panel = this._panelForId(id)

    const destroyField =
      item.querySelector("[data-variant-panel-target='destroyField']") ||
      (panel && panel.querySelector("[data-variant-panel-target='destroyField']"))

    if (destroyField) {
      destroyField.value = "1"
    }

    item.classList.add("opacity-50")
    item.style.display = "none"
    if (panel) {
      panel.classList.add("opacity-50")
      panel.style.display = "none"
    }
  }

  _panelForId(id) {
    return this.panelTargets.find((p) => p.dataset.variantPanelIdValue === id)
  }

  _showPanel(panel) {
    this.panelTargets.forEach((p) => {
      if (p === panel) {
        p.classList.remove("hidden")
      } else {
        p.classList.add("hidden")
      }
    })
  }
}

