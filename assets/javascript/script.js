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
let cityInputEl = document.getElementById('searchBar')
let cityInput = "toronto";
let eventsArr = [];
let locationID;
let hotels = [];
let locationArr = [];

// saving user data to cityInput and redirecting to the search result page.

function userSave() {   
    cityInput = document.getElementById('userInput').value;
    console.log(cityInput)
    if (cityInput){
    // window.location.replace = ('https://ydennekrf.github.io/Node-Aero/assets/html/search-result.html');
    if (map != undefined){
    map = map.remove()};
    locationArr = [];
    cityApi();
}
    
}
// sets the city search data into local storage
// stores the hotel data and sets where the map will display.
//sends data to the geohash converter api and renders markers on map for hotels
async function cityApi () {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
            'X-RapidAPI-Key': 'da2a67df69msh64dfa9816cc282bp13e13djsna465e688114b'
        }
    }; 
    const response = await fetch(`https://hotels4.p.rapidapi.com/locations/v2/search?query=${cityInput}&locale=en_US&currency=CAD`, options);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const cityData = await response.json()

    setTimeout(() =>{ 
    cityLong = cityData.suggestions[0].entities[0].longitude;
    cityLat = cityData.suggestions[0].entities[0].latitude;
    for (let i=0 ; i < 3 ; i++ ) {
        hotelID.push(cityData.suggestions[1].entities[i]);}
        map = L.map('map').setView([cityLat, cityLong], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: '© OpenStreetMap'
    }).addTo(map);
    for ( i=0 ; i < hotelID.length ; i++){
        locationID = hotelID[i].destinationId
        console.log("two")
       detailsApi(locationID);
       getGeohash(); 
    }}, 2000);

    };

cityApi().catch(error => {
    error.message;
})
// sets the location details into local storage
async function detailsApi (locationID){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
            'X-RapidAPI-Key': 'da2a67df69msh64dfa9816cc282bp13e13djsna465e688114b'}};

    const response = await fetch(`https://hotels4.p.rapidapi.com/properties/get-details?id=${locationID}&adults1=1&currency=USD&locale=en_US`, options);
    if (!response.ok) {
        const message =  `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const data = await response.json();
        locationArr.push(data)
    console.log(locationArr)
    setTimeout(() => {
    for (i = 0; i < locationArr.length; i++) {
        let hotelName = locationArr[i].data.body.propertyDescription.name
        let hotelAddress = locationArr[i].data.body.propertyDescription.address.fullAddress;
        let price = locationArr[i].data.body.propertyDescription.featuredPrice.currentPrice.plain;
        let rating = locationArr[i].data.body.guestReviews.brands.rating;
        let hotelLoc = [[`<b>${hotelName}</b><br><p>Address: ${hotelAddress}<br>Rating: ${rating} out of 10<br>Price per night:${price}`, hotelID[0].latitude, hotelID[0].longitude],
                        [`<b>${hotelName}</b><br><p>Address: ${hotelAddress}<br>Rating: ${rating} out of 10<br>Price per night:${price}`, hotelID[1].latitude, hotelID[1].longitude],
                        [`<b>${hotelName}</b><br><p>Address: ${hotelAddress}<br>Rating: ${rating} out of 10<br>Price per night:${price}`, hotelID[2].latitude, hotelID[2].longitude]]
hotels = new L.marker([hotelLoc[i][1],hotelLoc[i][2]], {riseOnHover: true}).bindPopup(hotelLoc[i][0]).addTo(map)};
    }, 2000)};

// converts the long and lat coordinates into a geohash code to be used in ticketmaster api to set location.
async function getGeohash() {
    let geoHash = `https://api.opencagedata.com/geocode/v1/json?q=${cityLat}+${cityLong}&key=fb9a0a14a4de4cdc9f8ebf4290b6a0c5`;
    console.log(geoHash)
    const response = await fetch(geoHash)
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);}
    const hashData = await response.json();
    getTicketmaster(hashData)}
getGeohash().catch( error => {
    error.message;
}) 
// takes the geohash code and searches for 20 music events in a 10 mile radius of the target location
async function getTicketmaster(hashData) {
    let geoDataTarget = hashData.results[0].annotations.geohash;
    let geoDataShort = geoDataTarget.slice(0,6)
    let getEvent = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=20&geoPoint=${geoDataShort}&radius=10&apikey=4ebPTDeBjLhHylxMc6U1W4TzPXQVFCG1`;
    const response = await fetch(getEvent)
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const eventData = await response.json();
    let events;
    for(i = 0 ; i < 19; i++) {
        let eventPic = eventData._embedded.events[i].images[0].url;
        let performerName = eventData._embedded.events[i].name;
        let venueName = eventData._embedded.events[i]._embedded.venues[0].name;
        let venueAddress = eventData._embedded.events[i]._embedded.venues[0].address.line1;
        let date = eventData._embedded.events[i].dates.start.dateTime;
        let link = eventData._embedded.events[i].url;
        let eventLoc = [[`<img src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[0]._embedded.venues[0].location.latitude, eventData._embedded.events[0]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[1]._embedded.venues[0].location.latitude, eventData._embedded.events[1]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[2]._embedded.venues[0].location.latitude, eventData._embedded.events[2]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[3]._embedded.venues[0].location.latitude, eventData._embedded.events[3]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[4]._embedded.venues[0].location.latitude, eventData._embedded.events[4]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[5]._embedded.venues[0].location.latitude, eventData._embedded.events[5]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[6]._embedded.venues[0].location.latitude, eventData._embedded.events[6]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[7]._embedded.venues[0].location.latitude, eventData._embedded.events[7]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[8]._embedded.venues[0].location.latitude, eventData._embedded.events[8]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[9]._embedded.venues[0].location.latitude, eventData._embedded.events[9]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[10]._embedded.venues[0].location.latitude, eventData._embedded.events[10]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[11]._embedded.venues[0].location.latitude, eventData._embedded.events[11]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[12]._embedded.venues[0].location.latitude, eventData._embedded.events[12]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[13]._embedded.venues[0].location.latitude, eventData._embedded.events[13]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[14]._embedded.venues[0].location.latitude, eventData._embedded.events[14]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[15]._embedded.venues[0].location.latitude, eventData._embedded.events[15]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[16]._embedded.venues[0].location.latitude, eventData._embedded.events[16]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[17]._embedded.venues[0].location.latitude, eventData._embedded.events[17]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[18]._embedded.venues[0].location.latitude, eventData._embedded.events[18]._embedded.venues[0].location.longitude],
                    [`<img style="height: 150px; width 175px;" src="${eventPic}"><b>${performerName}</b><br><p>Live at ${venueName}<br>${venueAddress}<br>Date:${date} <a href="${link}">Get Tickets Here</a>`, eventData._embedded.events[19]._embedded.venues[0].location.latitude, eventData._embedded.events[19]._embedded.venues[0].location.longitude]] 
        events = L.marker([eventData._embedded.events[i]._embedded.venues[0].location.latitude, eventData._embedded.events[i]._embedded.venues[0].location.longitude], {
            riseOnHover: true
        }).bindPopup(eventLoc[i][0]).addTo(map);
    }
    return eventData};

getTicketmaster().catch(error => {
    error.message;
});
//calls cityApi on load into the search-result.html page.
cityApi();

