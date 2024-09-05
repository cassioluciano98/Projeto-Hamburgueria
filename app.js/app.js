const spanItem = document.getElementById("date-span")
const menu = document.getElementById("menu")
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-counter")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];
let countCart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.style.display = 'flex';

})

// Fechar o modal do carrinho
cartModal.addEventListener('click', (event) => {
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener("click", ()=> {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (event) => {

    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name,price)

        countToCart()
        
    }
})

// Funcao para Contar itens no Veja Meu Carrinho
function countToCart(quantity) {
    countCart.push({
        quantity: 1,
    })

    cartCounter.innerHTML = countCart.length;
}


// Funcao para Adicionar Item e Valor ao Carrinho
function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;

    } else {
        cart.push({
        name,
        price,
        quantity: 1,
    })
    }

    updateCartModal()

    
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    this.total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement('div');
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: <span class="carrinhoQtd">${item.quantity}</span></p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: 'currency', 
        currency: "BRL"
    });

    

}

// Funcao para remover do carrinho
cartItemsContainer.addEventListener('click', (event) => {
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            cartCounter.innerHTML = --countCart.length;
            return;
        }

        cart.splice(index, 1);
        cartCounter.innerHTML = --countCart.length;
        updateCartModal();
        
    }
}

addressInput.addEventListener('input', (event) => {
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener('click', () => {

    const isOpen = checkRestaurantHour();
    if (!isOpen){
        Toastify({
            text: "O restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItem = cart.map((item) => {

        return(
            `${item.name} - Quantidade: (${item.quantity}) - Preço: R$ ${item.price.toFixed(2)} | `
        )

    }).join("")

    const message = encodeURIComponent(cartItem)
    const phone = "62999503551"

    window.open(`https://wa.me/${phone}?text=${message}%0ATotal a Pagar: R$ ${total.toFixed(2)}%0AEndereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})

// Verificar Horario de Funcionamento
function checkRestaurantHour(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora <= 22;
}

const isOpen = checkRestaurantHour();

if (isOpen){
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
} else {
    spanItem.classList.add('bg-red-500');
    spanItem.classList.remove('bg-green-600');
}