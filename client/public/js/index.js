// Cake add 


// login
{
  var loginForm = document.querySelector(".signinForm .userForm");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    var pwdInput = document.querySelector(".signinForm .userForm input[name=password]")
    var userInput = document.querySelector(".signinForm .userForm input[name=username]")

    const response = await fetch("/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: userInput.value,
        password: pwdInput.value
      })
    })

    const jwtoken = await response.json();
    if (jwtoken.success) {
      localStorage.setItem("token", JSON.stringify(jwtoken.token))
      alert("Login successfully");
      location.reload();
      document.querySelector(".userCloseButton").dispatchEvent(new Event("click"));
    } else {
      document.querySelector(".warning-text").innerHTML = `${jwtoken.message}`
    }
  })
}



// Đăng ký
{
  var signupForm = document.querySelector(".signupForm .userForm");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    var userInput = document.querySelector(".signupForm .userForm input[name=username]");
    var pwdInput = document.querySelector(".signupForm .userForm input[name=password]");
    var confirmPwdInput = document.querySelector(".signupForm .userForm input[name=confirmPassword]");
    var nameInput = document.querySelector(".signupForm .userForm input[name=name]");
    if (confirmPwdInput.value !== pwdInput.value) {
      document.querySelector(".signupForm .userForm .warning-text").innerHTML = "Password does not match";
      return;
    }

    let response = await fetch("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userInput.value,
        password: pwdInput.value,
        name: nameInput.value,
      })
    })

    const jwtoken = await response.json();
    if (jwtoken.success) {
      alert("Sign up successfully");
      document.querySelectorAll(".signupForm .userForm input").forEach(input => {
        input.value = "";
      })
      toSignInForm();
    } else {
      document.querySelector(".signupForm .userForm .warning-text").innerHTML = `${jwtoken.message}`
    }
  })
}




window.onresize = (e) => {
  document.querySelector(".tab_btn.active").dispatchEvent(new Event("click"));
}

window.reloadCakes = async function reloadCakes(sweetCakes, saltCakes, breads, isAdmin) {
  await cakeForUser(sweetCakes, isAdmin, "banhngot");
  await cakeForUser(saltCakes, isAdmin, "banhman");
  await cakeForUser(breads, isAdmin, "banhmi");
}

window.onload = async () => {

  const { username, isAdmin } = checkUser();


  // Add group id to Wrapper
  const cakeWrappers = document.querySelectorAll(".wrapper");
  const groupIds = await fetch("/group").then(res => res.json());

  cakeWrappers.forEach((wrapper, index) => {
    wrapper.setAttribute("id", groupIds[index].group_id);
  })

  var thanhtoan = document.querySelector(".thanhtoan");
  thanhtoan.onclick = (e) => {
    if (username) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      e.preventDefault();
      alert(`Thanh toán thành công ${cart.length} sản phẩm`);;
      localStorage.removeItem("cart");
      document.querySelector(".eraseCart").dispatchEvent(new Event("click"));
    } else {
      alert("Hãy đăng nhập để thanh toán");
    }
  }


  // Chọn tab đầu tiên khi load trang
  document.querySelector(".tab_btn").dispatchEvent(new Event("click"));

  var sweetCakes, saltCakes, breads, allCakes;

  if (!localStorage.getItem("cakes")) {
    sweetCakes = await fetch("/cake/group/G001").then(res => res.json())
    saltCakes = await fetch("/cake/group/G002").then(res => res.json())
    breads = await fetch("/cake/group/G003").then(res => res.json())
    allCakes = [...sweetCakes, ...saltCakes, ...breads];
    localStorage.setItem("cakes", JSON.stringify({ sweetCakes, saltCakes, breads }))
    await reloadCakes(sweetCakes, saltCakes, breads, isAdmin);
    // loadCartProduct();
  } else {
    const { sweetCakes, saltCakes, breads } = JSON.parse(localStorage.getItem("cakes"));
    allCakes = [...sweetCakes, ...saltCakes, ...breads];
    await reloadCakes(sweetCakes, saltCakes, breads, isAdmin);
    // loadCartProduct();
  }

  // Load cart
  checkCartInCache();




  createCartList(allCakes);

  if (isAdmin) {

    loadCakeBtns(allCakes);

    const addForm = document.querySelector(".cake-add-formContainer.add .cake-add-form");
    addForm.onsubmit = async (event) => {
      event.preventDefault();
      const cakeAddName = document.querySelector(".cake-add-formContainer.add input[name=name]");
      const cakeAddPrice = document.querySelector(".cake-add-formContainer.add input[name=price]");
      const cakeAddImage = document.querySelector(".cake-add-formContainer.add input[name=image]");
      const cakeAddUnit = document.querySelector(".cake-add-formContainer.add select[name=unit]");
      const cakeAddDesc = document.querySelector(".cake-add-formContainer.add textarea");
      const cakeAddGroupId = document.querySelector(".cake-add-formContainer.add input[name=group_id]");
      const cakeAddTypeId = document.querySelector(".cake-add-formContainer.add input[name=type_id]");

      const response = await fetch("/cake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cakeAddName.value,
          price: cakeAddPrice.value,
          image: cakeAddImage.value,
          unit: cakeAddUnit.value,
          group_id: cakeAddGroupId.value,
          type_id: cakeAddTypeId.value,
          description: cakeAddDesc.value
        })
      })
      const result = await response.json();
      if (result.success) {
        alert("Thêm thành công");
        document.querySelector(".cake-add-formContainer.add").classList.remove("active");
        location.reload();
      } else {
        alert("Thêm thất bại");
      }
    }
  }

}




