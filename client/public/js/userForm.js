function toSignUpForm() {
  var signupForm = document.querySelector(".signupForm");
  var signinForm = document.querySelector(".signinForm");
  signinForm.style.display = "none";
  signupForm.style.display = "flex";
}

function toSignInForm() {
  var signupForm = document.querySelector(".signupForm");
  var signinForm = document.querySelector(".signinForm");
  signinForm.style.display = "flex";
  signupForm.style.display = "none";
}

function toggleUserForm() {
  var userBg = document.querySelector(".userBackground");
  var inputs = document.querySelectorAll(".userBackground input");

  toSignInForm();

  inputs.forEach(input => {
    input.value = "";
  })

  document.querySelector(".warning-text").innerHTML = "";

  var userBgComputedStyle = window.getComputedStyle(userBg);
  var userPanel = document.querySelector(".userFormPanel");
  if (userBgComputedStyle.visibility === "visible") {
    userBg.style.visibility = "hidden";
    userPanel.style.transform = "translate(-50%, -50%) scale(0)"
    return;
  } else if (userBgComputedStyle.visibility === "hidden") {
    userBg.style.visibility = "visible";
    userPanel.style.transform = "translate(-50%, -50%) scale(1)"
    return;
  }
}

