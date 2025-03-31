//pinta ubicacion actual//
/*var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
 const lat = position.coords.latitude; const long = position.coords.longitude;
   console.log(`Latitud: ${lat}\nLongitud: ${long}`);

     map.setView([lat, long], 13);

 var marker = L.marker([lat, long]).addTo(map);
   marker.bindPopup("Estás aquí").openPopup();
     
      
        let datos = `<h1>Aquí estás!</h1>
        <p>Lat: ${lat.toFixed(4)}</p>
        <p>Long: ${long.toFixed(4)}</p>`;
        document.getElementById('datos').innerHTML = datos;
    });
} else {
    console.warn("Tu navegador no soporta Geolocalización!!");}
    */

//dibujar un mapa de terremotos//
function paintGraph(data) {
  
  var map = L.map('map').setView([51.505, -0.09], 13);

    // para limpiar el mapa y tome nuevos valores//
  map.eachLayer(layer => {
    if (layer instanceof L.Circlemarker) {
      map.removeLayer(layer)
    }
  })
  
  data.forEach((terremoto) => {
let place=terremoto.properties.place
let magn=terremoto.properties.mag
//esto es para que se vea el mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
   
    //para pintar lo colores de magnitud de un terremoto//
    let color= magn < 2 ?"green": magn > 2 && magn < 4 ? "yellow" :  magn > 4 && magn < 6 ?"red": "purple"


    var circle = L.circle([terremoto.geometry.coordinates[1], terremoto.geometry.coordinates[0]], {
      color: color,
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map).bindPopup(`terremoto en ${place} con magnitud ${magn}`);
  })
}


async function getData() {
  try {
    // 1 - Obtención de datos
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Recurso no encontrado (404)");
      } else if (response.status === 500) {
        throw new Error("Error en el servidor (500)");
      } else {
        throw new Error(`Error HTTP: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(data.features);

    // Tratamiento + representar gráficamente los datos. Pasos 2-3
    paintGraph(data.features);

  } catch (error) {
    // Manejar el error de manera personalizada
    if (error.message.includes("404")) {
      console.error("Error: No se encontró el recurso solicitado.");
    } else if (error.message.includes("500")) {
      console.error("Error: Problemas con el servidor.");
    } else {
      console.error("Hubo un problema:", error.message);
    }
  }
}

getData();


