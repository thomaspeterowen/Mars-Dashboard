let store = {
    user: { name: "Student" },
    apod: '',
    picList: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    selectedRover: '',
    selectedRoverData: ''
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h2><i class="fa-solid fa-shuttle-space"></i> Introduction</h3>
                <p>The NASA API, or Application Programming Interface, is a tool provided by NASA (National Aeronautics and Space Administration) that allows developers to access and retrieve data and information from NASA's vast collection of resources. It's like a digital gateway that enables software programs and websites to interact with NASA's databases and services. This API provides access to a wide range of data, including images, videos, satellite data, Mars rover data, and much more. Developers can use this data to create applications, websites, or research projects related to space exploration, astronomy, and Earth science. The NASA API opens up a world of possibilities for developers to explore and utilize NASA's extensive knowledge and discoveries in an easy and convenient way.</p>
                <p>Below I have highlighted one of the most popular API interfaces:</p>
                <div class="section">
                    <h3><i class="fa-solid fa-mars"></i> NASA Mars Rover API</h3>
                    <p>The NASA Mars Rover API is an interface provided by NASA that allows developers to access and retrieve data related to the Mars rovers' missions. NASA has sent several rovers to explore the surface of Mars, including the popular rovers like Spirit, Opportunity, and Curiosity.</p>
                    <p>The Mars Rover API provides developers with access to a wide range of data gathered by these rovers, such as images, weather reports, mission status, and scientific measurements. Developers can use the API to programmatically retrieve specific data sets or browse through the extensive collection of images and information captured by the rovers on the Martian surface.</p>
                    <p>Select a rover to show the photos:</p>
                    ${RoverSelection(store.selectedRover)}
                    ${processElements(store)}
                </div>
                <p>Website made possible by the NASA API.</p>
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// -----  COMPONENTS  -----

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const processElements = function( store ){
    if (store.picList && store.selectedRoverData) {
        return `
            <section>
                <p>${store.selectedRover} was launched on ${store.selectedRoverData.image.photo_manifest.launch_date}, landing on Mars on ${store.selectedRoverData.image.photo_manifest.landing_date}</p>
                <p>The status of ${store.selectedRover} is currently ${store.selectedRoverData.image.photo_manifest.status}, and during its lifetime, ${store.selectedRover} has sent back ${store.selectedRoverData.image.photo_manifest.total_photos} photos.</p>
                <p>Check out some of ${store.selectedRover}'s most recent photos. The following photos were taken on ${store.picList.image.latest_photos[0].earth_date}.</p>
                <div class="photos">
                    ${store.picList.image.latest_photos.map(photo => (
                        `<img class="rover-img" src=${photo.img_src} width=300px/>` 
                    )).join('')}
                </div>
            </section>
        `
    }
    return ``
}

const doThisOnChange = function(value, state)
    {    
        let { selectedRover } = state;
        selectedRover = value;
        updateStore(store, { selectedRover });
        getRoverData(store)
        getRoverPics(store)
        processElements(store)    }

const RoverSelection = () => {

    return (`
        ${store.rovers.map(val => (
            `<button class="btn btn-1 btn-1a" value="${val}" onclick='doThisOnChange(this.value, store)'>${val}</button>` 
        )).join('')}
    `)
}

// -----  API CALLS  -----

// API: rover specific photo library
const getRoverPics = (state) => {
    let { picList } = state

    fetch(`http://localhost:3000/rovers/${store.selectedRover}`)
        .then(res => res.json())
        .then(picList => updateStore(store, { picList }))

    console.log(state)
}

// API: rover specific photo library
const getRoverData = (state) => {
    let { selectedRoverData } = state

    fetch(`http://localhost:3000/rovers/manifest/${store.selectedRover}`)
        .then(res => res.json())
        .then(selectedRoverData => updateStore(store, { selectedRoverData }))

    console.log(state)
}