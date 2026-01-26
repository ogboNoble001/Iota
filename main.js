const overlay = document.querySelector(".mainOverlay");
const bottomSheet = document.querySelector(".info-banner");

function openSheet() {
  overlay.classList.add("active");
  bottomSheet.classList.add("active");
}

function closeSheet() {
  overlay.classList.remove("active");
  bottomSheet.classList.remove("active");
}

setTimeout(openSheet, 500);

overlay.addEventListener("click", closeSheet);