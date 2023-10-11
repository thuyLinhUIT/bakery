const categories = document.querySelectorAll('[data-navigator]');
const mainNav = document.querySelector('.navContainer ul:first-child');
let navContainer = document.querySelector('.navContainer');
const backBtn = document.querySelectorAll('.back-icon')
const navMenuBtn = document.querySelector('.shortNavMenuBtn');
const logoutBtn = document.querySelector('.user-info li:nth-child(2)');
const shortNavLogoutBtn = document.querySelector(".user-logout i");
const shortNavLoginBtn = document.querySelector(".user-login");

logoutBtn.onclick = (e) => {
  if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("token");
    location.reload();
  }
}

shortNavLogoutBtn.onclick = (e) => {
  if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("token");
    location.reload();
  }
}

categories.forEach(category => {
  category.onclick = (e) => {
    const categoryDataClass = category.getAttribute("data-navigator");
    const categoryClass = document.querySelector(`.${categoryDataClass}`);
    categoryClass.style.left = "0";
    mainNav.style.transform = `translateX(-${navContainer.clientWidth}px)`
    navContainer.style.height = categoryClass.clientHeight + "px";
  }
})

backBtn.forEach(btn => {
  btn.onclick = (e) => {
    const parentNav = btn.parentElement.parentElement;
    parentNav.style.left = "100%";
    mainNav.style.transform = `translateX(0px)`
    navContainer.style.height = mainNav.clientHeight + "px";
  }
})

navMenuBtn.onclick = (e) => {
  backBtn.forEach(btn => {
    btn.dispatchEvent(new Event('click'));
  })
}
shortNavLoginBtn.onclick = (e) => {
  toggleUserForm();
  document.querySelector("#menu").checked = false;
}

// Chỉ xuống menu
document.querySelectorAll(".longNav-item").forEach((item, index) => {
  item.onclick = (e) => {
    document.querySelector(`.tab_btn:nth-child(${index + 1})`).dispatchEvent(new Event('click'))
  }
})

document.querySelectorAll(".navContainer > ul").forEach((item, index) => {
  if (index == 0) return;
  item.onclick = (e) => {
    document.querySelector(`.tab_btn:nth-child(${index})`).dispatchEvent(new Event('click'))
  }
})

