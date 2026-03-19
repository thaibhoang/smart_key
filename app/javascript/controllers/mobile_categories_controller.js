import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["trigger", "menu", "content", "level"]
  static values = { categories: Object }

  connect() {
    this.currentLevel = 1
    this.categoryStack = []
    // Store original content
    this.originalContent = this.contentTarget.innerHTML
  }

  open() {
    this.menuTarget.classList.remove("-translate-x-full")
    this.menuTarget.classList.add("translate-x-0")
    document.body.classList.add("overflow-hidden")
  }

  close() {
    this.menuTarget.classList.add("-translate-x-full")
    this.menuTarget.classList.remove("translate-x-0")
    document.body.classList.remove("overflow-hidden")
    
    // Reset to root level
    setTimeout(() => {
      this.resetToRoot()
    }, 300)
  }

  async navigateToLevel(event) {
    const categoryId = event.currentTarget.dataset.categoryId
    const categoryName = event.currentTarget.dataset.categoryName
    
    this.categoryStack.push({ id: categoryId, name: categoryName, level: this.currentLevel })
    this.currentLevel++
    
    this.loadCategoryChildren(categoryId, categoryName)
  }

  goBack() {
    if (this.categoryStack.length === 0) return
    
    this.categoryStack.pop()
    this.currentLevel--
    
    if (this.currentLevel === 1) {
      this.resetToRoot()
    } else {
      // Load previous level
      const previousCategory = this.categoryStack[this.categoryStack.length - 1]
      this.loadCategoryChildren(previousCategory.id, previousCategory.name, true)
    }
  }

  async loadCategoryChildren(categoryId, categoryName, isGoingBack = false) {
    try {
      const response = await fetch(`/api/categories/${categoryId}/children`)
      const children = await response.json()
      this.renderLevel(children, categoryName, isGoingBack)
    } catch (error) {
      console.error("Error loading subcategories:", error)
    }
  }

  renderLevel(categories, parentName, isGoingBack = false) {
    const newLevelHtml = `
      <div data-mobile-categories-target="level" data-level="${this.currentLevel}" class="p-4 bg-white min-h-full mobile-level-enter" style="background-color: white !important;">
        <button data-action="click->mobile-categories#goBack" 
                class="flex items-center mb-4 text-gray-600">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Quay lại
        </button>
        <h3 class="text-lg font-semibold mb-4 text-gray-900">${parentName}</h3>
        ${categories.map(category => `
          <div class="mb-2">
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <a href="/products?category=${category.id}" 
                 data-action="click->mobile-categories#close"
                 class="flex-1 text-gray-900 font-medium">${category.name}</a>
              ${category.has_children ? `
                <button data-action="click->mobile-categories#navigateToLevel" 
                        data-category-id="${category.id}"
                        data-category-name="${category.name}"
                        class="p-1 text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `
    
    // Get current level element to animate out
    const currentLevel = this.contentTarget.querySelector('[data-mobile-categories-target="level"]')
    
    if (currentLevel) {
      // Add exit animation class
      const exitClass = isGoingBack ? 'mobile-level-back-exit-active' : 'mobile-level-exit-active'
      currentLevel.classList.add(exitClass)
      
      // Wait for exit animation to complete, then replace content
      setTimeout(() => {
        this.contentTarget.innerHTML = newLevelHtml
        
        // Trigger enter animation
        const newLevel = this.contentTarget.querySelector('[data-mobile-categories-target="level"]')
        if (newLevel) {
          const enterClass = isGoingBack ? 'mobile-level-back-enter-active' : 'mobile-level-enter-active'
          newLevel.classList.remove('mobile-level-enter')
          newLevel.classList.add(enterClass)
          
          // Clean up animation classes after animation completes
          setTimeout(() => {
            newLevel.classList.remove(enterClass)
          }, 300)
        }
      }, 300)
    } else {
      // No current level, just set content
      this.contentTarget.innerHTML = newLevelHtml
      const newLevel = this.contentTarget.querySelector('[data-mobile-categories-target="level"]')
      if (newLevel) {
        const enterClass = isGoingBack ? 'mobile-level-back-enter-active' : 'mobile-level-enter-active'
        newLevel.classList.remove('mobile-level-enter')
        newLevel.classList.add(enterClass)
        
        setTimeout(() => {
          newLevel.classList.remove(enterClass)
        }, 300)
      }
    }
  }

  resetToRoot() {
    const currentLevel = this.contentTarget.querySelector('[data-mobile-categories-target="level"]')
    
    if (currentLevel) {
      // Add exit animation
      currentLevel.classList.add('mobile-level-back-exit-active')
      
      // Wait for animation, then restore original content
      setTimeout(() => {
        this.currentLevel = 1
        this.categoryStack = []
        this.contentTarget.innerHTML = this.originalContent
        
        // Add enter animation to restored content
        const restoredLevel = this.contentTarget.querySelector('[data-mobile-categories-target="level"]')
        if (restoredLevel) {
          restoredLevel.classList.add('mobile-level-back-enter')
          setTimeout(() => {
            restoredLevel.classList.remove('mobile-level-back-enter')
            restoredLevel.classList.add('mobile-level-back-enter-active')
            setTimeout(() => {
              restoredLevel.classList.remove('mobile-level-back-enter-active')
            }, 300)
          }, 10)
        }
      }, 300)
    } else {
      this.currentLevel = 1
      this.categoryStack = []
      this.contentTarget.innerHTML = this.originalContent
    }
  }
}