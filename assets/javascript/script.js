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
    console.log(cityInput);
    
    window.location.replace = ('search-result.html');
    map = map.remove();
    cityApi();
}

// sets the city search data into local storage

cityApi = () => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
            'X-RapidAPI-Key': '214a222431mshfe1d7815a87bb3dp1c5bfejsnf28fc17b052f'
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
            'X-RapidAPI-Key': '214a222431mshfe1d7815a87bb3dp1c5bfejsnf28fc17b052f'
        }
    };
    fetch(`https://hotels4.p.rapidapi.com/properties/get-details?id=${locationID}&adults1=1&currency=USD&locale=en_US`, options)
        .then(response => response.json())
        .then(function (data) {
            locationArr.push(data)
            localStorage.setItem("locationData", JSON.stringify(locationArr))
        }
        )
        .catch(err => console.error(err));
};         
// stores the hotel data and sets where the map will display.
//sends data to the geohash converter api and renders markers on map for hotels
getLocationData = () => {
    response = JSON.parse(localStorage.getItem('cityData'))
    
    for (let i=0 ; i < 3 ; i++ ) {
        hotelID.push(response.suggestions[1].entities[i]);}
    cityLong = response.suggestions[0].entities[0].longitude;
    cityLat = response.suggestions[0].entities[0].latitude;
        map = L.map('map').setView([cityLat, cityLong], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: '© OpenStreetMap'
    }).addTo(map);
  console.log(hotelID)
    renderHotels();
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
// takes the geohash code and searches for 20 music events in a 10 mile radius of the target location
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

//renders events onto map with pop up information
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
//renders hotel markers onto map with the pop up information
renderHotels = () => { 
    let hotelData = JSON.parse(localStorage.getItem('locationData'))
    
    for ( i=0 ; i < hotelID.length ; i++){
        locationID = hotelID[i].destinationId
        detailsApi(locationID);
        
        let hotelName = hotelData[i].data.body.propertyDescription.name
        let hotelAddress = hotelData[i].data.body.propertyDescription.address.fullAddress;
        let price = hotelData[i].data.body.propertyDescription.featuredPrice.currentPrice.plain;
        let rating = hotelData[i].data.body.guestReviews.brands.rating;
        console.log(hotelName)
        let hotelLoc = [[`<b>${hotelName}</b><br><p>Address: ${hotelAddress}<br>Rating: ${rating} out of 10<br>Price per night:${price}`, hotelID[0].latitude, hotelID[0].longitude],
                    [`<b>${hotelName}</b><br><p>Address: ${hotelAddress}<br>Rating: ${rating} out of 10<br>Price per night:${price}`, hotelID[1].latitude, hotelID[1].longitude],
                    [`<b>${hotelName}</b><br><p>Address: ${hotelAddress}<br>Rating: ${rating} out of 10<br>Price per night:${price}`, hotelID[2].latitude, hotelID[2].longitude]]
      
       hotels = new L.marker([hotelLoc[i][1],hotelLoc[i][2]], {
           riseOnHover: true
       }).bindPopup(hotelLoc[i][0]).addTo(map); 
    }
};

cityApi();
//event listener for the home page
cityInputEl.addEventListener("submit", userSave);

// clears the input field on the search bar in the search-results.html
const clearInput = () => {
    const input = document.getElementsByTagName("input")[0];
    input.value = "";
  }
  
  const clearBtn = document.getElementById("clear-btn");
  clearBtn.addEventListener("click", clearInput);

