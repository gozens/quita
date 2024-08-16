const body = document.querySelector('body')
const nav = () => {
    option.classList.toggle(classNavbar)
    navBar.previousElementSibling.classList.toggle(classNavbar)
    navBar.classList.toggle(classNavbar)
}

const classNavbar = 'active'
const option = body.querySelector('.option')
const navBar = body.querySelector('body > nav')
navBar.previousElementSibling.onclick = () => nav()
option.onclick = () => nav()

console.clear()

window.onload = () => {
    body.style.opacity = 1
}