const apiKey = "210cebde372913794962e706f3604a4a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

let searchBox = document.querySelector(".search");
let searchBtn = document.querySelector(".button");
let temp = document.querySelector(".temp");
let citytown = document.querySelector(".city");
let description = document.querySelector(".description");
let feelsLike = document.querySelector("#feels-like");
let humidity = document.querySelector("#humidity");
let windspeed = document.querySelector("#windspeed");
let sunrise = document.querySelector("#sunrise");
let sunset = document.querySelector("#sunset");
let gust = document.querySelector("#gust");
let aqi = document.querySelector("#aqi");
let visibility = document.querySelector("#visibility");
let pressure = document.querySelector("#pressure");
let weatherIcon = document.querySelector(".weather-icon-img");

const bgImage = document.querySelector(".background");


let aqiText = (aqi) =>{
    switch(aqi){
        case 1 : return "Good";
        case 2 : return "Fair";
        case 3 : return "Moderate";
        case 4 : return "Poor";
        case 5 : return "Very Poor";
        default : return "Unknown";

    }
    
}
const getAQI = async (lat, lon) => {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const data = await res.json();

    console.log("AQI:", data.list[0].main.aqi);
    const aqiValue = data.list[0].main.aqi;
    aqi.innerText = aqiValue + " (" + aqiText(aqiValue) + ")";
};

const getWeatherIcon = (iconCode) =>{
    if(iconCode.includes("01d")){
        return "icons/clearDay.png";
    }
    else if (iconCode.includes("01n")){
        return "icons/clearNight.png";
    }
    else if (iconCode.includes("02d")){
        return "icons/fewcloudsDay.png";
    }

    else if (iconCode.includes("03d")){
        return "icons/fewcloudsDay.png";
    }
    
    else if (iconCode.includes("02n")){
        return "icons/fewcloudsNight.png";
    }

    else if (iconCode.includes("03n")){
        return "icons/fewcloudsNight.png";
    }
    else if (iconCode.includes("04")){
        return "icons/brokenClouds.png";
    }
    else if (iconCode.includes("09")){
        return "icons/rain.png";
    }
    else if (iconCode.includes("10")){
        return "icons/rain.png";
    }


    else if (iconCode.includes("11")){
        return "icons/thunderstorm.png";
    }
    else if (iconCode.includes("13")){
        return "icons/snowy.png";
    }else if (iconCode.includes("50")){
        return "icons/foggy.png";
    }
}


function setWeatherTheme(weather) {
  const body = document.body;

  if (weather === "Clear") {
    bgImage.style.backgroundImage = "linear-gradient(to top, #56ccf2, #2f80ed)";
  }

  else if (weather === "Clouds") {
    bgImage.style.backgroundImage = "linear-gradient(to top, #d7d2cc, #304352)";
  }

  else if (weather === "Rain") {
    bgImage.style.backgroundImage = "linear-gradient(to top, #4b6cb7, #182848)";
  }

  else if (weather === "Thunderstorm") {
    bgImage.style.backgroundImage = "linear-gradient(to top, #232526, #414345)";
  }

  else if (weather === "Snow") {
    bgImage.style.backgroundImage = "linear-gradient(to top, #e6dada, #274046)";
  }
}


let checkWeather = async(city)=>{
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);

    if(data.cod == "200" ){
        temp.innerText = Math.round(data.main.temp) + "°C";
        citytown.innerText = data.name;
        description.innerText = (data.weather[0].description).toUpperCase();
        feelsLike.innerText = Math.round(data.main.feels_like) + "°C";
        humidity.innerText = data.main.humidity + "%" ;
        windspeed.innerText = Math.round(data.wind.speed *3.6).toFixed(1) + " Km/hr ";
        visibility.innerText = (data.visibility)/1000 + " Km";
        pressure.innerText = data.main.pressure + " hPa";
        gust.innerText = Math.round(data.wind.gust *3.6).toFixed(1) + " Km/hr"
    
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        getAQI(lat , lon);

        let sunriseTime = new Date(data.sys.sunrise*1000);
        let sunsetTime = new Date(data.sys.sunset * 1000);

        sunrise.innerText = sunriseTime.toLocaleTimeString();
        sunset.innerText = sunsetTime.toLocaleTimeString();

        const iconCode = data.weather[0].icon;
        weatherIcon.src = getWeatherIcon(iconCode);


    }else if(data.cod === "404"){
        // showError("City not Found");
        alert("Enter a Valid City");
    }
    else {
        alert("Unexpected Error");
        
    }
    const weatherTheme = data.weather[0].main;
    setWeatherTheme(weatherTheme);

}

searchBtn.addEventListener("click" , ()=>{
    checkWeather(searchBox.value);
});
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (searchBox.value.trim() !== "") {
            checkWeather(searchBox.value);
        } else {
            alert("Please enter a city");
        }
    }
});