function createCartList(allCakes) {
  const cartAddBtns = document.querySelectorAll('.cart-btn');
  cartAddBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const { cake_id, name, price, image } = allCakes.find(cake => cake.cake_id === e.target.parentNode.id);
      const localCart = JSON.parse(localStorage.getItem("cart"));



      // Bật tắt hiển thị Empty / HasProduct
      document.querySelector(".cartEmpty").classList.remove("active")
      document.querySelector(".cartHasProduct").classList.add("active");

      if (localCart) {
        if (localCart.findIndex(product => product.cake_id === cake_id) > -1)
          return;
        localCart.push({ cake_id, name, price, image, quantity: 1 });
        document.querySelector(".cart-product-container").innerHTML = addToCart(localCart)
        localStorage.setItem("cart", JSON.stringify(localCart));
        document.querySelectorAll(".cart-count").forEach(node => {
          node.classList.add("hasProduct");
          node.innerHTML = localCart.length;
        })
      } else {
        localStorage.setItem("cart", JSON.stringify([{ cake_id, name, price, image, quantity: 1 }]))
        document.querySelector(".cart-product-container").innerHTML = addToCart(JSON.parse(localStorage.getItem("cart")))
        document.querySelectorAll(".cart-count").forEach(node => {
          node.classList.add("hasProduct");
          node.innerHTML = JSON.parse(localStorage.getItem("cart")).length;
        })
      }
      loadCartProduct();
    }
  })

}


function loadCartProduct() {
  const localCart = JSON.parse(localStorage.getItem("cart"));
  calculateTotalPrice();
  document.querySelectorAll(".cart-product").forEach(prod => {

    const decr = document.querySelector(`[id='${prod.id}'] .quantity-decr-btn`)
    const incr = document.querySelector(`[id='${prod.id}'] .quantity-incr-btn`)
    const quantity = document.querySelector(`[id='${prod.id}'] .quantity-value`)
    const sum = document.querySelector(`[id='${prod.id}'] .sum-value`)
    const product = localCart.find(product => product.cake_id === prod.id);



    decr.onclick = (e) => {
      if (Number(quantity.innerHTML) === 1) return;
      quantity.innerHTML = Number(quantity.innerHTML) - 1;
      sum.innerHTML = threeDigitNumber(Number(quantity.innerHTML) * Number(prod.querySelector(".price").innerHTML.slice(0, -1)) * 1000) + " đ";
      product.quantity = Number(quantity.innerHTML);
      localStorage.setItem("cart", JSON.stringify(localCart))
      calculateTotalPrice();
    }

    incr.onclick = (e) => {
      quantity.innerHTML = Number(quantity.innerHTML) + 1;
      sum.innerHTML = threeDigitNumber(Number(quantity.innerHTML) * Number(prod.querySelector(".price").innerHTML.slice(0, -1)) * 1000) + " đ";
      product.quantity = Number(quantity.innerHTML);
      localStorage.setItem("cart", JSON.stringify(localCart))
      calculateTotalPrice();
    }
  })
}

