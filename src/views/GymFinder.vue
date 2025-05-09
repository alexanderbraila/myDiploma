<template>
  <div class="container">
    <h2 class="mb-4">Найближчий зал</h2>
    <div class="controls mb-3">
      <select
        v-model="filter"
        @change="updateMarkers"
        class="form-select w-auto d-inline-block me-2"
      >
        <option value="all">Усі зали</option>
        <option value="open">Відкрито зараз</option>
        <option value="nearest">Найближчий до мене</option>
      </select>
      <button @click="getUserLocation" class="btn btn-primary me-2">
        Показати моє місце
      </button>
    </div>
    <div id="map" class="map-container"></div>
    <div v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster";

export default {
  data() {
    return {
      map: null,
      userPosition: null,
      errorMessage: "",
      filter: "all",
      userPositionMarker: null,
      markers: null,
      initialZoom: 11,
      initialCenter: [48.469597, 35.053667],
      gyms: [
        {
          name: "Energy Fit",
          address: "вул Калинова, 8Д, Дніпро",
          hours: "Пн-Пт: 07:30-22:00, Сб-Нд: 07:30-20:00",
          lat: 48.5105212,
          lng: 35.0768014,
          color: "#e63946",
        },
        {
          name: 'Фитнес клуб "Тітан"',
          address: "просп. Дмитра Яворницького, 25, Дніпро",
          hours: "Пн-Пт: 08:00-21:00, Сб-Нд: 09:00-18:00",
          lat: 48.4564165,
          lng: 35.0573607,
          color: "#1d3557",
        },
        {
          name: "Фітнес-клуб F3",
          address: "проспект Слобожанський, 76А, Дніпро",
          hours: "Пн-Пт: 07:00-21:00, Сб-Нд: 09:00-16:00",
          lat: 48.517202,
          lng: 35.0775641,
          color: "#f4a261",
        },
        {
          name: "LineGym",
          address: "вул. Ніла Армстронга, 2Д, Дніпро",
          hours: "Пн-Пт: 08:00-20:00, Сб-Нд: 10:00-17:00",
          lat: 48.4286618,
          lng: 35.0389512,
          color: "#457b9d",
        },
        {
          name: 'Спортивний Зал "Наутилус"',
          address: "вулиця Набережна Заводська, 97Д, Дніпро",
          hours: "Пн-Пт: 08:00-21:00, Сб-Нд: 09:00-17:00",
          lat: 48.510662,
          lng: 35.0782051,
          color: "#e76f51",
        },
        {
          name: "Anna Fitness",
          address: "вулиця Павла Нірінберга, 10, Дніпро",
          hours: "Пн-Пт: 08:00-21:00, Сб-Нд: 08:00-21:00",
          lat: 48.4662391,
          lng: 35.0526208,
          color: "#2ecc71",
        },
        {
          name: "BEZONE TRX CLUB DNEPR",
          address: "вулиця Набережна Перемоги, 26б, Дніпро",
          hours: "Пн-Пт: 08:00-21:00, Сб-Нд: 10:00-15:00",
          lat: 48.4492348,
          lng: 35.0719274,
          color: "#9b59b6",
        },
        {
          name: "Ajax",
          address: "проспект Богдана Хмельницького, 36А, Дніпро",
          hours: "Пн-Пт: 07:00-22:00, Сб-Нд: 09:00-20:00",
          lat: 48.4247224,
          lng: 35.0084496,
          color: "#3498db",
        },
        {
          name: "Тренажерный зал Днепр",
          address: "вулиця Херсонська, 10А, Дніпро",
          hours: "Пн-Пт: 07:50-21:00, Сб-Нд: 09:00-18:00",
          lat: 48.4627201,
          lng: 35.0313214,
          color: "#e74c3c",
        },
      ],
    };
  },
  computed: {
    isDarkMode() {
      return this.$root.currentTheme === "dark";
    },
  },
  watch: {
    "$root.currentTheme": {
      handler(newTheme) {
        console.log("Theme changed to:", newTheme);
        if (this.map) {
          this.updateMapTiles();
          this.updateMarkers();
        }
      },
    },
  },
  mounted() {
    this.initMap();
    if (this.map) {
      console.log("Map initialized, setting initial tiles and markers");
      this.updateMapTiles();
      this.updateMarkers();
    } else {
      this.errorMessage = "Не вдалося ініціалізувати карту.";
      console.error("Map initialization failed");
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },
  methods: {
    initMap() {
      if (!this.map) {
        console.log("Initializing map...");
        try {
          this.map = L.map("map", {
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            boxZoom: false,
            maxZoom: 11,
            minZoom: 11,
          }).setView(this.initialCenter, this.initialZoom);

          this.markers = L.markerClusterGroup({
            iconCreateFunction: (cluster) => {
              const childCount = cluster.getChildCount();
              const color = "#e63946";
              return L.divIcon({
                html: `<div class="cluster-marker" style="
                  background-color: ${color};
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: white;
                  font-weight: bold;
                  font-size: 16px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                ">${childCount}</div>`,
                className: "custom-cluster",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              });
            },
          });
          this.map.addLayer(this.markers);
          console.log("Map initialized successfully");
        } catch (error) {
          this.errorMessage = `Помилка ініціалізації карти: ${error.message}`;
          console.error("Map initialization error:", error);
        }
      }
    },
    updateMapTiles() {
      if (this.map) {
        console.log("Updating map tiles, theme:", this.isDarkMode);
        this.map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            this.map.removeLayer(layer);
          }
        });
        L.tileLayer(
          this.isDarkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: this.isDarkMode
              ? '© <a href="https://carto.com/attributions">CARTO</a>'
              : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 11,
            subdomains: "abc",
          }
        ).addTo(this.map);
      } else {
        console.error("Map is not initialized for tile update");
      }
    },
    updateMarkers() {
      if (!this.map || !this.markers) {
        console.error("Map or markers not initialized for update");
        return;
      }

      console.log("Updating markers");
      this.markers.clearLayers();

      let filteredGyms = this.gyms;

      if (this.filter === "open") {
        filteredGyms = this.gyms.filter((gym) => this.isOpenNow(gym.hours));
      } else if (this.filter === "nearest" && this.userPosition) {
        filteredGyms = this.getNearestGym();
      }

      filteredGyms.forEach((gym) => {
        const marker = L.marker([gym.lat, gym.lng], {
          icon: L.divIcon({
            className: "custom-marker",
            html: `
              <div class="marker-circle" style="
                background-color: ${gym.color};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 16px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
              ">
                <i class="fas fa-dumbbell"></i>
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        });

        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${gym.lat},${gym.lng}`;
        const appleMapsUrl = `https://maps.apple.com/?ll=${gym.lat},${
          gym.lng
        }&q=${encodeURIComponent(gym.name)}`;

        const popupContent = `
          <div class="gym-popup">
            <h3>${gym.name}</h3>
            <p><strong>Адреса:</strong> ${gym.address}</p>
            <p><strong>Години роботи:</strong> ${gym.hours}</p>
            <div class="popup-buttons">
              <a href="${googleMapsUrl}" target="_blank" class="btn btn-primary btn-sm">Google Maps</a>
              <a href="${appleMapsUrl}" target="_blank" class="btn btn-secondary btn-sm">Apple Maps</a>
            </div>
          </div>
        `;

        const popup = L.popup({ maxWidth: 300 }).setContent(popupContent);

        marker.bindPopup(popup);

        marker.on("click", () => {
          console.log("Marker clicked, opening popup for:", gym.name);
          marker.openPopup();
        });

        this.markers.addLayer(marker);
      });
    },
    isOpenNow(hours) {
      const now = new Date();
      const day = now.getDay();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const [weekdayHours, weekendHours] = hours.split(", ");
      const isWeekend = day === 0 || day === 6;
      const timeRange = isWeekend
        ? weekendHours.split(": ")[1]
        : weekdayHours.split(": ")[1];

      const [open, close] = timeRange.split("-").map((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      });

      return currentTime >= open && currentTime <= close;
    },
    getNearestGym() {
      if (!this.userPosition) return this.gyms;

      const nearest = this.gyms.reduce(
        (closest, gym) => {
          const distance = this.getDistance(
            this.userPosition.lat,
            this.userPosition.lng,
            gym.lat,
            gym.lng
          );
          return distance < closest.distance ? { gym, distance } : closest;
        },
        { gym: this.gyms[0], distance: Infinity }
      );

      return [nearest.gym];
    },
    getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log("User position:", this.userPosition);
            if (this.map) {
              if (this.userPositionMarker) {
                this.map.removeLayer(this.userPositionMarker);
              }
              this.userPositionMarker = L.marker(
                [this.userPosition.lat, this.userPosition.lng],
                {
                  icon: L.icon({
                    iconUrl:
                      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  }),
                }
              )
                .addTo(this.map)
                .bindPopup("Ви тут!")
                .openPopup();
              this.updateMarkers();
            }
          },
          (error) => {
            this.errorMessage = `Помилка геолокації: ${error.message}. Дозвольте доступ до місця розташування в налаштуваннях браузера.`;
            console.error("Geolocation error:", error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        this.errorMessage = "Геолокація не підтримується вашим браузером.";
        console.log("Geolocation not supported");
      }
    },
  },
};
</script>

<style scoped>
.container {
  margin: 0;
  width: 100%;
  padding: 20px;
  padding-top: 80px;
  background: var(--bg-color);
  border-radius: 15px;
  box-shadow: 0 4px 15px var(--shadow-color);
  animation: fadeIn 0.5s ease-out;
}

h2 {
  color: var(--text-color);
  font-weight: 700;
  animation: slideInLeft 0.5s ease-out;
}

.map-container {
  height: 500px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 15px var(--shadow-color);
}

.gym-popup h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.gym-popup p {
  margin: 0.3rem 0;
  color: var(--text-color);
}

.popup-buttons {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  background-color: var(--button-bg);
  border-color: var(--button-bg);
  color: white;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.btn-primary:hover {
  background-color: var(--button-hover);
  border-color: var(--button-hover);
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

.btn-sm {
  font-size: 0.875rem;
}

.custom-marker {
  display: flex;
  justify-content: center;
  align-items: center;
}

.marker-circle:hover {
  opacity: 0.8;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.custom-marker .fas {
  font-size: 18px;
}

.cluster-marker {
  display: flex;
  justify-content: center;
  align-items: center;
}

.alert-danger {
  background-color: rgba(255, 133, 162, 0.2);
  color: var(--error-color);
  border-color: var(--error-color);
  border-radius: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
