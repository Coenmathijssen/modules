import {TimelineMax, TweenMax, Power2 } from 'gsap/all'

let timeOut
let totalPrice = 0

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
    const image = target.parentNode.parentNode.querySelector('.item__image-container').querySelector('img')
    const name = target.parentNode.parentNode.querySelector('.item__text-container').querySelector('.item__product-name')
    const price = target.parentNode.parentNode.querySelector('.item__text-container').querySelector('.item__product-price')
    const newImage = image.cloneNode(true)
    const newName = name.cloneNode(true)
    const newPrice = price.cloneNode(true)
    const floatingImage = image.cloneNode(true)

    // Create div, give the right class and append the chosen image to it
    let item = document.createElement('div')
    item.classList.add('shopping_cart_small__item')
    TweenMax.set(item, { opacity: 0 })
    item.appendChild(newImage)

    // Shopping cart small - The height is needed for the product overview lift up
    const shoppingCartSmall = document.querySelector('.shopping_cart_small')
    const shoppingCartSmallHeight = shoppingCartSmall.offsetHeight

    TweenMax.to('.shopping_cart_large', 0.5, { y: '100%', ease: Power2.easeOut })
    TweenMax.to('.products_overview', 0.5, { y: '-' + (shoppingCartSmallHeight - 40), ease: Power2.easeOut })

    // Wait for 4 seconds to animate shopping cart small out. Reset this timer if another item is added
    clearTimeout(timeOut)
    
    timeOut = setTimeout(() => {
        TweenMax.to('.products_overview', 0.5, { y: 0, ease: Power2.easeOut })
    }, 4000);
    
    // Add item to shopping cart small
    appendToShoppingCartSmall(item)

    // Add item to shopping cart large
    appendToShoppingCartLarge(newImage, newName, newPrice)

    // update total price
    updateTotalPrice(newPrice)

    // Animate
    const fivePlus = document.querySelector('.five-plus')
    fivePlus ? animateImage(fivePlus, image, floatingImage) : animateImage(item, image, floatingImage)

    // Update total items
    updateTotalItems()
} 

function animateImage (item, image, floatingImage) {
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

function updateTotalItems () {
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

function appendToShoppingCartLarge (image, name, price) {
    const shoppingCartLarge = document.querySelector('.shopping_cart_large__items')

    if (shoppingCartLarge) {
        const newImage = image.cloneNode(true)
        let item = document.createElement('div')
        item.classList.add('item')
        let left = document.createElement('div')
        left.classList.add('left')
        let imageContainer = document.createElement('div')
        imageContainer.classList.add('image-container')
        
        imageContainer.appendChild(newImage)
        left.appendChild(imageContainer)
        left.appendChild(name)
        item.appendChild(left)
        item.appendChild(price)

        shoppingCartLarge.appendChild(item)
    }
}

function updateTotalPrice (price) {
    if (price) {
        price = convertToNumber(price.textContent)
        price > 0 ? totalPrice = roundToTwoDecimals(totalPrice, price): totalPrice = totalPrice
        document.querySelector('.total').textContent = totalPrice
    }
}

function convertToNumber (string) {
    const number = parseFloat(string.replace(/,/g, '.'))
    return number
}

function roundToTwoDecimals (numberOne, numberTwo) {
    let roundedNumber = Math.round(((numberOne + numberTwo) + Number.EPSILON) * 100) / 100
    return roundedNumber
}

// Listen for swipe events
const shoppingCartSmall = document.querySelector(".shopping_cart_small")
const shoppingCartLarge = document.querySelector(".shopping_cart_large")

shoppingCartSmall.addEventListener("touchstart", startTouch, false)
shoppingCartSmall.addEventListener("touchmove", moveTouch, false)
shoppingCartLarge.addEventListener("touchstart", startTouch, false)
shoppingCartLarge.addEventListener("touchmove", moveTouch, false)

let initialX = null
let initialY = null

function startTouch(e) {
    initialX = e.touches[0].clientX
    initialY = e.touches[0].clientY
}

function moveTouch(e) {
    let swipe

    if (initialX === null) {
      return
    }

    if (initialY === null) {
      return
    }

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY

    const diffX = initialX - currentX
    const diffY = initialY - currentY

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        console.log("swiped left")
        swipe = 'left'
      } else {
        console.log("swiped right")
        swipe = 'right'
      }  
    } else {
      // sliding vertically
      if (diffY > 0) {
        console.log("swiped up")
        swipe = 'up'
        showShoppingCartLarge()
      } else {
        console.log("swiped down")
        swipe = 'down'
        hideShoppingCartLarge()
      }  
    }

    initialX = null
    initialY = null
    
    return swipe
};

function showShoppingCartLarge () {
    const shoppingCartLarge = document.querySelector('.shopping_cart_large')
    const shoppingCartLargeHeight = shoppingCartLarge.offsetHeight

    TweenMax.to(shoppingCartLarge, 0.5, { y: 0, ease: Power2 })
    TweenMax.to('.products_overview', 0.4, { y: '-' + (shoppingCartLargeHeight - 40), delay: 0.3, ease: Power2.easeOut })

    clearTimeout(timeOut)
}

function hideShoppingCartLarge () {
    const shoppingCartSmall = document.querySelector('.shopping_cart_small')
    const shoppingCartSmallHeight = shoppingCartSmall.offsetHeight
    
    TweenMax.to('.products_overview', 0.5, { y: '-' + (shoppingCartSmallHeight - 40), ease: Power2.easeOut })
    TweenMax.to('.shopping_cart_large', 0.5, { y: '100%', ease: Power2 })

    clearTimeout(timeOut)
    
    timeOut = setTimeout(() => {
        TweenMax.to('.products_overview', 0.5, { y: 0, ease: Power2.easeOut })
    }, 4000)
}