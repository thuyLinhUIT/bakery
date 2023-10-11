const emptyReturnButton = document.querySelector('.cartEmpty .continue');
const cartBg = document.querySelector('.cartBackground');
const cartPanel = document.querySelector('.cartPanel');
const cartOpenBtn = document.querySelector('.user-info li:nth-child(1)');
const shortNavCartBtn = document.querySelector('.shortNavMenuBtn.cart-icon');
const longNavCartBtn = document.querySelector('.longNavMenuBtn.cart-icon');
const navMenuCheckBox = document.querySelector('#menu');
const cartCloseBtn = document.querySelector('.cartPanel .cartCloseBtn');
const cartContinue = document.querySelector(".cartBtns .continue");


emptyReturnButton.onclick = (e) => {
  cartBg.classList.remove('active');
  cartPanel.classList.remove('active');
  document.querySelector("#cakes").scrollIntoView();
}

longNavCartBtn.onclick = (e) => {
  cartBg.classList.add('active');
  cartPanel.classList.add('active');
}

shortNavCartBtn.onclick = (e) => {
  cartBg.classList.add('active');
  cartPanel.classList.add('active');
}

cartOpenBtn.onclick = (e) => {
  cartBg.classList.add('active');
  cartPanel.classList.add('active');
}

cartBg.onclick = (e) => {
  if (cartBg.classList.contains('active') && cartPanel.classList.contains('active')) {
    if (cartBg.contains(e.target)) {
      if (e.target === cartBg) {
        cartBg.classList.remove('active');
        cartPanel.classList.remove('active');
      }
    }
  }
}

cartCloseBtn.onclick = (e) => {
  cartBg.classList.remove('active');
  cartPanel.classList.remove('active');
}

cartContinue.onclick = (e) => {
  cartBg.classList.remove('active');
  cartPanel.classList.remove('active');
}

