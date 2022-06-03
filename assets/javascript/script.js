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
cityInput= "toronto"
let eventsArr = [];
let locationID;
let hotels = [];
let locationArr = [];



// sets the city search data into local storage

cityApi = () => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
            'X-RapidAPI-Key': '6524af2719msh3e65b8fd93f7037p1cda72jsndb7a478aac3b'
        }
    }; 
    fetch(`https://hotels4.p.rapidapi.com/locations/v2/search?query=${cityInput}&locale=en_US&currency=CAD`, options)
        .then(response => response.json())
        .then(response => localStorage.setItem("cityData", JSON.stringify(response)))
        .catch(err => console.error(err));
        getLocationData();   
};

// sets the location details into local storage
detailsApi = (locationID) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
            'X-RapidAPI-Key': '6524af2719msh3e65b8fd93f7037p1cda72jsndb7a478aac3b'
        }
    };
    fetch(`https://hotels4.p.rapidapi.com/properties/get-details?id=${locationID}&adults1=1&currency=USD&locale=en_US`, options)
        .then(response => response.json())
        .then(function (data) {
            locationArr.push(data)
            console.log(locationArr)
            localStorage.setItem("locationData", JSON.stringify(locationArr))
        }
        )
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
        map = L.map('map').setView([cityLat, cityLong], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
    }).addTo(map);
    renderHotels();
    renderLandmarks();
    renderAirports();
    getGeohash();
};
// converts the long and lat coordinates into a geohash code to be used in ticketmaster api to set location.
getGeohash = () => {
    let geoHash = `https://api.opencagedata.com/geocode/v1/json?q=${cityLat}+${cityLong}&key=fb9a0a14a4de4cdc9f8ebf4290b6a0c5`;
    
    fetch(geoHash)
        .then(response => response.json())
        .then(response => localStorage.setItem("geoHash", JSON.stringify(response)))
        .then(getTicketmaster())
        .catch(err => console.error(err));
};

getTicketmaster = () => {
    let geoData = JSON.parse(localStorage.getItem('geoHash'))
    
    let geoDataTarget = geoData.results[0].annotations.geohash;
    let geoDataShort = geoDataTarget.slice(0,6)
   
    let getEvent = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=20&geoPoint=${geoDataShort}&radius=10&apikey=4ebPTDeBjLhHylxMc6U1W4TzPXQVFCG1`;

    fetch(getEvent)
        .then(response => response.json())
        .then(response => localStorage.setItem("eventData", JSON.stringify(response)))
        .then(renderEvents())
        .catch(err => console.error(err))
};

//renders events onto map
renderEvents = () => {
    let events;
    let eventData = JSON.parse(localStorage.getItem('eventData'))
      
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
};
//renders hotel markers onto map
renderHotels = () => { 
    console.log(hotelID[2].destinationId)
    let hotelLoc = [['hotel1', hotelID[0].latitude, hotelID[0].longitude],
                    ['hotel2', hotelID[1].latitude, hotelID[1].longitude],
                    ['hotel3', hotelID[2].latitude, hotelID[2].longitude]]
    for ( i=0 ; i < hotelID.length ; i++){
        locationID = hotelID[i].destinationId
        
        detailsApi(locationID);
        
       hotels = new L.marker([hotelLoc[i][1],hotelLoc[i][2]], {
           riseOnHover: true
       }).bindPopup(hotelLoc[i][0]).addTo(map); 
    }
};

// renders landmark markers on to map and creates the popup 
renderLandmarks = () => {
    let landmarks ;
    let landmarkLoc = [['loction1', landmarkID[0].latitude, landmarkID[0].longitude],
                        ['location2', landmarkID[1].latitude, landmarkID[1].longitude],
                        ['location3', landmarkID[2].latitude, landmarkID[2].longitude]]
    for ( i=0 ; i < landmarkID.length ; i++){
        locationID = landmarkID[i].destinationId
        detailsApi(locationID);
        landmarks = new L.marker([landmarkLoc[i][1], landmarkLoc[i][2]], {
            riseOnHover: true
        }).bindPopup(landmarkLoc[i][0]).addTo(map);
     }
};

// renders airport locations on to map
renderAirports = () => {
    let airports ;
    let airportLoc = [['airport1', airportID[0].latitude, airportID[0].longitude],
                    ['airport2', airportID[1].latitude, airportID[1].longitude]]
    for ( i=0 ; i < airportID.length ; i++){
        locationID = airportID[i].destinationId
        detailsApi(locationID);
        airports = L.marker([airportID[i].latitude, airportID[i].longitude], {
            riseOnHover: true
        }).bindPopup(airportLoc[i][0]).addTo(map);
     }
};

cityApi();
