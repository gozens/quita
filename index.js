
const assinie = document.getElementById('assinie')
const defias = assinie.querySelector('.diapo')
console.log(defias)
// assinie\img\5.jpeg
function add(params) {
    const div = document.createElement('div')
    div.setAttribute('class','carosel')
    div.innerHTML += '<div class="imgs">'
    div.innerHTML += '<img src="assinie\\img\\'+params+'.jpeg" alt="">'
    div.innerHTML += '</div>'
    div.innerHTML +='<div class="tit_"><div class="titre2">carosel 1</div><div class="des">une petite description pour la carosel1</div>'
    div.innerHTML += '</div>'
    defias.appendChild(div)
}

console.log(defias);

const barre = document.querySelector('.bare')
let no_barre = 1
const nav = document.querySelector('.ville')
const el = barre.children


// annimation de la barre de navigation
const div_fl = document.createElement('div')
const header = document.querySelector('header')
div_fl.setAttribute('class','flotte')
header.appendChild(div_fl)

div_fl.onclick = ()=> {
    no()
    no_barre = 0
    
    anim_barre(no_barre)
    no_barre = 1
}

function no(){
    nav.style.width = 0+"px"
    nav.style.opacity = "0"
    
    div_fl.style.opacity = "0"
    div_fl.style.display = 'none'
    
    setTimeout(() => {
        
        nav.style.display = 'none'
    
    }, 700);
    
}

function anim_barre(x){
    if( x){
        el[1].style.opacity = "0"
        el[0].style.transform = 'rotate(-60deg) translate(-5px,5px)'
        el[2].style.transform = 'rotate(60deg) translate(-5px,-5px)'
        return
    }
    
    el[0].style.transform = 'rotate(0deg) translate(0)'
    el[2].style.transform = 'rotate(0deg) translate(0)'
    el[1].style.opacity = "1"
    
}

for(let els of el ) {
    try {
        
        el.style.transition ='1s linear'
    } catch (error) {
        
    }
}

barre.onclick = () => {
    if (no_barre){
        nav.style.display = 'block'

        div_fl.style.display = 'block'
        
        setTimeout(() => {
            nav.style.transition = '1s linear'
            nav.style.opacity = "1"
            nav.style.width = 190+"px"

            div_fl.style.opacity = "1"
        }, 300);
        
        anim_barre(no_barre)
        no_barre = 0
        return
    }
    
    anim_barre(no_barre)
    no_barre = 1
    
   no()
}

const ville = document.querySelectorAll('.ville_a')
const v = ville[2]
function fville(v) {
    v.transition = '2s linear'
    v.style.opacity = "1"
    v.style.transform = 'translate(0)'
    const c = v.querySelector('.desc')
    c.transition = '2s linear'
    c.style.opacity = "1"
    c.style.transform = 'translate(0)'
   
}

const ob = new IntersectionObserver(el =>{
    for (let i of el) {
       if (i.isIntersecting){
        fville(i.target)
        console.log(i.target.querySelector('.n').innerHTML)
        ob.unobserve(i.target)
       }
    }
},{
    threshold:0.5
})


for (const vl of ville) {
    try {ob.observe(vl)} catch (error) {}
}




import { Carosel } from "./fonction.js"

window.onload = ()=>{
    for (let i = 1; i < 12; i++) {
        add(i)
        
    }
    const panorama = document.querySelectorAll('.diapo')
    const option = {
        visible:1,
        defile:1,
        auto:true
    }
    panorama.forEach(diapo => {
        
        new Carosel(diapo,option)
    });
}

