var apiKey = "5df764fc78aa40c1b5f6775a91f20e6a";
var inputValue = document.querySelector("#input-value");
var button = document.querySelector("#button");
var fiveCardsEl = document.querySelector("#five-cards");
var date;
var stateCode;
var cityName;

// function to start date
var dt = luxon.DateTime.now().toLocaleString();
console.log(dt);

// function when the user hits enter or clicks submit, get's the city's name and converts it to it's geolocation to give it to the one call api
button.addEventListener("click", function(event){
    // prevents page from automatically refreshing when search button is clicked
    event.preventDefault();

    cityName = inputValue.value;
    
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
            });
        }   
        else {
            alert("Need to type valid city!")
        }
    });

    $("form").trigger("reset");
});

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
                        fiveDay(data.daily[i]);
                    }

                });
            }
        });
};

// updates the current days weather information box
var currWeather = function(geoName, currData) {
    var iconUrl = "http://openweathermap.org/img/wn/" + currData.weather[0].icon + "@2x.png";

    $("#currCity").html(geoName);
    $("#currIcon").attr("src", iconUrl);
    $("#currIcon").attr("width", "70");
    $("#temp").html(currData.temp.day);
    $("#wind").html(currData.wind_speed);
    $("#humi").html(currData.humidity);
    $("#uvi").html(currData.uvi);
};


var fiveDay = function(futureData) {
    console.log(futureData.weather[0].icon);
    var iconUrl = "http://openweathermap.org/img/wn/" + futureData.weather[0].icon + "@2x.png";
    console.log(iconUrl);
    var weatherCard = document.createElement("div");
    weatherCard.className = "card bg-secondary text-white col-lg-2";
    fiveCardsEl.appendChild(weatherCard);

    var cardDate = document.createElement("p");
    weatherCard.appendChild(cardDate);

    var cardIcon = document.createElement("img");
    cardIcon.setAttribute("src", iconUrl);
    cardIcon.setAttribute("width", "60");
    weatherCard.appendChild(cardIcon);

    var cardTemp = document.createElement("p");
    cardTemp.innerHTML = "Temp: " + futureData.temp.day; 
    weatherCard.appendChild(cardTemp);

    var cardWind = document.createElement("p");
    cardWind.innerHTML = "Wind: " + futureData.wind_speed;
    weatherCard.appendChild(cardWind);

    var cardHumi = document.createElement("p");
    cardHumi.innerHTML = "Humiditiy: " + futureData.uvi;
    weatherCard.appendChild(cardHumi);
};