function calculateTotalPrice() {
  const localCart = JSON.parse(localStorage.getItem("cart"));
  if (localCart)
    document.querySelector(".totalPrice").innerHTML = threeDigitNumber(localCart.reduce((sum, product) => sum + product.quantity * product.price, 0)) + " VND";
}

function checkCartInCache() {
  const cart = localStorage.getItem("cart");
  if (cart) {
    document.querySelector(".cartEmpty").classList.remove("active")
    document.querySelector(".cartHasProduct").classList.add("active");
    document.querySelector(".cart-product-container").innerHTML = addToCart(JSON.parse(cart));
    document.querySelectorAll(".cart-count").forEach(node => {
      node.classList.add("hasProduct");
      node.innerHTML = JSON.parse(cart).length;
    })
    loadCartProduct();
  }
}

window.eraseProductInCart = function(product_id) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const newCart = cart.filter(product => product.cake_id !== product_id);
  localStorage.setItem("cart", JSON.stringify(newCart));
  document.querySelector(".cart-product-container").innerHTML = addToCart(newCart);
  document.querySelectorAll(".cart-count").forEach(node => {
    node.classList.add("hasProduct");
    node.innerHTML = newCart.length;
  })
  if (newCart.length === 0) {
    eraseCart();
  }
  calculateTotalPrice();
}

window.eraseCart = function eraseCart() {
  localStorage.removeItem("cart");
  document.querySelector(".cart-product-container").innerHTML = "";
  document.querySelector(".cartEmpty").classList.add("active");
  document.querySelector(".cartHasProduct").classList.remove("active");
  document.querySelectorAll(".cart-count").forEach(node => {
    node.classList.remove("hasProduct");
    node.innerHTML = "";
  })
}

function addToCart(cart) {
  let cartHTML = "";


  cart.forEach(product => {
    cartHTML += `
    <div class="cart-product" id="${product.cake_id}">
      <div class="cart-product-img"><img src="${product.image}" alt=""></div>
      <div class="cart-product-info">
        <div class="cart-product-name info">
          <h3>Tên bánh: </h3>
          <div class="name">${product.name}</div>
        </div>
        <div class="cart-product-price info">
          <h3 style="margin-right: 0.5rem">Giá: </h3>
          <div class="price">${threeDigitNumber(product.price)} đ</div>
        </div>
        <div onclick="eraseProductInCart('${product.cake_id}')" class="cart-product-delete"><i style="pointer-events: none" class="fa-solid fa-trash"></i></div>
      </div>
      <div class="cart-product-quantity">
        <div class="info">
          <h3>Số lượng: </h3>
          <div class="quantity">
            <button class="quantity-decr-btn">-</button>
      <span class="quantity-value">${product.quantity}</span>
            <button class="quantity-incr-btn">+</button>
          </div>
        </div>
        <div class="sum">
          <h3>Thành tiền: </h3>
          <div class="sum-value">${threeDigitNumber(product.price * product.quantity)} đ</div>
        </div>
      </div>
    </div>
    `})

  return cartHTML;
}


function checkUser() {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp > Date.now() / 1000) {
      document.querySelector(".login-button").classList.remove("notUser");
      document.querySelector(".logged-in").classList.add("isUser");
      document.querySelector(".longNavMenuBtn").classList.add("isUser");
      document.querySelector(".user-login-logout").classList.add("isUser");
      document.querySelectorAll(".user-name").forEach(namespace => { namespace.innerHTML = payload.name });

      return { username: payload.name, isAdmin: payload.isAdmin };

    } else {
      alert("Phiên đăng nhập hết hạn");
      // document.querySelector("#login-btn").classList.remove("isUser");
      document.querySelector(".logged-in").classList.remove("isUser");
      document.querySelector(".login-button").classList.add("notUser");
      document.querySelector(".logged-in").classList.remove("isUser");
      document.querySelector(".user-login-logout").classList.remove("isUser");
      document.querySelector(".longNavMenuBtn").classList.remove("isUser");
      localStorage.removeItem("token");
      return { username: null, isAdmin: null };
    }
  } else {
    document.querySelector(".logged-in").classList.remove("isUser");
    document.querySelector(".login-button").classList.add("notUser");
    document.querySelector(".logged-in").classList.remove("isUser");
    document.querySelector(".user-login-logout").classList.remove("isUser");
    document.querySelector(".longNavMenuBtn").classList.remove("isUser");
    return { username: null, isAdmin: null };
  }

}


