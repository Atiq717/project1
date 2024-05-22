$(document).ready(function() {
    function handleError(modalId, error) {
      $(`#${modalId} .modal-body`).html(`Failed to fetch data: ${error}`);
      $(`#${modalId}`).modal("show");
    }
  
    const streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    });
  
    const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    });
  
    const basemaps = {
      "Streets": streets,
      "Satellite": satellite
    };
  
    const map = L.map('map').setView([0, 0], 2);
    streets.addTo(map);
  
    const infoBtn = L.easyButton("fa-info", function(btn, map) {
      $("#exampleModal").modal("show");
    }).addTo(map);
  
    const demographicsBtn = L.easyButton("fa-chart-bar", function(btn, map) {
      $("#demographicsModal").modal("show");
    }).addTo(map);
  
    const wikiBtn = L.easyButton("fa-book", function(btn, map) {
      $("#wikiModal").modal("show");
    }).addTo(map);
  
    const newsBtn = L.easyButton("fa-newspaper", function(btn, map) {
      $("#newsModal").modal("show");
    }).addTo(map);
  
    const currencyBtn = L.easyButton("fa-money-bill", function(btn, map) {
      $("#currencyModal").modal("show");
    }).addTo(map);
  
    const weatherBtn = L.easyButton("fa-cloud-sun", function(btn, map) {
      $("#weatherModal").modal("show");
    }).addTo(map);
  
    const layerControl = L.control.layers(basemaps).addTo(map);
  
    $.getJSON('geojson/countries.geojson', function(geojsonData) {
      console.log('GeoJSON data loaded:', geojsonData);
  
      L.geoJSON(geojsonData, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup('<strong>' + feature.properties.name + '</strong>');
        }
      }).addTo(map);
  
      let options = '<option value="">Select a country</option>';
      geojsonData.features.forEach(function(feature) {
        const country = feature.properties;
        options += `<option value="${country.iso_a2}" data-lat="${country.latitude}" data-lon="${country.longitude}" data-currency="${country.iso_4217}">${country.name}</option>`;
      });
      $('#country-dropdown').html(options);
      console.log('Dropdown populated');
    })
    .fail(function() {
      console.error('Failed to load GeoJSON data');
    });
  
    $('#country-dropdown').on('change', function () {
      const selectedCountryCode = $(this).val();
      if (selectedCountryCode) {
        $.ajax({
          url: 'php/get_country_info.php',
          method: 'GET',
          data: { iso_a2: selectedCountryCode },
          success: function(response) {
            try {
              const data = JSON.parse(response);
              if (data.error) {
                handleError('exampleModal', data.error);
              } else {
                let tableContent = `
                  <tr><td>Country Name</td><td>${data.properties.name}</td></tr>
                  <tr><td>ISO Code</td><td>${data.properties.iso_a2}</td></tr>
                  <tr><td>Capital</td><td>${data.properties.capital || 'N/A'}</td></tr>
                  <tr><td>Currency</td><td>${data.properties.iso_4217}</td></tr>
                  <tr><td>Latitude</td><td>${data.properties.latitude}</td></tr>
                  <tr><td>Longitude</td><td>${data.properties.longitude}</td></tr>
                `;
                $('#exampleModal .table').html(tableContent);
              }
            } catch (e) {
              handleError('exampleModal', e.message);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            handleError('exampleModal', `AJAX Error: ${textStatus} - ${errorThrown}`);
          }
        });
      }
    });
  
    $('#country-dropdown').on('change', function () {
      const selectedCountryName = $('#country-dropdown option:selected').text();
      if (selectedCountryName) {
        $.ajax({
          url: 'php/get_demographics.php',
          method: 'GET',
          data: { country: selectedCountryName },
          success: function(response) {
            try {
              console.log('Demographics Response:', response);
              const data = JSON.parse(response);
              if (data.error) {
                handleError('demographicsModal', data.error);
              } else {
                let tableContent = `
                  <tr><td>Country Name</td><td>${data.name}</td></tr>
                  <tr><td>Official Name</td><td>${data.official_name}</td></tr>
                  <tr><td>Capital City</td><td>${data.capital}</td></tr>
                  <tr><td>Current Population</td><td>${data.population}</td></tr>
                  <tr><td>Area</td><td>${data.area} sq km</td></tr>
                  <tr><td>Region</td><td>${data.region}</td></tr>
                  <tr><td>Timezones</td><td>${data.timezones.join(', ')}</td></tr>
                  <tr><td>Languages</td><td>${Object.values(data.languages).join(', ')}</td></tr>
                  <tr><td>Currencies</td><td>${Object.values(data.currencies).map(c => `${c.name} (${c.symbol})`).join(', ')}</td></tr>
                  <tr><td>Calling Code</td><td>${data.calling_code}</td></tr>
                  <tr><td>Flag</td><td><img src="${data.flag}" alt="Flag" width="100"></td></tr>
                `;
                $('#demographicsModal .table').html(tableContent);
              }
            } catch (e) {
              handleError('demographicsModal', e.message);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            handleError('demographicsModal', `AJAX Error: ${textStatus} - ${errorThrown}`);
          }
        });
      }
    });
  
    $('#country-dropdown').on('change', function () {
      const selectedCountryName = $('#country-dropdown option:selected').text();
      if (selectedCountryName) {
        $.ajax({
          url: 'php/get_wikipedia_link.php',
          method: 'GET',
          data: { country: selectedCountryName },
          success: function(response) {
            try {
              const data = JSON.parse(response);
              if (data.wikiUrl) {
                $('#wikiModal .modal-body').html(`<a href="${data.wikiUrl}" target="_blank">Visit Wikipedia page</a>`);
              } else {
                $('#wikiModal .modal-body').html('No Wikipedia link found.');
              }
            } catch (e) {
              handleError('wikiModal', e.message);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            handleError('wikiModal', `AJAX Error: ${textStatus} - ${errorThrown}`);
          }
        });
      }
    });
  
    $('#country-dropdown').on('change', function () {
      const selectedCountryName = $('#country-dropdown option:selected').text();
      if (selectedCountryName) {
        $.ajax({
          url: 'php/get_news.php',
          method: 'GET',
          data: { country: selectedCountryName },
          success: function(response) {
            try {
              const data = JSON.parse(response);
              if (data.error) {
                handleError('newsModal', data.error);
              } else {
                let newsContent = '<ul>';
                data.forEach(function(article) {
                  newsContent += `
                    <li>
                      <strong>${article.title}</strong><br>
                      Source: ${article.name}<br>
                      Author: ${article.author || 'N/A'}<br>
                      Description: ${article.description || 'N/A'}<br>
                      <a href="${article.url}" target="_blank">Read more</a><br>
                      Published at: ${new Date(article.publishedAt).toLocaleString()}<br>
                    </li><hr>
                  `;
                });
                newsContent += '</ul>';
                $('#newsModal .modal-body').html(newsContent);
              }
            } catch (e) {
              handleError('newsModal', e.message);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            handleError('newsModal', `AJAX Error: ${textStatus} - ${errorThrown}`);
          }
        });
      }
    });
  
    $('#country-dropdown').on('change', function () {
      const lat = $('#country-dropdown option:selected').data('lat');
      const lon = $('#country-dropdown option:selected').data('lon');
      if (lat && lon) {
        $.ajax({
          url: 'php/get_weather.php',
          method: 'GET',
          data: { lat: lat, lon: lon },
          success: function(response) {
            try {
              const data = JSON.parse(response);
              if (data.error) {
                handleError('weatherModal', data.error);
              } else {
                let weatherContent = `
                  <tr><td>Weather Main</td><td>${data.weather[0].main}</td></tr>
                  <tr><td>Weather Description</td><td>${data.weather[0].description}</td></tr>
                  <tr><td>Weather Icon</td><td><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Icon"></td></tr>
                  <tr><td>Temperature</td><td>${(data.main.temp - 273.15).toFixed(2)} °C</td></tr>
                  <tr><td>Feels Like</td><td>${(data.main.feels_like - 273.15).toFixed(2)} °C</td></tr>
                  <tr><td>Temp Min</td><td>${(data.main.temp_min - 273.15).toFixed(2)} °C</td></tr>
                  <tr><td>Temp Max</td><td>${(data.main.temp_max - 273.15).toFixed(2)} °C</td></tr>
                  <tr><td>Pressure</td><td>${data.main.pressure} hPa</td></tr>
                  <tr><td>Humidity</td><td>${data.main.humidity} %</td></tr>
                  <tr><td>Visibility</td><td>${data.visibility} m</td></tr>
                  <tr><td>Wind Speed</td><td>${data.wind.speed} m/s</td></tr>
                  <tr><td>Clouds</td><td>${data.clouds.all} %</td></tr>
                `;
                $('#weatherModal .table').html(weatherContent);
              }
            } catch (e) {
              handleError('weatherModal', e.message);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            handleError('weatherModal', `AJAX Error: ${textStatus} - ${errorThrown}`);
          }
        });
      }
    });
  
    $('#convertCurrencyBtn').click(function() {
      const selectedCountry = $('#country-dropdown option:selected').data('currency');
      const amount = $('#currencyInput').val();
  
      console.log('Selected Country Currency:', selectedCountry);
      console.log('Amount:', amount);
  
      if (selectedCountry && amount) {
        $.ajax({
          url: 'php/get_currency_rate.php',
          method: 'GET',
          data: { currency_code: selectedCountry },
          success: function(response) {
            try {
              const data = JSON.parse(response);
              console.log('Currency API Response:', data);
              if (data.rate) {
                const result = amount * data.rate;
                $('#conversionResult').text(`Converted Amount: ${result}`);
              } else {
                $('#conversionResult').text('Currency code not found.');
              }
            } catch (e) {
              $('#conversionResult').text(`Failed to parse data: ${e.message}`);
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            $('#conversionResult').text(`Failed to fetch currency rate: ${textStatus} - ${errorThrown}`);
          }
        });
      } else {
        $('#conversionResult').text('Please select a country and enter an amount.');
      }
    });
  });
  