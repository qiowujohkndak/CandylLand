document.addEventListener('DOMContentLoaded', function () {
  // Gestione carrello
  const cart = {
    items: [],
    total: 0,

    // Aggiunge un prodotto al carrello
    addItem: function (product) {
      const existingItem = this.items.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          ...product,
          quantity: 1,
        })
      }

      this.updateTotal()
      this.saveCart()
      this.updateUI()
    },

    // Rimuove un prodotto dal carrello
    removeItem: function (productId) {
      this.items = this.items.filter((item) => item.id !== productId)
      this.updateTotal()
      this.saveCart()
      this.updateUI()
    },

    // Aggiorna la quantità di un prodotto
    updateQuantity: function (productId, quantity) {
      const item = this.items.find((item) => item.id === productId)

      if (item) {
        item.quantity = quantity

        if (item.quantity <= 0) {
          this.removeItem(productId)
        } else {
          this.updateTotal()
          this.saveCart()
          this.updateUI()
        }
      }
    },

    // Calcola il totale del carrello
    updateTotal: function () {
      this.total = this.items.reduce((total, item) => {
        // Converti il prezzo da formato "X,XX €" a numero
        const price = parseFloat(
          item.price.replace(',', '.').replace('€', '').trim()
        )
        return total + price * item.quantity
      }, 0)
    },

    // Salva il carrello nel localStorage
    saveCart: function () {
      localStorage.setItem(
        'candyCart',
        JSON.stringify({
          items: this.items,
          total: this.total,
        })
      )
    },

    // Carica il carrello dal localStorage
    loadCart: function () {
      const savedCart = localStorage.getItem('candyCart')

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        this.items = parsedCart.items
        this.total = parsedCart.total
      }
    },

    // Svuota il carrello
    clearCart: function () {
      this.items = []
      this.total = 0
      this.saveCart()
      this.updateUI()
    },

    // Aggiorna l'interfaccia utente
    updateUI: function () {
      // Aggiorna il contatore del carrello
      document.getElementById('cartCount').textContent = this.getTotalItems()

      // Aggiorna il messaggio "carrello vuoto"
      const emptyCartMessage = document.getElementById('emptyCartMessage')
      if (this.items.length === 0) {
        emptyCartMessage.style.display = 'block'
      } else {
        emptyCartMessage.style.display = 'none'
      }

      // Aggiorna il totale
      document.getElementById('cartTotal').textContent =
        this.total.toFixed(2).replace('.', ',') + ' €'

      // Aggiorna il pulsante checkout
      const checkoutBtn = document.getElementById('checkoutBtn')
      if (this.items.length === 0) {
        checkoutBtn.classList.add('disabled')
        checkoutBtn.href = '#'
      } else {
        checkoutBtn.classList.remove('disabled')
        checkoutBtn.href = this.generateTelegramLink()
      }

      // Aggiorna la lista dei prodotti nel carrello
      this.renderCartItems()
    },

    // Calcola il numero totale di articoli nel carrello
    getTotalItems: function () {
      return this.items.reduce((count, item) => count + item.quantity, 0)
    },

    // Genera il link per Telegram con i dettagli dell'ordine
    generateTelegramLink: function () {
      let orderMessage = '🛒 Nuovo ordine da CandyLand 🍭\n\n'
      orderMessage += '📋 Dettaglio ordine:\n'

      this.items.forEach((item) => {
        orderMessage += `- ${item.name} x${item.quantity} (${
          item.price
        } cad.) = ${(
          parseFloat(item.price.replace(',', '.').replace('€', '').trim()) *
          item.quantity
        )
          .toFixed(2)
          .replace('.', ',')} €\n`
      })

      orderMessage += `\n💰 Totale: ${this.total
        .toFixed(2)
        .replace('.', ',')} €`

      return `https://t.me/asraelops?text=${encodeURIComponent(orderMessage)}`
    },

    // Renderizza gli elementi del carrello
    renderCartItems: function () {
      const cartItemsContainer = document.getElementById('cartItems')
      const emptyCartMessage = document.getElementById('emptyCartMessage')

      // Pulisce il contenitore degli elementi del carrello, mantenendo il messaggio di carrello vuoto
      while (cartItemsContainer.children.length > 1) {
        cartItemsContainer.removeChild(cartItemsContainer.firstChild)
      }

      // Aggiunge gli elementi del carrello
      this.items.forEach((item) => {
        const cartItemEl = document.createElement('div')
        cartItemEl.className = 'cart-item'

        cartItemEl.innerHTML = `
          <div class="cart-item-img">
            <video class="cart-item-video" muted loop autoplay playsinline>
              <source src="${item.video}" type="video/mp4">
            </video>
          </div>
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">${item.price}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn minus" data-id="${item.id}">-</button>
              <input type="text" class="quantity-input" value="${item.quantity}" readonly>
              <button class="quantity-btn plus" data-id="${item.id}">+</button>
              <button class="remove-item" data-id="${item.id}">Rimuovi</button>
            </div>
          </div>
        `

        // Inserisce l'elemento prima del messaggio di carrello vuoto
        cartItemsContainer.insertBefore(cartItemEl, emptyCartMessage)
      })

      // Aggiungi eventi ai pulsanti
      document.querySelectorAll('.quantity-btn.minus').forEach((btn) => {
        btn.addEventListener('click', () => {
          const productId = parseInt(btn.getAttribute('data-id'))
          const item = this.items.find((item) => item.id === productId)
          if (item) {
            this.updateQuantity(productId, item.quantity - 1)
          }
        })
      })

      document.querySelectorAll('.quantity-btn.plus').forEach((btn) => {
        btn.addEventListener('click', () => {
          const productId = parseInt(btn.getAttribute('data-id'))
          const item = this.items.find((item) => item.id === productId)
          if (item) {
            this.updateQuantity(productId, item.quantity + 1)
          }
        })
      })

      document.querySelectorAll('.remove-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          const productId = parseInt(btn.getAttribute('data-id'))
          this.removeItem(productId)
        })
      })
    },
  }

  // Carica il carrello dal localStorage
  cart.loadCart()

  // Product data (10 different candies)
  const products = [
    {
      id: 1,
      name: 'Lollipop Arcobaleno',
      video:
        'https://player.vimeo.com/external/414879101.sd.mp4?s=27e3d62d916b637f78acdbc8b8e3fa0417e292d3&profile_id=164&oauth2_token_id=57447761',
      description:
        'Lollipop colorato con sapori assortiti di frutta. Perfetto per rallegrare ogni giornata!',
      price: '2,50 €',
    },
    {
      id: 2,
      name: 'Caramelle Gommose Frutta',
      video:
        'https://player.vimeo.com/external/455901284.sd.mp4?s=90d68d934e7cf2a5cf9f8ae71863d11c5bb5126c&profile_id=164&oauth2_token_id=57447761',
      description:
        'Morbide caramelle gommose a forma di frutta, realizzate con succhi naturali.',
      price: '3,20 €',
    },
    {
      id: 3,
      name: 'Cioccolato al Caramello',
      video:
        'https://player.vimeo.com/external/371513300.sd.mp4?s=236a53763c4838d2108513ec7c9eb64416dd8201&profile_id=164&oauth2_token_id=57447761',
      description:
        'Delizioso cioccolato ripieno di caramello cremoso, una combinazione irresistibile.',
      price: '4,00 €',
    },
    {
      id: 4,
      name: 'Caramelle alla Menta',
      video:
        'https://player.vimeo.com/external/368716609.sd.mp4?s=b99835d50e99adf5c6d227e7ffd013a350ca9c90&profile_id=164&oauth2_token_id=57447761',
      description:
        'Caramelle rinfrescanti alla menta, perfette dopo i pasti o in qualsiasi momento.',
      price: '1,80 €',
    },
    {
      id: 5,
      name: 'Bastoncini di Zucchero',
      video:
        'https://player.vimeo.com/external/478803629.sd.mp4?s=d5e8ea16f55823b7b07cd7b60e8cd793dc538b74&profile_id=164&oauth2_token_id=57447761',
      description:
        'Classici bastoncini di zucchero a strisce bianche e rosse, sapore di menta piperita.',
      price: '2,00 €',
    },
    {
      id: 6,
      name: 'Gelée di Frutta',
      video:
        'https://player.vimeo.com/external/452647011.sd.mp4?s=9ca717b10c76137a5f3f849a3816d7acf4618b03&profile_id=164&oauth2_token_id=57447761',
      description:
        'Gelatine di frutta assortite, morbide e zuccherate, dai colori vivaci.',
      price: '3,50 €',
    },
    {
      id: 7,
      name: 'Marshmallow Colorati',
      video:
        'https://player.vimeo.com/external/421173094.sd.mp4?s=50b3d4ca63d07edd7fb27805e334c97f3e794b8e&profile_id=164&oauth2_token_id=57447761',
      description:
        'Morbidi marshmallow in vari colori e sapori, ideali per dessert o da gustare da soli.',
      price: '2,75 €',
    },
    {
      id: 8,
      name: 'Caramelle al Miele',
      video:
        'https://player.vimeo.com/external/446789988.sd.mp4?s=1c6f11d4b2db1a157348b970c07491d4347aad6e&profile_id=164&oauth2_token_id=57447761',
      description:
        'Caramelle tradizionali al miele, realizzate con miele di fiori selvatici.',
      price: '2,30 €',
    },
    {
      id: 9,
      name: 'Pop Rocks Frizzanti',
      video:
        'https://player.vimeo.com/external/442593504.sd.mp4?s=ca30f567c8f70d810524316a5126d9f2aeea73e9&profile_id=164&oauth2_token_id=57447761',
      description:
        "Caramelle frizzanti che scoppiano in bocca. Un'esperienza divertente e gustosa!",
      price: '1,90 €',
    },
    {
      id: 10,
      name: 'Cioccolatini Assortiti',
      video:
        'https://player.vimeo.com/external/370845105.sd.mp4?s=d613969a7d250d42b777f776e7534a78be66f03e&profile_id=164&oauth2_token_id=57447761',
      description:
        'Confezione di cioccolatini assortiti con ripieni diversi. Il regalo perfetto!',
      price: '5,50 €',
    },
  ]

  // Get the container for products
  const productsContainer = document.getElementById('products-container')

  // Create and append product cards
  products.forEach((product) => {
    const productCard = document.createElement('div')
    productCard.className = 'col-sm-6 col-md-4 col-lg-3'

    productCard.innerHTML = `
            <div class="card product-card shadow-sm">
                <div class="product-video-container">
                    <video class="product-video" autoplay muted loop playsinline>
                        <source src="${product.video}" type="video/mp4">
                    </video>
                    <div class="video-overlay">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title product-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="product-price">${product.price}</span>
                        <button class="btn btn-candy add-to-cart" data-id="${product.id}">
                            Aggiungi <i class="fas fa-shopping-cart ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `

    productsContainer.appendChild(productCard)
  })

  // Aggiornare l'UI del carrello al caricamento
  cart.updateUI()

  // Gestione dell'apertura e chiusura del carrello
  const cartIcon = document.getElementById('cartIcon')
  const cartSidebar = document.getElementById('cartSidebar')
  const cartOverlay = document.getElementById('cartOverlay')
  const closeCart = document.getElementById('closeCart')

  cartIcon.addEventListener('click', function () {
    cartSidebar.classList.add('open')
    cartOverlay.classList.add('open')
    document.body.style.overflow = 'hidden' // Blocca lo scorrimento della pagina
  })

  function closeCartSidebar() {
    cartSidebar.classList.remove('open')
    cartOverlay.classList.remove('open')
    document.body.style.overflow = '' // Ripristina lo scorrimento della pagina
  }

  closeCart.addEventListener('click', closeCartSidebar)
  cartOverlay.addEventListener('click', closeCartSidebar)

  // Aggiungi prodotti al carrello
  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', function () {
      const productId = parseInt(this.getAttribute('data-id'))
      const product = products.find((p) => p.id === productId)

      if (product) {
        cart.addItem(product)

        // Feedback visivo
        this.innerHTML = 'Aggiunto! <i class="fas fa-check ms-1"></i>'

        // Ripristina il testo del pulsante dopo 1.5 secondi
        setTimeout(() => {
          this.innerHTML = 'Aggiungi <i class="fas fa-shopping-cart ms-1"></i>'
        }, 1500)
      }
    })
  })

  // Aggiungi controlli personalizzati per i video
  document.querySelectorAll('.video-overlay').forEach((overlay, index) => {
    overlay.addEventListener('click', function () {
      const video = this.previousElementSibling

      if (video.paused) {
        video.play()
        this.querySelector('.play-button').innerHTML =
          '<i class="fas fa-pause"></i>'
      } else {
        video.pause()
        this.querySelector('.play-button').innerHTML =
          '<i class="fas fa-play"></i>'
      }
    })
  })

  // Previeni il click destro sui video
  document.addEventListener(
    'contextmenu',
    function (e) {
      if (e.target.tagName === 'VIDEO') {
        e.preventDefault()
      }
    },
    false
  )

  // Disabilita i controlli nativi del browser
  document.querySelectorAll('video').forEach((video) => {
    video.addEventListener('controlschange', function (e) {
      e.preventDefault()
    })
  })
})
