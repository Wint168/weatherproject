document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    loadWeather(city);
  }
});

async function loadWeather(city) {
  const result = document.getElementById("result");
  result.textContent = "Loading...";

  try {
    const res = await fetch(`/weather?city=${city}`);
    const data = await res.json();

    

    if (data.error) {
      result.textContent = "City not found.";
      return;
    }

    const cond = data.currentConditions.conditions.toLowerCase();
    const icon = data.currentConditions.icon.toLowerCase();
    const temp = data.currentConditions.temp;

    
    const now = data.currentConditions.datetimeEpoch;
    const sunrise = data.currentConditions.sunriseEpoch;
    const sunset = data.currentConditions.sunsetEpoch;

    const isNight = now < sunrise || now > sunset;

    
    let category;

    if (temp < 0) {
      category = "snow";
    }
    else if (cond.includes("rain") || cond.includes("Rain, Partially cloudy")) {
      category = "rain";
    }
    else if (cond.includes("overcast")) {
      category = "overcast";
    }
    else if (cond.includes("partially") || cond.includes("cloud")) {
      category = "pcloudy";
    }
    else {
      category = "clear";
    }

   
    let frames;

    if (category === "snow") {
      frames = isNight
        ? ["nsnow.png", "nsnow2.png"]
        : ["snow.png", "snow2.png"];
    }
    else if (category === "rain") {
      frames = isNight
        ? ["nrain.png", "nrain2.png"]
        : ["rain.png", "rain2.png"];
    }
    else if (category === "overcast") {
      frames = isNight
        ? ["ncloudy.png", "ncloudy2.png"]
        : ["overcast.png", "overcast2.png"];
    }
    else if (category === "pcloudy") {
      frames = isNight
        ? ["ncloudy.png", "ncloudy2.png"]
        : ["pcloudy.png", "pcloudy2.png"];
    }
    else {
      frames = isNight
        ? ["night.png", "night2.png"]
        : ["sunny.png", "sunny2.png"];
    }

    
  result.innerHTML = `
  <div style="text-align: center;">
    <div class="nes-container is-rounded is-dark" style="display: inline-block; padding: 10px;">
      <h2>${data.address}</h2>
      <p>Temperature: ${temp} °C</p>
      <p>Conditions: ${data.currentConditions.conditions}</p>
    </div>
    <br>
    <img id="weatherAnim" src="${frames[0]}" alt="Animation" width="340" style="margin-top: 10px;">
  </div>
`;

    let current = 0;
    const img = document.getElementById("weatherAnim");

    setInterval(() => {
      current = (current + 1) % frames.length;
      img.src = frames[current];
    }, 500);

  } catch (err) {
    result.textContent = "Server error.";
  }
}


