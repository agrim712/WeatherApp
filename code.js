const userTab = document.querySelector("[data-user]");
const searchTab = document.querySelector("[data-search]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-SearchForm]");
const loading = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const Errors = document.querySelector(".errors");
const p = document.querySelector(".para");
const API_KEY = "60b36456f9c755098e8e643155e0f560";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")
        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            Errors.classList.remove("active");
            p.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            Errors.classList.remove("active");
            p.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    Errors.classList.remove("active");
    p.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loading.classList.add("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loading.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loading.classList.remove("active");
        console.log("Error:", err);
    }
}


function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const temp = document.querySelector("[data-temp]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
    return weatherInfo?.name;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("No support");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") {
        return;
    }
     else {
        fetchSearchWeatherInfo(cityName);
    }
});


async function fetchSearchWeatherInfo(city) {
    loading.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    Errors.classList.remove("active");
    p.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        const data = await response.json();
        loading.classList.remove("active");
        userInfoContainer.classList.add("active");
        Errors.classList.remove("active");
        p.classList.remove("active");
        renderWeatherInfo(data);
    } catch (err) {
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        loading.classList.remove("active");
        Errors.classList.add("active");
        p.classList.add("active");
    }
}


// function renderinfo(data) {
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
//     userInfoContainer.appendChild(newPara);
// }

// async function shoWeather() {
//     let city = "delhi";
//     const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//     const data = await res.json();
//     console.log("Weather data", data);
//     renderinfo(data);
// }

// shoWeather();

// async function details() {
//     try {
//         let lat = 17.6333;
//         let lon = 18.3333;
//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
//         const d = await result.json();
//         console.log("Weather data", d);
//     } catch (e) {
//         console.log("Found an error", e);
//     }
// }

// details();




// getLocation();

