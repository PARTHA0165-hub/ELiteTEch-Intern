const API_KEY = "6d04563b3be15aa111a0e330d92a5684";

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        document.getElementById("weatherResult").innerHTML = "<p>Please enter a city name.</p>";
        return;
    }
    fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`, city);
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            },
            () => {
                document.getElementById("weatherResult").innerHTML = "<p>Location access denied.</p>";
            }
        );
    } else {
        document.getElementById("weatherResult").innerHTML = "<p>Geolocation not supported.</p>";
    }
}

async function fetchWeatherData(url, cityName = null) {
    const resultDiv = document.getElementById("weatherResult");
    resultDiv.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === "404") {
            resultDiv.innerHTML = "<p>City not found. Try again.</p>";
            return;
        }

        resultDiv.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
            <p><strong>${data.main.temp}°C</strong> - ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <h3 style="margin-top:15px;">5-Day Forecast</h3>
            <div id="forecast" class="forecast-container"></div>
        `;

        fetchForecast(cityName || data.name);
    } catch {
        resultDiv.innerHTML = "<p>Error fetching data. Please try again later.</p>";
    }
}

async function fetchForecast(city) {
    const forecastContainer = document.getElementById("forecast");
    try {
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        forecastContainer.innerHTML = "";

        const dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

        dailyData.forEach(day => {
            const date = new Date(day.dt_txt);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            const card = document.createElement("div");
            card.classList.add("forecast-card");

            card.innerHTML = `
                <p>${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Icon">
                <p>${Math.round(day.main.temp)}°C</p>
            `;

            forecastContainer.appendChild(card);
        });
    } catch {
        forecastContainer.innerHTML = "<p>Unable to load forecast data.</p>";
    }
}
