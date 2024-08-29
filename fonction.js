
export default async function fec(url) {
    const headers = {Accept : 'application/json'}
    const r = await fetch(url,{headers})
    if (r.ok){
        return r.json()
    }
    
}

export function couleurs(){
    const x = Math.round(Math.random()*254)
    const y = Math.round(Math.random()*254)
    const z = Math.round(Math.random()*254)
    const opp = [0.5,0.6,0.7,0.8,0.9,1]
    const op = Math.round(Math.random()*5)
    const color = 'rgba('+x+','+y+","+z+','+opp[op]+")"
    return color
}

export class Carosel{
    /**
     * @param {HTMLElement} element 
     * @param {object} option 
     * @param {object} option.visible 
     * @param {object} option.defile 
     */
    compter = 0

    constructor(element,option){
        console.log(element)

        this.element = element
        this.first = element.firstElementChild.cloneNode(true)
        this.element.appendChild(this.first)
        this.child = Array.from(element.children)
        
        // option par defaut
        this.option = Object.assign({},{
            visible:1,
            defile:1,
            margin:0,
            observe:false,
            pause: false
        },option)
       
        // la taille d'un element
        this.visible()
        this.w=this.child[this.compter].getBoundingClientRect()
        this.w = this.w.width + this.option.margin
        if (option.auto){
            const t = setInterval(() => {
                if(!this.option.pause){
                    this.nextR()
                }
            }, 3000);
        }

        let leftC = this.element.parentNode.querySelector('.left-control')
        let rightC = this.element.parentNode.querySelector('.right-control')
        let imgs = this.element.querySelectorAll('.imgs')
        let tooltip = document.getElementById('tooltip')
        
        leftC.addEventListener('click', (e) => {
            this.nextL()
        })
        rightC.addEventListener('click', (e) => {
            this.nextR()
        })

        const images = Array.from(imgs)
        images.map( (img) => {
            img.addEventListener('click', (e) => {
                this.option.pause = !this.option.pause;
                this.option.pause ? tooltip.innerText = "clic continuer" : tooltip.innerText = "clic pause"
                 
            })

            img.addEventListener('mouseenter', (e) => {
                tooltip.style.display = "block"
                
            })

            img.addEventListener('mousemove', (e) => {
                tooltip.style.left = e.pageX + 10 + 'px' 
                tooltip.style.top = e.pageY + 10 + 'px'
            })


            img.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
            });
        })
    }

    /**
     * crée un div ave les classes passées en parametre
     * @param {Array} className classe de la div
     * @return {HTMLElement}
     */
    makeDiv(className){
        const div = document.createElement('div')
        className.forEach( (e) =>{
            div.classList.add(e)
        })
        return div

    }

    visible(){
        if (this.option.visible == 2){

            this.child.forEach(el =>{
                el.style.flex = '1 0 45%'
            })
        }
    }

    nextR(){
        this.compter += this.option.defile 
        const cal = (-this.compter*this.w) 
        this.element.style.transform = 'translateX('+(cal)+'px)'
        this.element.style.transition = '2s linear'
        setTimeout(() => {
            if (this.compter >= this.child.length -1){
                this.compter = 0
                this.element.style.transition = 'uniset'
                this.element.style.transform = 'translateX(0)'
            }
        }, 1000);
    }

    nextL(){
        this.compter-= this.option.defile
        
        if (this.compter <0){
            this.compter = this.child.length -2
            this.element.style.transition = 'uniset'
            const cal = -this.compter * this.w 
            this.element.style.transform = 'translateX('+(cal)+'px)'
            return
        }
        this.element.style.transition = '1s linear'
        const cal = -this.compter * this.w
        this.element.style.transform = 'translateX('+(cal)+'px)'
        
    }
    
   
}
