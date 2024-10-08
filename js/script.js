const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('clase-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('addreess')
const addressWarn = document.getElementById('address-warn')
const menuBurgs = document.getElementById('container-hamburgs')
const menuBebidas = document.getElementById('container-bebidas')

let saidaBurgs = "";
let saidaBebidas = "";
for (let hamburg of hamburgs) {
  saidaBurgs +=/* html */ `
<div class="flex gap-2 items-center">
  <img src="${hamburg.image}" alt="burg-1" class="w-28 h-28 rounded-md hover:-rotate-2 duration-300" />
  <div class="w-full">
    <p class="font-bold">${hamburg.nome}</p>
    <p class="text-sm">${hamburg.descricao}</p>
    <div class="flex items-center gap-2 justify-between mt-3">
      <p class="font-bold text-lg">R$ ${hamburg.preco}</p>
      <button class="bg-gray-900 px-5 rounded-md add-to-cart-btn" data-name="${hamburg.data_name}" data-price="${hamburg.data_price}">
        <i class="fa fa-cart-plus text-lg text-white"></i>
      </button>
    </div>
  </div>
</div>
 `;
}
menuBurgs.innerHTML = saidaBurgs;

for (let bebida of bebidas) {
  saidaBebidas +=/* html */`
  <div class="flex gap-2 w-full">
        <img src="${bebida.image}" alt="coca lata" class="w-28 h-28 rounded-md hover:-rotate-2 duration-300" />
        <div class="w-full">
          <p class="font-bold">${bebida.nome_bebida}</p>
          <div class="flex items-center gap-2 justify-between mt-3">
            <p class="font-bold text-lg">R$ ${bebida.preco}</p>
            <button class="bg-gray-900 px-5 rounded-md add-to-cart-btn" data-name="${bebida.data_name}" data-price="${bebida.data_price}">
              <i class="fa fa-cart-plus text-lg text-white"></i>
            </button>
          </div>
        </div>
      </div>
  `;
}
menuBebidas.innerHTML = saidaBebidas;


let cart = []

// abrir o modal do carrinho
cartBtn.addEventListener('click', () => {
  updateCartModal()
  cartModal.style.display = 'flex'
})

// fechar modal quando clicar fora

cartModal.addEventListener('click', event => {
  if (event.target === cartModal) {
    cartModal.style.display = 'none'
  }
})

closeModalBtn.addEventListener('click', () => {
  cartModal.style.display = 'none'
})

menu.addEventListener('click', event => {
  const parentButton = event.target.closest('.add-to-cart-btn')
  if (parentButton) {
    const name = parentButton.getAttribute('data-name')
    const price = parseFloat(parentButton.getAttribute('data-price'))

    // adionar no carrinho
    addToCart(name, price)
  }
})

// função pra adinionar no carrinho

const addToCart = (name, price) => {
  const existingItem = cart.find(item => item.name === name)
  if (existingItem) {
    //se o item já existir, aumenta apenas a quantidade +1
    existingItem.quantity += 1
    return
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    })
  }
  updateCartModal()
}

//atualiza o carrinho

const updateCartModal = () => {
  cartItemsContainer.innerHTML = ''

  let total = 0

  cart.forEach(item => {
    const cartItemElement = document.createElement('div')
    cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

    cartItemElement.innerHTML = /*html*/`
    <div class="flex items-center justify-between">
        <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
            <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover
            </button>
    </div>
    `
    total += item.price * item.quantity
    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString('pt-bt', {
    style: 'currency',
    currency: 'BRL',
  })

  cartCounter.innerHTML = cart.length
}

//função pra removero o item do carrinho

cartItemsContainer.addEventListener('click', event => {
  if (event.target.classList.contains('remove-from-cart-btn')) {
    const name = event.target.getAttribute('data-name')
    removeItemCart(name)
  }
})

const removeItemCart = name => {
  const index = cart.findIndex(item => item.name === name)
  if (index !== -1) {
    const item = cart[index]
    if (item.quantity > 1) {
      item.quantity -= 1
      updateCartModal()
      return
    }
    cart.splice(index, 1)
    updateCartModal()
  }
}

addressInput.addEventListener('input', event => {
  let inputValue = event.target.value
  if (inputValue !== '') {
    addressInput.classList.remove('border-red-500')
    addressWarn.classList.add('hidden')
  }
})

//finalizar pedido
checkoutBtn.addEventListener('click', () => {
  const isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: 'Restaurante fechado no momento!',
      duration: 3000,
      // destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #ef4444, #ef1111)',
      },
      onClick: () => { }, // Callback after click
    }).showToast()
    return
  }

  if (cart.length === 0) return
  if (addressInput.value === '') {
    addressWarn.classList.remove('hidden')
    addressInput.classList.add('border-red-500')
    return
  }

  //enviador o pedido para api whats
  const cartItems = cart
    .map(item => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price}|`
    })
    .join('')
  const message = encodeURIComponent(cartItems)
  const phone = '65981278291'

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    '_blank'
  )
  cart = []
  updateCartModal()
})

// verificar a hora e manipular o card horario

const checkRestaurantOpen = () => {
  const data = new Date()
  const hora = data.getHours()
  return hora >= 18 && hora < 22 //mudar
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove('bg-red-500')
  spanItem.classList.add('bg-green-600')
} else {
  spanItem.classList.remove('bg-green-600')
  spanItem.classList.add('bg-red-500')
}