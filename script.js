//$(document).ready(function() {


//Global Variables
const baseUrl = "https://api.openweathermap.org/data/2.5/onecall?appid=3eb0e567cc7b00f803e3b296868846a2&exclude=hourly,minutely"

let lat = 0
let lon = 0





function buildForecastURL(targetCity) {
    var forwardUrl = "https://api.opencagedata.com/geocode/v1/json?key=2148f2f1733049e1b88135bd5d83d7d1"
    var searchForwardUrl = forwardUrl + "&q=" + targetCity
    $.when(
        $.ajax({
            url: searchForwardUrl,
            method: "GET"
        })).then(function(generatedObject) {
        lat = generatedObject.results[0].geometry.lat
        lon = generatedObject.results[0].geometry.lng
        console.log(lat)
        console.log(lon)


        var queryURL = baseUrl + "&lat=" + lat + "&lon=" + lon
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(generatedUrl) {
            console.log(generatedUrl)
            var unixTimeStamp = generatedUrl.current.dt;
            //var dateObject = unixTimeStamp * 1000
            // let humanDateFormat = dateObject.toLocaleString()
            $("<h2>").text(humanDateFormat)
            $("<h1>").text(searchCity);
            console.log(searchCity)
            console.log(humanDateFormat)
            $("#temperature").text(generatedUrl.current.temp);
            $("#humidity").text(generatedUrl.current.humidity);
            $("#windSpeed").text(generatedUrl.current.wind_speed);
            $("#UV").text(generatedUrl.current.uvi);
        })
    })
}


// function fivedayForcast(){



//     for(var i=0; i < )

// }




//On-Click
$("#searchBtn").on("click", function() {
    event.preventDefault();
    var searchCity = $("#searchCity").val().trim();
    buildForecastURL(searchCity)
})