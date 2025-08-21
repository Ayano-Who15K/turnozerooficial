// Global variables
let products = []
let cart = []
let userProfile = {}
const currentFilters = {
  category: "",
  priceRange: "",
  sort: "name",
  search: "",
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  loadProducts()
  loadCart()
  loadUserProfile()
  updateCartCount()

  // Load content based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  switch (currentPage) {
    case "index.html":
    case "":
      loadFeaturedProducts()
      break
    case "catalog.html":
      loadAllProducts()
      break
    case "cart.html":
      loadCartPage()
      break
    case "profile.html":
      loadProfilePage()
      break
  }
}

function loadProducts() {
  // Remova a linha que lê do localStorage
  // const savedProducts = localStorage.getItem("marketplace_products")

  // O bloco 'if' e 'else' não é mais necessário,
  // pois não estamos lendo do localStorage.
  // Apenas defina os produtos diretamente.
  products = [{
      id: "1",
      name: "Brahma Lata 350ml",
      price: 5.5,
      originalPrice: 6.5,
      image: "assets/img/cervejaslata/brahmalata350ml.png",
      category: "Cerveja",
      rating: 5.0,
      description: "Refrescante, dourada e com espuma cremosa, a Brahma na lata é a companhia perfeita para qualquer momento. Seu sabor leve e equilibrado traz a harmonia ideal entre malte e lúpulo, tornando cada gole suave e prazeroso. Gelada, realça ainda mais sua personalidade marcante, sendo presença garantida em churrascos, festas e encontros com amigos. Prática e fácil de transportar, a lata preserva todo o frescor e aroma da cerveja, garantindo que a experiência Brahma seja sempre do primeiro ao último gole",
      inStock: true,
      featured: true,
    },
    {
      id: "2",
      name: "Brahma Duplo Malte Lata 350ml",
      price: 7.5,
      originalPrice: 8.5,
      image: "assets/img/cervejaslata/brahmaduplomalte350ml.png",
      category: "Cerveja",
      rating: 4.5,
      description: 'Smartphone Samsung Galaxy com tela de 6.5", 128GB, câmera tripla',
      inStock: true,
      featured: true,
    },
    {
      id: "3",
      name: "Pizza Margherita",
      price: 32.9,
      image: "/margherita-pizza.png",
      category: "comida",
      rating: 4.9,
      description: "Pizza tradicional com molho de tomate, mussarela e manjericão fresco",
      inStock: true,
      featured: true,
    },
    {
      id: "4",
      name: "Fone Bluetooth",
      price: 159.9,
      originalPrice: 199.9,
      image: "/bluetooth-headphones.png",
      category: "eletronicos",
      rating: 4.3,
      description: "Fone de ouvido Bluetooth com cancelamento de ruído e bateria de 30h",
      inStock: true,
      featured: false,
    },
    {
      id: "5",
      name: "Açaí com Frutas",
      price: 18.5,
      image: "/acai-bowl-fruits.png",
      category: "comida",
      rating: 4.7,
      description: "Açaí cremoso com banana, morango, granola e mel",
      inStock: true,
      featured: false,
    },
    {
      id: "6",
      name: "Camiseta Básica",
      price: 39.9,
      image: "/basic-t-shirt.png",
      category: "roupas",
      rating: 4.2,
      description: "Camiseta 100% algodão, disponível em várias cores",
      inStock: true,
      featured: false,
    },
  ]
  // Remova a linha que salva no localStorage
  // localStorage.setItem("marketplace_products", JSON.stringify(products))
}

function loadFeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured)
  const container = document.getElementById("featuredProducts")
  if (container) {
    container.innerHTML = featuredProducts.map((product) => createProductCard(product)).join("")
  }
}

function loadAllProducts() {
  const filteredProducts = filterProducts()
  const container = document.getElementById("productsGrid")
  const countElement = document.getElementById("productsCount")

  if (container) {
    container.innerHTML = filteredProducts.map((product) => createProductCard(product)).join("")
  }

  if (countElement) {
    countElement.textContent = `${filteredProducts.length} produtos encontrados`
  }
}

