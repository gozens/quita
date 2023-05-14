
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

        this.element = element
        this.first = element.firstElementChild.cloneNode(true)
        this.element.appendChild(this.first)
        this.child = Array.from(element.children)
        
        // option par defaut
        this.option = Object.assign({},{
            visible:1
            ,defile:1,
            margin:0,
            observe:false
        },option)
        
        try {
            
            // les bouton gautche et droite
            this.option.gauche.onclick= ()=> this.nextL()
            this.option.droit.onclick= ()=> this.nextR()
        } catch (error) {
            
        }

       
        // la taille d'un element
        this.visible()
        this.w=this.child[this.compter].getBoundingClientRect()
        this.w = this.w.width + this.option.margin
        if (option.auto){
            const t = setInterval(() => {
                this.nextR()
            }, 3000);
        }
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
        this.element.style.transition = '1s linear'
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
