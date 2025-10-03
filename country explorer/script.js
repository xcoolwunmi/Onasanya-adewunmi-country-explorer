


// Select elements
const countriesList = document.getElementById("countries-list");
const detailsContent = document.getElementById("details-content");
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionFilter");
const toggleDark = document.getElementById("toggleDark");

// Fetch all countries
async function fetchCountries() {
  try {
    countriesList.innerHTML = "<p>Loading...</p>";
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) throw new Error("Failed to fetch countries");
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    countriesList.innerHTML = "<p style='color:red;'>Error loading countries.</p>";
  }
}

// Display countries list
function displayCountries(countries) {
  countriesList.innerHTML = "";
  countries.forEach(country => {
    const countryDiv = document.createElement("div");
    countryDiv.classList.add("country-card");
    countryDiv.innerHTML = `
      <h3>${country.name.common}</h3>
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="80">
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    `;
    countryDiv.addEventListener("click", () => showCountryDetails(country));
    countriesList.appendChild(countryDiv);
  });
}

// Show details of one country
function showCountryDetails(country) {
  detailsContent.innerHTML = `
    <h3>${country.name.common}</h3>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
    <p><strong>Currencies:</strong> ${country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "N/A"}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
    <p><a href="${country.maps.googleMaps}" target="_blank">View on Google Maps</a></p>
  `;
}

// Search functionality
searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.trim();
  if (!searchTerm) {
    fetchCountries();
    return;
  }
  try {
    countriesList.innerHTML = "<p>Loading...</p>";
    const response = await fetch(`https://restcountries.com/v3.1/name/${searchTerm}`);
    if (!response.ok) throw new Error("Not found");
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    countriesList.innerHTML = "<p style='color:red;'>No countries found.</p>";
  }
});

// Filter by region
regionSelect.addEventListener("change", async (e) => {
  const region = e.target.value;
  if (!region) {
    fetchCountries();
    return;
  }
  try {
    countriesList.innerHTML = "<p>Loading...</p>";
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    if (!response.ok) throw new Error("Failed to fetch region");
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    countriesList.innerHTML = "<p style='color:red;'>Error loading region data.</p>";
  }
});

// Dark/Light mode toggle
toggleDark.addEventListener("click", () => {
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.replace("dark-mode", "light-mode");
    toggleDark.textContent = " Dark Mode";
    localStorage.setItem("theme", "light-mode");
  } else {
    document.body.classList.replace("light-mode", "dark-mode");
    toggleDark.textContent = " Light Mode";
    localStorage.setItem("theme", "dark-mode");
  }
});

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark-mode";
  document.body.classList.add(savedTheme);
  toggleDark.textContent =
    savedTheme === "dark-mode" ? " Light Mode" : "Dark Mode";
});


// Initial load
fetchCountries();
