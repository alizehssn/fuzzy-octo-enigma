$(document).ready(function() {


    //Global Variables
    const baseUrl = "https://api.openweathermap.org/data/2.5/onecall?appid=3eb0e567cc7b00f803e3b296868846a2&units=imperial&exclude=hourly,minutely"

    let lat = 0
    let lon = 0
        //Calling Past Searches When Page Loads:
    savedSearchHistory()


    //Function to be called in On.Click search to build the Current and 5-Day ForeCasts
    function buildForecast(targetCity) {
        //OpenCage API used to convert the city the user types into lat & lon coordinates the openweather API we created as our base URL will use
        var forwardUrl = "https://api.opencagedata.com/geocode/v1/json?key=2148f2f1733049e1b88135bd5d83d7d1"
        var searchForwardUrl = forwardUrl + "&q=" + targetCity
        $.when(
            $.ajax({
                url: searchForwardUrl,
                method: "GET"
            })).then(function(generatedObject) {
            lat = generatedObject.results[0].geometry.lat
            lon = generatedObject.results[0].geometry.lng
                //Console logging the lat&lon to confirm the variables from the opencageddata API
            console.log(lat)
            console.log(lon)

            //Building the new URL from the base URL with the targetted city's lat and lon
            var queryURL = baseUrl + "&lat=" + lat + "&lon=" + lon
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(generatedResponseApi) {
                console.log(generatedResponseApi)
                    //Using the UnixTimeStamp from the OpenWeather API, the milliseconds are converted into milliseconds in order to render the date format readable
                let unixTimeStamp = generatedResponseApi.current.dt;
                const milliseconds = unixTimeStamp * 1000
                const dateObject = new Date(milliseconds)
                console.log(dateObject)
                const humanDateFormat = dateObject.toLocaleString("en-US", { timeZoneName: "short" })
                console.log(humanDateFormat)
                $("#date").text(humanDateFormat)
                    //Setting the City Displayed to be whatever the user types into the searchinput
                $("#city").text(targetCity);
                console.log(targetCity);
                console.log(humanDateFormat);
                //Creating Variables for each API element
                var currentTemp = generatedResponseApi.current.temp;
                var currentHumidity = generatedResponseApi.current.humidity;
                var currentWindSpeed = generatedResponseApi.current.wind_speed;
                var currentUV = generatedResponseApi.current.uvi
                    //Setting the Current Forecast Elements in the HTML to the result queried from the API
                $("#temperature").text("Temperature: " + currentTemp + " F");
                $("#humidity").text("Humidity: " + currentHumidity + " g.kg");
                $("#windSpeed").text("Wind-Speed: " + currentWindSpeed + " m/s");
                $("#UV").text("Current UV Index: " + currentUV);
                //UVI Color-Coding
                if (currentUV < 3) {
                    $("#UV").css("background-color", "green")
                }
                if (3 < currentUV < 6) {
                    $("#UV").css("background-color", "yellow")
                }
                if (6 < currentUV < 10) {
                    $("#UV").css("background-color", "red")
                } else {
                    $("#UV").css("background-color", "magenta")
                }
                //Five Day Forecast Loop to render the future forecast
                for (var i = 1; i < 6; i++) {
                    $("#day" + i).empty();
                    var icon = generatedResponseApi.daily[i].weather[0].icon;
                    console.log(icon)
                    let fiveDayIcon = "https://openweathermap.org/img/wn/" + icon + ".png";
                    let fiveDayUnix = generatedResponseApi.daily[i].dt;
                    console.log(fiveDayUnix)
                    const millisecondsFiveDay = fiveDayUnix * 1000;
                    let fiveDayDateObject = new Date(millisecondsFiveDay);
                    console.log(fiveDayDateObject)
                    let humanDateFormatFiveDay = fiveDayDateObject.toLocaleDateString()
                    console.log(humanDateFormatFiveDay)
                    var tempMax = generatedResponseApi.daily[i].temp.max;
                    console.log(tempMax)
                    var tempMin = generatedResponseApi.daily[i].temp.min;
                    console.log(tempMin)
                    var humidity = generatedResponseApi.daily[i].humidity;
                    console.log(humidity)
                        //Setting the HTML Elements to the results rendered from the for loop
                    var fiveDayForecast = $("#day" + i)
                    fiveDayForecast.append("<img sameSite=none src=" + fiveDayIcon + ">");
                    fiveDayForecast.append("<p>", "Date: " + humanDateFormatFiveDay);
                    fiveDayForecast.append("<p>", "High Temperature: " + tempMax);
                    fiveDayForecast.append("<p>", "Low Temperature: " + tempMin)
                    fiveDayForecast.append("<p>", "Humidity: " + humidity);
                }


            })
        })
    }


    function renderSearchHistory(searchHistoryCity) {
        var cityListEl = $('<li class="list-group-item" data-value="' + searchHistoryCity + '">').text(searchHistoryCity);
        console.log(searchHistoryCity)
        $("ul").prepend(cityListEl)
    }

    function savedSearchHistory() {
        var savedCities = (localStorage.getItem("cityListItem"))
        console.log(savedCities)
        if (savedCities) {
            var pastSearches = JSON.parse(savedCities)
            for (var i = 0; i < 4; i++) {
                renderSearchHistory(pastSearches[i])
            }
        }
    }


    //On-Click for Search Button Function
    $("#searchBtn").on("click", function() {
        event.preventDefault();
        var searchCity = $("#searchCity").val().trim();
        buildForecast(searchCity)
        renderSearchHistory(searchCity);
        var storageObject = (localStorage.getItem("cityListItem"))
        if (storageObject) {
            var citiesArray = JSON.parse(storageObject)
            citiesArray.push(searchCity)
            localStorage.setItem("cityListItem", JSON.stringify(citiesArray))
        } else {
            var saveListArray = [searchCity]
            localStorage.setItem("cityListItem", JSON.stringify(saveListArray))
        }
    })


    //On - Click for SearchHistory

    $(document).on("click", "li", function() {
        var searchHistoryCity = $(this).attr("data-value")
        console.log(searchHistoryCity);

        buildForecast(searchHistoryCity);
        //renderSearchHistory(searchHistoryCity);

    })


});