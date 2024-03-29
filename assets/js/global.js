// Add event on multiple devices
const addEventOnElements = (elements, eventType, callback) => {
    for (const el of elements) el.addEventListener(eventType, callback)
}

// Toggle search box on mobile devices
const searchBox = document.querySelector("[search-box]")
const searchTogglers = document.querySelectorAll("[search-toggler]")

addEventOnElements(searchTogglers, "click", () => {
    searchBox.classList.toggle("active")
})