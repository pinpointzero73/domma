(function () {
    'use strict';

    // ========================================
    // Configuration
    // ========================================

    const API_KEY_STORAGE = 'domma-weather-api-key';
    const LAST_CITY_STORAGE = 'domma-weather-last-city';
    const API_BASE = 'https://api.openweathermap.org/data/2.5';

    // ========================================
    // State Management
    // ========================================

    let apiKey = null;
    let currentCity = null;

    // ========================================
    // API Key Management
    // ========================================

    function loadApiKey() {
        apiKey = S.get(API_KEY_STORAGE);
        if (apiKey) {
            showWeatherUI();
            // Load last searched city
            const lastCity = S.get(LAST_CITY_STORAGE);
            if (lastCity) {
                searchWeather(lastCity);
            }
        } else {
            showApiKeySetup();
        }
    }

    function saveApiKey() {
        const input = $('#api-key-input').val().trim();
        if (!input) {
            showError('Please enter an API key');
            return;
        }

        // Test the API key
        testApiKey(input).then(valid => {
            if (valid) {
                apiKey = input;
                S.set(API_KEY_STORAGE, apiKey);
                showWeatherUI();
                showSuccess('API key saved successfully!');
            } else {
                showError('Invalid API key. Please check and try again.');
            }
        });
    }

    function changeApiKey() {
        S.remove(API_KEY_STORAGE);
        S.remove(LAST_CITY_STORAGE);
        apiKey = null;
        currentCity = null;
        showApiKeySetup();
    }

    async function testApiKey(key) {
        try {
            const response = await fetch(
                `${API_BASE}/weather?q=London&appid=${key}&units=metric`
            );
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // ========================================
    // UI State Management
    // ========================================

    function showApiKeySetup() {
        $('#api-key-setup').show();
        $('#api-key-manage').hide();
        $('#weather-search').hide();
        $('#current-weather').hide();
        $('#forecast-section').hide();
    }

    function showWeatherUI() {
        $('#api-key-setup').hide();
        $('#api-key-manage').show();
        $('#weather-search').show();
    }

    // ========================================
    // Weather Data Fetching
    // ========================================

    async function searchWeather(city) {
        if (!city) {
            showError('Please enter a city name');
            return;
        }

        try {
            showLoading();

            // Fetch current weather
            const currentData = await fetchCurrentWeather(city);
            displayCurrentWeather(currentData);

            // Fetch 5-day forecast
            const forecastData = await fetchForecast(city);
            displayForecast(forecastData);

            // Save last searched city
            currentCity = city;
            S.set(LAST_CITY_STORAGE, city);

            hideLoading();
        } catch (error) {
            hideLoading();
            showError(error.message || 'Failed to fetch weather data');
        }
    }

    async function searchByLocation() {
        if (!navigator.geolocation) {
            showError('Geolocation is not supported by your browser');
            return;
        }

        showLoading('Getting your location...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const {latitude, longitude} = position.coords;

                try {
                    // Fetch weather by coordinates
                    const currentData = await fetchCurrentWeatherByCoords(latitude, longitude);
                    displayCurrentWeather(currentData);

                    const forecastData = await fetchForecastByCoords(latitude, longitude);
                    displayForecast(forecastData);

                    hideLoading();
                } catch (error) {
                    hideLoading();
                    showError('Failed to fetch weather for your location');
                }
            },
            (error) => {
                hideLoading();
                showError('Unable to retrieve your location');
            }
        );
    }

    async function fetchCurrentWeather(city) {
        const url = `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found');
                }
                throw new Error('Failed to fetch weather data');
            }

            return await response.json();
        } catch (error) {
            if (error.message === 'City not found') {
                throw error;
            }
            // Handle SSL/network errors
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                throw new Error('Network error: Please ensure you\'re accessing this page via HTTP/HTTPS (not file://), and check your internet connection.');
            }
            throw error;
        }
    }

    async function fetchCurrentWeatherByCoords(lat, lon) {
        const url = `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            return await response.json();
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                throw new Error('Network error: Please ensure you\'re accessing this page via HTTP/HTTPS (not file://), and check your internet connection.');
            }
            throw error;
        }
    }

    async function fetchForecast(city) {
        const url = `${API_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }

            return await response.json();
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                throw new Error('Network error: Please ensure you\'re accessing this page via HTTP/HTTPS (not file://), and check your internet connection.');
            }
            throw error;
        }
    }

    async function fetchForecastByCoords(lat, lon) {
        const url = `${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }

            return await response.json();
        } catch (error) {
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                throw new Error('Network error: Please ensure you\'re accessing this page via HTTP/HTTPS (not file://), and check your internet connection.');
            }
            throw error;
        }
    }

    // ========================================
    // Weather Display
    // ========================================

    function displayCurrentWeather(data) {
        $('#current-weather').show();

        $('#city-name').text(`${data.name}, ${data.sys.country}`);
        $('#weather-date').text(new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));

        const iconCode = data.weather[0].icon;
        $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${iconCode}@2x.png`);
        $('#weather-icon').attr('alt', data.weather[0].description);

        $('#temperature').text(Math.round(data.main.temp));
        $('#weather-description').text(
            data.weather[0].description.charAt(0).toUpperCase() +
            data.weather[0].description.slice(1)
        );

        $('#humidity').text(data.main.humidity);
        $('#wind-speed').text(Math.round(data.wind.speed * 3.6)); // m/s to km/h
        $('#pressure').text(data.main.pressure);
        $('#feels-like').text(Math.round(data.main.feels_like));
    }

    function displayForecast(data) {
        $('#forecast-section').show();

        // Get one forecast per day (at noon)
        const dailyForecasts = data.list.filter(item =>
            item.dt_txt.includes('12:00:00')
        ).slice(0, 5);

        const forecastHTML = dailyForecasts.map(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-GB', {weekday: 'short'});
            const iconCode = day.weather[0].icon;

            return `
                <div class="forecast-card">
                    <h4>${dayName}</h4>
                    <img src="https://openweathermap.org/img/wn/${iconCode}.png"
                         alt="${day.weather[0].description}" />
                    <p class="forecast-temp">
                        <strong>${Math.round(day.main.temp_max)}°</strong> /
                        ${Math.round(day.main.temp_min)}°
                    </p>
                    <p class="forecast-desc">${day.weather[0].main}</p>
                </div>
            `;
        }).join('');

        $('#forecast-cards').html(forecastHTML);
    }

    // ========================================
    // Loading & Error States
    // ========================================

    function showLoading(message = 'Loading weather data...') {
        if (!$('#loading-indicator').length) {
            $('body').append(`
                <div id="loading-indicator" class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
                </div>
            `);
        }
    }

    function hideLoading() {
        $('#loading-indicator').remove();
    }

    function showError(message) {
        const toast = $('<div class="weather-toast error"></div>').text(message);
        $('body').append(toast);
        setTimeout(() => toast.addClass('show'), 10);
        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function showSuccess(message) {
        const toast = $('<div class="weather-toast success"></div>').text(message);
        $('body').append(toast);
        setTimeout(() => toast.addClass('show'), 10);
        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // Event Handlers
    // ========================================

    function initEventHandlers() {
        // API Key
        $('#save-api-key').on('click', saveApiKey);
        $('#change-api-key').on('click', changeApiKey);
        $('#api-key-input').on('keypress', (e) => {
            if (e.key === 'Enter') saveApiKey();
        });

        // Search
        $('#search-btn').on('click', () => {
            const city = $('#city-search').val().trim();
            searchWeather(city);
        });

        $('#city-search').on('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = $('#city-search').val().trim();
                searchWeather(city);
            }
        });

        // Geolocation
        $('#location-btn').on('click', searchByLocation);
    }

    // ========================================
    // Initialization
    // ========================================

    function init() {
        loadApiKey();
        initEventHandlers();
        Domma.icons.scan();
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
