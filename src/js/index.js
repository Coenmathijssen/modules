import {TimelineMax, TweenMax, Power2 } from 'gsap/all'
// import { Tween } from 'gsap/gsap-core'

let timeOut

let addToCartButtons = document.querySelectorAll('.item__add-to-cart')
addToCartButtons = Array.from(addToCartButtons)

if (addToCartButtons.length > 0) {
    addToCartButtons.forEach(button => {
       button.addEventListener('click', event => {
           addToBasket(event.target)
       })
    })
}

function addToBasket (target) {
    // Selecting the right elements (images and names of shoes) and cloning them
    const image = target.parentNode.previousElementSibling.firstElementChild
    const name = target.parentNode.previousElementSibling.previousElementSibling.firstElementChild 
    const newImage = image.cloneNode(true)
    const newName = name.cloneNode(true)
    const floatingImage = image.cloneNode(true)

    // Create div, give the right class and append the chosen image to it
    let item = document.createElement('div')
    item.classList.add('shopping_cart_small__item')
    TweenMax.set(item, { opacity: 0 })
    item.appendChild(newImage)

    // Shopping cart small - The height is needed for the product overview lift up
    const shoppingCartSmall = document.querySelector('.shopping_cart_small')
    const shoppingCartSmallHeight = shoppingCartSmall.offsetHeight

    TweenMax.to('.products_overview', 0.5, { y: '-' + (shoppingCartSmallHeight - 40), ease: Power2.easeOut })

    clearTimeout(timeOut)
    
    timeOut = setTimeout(() => {
        TweenMax.to('.products_overview', 0.5, { y: 0, ease: Power2.easeOut })
    }, 4000);
    
    // Add item to shopping cart
    appendToShoppingCartSmall(item)

    // Animate
    const fivePlus = document.querySelector('.five-plus')
    fivePlus ? animate(fivePlus, image, floatingImage) : animate(item, image, floatingImage)

    // Update total
    updateTotal()
} 

function animate (item, image, floatingImage) {
    // Adding the right styling
    floatingImage.classList.add('floating-image')

    // Get x and y of starting position
    const startViewportOffset = image.getBoundingClientRect()
    const startTop = startViewportOffset.top
    const startLeft = startViewportOffset.left
    const startWidth = image.offsetWidth

    // Get x and y of ending position
    const endViewportOffset = item.getBoundingClientRect()
    const endTop = endViewportOffset.top
    const endLeft = endViewportOffset.left
    const endWidth = item.offsetWidth
    
    // Append floating image and start animation timeline
    document.querySelector('body').append(floatingImage)
    const tl = new TimelineMax()
    
    tl
    .set(floatingImage, { left: startLeft, top: startTop, width: startWidth })
    .to(floatingImage, 0.8, { left: endLeft, top: endTop, width: endWidth, ease: Power2.easeOut })
    .call(removeElement(floatingImage))
    .to(item, 0.3, { opacity: 1 }, "-=0.1")
}

function appendToShoppingCartSmall (item) {
    let shoppingCartItems = document.querySelectorAll('.shopping_cart_small__item')
    shoppingCartItems = Array.from(shoppingCartItems)
    const shoppingCartSmall = document.querySelector('.shopping_cart_small__items')
    const fivePlus = document.querySelector('.five-plus')

    // If there are more than 4 items, append the three dots and stop appending items
    if (shoppingCartItems.length > 4 && fivePlus) {
        item.classList.add('hidden')
        shoppingCartSmall.appendChild(item)
    } else if (shoppingCartItems.length < 4 && !fivePlus) {
        shoppingCartSmall.appendChild(item)
    } else if (shoppingCartItems.length = 4 && !fivePlus) {
        shoppingCartSmall.insertAdjacentHTML('beforeend', `<div class="shopping_cart_small__item five-plus"><div></div><div></div><div></div></div>`)
    }
}

function updateTotal () {
    let shoppingCartItems = document.querySelectorAll('.shopping_cart_small__item')
    shoppingCartItems = Array.from(shoppingCartItems)

    let total = document.querySelector('.shopping_cart_small__total')
    total.textContent = shoppingCartItems.length
}

function removeElement(element) {
    if (typeof(element) === "string") {
      element = document.querySelector(element);
    }
    return function() {
      element.parentNode.removeChild(element);
    };
  }