function filterProducts() {
  let filtered = [...products]

  // Filter by category
  if (currentFilters.category) {
    filtered = filtered.filter((product) => product.category === currentFilters.category)
  }

  // Filter by price range
  if (currentFilters.priceRange) {
    const [min, max] = currentFilters.priceRange.split("-").map((p) => p.replace("+", ""))
    filtered = filtered.filter((product) => {
      if (max) {
        return product.price >= Number.parseFloat(min) && product.price <= Number.parseFloat(max)
      } else {
        return product.price >= Number.parseFloat(min)
      }
    })
  }

  // Filter by search
  if (currentFilters.search) {
    const searchTerm = currentFilters.search.toLowerCase()
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    )
  }

  // Sort products
  filtered.sort((a, b) => {
    switch (currentFilters.sort) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return filtered
}

function createProductCard(product) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">R$ ${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">R$ ${product.originalPrice.toFixed(2)}</span>` : ""}
                    ${discountPercentage > 0 ? `<span class="discount">-${discountPercentage}%</span>` : ""}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                        <i class="fas fa-cart-plus"></i>
                        Adicionar
                    </button>
                    
                </div>
            </div>
        </div>
    `
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>'
  }

  return stars
}

// Cart Management
function loadCart() {
  const savedCart = localStorage.getItem("marketplace_cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }
}

function saveCart() {
  localStorage.setItem("marketplace_cart", JSON.stringify(cart))
  updateCartCount()
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  saveCart()
  showNotification("Produto adicionado ao carrinho!")
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCart()

  // Reload cart page if we're on it
  if (window.location.pathname.includes("cart.html")) {
    loadCartPage()
  }
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find((item) => item.id === productId)
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = newQuantity
      saveCart()

      // Update cart page if we're on it
      if (window.location.pathname.includes("cart.html")) {
        loadCartPage()
      }
    }
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartCountElements = document.querySelectorAll("#cartCount, .cart-count")
  cartCountElements.forEach((element) => {
    if (element) {
      element.textContent = totalItems
      element.style.display = totalItems > 0 ? "flex" : "none"
    }
  })
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function loadCartPage() {
  const container = document.getElementById("cartPageContent")
  const summaryContainer = document.getElementById("cartSummary")

  if (!container) return

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns produtos deliciosos!</p>
                <a href="catalog.html" class="shop-now-btn">Ver Produtos</a>
            </div>
        `
    if (summaryContainer) {
      summaryContainer.style.display = "none"
    }
    return
  }

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `,
    )
    .join("")

  // Update summary
  const total = getCartTotal()
  const subtotalElement = document.getElementById("subtotal")
  const totalElement = document.getElementById("total")

  if (subtotalElement) subtotalElement.textContent = `R$ ${total.toFixed(2)}`
  if (totalElement) totalElement.textContent = `R$ ${total.toFixed(2)}`

  if (summaryContainer) {
    summaryContainer.style.display = "block"
  }
}

// Search and Filter Functions
function toggleSearch() {
  const searchBar = document.getElementById("searchBar")
  if (searchBar) {
    searchBar.classList.toggle("active")
    if (searchBar.classList.contains("active")) {
      const searchInput = document.getElementById("searchInput")
      if (searchInput) {
        searchInput.focus()
      }
    }
  }
}

function searchProducts() {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    currentFilters.search = searchInput.value
    if (window.location.pathname.includes("catalog.html")) {
      loadAllProducts()
    } else {
      window.location.href = "catalog.html"
    }
  }
}

function filterByCategory(category) {
  currentFilters.category = category
  window.location.href = "catalog.html"
}

function applyFilters() {
  const categoryFilter = document.getElementById("categoryFilter")
  const priceFilter = document.getElementById("priceFilter")
  const sortFilter = document.getElementById("sortFilter")

  if (categoryFilter) currentFilters.category = categoryFilter.value
  if (priceFilter) currentFilters.priceRange = priceFilter.value
  if (sortFilter) currentFilters.sort = sortFilter.value

  loadAllProducts()
}

// Modal Functions
function openCart() {
  const modal = document.getElementById("cartModal")
  if (modal) {
    loadCartModal()
    modal.classList.add("active")
  }
}

