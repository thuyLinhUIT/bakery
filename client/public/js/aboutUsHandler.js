
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.onmouseenter = (e) => {
    cards.forEach(card => {
      card.classList.add("inactive");
    })
    card.classList.add("active");
  }

  card.onmouseleave = (e) => {
    cards.forEach(card => {
      card.classList.remove("inactive");
      card.classList.remove("active");
    })
  }
})
