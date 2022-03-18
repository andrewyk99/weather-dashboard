var apiKey = "5df764fc78aa40c1b5f6775a91f20e6a";
var inputValue = document.querySelector("#input-value");
var button = document.querySelector("#button");
var fiveCardsEl = document.querySelector("#five-cards");
var date;
var stateCode;
var cityName;
var storedCities = [];

// function to start date
var dt = luxon.DateTime.now();
date = dt.toLocaleString();

// function when the user hits enter or clicks submit, get's the city's name and converts it to it's geolocation to give it to the one call api
var getCity = function(){
    
    // url for geocoding api using variables to be adaptive to what the user types
    var geoApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + ",us&limit=1&appid=" + apiKey;
    var geoLat;
    var geoLon;
    var geoName;
    
    // gets the data from the url
    fetch(geoApi)
    .then(function(response){
        // if the request from the url is successful
        if (response.ok) {
            response.json().then(function(data){
                geoLat = data[0].lat;
                geoLon = data[0].lon;
                geoName = data[0].name;
                getWeather(geoLat, geoLon, geoName);
                saveSearchedCities(geoName);
                loadSearchedCities();
            });
        }   
        else {
            alert("Need to type valid city!")
        }
    });
    
    $("form").trigger("reset");
};

// function to use the data from the geocoding api to get data from the one call url
var getWeather = function(geoLat, geoLon, geoName) {
    var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geoLat + "&lon=" + geoLon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + apiKey;
    fetch(oneCallApi)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                currWeather(geoName, data.daily[0]);
                
                fiveCardsEl.innerHTML = "";
                
                for (var i = 1; i < 6; i++) {
                        var futureDates = dt.plus({days: i}).toLocaleString();
                        fiveDay(data.daily[i], futureDates);
                    }
                    
                });
            }
        });
    };
    
    // updates the current days weather information box
    var currWeather = function(geoName, currData) {
        var iconUrl = "http://openweathermap.org/img/wn/" + currData.weather[0].icon + "@2x.png";
        
        // changes 'city' to the city the user types in
        $("#currCity").html(geoName);
        // changes the '(MM/DD/YYYY)' to the current date
        $("#date").html(date);
        // shows the icon of the weather
        $("#currIcon").attr("src", iconUrl);
        $("#currIcon").attr("width", "70");
        // gives value of the weather details to the current day's values
        $("#temp").html(currData.temp.day);
        $("#wind").html(currData.wind_speed);
        $("#humi").html(currData.humidity);
        $("#uvi").html(currData.uvi);
    };
    
    // function to create the cards of the next five days
    var fiveDay = function(futureData, fdt) {
        
        // creates div and styles each card
        var iconUrl = "http://openweathermap.org/img/wn/" + futureData.weather[0].icon + "@2x.png";
        var weatherCard = document.createElement("div");
        weatherCard.className = "card bg-secondary text-white col-lg-2";
        fiveCardsEl.appendChild(weatherCard);
        
        // gives dates to the cards
        var cardDate = document.createElement("p");
        cardDate.innerHTML = fdt;
        cardDate.className = "fs-5 fw-bold";
        weatherCard.appendChild(cardDate);
        
        // gives the cards the weather icons
        var cardIcon = document.createElement("img");
        cardIcon.setAttribute("src", iconUrl);
        cardIcon.setAttribute("width", "60");
        weatherCard.appendChild(cardIcon);
        
        // gives the cards the temperature
        var cardTemp = document.createElement("p");
        cardTemp.innerHTML = "Temp: " + futureData.temp.day + " &degF"; 
        weatherCard.appendChild(cardTemp);
        
        // gives the cards the wind speed
        var cardWind = document.createElement("p");
        cardWind.innerHTML = "Wind: " + futureData.wind_speed + " MPH";
        weatherCard.appendChild(cardWind);
        
        var cardHumi = document.createElement("p");
        cardHumi.innerHTML = "Humiditiy: " + futureData.humidity + " %";
    weatherCard.appendChild(cardHumi);
};

// function for to save to localStorage
var saveSearchedCities = function(city) {
    for (var i = 0; i < storedCities.length; i++) {
        if (city === storedCities[i]) {
            storedCities.splice(i, 1);
        }
    }
    // puts city at the top
    storedCities.unshift(city);
    // only saves up to 5 cities
    while (storedCities > 5) {
        storedCities.pop();
    }
    localStorage.setItem("cities", JSON.stringify(storedCities));
};

// function to check localStorage and print the cities to the page if there are any
var loadSearchedCities = function() {
    $("#history").html("");
    storedCities = JSON.parse(localStorage.getItem("cities"));
    // if there are no saved cities, must make it create an empty array
    if (!storedCities) {
        storedCities = [];
        return false;
    }
    for (var i = 0; i < storedCities.length; i++) {
        var cityHistory = storedCities[i];
        printStoredCities(cityHistory);
    }    
};

// function to add already searched cities into buttons
var printStoredCities = function(city) {
    var previousCities = document.createElement("button");
    previousCities.className = "btn btn-primary col-12 mb-3"
    previousCities.textContent = city;
    $("#history").append(previousCities);
};

// listens for click from the submit button when searching a city
$("#currSubmit").on("click", function(event){
    event.preventDefault();
    cityName = inputValue.value;
    getCity();
});

// listens for click from a button created by the history
$("#history").on("click", "button", function(){
    cityName = $(this).text();
    getCity();
});

loadSearchedCities();