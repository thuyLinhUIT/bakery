const tabs = document.querySelectorAll('.tab_btn');
const wrappers = document.querySelectorAll('.wrapper');

tabs.forEach((tab, index) => {
  tab.addEventListener('click', (e) => {
    tabs.forEach(tab => { tab.classList.remove('active') });
    tab.classList.add('active');

    var line = document.querySelector('.line');
    line.style.width = e.target.offsetWidth + "px";
    line.style.left = e.target.offsetLeft + "px";

    wrappers.forEach(content => { content.classList.remove('active') });
    wrappers[index].classList.add('active');
  })
})

