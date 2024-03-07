'use strict'

const addEventOnElements = (elements, eventType, callback) => {
    for (const el of elements) el.addEventListener(eventType, callback)
}

const searchBox = document.querySelector("[search-box]")
const searchTogglers = document.querySelectorAll("[search-toggler]")

addEventOnElements(searchTogglers, "click", () => {
    searchBox.classList.toggle("active")
})