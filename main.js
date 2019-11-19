// https://bl.ocks.org/almccon/410b4eb5cad61402c354afba67a878b8
// var width = 960,
//     height = 500;

// var path = d3.geoPath();

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json"
// d3.json(url, function(error, topology) {
//   if (error) throw error;
  
//   console.log("topojson", topology)
//   var geojson = topojson.feature(topology, topology.objects.counties);
//   console.log("geojson", geojson)

//   svg.selectAll("path")
//       .data(geojson.features)
//     .enter().append("path")
//       .attr("d", path);
// });


// https://bost.ocks.org/mike/leaflet/
// var map = new L.Map("map", {center: [37.8, -96.9], zoom: 4})
//     .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

// var svg = d3.select(map.getPanes().overlayPane).append("svg"),
//     g = svg.append("g").attr("class", "leaflet-zoom-hide");

/*
Sources
https://www.toptal.com/javascript/a-map-to-perfection-using-d3-js-to-make-beautiful-web-maps
*/

// var width = 900;
// var height = 700;

// var projection = d3.geoMercator();

// var svg = d3.select("body")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var path = d3.geoPath()
//     .projection(projection);

// var g = svg.append("g");

// d3.json("world-110m2.json", function(err, topology) {
//     g.selectAll("path")
//         .data(topojson.feature(topology, topology.objects.countries).features)
//         .enter()
//         .append("path")
//         .attr("class", function(d) { return "countries " + d.id; })
//         .attr("d", path)
// });

/*
* https://medium.com/@amy.degenaro/introduction-to-digital-cartography-geojson-and-d3-js-c27f066aa84
*/

const svg = d3.select("svg")
const myProjection = d3.geoNaturalEarth1() // initialize new projection
const path = d3.geoPath().projection(myProjection) // initialize a new geoPath with chosen projection
const graticule = d3.geoGraticule() // display lattitude/longitude

function drawMap(err, world) {
    if (err) throw err
    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
    svg.append("path")
      .datum(graticule.outline)
      .attr("class", "foreground")
      .attr("d", path);
    svg.append("g")
      .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter().append("path")
      .attr("d", path);
}

d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json", drawMap)