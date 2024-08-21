console.clear()

import DataToJson from "./datatojson.js";

const elements = document.querySelector('#commune')
const buttonPluss = document.querySelector('#btn-plus-commune')
const templates = document.querySelector('template#commune-temp')
const form = document.querySelector('form')
const audio = document.querySelector('audio')

window.onload  = () => {
    new DataToJson(elements,buttonPluss,templates,form,audio)
}
