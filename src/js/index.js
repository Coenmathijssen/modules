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
    let clickedItem = target.parentNode.parentNode
    const image = clickedItem.querySelector('.item__image-container img')
    const name = clickedItem.querySelector('.item__text-container .item__product-name')
    const price = clickedItem.querySelector('.item__text-container .item__product-price')
    const newImage = image.cloneNode(true)
    const newName = name.cloneNode(true)
    const newPrice = price.cloneNode(true)
    const floatingImage = image.cloneNode(true)
    const attribute = clickedItem.getAttribute('item-number')

    // Create div, give the right class and atrribute and append the chosen image to it
    let item = document.createElement('div')
    item.classList.add('shopping_cart_small__item')
    item.setAttribute('item-number', attribute)
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
    appendToShoppingCartLarge(newImage, newName, newPrice, attribute)

    // update total price
    updateTotalPrice()

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

function appendToShoppingCartLarge (image, name, price, attribute) {
    const shoppingCartLarge = document.querySelector('.shopping_cart_large__items')

    if (shoppingCartLarge) {
        const newImage = image.cloneNode(true)
        let item = document.createElement('div')
        item.classList.add('item')
        item.setAttribute('item-number', attribute)
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

        // Add event listener for remove on swipe
        const shoppingCartLargeItems = Array.from(shoppingCartLarge.querySelectorAll('.item'))
        shoppingCartLargeItems.forEach(item => {
            item.addEventListener("touchstart", startTouchHorizontal, false)
            item.addEventListener("touchmove", moveTouchHorizontal, false)
        }) 
    }
}

function updateTotalPrice () {
    const prices = Array.from(shoppingCartLarge.querySelectorAll('.item__product-price'))
    if (prices.length > 0) {
        const pricesArray = prices.map(item => { return convertToNumber(item.textContent) })
        const total = roundToTwoDecimals(pricesArray.reduce((a, b) => a + b))
        document.querySelector('.total').textContent = total
    } else {
        document.querySelector('.total').textContent = '0'
    }
}

function convertToNumber (string) {
    const number = parseFloat(string.replace(/,/g, '.'))
    return number
}

function roundToTwoDecimals (number) {
    let roundedNumber = Math.round((number + Number.EPSILON) * 100) / 100
    return roundedNumber
}

// Listen for swipe events
const shoppingCartSmall = document.querySelector(".shopping_cart_small")
const shoppingCartLarge = document.querySelector(".shopping_cart_large")

shoppingCartSmall.addEventListener("touchstart", startTouchVertical, false)
shoppingCartSmall.addEventListener("touchmove", moveTouchVertical, false)
shoppingCartLarge.addEventListener("touchstart", startTouchVertical, false)
shoppingCartLarge.addEventListener("touchmove", moveTouchVertical, false)

let initialXVertical = null
let initialYVertical = null

function startTouchVertical(e) {
    initialXVertical = e.touches[0].clientX
    initialYVertical = e.touches[0].clientY
}

// Show hide shopping cart large
function moveTouchVertical(e) {
    if (initialXVertical === null) {
      return
    }

    if (initialYVertical === null) {
      return
    }

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY

    const diffX = initialXVertical - currentX
    const diffY = initialYVertical - currentY

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Do nothing
    } else {
      // sliding vertically
      if (diffY > 0) {
        showShoppingCartLarge()
      } else {
        hideShoppingCartLarge()
      }  
    }

    initialXVertical = null
    initialYVertical = null
};

let inititalXHorizontal = null
let initialYHorizontal = null

function startTouchHorizontal(e) {
    inititalXHorizontal = e.touches[0].clientX
    initialYHorizontal = e.touches[0].clientY
}

// Delete item from shopping cart and update everything
function moveTouchHorizontal(e) {
    if (inititalXHorizontal === null) {
      return
    }

    if (initialYHorizontal === null) {
      return
    }

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY

    const diffX = inititalXHorizontal - currentX
    const diffY = initialYHorizontal - currentY

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      console.log(diffX)
      if (diffX > 0) {
        const element = e.target
        const imageContainer = element.querySelector('.left .image-container')
        const itemSmall = shoppingCartSmall.querySelector(`[item-number="${element.getAttribute('item-number')}"]`)
        console.log(itemSmall)

        const tl = new TimelineMax()
        tl
        .to(imageContainer, 0.5, { backgroundColor: '#990000' })
        .to(element, 0.5, { x: '-120%' }, '-=.2')
        .call(removeElement(element))
        .call(removeElement(itemSmall))
        .call(updateTotalItems)
        .call(updateTotalPrice)
      } else {
        console.log("swiped right")
      }  
    }

    inititalXHorizontal = null
    initialYHorizontal = null
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