function cakeDeleteBtns() {
  const removeBtns = document.querySelectorAll(".cart-delete-btn");
  removeBtns.forEach(btn => {
    btn.onclick = async (e) => {
      if (window.confirm("Bạn có muốn xóa sản phẩm này?")) {
        const res = await fetch(`/cake/${e.target.parentNode.parentNode.id}`, {
          method: "DELETE"
        })

        const data = await res.json();
        if (data.success) {
          let curData = localStorage.getItem("cakes")
          if (curData) {
            curData = JSON.parse(curData);
            if (data.cake.group_id.trim() === "G001") {
              curData.sweetCakes = curData.sweetCakes.filter(cake => cake.cake_id.trim() !== data.cake.cake_id.trim())

            } else if (data.cake.group_id.trim() === "G002") {
              curData.saltCakes = curData.saltCakes.filter(cake => cake.cake_id.trim() !== data.cake.cake_id.trim())
            } else {
              curData.breads = curData.breads.filter(cake => cake.cake_id.trim() !== data.cake.cake_id.trim())
            }
            localStorage.setItem("cakes", JSON.stringify(curData));
          }
          alert("Xóa sản phẩm thành công");
          // location.reload();
          const { isAdmin } = checkUser();
          await reloadCakes(curData.sweetCakes, curData.saltCakes, curData.breads, isAdmin);
        }
      }
    }
  })

}


function cakeAddBtns() {
  const cakeAddBtns = document.querySelectorAll(".cake-add");
  cakeAddBtns.forEach(btn => {
    btn.onclick = async (e) => {
      e.preventDefault();
      e.target.parentNode.querySelector(".cake-add-formContainer").classList.add("active");
      e.target.parentNode.querySelector("form").onsubmit = async (ev) => {
        ev.preventDefault();
        const cakeName = ev.target.querySelector("input[name=name]").value;
        const cakePrice = ev.target.querySelector("input[name=price]").value;
        const cakeImage = ev.target.querySelector("input[name=image]").value;
        const cakeUnit = ev.target.querySelector("select[name=unit]").value;
        const cakeDesc = ev.target.querySelector("textarea").value;
        const cakeGroupId = ev.target.querySelector("input[name=group_id]").value;
        const cakeTypeId = ev.target.querySelector("select[name=type_id]").value;
        const res = await fetch("/cake", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cakeName,
            price: cakePrice,
            image: cakeImage,
            unit: cakeUnit,
            description: cakeDesc,
            group_id: cakeGroupId,
            type_id: cakeTypeId,
          })
        })

        const data = await res.json()
        if (data.success) {
          let curData = localStorage.getItem("cakes");
          if (curData) {
            curData = JSON.parse(curData)
            if (cakeGroupId.trim() === "G001") {
              curData.sweetCakes.push(data.cake);
            } else if (cakeGroupId.trim() === "G002") {
              curData.saltCakes.push(data.cake);
            } else {
              curData.breads.push(data.cake);
            }
            localStorage.setItem("cakes", JSON.stringify(curData));
            ev.target.querySelector(".cake-add-close-btn").dispatchEvent(new Event("click"));
          }
          alert("Thêm sản phẩm thành công");
          location.reload();

        } else {
          alert("Thêm sản phẩm thất bại");
        }
      }
    }
  })
  const closeCakeAddBtns = document.querySelectorAll(".cake-add-container .cake-add-close-btn");

  closeCakeAddBtns.forEach(btn => btn.onclick = (e) => {
    e.target.parentNode.parentNode.classList.remove("active");
  })

}

