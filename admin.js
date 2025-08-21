// Admin-specific JavaScript
let adminProducts = []
let editingProductId = null
let products = [] // Declare the products variable
const showNotification = (message) => {
  alert(message) // Simple implementation of showNotification
} // Declare the showNotification variable

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("admin.html")) {
    initializeAdmin()
  }
})

function initializeAdmin() {
  loadAdminProducts()
  loadAdminStats()
  showTab("products")
}

function loadAdminProducts() {
  const savedProducts = localStorage.getItem("marketplace_products")
  if (savedProducts) {
    adminProducts = JSON.parse(savedProducts)
  } else {
    adminProducts = []
  }
  displayAdminProducts()
}

function saveAdminProducts() {
  localStorage.setItem("marketplace_products", JSON.stringify(adminProducts))
  // Also update the main products array
  products = [...adminProducts]
}

function displayAdminProducts() {
  const container = document.getElementById("adminProductsList")
  if (!container) return

  if (adminProducts.length === 0) {
    container.innerHTML = '<p class="text-center">Nenhum produto cadastrado ainda.</p>'
    return
  }

  container.innerHTML = adminProducts
    .map(
      (product) => `
        <div class="admin-product-card">
            <img src="${product.image || "/placeholder.svg?height=80&width=80"}" alt="${product.name}" class="admin-product-image">
            <div class="admin-product-info">
                <h4 class="admin-product-name">${product.name}</h4>
                <p class="admin-product-category">${product.category}</p>
                <div class="admin-product-price">
                    <span class="current-price">R$ ${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">R$ ${product.originalPrice.toFixed(2)}</span>` : ""}
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="admin-btn-sm ${product.inStock ? "" : "out-of-stock"}" onclick="toggleProductStock('${product.id}')">
                    ${product.inStock ? "Em estoque" : "Sem estoque"}
                </button>
                <button class="admin-btn-sm ${product.featured ? "featured" : ""}" onclick="toggleProductFeatured('${product.id}')">
                    ${product.featured ? "Destacado" : "Destacar"}
                </button>
                <button class="admin-btn-sm edit" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-btn-sm delete" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function showTab(tabName) {
  // Hide all tabs
  const tabs = document.querySelectorAll(".tab-content")
  tabs.forEach((tab) => tab.classList.remove("active"))

  // Remove active class from all tab buttons
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((btn) => btn.classList.remove("active"))

  // Show selected tab
  const selectedTab = document.getElementById(tabName + "Tab")
  if (selectedTab) {
    selectedTab.classList.add("active")
  }

  // Add active class to selected tab button
  const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`)
  if (selectedButton) {
    selectedButton.classList.add("active")
  }

  if (tabName === "analytics") {
    loadAdminStats()
  }
}

function showAddProductForm() {
  const form = document.getElementById("addProductForm")
  if (form) {
    form.style.display = "block"
    clearProductForm()
  }
}

function hideAddProductForm() {
  const form = document.getElementById("addProductForm")
  if (form) {
    form.style.display = "none"
    clearProductForm()
  }
}

function clearProductForm() {
  const form = document.getElementById("newProductForm")
  if (form) {
    form.reset()
    document.getElementById("productRating").value = "5"
    document.getElementById("productInStock").checked = true
    document.getElementById("productFeatured").checked = false
  }
  editingProductId = null
}

function addProduct() {
  const form = document.getElementById("newProductForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const productData = {
    id: editingProductId || Date.now().toString(),
    name: document.getElementById("productName").value,
    category: document.getElementById("productCategory").value,
    price: Number.parseFloat(document.getElementById("productPrice").value),
    originalPrice: Number.parseFloat(document.getElementById("productOriginalPrice").value) || null,
    image: document.getElementById("productImage").value || "/placeholder.svg?height=200&width=200",
    description: document.getElementById("productDescription").value,
    rating: Number.parseFloat(document.getElementById("productRating").value),
    inStock: document.getElementById("productInStock").checked,
    featured: document.getElementById("productFeatured").checked,
  }

  if (editingProductId) {
    // Update existing product
    const index = adminProducts.findIndex((p) => p.id === editingProductId)
    if (index !== -1) {
      adminProducts[index] = productData
    }
  } else {
    // Add new product
    adminProducts.push(productData)
  }

  saveAdminProducts()
  displayAdminProducts()
  loadAdminStats()
  hideAddProductForm()

  showNotification(editingProductId ? "Produto atualizado com sucesso!" : "Produto adicionado com sucesso!")
}

function editProduct(productId) {
  const product = adminProducts.find((p) => p.id === productId)
  if (!product) return

  editingProductId = productId

  // Fill form with product data
  document.getElementById("productName").value = product.name
  document.getElementById("productCategory").value = product.category
  document.getElementById("productPrice").value = product.price
  document.getElementById("productOriginalPrice").value = product.originalPrice || ""
  document.getElementById("productImage").value = product.image
  document.getElementById("productDescription").value = product.description
  document.getElementById("productRating").value = product.rating
  document.getElementById("productInStock").checked = product.inStock
  document.getElementById("productFeatured").checked = product.featured

  showAddProductForm()
}

function deleteProduct(productId) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    adminProducts = adminProducts.filter((p) => p.id !== productId)
    saveAdminProducts()
    displayAdminProducts()
    loadAdminStats()
    showNotification("Produto excluído com sucesso!")
  }
}

function toggleProductStock(productId) {
  const product = adminProducts.find((p) => p.id === productId)
  if (product) {
    product.inStock = !product.inStock
    saveAdminProducts()
    displayAdminProducts()
    loadAdminStats()
    showNotification(`Produto ${product.inStock ? "marcado como em estoque" : "marcado como sem estoque"}!`)
  }
}

function toggleProductFeatured(productId) {
  const product = adminProducts.find((p) => p.id === productId)
  if (product) {
    product.featured = !product.featured
    saveAdminProducts()
    displayAdminProducts()
    loadAdminStats()
    showNotification(`Produto ${product.featured ? "destacado" : "removido dos destaques"}!`)
  }
}

function loadAdminStats() {
  const totalProducts = adminProducts.length
  const featuredProducts = adminProducts.filter((p) => p.featured).length
  const inStockProducts = adminProducts.filter((p) => p.inStock).length

  // Update stat cards
  const totalElement = document.getElementById("totalProducts")
  const featuredElement = document.getElementById("featuredProducts")
  const inStockElement = document.getElementById("inStockProducts")

  if (totalElement) totalElement.textContent = totalProducts
  if (featuredElement) featuredElement.textContent = featuredProducts
  if (inStockElement) inStockElement.textContent = inStockProducts

  // Update categories stats
  const categoriesStats = adminProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {})

  const categoriesContainer = document.getElementById("categoriesStats")
  if (categoriesContainer) {
    if (Object.keys(categoriesStats).length === 0) {
      categoriesContainer.innerHTML = '<p class="text-center">Nenhuma categoria encontrada.</p>'
    } else {
      categoriesContainer.innerHTML = Object.entries(categoriesStats)
        .map(
          ([category, count]) => `
                    <div class="category-stat">
                        <span>${category}</span>
                        <span class="category-count">${count}</span>
                    </div>
                `,
        )
        .join("")
    }
  }
}