function closeCart() {
  const modal = document.getElementById("cartModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function loadCartModal() {
  const container = document.getElementById("cartItems")
  const totalElement = document.getElementById("cartTotal")

  if (!container) return

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center">Seu carrinho está vazio</p>'
    if (totalElement) totalElement.textContent = "Total: R$ 0,00"
    return
  }

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}'); loadCartModal();">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `,
    )
    .join("")

  const total = getCartTotal()
  if (totalElement) {
    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`
  }
}

function openCheckout() {
  closeCart()
  const modal = document.getElementById("checkoutModal")
  if (modal) {
    loadUserDataIntoCheckout()
    modal.classList.add("active")
  }
}

function closeCheckout() {
  const modal = document.getElementById("checkoutModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function loadUserDataIntoCheckout() {
  const fields = ["customerName", "customerPhone", "customerAddress", "customerNeighborhood", "customerReference"]
  const profileFields = ["name", "phone", "address", "neighborhood", "reference"]

  fields.forEach((field, index) => {
    const element = document.getElementById(field)
    const profileField = profileFields[index]
    if (element && userProfile[profileField]) {
      element.value = userProfile[profileField]
    }
  })
}

// WhatsApp Integration
function orderSingleProduct(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  // Add to temporary cart for checkout
  const tempCart = [
    {
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    },
  ]

  // Store original cart
  const originalCart = [...cart]
  cart = tempCart

  openCheckout()

  // Restore original cart after modal opens
  setTimeout(() => {
    cart = originalCart
  }, 100)
}

function sendWhatsAppOrder() {
  const form = document.getElementById("checkoutForm")
  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  const customerData = {
    name: document.getElementById("customerName").value,
  }

  // Create WhatsApp message
  let message = `🛒 *NOVO PEDIDO - Turno Zero*\n\n`
  message += `👤 *Cliente:* ${customerData.name}\n`
  if (customerData.reference) {
    message += `📌 *Referência:* ${customerData.reference}\n`
  }
  message += `\n🛍️ *ITENS DO PEDIDO:*\n`

  let total = 0
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal
    message += `• ${item.name}\n`
    message += `  Qtd: ${item.quantity}x | Valor: R$ ${item.price.toFixed(2)} | Subtotal: R$ ${itemTotal.toFixed(2)}\n\n`
  })

  message += `💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`

  if (customerData.notes) {
    message += `📝 *Observações:* ${customerData.notes}\n\n`
  }

  message += `⏰ Pedido realizado em: ${new Date().toLocaleString("pt-BR")}\n\n`
  message += `Obrigado pela preferência! 🙏`

  // WhatsApp business number (replace with actual number)
  const whatsappNumber = "5548996868430" // Replace with your WhatsApp Business number
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  // Open WhatsApp
  window.open(whatsappUrl, "_blank")

  // Clear cart and close modal
  cart = []
  saveCart()
  closeCheckout()
  showNotification("Pedido enviado via WhatsApp!")

  // Redirect to home page
  setTimeout(() => {
    window.location.href = "index.html"
  }, 2000)
}

// User Profile Management
function loadUserProfile() {
  const savedProfile = localStorage.getItem("marketplace_profile")
  if (savedProfile) {
    userProfile = JSON.parse(savedProfile)
  }
}

function saveUserProfile() {
  localStorage.setItem("marketplace_profile", JSON.stringify(userProfile))
}

function loadProfilePage() {
  const fields = [
    "profileName",
    
  ]
  const profileFields = ["name"]

  fields.forEach((field, index) => {
    const element = document.getElementById(field)
    const profileField = profileFields[index]
    if (element && userProfile[profileField]) {
      element.value = userProfile[profileField]
    }
  })

  // Load preferences
  const saveAddressCheckbox = document.getElementById("saveAddressDefault")
  const notificationsCheckbox = document.getElementById("notificationsEnabled")

  if (saveAddressCheckbox) {
    saveAddressCheckbox.checked = userProfile.saveAddressDefault || false
  }

  if (notificationsCheckbox) {
    notificationsCheckbox.checked = userProfile.notificationsEnabled || false
  }
}

function saveProfile() {
  const profileData = {
    name: document.getElementById("profileName").value,
    saveAddressDefault: document.getElementById("saveAddressDefault").checked,
    notificationsEnabled: document.getElementById("notificationsEnabled").checked,
  }

  userProfile = { ...userProfile, ...profileData }
  saveUserProfile()
  showNotification("Perfil salvo com sucesso!")
}

function clearProfile() {
  if (confirm("Tem certeza que deseja limpar todos os dados do perfil?")) {
    userProfile = {}
    localStorage.removeItem("marketplace_profile")
    loadProfilePage()
    showNotification("Dados do perfil removidos!")
  }
}

// Utility Functions
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `
  notification.textContent = message

  // Add animation styles
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `
  document.head.appendChild(style)

  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Event Listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCart()
    closeCheckout()
  }
})

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  const cartModal = document.getElementById("cartModal")
  const checkoutModal = document.getElementById("checkoutModal")

  if (e.target === cartModal) {
    closeCart()
  }

  if (e.target === checkoutModal) {
    closeCheckout()
  }
})

// Search on Enter key
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.id === "searchInput") {
    searchProducts()
  }
})
