console.clear()

class DataToJson{

    /**
     * 
     * @param {HTMLElement} parent 
     * @param {HTMLFormElement} form 
     * @param {HTMLButtonElement} buttonPlus 
     * @param {HTMLTemplateElement} template 
     */
    constructor(parent,buttonPlus,template,form){
        this.parent = parent
        this.buttonPlus = buttonPlus
        this.template = template
        // this.nameReplace = nameReplace
        this.form = form
        this.templates_photo = document.querySelector('template#photo-temp')
        this.templates_json = document.querySelector('template#json-commune-temp')
        this.templates_json_photo = document.querySelector('template#json-photo-temp')
        if (this.parent.childElementCount == 0)
            this.newForm()
        
        this.buttonPlus.onclick = ()=> this.newForm()
        
        this.sync()

        this.copy()
        
    }

    /**
     * 
     * @param {Array} data 
     */
    newForm(){
        const element = this.template.content.cloneNode(true)
        
        // modifi le label equip
        const id = this.parent.childElementCount +1
        element.querySelector('label').innerHTML += ' ' + ( id)
        element.querySelector('div').setAttribute('id',`item-${id}`)
        
        // fermer
        const fermer = element.querySelector('#fermer')
        fermer.onclick = ()=> this.close(fermer)
        this.parent.insertBefore(element,this.parent.firstElementChild)

        
        // json
        const element_json = this.jsonForNewForm(id)
        
        // site touristique
        const elements_photo = fermer.parentElement.querySelector('#photo')
        const btn_photo = fermer.parentElement.querySelector('#btn-plus-photo')
        btn_photo.onclick = () => this.newChildForm(elements_photo, 'n2]',element_json)
        this.newChildForm(elements_photo, 'n2]', element_json)

        // sync
        const input = Array.from(fermer.parentElement.querySelectorAll('input'))
        input[0].onkeydown = () => element_json.querySelector('.commune').innerHTML = input[0].value
        input[1].onkeydown = () => element_json.querySelector('.nom').innerHTML = input[1].value

    }

    jsonForNewForm(id){
        const element = this.templates_json.content.cloneNode(true)
        const element_json = element.querySelector('span').parentElement.parentElement
        element_json.setAttribute('id',`item-${id}`)
        if (id > 1)element_json.querySelector('.virgule').innerHTML = ','
        const element_parent = document.querySelector('#json-commune')
        element_parent.insertBefore(element,element_parent.firstElementChild)
        return element_json
    }

    /**
     * 
     * @param {HTMLLIElement} element_parent 
     * @param {string} nrplace 
     */
    newChildForm(element_parent, nrplace, element_json){
        const element = this.templates_photo.content.cloneNode(true)
        
        // modifi le label equip
        element.querySelector('label').innerHTML += ' ' + (element_parent.childElementCount + 1)
        
        // fermer
        const fermer = element.querySelector('#fermer2')
        fermer.onclick = ()=> this.close(fermer,element_json)
        element_parent.insertBefore(element,element_parent.firstElementChild)

        // json
        element_json = this.jsonNewChildForm(element_json)

        // sync
        const input = Array.from(fermer.parentElement.querySelectorAll('input'))
        input[0].onkeydown = () => element_json.querySelector('.lien').innerHTML = input[0].value
        input[1].onkeydown = () => element_json.querySelector('.titre').innerHTML = input[1].value

    }

    jsonNewChildForm( element_parent){
        element_parent = element_parent.querySelector('#json-photo')
        const element = this.templates_json_photo.content.cloneNode(true)
        const element_json = element.querySelector('span').parentElement
        console.log(element_parent.childElementCount,element.firstElementChild,element_json);
        if (element_parent.childElementCount > 0) element.firstElementChild.querySelector('.virgule').innerHTML = ','
        element_parent.insertBefore(element,element_parent.firstElementChild)
        return element_json
    }

    /**
     * 
     * @param {HTMLElement} fermer 
     * @param {Boolean|HTMLElement} element 
     */
    close(fermer,element = false){
        if (fermer.parentElement.parentElement.childElementCount <= 1) return   
        element ? element.parentElement.remove() : document.querySelector(`#json #${fermer.parentElement.id}`).remove()
        fermer.parentElement.remove()
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    keyDown(element,value=false){
        document.querySelector(`#json #${element.name}`).innerHTML = value ? value : element.value
    }

    sync(){
        // ville
        const ville = this.form.querySelector('input#ville')
        ville.onkeydown = () => this.keyDown(ville)

        // chef
        const chef = this.form.querySelector('input#chef_district')
        chef.onkeydown = () => this.keyDown(chef)

        // description
        const description = this.form.querySelector('#description')
        description.onkeydown = () => this.keyDown(description)

        // commune
    }

    /**
     * copier le json
     * @param {HTMLElement} container 
     */
    copy(){
        const code = document.querySelector('code')
        const copi = code.previousElementSibling
        copi.onclick = ()=>{
            let text = code.textContent
            text = JSON.parse(text)
            navigator.clipboard.writeText(JSON.stringify(text,'',4))
            console.log(text)
        }
    }
}

const elements = document.querySelector('#commune')
const buttonPluss = document.querySelector('#btn-plus-commune')
const templates = document.querySelector('template#commune-temp')

const form = document.querySelector('form')
new DataToJson(elements,buttonPluss,templates,form)