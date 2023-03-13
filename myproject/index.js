

// const barre = document.querySelector('.bare')
// const ville = document.querySelector('.ville')
// let i = 0
// barre.onclick = ()=>{
//     if (i == 0){
//         ville.style.display ='block'
//         i++
//         return
//     }
//     i=0
//     ville.style.display ='none'

// }


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
        el[1].style.opacity = 0
        el[0].style.transform = 'rotate(-60deg) translate(-5px,5px)'
        el[2].style.transform = 'rotate(60deg) translate(-5px,-5px)'
        return
    }
    
    el[0].style.transform = 'rotate(0deg) translate(0)'
    el[2].style.transform = 'rotate(0deg) translate(0)'
    el[1].style.opacity = 1
    
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
