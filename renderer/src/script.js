let allCardsData = []

document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    setupEventListeners()
})

const cards = document.querySelector("#card-dinamica")
const templateCard = document.querySelector("#template-card").content
const inputSearch = document.querySelector("#input-search")
const selectSerie = document.querySelector("#select-serie")
const selectImageFilter = document.querySelector("#select-image-filter")
const resultCount = document.querySelector("#result-count")
const countNumber = document.querySelector("#count-number")

const fetchData = async () => {
    try {
        loadingData(true)

        const res = await fetch("https://api.tcgdex.net/v2/es/cards")
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`)
        }
        const data = await res.json()

        allCardsData = data
        applyFiltersAndShow()
    } catch (error) {
        console.error("Error al obtener los datos de TCGdex:", error)
    } finally {
        loadingData(false)
    }
}

const loadingData = (estado) => {
    const loading = document.querySelector("#loading")
    if (loading) {
        if (estado) {
            loading.classList.remove("d-none")
        } else {
            loading.classList.add("d-none")
        }
    }
}

const setupEventListeners = () => {
    inputSearch.addEventListener("input", () => {
        applyFiltersAndShow()
    })

    selectSerie.addEventListener("change", () => {
        applyFiltersAndShow()
    })

    selectImageFilter.addEventListener("change", () => {
        applyFiltersAndShow()
    })
}

// Filtrado de datos
const applyFiltersAndShow = () => {
    const query = inputSearch.value.trim().toLowerCase()
    const serieVal = selectSerie.value
    const imageVal = selectImageFilter.value

    let filtered = allCardsData.filter((item) => {
        
        const matchesName = item.name ? item.name.toLowerCase().includes(query) : false

        let matchesSerie = true
        if (serieVal !== "todos") {
            matchesSerie = item.id ? item.id.toLowerCase().startsWith(serieVal) : false
        }

        let matchesImage = true
        const hasImage = Boolean(item.image)
        if (imageVal === "con-imagen") {
            matchesImage = hasImage
        } else if (imageVal === "sin-imagen") {
            matchesImage = !hasImage
        }

        return matchesName && matchesSerie && matchesImage
    })

    const displayLimit = 100
    const limitedResults = filtered.slice(0, displayLimit)

    if (countNumber && resultCount) {
        countNumber.textContent = `${filtered.length} (mostrando ${limitedResults.length})`
        resultCount.classList.remove("d-none")
    }

    showData(limitedResults)
}


const showData = (data) => {
    const fragment = document.createDocumentFragment()
    cards.textContent = ""

    if (data.length === 0) {
        cards.innerHTML = `
            <div class="col-12 text-center text-secondary my-5">
                <p class="lead">No se encontraron cartas que coincidan con los criterios seleccionados.</p>
            </div>
        `
        return
    }

    data.forEach((item) => {
        const clone = templateCard.cloneNode(true)


        clone.querySelector("h5").textContent = item.name || "Nombre Desconocido"

        const seriePrefix = item.id ? item.id.split("-")[0].toUpperCase() : "TCG"
        clone.querySelector(".card-serie").textContent = seriePrefix

        clone.querySelector(".card-id").textContent = item.id || "N/A"

        const imgElement = clone.querySelector("img")
        const defaultImage = "https://assets.tcgdex.net/es/swsh/swsh1/1/high.png"

        if (item.image) {
            const imageUrl = item.image.endsWith(".png") || item.image.endsWith(".jpg")
                ? item.image
                : `${item.image}/high.png`
            imgElement.setAttribute("src", imageUrl)
            imgElement.classList.remove("opacity-50")
        } else {
            imgElement.setAttribute("src", defaultImage)
            imgElement.classList.add("opacity-50")
        }

        imgElement.setAttribute("alt", item.name || "Carta Pokémon")

        fragment.appendChild(clone)
    })

    cards.appendChild(fragment)
}