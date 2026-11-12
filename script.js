
const API_KEY = "a6a8e727a64c39f118057a37e0696fef";

const input = document.querySelector(".inputbox");
const searchIcon = document.querySelector(".searchicon");
const CURRENT_API =
    "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_API =
    "https://api.openweathermap.org/data/2.5/forecast";

const AIR_API =
    "https://api.openweathermap.org/data/2.5/air_pollution";

function getLocalDate(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toISOString().split("T")[0];
}
function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    let hours = date.getUTCHours();
    let minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

function getWeatherIcon(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
async function getWeather(city) {

    if (!city) {
        alert("Please enter a city name");
        return;
    }
    try {
        const currentResponse = await fetch(
            `${CURRENT_API}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        const currentData = await currentResponse.json();

        if (!currentResponse.ok) {
            throw new Error(currentData.message);
        }
        console.log("Current Weather:", currentData);
        const timezone = currentData.timezone;
        const latitude = currentData.coord.lat;
        const longitude = currentData.coord.lon;
        document.querySelector(".topbox h6").innerText =
            currentData.name;

        document.querySelector(".topbox h3").innerText =
            `${Math.round(currentData.main.temp)} °C`;

        document.querySelector(".topbox > h5").innerText =
            currentData.weather[0].description;
        const currentDate = getLocalDate(
            Math.floor(Date.now() / 1000),
            timezone
        );

        const currentTime = formatTime(
            Math.floor(Date.now() / 1000),
            timezone
        );
        document.querySelector(".img1div h5").innerText =
            formatDate(currentDate);
        document.querySelector(".img2div h5").innerText =
            currentTime;
        const weatherCards = [
            {
                title: "Pressure",
                value: `${currentData.main.pressure} hPa`
            },
            {
                title: "Humidity",
                value: `${currentData.main.humidity}%`
            },
            {
                title: "Wind Speed",
                value: `${currentData.wind.speed} m/s`
            },
            {
                title: "Feels Like",
                value: `${Math.round(currentData.main.feels_like)} °C`
            }
        ];

        weatherCards.forEach((item, index) => {

            const card = document.querySelector(
                [".r11", ".r12", ".r13", ".r14"][index]
            );

            card.querySelector(".txt1").innerText = item.title;
            card.querySelector(".txt2").innerText = item.value;

        });
        document.querySelector(".sunrise1").innerText =
            "Sunrise";

        document.querySelector(".suntime").innerText =
            formatTime(currentData.sys.sunrise, timezone);

        document.querySelector(".moon1").innerText =
            "Sunset";

        document.querySelector(".moontime").innerText =
            formatTime(currentData.sys.sunset, timezone);
        const forecastResponse = await fetch(
            `${FORECAST_API}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const forecastData = await forecastResponse.json();

        if (!forecastResponse.ok) {
            throw new Error(forecastData.message);
        }

        console.log("Forecast Data:", forecastData);

        updateFiveDays(forecastData, timezone);

        updateHourly(forecastData, timezone);

        const airResponse = await fetch(
            `${AIR_API}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );

        const airData = await airResponse.json();

        if (!airResponse.ok) {
            throw new Error(airData.message);
        }
        console.log("Air Quality:", airData);

        updateAirQuality(airData);
    } catch (error) {
        console.error("Weather Error:", error);

        alert(error.message);

    }
}

function updateFiveDays(data, timezone) {

    const forecastList = data.list;

    const today = getLocalDate(
        Math.floor(Date.now() / 1000),
        timezone
    );
    const groupedDays = {};
    forecastList.forEach(item => {

        const date = getLocalDate(item.dt, timezone);
        if (date === today) return;

        if (!groupedDays[date]) {
            groupedDays[date] = [];
        }

        groupedDays[date].push(item);

    });
    const fiveDays = Object.keys(groupedDays)
        .sort()
        .slice(0, 5)
        .map(date => {
            const forecasts = groupedDays[date];
            return forecasts.reduce((closest, item) => {
                const itemDate = new Date(
                    (item.dt + timezone) * 1000
                );
                const closestDate = new Date(
                    (closest.dt + timezone) * 1000
                );
                const itemDifference = Math.abs(
                    itemDate.getUTCHours() - 12
                );
                const closestDifference = Math.abs(
                    closestDate.getUTCHours() - 12
                );
                return itemDifference < closestDifference
                    ? item
                    : closest;

            });

        });

    const rows = document.querySelectorAll(
        ".wholedivbtm > div"
    );
    rows.forEach((row, index) => {
        const item = fiveDays[index];
        if (!item) return;
        const date = new Date(
            (item.dt + timezone) * 1000
        );
        const dayName = date.toLocaleDateString("en-US", {
            weekday: "long",
            timeZone: "UTC"
        });
        const dateString = getLocalDate(item.dt, timezone);

        row.querySelector(".cloud").src =
            getWeatherIcon(item.weather[0].icon);

        row.querySelector(".n1").innerText =
            `${Math.round(item.main.temp)} °C`;

        row.querySelector(".w1").innerText =
            dayName;

        row.querySelector(".d1").innerText =
            formatDate(dateString);

    });

}

function updateHourly(data, timezone) {

    const hourlyCards = document.querySelectorAll(".hour");

    const today = getLocalDate(
        Math.floor(Date.now() / 1000),
        timezone
    );
    const todayForecast = data.list.filter(item => {

        return getLocalDate(item.dt, timezone) === today;

    }).slice(0, 6);
    hourlyCards.forEach((card, index) => {

        const item = todayForecast[index];

        if (!item) {
            card.style.display = "none";
            return;
        }

        card.style.display = "flex";
        card.querySelector("h6").innerText =
            formatTime(item.dt, timezone);
        card.querySelector("img").src =
            getWeatherIcon(item.weather[0].icon);
        card.querySelector("p").innerText =
            `${Math.round(item.main.temp)} °C`;

    });

}

function updateAirQuality(data) {

    if (!data.list || !data.list.length) return;
    const air = data.list[0];
    const components = air.components;
    const pollutants = [
        {
            name: "PM2.5",
            value: components.pm2_5
        },
        {
            name: "SO2",
            value: components.so2
        },
        {
            name: "NO2",
            value: components.no2
        },
        {
            name: "O3",
            value: components.o3
        }
    ];

    const pollutantElements = document.querySelectorAll(".d");

    pollutantElements.forEach((element, index) => {

        const pollutant = pollutants[index];

        element.children[0].innerText = pollutant.name;

        element.children[1].innerText =
            Number(pollutant.value).toFixed(2);

    });
    document.querySelector(".row2box1").innerText =
        `Air Quality Index (AQI: ${air.main.aqi}/5)`;

}
searchIcon.addEventListener("click", () => {

    getWeather(input.value.trim());

});


input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        getWeather(input.value.trim());

    }

});
