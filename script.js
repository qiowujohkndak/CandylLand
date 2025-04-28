// Self-executing anonymous function to hide scope
;(function () {
  // Variabili offuscate
  const _0x3fe1a2 = 'DOMContentLoaded'
  const _0x4e7bc1 = '.add-to-cart'
  const _0x89e4f3 = '#products-container'
  const _0x5c7ae1 = '#cartIcon'
  const _0x7c63d1 = '#cartSidebar'
  const _0x9d2f13 = '#cartOverlay'
  const _0x1f23b1 = '#closeCart'
  const _0x8a5cf1 = '.video-overlay'
  const _0x6d3fc1 = '#cartItems'
  const _0x4a8de1 = '#emptyCartMessage'
  const _0x2e4cd1 = '#cartCount'
  const _0x1a7cf1 = '#cartTotal'
  const _0x5e9dd1 = '#checkoutBtn'

  // Funzione per decifrare i nomi delle funzioni a runtime
  const decode = (str) => {
    return str
      .split('')
      .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
      .join('')
  }

  document.addEventListener(_0x3fe1a2, function () {
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
          decode('dboesDbs'),
          JSON.stringify({
            items: this.items,
            total: this.total,
          })
        )
      },

      // Carica il carrello dal localStorage
      loadCart: function () {
        const savedCart = localStorage.getItem(decode('dboesDbs'))

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
        document.getElementById(_0x2e4cd1.slice(1)).textContent =
          this.getTotalItems()

        // Aggiorna il messaggio "carrello vuoto"
        const emptyCartMessage = document.getElementById(_0x4a8de1.slice(1))
        if (this.items.length === 0) {
          emptyCartMessage.style.display = 'block'
        } else {
          emptyCartMessage.style.display = 'none'
        }

        // Aggiorna il totale
        document.getElementById(_0x1a7cf1.slice(1)).textContent =
          this.total.toFixed(2).replace('.', ',') + ' €'

        // Aggiorna il pulsante checkout
        const checkoutBtn = document.getElementById(_0x5e9dd1.slice(1))
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
        const cartItemsContainer = document.getElementById(_0x6d3fc1.slice(1))
        const emptyCartMessage = document.getElementById(_0x4a8de1.slice(1))

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
              <iframe 
                class="cart-item-video" 
                src="https://www.youtube.com/embed/4eUD9kcNygY?mute=1&autoplay=0&loop=1&controls=0&playlist=4eUD9kcNygY" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
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

    // URL del video di YouTube comune a tutti i prodotti
    const commonVideoUrl = 'https://www.youtube.com/embed/4eUD9kcNygY'

    // Product data (10 different candies)
    const products = [
      {
        id: 1,
        name: 'Lollipop Arcobaleno',
        video: commonVideoUrl,
        description:
          'Lollipop colorato con sapori assortiti di frutta. Perfetto per rallegrare ogni giornata!',
        price: '2,50 €',
      },
      {
        id: 2,
        name: 'Caramelle Gommose Frutta',
        video: commonVideoUrl,
        description:
          'Morbide caramelle gommose a forma di frutta, realizzate con succhi naturali.',
        price: '3,20 €',
      },
      {
        id: 3,
        name: 'Cioccolato al Caramello',
        video: commonVideoUrl,
        description:
          'Delizioso cioccolato ripieno di caramello cremoso, una combinazione irresistibile.',
        price: '4,00 €',
      },
      {
        id: 4,
        name: 'Caramelle alla Menta',
        video: commonVideoUrl,
        description:
          'Caramelle rinfrescanti alla menta, perfette dopo i pasti o in qualsiasi momento.',
        price: '1,80 €',
      },
      {
        id: 5,
        name: 'Bastoncini di Zucchero',
        video: commonVideoUrl,
        description:
          'Classici bastoncini di zucchero a strisce bianche e rosse, sapore di menta piperita.',
        price: '2,00 €',
      },
      {
        id: 6,
        name: 'Gelée di Frutta',
        video: commonVideoUrl,
        description:
          'Gelatine di frutta assortite, morbide e zuccherate, dai colori vivaci.',
        price: '3,50 €',
      },
      {
        id: 7,
        name: 'Marshmallow Colorati',
        video: commonVideoUrl,
        description:
          'Morbidi marshmallow in vari colori e sapori, ideali per dessert o da gustare da soli.',
        price: '2,75 €',
      },
      {
        id: 8,
        name: 'Caramelle al Miele',
        video: commonVideoUrl,
        description:
          'Caramelle tradizionali al miele, realizzate con miele di fiori selvatici.',
        price: '2,30 €',
      },
      {
        id: 9,
        name: 'Pop Rocks Frizzanti',
        video: commonVideoUrl,
        description:
          "Caramelle frizzanti che scoppiano in bocca. Un'esperienza divertente e gustosa!",
        price: '1,90 €',
      },
      {
        id: 10,
        name: 'Cioccolatini Assortiti',
        video: commonVideoUrl,
        description:
          'Confezione di cioccolatini assortiti con ripieni diversi. Il regalo perfetto!',
        price: '5,50 €',
      },
    ]

    // Get the container for products
    const productsContainer = document.getElementById(_0x89e4f3.slice(1))

    // Create and append product cards
    products.forEach((product) => {
      const productCard = document.createElement('div')
      productCard.className = 'col-sm-6 col-md-4 col-lg-3'

      productCard.innerHTML = `
              <div class="card product-card shadow-sm">
                  <div class="product-video-container">
                      <iframe 
                          class="product-video" 
                          src="${product.video}?mute=1&autoplay=0&loop=1&controls=0&playlist=4eUD9kcNygY" 
                          frameborder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowfullscreen>
                      </iframe>
                      <div class="video-overlay">
                          <div class="play-button">
                              <i class="fas fa-play"></i>
                          </div>
                      </div>
                  </div>
                  <div class="card-body">
                      <h5 class="card-title product-title">${product.name}</h5>
                      <p class="card-text">${product.description}</p>
                      <div class="product-footer d-flex justify-content-between align-items-center">
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
    const cartIcon = document.getElementById(_0x5c7ae1.slice(1))
    const cartSidebar = document.getElementById(_0x7c63d1.slice(1))
    const cartOverlay = document.getElementById(_0x9d2f13.slice(1))
    const closeCart = document.getElementById(_0x1f23b1.slice(1))

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
    document.querySelectorAll(_0x4e7bc1).forEach((button) => {
      button.addEventListener('click', function () {
        const productId = parseInt(this.getAttribute('data-id'))
        const product = products.find((p) => p.id === productId)

        if (product) {
          cart.addItem(product)

          // Feedback visivo
          this.innerHTML = 'Aggiunto! <i class="fas fa-check ms-1"></i>'

          // Ripristina il testo del pulsante dopo 1.5 secondi
          setTimeout(() => {
            this.innerHTML =
              'Aggiungi <i class="fas fa-shopping-cart ms-1"></i>'
          }, 1500)
        }
      })
    })

    // Aggiungi controlli personalizzati per i video
    document.querySelectorAll(_0x8a5cf1).forEach((overlay, index) => {
      overlay.addEventListener('click', function () {
        // Ottieni l'iframe
        const iframe = this.previousElementSibling
        const src = iframe.src

        // Metodo alternativo per controllare il play/pause per iframes di YouTube
        if (src.includes('autoplay=1')) {
          // Pausa il video cambiando il src (rimuovendo autoplay)
          iframe.src = src.replace('autoplay=1', 'autoplay=0')
          this.querySelector('.play-button').innerHTML =
            '<i class="fas fa-play"></i>'
        } else {
          // Avvia il video cambiando il src (aggiungendo autoplay)
          iframe.src = src.replace('autoplay=0', 'autoplay=1')
          this.querySelector('.play-button').innerHTML =
            '<i class="fas fa-pause"></i>'
        }
      })
    })

    // Previeni il click destro sui video
    document.addEventListener(
      'contextmenu',
      function (e) {
        if (e.target.tagName === 'IFRAME') {
          e.preventDefault()
        }
      },
      false
    )
  })

  // Aggiungi protezione contro la manipolazione della console del browser
  window.addEventListener('error', function (e) {
    if (/script error/i.test(e.message)) {
      console.log('Script Error: Vedere Console del Browser per Dettagli')
    } else {
      console.log(
        'Error: ' +
          e.message +
          ' Script: ' +
          e.filename +
          ' Line: ' +
          e.lineno +
          ' Column: ' +
          e.colno
      )
    }
    return true
  })

  // Monitoraggio debbugging
  const _monitoring = setInterval(function () {
    const _startTime = new Date()
    debugger
    const _endTime = new Date()
    const _diff = _endTime - _startTime
    if (_diff > 100) {
      // Se qualcuno ha aperto il debugger, disabilita alcune funzioni
      document.body.innerHTML =
        '<div style="text-align:center; padding:50px;"><h1>Debug non consentito</h1><p>Questa pagina è protetta.</p></div>'
      clearInterval(_monitoring)
    }
  }, 1000)
})()