function cakeEditBtns() {
  const editBtns = document.querySelectorAll(".cart-edit-btn");
  editBtns.forEach(btn => {
    btn.onclick = async (e) => {
      const curId = e.target.parentNode.parentNode.id;
      document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer`).classList.add("active");
      const response = await fetch(`/cake/${curId}`);
      const cake = await response.json();

      const cakeEditName = document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer input[name=name]`);
      const cakeEditPrice = document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer input[name=price]`);
      const cakeEditImage = document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer input[name=image]`);
      const cakeEditUnit = document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer select[name=unit]`);
      const cakeEditDesc = document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer textarea`);
      const cakeEditGroupId = document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer input[name=group_id]`);
      const cakeEditTypeId = document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer select[name=type_id]`);

      const cakeEditForm = document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer.edit .cake-add-form`);

      cakeEditForm.onsubmit = async (event) => {
        event.preventDefault();
        const updateCake = {
          name: cakeEditName.value,
          price: cakeEditPrice.value,
          image: cakeEditImage.value,
          unit: cakeEditUnit.value,
          group_id: cakeEditGroupId.value,
          type_id: cakeEditTypeId.value,
          cake_id: curId,
          description: cakeEditDesc.value
        }
        const response = await fetch(`/cake/${curId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateCake)
        })
        const result = await response.json();
        if (result.success) {
          let cakesInCache = JSON.parse(localStorage.getItem("cakes"));
          if (cakesInCache) {
            if (updateCake.group_id.trim() === "G001") {
              cakesInCache.sweetCakes = cakesInCache.sweetCakes.map(cake => {
                if (cake.cake_id === curId) {
                  return updateCake;
                }
                return cake;
              })
            }
            if (updateCake.group_id.trim() === "G002") {
              cakesInCache.saltCakes = cakesInCache.saltCakes.map(cake => {
                if (cake.cake_id === curId) {
                  return updateCake;
                }
                return cake;
              })
            }
            if (updateCake.group_id.trim() === "G003") {
              cakesInCache.breads = cakesInCache.breads.map(cake => {
                if (cake.cake_id === curId) {
                  return updateCake;
                }
                return cake;
              })
            }
          }
          localStorage.setItem("cakes", JSON.stringify(cakesInCache));
          const { isAdmin } = checkUser();
          await reloadCakes(cakesInCache.sweetCakes, cakesInCache.saltCakes, cakesInCache.breads, isAdmin);

          alert("Cập nhật thành công");
          document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer`).classList.remove("active");
        } else {
          alert("Cập nhật thất bại");
        }
      }



      cakeEditName.value = cake.name;
      cakeEditPrice.value = cake.price;
      cakeEditImage.value = cake.image;
      cakeEditUnit.value = cake.unit;
      cakeEditDesc.value = cake.description;
      cakeEditTypeId.value = cake.type_id;
      cakeEditName.focus();
      cakeEditPrice.focus();
      cakeEditImage.focus();
      cakeEditUnit.focus();



      const closeCakeEditBtn = document.querySelector(`.cake-card[id='${curId}'] .cake-add-close-btn`)
      closeCakeEditBtn.onclick = (e) => {
        document.querySelector(`.cake-card[id='${curId}'] .cake-add-formContainer`).classList.remove("active");
      }
    }
  })

}


function loadCakeBtns(allCakes) {
  createCartList(allCakes);
  cakeDeleteBtns();
  cakeEditBtns();
  cakeAddBtns();
}

async function cakeForUser(cakes, isAdmin, cakeType) {
  const cakeWrapper = document.querySelector(`.wrapper.${cakeType}`);
  cakeWrapper.innerHTML = "";
  let res = await fetch("/allType");
  let allTypes = (await res.json()).types;
  let currentGroupTypes = allTypes.filter(type => type.group_id === cakeWrapper.id);
  let cakeAddForm = isAdmin ? `        <div class="cake-add-formContainer add">
          <form class="cake-add-form">
            <div class="cake-add-close-btn"><i style="pointer-events: none" class="fa-solid fa-xmark"></i></div>
            <div class="cake-add-form-title">Thêm bánh mới</div>
            <div class="cake-add-form-input">
              <input type="text" id="cake-name" name="name" placeholder="">
              <label for="cake-name">Tên bánh</label>
            </div>
            <div class="cake-add-form-input">
              <input type="text" id="cake-price" name="price" placeholder="">
              <label for="cake-price">Giá</label>
            </div>
            <div class="cake-add-form-input">
              <input type="text" id="cake-img" name="image" placeholder="">
              <label for="cake-img">Hình ảnh</label>
            </div>
              <p class="cake-img-note">Dán link hình ảnh vào ô trên</p>

            <div class="cake-add-form-input">
              <select name="unit" id="cake-unit">
                <option value="cái">Cái</option>
                <option value="hộp">Hộp</option>
              </select>
              <label for="cake-unit" id="cake-unit-label">Đơn vị</label>
            </div>
            <div class="cake-add-form-input">
              <select name="type_id" id="cake-type">
                ${currentGroupTypes.map(type => `<option value="${type.type_id}">${type.type_name}</option>`)}
              </select>
              <label for="cake-type" id="cake-unit-label">Loại bánh</label>
            </div>
            <div class="cake-add-form-input">
              <textarea id="cake-desc" name="description" placeholder="Mô tả"></textarea>
            </div>
            <div class="cake-add-form-input">
              <input type="text" id="cake-type" disabled  placeholder="${cakeWrapper.getAttribute("data-type")}">
              <input type="hidden" name="group_id" value="${cakeWrapper.id} "/>
            </div>
            <button>Submit</button>
          </form>
        </div>
` : ``;

  // <input type="hidden" name="cake_id" value="${cake.cake_id}"/>
  // <input type="hidden" name="type_id" value="${cake.type_id}"/>

  // cakeWrapper.innerHTML = cakeAddForm;
  cakes.forEach(cake => {
    cakeWrapper.innerHTML += `
        <!-- Item 1 -->
        <div class="cake-card" id=${cake.cake_id}>
          ${isAdmin ? `<div class="cake-add-formContainer edit">
          <form class="cake-add-form" method="put" action="/cake/${cake.cake_id}">
            <div class="cake-add-close-btn"><i class="fa-solid fa-xmark"></i></div>
            <div class="cake-add-form-title">Chỉnh sửa bánh</div>
            <div class="cake-add-form-input">
              <input type="text" id="cake-name" name="name" placeholder="">
              <label for="cake-name">Tên bánh</label>
            </div>
            <div class="cake-add-form-input">
              <input type="text" id="cake-price" name="price" placeholder="">
              <label for="cake-price">Giá</label>
            </div>
            <div class="cake-add-form-input">
              <input type="text" id="cake-img" name="image" placeholder="">
              <label for="cake-img">Hình ảnh</label>
            </div>
              <p class="cake-img-note">Dán link hình ảnh vào ô trên</p>

            <div class="cake-add-form-input">
              <select name="unit" id="cake-unit">
                <option value="cái">Cái</option>
                <option value="hộp">Hộp</option>
              </select>
              <label for="cake-unit" id="cake-unit-label">Đơn vị</label>
            </div>
            <div class="cake-add-form-input">
              <select name="type_id" id="cake-type-edit">
              ${currentGroupTypes.map(type => `<option value="${type.type_id}">${type.type_name}</option>`)}
              </select>
              <label for="cake-type-edit" id="cake-type-label">Loại bánh</label>
            </div>

            <div class="cake-add-form-input">
              <textarea id="cake-desc" name="description" placeholder="Mô tả"></textarea>
            </div>
              
            <div class="cake-add-form-input">
              <input type="text" id="cake-type" disabled  placeholder="${cakeWrapper.getAttribute("data-type")}">
              <input type="hidden" name="group_id" value="${cake.group_id} "/>
              <input type="hidden" name="cake_id" value="${cake.cake_id}"/>
              <input type="hidden" name="type_id" value="${cake.type_id}"/>
            </div>
            <button>Submit</button>
          </form>
        </div>
`: ``}
          <img src="${cake.image}" alt="">
          <h3 class="name">${cake.name}</h3>
          <div class="price">${threeDigitNumber(cake.price)} VND / ${cake.unit}</div>
          ${isAdmin ?
        `<div class="cart-edit">
                <button class="cart-edit-btn">Chỉnh sửa</button>
                <span class="cart-delete-btn"><i style="pointer-events: none" class="fa-solid fa-trash"></i></span>
              </div>` : ``}
          <button class="cart-btn">Thêm giỏ hàng</button>
        </div>`;
  })

  if (isAdmin)
    cakeWrapper.innerHTML +=
      ` 
      <div class="cake-add-container" method="POST" action="/cake">
          ${cakeAddForm}
          <div class="cake-add">
            +
          </div>
          <div class="cake-add-text">Thêm bánh</div>
        </div>
      `
  const { sweetCakes, saltCakes, breads } = JSON.parse(localStorage.getItem("cakes"));
  const allCakes = [...sweetCakes, ...saltCakes, ...breads];


  loadCakeBtns(allCakes);





  return document.querySelectorAll(".cake-add")
}


function threeDigitNumber(number) {
  if (!number) return 0
  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
}
