// global variables//
let currentName;
let currentState;
let currentCountry;
let cityLong;
let cityLat;
let hotelID = [];
let landmarkID = [];
let airportID = [];
let map;
let cityInput = document.getElementById('searchBar')
cityInput= "chicago"


// sets the city search data into local storage
cityApi = () => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
            'X-RapidAPI-Key': 'c69deb147dmsh0a33f369dfd1aeap11aebdjsn706b5eab161a'
        }
    }; 
    fetch(`https://hotels4.p.rapidapi.com/locations/v2/search?query=${cityInput}&locale=en_US&currency=CAD`, options)
        .then(response => response.json())
        .then(response => localStorage.setItem("cityData", JSON.stringify(response)))
        .catch(err => console.error(err));
        getLocationData();   
};
// sets the location details into local storage
detailsApi = () => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
            'X-RapidAPI-Key': 'c69deb147dmsh0a33f369dfd1aeap11aebdjsn706b5eab161a'
        }
    };
    fetch(`https://hotels4.p.rapidapi.com/properties/get-details?id=${locationID}&adults1=1&currency=USD&locale=en_US`, options)
        .then(response => response.json())
        .then(response => console.log(response),
        localStorage.setItem("detailsData", JSON.stringify(response)))
        .catch(err => console.error(err));
};

getLocationData = () => {
    response = JSON.parse(localStorage.getItem('cityData'))
    
    for (let i=0 ; i < 3 ; i++ ) {
        hotelID.push(response.suggestions[1].entities[i]);}
    for (let i=0 ; i < 3 ; i++ ) { 
        landmarkID.push(response.suggestions[2].entities[i]);}
    for (let i=0 ; i < 2 ; i++ ) {  
        airportID.push(response.suggestions[3].entities[i]);}
        cityLong = response.suggestions[0].entities[0].longitude;
        cityLat = response.suggestions[0].entities[0].latitude;
        console.log(hotelID);
        console.log(landmarkID);
        console.log(airportID);
        console.log(cityLong);
        console.log(cityLat);
        map = L.map('map').setView([cityLat, cityLong], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
    }).addTo(map);
    renderHotels();
    renderLandmarks();
    renderAirports();
};
//renders hotel markers onto map
renderHotels = () => {
    let hotels;
    for ( i=0 ; i < hotelID.length ; i++){
       hotels = L.marker([hotelID[i].latitude,hotelID[i].longitude], {
           color: 'red'
       }).addTo(map);
    }
};
// renders landmark markers on to map
renderLandmarks = () => {
    let landmarks ;
    for ( i=0 ; i < landmarkID.length ; i++){
        landmarks = L.marker([landmarkID[i].latitude,landmarkID[i].longitude], {
            color: 'green'
        }).addTo(map);
     }
};
// renders airport locations on to map
renderAirports = () => {
    let airports ;
    for ( i=0 ; i < landmarkID.length ; i++){
        airports = L.marker([airportID[i].latitude, airportID[i].longitude], {
            color: 'purple'
        }).addTo(map);
     }
};

///TO DO: create a event delegation function for markers that will call the locationApi with the targets destination ID


cityApi();


