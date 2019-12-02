/****************** Global Variables ****************/
// store candy names to create the buttons
var candy = [
  'Butterfinger',
  'Candy Corn',
  'Chiclets',
  'Dots',
  'Fuzzy Peaches',
  'Good N Plenty',
  'Gummy Bears',
  'Healthy Fruit',
  'Heath Bar',
  'Hershey - Dark',
  'Hershey - Milk',
  'Hershey Kisses',
  'Jolly Ranchers - Bad',
  'Jolly Ranchers - Good',
  'Junior Mints',
  'Kit Kit',
  'Laffy Taffy',
  'Lemon Heads',
  'Licorice - Not Black',
  'Licorice - Black',
  'Lollipops',
  'Mike N Ike',
  'Milk Duds',
  'Milky Way',
  'M&Ms',
  'M&Ms - Peanut',
  'Mint Kisses',
  'Mr. Goodbar',
  'Nerds',
  'Nestle Crunch',
  'Peeps',
  'Pixy Stix',
  'Reeses Cups',
  'Rolos',
  'Skittles',
  'Snickers',
  'Sour Patch Kids',
  'Starburst',
  'Swedish Fish',
  'Tic Tacs',
  'Three Musketeers',
  'Tolberone',
  'Trail Mix',
  'Twix',
  'Whatchamacallit',
  'York Peppermint Patties'
];

// hold all the different STATEdata arrays (defined at the end of the d3.csv call)
var stateData;
var outPercent;
outPercent = [];

// set cutoffs
var joyMax = 3.0;
var mehMax = 2.3;
var despairMax = 1.6;

// define colors for each average rating (update to match the key)
// var joyColor = "C5E0B4";
var joyColor20 = "C5E0B4";
var joyColor40 = "B6E09B";
var joyColor60 = "A3E07B";
var joyColor80 = "8DE354";
var joyColor100 = "72E625";

// var mehColor = "FFE699";
var mehColor20 = "FFE699";
var mehColor40 = "FCD96F";
var mehColor60 = "FAD052";
var mehColor80 = "FAC832";
var mehColor100 = "FAC014";

// var despairColor = "B4C7E7";
var despairColor20 = "B4C7E7";
var despairColor40 = "95B3E8";
var despairColor60 = "6D9AE8";
var despairColor80 = "427FEB";
var despairColor100 = "1A65EB";

var grayColor = "808080";

// use to store the average ratings to color the states
var averageRatings = [];
// use to loop through averageRatings in drawMap. There might be a better way to do this
var count = 0;



/****************** Create the Vis ****************/


// create dropdown
var dropdown = d3.select("body")
  .append('p')
  .append('select')
  .attr('id', (d, i) => {return i;})
    .attr('class', 'select')
    .on('change', function() {
      var thisCandyIndexAsString = d3.select('.select').property('value'); // gets the index in the dropdown
      var thisCandyIndex = parseInt(thisCandyIndexAsString);
      console.log("dropdown option index:", thisCandyIndex);
      // get the right candy name to display
      candy.forEach((candyName, index) => {
        if (index === thisCandyIndex) {
          d3.select("#candy_name").text(candyName);
        }
      })
      recolorMap(thisCandyIndex + 2); // pass in index of dropdown option (add 2 because it starts at 0)
    });

// add options to dropdown
dropdown.selectAll('option')
  .data(candy)
  .enter()
  .append('option')
    .text(d => {return d;})
    .attr('value', (d, i) => {return i;})
    // .attr('value', d => {return d;})
    // .attr('value2', (d,i) => {return "id" + i;})

// create svg
var width = 960;
var height= 600;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// initial coloring before button pressed
function initialColoring() { // can probably do with new Array(56).fill(0)
  for (r = 0; r < 56; r++) { // has to be 56 (see geojson: an array of 56 Features)
    averageRatings[r] = -1;
  }
}
initialColoring();

// create map
const myProjection = d3.geoAlbersUsa() // initialize new projection
const path = d3.geoPath().projection(myProjection) // initialize a new geoPath with chosen projection

function drawMap(err, us) {
  if (err) {
    throw err;
  }

  // get the features, which are the states (coordinates plus state names)
  var geojson = topojson.feature(us, us.objects.states);

  count = 0;
  var rating;
  var out;
  // draw the states
  svg.selectAll(".path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path) // d refers to one feature object
    .attr("state-name", d => {
      return d.properties.name;
      // console.log("hello?");
    })
    .style("fill", function(d) {
      out = outPercent[count];
      rating = averageRatings[count++];
      // console.log("out" + out);
      // console.log(d.properties.name, rating);
      if (rating < 0) {
        return grayColor;
      } else if (rating <= despairMax) {
        // return despairColor;
        if (out > 0.8) {
          return despairColor100;
        } else if (out > 0.6) {
          return despairColor80;
        } else if (out > 0.4){
          return despairColor60;
        } else if (out > 0.2) {
          return despairColor40;
        } else {
          return despairColor20;
        }
      } else if (rating <= mehMax) {
        // return mehColor;
        if (out > 0.8) {
          return mehColor100;
        } else if (out > 0.6) {
          return mehColor80;
        } else if (out > 0.4){
          return mehColor60;
        } else if (out > 0.2) {
          return mehColor40;
        } else {
          return mehColor20;
        }
      } else {
        // return joyColor;
        if (out > 0.8) {
          return joyColor100;
        } else if (out > 0.6) {
          return joyColor80;
        } else if (out > 0.4){
          return joyColor60;
        } else if (out > 0.2) {
          return joyColor40;
        } else {
          return joyColor20;
        }

      }

    })
    .on("click", (d, i) => {
      // console.log(count);
      // console.log(i);
      d3.select("#state_name").text(d.properties.name);
      d3.select("#average_rating").text(averageRatings[i]); // TODO - truncate
      d3.select("#num_people").text(stateData[i][0]); // TODO
      d3.select("#percent_out").text(outPercent[i]); // TODO
    });

}

d3.json("Assets/states-10m.json", drawMap);

// add buttons
// candy.forEach((candyName, index) => {
//   d3.select("body")
//     .append("button")
//     .text(candyName)
//     .attr("id", index + 2)
//     .style("margin", "5px")
//     .on('click', function() {
//       d3.select("#candy_name").text(candyName);
//       recolorMap(index + 2); // is this right? add two bc candy starts at index 2 in each STATEdata
//     });
// });


// colormap when dropdown option is selected/changed
function recolorMap(candyIndex) {
  assembleRatings(candyIndex);
  d3.json("Assets/states-10m.json", drawMap);  
}

// create an array with the average ratings for each state for a specific candy
function assembleRatings(candyIndex)  { // I have NOT proofread this to make sure it is correct
  ratings = [];
  console.log("candyIndex in assembleRatings:", candyIndex);
  console.log("stateData:", stateData);
  ratings[0] = stateData[0][candyIndex][3];
  ratings[1] = stateData[1][candyIndex][3];
  ratings[2] = stateData[2][candyIndex][3];
  ratings[3] = stateData[3][candyIndex][3];
  ratings[4] = stateData[4][candyIndex][3];
  ratings[5] = stateData[5][candyIndex][3];
  ratings[6] = stateData[6][candyIndex][3];
  ratings[7] = stateData[7][candyIndex][3];
  ratings[8] = stateData[8][candyIndex][3];
  ratings[9] = stateData[9][candyIndex][3];
  ratings[10] = stateData[10][candyIndex][3];
  ratings[11] = stateData[11][candyIndex][3];
  ratings[12] = stateData[12][candyIndex][3];
  ratings[13] = stateData[13][candyIndex][3];
  ratings[14] = stateData[14][candyIndex][3];
  ratings[15] = stateData[15][candyIndex][3];
  ratings[16] = stateData[16][candyIndex][3];
  ratings[17] = stateData[17][candyIndex][3];
  ratings[18] = stateData[18][candyIndex][3];
  ratings[19] = stateData[19][candyIndex][3];
  ratings[20] = stateData[20][candyIndex][3];
  ratings[21] = stateData[21][candyIndex][3];
  ratings[22] = stateData[22][candyIndex][3];
  ratings[23] = stateData[23][candyIndex][3];
  ratings[24] = stateData[24][candyIndex][3];
  ratings[25] = stateData[25][candyIndex][3];
  ratings[26] = stateData[26][candyIndex][3];
  ratings[27] = stateData[27][candyIndex][3];
  ratings[28] = stateData[28][candyIndex][3];
  ratings[29] = stateData[29][candyIndex][3];
  ratings[30] = stateData[30][candyIndex][3];
  ratings[31] = stateData[31][candyIndex][3];
  ratings[32] = stateData[32][candyIndex][3];
  ratings[33] = stateData[33][candyIndex][3];
  ratings[34] = stateData[34][candyIndex][3];
  ratings[35] = stateData[35][candyIndex][3];
  ratings[36] = stateData[36][candyIndex][3];
  ratings[37] = stateData[37][candyIndex][3];
  ratings[38] = stateData[38][candyIndex][3];
  ratings[39] = stateData[39][candyIndex][3];
  ratings[40] = stateData[40][candyIndex][3];
  ratings[41] = stateData[41][candyIndex][3];
  ratings[42] = stateData[42][candyIndex][3];
  ratings[43] = stateData[43][candyIndex][3];
  ratings[44] = stateData[44][candyIndex][3];
  ratings[45] = stateData[45][candyIndex][3];
  ratings[46] = stateData[46][candyIndex][3];
  ratings[47] = stateData[47][candyIndex][3];
  ratings[48] = stateData[48][candyIndex][3];
  ratings[49] = stateData[49][candyIndex][3];
  ratings[50] = stateData[50][candyIndex][3];
  ratings[51] = stateData[51][candyIndex][3];
  ratings[52] = stateData[52][candyIndex][3];
  ratings[53] = stateData[53][candyIndex][3];
  ratings[54] = stateData[54][candyIndex][3];
  ratings[55] = stateData[55][candyIndex][3];

  outPercent[0] = stateData[0][1][1]/stateData[0][0];
  outPercent[1] = stateData[1][1][1]/stateData[1][0];
  outPercent[2] = stateData[2][1][1]/stateData[2][0];
  outPercent[3] = stateData[3][1][1]/stateData[3][0];
  outPercent[4] = stateData[4][1][1]/stateData[4][0];
  outPercent[5] = stateData[5][1][1]/stateData[5][0];
  outPercent[6] = stateData[6][1][1]/stateData[6][0];
  outPercent[7] = stateData[7][1][1]/stateData[7][0];
  outPercent[8] = stateData[8][1][1]/stateData[8][0];
  outPercent[9] = stateData[9][1][1]/stateData[9][0];
  outPercent[10] = stateData[10][1][1]/stateData[10][0];
  outPercent[11] = stateData[11][1][1]/stateData[11][0];
  outPercent[12] = stateData[12][1][1]/stateData[12][0];
  outPercent[13] = stateData[13][1][1]/stateData[13][0];
  outPercent[14] = stateData[14][1][1]/stateData[14][0];
  outPercent[15] = stateData[15][1][1]/stateData[15][0];
  outPercent[16] = stateData[16][1][1]/stateData[16][0];
  outPercent[17] = stateData[17][1][1]/stateData[17][0];
  outPercent[18] = stateData[18][1][1]/stateData[18][0];
  outPercent[19] = stateData[19][1][1]/stateData[19][0];
  outPercent[20] = stateData[20][1][1]/stateData[20][0];
  outPercent[21] = stateData[21][1][1]/stateData[21][0];
  outPercent[22] = stateData[22][1][1]/stateData[22][0];
  outPercent[23] = stateData[23][1][1]/stateData[23][0];
  outPercent[24] = stateData[24][1][1]/stateData[24][0];
  outPercent[25] = stateData[25][1][1]/stateData[25][0];
  outPercent[26] = stateData[26][1][1]/stateData[26][0];
  outPercent[27] = stateData[27][1][1]/stateData[27][0];
  outPercent[28] = stateData[28][1][1]/stateData[28][0];
  outPercent[29] = stateData[29][1][1]/stateData[29][0];
  outPercent[30] = stateData[30][1][1]/stateData[30][0];
  outPercent[31] = stateData[31][1][1]/stateData[31][0];
  outPercent[32] = stateData[32][1][1]/stateData[32][0];
  outPercent[33] = stateData[33][1][1]/stateData[33][0];
  outPercent[34] = stateData[34][1][1]/stateData[34][0];
  outPercent[35] = stateData[35][1][1]/stateData[35][0];
  outPercent[36] = stateData[36][1][1]/stateData[36][0];
  outPercent[37] = stateData[37][1][1]/stateData[37][0];
  outPercent[38] = stateData[38][1][1]/stateData[38][0];
  outPercent[39] = stateData[39][1][1]/stateData[39][0];
  outPercent[40] = stateData[40][1][1]/stateData[40][0];
  outPercent[41] = stateData[41][1][1]/stateData[41][0];
  outPercent[42] = stateData[42][1][1]/stateData[42][0];
  outPercent[43] = stateData[43][1][1]/stateData[43][0];
  outPercent[44] = stateData[44][1][1]/stateData[44][0];
  outPercent[45] = stateData[45][1][1]/stateData[45][0];
  outPercent[46] = stateData[46][1][1]/stateData[46][0];
  outPercent[47] = stateData[47][1][1]/stateData[47][0];
  outPercent[48] = stateData[48][1][1]/stateData[48][0];
  outPercent[49] = stateData[49][1][1]/stateData[49][0];
  outPercent[50] = stateData[50][1][1]/stateData[50][0];
  outPercent[51] = stateData[51][1][1]/stateData[51][0];
  outPercent[52] = stateData[52][1][1]/stateData[52][0];
  outPercent[53] = stateData[53][1][1]/stateData[53][0];
  outPercent[54] = stateData[54][1][1]/stateData[54][0];
  outPercent[55] = stateData[55][1][1]/stateData[55][0];

  // console.log("test state data: " + outPercent);

  averageRatings = ratings;

}

/****************** Getting CSV Data ****************/

var ALdata; //Alabama AL
var AKdata; //Arkansas AK
var AZdata; //Arizona AZ
var ARdata; //ARKANSAS	AR
var CAdata;// CALIFORNIA	CA
var COdata;// COLORADO	CO
var CTdata;// CONNECTICUT	CT
var DEdata;// DELAWARE	DE
var DCdata;// DISTRICT OF COLUMBIA	DC
var FLdata;// FLORIDA	FL
var GAdata;// GEORGIA	GA
var HIdata;// HAWAII	HI
var IDdata;// IDAHO	ID
var ILdata;// ILLINOIS	IL
var INdata;// INDIANA	IN
var IAdata;// IOWA	IA
var KSdata;// KANSAS	KS
var KYdata;// KENTUCKY	KY
var LAdata;// LOUISIANA	LA
var MEdata;// MAINE	ME
var MDdata;// MARYLAND	MD
var MAdata;// MASSACHUSETTS	MA
var MIdata;// MICHIGAN	MI
var MNdata;// MINNESOTA	MN
var MSdata;// MISSISSIPPI	MS
var MOdata;// MISSOURI	MO
var MTdata;// MONTANA	MT
var NEdata;// NEBRASKA	NE
var NVdata;// NEVADA	NV
var NHdata;// NEW HAMPSHIRE	NH
var NJdata;// NEW JERSEY	NJ
var NMdata;// NEW MEXICO	NM
var NYdata;// NEW YORK	NY
var NCdata;// NORTH CAROLINA	NC
var NDdata;// NORTH DAKOTA	ND
var OHdata;// OHIO	OH
var OKdata;// OKLAHOMA	OK
var ORdata;// OREGON	OR
var PAdata;// PENNSYLVANIA	PA
var RIdata;// RHODE ISLAND	RI
var SCdata;// SOUTH CAROLINA	SC
var SDdata;// SOUTH DAKOTA	SD
var TNdata;// TENNESSEE	TN
var TXdata;// TEXAS	TX
var UTdata;// UTAH	UT
var VTdata;// VERMONT	VT
var VAdata;// VIRGINIA	VA
var WAdata;// WASHINGTON	WA
var WVdata;// WEST VIRGINIA	WV
var WIdata;// WISCONSIN	WI
var WYdata;// WYOMING	WY

//CANADA
var BCdata;// BRITISH COLUMBIA	BC
var ABdata;// ALBERTA	AB
var SKdata;// SASKATCHEWAN	SK
var MBdata;// MANITOBA	MB
var ONdata;// ONTARIO	ON
var QCdata;// QUEBEC	QC
var NBdata;// NEW BRUNSWICK	NB
var NSdata;// NOVA SCOTIA	NS
var PEdata;// PRINCE EDWARD ISLAND	PE
var NFdata;// NEWFOUNDLAND	NF
var NTdata;// NORTHWEST TERRITORIES	NT
var YTdata;// YUKON	YT

var OTHERdata;

d3.csv("./candy-state.csv", function(data){

  //Goals: Per state, candy score average
  //       Per state, % of people who go out for halloween
  //       Per state, chocolate/non-chocolate scores

  // console.log(data[0].Butterfinger);

  //Initialize variables for all states
  ALdata = new Array(49);
  ALdata[0] = 0;
  ALdata[1] = new Array(3).fill(0);

  AKdata = new Array(49);
  AKdata[0] = 0;
  AKdata[1] = new Array(3).fill(0);

  AZdata = new Array(49);
  AZdata[0] = 0;
  AZdata[1] = new Array(3).fill(0);

  ARdata = new Array(49);
  ARdata[0] = 0;
  ARdata[1] = new Array(3).fill(0);

  CAdata = new Array(49);
  CAdata[0] = 0;
  CAdata[1] = new Array(3).fill(0);

  COdata = new Array(49);
  COdata[0] = 0;
  COdata[1] = new Array(3).fill(0);

  CTdata = new Array(49);
  CTdata[0] = 0;
  CTdata[1] = new Array(3).fill(0);

  DEdata = new Array(49);
  DEdata[0] = 0;
  DEdata[1] = new Array(3).fill(0);

  DCdata = new Array(49);
  DCdata[0] = 0;
  DCdata[1] = new Array(3).fill(0);

  FLdata = new Array(49);
  FLdata[0] = 0;
  FLdata[1] = new Array(3).fill(0);

  GAdata = new Array(49);
  GAdata[0] = 0;
  GAdata[1] = new Array(3).fill(0);

  HIdata = new Array(49);
  HIdata[0] = 0;
  HIdata[1] = new Array(3).fill(0);

  IDdata = new Array(49);
  IDdata[0] = 0;
  IDdata[1] = new Array(3).fill(0);

  ILdata = new Array(49);
  ILdata[0] = 0;
  ILdata[1] = new Array(3).fill(0);

  INdata = new Array(49);
  INdata[0] = 0;
  INdata[1] = new Array(3).fill(0);

  IAdata = new Array(49);
  IAdata[0] = 0;
  IAdata[1] = new Array(3).fill(0);

  KSdata = new Array(49);
  KSdata[0] = 0;
  KSdata[1] = new Array(3).fill(0);

  KYdata = new Array(49);
  KYdata[0] = 0;
  KYdata[1] = new Array(3).fill(0);

  LAdata = new Array(49);
  LAdata[0] = 0;
  LAdata[1] = new Array(3).fill(0);

  MEdata = new Array(49);
  MEdata[0] = 0;
  MEdata[1] = new Array(3).fill(0);

  MDdata = new Array(49);
  MDdata[0] = 0;
  MDdata[1] = new Array(3).fill(0);

  MAdata = new Array(49);
  MAdata[0] = 0;
  MAdata[1] = new Array(3).fill(0);

  MIdata = new Array(49);
  MIdata[0] = 0;
  MIdata[1] = new Array(3).fill(0);

  MNdata = new Array(49);
  MNdata[0] = 0;
  MNdata[1] = new Array(3).fill(0);

  MSdata = new Array(49);
  MSdata[0] = 0;
  MSdata[1] = new Array(3).fill(0);

  MOdata = new Array(49);
  MOdata[0] = 0;
  MOdata[1] = new Array(3).fill(0);

  MTdata = new Array(49);
  MTdata[0] = 0;
  MTdata[1] = new Array(3).fill(0);

  NEdata = new Array(49);
  NEdata[0] = 0;
  NEdata[1] = new Array(3).fill(0);

  NVdata = new Array(49);
  NVdata[0] = 0;
  NVdata[1] = new Array(3).fill(0);

  NHdata = new Array(49);
  NHdata[0] = 0;
  NHdata[1] = new Array(3).fill(0);

  NJdata = new Array(49);
  NJdata[0] = 0;
  NJdata[1] = new Array(3).fill(0);

  NMdata = new Array(49);
  NMdata[0] = 0;
  NMdata[1] = new Array(3).fill(0);

  NYdata = new Array(49);
  NYdata[0] = 0;
  NYdata[1] = new Array(3).fill(0);

  NCdata = new Array(49);
  NCdata[0] = 0;
  NCdata[1] = new Array(3).fill(0);

  NDdata = new Array(49);
  NDdata[0] = 0;
  NDdata[1] = new Array(3).fill(0);

  OHdata = new Array(49);
  OHdata[0] = 0;
  OHdata[1] = new Array(3).fill(0);

  OKdata = new Array(49);
  OKdata[0] = 0;
  OKdata[1] = new Array(3).fill(0);

  ORdata = new Array(49);
  ORdata[0] = 0;
  ORdata[1] = new Array(3).fill(0);

  PAdata = new Array(49);
  PAdata[0] = 0;
  PAdata[1] = new Array(3).fill(0);

  RIdata = new Array(49);
  RIdata[0] = 0;
  RIdata[1] = new Array(3).fill(0);

  SCdata = new Array(49);
  SCdata[0] = 0;
  SCdata[1] = new Array(3).fill(0);

  SDdata = new Array(49);
  SDdata[0] = 0;
  SDdata[1] = new Array(3).fill(0);

  TNdata = new Array(49);
  TNdata[0] = 0;
  TNdata[1] = new Array(3).fill(0);

  TXdata = new Array(49);
  TXdata[0] = 0;
  TXdata[1] = new Array(3).fill(0);

  UTdata = new Array(49);
  UTdata[0] = 0;
  UTdata[1] = new Array(3).fill(0);

  VTdata = new Array(49);
  VTdata[0] = 0;
  VTdata[1] = new Array(3).fill(0);

  VAdata = new Array(49);
  VAdata[0] = 0;
  VAdata[1] = new Array(3).fill(0);

  WAdata = new Array(49);
  WAdata[0] = 0;
  WAdata[1] = new Array(3).fill(0);

  WVdata = new Array(49);
  WVdata[0] = 0;
  WVdata[1] = new Array(3).fill(0);

  WIdata = new Array(49);
  WIdata[0] = 0;
  WIdata[1] = new Array(3).fill(0);

  WYdata = new Array(49);
  WYdata[0] = 0;
  WYdata[1] = new Array(3).fill(0);

  //canada
  BCdata = new Array(49);
  BCdata[0] = 0;
  BCdata[1] = new Array(3).fill(0);

  ABdata = new Array(49);
  ABdata[0] = 0;
  ABdata[1] = new Array(3).fill(0);

  SKdata = new Array(49);
  SKdata[0] = 0;
  SKdata[1] = new Array(3).fill(0);

  MBdata = new Array(49);
  MBdata[0] = 0;
  MBdata[1] = new Array(3).fill(0);

  ONdata = new Array(49);
  ONdata[0] = 0;
  ONdata[1] = new Array(3).fill(0);

  QCdata = new Array(49);
  QCdata[0] = 0;
  QCdata[1] = new Array(3).fill(0);

  NBdata = new Array(49);
  NBdata[0] = 0;
  NBdata[1] = new Array(3).fill(0);

  NSdata = new Array(49);
  NSdata[0] = 0;
  NSdata[1] = new Array(3).fill(0);

  PEdata = new Array(49);
  PEdata[0] = 0;
  PEdata[1] = new Array(3).fill(0);

  NFdata = new Array(49);
  NFdata[0] = 0;
  NFdata[1] = new Array(3).fill(0);

  NTdata = new Array(49);
  NTdata[0] = 0;
  NTdata[1] = new Array(3).fill(0);

  YTdata = new Array(49);
  YTdata[0] = 0;
  YTdata[1] = new Array(3).fill(0);

  OTHERdata = new Array(49);
  OTHERdata[0] = 0;
  OTHERdata[1] = new Array(3).fill(0);




  
  for (var k = 2; k < 49; k++) {
    ALdata[k] = new Array(4).fill(0);
    AKdata[k] = new Array(4).fill(0);
    AZdata[k] = new Array(4).fill(0);
    ARdata[k] = new Array(4).fill(0);
    CAdata[k] = new Array(4).fill(0);
    COdata[k] = new Array(4).fill(0);
    CTdata[k] = new Array(4).fill(0);
    DEdata[k] = new Array(4).fill(0);
    DCdata[k] = new Array(4).fill(0);
    FLdata[k] = new Array(4).fill(0);
    GAdata[k] = new Array(4).fill(0);
    HIdata[k] = new Array(4).fill(0);
    IDdata[k] = new Array(4).fill(0);
    ILdata[k] = new Array(4).fill(0);
    INdata[k] = new Array(4).fill(0);
    IAdata[k] = new Array(4).fill(0);
    KSdata[k] = new Array(4).fill(0);
    KYdata[k] = new Array(4).fill(0);
    LAdata[k] = new Array(4).fill(0);
    MEdata[k] = new Array(4).fill(0);
    MDdata[k] = new Array(4).fill(0);
    MAdata[k] = new Array(4).fill(0);
    MIdata[k] = new Array(4).fill(0);
    MNdata[k] = new Array(4).fill(0);
    MSdata[k] = new Array(4).fill(0);
    MOdata[k] = new Array(4).fill(0);
    MTdata[k] = new Array(4).fill(0);
    NEdata[k] = new Array(4).fill(0);
    NVdata[k] = new Array(4).fill(0);
    NHdata[k] = new Array(4).fill(0);
    NJdata[k] = new Array(4).fill(0);
    NMdata[k] = new Array(4).fill(0);
    NYdata[k] = new Array(4).fill(0);
    NCdata[k] = new Array(4).fill(0);
    NDdata[k] = new Array(4).fill(0);
    OHdata[k] = new Array(4).fill(0);
    OKdata[k] = new Array(4).fill(0);
    ORdata[k] = new Array(4).fill(0);
    PAdata[k] = new Array(4).fill(0);
    RIdata[k] = new Array(4).fill(0);
    SCdata[k] = new Array(4).fill(0);
    SDdata[k] = new Array(4).fill(0);
    TNdata[k] = new Array(4).fill(0);
    TXdata[k] = new Array(4).fill(0);
    UTdata[k] = new Array(4).fill(0);
    VTdata[k] = new Array(4).fill(0);
    VAdata[k] = new Array(4).fill(0);
    WAdata[k] = new Array(4).fill(0);
    WVdata[k] = new Array(4).fill(0);
    WIdata[k] = new Array(4).fill(0);
    WYdata[k] = new Array(4).fill(0);

    //canada

    BCdata[k] = new Array(4).fill(0);
    ABdata[k] = new Array(4).fill(0);
    SKdata[k] = new Array(4).fill(0);
    MBdata[k] = new Array(4).fill(0);
    ONdata[k] = new Array(4).fill(0);
    QCdata[k] = new Array(4).fill(0);
    NBdata[k] = new Array(4).fill(0);
    NSdata[k] = new Array(4).fill(0);
    PEdata[k] = new Array(4).fill(0);
    NFdata[k] = new Array(4).fill(0);
    NTdata[k] = new Array(4).fill(0);
    YTdata[k] = new Array(4).fill(0);

    OTHERdata[k] = new Array(4).fill(0);

  }

  // numbers for each candy
  for(var i = 0; i < data.length; i++) {
    var currSt = data[i].STATE; //0
    var currOut = data[i].OUT; //1
    var currBF = data[i].Butterfinger; //2
    var currCC = data[i].CandyCorn;//3
    var currCL = data[i].Chiclets; //4
    var currDT = data[i].Dots //5
    var currFP = data[i].FuzzyPeaches //6
    var currGP = data[i].GoodNPlenty //7
    var currGB = data[i].GummyBears //8
    var currHF = data[i].HealthyFruit //9
    var currHB = data[i].HeathBar //10
    var currHD = data[i].HersheyDark //11
    var currHM = data[i].HersheyMilk //12
    var currHK = data[i].HersheyKisses //13
    var currJB = data[i].JollyRancherBad //14
    var currJG = data[i].JollyRanchersGood //15
    var currJM = data[i].JuniorMints //16
    var currKK = data[i].KitKat //17
    var currLT = data[i].LaffyTaffy //18
    var currLH = data[i].LemonHeads //19
    var currLN = data[i].LicoriceNotBlack //20
    var currLB = data[i].LicoriceYesBlack //21
    var currLP = data[i].Lollipops //22
    var currMI = data[i].MikeIke //23
    var currMD = data[i].MilkDuds //24
    var currMW = data[i].MilkyWay //25
    var currMM = data[i].RegularMM //26
    var currPM = data[i].PeanutMM //27
    var currMK = data[i].MintKisses //28
    var currMG = data[i].MrGoodbar //29
    var currND = data[i].Nerds //30
    var currNC = data[i].NestleCrunch //31
    var currPP = data[i].Peeps //32
    var currPS = data[i].PixyStix //33
    var currRC = data[i].ReesesCups //34
    var currRP = data[i].ReesesPieces //35
    var currRL = data[i].Rolos //36
    var currSK = data[i].Skittles //37
    var currSN = data[i].Snickers //38
    var currSP = data[i].SourpatchKids //39
    var currST = data[i].Starburst //40
    var currSF = data[i].SwedishFish //41
    var currTT = data[i].TicTacs //42
    var currTM = data[i].ThreeMusketeers //43
    var currTB = data[i].Tolberone //44
    var currTM = data[i].TrailMix //45
    var currTW = data[i].Twix //46
    var currWM = data[i].Whatchamacallit //47
    var currYP = data[i].YorkPeppermintPatties //48


    switch(currSt) {
      case "AL":
        ALdata[0]++;

        if (currOut == "No") {
          ALdata[1][0]++;
        } else if (currOut = "Yes") {
          ALdata[1][1]++;
        }

        //Butterfinger 2
        if (currBF == "DESPAIR") {
          ALdata[2][0]++;
        } else if (currBF == "MEH") {
          ALdata[2][1]++;
        } else if (currBF == "JOY") {
          ALdata[2][2]++;
        }

        //CandyCorn 3
        if (currCC == "DESPAIR") {
          ALdata[3][0]++;
        } else if (currCC == "MEH") {
          ALdata[3][1]++;
        } else if (currCC == "JOY") {
          ALdata[3][2]++;
        }

        //chiclets 4
        if (currCL == "DESPAIR") {
          ALdata[4][0]++;
        } else if (currCL == "MEH") {
          ALdata[4][1]++;
        } else if (currCL == "JOY") {
          ALdata[4][2]++;
        }

        //Dots 5
        if (currDT == "DESPAIR") {
          ALdata[5][0]++;
        } else if (currDT == "MEH") {
          ALdata[5][1]++;
        } else if (currDT == "JOY") {
          ALdata[5][2]++;
        }

        //Fuzzy Peaches 6
        if (currFP == "DESPAIR") {
          ALdata[6][0]++;
        } else if (currFP == "MEH") {
          ALdata[6][1]++;
        } else if (currFP == "JOY") {
          ALdata[6][2]++;
        }

        //Good n Plenty 7
        if (currGP == "DESPAIR") {
          ALdata[7][0]++;
        } else if (currGP == "MEH") {
          ALdata[7][1]++;
        } else if (currGP == "JOY") {
          ALdata[7][2]++;
        }

        //Gummy Bears 8
        if (currGB == "DESPAIR") {
          ALdata[8][0]++;
        } else if (currGB == "MEH") {
          ALdata[8][1]++;
        } else if (currGB == "JOY") {
          ALdata[8][2]++;
        }

        //Healthy Fruit 9
        if (currHF == "DESPAIR") {
          ALdata[9][0]++;
        } else if (currHF == "MEH") {
          ALdata[9][1]++;
        } else if (currHF == "JOY") {
          ALdata[9][2]++;
        }

        //Heath Bar 10
        if (currHB == "DESPAIR") {
          ALdata[10][0]++;
        } else if (currHB == "MEH") {
          ALdata[10][1]++;
        } else if (currHB == "JOY") {
          ALdata[10][2]++;
        }

        //Hershey Dark 11
        if (currHD == "DESPAIR") {
          ALdata[11][0]++;
        } else if (currHD == "MEH") {
          ALdata[11][1]++;
        } else if (currHD == "JOY") {
          ALdata[11][2]++;
        }

        //Hershy Milk 12
        if (currHM == "DESPAIR") {
          ALdata[12][0]++;
        } else if (currHM == "MEH") {
          ALdata[12][1]++;
        } else if (currHM == "JOY") {
          ALdata[12][2]++;
        }

        //Hershey Kisses 13
        if (currHK == "DESPAIR") {
          ALdata[13][0]++;
        } else if (currHK == "MEH") {
          ALdata[13][1]++;
        } else if (currHK == "JOY") {
          ALdata[13][2]++;
        }

        //Jolly Rancher Bad 14
        if (currJB == "DESPAIR") {
          ALdata[14][0]++;
        } else if (currJB == "MEH") {
          ALdata[14][1]++;
        } else if (currJB == "JOY") {
          ALdata[14][2]++;
        }

        //Jolly Rancher Good 15
        if (currJG == "DESPAIR") {
          ALdata[15][0]++;
        } else if (currJG == "MEH") {
          ALdata[15][1]++;
        } else if (currJG == "JOY") {
          ALdata[15][2]++;
        }

        //Junior Mints 16
        if (currJM == "DESPAIR") {
          ALdata[16][0]++;
        } else if (currJM == "MEH") {
          ALdata[16][1]++;
        } else if (currJM == "JOY") {
          ALdata[16][2]++;
        }

        //Kit Kat 17
        if (currKK == "DESPAIR") {
          ALdata[17][0]++;
        } else if (currKK == "MEH") {
          ALdata[17][1]++;
        } else if (currKK == "JOY") {
          ALdata[17][2]++;
        }

        //Laffy Taffy 18
        if (currLT == "DESPAIR") {
          ALdata[18][0]++;
        } else if (currLT == "MEH") {
          ALdata[18][1]++;
        } else if (currLT == "JOY") {
          ALdata[18][2]++;
        }

        //Lemon Heads 19
        if (currLH == "DESPAIR") {
          ALdata[19][0]++;
        } else if (currLH == "MEH") {
          ALdata[19][1]++;
        } else if (currLH == "JOY") {
          ALdata[19][2]++;
        }

        //Licorice not black 20
        if (currLN == "DESPAIR") {
          ALdata[20][0]++;
        } else if (currLN == "MEH") {
          ALdata[20][1]++;
        } else if (currLN == "JOY") {
          ALdata[20][2]++;
        }

        //Licorice black 21
        if (currLB == "DESPAIR") {
          ALdata[21][0]++;
        } else if (currLB == "MEH") {
          ALdata[21][1]++;
        } else if (currLB == "JOY") {
          ALdata[21][2]++;
        }

        //Lollipops 22
        if (currLP == "DESPAIR") {
          ALdata[22][0]++;
        } else if (currLP == "MEH") {
          ALdata[22][1]++;
        } else if (currLP == "JOY") {
          ALdata[22][2]++;
        }

        //mike and ike 23
        if (currMI == "DESPAIR") {
          ALdata[23][0]++;
        } else if (currMI == "MEH") {
          ALdata[23][1]++;
        } else if (currMI == "JOY") {
          ALdata[23][2]++;
        }

        //milk duds 24
        if (currMD == "DESPAIR") {
          ALdata[24][0]++;
        } else if (currMD == "MEH") {
          ALdata[24][1]++;
        } else if (currMD == "JOY") {
          ALdata[24][2]++;
        }

        //milky way 25
        if (currMW == "DESPAIR") {
          ALdata[25][0]++;
        } else if (currMW == "MEH") {
          ALdata[25][1]++;
        } else if (currMW == "JOY") {
          ALdata[25][2]++;
        }
        
        //regular m&ms 26
        if (currMM == "DESPAIR") {
          ALdata[26][0]++;
        } else if (currMM == "MEH") {
          ALdata[26][1]++;
        } else if (currMM == "JOY") {
          ALdata[26][2]++;
        }

        //peanut mms 27
        if (currPM == "DESPAIR") {
          ALdata[27][0]++;
        } else if (currPM == "MEH") {
          ALdata[27][1]++;
        } else if (currPM == "JOY") {
          ALdata[27][2]++;
        }

        //mint kisses 28
        if (currMK == "DESPAIR") {
          ALdata[28][0]++;
        } else if (currMK == "MEH") {
          ALdata[28][1]++;
        } else if (currMK == "JOY") {
          ALdata[28][2]++;
        }

        //mr goodbar 29
        if (currMG == "DESPAIR") {
          ALdata[29][0]++;
        } else if (currMG == "MEH") {
          ALdata[29][1]++;
        } else if (currMG == "JOY") {
          ALdata[29][2]++;
        }

        //nerds 30
        if (currND == "DESPAIR") {
          ALdata[30][0]++;
        } else if (currND == "MEH") {
          ALdata[30][1]++;
        } else if (currND == "JOY") {
          ALdata[30][2]++;
        }

        //nestle crunch 31
        if (currNC == "DESPAIR") {
          ALdata[31][0]++;
        } else if (currNC == "MEH") {
          ALdata[31][1]++;
        } else if (currNC == "JOY") {
          ALdata[31][2]++;
        }

        //peeps 32
        if (currPP == "DESPAIR") {
          ALdata[32][0]++;
        } else if (currPP == "MEH") {
          ALdata[32][1]++;
        } else if (currPP == "JOY") {
          ALdata[32][2]++;
        }

        //pixy stix 33
        if (currPS == "DESPAIR") {
          ALdata[33][0]++;
        } else if (currPS == "MEH") {
          ALdata[33][1]++;
        } else if (currPS == "JOY") {
          ALdata[33][2]++;
        }

        //reeses cups 34
        if (currRC == "DESPAIR") {
          ALdata[34][0]++;
        } else if (currRC == "MEH") {
          ALdata[34][1]++;
        } else if (currRC == "JOY") {
          ALdata[34][2]++;
        }

        //reeses pieces 35
        if (currRP == "DESPAIR") {
          ALdata[35][0]++;
        } else if (currRP == "MEH") {
          ALdata[35][1]++;
        } else if (currRP == "JOY") {
          ALdata[35][2]++;
        }

        //rolos 36
        if (currRL == "DESPAIR") {
          ALdata[36][0]++;
        } else if (currRL == "MEH") {
          ALdata[36][1]++;
        } else if (currRL == "JOY") {
          ALdata[36][2]++;
        }

        //skittles 37
        if (currSK == "DESPAIR") {
          ALdata[37][0]++;
        } else if (currSK == "MEH") {
          ALdata[37][1]++;
        } else if (currSK == "JOY") {
          ALdata[37][2]++;
        }

        //snickers 38
        if (currSN == "DESPAIR") {
          ALdata[38][0]++;
        } else if (currSN == "MEH") {
          ALdata[38][1]++;
        } else if (currSN == "JOY") {
          ALdata[38][2]++;
        }

        //sour patch kids 39
        if (currSP == "DESPAIR") {
          ALdata[39][0]++;
        } else if (currSP == "MEH") {
          ALdata[39][1]++;
        } else if (currSP == "JOY") {
          ALdata[39][2]++;
        }

        //starbursts 40
        if (currST == "DESPAIR") {
          ALdata[40][0]++;
        } else if (currST == "MEH") {
          ALdata[40][1]++;
        } else if (currST == "JOY") {
          ALdata[40][2]++;
        }

        //swedish fish 41
        if (currSF == "DESPAIR") {
          ALdata[41][0]++;
        } else if (currSF == "MEH") {
          ALdata[41][1]++;
        } else if (currSF == "JOY") {
          ALdata[41][2]++;
        }

        //tic tacs 42
        if (currTT == "DESPAIR") {
          ALdata[42][0]++;
        } else if (currTT == "MEH") {
          ALdata[42][1]++;
        } else if (currTT == "JOY") {
          ALdata[42][2]++;
        }

        //three musketeers 43
        if (currTM == "DESPAIR") {
          ALdata[43][0]++;
        } else if (currTM == "MEH") {
          ALdata[43][1]++;
        } else if (currTM == "JOY") {
          ALdata[43][2]++;
        }

        //tolberone 44
        if (currTB == "DESPAIR") {
          ALdata[44][0]++;
        } else if (currTB == "MEH") {
          ALdata[44][1]++;
        } else if (currTB == "JOY") {
          ALdata[44][2]++;
        }

        //trail mix 45
        if (currTM == "DESPAIR") {
          ALdata[45][0]++;
        } else if (currTM == "MEH") {
          ALdata[45][1]++;
        } else if (currTM == "JOY") {
          ALdata[45][2]++;
        }

        //twix 46
        if (currTW == "DESPAIR") {
          ALdata[46][0]++;
        } else if (currTW == "MEH") {
          ALdata[46][1]++;
        } else if (currTW == "JOY") {
          ALdata[46][2]++;
        }

        //whatchamacallit 47
        if (currWM == "DESPAIR") {
          ALdata[47][0]++;
        } else if (currWM == "MEH") {
          ALdata[47][1]++;
        } else if (currWM == "JOY") {
          ALdata[47][2]++;
        }

        //york peppermint patties 48
        if (currYP == "DESPAIR") {
          ALdata[48][0]++;
        } else if (currYP == "MEH") {
          ALdata[48][1]++;
        } else if (currYP == "JOY") {
          ALdata[48][2]++;
        }

        break;
      case "AK":
      AKdata[0]++;

      if (currOut == "No") {
        AKdata[1][0]++;
      } else if (currOut = "Yes") {
        AKdata[1][1]++;
      }

      //Butterfinger 2
      if (currBF == "DESPAIR") {
        AKdata[2][0]++;
      } else if (currBF == "MEH") {
        AKdata[2][1]++;
      } else if (currBF == "JOY") {
        AKdata[2][2]++;
      }

      //CandyCorn 3
      if (currCC == "DESPAIR") {
        AKdata[3][0]++;
      } else if (currCC == "MEH") {
        AKdata[3][1]++;
      } else if (currCC == "JOY") {
        AKdata[3][2]++;
      }

      //chiclets 4
      if (currCL == "DESPAIR") {
        AKdata[4][0]++;
      } else if (currCL == "MEH") {
        AKdata[4][1]++;
      } else if (currCL == "JOY") {
        AKdata[4][2]++;
      }

      //Dots 5
      if (currDT == "DESPAIR") {
        AKdata[5][0]++;
      } else if (currDT == "MEH") {
        AKdata[5][1]++;
      } else if (currDT == "JOY") {
        AKdata[5][2]++;
      }

      //Fuzzy Peaches 6
      if (currFP == "DESPAIR") {
        AKdata[6][0]++;
      } else if (currFP == "MEH") {
        AKdata[6][1]++;
      } else if (currFP == "JOY") {
        AKdata[6][2]++;
      }

      //Good n Plenty 7
      if (currGP == "DESPAIR") {
        AKdata[7][0]++;
      } else if (currGP == "MEH") {
        AKdata[7][1]++;
      } else if (currGP == "JOY") {
        AKdata[7][2]++;
      }

      //Gummy Bears 8
      if (currGB == "DESPAIR") {
        AKdata[8][0]++;
      } else if (currGB == "MEH") {
        AKdata[8][1]++;
      } else if (currGB == "JOY") {
        AKdata[8][2]++;
      }

      //Healthy Fruit 9
      if (currHF == "DESPAIR") {
        AKdata[9][0]++;
      } else if (currHF == "MEH") {
        AKdata[9][1]++;
      } else if (currHF == "JOY") {
        AKdata[9][2]++;
      }

      //Heath Bar 10
      if (currHB == "DESPAIR") {
        AKdata[10][0]++;
      } else if (currHB == "MEH") {
        AKdata[10][1]++;
      } else if (currHB == "JOY") {
        AKdata[10][2]++;
      }

      //Hershey Dark 11
      if (currHD == "DESPAIR") {
        AKdata[11][0]++;
      } else if (currHD == "MEH") {
        AKdata[11][1]++;
      } else if (currHD == "JOY") {
        AKdata[11][2]++;
      }

      //Hershy Milk 12
      if (currHM == "DESPAIR") {
        AKdata[12][0]++;
      } else if (currHM == "MEH") {
        AKdata[12][1]++;
      } else if (currHM == "JOY") {
        AKdata[12][2]++;
      }

      //Hershey Kisses 13
      if (currHK == "DESPAIR") {
        AKdata[13][0]++;
      } else if (currHK == "MEH") {
        AKdata[13][1]++;
      } else if (currHK == "JOY") {
        AKdata[13][2]++;
      }

      //Jolly Rancher Bad 14
      if (currJB == "DESPAIR") {
        AKdata[14][0]++;
      } else if (currJB == "MEH") {
        AKdata[14][1]++;
      } else if (currJB == "JOY") {
        AKdata[14][2]++;
      }

      //Jolly Rancher Good 15
      if (currJG == "DESPAIR") {
        AKdata[15][0]++;
      } else if (currJG == "MEH") {
        AKdata[15][1]++;
      } else if (currJG == "JOY") {
        AKdata[15][2]++;
      }

      //Junior Mints 16
      if (currJM == "DESPAIR") {
        AKdata[16][0]++;
      } else if (currJM == "MEH") {
        AKdata[16][1]++;
      } else if (currJM == "JOY") {
        AKdata[16][2]++;
      }

      //Kit Kat 17
      if (currKK == "DESPAIR") {
        AKdata[17][0]++;
      } else if (currKK == "MEH") {
        AKdata[17][1]++;
      } else if (currKK == "JOY") {
        AKdata[17][2]++;
      }

      //Laffy Taffy 18
      if (currLT == "DESPAIR") {
        AKdata[18][0]++;
      } else if (currLT == "MEH") {
        AKdata[18][1]++;
      } else if (currLT == "JOY") {
        AKdata[18][2]++;
      }

      //Lemon Heads 19
      if (currLH == "DESPAIR") {
        AKdata[19][0]++;
      } else if (currLH == "MEH") {
        AKdata[19][1]++;
      } else if (currLH == "JOY") {
        AKdata[19][2]++;
      }

      //Licorice not black 20
      if (currLN == "DESPAIR") {
        AKdata[20][0]++;
      } else if (currLN == "MEH") {
        AKdata[20][1]++;
      } else if (currLN == "JOY") {
        AKdata[20][2]++;
      }

      //Licorice black 21
      if (currLB == "DESPAIR") {
        AKdata[21][0]++;
      } else if (currLB == "MEH") {
        AKdata[21][1]++;
      } else if (currLB == "JOY") {
        AKdata[21][2]++;
      }

      //Lollipops 22
      if (currLP == "DESPAIR") {
        AKdata[22][0]++;
      } else if (currLP == "MEH") {
        AKdata[22][1]++;
      } else if (currLP == "JOY") {
        AKdata[22][2]++;
      }

      //mike and ike 23
      if (currMI == "DESPAIR") {
        AKdata[23][0]++;
      } else if (currMI == "MEH") {
        AKdata[23][1]++;
      } else if (currMI == "JOY") {
        AKdata[23][2]++;
      }

      //milk duds 24
      if (currMD == "DESPAIR") {
        AKdata[24][0]++;
      } else if (currMD == "MEH") {
        AKdata[24][1]++;
      } else if (currMD == "JOY") {
        AKdata[24][2]++;
      }

      //milky way 25
      if (currMW == "DESPAIR") {
        AKdata[25][0]++;
      } else if (currMW == "MEH") {
        AKdata[25][1]++;
      } else if (currMW == "JOY") {
        AKdata[25][2]++;
      }
      
      //regular m&ms 26
      if (currMM == "DESPAIR") {
        AKdata[26][0]++;
      } else if (currMM == "MEH") {
        AKdata[26][1]++;
      } else if (currMM == "JOY") {
        AKdata[26][2]++;
      }

      //peanut mms 27
      if (currPM == "DESPAIR") {
        AKdata[27][0]++;
      } else if (currPM == "MEH") {
        AKdata[27][1]++;
      } else if (currPM == "JOY") {
        AKdata[27][2]++;
      }

      //mint kisses 28
      if (currMK == "DESPAIR") {
        AKdata[28][0]++;
      } else if (currMK == "MEH") {
        AKdata[28][1]++;
      } else if (currMK == "JOY") {
        AKdata[28][2]++;
      }

      //mr goodbar 29
      if (currMG == "DESPAIR") {
        AKdata[29][0]++;
      } else if (currMG == "MEH") {
        AKdata[29][1]++;
      } else if (currMG == "JOY") {
        AKdata[29][2]++;
      }

      //nerds 30
      if (currND == "DESPAIR") {
        AKdata[30][0]++;
      } else if (currND == "MEH") {
        AKdata[30][1]++;
      } else if (currND == "JOY") {
        AKdata[30][2]++;
      }

      //nestle crunch 31
      if (currNC == "DESPAIR") {
        AKdata[31][0]++;
      } else if (currNC == "MEH") {
        AKdata[31][1]++;
      } else if (currNC == "JOY") {
        AKdata[31][2]++;
      }

      //peeps 32
      if (currPP == "DESPAIR") {
        AKdata[32][0]++;
      } else if (currPP == "MEH") {
        AKdata[32][1]++;
      } else if (currPP == "JOY") {
        AKdata[32][2]++;
      }

      //pixy stix 33
      if (currPS == "DESPAIR") {
        AKdata[33][0]++;
      } else if (currPS == "MEH") {
        AKdata[33][1]++;
      } else if (currPS == "JOY") {
        AKdata[33][2]++;
      }

      //reeses cups 34
      if (currRC == "DESPAIR") {
        AKdata[34][0]++;
      } else if (currRC == "MEH") {
        AKdata[34][1]++;
      } else if (currRC == "JOY") {
        AKdata[34][2]++;
      }

      //reeses pieces 35
      if (currRP == "DESPAIR") {
        AKdata[35][0]++;
      } else if (currRP == "MEH") {
        AKdata[35][1]++;
      } else if (currRP == "JOY") {
        AKdata[35][2]++;
      }

      //rolos 36
      if (currRL == "DESPAIR") {
        AKdata[36][0]++;
      } else if (currRL == "MEH") {
        AKdata[36][1]++;
      } else if (currRL == "JOY") {
        AKdata[36][2]++;
      }

      //skittles 37
      if (currSK == "DESPAIR") {
        AKdata[37][0]++;
      } else if (currSK == "MEH") {
        AKdata[37][1]++;
      } else if (currSK == "JOY") {
        AKdata[37][2]++;
      }

      //snickers 38
      if (currSN == "DESPAIR") {
        AKdata[38][0]++;
      } else if (currSN == "MEH") {
        AKdata[38][1]++;
      } else if (currSN == "JOY") {
        AKdata[38][2]++;
      }

      //sour patch kids 39
      if (currSP == "DESPAIR") {
        AKdata[39][0]++;
      } else if (currSP == "MEH") {
        AKdata[39][1]++;
      } else if (currSP == "JOY") {
        AKdata[39][2]++;
      }

      //starbursts 40
      if (currST == "DESPAIR") {
        AKdata[40][0]++;
      } else if (currST == "MEH") {
        AKdata[40][1]++;
      } else if (currST == "JOY") {
        AKdata[40][2]++;
      }

      //swedish fish 41
      if (currSF == "DESPAIR") {
        AKdata[41][0]++;
      } else if (currSF == "MEH") {
        AKdata[41][1]++;
      } else if (currSF == "JOY") {
        AKdata[41][2]++;
      }

      //tic tacs 42
      if (currTT == "DESPAIR") {
        AKdata[42][0]++;
      } else if (currTT == "MEH") {
        AKdata[42][1]++;
      } else if (currTT == "JOY") {
        AKdata[42][2]++;
      }

      //three musketeers 43
      if (currTM == "DESPAIR") {
        AKdata[43][0]++;
      } else if (currTM == "MEH") {
        AKdata[43][1]++;
      } else if (currTM == "JOY") {
        AKdata[43][2]++;
      }

      //tolberone 44
      if (currTB == "DESPAIR") {
        AKdata[44][0]++;
      } else if (currTB == "MEH") {
        AKdata[44][1]++;
      } else if (currTB == "JOY") {
        AKdata[44][2]++;
      }

      //trail mix 45
      if (currTM == "DESPAIR") {
        AKdata[45][0]++;
      } else if (currTM == "MEH") {
        AKdata[45][1]++;
      } else if (currTM == "JOY") {
        AKdata[45][2]++;
      }

      //twix 46
      if (currTW == "DESPAIR") {
        AKdata[46][0]++;
      } else if (currTW == "MEH") {
        AKdata[46][1]++;
      } else if (currTW == "JOY") {
        AKdata[46][2]++;
      }

      //whatchamacallit 47
      if (currWM == "DESPAIR") {
        AKdata[47][0]++;
      } else if (currWM == "MEH") {
        AKdata[47][1]++;
      } else if (currWM == "JOY") {
        AKdata[47][2]++;
      }

      //york peppermint patties 48
      if (currYP == "DESPAIR") {
        AKdata[48][0]++;
      } else if (currYP == "MEH") {
        AKdata[48][1]++;
      } else if (currYP == "JOY") {
        AKdata[48][2]++;
      }

        break;
      case "AZ":
          AZdata[0]++;

          if (currOut == "No") {
            AZdata[1][0]++;
          } else if (currOut = "Yes") {
            AZdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            AZdata[2][0]++;
          } else if (currBF == "MEH") {
            AZdata[2][1]++;
          } else if (currBF == "JOY") {
            AZdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            AZdata[3][0]++;
          } else if (currCC == "MEH") {
            AZdata[3][1]++;
          } else if (currCC == "JOY") {
            AZdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            AZdata[4][0]++;
          } else if (currCL == "MEH") {
            AZdata[4][1]++;
          } else if (currCL == "JOY") {
            AZdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            AZdata[5][0]++;
          } else if (currDT == "MEH") {
            AZdata[5][1]++;
          } else if (currDT == "JOY") {
            AZdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            AZdata[6][0]++;
          } else if (currFP == "MEH") {
            AZdata[6][1]++;
          } else if (currFP == "JOY") {
            AZdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            AZdata[7][0]++;
          } else if (currGP == "MEH") {
            AZdata[7][1]++;
          } else if (currGP == "JOY") {
            AZdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            AZdata[8][0]++;
          } else if (currGB == "MEH") {
            AZdata[8][1]++;
          } else if (currGB == "JOY") {
            AZdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            AZdata[9][0]++;
          } else if (currHF == "MEH") {
            AZdata[9][1]++;
          } else if (currHF == "JOY") {
            AZdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            AZdata[10][0]++;
          } else if (currHB == "MEH") {
            AZdata[10][1]++;
          } else if (currHB == "JOY") {
            AZdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            AZdata[11][0]++;
          } else if (currHD == "MEH") {
            AZdata[11][1]++;
          } else if (currHD == "JOY") {
            AZdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            AZdata[12][0]++;
          } else if (currHM == "MEH") {
            AZdata[12][1]++;
          } else if (currHM == "JOY") {
            AZdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            AZdata[13][0]++;
          } else if (currHK == "MEH") {
            AZdata[13][1]++;
          } else if (currHK == "JOY") {
            AZdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            AZdata[14][0]++;
          } else if (currJB == "MEH") {
            AZdata[14][1]++;
          } else if (currJB == "JOY") {
            AZdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            AZdata[15][0]++;
          } else if (currJG == "MEH") {
            AZdata[15][1]++;
          } else if (currJG == "JOY") {
            AZdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            AZdata[16][0]++;
          } else if (currJM == "MEH") {
            AZdata[16][1]++;
          } else if (currJM == "JOY") {
            AZdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            AZdata[17][0]++;
          } else if (currKK == "MEH") {
            AZdata[17][1]++;
          } else if (currKK == "JOY") {
            AZdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            AZdata[18][0]++;
          } else if (currLT == "MEH") {
            AZdata[18][1]++;
          } else if (currLT == "JOY") {
            AZdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            AZdata[19][0]++;
          } else if (currLH == "MEH") {
            AZdata[19][1]++;
          } else if (currLH == "JOY") {
            AZdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            AZdata[20][0]++;
          } else if (currLN == "MEH") {
            AZdata[20][1]++;
          } else if (currLN == "JOY") {
            AZdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            AZdata[21][0]++;
          } else if (currLB == "MEH") {
            AZdata[21][1]++;
          } else if (currLB == "JOY") {
            AZdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            AZdata[22][0]++;
          } else if (currLP == "MEH") {
            AZdata[22][1]++;
          } else if (currLP == "JOY") {
            AZdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            AZdata[23][0]++;
          } else if (currMI == "MEH") {
            AZdata[23][1]++;
          } else if (currMI == "JOY") {
            AZdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            AZdata[24][0]++;
          } else if (currMD == "MEH") {
            AZdata[24][1]++;
          } else if (currMD == "JOY") {
            AZdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            AZdata[25][0]++;
          } else if (currMW == "MEH") {
            AZdata[25][1]++;
          } else if (currMW == "JOY") {
            AZdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            AZdata[26][0]++;
          } else if (currMM == "MEH") {
            AZdata[26][1]++;
          } else if (currMM == "JOY") {
            AZdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            AZdata[27][0]++;
          } else if (currPM == "MEH") {
            AZdata[27][1]++;
          } else if (currPM == "JOY") {
            AZdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            AZdata[28][0]++;
          } else if (currMK == "MEH") {
            AZdata[28][1]++;
          } else if (currMK == "JOY") {
            AZdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            AZdata[29][0]++;
          } else if (currMG == "MEH") {
            AZdata[29][1]++;
          } else if (currMG == "JOY") {
            AZdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            AZdata[30][0]++;
          } else if (currND == "MEH") {
            AZdata[30][1]++;
          } else if (currND == "JOY") {
            AZdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            AZdata[31][0]++;
          } else if (currNC == "MEH") {
            AZdata[31][1]++;
          } else if (currNC == "JOY") {
            AZdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            AZdata[32][0]++;
          } else if (currPP == "MEH") {
            AZdata[32][1]++;
          } else if (currPP == "JOY") {
            AZdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            AZdata[33][0]++;
          } else if (currPS == "MEH") {
            AZdata[33][1]++;
          } else if (currPS == "JOY") {
            AZdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            AZdata[34][0]++;
          } else if (currRC == "MEH") {
            AZdata[34][1]++;
          } else if (currRC == "JOY") {
            AZdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            AZdata[35][0]++;
          } else if (currRP == "MEH") {
            AZdata[35][1]++;
          } else if (currRP == "JOY") {
            AZdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            AZdata[36][0]++;
          } else if (currRL == "MEH") {
            AZdata[36][1]++;
          } else if (currRL == "JOY") {
            AZdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            AZdata[37][0]++;
          } else if (currSK == "MEH") {
            AZdata[37][1]++;
          } else if (currSK == "JOY") {
            AZdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            AZdata[38][0]++;
          } else if (currSN == "MEH") {
            AZdata[38][1]++;
          } else if (currSN == "JOY") {
            AZdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            AZdata[39][0]++;
          } else if (currSP == "MEH") {
            AZdata[39][1]++;
          } else if (currSP == "JOY") {
            AZdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            AZdata[40][0]++;
          } else if (currST == "MEH") {
            AZdata[40][1]++;
          } else if (currST == "JOY") {
            AZdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            AZdata[41][0]++;
          } else if (currSF == "MEH") {
            AZdata[41][1]++;
          } else if (currSF == "JOY") {
            AZdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            AZdata[42][0]++;
          } else if (currTT == "MEH") {
            AZdata[42][1]++;
          } else if (currTT == "JOY") {
            AZdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            AZdata[43][0]++;
          } else if (currTM == "MEH") {
            AZdata[43][1]++;
          } else if (currTM == "JOY") {
            AZdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            AZdata[44][0]++;
          } else if (currTB == "MEH") {
            AZdata[44][1]++;
          } else if (currTB == "JOY") {
            AZdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            AZdata[45][0]++;
          } else if (currTM == "MEH") {
            AZdata[45][1]++;
          } else if (currTM == "JOY") {
            AZdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            AZdata[46][0]++;
          } else if (currTW == "MEH") {
            AZdata[46][1]++;
          } else if (currTW == "JOY") {
            AZdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            AZdata[47][0]++;
          } else if (currWM == "MEH") {
            AZdata[47][1]++;
          } else if (currWM == "JOY") {
            AZdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            AZdata[48][0]++;
          } else if (currYP == "MEH") {
            AZdata[48][1]++;
          } else if (currYP == "JOY") {
            AZdata[48][2]++;
          }
  
        break;
      case "AR":
          ARdata[0]++;

          if (currOut == "No") {
            ARdata[1][0]++;
          } else if (currOut = "Yes") {
            ARdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            ARdata[2][0]++;
          } else if (currBF == "MEH") {
            ARdata[2][1]++;
          } else if (currBF == "JOY") {
            ARdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            ARdata[3][0]++;
          } else if (currCC == "MEH") {
            ARdata[3][1]++;
          } else if (currCC == "JOY") {
            ARdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            ARdata[4][0]++;
          } else if (currCL == "MEH") {
            ARdata[4][1]++;
          } else if (currCL == "JOY") {
            ARdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            ARdata[5][0]++;
          } else if (currDT == "MEH") {
            ARdata[5][1]++;
          } else if (currDT == "JOY") {
            ARdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            ARdata[6][0]++;
          } else if (currFP == "MEH") {
            ARdata[6][1]++;
          } else if (currFP == "JOY") {
            ARdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            ARdata[7][0]++;
          } else if (currGP == "MEH") {
            ARdata[7][1]++;
          } else if (currGP == "JOY") {
            ARdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            ARdata[8][0]++;
          } else if (currGB == "MEH") {
            ARdata[8][1]++;
          } else if (currGB == "JOY") {
            ARdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            ARdata[9][0]++;
          } else if (currHF == "MEH") {
            ARdata[9][1]++;
          } else if (currHF == "JOY") {
            ARdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            ARdata[10][0]++;
          } else if (currHB == "MEH") {
            ARdata[10][1]++;
          } else if (currHB == "JOY") {
            ARdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            ARdata[11][0]++;
          } else if (currHD == "MEH") {
            ARdata[11][1]++;
          } else if (currHD == "JOY") {
            ARdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            ARdata[12][0]++;
          } else if (currHM == "MEH") {
            ARdata[12][1]++;
          } else if (currHM == "JOY") {
            ARdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            ARdata[13][0]++;
          } else if (currHK == "MEH") {
            ARdata[13][1]++;
          } else if (currHK == "JOY") {
            ARdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            ARdata[14][0]++;
          } else if (currJB == "MEH") {
            ARdata[14][1]++;
          } else if (currJB == "JOY") {
            ARdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            ARdata[15][0]++;
          } else if (currJG == "MEH") {
            ARdata[15][1]++;
          } else if (currJG == "JOY") {
            ARdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            ARdata[16][0]++;
          } else if (currJM == "MEH") {
            ARdata[16][1]++;
          } else if (currJM == "JOY") {
            ARdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            ARdata[17][0]++;
          } else if (currKK == "MEH") {
            ARdata[17][1]++;
          } else if (currKK == "JOY") {
            ARdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            ARdata[18][0]++;
          } else if (currLT == "MEH") {
            ARdata[18][1]++;
          } else if (currLT == "JOY") {
            ARdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            ARdata[19][0]++;
          } else if (currLH == "MEH") {
            ARdata[19][1]++;
          } else if (currLH == "JOY") {
            ARdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            ARdata[20][0]++;
          } else if (currLN == "MEH") {
            ARdata[20][1]++;
          } else if (currLN == "JOY") {
            ARdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            ARdata[21][0]++;
          } else if (currLB == "MEH") {
            ARdata[21][1]++;
          } else if (currLB == "JOY") {
            ARdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            ARdata[22][0]++;
          } else if (currLP == "MEH") {
            ARdata[22][1]++;
          } else if (currLP == "JOY") {
            ARdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            ARdata[23][0]++;
          } else if (currMI == "MEH") {
            ARdata[23][1]++;
          } else if (currMI == "JOY") {
            ARdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            ARdata[24][0]++;
          } else if (currMD == "MEH") {
            ARdata[24][1]++;
          } else if (currMD == "JOY") {
            ARdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            ARdata[25][0]++;
          } else if (currMW == "MEH") {
            ARdata[25][1]++;
          } else if (currMW == "JOY") {
            ARdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            ARdata[26][0]++;
          } else if (currMM == "MEH") {
            ARdata[26][1]++;
          } else if (currMM == "JOY") {
            ARdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            ARdata[27][0]++;
          } else if (currPM == "MEH") {
            ARdata[27][1]++;
          } else if (currPM == "JOY") {
            ARdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            ARdata[28][0]++;
          } else if (currMK == "MEH") {
            ARdata[28][1]++;
          } else if (currMK == "JOY") {
            ARdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            ARdata[29][0]++;
          } else if (currMG == "MEH") {
            ARdata[29][1]++;
          } else if (currMG == "JOY") {
            ARdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            ARdata[30][0]++;
          } else if (currND == "MEH") {
            ARdata[30][1]++;
          } else if (currND == "JOY") {
            ARdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            ARdata[31][0]++;
          } else if (currNC == "MEH") {
            ARdata[31][1]++;
          } else if (currNC == "JOY") {
            ARdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            ARdata[32][0]++;
          } else if (currPP == "MEH") {
            ARdata[32][1]++;
          } else if (currPP == "JOY") {
            ARdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            ARdata[33][0]++;
          } else if (currPS == "MEH") {
            ARdata[33][1]++;
          } else if (currPS == "JOY") {
            ARdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            ARdata[34][0]++;
          } else if (currRC == "MEH") {
            ARdata[34][1]++;
          } else if (currRC == "JOY") {
            ARdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            ARdata[35][0]++;
          } else if (currRP == "MEH") {
            ARdata[35][1]++;
          } else if (currRP == "JOY") {
            ARdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            ARdata[36][0]++;
          } else if (currRL == "MEH") {
            ARdata[36][1]++;
          } else if (currRL == "JOY") {
            ARdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            ARdata[37][0]++;
          } else if (currSK == "MEH") {
            ARdata[37][1]++;
          } else if (currSK == "JOY") {
            ARdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            ARdata[38][0]++;
          } else if (currSN == "MEH") {
            ARdata[38][1]++;
          } else if (currSN == "JOY") {
            ARdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            ARdata[39][0]++;
          } else if (currSP == "MEH") {
            ARdata[39][1]++;
          } else if (currSP == "JOY") {
            ARdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            ARdata[40][0]++;
          } else if (currST == "MEH") {
            ARdata[40][1]++;
          } else if (currST == "JOY") {
            ARdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            ARdata[41][0]++;
          } else if (currSF == "MEH") {
            ARdata[41][1]++;
          } else if (currSF == "JOY") {
            ARdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            ARdata[42][0]++;
          } else if (currTT == "MEH") {
            ARdata[42][1]++;
          } else if (currTT == "JOY") {
            ARdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            ARdata[43][0]++;
          } else if (currTM == "MEH") {
            ARdata[43][1]++;
          } else if (currTM == "JOY") {
            ARdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            ARdata[44][0]++;
          } else if (currTB == "MEH") {
            ARdata[44][1]++;
          } else if (currTB == "JOY") {
            ARdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            ARdata[45][0]++;
          } else if (currTM == "MEH") {
            ARdata[45][1]++;
          } else if (currTM == "JOY") {
            ARdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            ARdata[46][0]++;
          } else if (currTW == "MEH") {
            ARdata[46][1]++;
          } else if (currTW == "JOY") {
            ARdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            ARdata[47][0]++;
          } else if (currWM == "MEH") {
            ARdata[47][1]++;
          } else if (currWM == "JOY") {
            ARdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            ARdata[48][0]++;
          } else if (currYP == "MEH") {
            ARdata[48][1]++;
          } else if (currYP == "JOY") {
            ARdata[48][2]++;
          }
  
        break;
      case "CA":
          CAdata[0]++;

          if (currOut == "No") {
            CAdata[1][0]++;
          } else if (currOut = "Yes") {
            CAdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            CAdata[2][0]++;
          } else if (currBF == "MEH") {
            CAdata[2][1]++;
          } else if (currBF == "JOY") {
            CAdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            CAdata[3][0]++;
          } else if (currCC == "MEH") {
            CAdata[3][1]++;
          } else if (currCC == "JOY") {
            CAdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            CAdata[4][0]++;
          } else if (currCL == "MEH") {
            CAdata[4][1]++;
          } else if (currCL == "JOY") {
            CAdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            CAdata[5][0]++;
          } else if (currDT == "MEH") {
            CAdata[5][1]++;
          } else if (currDT == "JOY") {
            CAdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            CAdata[6][0]++;
          } else if (currFP == "MEH") {
            CAdata[6][1]++;
          } else if (currFP == "JOY") {
            CAdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            CAdata[7][0]++;
          } else if (currGP == "MEH") {
            CAdata[7][1]++;
          } else if (currGP == "JOY") {
            CAdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            CAdata[8][0]++;
          } else if (currGB == "MEH") {
            CAdata[8][1]++;
          } else if (currGB == "JOY") {
            CAdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            CAdata[9][0]++;
          } else if (currHF == "MEH") {
            CAdata[9][1]++;
          } else if (currHF == "JOY") {
            CAdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            CAdata[10][0]++;
          } else if (currHB == "MEH") {
            CAdata[10][1]++;
          } else if (currHB == "JOY") {
            CAdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            CAdata[11][0]++;
          } else if (currHD == "MEH") {
            CAdata[11][1]++;
          } else if (currHD == "JOY") {
            CAdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            CAdata[12][0]++;
          } else if (currHM == "MEH") {
            CAdata[12][1]++;
          } else if (currHM == "JOY") {
            CAdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            CAdata[13][0]++;
          } else if (currHK == "MEH") {
            CAdata[13][1]++;
          } else if (currHK == "JOY") {
            CAdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            CAdata[14][0]++;
          } else if (currJB == "MEH") {
            CAdata[14][1]++;
          } else if (currJB == "JOY") {
            CAdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            CAdata[15][0]++;
          } else if (currJG == "MEH") {
            CAdata[15][1]++;
          } else if (currJG == "JOY") {
            CAdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            CAdata[16][0]++;
          } else if (currJM == "MEH") {
            CAdata[16][1]++;
          } else if (currJM == "JOY") {
            CAdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            CAdata[17][0]++;
          } else if (currKK == "MEH") {
            CAdata[17][1]++;
          } else if (currKK == "JOY") {
            CAdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            CAdata[18][0]++;
          } else if (currLT == "MEH") {
            CAdata[18][1]++;
          } else if (currLT == "JOY") {
            CAdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            CAdata[19][0]++;
          } else if (currLH == "MEH") {
            CAdata[19][1]++;
          } else if (currLH == "JOY") {
            CAdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            CAdata[20][0]++;
          } else if (currLN == "MEH") {
            CAdata[20][1]++;
          } else if (currLN == "JOY") {
            CAdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            CAdata[21][0]++;
          } else if (currLB == "MEH") {
            CAdata[21][1]++;
          } else if (currLB == "JOY") {
            CAdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            CAdata[22][0]++;
          } else if (currLP == "MEH") {
            CAdata[22][1]++;
          } else if (currLP == "JOY") {
            CAdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            CAdata[23][0]++;
          } else if (currMI == "MEH") {
            CAdata[23][1]++;
          } else if (currMI == "JOY") {
            CAdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            CAdata[24][0]++;
          } else if (currMD == "MEH") {
            CAdata[24][1]++;
          } else if (currMD == "JOY") {
            CAdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            CAdata[25][0]++;
          } else if (currMW == "MEH") {
            CAdata[25][1]++;
          } else if (currMW == "JOY") {
            CAdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            CAdata[26][0]++;
          } else if (currMM == "MEH") {
            CAdata[26][1]++;
          } else if (currMM == "JOY") {
            CAdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            CAdata[27][0]++;
          } else if (currPM == "MEH") {
            CAdata[27][1]++;
          } else if (currPM == "JOY") {
            CAdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            CAdata[28][0]++;
          } else if (currMK == "MEH") {
            CAdata[28][1]++;
          } else if (currMK == "JOY") {
            CAdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            CAdata[29][0]++;
          } else if (currMG == "MEH") {
            CAdata[29][1]++;
          } else if (currMG == "JOY") {
            CAdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            CAdata[30][0]++;
          } else if (currND == "MEH") {
            CAdata[30][1]++;
          } else if (currND == "JOY") {
            CAdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            CAdata[31][0]++;
          } else if (currNC == "MEH") {
            CAdata[31][1]++;
          } else if (currNC == "JOY") {
            CAdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            CAdata[32][0]++;
          } else if (currPP == "MEH") {
            CAdata[32][1]++;
          } else if (currPP == "JOY") {
            CAdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            CAdata[33][0]++;
          } else if (currPS == "MEH") {
            CAdata[33][1]++;
          } else if (currPS == "JOY") {
            CAdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            CAdata[34][0]++;
          } else if (currRC == "MEH") {
            CAdata[34][1]++;
          } else if (currRC == "JOY") {
            CAdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            CAdata[35][0]++;
          } else if (currRP == "MEH") {
            CAdata[35][1]++;
          } else if (currRP == "JOY") {
            CAdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            CAdata[36][0]++;
          } else if (currRL == "MEH") {
            CAdata[36][1]++;
          } else if (currRL == "JOY") {
            CAdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            CAdata[37][0]++;
          } else if (currSK == "MEH") {
            CAdata[37][1]++;
          } else if (currSK == "JOY") {
            CAdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            CAdata[38][0]++;
          } else if (currSN == "MEH") {
            CAdata[38][1]++;
          } else if (currSN == "JOY") {
            CAdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            CAdata[39][0]++;
          } else if (currSP == "MEH") {
            CAdata[39][1]++;
          } else if (currSP == "JOY") {
            CAdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            CAdata[40][0]++;
          } else if (currST == "MEH") {
            CAdata[40][1]++;
          } else if (currST == "JOY") {
            CAdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            CAdata[41][0]++;
          } else if (currSF == "MEH") {
            CAdata[41][1]++;
          } else if (currSF == "JOY") {
            CAdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            CAdata[42][0]++;
          } else if (currTT == "MEH") {
            CAdata[42][1]++;
          } else if (currTT == "JOY") {
            CAdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            CAdata[43][0]++;
          } else if (currTM == "MEH") {
            CAdata[43][1]++;
          } else if (currTM == "JOY") {
            CAdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            CAdata[44][0]++;
          } else if (currTB == "MEH") {
            CAdata[44][1]++;
          } else if (currTB == "JOY") {
            CAdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            CAdata[45][0]++;
          } else if (currTM == "MEH") {
            CAdata[45][1]++;
          } else if (currTM == "JOY") {
            CAdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            CAdata[46][0]++;
          } else if (currTW == "MEH") {
            CAdata[46][1]++;
          } else if (currTW == "JOY") {
            CAdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            CAdata[47][0]++;
          } else if (currWM == "MEH") {
            CAdata[47][1]++;
          } else if (currWM == "JOY") {
            CAdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            CAdata[48][0]++;
          } else if (currYP == "MEH") {
            CAdata[48][1]++;
          } else if (currYP == "JOY") {
            CAdata[48][2]++;
          }
  
        break;
      case "CO":
          COdata[0]++;

          if (currOut == "No") {
            COdata[1][0]++;
          } else if (currOut = "Yes") {
            COdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            COdata[2][0]++;
          } else if (currBF == "MEH") {
            COdata[2][1]++;
          } else if (currBF == "JOY") {
            COdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            COdata[3][0]++;
          } else if (currCC == "MEH") {
            COdata[3][1]++;
          } else if (currCC == "JOY") {
            COdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            COdata[4][0]++;
          } else if (currCL == "MEH") {
            COdata[4][1]++;
          } else if (currCL == "JOY") {
            COdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            COdata[5][0]++;
          } else if (currDT == "MEH") {
            COdata[5][1]++;
          } else if (currDT == "JOY") {
            COdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            COdata[6][0]++;
          } else if (currFP == "MEH") {
            COdata[6][1]++;
          } else if (currFP == "JOY") {
            COdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            COdata[7][0]++;
          } else if (currGP == "MEH") {
            COdata[7][1]++;
          } else if (currGP == "JOY") {
            COdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            COdata[8][0]++;
          } else if (currGB == "MEH") {
            COdata[8][1]++;
          } else if (currGB == "JOY") {
            COdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            COdata[9][0]++;
          } else if (currHF == "MEH") {
            COdata[9][1]++;
          } else if (currHF == "JOY") {
            COdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            COdata[10][0]++;
          } else if (currHB == "MEH") {
            COdata[10][1]++;
          } else if (currHB == "JOY") {
            COdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            COdata[11][0]++;
          } else if (currHD == "MEH") {
            COdata[11][1]++;
          } else if (currHD == "JOY") {
            COdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            COdata[12][0]++;
          } else if (currHM == "MEH") {
            COdata[12][1]++;
          } else if (currHM == "JOY") {
            COdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            COdata[13][0]++;
          } else if (currHK == "MEH") {
            COdata[13][1]++;
          } else if (currHK == "JOY") {
            COdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            COdata[14][0]++;
          } else if (currJB == "MEH") {
            COdata[14][1]++;
          } else if (currJB == "JOY") {
            COdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            COdata[15][0]++;
          } else if (currJG == "MEH") {
            COdata[15][1]++;
          } else if (currJG == "JOY") {
            COdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            COdata[16][0]++;
          } else if (currJM == "MEH") {
            COdata[16][1]++;
          } else if (currJM == "JOY") {
            COdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            COdata[17][0]++;
          } else if (currKK == "MEH") {
            COdata[17][1]++;
          } else if (currKK == "JOY") {
            COdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            COdata[18][0]++;
          } else if (currLT == "MEH") {
            COdata[18][1]++;
          } else if (currLT == "JOY") {
            COdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            COdata[19][0]++;
          } else if (currLH == "MEH") {
            COdata[19][1]++;
          } else if (currLH == "JOY") {
            COdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            COdata[20][0]++;
          } else if (currLN == "MEH") {
            COdata[20][1]++;
          } else if (currLN == "JOY") {
            COdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            COdata[21][0]++;
          } else if (currLB == "MEH") {
            COdata[21][1]++;
          } else if (currLB == "JOY") {
            COdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            COdata[22][0]++;
          } else if (currLP == "MEH") {
            COdata[22][1]++;
          } else if (currLP == "JOY") {
            COdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            COdata[23][0]++;
          } else if (currMI == "MEH") {
            COdata[23][1]++;
          } else if (currMI == "JOY") {
            COdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            COdata[24][0]++;
          } else if (currMD == "MEH") {
            COdata[24][1]++;
          } else if (currMD == "JOY") {
            COdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            COdata[25][0]++;
          } else if (currMW == "MEH") {
            COdata[25][1]++;
          } else if (currMW == "JOY") {
            COdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            COdata[26][0]++;
          } else if (currMM == "MEH") {
            COdata[26][1]++;
          } else if (currMM == "JOY") {
            COdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            COdata[27][0]++;
          } else if (currPM == "MEH") {
            COdata[27][1]++;
          } else if (currPM == "JOY") {
            COdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            COdata[28][0]++;
          } else if (currMK == "MEH") {
            COdata[28][1]++;
          } else if (currMK == "JOY") {
            COdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            COdata[29][0]++;
          } else if (currMG == "MEH") {
            COdata[29][1]++;
          } else if (currMG == "JOY") {
            COdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            COdata[30][0]++;
          } else if (currND == "MEH") {
            COdata[30][1]++;
          } else if (currND == "JOY") {
            COdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            COdata[31][0]++;
          } else if (currNC == "MEH") {
            COdata[31][1]++;
          } else if (currNC == "JOY") {
            COdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            COdata[32][0]++;
          } else if (currPP == "MEH") {
            COdata[32][1]++;
          } else if (currPP == "JOY") {
            COdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            COdata[33][0]++;
          } else if (currPS == "MEH") {
            COdata[33][1]++;
          } else if (currPS == "JOY") {
            COdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            COdata[34][0]++;
          } else if (currRC == "MEH") {
            COdata[34][1]++;
          } else if (currRC == "JOY") {
            COdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            COdata[35][0]++;
          } else if (currRP == "MEH") {
            COdata[35][1]++;
          } else if (currRP == "JOY") {
            COdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            COdata[36][0]++;
          } else if (currRL == "MEH") {
            COdata[36][1]++;
          } else if (currRL == "JOY") {
            COdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            COdata[37][0]++;
          } else if (currSK == "MEH") {
            COdata[37][1]++;
          } else if (currSK == "JOY") {
            COdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            COdata[38][0]++;
          } else if (currSN == "MEH") {
            COdata[38][1]++;
          } else if (currSN == "JOY") {
            COdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            COdata[39][0]++;
          } else if (currSP == "MEH") {
            COdata[39][1]++;
          } else if (currSP == "JOY") {
            COdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            COdata[40][0]++;
          } else if (currST == "MEH") {
            COdata[40][1]++;
          } else if (currST == "JOY") {
            COdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            COdata[41][0]++;
          } else if (currSF == "MEH") {
            COdata[41][1]++;
          } else if (currSF == "JOY") {
            COdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            COdata[42][0]++;
          } else if (currTT == "MEH") {
            COdata[42][1]++;
          } else if (currTT == "JOY") {
            COdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            COdata[43][0]++;
          } else if (currTM == "MEH") {
            COdata[43][1]++;
          } else if (currTM == "JOY") {
            COdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            COdata[44][0]++;
          } else if (currTB == "MEH") {
            COdata[44][1]++;
          } else if (currTB == "JOY") {
            COdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            COdata[45][0]++;
          } else if (currTM == "MEH") {
            COdata[45][1]++;
          } else if (currTM == "JOY") {
            COdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            COdata[46][0]++;
          } else if (currTW == "MEH") {
            COdata[46][1]++;
          } else if (currTW == "JOY") {
            COdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            COdata[47][0]++;
          } else if (currWM == "MEH") {
            COdata[47][1]++;
          } else if (currWM == "JOY") {
            COdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            COdata[48][0]++;
          } else if (currYP == "MEH") {
            COdata[48][1]++;
          } else if (currYP == "JOY") {
            COdata[48][2]++;
          }
  
        break;
      case "CT":
          CTdata[0]++;

          if (currOut == "No") {
            CTdata[1][0]++;
          } else if (currOut = "Yes") {
            CTdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            CTdata[2][0]++;
          } else if (currBF == "MEH") {
            CTdata[2][1]++;
          } else if (currBF == "JOY") {
            CTdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            CTdata[3][0]++;
          } else if (currCC == "MEH") {
            CTdata[3][1]++;
          } else if (currCC == "JOY") {
            CTdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            CTdata[4][0]++;
          } else if (currCL == "MEH") {
            CTdata[4][1]++;
          } else if (currCL == "JOY") {
            CTdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            CTdata[5][0]++;
          } else if (currDT == "MEH") {
            CTdata[5][1]++;
          } else if (currDT == "JOY") {
            CTdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            CTdata[6][0]++;
          } else if (currFP == "MEH") {
            CTdata[6][1]++;
          } else if (currFP == "JOY") {
            CTdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            CTdata[7][0]++;
          } else if (currGP == "MEH") {
            CTdata[7][1]++;
          } else if (currGP == "JOY") {
            CTdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            CTdata[8][0]++;
          } else if (currGB == "MEH") {
            CTdata[8][1]++;
          } else if (currGB == "JOY") {
            CTdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            CTdata[9][0]++;
          } else if (currHF == "MEH") {
            CTdata[9][1]++;
          } else if (currHF == "JOY") {
            CTdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            CTdata[10][0]++;
          } else if (currHB == "MEH") {
            CTdata[10][1]++;
          } else if (currHB == "JOY") {
            CTdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            CTdata[11][0]++;
          } else if (currHD == "MEH") {
            CTdata[11][1]++;
          } else if (currHD == "JOY") {
            CTdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            CTdata[12][0]++;
          } else if (currHM == "MEH") {
            CTdata[12][1]++;
          } else if (currHM == "JOY") {
            CTdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            CTdata[13][0]++;
          } else if (currHK == "MEH") {
            CTdata[13][1]++;
          } else if (currHK == "JOY") {
            CTdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            CTdata[14][0]++;
          } else if (currJB == "MEH") {
            CTdata[14][1]++;
          } else if (currJB == "JOY") {
            CTdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            CTdata[15][0]++;
          } else if (currJG == "MEH") {
            CTdata[15][1]++;
          } else if (currJG == "JOY") {
            CTdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            CTdata[16][0]++;
          } else if (currJM == "MEH") {
            CTdata[16][1]++;
          } else if (currJM == "JOY") {
            CTdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            CTdata[17][0]++;
          } else if (currKK == "MEH") {
            CTdata[17][1]++;
          } else if (currKK == "JOY") {
            CTdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            CTdata[18][0]++;
          } else if (currLT == "MEH") {
            CTdata[18][1]++;
          } else if (currLT == "JOY") {
            CTdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            CTdata[19][0]++;
          } else if (currLH == "MEH") {
            CTdata[19][1]++;
          } else if (currLH == "JOY") {
            CTdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            CTdata[20][0]++;
          } else if (currLN == "MEH") {
            CTdata[20][1]++;
          } else if (currLN == "JOY") {
            CTdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            CTdata[21][0]++;
          } else if (currLB == "MEH") {
            CTdata[21][1]++;
          } else if (currLB == "JOY") {
            CTdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            CTdata[22][0]++;
          } else if (currLP == "MEH") {
            CTdata[22][1]++;
          } else if (currLP == "JOY") {
            CTdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            CTdata[23][0]++;
          } else if (currMI == "MEH") {
            CTdata[23][1]++;
          } else if (currMI == "JOY") {
            CTdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            CTdata[24][0]++;
          } else if (currMD == "MEH") {
            CTdata[24][1]++;
          } else if (currMD == "JOY") {
            CTdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            CTdata[25][0]++;
          } else if (currMW == "MEH") {
            CTdata[25][1]++;
          } else if (currMW == "JOY") {
            CTdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            CTdata[26][0]++;
          } else if (currMM == "MEH") {
            CTdata[26][1]++;
          } else if (currMM == "JOY") {
            CTdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            CTdata[27][0]++;
          } else if (currPM == "MEH") {
            CTdata[27][1]++;
          } else if (currPM == "JOY") {
            CTdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            CTdata[28][0]++;
          } else if (currMK == "MEH") {
            CTdata[28][1]++;
          } else if (currMK == "JOY") {
            CTdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            CTdata[29][0]++;
          } else if (currMG == "MEH") {
            CTdata[29][1]++;
          } else if (currMG == "JOY") {
            CTdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            CTdata[30][0]++;
          } else if (currND == "MEH") {
            CTdata[30][1]++;
          } else if (currND == "JOY") {
            CTdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            CTdata[31][0]++;
          } else if (currNC == "MEH") {
            CTdata[31][1]++;
          } else if (currNC == "JOY") {
            CTdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            CTdata[32][0]++;
          } else if (currPP == "MEH") {
            CTdata[32][1]++;
          } else if (currPP == "JOY") {
            CTdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            CTdata[33][0]++;
          } else if (currPS == "MEH") {
            CTdata[33][1]++;
          } else if (currPS == "JOY") {
            CTdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            CTdata[34][0]++;
          } else if (currRC == "MEH") {
            CTdata[34][1]++;
          } else if (currRC == "JOY") {
            CTdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            CTdata[35][0]++;
          } else if (currRP == "MEH") {
            CTdata[35][1]++;
          } else if (currRP == "JOY") {
            CTdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            CTdata[36][0]++;
          } else if (currRL == "MEH") {
            CTdata[36][1]++;
          } else if (currRL == "JOY") {
            CTdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            CTdata[37][0]++;
          } else if (currSK == "MEH") {
            CTdata[37][1]++;
          } else if (currSK == "JOY") {
            CTdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            CTdata[38][0]++;
          } else if (currSN == "MEH") {
            CTdata[38][1]++;
          } else if (currSN == "JOY") {
            CTdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            CTdata[39][0]++;
          } else if (currSP == "MEH") {
            CTdata[39][1]++;
          } else if (currSP == "JOY") {
            CTdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            CTdata[40][0]++;
          } else if (currST == "MEH") {
            CTdata[40][1]++;
          } else if (currST == "JOY") {
            CTdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            CTdata[41][0]++;
          } else if (currSF == "MEH") {
            CTdata[41][1]++;
          } else if (currSF == "JOY") {
            CTdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            CTdata[42][0]++;
          } else if (currTT == "MEH") {
            CTdata[42][1]++;
          } else if (currTT == "JOY") {
            CTdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            CTdata[43][0]++;
          } else if (currTM == "MEH") {
            CTdata[43][1]++;
          } else if (currTM == "JOY") {
            CTdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            CTdata[44][0]++;
          } else if (currTB == "MEH") {
            CTdata[44][1]++;
          } else if (currTB == "JOY") {
            CTdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            CTdata[45][0]++;
          } else if (currTM == "MEH") {
            CTdata[45][1]++;
          } else if (currTM == "JOY") {
            CTdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            CTdata[46][0]++;
          } else if (currTW == "MEH") {
            CTdata[46][1]++;
          } else if (currTW == "JOY") {
            CTdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            CTdata[47][0]++;
          } else if (currWM == "MEH") {
            CTdata[47][1]++;
          } else if (currWM == "JOY") {
            CTdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            CTdata[48][0]++;
          } else if (currYP == "MEH") {
            CTdata[48][1]++;
          } else if (currYP == "JOY") {
            CTdata[48][2]++;
          }
  
        break;
      case "DE":
          DEdata[0]++;

        if (currOut == "No") {
          DEdata[1][0]++;
        } else if (currOut = "Yes") {
          DEdata[1][1]++;
        }

        //Butterfinger 2
        if (currBF == "DESPAIR") {
          DEdata[2][0]++;
        } else if (currBF == "MEH") {
          DEdata[2][1]++;
        } else if (currBF == "JOY") {
          DEdata[2][2]++;
        }

        //CandyCorn 3
        if (currCC == "DESPAIR") {
          DEdata[3][0]++;
        } else if (currCC == "MEH") {
          DEdata[3][1]++;
        } else if (currCC == "JOY") {
          DEdata[3][2]++;
        }

        //chiclets 4
        if (currCL == "DESPAIR") {
          DEdata[4][0]++;
        } else if (currCL == "MEH") {
          DEdata[4][1]++;
        } else if (currCL == "JOY") {
          DEdata[4][2]++;
        }

        //Dots 5
        if (currDT == "DESPAIR") {
          DEdata[5][0]++;
        } else if (currDT == "MEH") {
          DEdata[5][1]++;
        } else if (currDT == "JOY") {
          DEdata[5][2]++;
        }

        //Fuzzy Peaches 6
        if (currFP == "DESPAIR") {
          DEdata[6][0]++;
        } else if (currFP == "MEH") {
          DEdata[6][1]++;
        } else if (currFP == "JOY") {
          DEdata[6][2]++;
        }

        //Good n Plenty 7
        if (currGP == "DESPAIR") {
          DEdata[7][0]++;
        } else if (currGP == "MEH") {
          DEdata[7][1]++;
        } else if (currGP == "JOY") {
          DEdata[7][2]++;
        }

        //Gummy Bears 8
        if (currGB == "DESPAIR") {
          DEdata[8][0]++;
        } else if (currGB == "MEH") {
          DEdata[8][1]++;
        } else if (currGB == "JOY") {
          DEdata[8][2]++;
        }

        //Healthy Fruit 9
        if (currHF == "DESPAIR") {
          DEdata[9][0]++;
        } else if (currHF == "MEH") {
          DEdata[9][1]++;
        } else if (currHF == "JOY") {
          DEdata[9][2]++;
        }

        //Heath Bar 10
        if (currHB == "DESPAIR") {
          DEdata[10][0]++;
        } else if (currHB == "MEH") {
          DEdata[10][1]++;
        } else if (currHB == "JOY") {
          DEdata[10][2]++;
        }

        //Hershey Dark 11
        if (currHD == "DESPAIR") {
          DEdata[11][0]++;
        } else if (currHD == "MEH") {
          DEdata[11][1]++;
        } else if (currHD == "JOY") {
          DEdata[11][2]++;
        }

        //Hershy Milk 12
        if (currHM == "DESPAIR") {
          DEdata[12][0]++;
        } else if (currHM == "MEH") {
          DEdata[12][1]++;
        } else if (currHM == "JOY") {
          DEdata[12][2]++;
        }

        //Hershey Kisses 13
        if (currHK == "DESPAIR") {
          DEdata[13][0]++;
        } else if (currHK == "MEH") {
          DEdata[13][1]++;
        } else if (currHK == "JOY") {
          DEdata[13][2]++;
        }

        //Jolly Rancher Bad 14
        if (currJB == "DESPAIR") {
          DEdata[14][0]++;
        } else if (currJB == "MEH") {
          DEdata[14][1]++;
        } else if (currJB == "JOY") {
          DEdata[14][2]++;
        }

        //Jolly Rancher Good 15
        if (currJG == "DESPAIR") {
          DEdata[15][0]++;
        } else if (currJG == "MEH") {
          DEdata[15][1]++;
        } else if (currJG == "JOY") {
          DEdata[15][2]++;
        }

        //Junior Mints 16
        if (currJM == "DESPAIR") {
          DEdata[16][0]++;
        } else if (currJM == "MEH") {
          DEdata[16][1]++;
        } else if (currJM == "JOY") {
          DEdata[16][2]++;
        }

        //Kit Kat 17
        if (currKK == "DESPAIR") {
          DEdata[17][0]++;
        } else if (currKK == "MEH") {
          DEdata[17][1]++;
        } else if (currKK == "JOY") {
          DEdata[17][2]++;
        }

        //Laffy Taffy 18
        if (currLT == "DESPAIR") {
          DEdata[18][0]++;
        } else if (currLT == "MEH") {
          DEdata[18][1]++;
        } else if (currLT == "JOY") {
          DEdata[18][2]++;
        }

        //Lemon Heads 19
        if (currLH == "DESPAIR") {
          DEdata[19][0]++;
        } else if (currLH == "MEH") {
          DEdata[19][1]++;
        } else if (currLH == "JOY") {
          DEdata[19][2]++;
        }

        //Licorice not black 20
        if (currLN == "DESPAIR") {
          DEdata[20][0]++;
        } else if (currLN == "MEH") {
          DEdata[20][1]++;
        } else if (currLN == "JOY") {
          DEdata[20][2]++;
        }

        //Licorice black 21
        if (currLB == "DESPAIR") {
          DEdata[21][0]++;
        } else if (currLB == "MEH") {
          DEdata[21][1]++;
        } else if (currLB == "JOY") {
          DEdata[21][2]++;
        }

        //Lollipops 22
        if (currLP == "DESPAIR") {
          DEdata[22][0]++;
        } else if (currLP == "MEH") {
          DEdata[22][1]++;
        } else if (currLP == "JOY") {
          DEdata[22][2]++;
        }

        //mike and ike 23
        if (currMI == "DESPAIR") {
          DEdata[23][0]++;
        } else if (currMI == "MEH") {
          DEdata[23][1]++;
        } else if (currMI == "JOY") {
          DEdata[23][2]++;
        }

        //milk duds 24
        if (currMD == "DESPAIR") {
          DEdata[24][0]++;
        } else if (currMD == "MEH") {
          DEdata[24][1]++;
        } else if (currMD == "JOY") {
          DEdata[24][2]++;
        }

        //milky way 25
        if (currMW == "DESPAIR") {
          DEdata[25][0]++;
        } else if (currMW == "MEH") {
          DEdata[25][1]++;
        } else if (currMW == "JOY") {
          DEdata[25][2]++;
        }
        
        //regular m&ms 26
        if (currMM == "DESPAIR") {
          DEdata[26][0]++;
        } else if (currMM == "MEH") {
          DEdata[26][1]++;
        } else if (currMM == "JOY") {
          DEdata[26][2]++;
        }

        //peanut mms 27
        if (currPM == "DESPAIR") {
          DEdata[27][0]++;
        } else if (currPM == "MEH") {
          DEdata[27][1]++;
        } else if (currPM == "JOY") {
          DEdata[27][2]++;
        }

        //mint kisses 28
        if (currMK == "DESPAIR") {
          DEdata[28][0]++;
        } else if (currMK == "MEH") {
          DEdata[28][1]++;
        } else if (currMK == "JOY") {
          DEdata[28][2]++;
        }

        //mr goodbar 29
        if (currMG == "DESPAIR") {
          DEdata[29][0]++;
        } else if (currMG == "MEH") {
          DEdata[29][1]++;
        } else if (currMG == "JOY") {
          DEdata[29][2]++;
        }

        //nerds 30
        if (currND == "DESPAIR") {
          DEdata[30][0]++;
        } else if (currND == "MEH") {
          DEdata[30][1]++;
        } else if (currND == "JOY") {
          DEdata[30][2]++;
        }

        //nestle crunch 31
        if (currNC == "DESPAIR") {
          DEdata[31][0]++;
        } else if (currNC == "MEH") {
          DEdata[31][1]++;
        } else if (currNC == "JOY") {
          DEdata[31][2]++;
        }

        //peeps 32
        if (currPP == "DESPAIR") {
          DEdata[32][0]++;
        } else if (currPP == "MEH") {
          DEdata[32][1]++;
        } else if (currPP == "JOY") {
          DEdata[32][2]++;
        }

        //pixy stix 33
        if (currPS == "DESPAIR") {
          DEdata[33][0]++;
        } else if (currPS == "MEH") {
          DEdata[33][1]++;
        } else if (currPS == "JOY") {
          DEdata[33][2]++;
        }

        //reeses cups 34
        if (currRC == "DESPAIR") {
          DEdata[34][0]++;
        } else if (currRC == "MEH") {
          DEdata[34][1]++;
        } else if (currRC == "JOY") {
          DEdata[34][2]++;
        }

        //reeses pieces 35
        if (currRP == "DESPAIR") {
          DEdata[35][0]++;
        } else if (currRP == "MEH") {
          DEdata[35][1]++;
        } else if (currRP == "JOY") {
          DEdata[35][2]++;
        }

        //rolos 36
        if (currRL == "DESPAIR") {
          DEdata[36][0]++;
        } else if (currRL == "MEH") {
          DEdata[36][1]++;
        } else if (currRL == "JOY") {
          DEdata[36][2]++;
        }

        //skittles 37
        if (currSK == "DESPAIR") {
          DEdata[37][0]++;
        } else if (currSK == "MEH") {
          DEdata[37][1]++;
        } else if (currSK == "JOY") {
          DEdata[37][2]++;
        }

        //snickers 38
        if (currSN == "DESPAIR") {
          DEdata[38][0]++;
        } else if (currSN == "MEH") {
          DEdata[38][1]++;
        } else if (currSN == "JOY") {
          DEdata[38][2]++;
        }

        //sour patch kids 39
        if (currSP == "DESPAIR") {
          DEdata[39][0]++;
        } else if (currSP == "MEH") {
          DEdata[39][1]++;
        } else if (currSP == "JOY") {
          DEdata[39][2]++;
        }

        //starbursts 40
        if (currST == "DESPAIR") {
          DEdata[40][0]++;
        } else if (currST == "MEH") {
          DEdata[40][1]++;
        } else if (currST == "JOY") {
          DEdata[40][2]++;
        }

        //swedish fish 41
        if (currSF == "DESPAIR") {
          DEdata[41][0]++;
        } else if (currSF == "MEH") {
          DEdata[41][1]++;
        } else if (currSF == "JOY") {
          DEdata[41][2]++;
        }

        //tic tacs 42
        if (currTT == "DESPAIR") {
          DEdata[42][0]++;
        } else if (currTT == "MEH") {
          DEdata[42][1]++;
        } else if (currTT == "JOY") {
          DEdata[42][2]++;
        }

        //three musketeers 43
        if (currTM == "DESPAIR") {
          DEdata[43][0]++;
        } else if (currTM == "MEH") {
          DEdata[43][1]++;
        } else if (currTM == "JOY") {
          DEdata[43][2]++;
        }

        //tolberone 44
        if (currTB == "DESPAIR") {
          DEdata[44][0]++;
        } else if (currTB == "MEH") {
          DEdata[44][1]++;
        } else if (currTB == "JOY") {
          DEdata[44][2]++;
        }

        //trail mix 45
        if (currTM == "DESPAIR") {
          DEdata[45][0]++;
        } else if (currTM == "MEH") {
          DEdata[45][1]++;
        } else if (currTM == "JOY") {
          DEdata[45][2]++;
        }

        //twix 46
        if (currTW == "DESPAIR") {
          DEdata[46][0]++;
        } else if (currTW == "MEH") {
          DEdata[46][1]++;
        } else if (currTW == "JOY") {
          DEdata[46][2]++;
        }

        //whatchamacallit 47
        if (currWM == "DESPAIR") {
          DEdata[47][0]++;
        } else if (currWM == "MEH") {
          DEdata[47][1]++;
        } else if (currWM == "JOY") {
          DEdata[47][2]++;
        }

        //york peppermint patties 48
        if (currYP == "DESPAIR") {
          DEdata[48][0]++;
        } else if (currYP == "MEH") {
          DEdata[48][1]++;
        } else if (currYP == "JOY") {
          DEdata[48][2]++;
        }

      break;
      case "DC":
          DCdata[0]++;

          if (currOut == "No") {
            DCdata[1][0]++;
          } else if (currOut = "Yes") {
            DCdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            DCdata[2][0]++;
          } else if (currBF == "MEH") {
            DCdata[2][1]++;
          } else if (currBF == "JOY") {
            DCdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            DCdata[3][0]++;
          } else if (currCC == "MEH") {
            DCdata[3][1]++;
          } else if (currCC == "JOY") {
            DCdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            DCdata[4][0]++;
          } else if (currCL == "MEH") {
            DCdata[4][1]++;
          } else if (currCL == "JOY") {
            DCdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            DCdata[5][0]++;
          } else if (currDT == "MEH") {
            DCdata[5][1]++;
          } else if (currDT == "JOY") {
            DCdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            DCdata[6][0]++;
          } else if (currFP == "MEH") {
            DCdata[6][1]++;
          } else if (currFP == "JOY") {
            DCdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            DCdata[7][0]++;
          } else if (currGP == "MEH") {
            DCdata[7][1]++;
          } else if (currGP == "JOY") {
            DCdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            DCdata[8][0]++;
          } else if (currGB == "MEH") {
            DCdata[8][1]++;
          } else if (currGB == "JOY") {
            DCdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            DCdata[9][0]++;
          } else if (currHF == "MEH") {
            DCdata[9][1]++;
          } else if (currHF == "JOY") {
            DCdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            DCdata[10][0]++;
          } else if (currHB == "MEH") {
            DCdata[10][1]++;
          } else if (currHB == "JOY") {
            DCdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            DCdata[11][0]++;
          } else if (currHD == "MEH") {
            DCdata[11][1]++;
          } else if (currHD == "JOY") {
            DCdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            DCdata[12][0]++;
          } else if (currHM == "MEH") {
            DCdata[12][1]++;
          } else if (currHM == "JOY") {
            DCdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            DCdata[13][0]++;
          } else if (currHK == "MEH") {
            DCdata[13][1]++;
          } else if (currHK == "JOY") {
            DCdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            DCdata[14][0]++;
          } else if (currJB == "MEH") {
            DCdata[14][1]++;
          } else if (currJB == "JOY") {
            DCdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            DCdata[15][0]++;
          } else if (currJG == "MEH") {
            DCdata[15][1]++;
          } else if (currJG == "JOY") {
            DCdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            DCdata[16][0]++;
          } else if (currJM == "MEH") {
            DCdata[16][1]++;
          } else if (currJM == "JOY") {
            DCdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            DCdata[17][0]++;
          } else if (currKK == "MEH") {
            DCdata[17][1]++;
          } else if (currKK == "JOY") {
            DCdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            DCdata[18][0]++;
          } else if (currLT == "MEH") {
            DCdata[18][1]++;
          } else if (currLT == "JOY") {
            DCdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            DCdata[19][0]++;
          } else if (currLH == "MEH") {
            DCdata[19][1]++;
          } else if (currLH == "JOY") {
            DCdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            DCdata[20][0]++;
          } else if (currLN == "MEH") {
            DCdata[20][1]++;
          } else if (currLN == "JOY") {
            DCdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            DCdata[21][0]++;
          } else if (currLB == "MEH") {
            DCdata[21][1]++;
          } else if (currLB == "JOY") {
            DCdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            DCdata[22][0]++;
          } else if (currLP == "MEH") {
            DCdata[22][1]++;
          } else if (currLP == "JOY") {
            DCdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            DCdata[23][0]++;
          } else if (currMI == "MEH") {
            DCdata[23][1]++;
          } else if (currMI == "JOY") {
            DCdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            DCdata[24][0]++;
          } else if (currMD == "MEH") {
            DCdata[24][1]++;
          } else if (currMD == "JOY") {
            DCdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            DCdata[25][0]++;
          } else if (currMW == "MEH") {
            DCdata[25][1]++;
          } else if (currMW == "JOY") {
            DCdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            DCdata[26][0]++;
          } else if (currMM == "MEH") {
            DCdata[26][1]++;
          } else if (currMM == "JOY") {
            DCdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            DCdata[27][0]++;
          } else if (currPM == "MEH") {
            DCdata[27][1]++;
          } else if (currPM == "JOY") {
            DCdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            DCdata[28][0]++;
          } else if (currMK == "MEH") {
            DCdata[28][1]++;
          } else if (currMK == "JOY") {
            DCdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            DCdata[29][0]++;
          } else if (currMG == "MEH") {
            DCdata[29][1]++;
          } else if (currMG == "JOY") {
            DCdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            DCdata[30][0]++;
          } else if (currND == "MEH") {
            DCdata[30][1]++;
          } else if (currND == "JOY") {
            DCdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            DCdata[31][0]++;
          } else if (currNC == "MEH") {
            DCdata[31][1]++;
          } else if (currNC == "JOY") {
            DCdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            DCdata[32][0]++;
          } else if (currPP == "MEH") {
            DCdata[32][1]++;
          } else if (currPP == "JOY") {
            DCdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            DCdata[33][0]++;
          } else if (currPS == "MEH") {
            DCdata[33][1]++;
          } else if (currPS == "JOY") {
            DCdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            DCdata[34][0]++;
          } else if (currRC == "MEH") {
            DCdata[34][1]++;
          } else if (currRC == "JOY") {
            DCdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            DCdata[35][0]++;
          } else if (currRP == "MEH") {
            DCdata[35][1]++;
          } else if (currRP == "JOY") {
            DCdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            DCdata[36][0]++;
          } else if (currRL == "MEH") {
            DCdata[36][1]++;
          } else if (currRL == "JOY") {
            DCdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            DCdata[37][0]++;
          } else if (currSK == "MEH") {
            DCdata[37][1]++;
          } else if (currSK == "JOY") {
            DCdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            DCdata[38][0]++;
          } else if (currSN == "MEH") {
            DCdata[38][1]++;
          } else if (currSN == "JOY") {
            DCdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            DCdata[39][0]++;
          } else if (currSP == "MEH") {
            DCdata[39][1]++;
          } else if (currSP == "JOY") {
            DCdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            DCdata[40][0]++;
          } else if (currST == "MEH") {
            DCdata[40][1]++;
          } else if (currST == "JOY") {
            DCdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            DCdata[41][0]++;
          } else if (currSF == "MEH") {
            DCdata[41][1]++;
          } else if (currSF == "JOY") {
            DCdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            DCdata[42][0]++;
          } else if (currTT == "MEH") {
            DCdata[42][1]++;
          } else if (currTT == "JOY") {
            DCdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            DCdata[43][0]++;
          } else if (currTM == "MEH") {
            DCdata[43][1]++;
          } else if (currTM == "JOY") {
            DCdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            DCdata[44][0]++;
          } else if (currTB == "MEH") {
            DCdata[44][1]++;
          } else if (currTB == "JOY") {
            DCdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            DCdata[45][0]++;
          } else if (currTM == "MEH") {
            DCdata[45][1]++;
          } else if (currTM == "JOY") {
            DCdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            DCdata[46][0]++;
          } else if (currTW == "MEH") {
            DCdata[46][1]++;
          } else if (currTW == "JOY") {
            DCdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            DCdata[47][0]++;
          } else if (currWM == "MEH") {
            DCdata[47][1]++;
          } else if (currWM == "JOY") {
            DCdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            DCdata[48][0]++;
          } else if (currYP == "MEH") {
            DCdata[48][1]++;
          } else if (currYP == "JOY") {
            DCdata[48][2]++;
          }
  
        break;
      case "FL":
          FLdata[0]++;

          if (currOut == "No") {
            FLdata[1][0]++;
          } else if (currOut = "Yes") {
            FLdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            FLdata[2][0]++;
          } else if (currBF == "MEH") {
            FLdata[2][1]++;
          } else if (currBF == "JOY") {
            FLdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            FLdata[3][0]++;
          } else if (currCC == "MEH") {
            FLdata[3][1]++;
          } else if (currCC == "JOY") {
            FLdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            FLdata[4][0]++;
          } else if (currCL == "MEH") {
            FLdata[4][1]++;
          } else if (currCL == "JOY") {
            FLdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            FLdata[5][0]++;
          } else if (currDT == "MEH") {
            FLdata[5][1]++;
          } else if (currDT == "JOY") {
            FLdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            FLdata[6][0]++;
          } else if (currFP == "MEH") {
            FLdata[6][1]++;
          } else if (currFP == "JOY") {
            FLdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            FLdata[7][0]++;
          } else if (currGP == "MEH") {
            FLdata[7][1]++;
          } else if (currGP == "JOY") {
            FLdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            FLdata[8][0]++;
          } else if (currGB == "MEH") {
            FLdata[8][1]++;
          } else if (currGB == "JOY") {
            FLdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            FLdata[9][0]++;
          } else if (currHF == "MEH") {
            FLdata[9][1]++;
          } else if (currHF == "JOY") {
            FLdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            FLdata[10][0]++;
          } else if (currHB == "MEH") {
            FLdata[10][1]++;
          } else if (currHB == "JOY") {
            FLdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            FLdata[11][0]++;
          } else if (currHD == "MEH") {
            FLdata[11][1]++;
          } else if (currHD == "JOY") {
            FLdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            FLdata[12][0]++;
          } else if (currHM == "MEH") {
            FLdata[12][1]++;
          } else if (currHM == "JOY") {
            FLdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            FLdata[13][0]++;
          } else if (currHK == "MEH") {
            FLdata[13][1]++;
          } else if (currHK == "JOY") {
            FLdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            FLdata[14][0]++;
          } else if (currJB == "MEH") {
            FLdata[14][1]++;
          } else if (currJB == "JOY") {
            FLdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            FLdata[15][0]++;
          } else if (currJG == "MEH") {
            FLdata[15][1]++;
          } else if (currJG == "JOY") {
            FLdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            FLdata[16][0]++;
          } else if (currJM == "MEH") {
            FLdata[16][1]++;
          } else if (currJM == "JOY") {
            FLdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            FLdata[17][0]++;
          } else if (currKK == "MEH") {
            FLdata[17][1]++;
          } else if (currKK == "JOY") {
            FLdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            FLdata[18][0]++;
          } else if (currLT == "MEH") {
            FLdata[18][1]++;
          } else if (currLT == "JOY") {
            FLdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            FLdata[19][0]++;
          } else if (currLH == "MEH") {
            FLdata[19][1]++;
          } else if (currLH == "JOY") {
            FLdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            FLdata[20][0]++;
          } else if (currLN == "MEH") {
            FLdata[20][1]++;
          } else if (currLN == "JOY") {
            FLdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            FLdata[21][0]++;
          } else if (currLB == "MEH") {
            FLdata[21][1]++;
          } else if (currLB == "JOY") {
            FLdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            FLdata[22][0]++;
          } else if (currLP == "MEH") {
            FLdata[22][1]++;
          } else if (currLP == "JOY") {
            FLdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            FLdata[23][0]++;
          } else if (currMI == "MEH") {
            FLdata[23][1]++;
          } else if (currMI == "JOY") {
            FLdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            FLdata[24][0]++;
          } else if (currMD == "MEH") {
            FLdata[24][1]++;
          } else if (currMD == "JOY") {
            FLdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            FLdata[25][0]++;
          } else if (currMW == "MEH") {
            FLdata[25][1]++;
          } else if (currMW == "JOY") {
            FLdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            FLdata[26][0]++;
          } else if (currMM == "MEH") {
            FLdata[26][1]++;
          } else if (currMM == "JOY") {
            FLdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            FLdata[27][0]++;
          } else if (currPM == "MEH") {
            FLdata[27][1]++;
          } else if (currPM == "JOY") {
            FLdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            FLdata[28][0]++;
          } else if (currMK == "MEH") {
            FLdata[28][1]++;
          } else if (currMK == "JOY") {
            FLdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            FLdata[29][0]++;
          } else if (currMG == "MEH") {
            FLdata[29][1]++;
          } else if (currMG == "JOY") {
            FLdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            FLdata[30][0]++;
          } else if (currND == "MEH") {
            FLdata[30][1]++;
          } else if (currND == "JOY") {
            FLdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            FLdata[31][0]++;
          } else if (currNC == "MEH") {
            FLdata[31][1]++;
          } else if (currNC == "JOY") {
            FLdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            FLdata[32][0]++;
          } else if (currPP == "MEH") {
            FLdata[32][1]++;
          } else if (currPP == "JOY") {
            FLdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            FLdata[33][0]++;
          } else if (currPS == "MEH") {
            FLdata[33][1]++;
          } else if (currPS == "JOY") {
            FLdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            FLdata[34][0]++;
          } else if (currRC == "MEH") {
            FLdata[34][1]++;
          } else if (currRC == "JOY") {
            FLdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            FLdata[35][0]++;
          } else if (currRP == "MEH") {
            FLdata[35][1]++;
          } else if (currRP == "JOY") {
            FLdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            FLdata[36][0]++;
          } else if (currRL == "MEH") {
            FLdata[36][1]++;
          } else if (currRL == "JOY") {
            FLdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            FLdata[37][0]++;
          } else if (currSK == "MEH") {
            FLdata[37][1]++;
          } else if (currSK == "JOY") {
            FLdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            FLdata[38][0]++;
          } else if (currSN == "MEH") {
            FLdata[38][1]++;
          } else if (currSN == "JOY") {
            FLdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            FLdata[39][0]++;
          } else if (currSP == "MEH") {
            FLdata[39][1]++;
          } else if (currSP == "JOY") {
            FLdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            FLdata[40][0]++;
          } else if (currST == "MEH") {
            FLdata[40][1]++;
          } else if (currST == "JOY") {
            FLdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            FLdata[41][0]++;
          } else if (currSF == "MEH") {
            FLdata[41][1]++;
          } else if (currSF == "JOY") {
            FLdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            FLdata[42][0]++;
          } else if (currTT == "MEH") {
            FLdata[42][1]++;
          } else if (currTT == "JOY") {
            FLdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            FLdata[43][0]++;
          } else if (currTM == "MEH") {
            FLdata[43][1]++;
          } else if (currTM == "JOY") {
            FLdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            FLdata[44][0]++;
          } else if (currTB == "MEH") {
            FLdata[44][1]++;
          } else if (currTB == "JOY") {
            FLdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            FLdata[45][0]++;
          } else if (currTM == "MEH") {
            FLdata[45][1]++;
          } else if (currTM == "JOY") {
            FLdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            FLdata[46][0]++;
          } else if (currTW == "MEH") {
            FLdata[46][1]++;
          } else if (currTW == "JOY") {
            FLdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            FLdata[47][0]++;
          } else if (currWM == "MEH") {
            FLdata[47][1]++;
          } else if (currWM == "JOY") {
            FLdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            FLdata[48][0]++;
          } else if (currYP == "MEH") {
            FLdata[48][1]++;
          } else if (currYP == "JOY") {
            FLdata[48][2]++;
          }
  
        break;
      case "GA":
          GAdata[0]++;

          if (currOut == "No") {
            GAdata[1][0]++;
          } else if (currOut = "Yes") {
            GAdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            GAdata[2][0]++;
          } else if (currBF == "MEH") {
            GAdata[2][1]++;
          } else if (currBF == "JOY") {
            GAdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            GAdata[3][0]++;
          } else if (currCC == "MEH") {
            GAdata[3][1]++;
          } else if (currCC == "JOY") {
            GAdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            GAdata[4][0]++;
          } else if (currCL == "MEH") {
            GAdata[4][1]++;
          } else if (currCL == "JOY") {
            GAdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            GAdata[5][0]++;
          } else if (currDT == "MEH") {
            GAdata[5][1]++;
          } else if (currDT == "JOY") {
            GAdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            GAdata[6][0]++;
          } else if (currFP == "MEH") {
            GAdata[6][1]++;
          } else if (currFP == "JOY") {
            GAdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            GAdata[7][0]++;
          } else if (currGP == "MEH") {
            GAdata[7][1]++;
          } else if (currGP == "JOY") {
            GAdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            GAdata[8][0]++;
          } else if (currGB == "MEH") {
            GAdata[8][1]++;
          } else if (currGB == "JOY") {
            GAdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            GAdata[9][0]++;
          } else if (currHF == "MEH") {
            GAdata[9][1]++;
          } else if (currHF == "JOY") {
            GAdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            GAdata[10][0]++;
          } else if (currHB == "MEH") {
            GAdata[10][1]++;
          } else if (currHB == "JOY") {
            GAdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            GAdata[11][0]++;
          } else if (currHD == "MEH") {
            GAdata[11][1]++;
          } else if (currHD == "JOY") {
            GAdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            GAdata[12][0]++;
          } else if (currHM == "MEH") {
            GAdata[12][1]++;
          } else if (currHM == "JOY") {
            GAdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            GAdata[13][0]++;
          } else if (currHK == "MEH") {
            GAdata[13][1]++;
          } else if (currHK == "JOY") {
            GAdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            GAdata[14][0]++;
          } else if (currJB == "MEH") {
            GAdata[14][1]++;
          } else if (currJB == "JOY") {
            GAdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            GAdata[15][0]++;
          } else if (currJG == "MEH") {
            GAdata[15][1]++;
          } else if (currJG == "JOY") {
            GAdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            GAdata[16][0]++;
          } else if (currJM == "MEH") {
            GAdata[16][1]++;
          } else if (currJM == "JOY") {
            GAdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            GAdata[17][0]++;
          } else if (currKK == "MEH") {
            GAdata[17][1]++;
          } else if (currKK == "JOY") {
            GAdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            GAdata[18][0]++;
          } else if (currLT == "MEH") {
            GAdata[18][1]++;
          } else if (currLT == "JOY") {
            GAdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            GAdata[19][0]++;
          } else if (currLH == "MEH") {
            GAdata[19][1]++;
          } else if (currLH == "JOY") {
            GAdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            GAdata[20][0]++;
          } else if (currLN == "MEH") {
            GAdata[20][1]++;
          } else if (currLN == "JOY") {
            GAdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            GAdata[21][0]++;
          } else if (currLB == "MEH") {
            GAdata[21][1]++;
          } else if (currLB == "JOY") {
            GAdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            GAdata[22][0]++;
          } else if (currLP == "MEH") {
            GAdata[22][1]++;
          } else if (currLP == "JOY") {
            GAdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            GAdata[23][0]++;
          } else if (currMI == "MEH") {
            GAdata[23][1]++;
          } else if (currMI == "JOY") {
            GAdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            GAdata[24][0]++;
          } else if (currMD == "MEH") {
            GAdata[24][1]++;
          } else if (currMD == "JOY") {
            GAdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            GAdata[25][0]++;
          } else if (currMW == "MEH") {
            GAdata[25][1]++;
          } else if (currMW == "JOY") {
            GAdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            GAdata[26][0]++;
          } else if (currMM == "MEH") {
            GAdata[26][1]++;
          } else if (currMM == "JOY") {
            GAdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            GAdata[27][0]++;
          } else if (currPM == "MEH") {
            GAdata[27][1]++;
          } else if (currPM == "JOY") {
            GAdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            GAdata[28][0]++;
          } else if (currMK == "MEH") {
            GAdata[28][1]++;
          } else if (currMK == "JOY") {
            GAdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            GAdata[29][0]++;
          } else if (currMG == "MEH") {
            GAdata[29][1]++;
          } else if (currMG == "JOY") {
            GAdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            GAdata[30][0]++;
          } else if (currND == "MEH") {
            GAdata[30][1]++;
          } else if (currND == "JOY") {
            GAdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            GAdata[31][0]++;
          } else if (currNC == "MEH") {
            GAdata[31][1]++;
          } else if (currNC == "JOY") {
            GAdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            GAdata[32][0]++;
          } else if (currPP == "MEH") {
            GAdata[32][1]++;
          } else if (currPP == "JOY") {
            GAdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            GAdata[33][0]++;
          } else if (currPS == "MEH") {
            GAdata[33][1]++;
          } else if (currPS == "JOY") {
            GAdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            GAdata[34][0]++;
          } else if (currRC == "MEH") {
            GAdata[34][1]++;
          } else if (currRC == "JOY") {
            GAdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            GAdata[35][0]++;
          } else if (currRP == "MEH") {
            GAdata[35][1]++;
          } else if (currRP == "JOY") {
            GAdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            GAdata[36][0]++;
          } else if (currRL == "MEH") {
            GAdata[36][1]++;
          } else if (currRL == "JOY") {
            GAdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            GAdata[37][0]++;
          } else if (currSK == "MEH") {
            GAdata[37][1]++;
          } else if (currSK == "JOY") {
            GAdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            GAdata[38][0]++;
          } else if (currSN == "MEH") {
            GAdata[38][1]++;
          } else if (currSN == "JOY") {
            GAdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            GAdata[39][0]++;
          } else if (currSP == "MEH") {
            GAdata[39][1]++;
          } else if (currSP == "JOY") {
            GAdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            GAdata[40][0]++;
          } else if (currST == "MEH") {
            GAdata[40][1]++;
          } else if (currST == "JOY") {
            GAdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            GAdata[41][0]++;
          } else if (currSF == "MEH") {
            GAdata[41][1]++;
          } else if (currSF == "JOY") {
            GAdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            GAdata[42][0]++;
          } else if (currTT == "MEH") {
            GAdata[42][1]++;
          } else if (currTT == "JOY") {
            GAdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            GAdata[43][0]++;
          } else if (currTM == "MEH") {
            GAdata[43][1]++;
          } else if (currTM == "JOY") {
            GAdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            GAdata[44][0]++;
          } else if (currTB == "MEH") {
            GAdata[44][1]++;
          } else if (currTB == "JOY") {
            GAdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            GAdata[45][0]++;
          } else if (currTM == "MEH") {
            GAdata[45][1]++;
          } else if (currTM == "JOY") {
            GAdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            GAdata[46][0]++;
          } else if (currTW == "MEH") {
            GAdata[46][1]++;
          } else if (currTW == "JOY") {
            GAdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            GAdata[47][0]++;
          } else if (currWM == "MEH") {
            GAdata[47][1]++;
          } else if (currWM == "JOY") {
            GAdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            GAdata[48][0]++;
          } else if (currYP == "MEH") {
            GAdata[48][1]++;
          } else if (currYP == "JOY") {
            GAdata[48][2]++;
          }
  
        break;
      case "HI":

          HIdata[0]++;

        if (currOut == "No") {
          HIdata[1][0]++;
        } else if (currOut = "Yes") {
          HIdata[1][1]++;
        }

        //Butterfinger 2
        if (currBF == "DESPAIR") {
          HIdata[2][0]++;
        } else if (currBF == "MEH") {
          HIdata[2][1]++;
        } else if (currBF == "JOY") {
          HIdata[2][2]++;
        }

        //CandyCorn 3
        if (currCC == "DESPAIR") {
          HIdata[3][0]++;
        } else if (currCC == "MEH") {
          HIdata[3][1]++;
        } else if (currCC == "JOY") {
          HIdata[3][2]++;
        }

        //chiclets 4
        if (currCL == "DESPAIR") {
          HIdata[4][0]++;
        } else if (currCL == "MEH") {
          HIdata[4][1]++;
        } else if (currCL == "JOY") {
          HIdata[4][2]++;
        }

        //Dots 5
        if (currDT == "DESPAIR") {
          HIdata[5][0]++;
        } else if (currDT == "MEH") {
          HIdata[5][1]++;
        } else if (currDT == "JOY") {
          HIdata[5][2]++;
        }

        //Fuzzy Peaches 6
        if (currFP == "DESPAIR") {
          HIdata[6][0]++;
        } else if (currFP == "MEH") {
          HIdata[6][1]++;
        } else if (currFP == "JOY") {
          HIdata[6][2]++;
        }

        //Good n Plenty 7
        if (currGP == "DESPAIR") {
          HIdata[7][0]++;
        } else if (currGP == "MEH") {
          HIdata[7][1]++;
        } else if (currGP == "JOY") {
          HIdata[7][2]++;
        }

        //Gummy Bears 8
        if (currGB == "DESPAIR") {
          HIdata[8][0]++;
        } else if (currGB == "MEH") {
          HIdata[8][1]++;
        } else if (currGB == "JOY") {
          HIdata[8][2]++;
        }

        //Healthy Fruit 9
        if (currHF == "DESPAIR") {
          HIdata[9][0]++;
        } else if (currHF == "MEH") {
          HIdata[9][1]++;
        } else if (currHF == "JOY") {
          HIdata[9][2]++;
        }

        //Heath Bar 10
        if (currHB == "DESPAIR") {
          HIdata[10][0]++;
        } else if (currHB == "MEH") {
          HIdata[10][1]++;
        } else if (currHB == "JOY") {
          HIdata[10][2]++;
        }

        //Hershey Dark 11
        if (currHD == "DESPAIR") {
          HIdata[11][0]++;
        } else if (currHD == "MEH") {
          HIdata[11][1]++;
        } else if (currHD == "JOY") {
          HIdata[11][2]++;
        }

        //Hershy Milk 12
        if (currHM == "DESPAIR") {
          HIdata[12][0]++;
        } else if (currHM == "MEH") {
          HIdata[12][1]++;
        } else if (currHM == "JOY") {
          HIdata[12][2]++;
        }

        //Hershey Kisses 13
        if (currHK == "DESPAIR") {
          HIdata[13][0]++;
        } else if (currHK == "MEH") {
          HIdata[13][1]++;
        } else if (currHK == "JOY") {
          HIdata[13][2]++;
        }

        //Jolly Rancher Bad 14
        if (currJB == "DESPAIR") {
          HIdata[14][0]++;
        } else if (currJB == "MEH") {
          HIdata[14][1]++;
        } else if (currJB == "JOY") {
          HIdata[14][2]++;
        }

        //Jolly Rancher Good 15
        if (currJG == "DESPAIR") {
          HIdata[15][0]++;
        } else if (currJG == "MEH") {
          HIdata[15][1]++;
        } else if (currJG == "JOY") {
          HIdata[15][2]++;
        }

        //Junior Mints 16
        if (currJM == "DESPAIR") {
          HIdata[16][0]++;
        } else if (currJM == "MEH") {
          HIdata[16][1]++;
        } else if (currJM == "JOY") {
          HIdata[16][2]++;
        }

        //Kit Kat 17
        if (currKK == "DESPAIR") {
          HIdata[17][0]++;
        } else if (currKK == "MEH") {
          HIdata[17][1]++;
        } else if (currKK == "JOY") {
          HIdata[17][2]++;
        }

        //Laffy Taffy 18
        if (currLT == "DESPAIR") {
          HIdata[18][0]++;
        } else if (currLT == "MEH") {
          HIdata[18][1]++;
        } else if (currLT == "JOY") {
          HIdata[18][2]++;
        }

        //Lemon Heads 19
        if (currLH == "DESPAIR") {
          HIdata[19][0]++;
        } else if (currLH == "MEH") {
          HIdata[19][1]++;
        } else if (currLH == "JOY") {
          HIdata[19][2]++;
        }

        //Licorice not black 20
        if (currLN == "DESPAIR") {
          HIdata[20][0]++;
        } else if (currLN == "MEH") {
          HIdata[20][1]++;
        } else if (currLN == "JOY") {
          HIdata[20][2]++;
        }

        //Licorice black 21
        if (currLB == "DESPAIR") {
          HIdata[21][0]++;
        } else if (currLB == "MEH") {
          HIdata[21][1]++;
        } else if (currLB == "JOY") {
          HIdata[21][2]++;
        }

        //Lollipops 22
        if (currLP == "DESPAIR") {
          HIdata[22][0]++;
        } else if (currLP == "MEH") {
          HIdata[22][1]++;
        } else if (currLP == "JOY") {
          HIdata[22][2]++;
        }

        //mike and ike 23
        if (currMI == "DESPAIR") {
          HIdata[23][0]++;
        } else if (currMI == "MEH") {
          HIdata[23][1]++;
        } else if (currMI == "JOY") {
          HIdata[23][2]++;
        }

        //milk duds 24
        if (currMD == "DESPAIR") {
          HIdata[24][0]++;
        } else if (currMD == "MEH") {
          HIdata[24][1]++;
        } else if (currMD == "JOY") {
          HIdata[24][2]++;
        }

        //milky way 25
        if (currMW == "DESPAIR") {
          HIdata[25][0]++;
        } else if (currMW == "MEH") {
          HIdata[25][1]++;
        } else if (currMW == "JOY") {
          HIdata[25][2]++;
        }
        
        //regular m&ms 26
        if (currMM == "DESPAIR") {
          HIdata[26][0]++;
        } else if (currMM == "MEH") {
          HIdata[26][1]++;
        } else if (currMM == "JOY") {
          HIdata[26][2]++;
        }

        //peanut mms 27
        if (currPM == "DESPAIR") {
          HIdata[27][0]++;
        } else if (currPM == "MEH") {
          HIdata[27][1]++;
        } else if (currPM == "JOY") {
          HIdata[27][2]++;
        }

        //mint kisses 28
        if (currMK == "DESPAIR") {
          HIdata[28][0]++;
        } else if (currMK == "MEH") {
          HIdata[28][1]++;
        } else if (currMK == "JOY") {
          HIdata[28][2]++;
        }

        //mr goodbar 29
        if (currMG == "DESPAIR") {
          HIdata[29][0]++;
        } else if (currMG == "MEH") {
          HIdata[29][1]++;
        } else if (currMG == "JOY") {
          HIdata[29][2]++;
        }

        //nerds 30
        if (currND == "DESPAIR") {
          HIdata[30][0]++;
        } else if (currND == "MEH") {
          HIdata[30][1]++;
        } else if (currND == "JOY") {
          HIdata[30][2]++;
        }

        //nestle crunch 31
        if (currNC == "DESPAIR") {
          HIdata[31][0]++;
        } else if (currNC == "MEH") {
          HIdata[31][1]++;
        } else if (currNC == "JOY") {
          HIdata[31][2]++;
        }

        //peeps 32
        if (currPP == "DESPAIR") {
          HIdata[32][0]++;
        } else if (currPP == "MEH") {
          HIdata[32][1]++;
        } else if (currPP == "JOY") {
          HIdata[32][2]++;
        }

        //pixy stix 33
        if (currPS == "DESPAIR") {
          HIdata[33][0]++;
        } else if (currPS == "MEH") {
          HIdata[33][1]++;
        } else if (currPS == "JOY") {
          HIdata[33][2]++;
        }

        //reeses cups 34
        if (currRC == "DESPAIR") {
          HIdata[34][0]++;
        } else if (currRC == "MEH") {
          HIdata[34][1]++;
        } else if (currRC == "JOY") {
          HIdata[34][2]++;
        }

        //reeses pieces 35
        if (currRP == "DESPAIR") {
          HIdata[35][0]++;
        } else if (currRP == "MEH") {
          HIdata[35][1]++;
        } else if (currRP == "JOY") {
          HIdata[35][2]++;
        }

        //rolos 36
        if (currRL == "DESPAIR") {
          HIdata[36][0]++;
        } else if (currRL == "MEH") {
          HIdata[36][1]++;
        } else if (currRL == "JOY") {
          HIdata[36][2]++;
        }

        //skittles 37
        if (currSK == "DESPAIR") {
          HIdata[37][0]++;
        } else if (currSK == "MEH") {
          HIdata[37][1]++;
        } else if (currSK == "JOY") {
          HIdata[37][2]++;
        }

        //snickers 38
        if (currSN == "DESPAIR") {
          HIdata[38][0]++;
        } else if (currSN == "MEH") {
          HIdata[38][1]++;
        } else if (currSN == "JOY") {
          HIdata[38][2]++;
        }

        //sour patch kids 39
        if (currSP == "DESPAIR") {
          HIdata[39][0]++;
        } else if (currSP == "MEH") {
          HIdata[39][1]++;
        } else if (currSP == "JOY") {
          HIdata[39][2]++;
        }

        //starbursts 40
        if (currST == "DESPAIR") {
          HIdata[40][0]++;
        } else if (currST == "MEH") {
          HIdata[40][1]++;
        } else if (currST == "JOY") {
          HIdata[40][2]++;
        }

        //swedish fish 41
        if (currSF == "DESPAIR") {
          HIdata[41][0]++;
        } else if (currSF == "MEH") {
          HIdata[41][1]++;
        } else if (currSF == "JOY") {
          HIdata[41][2]++;
        }

        //tic tacs 42
        if (currTT == "DESPAIR") {
          HIdata[42][0]++;
        } else if (currTT == "MEH") {
          HIdata[42][1]++;
        } else if (currTT == "JOY") {
          HIdata[42][2]++;
        }

        //three musketeers 43
        if (currTM == "DESPAIR") {
          HIdata[43][0]++;
        } else if (currTM == "MEH") {
          HIdata[43][1]++;
        } else if (currTM == "JOY") {
          HIdata[43][2]++;
        }

        //tolberone 44
        if (currTB == "DESPAIR") {
          HIdata[44][0]++;
        } else if (currTB == "MEH") {
          HIdata[44][1]++;
        } else if (currTB == "JOY") {
          HIdata[44][2]++;
        }

        //trail mix 45
        if (currTM == "DESPAIR") {
          HIdata[45][0]++;
        } else if (currTM == "MEH") {
          HIdata[45][1]++;
        } else if (currTM == "JOY") {
          HIdata[45][2]++;
        }

        //twix 46
        if (currTW == "DESPAIR") {
          HIdata[46][0]++;
        } else if (currTW == "MEH") {
          HIdata[46][1]++;
        } else if (currTW == "JOY") {
          HIdata[46][2]++;
        }

        //whatchamacallit 47
        if (currWM == "DESPAIR") {
          HIdata[47][0]++;
        } else if (currWM == "MEH") {
          HIdata[47][1]++;
        } else if (currWM == "JOY") {
          HIdata[47][2]++;
        }

        //york peppermint patties 48
        if (currYP == "DESPAIR") {
          HIdata[48][0]++;
        } else if (currYP == "MEH") {
          HIdata[48][1]++;
        } else if (currYP == "JOY") {
          HIdata[48][2]++;
        }

        break;
      case "ID" :
          IDdata[0]++;

          if (currOut == "No") {
            IDdata[1][0]++;
          } else if (currOut = "Yes") {
            IDdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            IDdata[2][0]++;
          } else if (currBF == "MEH") {
            IDdata[2][1]++;
          } else if (currBF == "JOY") {
            IDdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            IDdata[3][0]++;
          } else if (currCC == "MEH") {
            IDdata[3][1]++;
          } else if (currCC == "JOY") {
            IDdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            IDdata[4][0]++;
          } else if (currCL == "MEH") {
            IDdata[4][1]++;
          } else if (currCL == "JOY") {
            IDdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            IDdata[5][0]++;
          } else if (currDT == "MEH") {
            IDdata[5][1]++;
          } else if (currDT == "JOY") {
            IDdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            IDdata[6][0]++;
          } else if (currFP == "MEH") {
            IDdata[6][1]++;
          } else if (currFP == "JOY") {
            IDdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            IDdata[7][0]++;
          } else if (currGP == "MEH") {
            IDdata[7][1]++;
          } else if (currGP == "JOY") {
            IDdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            IDdata[8][0]++;
          } else if (currGB == "MEH") {
            IDdata[8][1]++;
          } else if (currGB == "JOY") {
            IDdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            IDdata[9][0]++;
          } else if (currHF == "MEH") {
            IDdata[9][1]++;
          } else if (currHF == "JOY") {
            IDdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            IDdata[10][0]++;
          } else if (currHB == "MEH") {
            IDdata[10][1]++;
          } else if (currHB == "JOY") {
            IDdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            IDdata[11][0]++;
          } else if (currHD == "MEH") {
            IDdata[11][1]++;
          } else if (currHD == "JOY") {
            IDdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            IDdata[12][0]++;
          } else if (currHM == "MEH") {
            IDdata[12][1]++;
          } else if (currHM == "JOY") {
            IDdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            IDdata[13][0]++;
          } else if (currHK == "MEH") {
            IDdata[13][1]++;
          } else if (currHK == "JOY") {
            IDdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            IDdata[14][0]++;
          } else if (currJB == "MEH") {
            IDdata[14][1]++;
          } else if (currJB == "JOY") {
            IDdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            IDdata[15][0]++;
          } else if (currJG == "MEH") {
            IDdata[15][1]++;
          } else if (currJG == "JOY") {
            IDdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            IDdata[16][0]++;
          } else if (currJM == "MEH") {
            IDdata[16][1]++;
          } else if (currJM == "JOY") {
            IDdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            IDdata[17][0]++;
          } else if (currKK == "MEH") {
            IDdata[17][1]++;
          } else if (currKK == "JOY") {
            IDdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            IDdata[18][0]++;
          } else if (currLT == "MEH") {
            IDdata[18][1]++;
          } else if (currLT == "JOY") {
            IDdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            IDdata[19][0]++;
          } else if (currLH == "MEH") {
            IDdata[19][1]++;
          } else if (currLH == "JOY") {
            IDdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            IDdata[20][0]++;
          } else if (currLN == "MEH") {
            IDdata[20][1]++;
          } else if (currLN == "JOY") {
            IDdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            IDdata[21][0]++;
          } else if (currLB == "MEH") {
            IDdata[21][1]++;
          } else if (currLB == "JOY") {
            IDdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            IDdata[22][0]++;
          } else if (currLP == "MEH") {
            IDdata[22][1]++;
          } else if (currLP == "JOY") {
            IDdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            IDdata[23][0]++;
          } else if (currMI == "MEH") {
            IDdata[23][1]++;
          } else if (currMI == "JOY") {
            IDdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            IDdata[24][0]++;
          } else if (currMD == "MEH") {
            IDdata[24][1]++;
          } else if (currMD == "JOY") {
            IDdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            IDdata[25][0]++;
          } else if (currMW == "MEH") {
            IDdata[25][1]++;
          } else if (currMW == "JOY") {
            IDdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            IDdata[26][0]++;
          } else if (currMM == "MEH") {
            IDdata[26][1]++;
          } else if (currMM == "JOY") {
            IDdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            IDdata[27][0]++;
          } else if (currPM == "MEH") {
            IDdata[27][1]++;
          } else if (currPM == "JOY") {
            IDdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            IDdata[28][0]++;
          } else if (currMK == "MEH") {
            IDdata[28][1]++;
          } else if (currMK == "JOY") {
            IDdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            IDdata[29][0]++;
          } else if (currMG == "MEH") {
            IDdata[29][1]++;
          } else if (currMG == "JOY") {
            IDdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            IDdata[30][0]++;
          } else if (currND == "MEH") {
            IDdata[30][1]++;
          } else if (currND == "JOY") {
            IDdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            IDdata[31][0]++;
          } else if (currNC == "MEH") {
            IDdata[31][1]++;
          } else if (currNC == "JOY") {
            IDdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            IDdata[32][0]++;
          } else if (currPP == "MEH") {
            IDdata[32][1]++;
          } else if (currPP == "JOY") {
            IDdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            IDdata[33][0]++;
          } else if (currPS == "MEH") {
            IDdata[33][1]++;
          } else if (currPS == "JOY") {
            IDdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            IDdata[34][0]++;
          } else if (currRC == "MEH") {
            IDdata[34][1]++;
          } else if (currRC == "JOY") {
            IDdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            IDdata[35][0]++;
          } else if (currRP == "MEH") {
            IDdata[35][1]++;
          } else if (currRP == "JOY") {
            IDdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            IDdata[36][0]++;
          } else if (currRL == "MEH") {
            IDdata[36][1]++;
          } else if (currRL == "JOY") {
            IDdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            IDdata[37][0]++;
          } else if (currSK == "MEH") {
            IDdata[37][1]++;
          } else if (currSK == "JOY") {
            IDdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            IDdata[38][0]++;
          } else if (currSN == "MEH") {
            IDdata[38][1]++;
          } else if (currSN == "JOY") {
            IDdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            IDdata[39][0]++;
          } else if (currSP == "MEH") {
            IDdata[39][1]++;
          } else if (currSP == "JOY") {
            IDdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            IDdata[40][0]++;
          } else if (currST == "MEH") {
            IDdata[40][1]++;
          } else if (currST == "JOY") {
            IDdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            IDdata[41][0]++;
          } else if (currSF == "MEH") {
            IDdata[41][1]++;
          } else if (currSF == "JOY") {
            IDdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            IDdata[42][0]++;
          } else if (currTT == "MEH") {
            IDdata[42][1]++;
          } else if (currTT == "JOY") {
            IDdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            IDdata[43][0]++;
          } else if (currTM == "MEH") {
            IDdata[43][1]++;
          } else if (currTM == "JOY") {
            IDdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            IDdata[44][0]++;
          } else if (currTB == "MEH") {
            IDdata[44][1]++;
          } else if (currTB == "JOY") {
            IDdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            IDdata[45][0]++;
          } else if (currTM == "MEH") {
            IDdata[45][1]++;
          } else if (currTM == "JOY") {
            IDdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            IDdata[46][0]++;
          } else if (currTW == "MEH") {
            IDdata[46][1]++;
          } else if (currTW == "JOY") {
            IDdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            IDdata[47][0]++;
          } else if (currWM == "MEH") {
            IDdata[47][1]++;
          } else if (currWM == "JOY") {
            IDdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            IDdata[48][0]++;
          } else if (currYP == "MEH") {
            IDdata[48][1]++;
          } else if (currYP == "JOY") {
            IDdata[48][2]++;
          }
  
        break;
      case "IL" :
          ILdata[0]++;

          if (currOut == "No") {
            ILdata[1][0]++;
          } else if (currOut = "Yes") {
            ILdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            ILdata[2][0]++;
          } else if (currBF == "MEH") {
            ILdata[2][1]++;
          } else if (currBF == "JOY") {
            ILdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            ILdata[3][0]++;
          } else if (currCC == "MEH") {
            ILdata[3][1]++;
          } else if (currCC == "JOY") {
            ILdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            ILdata[4][0]++;
          } else if (currCL == "MEH") {
            ILdata[4][1]++;
          } else if (currCL == "JOY") {
            ILdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            ILdata[5][0]++;
          } else if (currDT == "MEH") {
            ILdata[5][1]++;
          } else if (currDT == "JOY") {
            ILdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            ILdata[6][0]++;
          } else if (currFP == "MEH") {
            ILdata[6][1]++;
          } else if (currFP == "JOY") {
            ILdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            ILdata[7][0]++;
          } else if (currGP == "MEH") {
            ILdata[7][1]++;
          } else if (currGP == "JOY") {
            ILdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            ILdata[8][0]++;
          } else if (currGB == "MEH") {
            ILdata[8][1]++;
          } else if (currGB == "JOY") {
            ILdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            ILdata[9][0]++;
          } else if (currHF == "MEH") {
            ILdata[9][1]++;
          } else if (currHF == "JOY") {
            ILdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            ILdata[10][0]++;
          } else if (currHB == "MEH") {
            ILdata[10][1]++;
          } else if (currHB == "JOY") {
            ILdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            ILdata[11][0]++;
          } else if (currHD == "MEH") {
            ILdata[11][1]++;
          } else if (currHD == "JOY") {
            ILdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            ILdata[12][0]++;
          } else if (currHM == "MEH") {
            ILdata[12][1]++;
          } else if (currHM == "JOY") {
            ILdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            ILdata[13][0]++;
          } else if (currHK == "MEH") {
            ILdata[13][1]++;
          } else if (currHK == "JOY") {
            ILdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            ILdata[14][0]++;
          } else if (currJB == "MEH") {
            ILdata[14][1]++;
          } else if (currJB == "JOY") {
            ILdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            ILdata[15][0]++;
          } else if (currJG == "MEH") {
            ILdata[15][1]++;
          } else if (currJG == "JOY") {
            ILdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            ILdata[16][0]++;
          } else if (currJM == "MEH") {
            ILdata[16][1]++;
          } else if (currJM == "JOY") {
            ILdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            ILdata[17][0]++;
          } else if (currKK == "MEH") {
            ILdata[17][1]++;
          } else if (currKK == "JOY") {
            ILdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            ILdata[18][0]++;
          } else if (currLT == "MEH") {
            ILdata[18][1]++;
          } else if (currLT == "JOY") {
            ILdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            ILdata[19][0]++;
          } else if (currLH == "MEH") {
            ILdata[19][1]++;
          } else if (currLH == "JOY") {
            ILdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            ILdata[20][0]++;
          } else if (currLN == "MEH") {
            ILdata[20][1]++;
          } else if (currLN == "JOY") {
            ILdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            ILdata[21][0]++;
          } else if (currLB == "MEH") {
            ILdata[21][1]++;
          } else if (currLB == "JOY") {
            ILdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            ILdata[22][0]++;
          } else if (currLP == "MEH") {
            ILdata[22][1]++;
          } else if (currLP == "JOY") {
            ILdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            ILdata[23][0]++;
          } else if (currMI == "MEH") {
            ILdata[23][1]++;
          } else if (currMI == "JOY") {
            ILdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            ILdata[24][0]++;
          } else if (currMD == "MEH") {
            ILdata[24][1]++;
          } else if (currMD == "JOY") {
            ILdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            ILdata[25][0]++;
          } else if (currMW == "MEH") {
            ILdata[25][1]++;
          } else if (currMW == "JOY") {
            ILdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            ILdata[26][0]++;
          } else if (currMM == "MEH") {
            ILdata[26][1]++;
          } else if (currMM == "JOY") {
            ILdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            ILdata[27][0]++;
          } else if (currPM == "MEH") {
            ILdata[27][1]++;
          } else if (currPM == "JOY") {
            ILdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            ILdata[28][0]++;
          } else if (currMK == "MEH") {
            ILdata[28][1]++;
          } else if (currMK == "JOY") {
            ILdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            ILdata[29][0]++;
          } else if (currMG == "MEH") {
            ILdata[29][1]++;
          } else if (currMG == "JOY") {
            ILdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            ILdata[30][0]++;
          } else if (currND == "MEH") {
            ILdata[30][1]++;
          } else if (currND == "JOY") {
            ILdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            ILdata[31][0]++;
          } else if (currNC == "MEH") {
            ILdata[31][1]++;
          } else if (currNC == "JOY") {
            ILdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            ILdata[32][0]++;
          } else if (currPP == "MEH") {
            ILdata[32][1]++;
          } else if (currPP == "JOY") {
            ILdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            ILdata[33][0]++;
          } else if (currPS == "MEH") {
            ILdata[33][1]++;
          } else if (currPS == "JOY") {
            ILdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            ILdata[34][0]++;
          } else if (currRC == "MEH") {
            ILdata[34][1]++;
          } else if (currRC == "JOY") {
            ILdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            ILdata[35][0]++;
          } else if (currRP == "MEH") {
            ILdata[35][1]++;
          } else if (currRP == "JOY") {
            ILdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            ILdata[36][0]++;
          } else if (currRL == "MEH") {
            ILdata[36][1]++;
          } else if (currRL == "JOY") {
            ILdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            ILdata[37][0]++;
          } else if (currSK == "MEH") {
            ILdata[37][1]++;
          } else if (currSK == "JOY") {
            ILdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            ILdata[38][0]++;
          } else if (currSN == "MEH") {
            ILdata[38][1]++;
          } else if (currSN == "JOY") {
            ILdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            ILdata[39][0]++;
          } else if (currSP == "MEH") {
            ILdata[39][1]++;
          } else if (currSP == "JOY") {
            ILdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            ILdata[40][0]++;
          } else if (currST == "MEH") {
            ILdata[40][1]++;
          } else if (currST == "JOY") {
            ILdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            ILdata[41][0]++;
          } else if (currSF == "MEH") {
            ILdata[41][1]++;
          } else if (currSF == "JOY") {
            ILdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            ILdata[42][0]++;
          } else if (currTT == "MEH") {
            ILdata[42][1]++;
          } else if (currTT == "JOY") {
            ILdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            ILdata[43][0]++;
          } else if (currTM == "MEH") {
            ILdata[43][1]++;
          } else if (currTM == "JOY") {
            ILdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            ILdata[44][0]++;
          } else if (currTB == "MEH") {
            ILdata[44][1]++;
          } else if (currTB == "JOY") {
            ILdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            ILdata[45][0]++;
          } else if (currTM == "MEH") {
            ILdata[45][1]++;
          } else if (currTM == "JOY") {
            ILdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            ILdata[46][0]++;
          } else if (currTW == "MEH") {
            ILdata[46][1]++;
          } else if (currTW == "JOY") {
            ILdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            ILdata[47][0]++;
          } else if (currWM == "MEH") {
            ILdata[47][1]++;
          } else if (currWM == "JOY") {
            ILdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            ILdata[48][0]++;
          } else if (currYP == "MEH") {
            ILdata[48][1]++;
          } else if (currYP == "JOY") {
            ILdata[48][2]++;
          }
  
        break;
      case "IN" :
          INdata[0]++;

          if (currOut == "No") {
            INdata[1][0]++;
          } else if (currOut = "Yes") {
            INdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            INdata[2][0]++;
          } else if (currBF == "MEH") {
            INdata[2][1]++;
          } else if (currBF == "JOY") {
            INdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            INdata[3][0]++;
          } else if (currCC == "MEH") {
            INdata[3][1]++;
          } else if (currCC == "JOY") {
            INdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            INdata[4][0]++;
          } else if (currCL == "MEH") {
            INdata[4][1]++;
          } else if (currCL == "JOY") {
            INdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            INdata[5][0]++;
          } else if (currDT == "MEH") {
            INdata[5][1]++;
          } else if (currDT == "JOY") {
            INdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            INdata[6][0]++;
          } else if (currFP == "MEH") {
            INdata[6][1]++;
          } else if (currFP == "JOY") {
            INdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            INdata[7][0]++;
          } else if (currGP == "MEH") {
            INdata[7][1]++;
          } else if (currGP == "JOY") {
            INdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            INdata[8][0]++;
          } else if (currGB == "MEH") {
            INdata[8][1]++;
          } else if (currGB == "JOY") {
            INdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            INdata[9][0]++;
          } else if (currHF == "MEH") {
            INdata[9][1]++;
          } else if (currHF == "JOY") {
            INdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            INdata[10][0]++;
          } else if (currHB == "MEH") {
            INdata[10][1]++;
          } else if (currHB == "JOY") {
            INdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            INdata[11][0]++;
          } else if (currHD == "MEH") {
            INdata[11][1]++;
          } else if (currHD == "JOY") {
            INdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            INdata[12][0]++;
          } else if (currHM == "MEH") {
            INdata[12][1]++;
          } else if (currHM == "JOY") {
            INdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            INdata[13][0]++;
          } else if (currHK == "MEH") {
            INdata[13][1]++;
          } else if (currHK == "JOY") {
            INdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            INdata[14][0]++;
          } else if (currJB == "MEH") {
            INdata[14][1]++;
          } else if (currJB == "JOY") {
            INdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            INdata[15][0]++;
          } else if (currJG == "MEH") {
            INdata[15][1]++;
          } else if (currJG == "JOY") {
            INdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            INdata[16][0]++;
          } else if (currJM == "MEH") {
            INdata[16][1]++;
          } else if (currJM == "JOY") {
            INdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            INdata[17][0]++;
          } else if (currKK == "MEH") {
            INdata[17][1]++;
          } else if (currKK == "JOY") {
            INdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            INdata[18][0]++;
          } else if (currLT == "MEH") {
            INdata[18][1]++;
          } else if (currLT == "JOY") {
            INdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            INdata[19][0]++;
          } else if (currLH == "MEH") {
            INdata[19][1]++;
          } else if (currLH == "JOY") {
            INdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            INdata[20][0]++;
          } else if (currLN == "MEH") {
            INdata[20][1]++;
          } else if (currLN == "JOY") {
            INdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            INdata[21][0]++;
          } else if (currLB == "MEH") {
            INdata[21][1]++;
          } else if (currLB == "JOY") {
            INdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            INdata[22][0]++;
          } else if (currLP == "MEH") {
            INdata[22][1]++;
          } else if (currLP == "JOY") {
            INdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            INdata[23][0]++;
          } else if (currMI == "MEH") {
            INdata[23][1]++;
          } else if (currMI == "JOY") {
            INdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            INdata[24][0]++;
          } else if (currMD == "MEH") {
            INdata[24][1]++;
          } else if (currMD == "JOY") {
            INdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            INdata[25][0]++;
          } else if (currMW == "MEH") {
            INdata[25][1]++;
          } else if (currMW == "JOY") {
            INdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            INdata[26][0]++;
          } else if (currMM == "MEH") {
            INdata[26][1]++;
          } else if (currMM == "JOY") {
            INdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            INdata[27][0]++;
          } else if (currPM == "MEH") {
            INdata[27][1]++;
          } else if (currPM == "JOY") {
            INdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            INdata[28][0]++;
          } else if (currMK == "MEH") {
            INdata[28][1]++;
          } else if (currMK == "JOY") {
            INdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            INdata[29][0]++;
          } else if (currMG == "MEH") {
            INdata[29][1]++;
          } else if (currMG == "JOY") {
            INdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            INdata[30][0]++;
          } else if (currND == "MEH") {
            INdata[30][1]++;
          } else if (currND == "JOY") {
            INdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            INdata[31][0]++;
          } else if (currNC == "MEH") {
            INdata[31][1]++;
          } else if (currNC == "JOY") {
            INdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            INdata[32][0]++;
          } else if (currPP == "MEH") {
            INdata[32][1]++;
          } else if (currPP == "JOY") {
            INdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            INdata[33][0]++;
          } else if (currPS == "MEH") {
            INdata[33][1]++;
          } else if (currPS == "JOY") {
            INdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            INdata[34][0]++;
          } else if (currRC == "MEH") {
            INdata[34][1]++;
          } else if (currRC == "JOY") {
            INdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            INdata[35][0]++;
          } else if (currRP == "MEH") {
            INdata[35][1]++;
          } else if (currRP == "JOY") {
            INdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            INdata[36][0]++;
          } else if (currRL == "MEH") {
            INdata[36][1]++;
          } else if (currRL == "JOY") {
            INdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            INdata[37][0]++;
          } else if (currSK == "MEH") {
            INdata[37][1]++;
          } else if (currSK == "JOY") {
            INdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            INdata[38][0]++;
          } else if (currSN == "MEH") {
            INdata[38][1]++;
          } else if (currSN == "JOY") {
            INdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            INdata[39][0]++;
          } else if (currSP == "MEH") {
            INdata[39][1]++;
          } else if (currSP == "JOY") {
            INdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            INdata[40][0]++;
          } else if (currST == "MEH") {
            INdata[40][1]++;
          } else if (currST == "JOY") {
            INdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            INdata[41][0]++;
          } else if (currSF == "MEH") {
            INdata[41][1]++;
          } else if (currSF == "JOY") {
            INdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            INdata[42][0]++;
          } else if (currTT == "MEH") {
            INdata[42][1]++;
          } else if (currTT == "JOY") {
            INdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            INdata[43][0]++;
          } else if (currTM == "MEH") {
            INdata[43][1]++;
          } else if (currTM == "JOY") {
            INdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            INdata[44][0]++;
          } else if (currTB == "MEH") {
            INdata[44][1]++;
          } else if (currTB == "JOY") {
            INdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            INdata[45][0]++;
          } else if (currTM == "MEH") {
            INdata[45][1]++;
          } else if (currTM == "JOY") {
            INdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            INdata[46][0]++;
          } else if (currTW == "MEH") {
            INdata[46][1]++;
          } else if (currTW == "JOY") {
            INdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            INdata[47][0]++;
          } else if (currWM == "MEH") {
            INdata[47][1]++;
          } else if (currWM == "JOY") {
            INdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            INdata[48][0]++;
          } else if (currYP == "MEH") {
            INdata[48][1]++;
          } else if (currYP == "JOY") {
            INdata[48][2]++;
          }
  
        break;
      case "IA" :
          IAdata[0]++;

          if (currOut == "No") {
            IAdata[1][0]++;
          } else if (currOut = "Yes") {
            IAdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            IAdata[2][0]++;
          } else if (currBF == "MEH") {
            IAdata[2][1]++;
          } else if (currBF == "JOY") {
            IAdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            IAdata[3][0]++;
          } else if (currCC == "MEH") {
            IAdata[3][1]++;
          } else if (currCC == "JOY") {
            IAdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            IAdata[4][0]++;
          } else if (currCL == "MEH") {
            IAdata[4][1]++;
          } else if (currCL == "JOY") {
            IAdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            IAdata[5][0]++;
          } else if (currDT == "MEH") {
            IAdata[5][1]++;
          } else if (currDT == "JOY") {
            IAdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            IAdata[6][0]++;
          } else if (currFP == "MEH") {
            IAdata[6][1]++;
          } else if (currFP == "JOY") {
            IAdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            IAdata[7][0]++;
          } else if (currGP == "MEH") {
            IAdata[7][1]++;
          } else if (currGP == "JOY") {
            IAdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            IAdata[8][0]++;
          } else if (currGB == "MEH") {
            IAdata[8][1]++;
          } else if (currGB == "JOY") {
            IAdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            IAdata[9][0]++;
          } else if (currHF == "MEH") {
            IAdata[9][1]++;
          } else if (currHF == "JOY") {
            IAdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            IAdata[10][0]++;
          } else if (currHB == "MEH") {
            IAdata[10][1]++;
          } else if (currHB == "JOY") {
            IAdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            IAdata[11][0]++;
          } else if (currHD == "MEH") {
            IAdata[11][1]++;
          } else if (currHD == "JOY") {
            IAdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            IAdata[12][0]++;
          } else if (currHM == "MEH") {
            IAdata[12][1]++;
          } else if (currHM == "JOY") {
            IAdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            IAdata[13][0]++;
          } else if (currHK == "MEH") {
            IAdata[13][1]++;
          } else if (currHK == "JOY") {
            IAdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            IAdata[14][0]++;
          } else if (currJB == "MEH") {
            IAdata[14][1]++;
          } else if (currJB == "JOY") {
            IAdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            IAdata[15][0]++;
          } else if (currJG == "MEH") {
            IAdata[15][1]++;
          } else if (currJG == "JOY") {
            IAdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            IAdata[16][0]++;
          } else if (currJM == "MEH") {
            IAdata[16][1]++;
          } else if (currJM == "JOY") {
            IAdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            IAdata[17][0]++;
          } else if (currKK == "MEH") {
            IAdata[17][1]++;
          } else if (currKK == "JOY") {
            IAdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            IAdata[18][0]++;
          } else if (currLT == "MEH") {
            IAdata[18][1]++;
          } else if (currLT == "JOY") {
            IAdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            IAdata[19][0]++;
          } else if (currLH == "MEH") {
            IAdata[19][1]++;
          } else if (currLH == "JOY") {
            IAdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            IAdata[20][0]++;
          } else if (currLN == "MEH") {
            IAdata[20][1]++;
          } else if (currLN == "JOY") {
            IAdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            IAdata[21][0]++;
          } else if (currLB == "MEH") {
            IAdata[21][1]++;
          } else if (currLB == "JOY") {
            IAdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            IAdata[22][0]++;
          } else if (currLP == "MEH") {
            IAdata[22][1]++;
          } else if (currLP == "JOY") {
            IAdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            IAdata[23][0]++;
          } else if (currMI == "MEH") {
            IAdata[23][1]++;
          } else if (currMI == "JOY") {
            IAdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            IAdata[24][0]++;
          } else if (currMD == "MEH") {
            IAdata[24][1]++;
          } else if (currMD == "JOY") {
            IAdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            IAdata[25][0]++;
          } else if (currMW == "MEH") {
            IAdata[25][1]++;
          } else if (currMW == "JOY") {
            IAdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            IAdata[26][0]++;
          } else if (currMM == "MEH") {
            IAdata[26][1]++;
          } else if (currMM == "JOY") {
            IAdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            IAdata[27][0]++;
          } else if (currPM == "MEH") {
            IAdata[27][1]++;
          } else if (currPM == "JOY") {
            IAdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            IAdata[28][0]++;
          } else if (currMK == "MEH") {
            IAdata[28][1]++;
          } else if (currMK == "JOY") {
            IAdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            IAdata[29][0]++;
          } else if (currMG == "MEH") {
            IAdata[29][1]++;
          } else if (currMG == "JOY") {
            IAdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            IAdata[30][0]++;
          } else if (currND == "MEH") {
            IAdata[30][1]++;
          } else if (currND == "JOY") {
            IAdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            IAdata[31][0]++;
          } else if (currNC == "MEH") {
            IAdata[31][1]++;
          } else if (currNC == "JOY") {
            IAdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            IAdata[32][0]++;
          } else if (currPP == "MEH") {
            IAdata[32][1]++;
          } else if (currPP == "JOY") {
            IAdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            IAdata[33][0]++;
          } else if (currPS == "MEH") {
            IAdata[33][1]++;
          } else if (currPS == "JOY") {
            IAdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            IAdata[34][0]++;
          } else if (currRC == "MEH") {
            IAdata[34][1]++;
          } else if (currRC == "JOY") {
            IAdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            IAdata[35][0]++;
          } else if (currRP == "MEH") {
            IAdata[35][1]++;
          } else if (currRP == "JOY") {
            IAdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            IAdata[36][0]++;
          } else if (currRL == "MEH") {
            IAdata[36][1]++;
          } else if (currRL == "JOY") {
            IAdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            IAdata[37][0]++;
          } else if (currSK == "MEH") {
            IAdata[37][1]++;
          } else if (currSK == "JOY") {
            IAdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            IAdata[38][0]++;
          } else if (currSN == "MEH") {
            IAdata[38][1]++;
          } else if (currSN == "JOY") {
            IAdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            IAdata[39][0]++;
          } else if (currSP == "MEH") {
            IAdata[39][1]++;
          } else if (currSP == "JOY") {
            IAdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            IAdata[40][0]++;
          } else if (currST == "MEH") {
            IAdata[40][1]++;
          } else if (currST == "JOY") {
            IAdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            IAdata[41][0]++;
          } else if (currSF == "MEH") {
            IAdata[41][1]++;
          } else if (currSF == "JOY") {
            IAdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            IAdata[42][0]++;
          } else if (currTT == "MEH") {
            IAdata[42][1]++;
          } else if (currTT == "JOY") {
            IAdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            IAdata[43][0]++;
          } else if (currTM == "MEH") {
            IAdata[43][1]++;
          } else if (currTM == "JOY") {
            IAdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            IAdata[44][0]++;
          } else if (currTB == "MEH") {
            IAdata[44][1]++;
          } else if (currTB == "JOY") {
            IAdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            IAdata[45][0]++;
          } else if (currTM == "MEH") {
            IAdata[45][1]++;
          } else if (currTM == "JOY") {
            IAdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            IAdata[46][0]++;
          } else if (currTW == "MEH") {
            IAdata[46][1]++;
          } else if (currTW == "JOY") {
            IAdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            IAdata[47][0]++;
          } else if (currWM == "MEH") {
            IAdata[47][1]++;
          } else if (currWM == "JOY") {
            IAdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            IAdata[48][0]++;
          } else if (currYP == "MEH") {
            IAdata[48][1]++;
          } else if (currYP == "JOY") {
            IAdata[48][2]++;
          }
  
        break;
      case "KS" :
          KSdata[0]++;

          if (currOut == "No") {
            KSdata[1][0]++;
          } else if (currOut = "Yes") {
            KSdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            KSdata[2][0]++;
          } else if (currBF == "MEH") {
            KSdata[2][1]++;
          } else if (currBF == "JOY") {
            KSdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            KSdata[3][0]++;
          } else if (currCC == "MEH") {
            KSdata[3][1]++;
          } else if (currCC == "JOY") {
            KSdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            KSdata[4][0]++;
          } else if (currCL == "MEH") {
            KSdata[4][1]++;
          } else if (currCL == "JOY") {
            KSdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            KSdata[5][0]++;
          } else if (currDT == "MEH") {
            KSdata[5][1]++;
          } else if (currDT == "JOY") {
            KSdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            KSdata[6][0]++;
          } else if (currFP == "MEH") {
            KSdata[6][1]++;
          } else if (currFP == "JOY") {
            KSdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            KSdata[7][0]++;
          } else if (currGP == "MEH") {
            KSdata[7][1]++;
          } else if (currGP == "JOY") {
            KSdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            KSdata[8][0]++;
          } else if (currGB == "MEH") {
            KSdata[8][1]++;
          } else if (currGB == "JOY") {
            KSdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            KSdata[9][0]++;
          } else if (currHF == "MEH") {
            KSdata[9][1]++;
          } else if (currHF == "JOY") {
            KSdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            KSdata[10][0]++;
          } else if (currHB == "MEH") {
            KSdata[10][1]++;
          } else if (currHB == "JOY") {
            KSdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            KSdata[11][0]++;
          } else if (currHD == "MEH") {
            KSdata[11][1]++;
          } else if (currHD == "JOY") {
            KSdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            KSdata[12][0]++;
          } else if (currHM == "MEH") {
            KSdata[12][1]++;
          } else if (currHM == "JOY") {
            KSdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            KSdata[13][0]++;
          } else if (currHK == "MEH") {
            KSdata[13][1]++;
          } else if (currHK == "JOY") {
            KSdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            KSdata[14][0]++;
          } else if (currJB == "MEH") {
            KSdata[14][1]++;
          } else if (currJB == "JOY") {
            KSdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            KSdata[15][0]++;
          } else if (currJG == "MEH") {
            KSdata[15][1]++;
          } else if (currJG == "JOY") {
            KSdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            KSdata[16][0]++;
          } else if (currJM == "MEH") {
            KSdata[16][1]++;
          } else if (currJM == "JOY") {
            KSdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            KSdata[17][0]++;
          } else if (currKK == "MEH") {
            KSdata[17][1]++;
          } else if (currKK == "JOY") {
            KSdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            KSdata[18][0]++;
          } else if (currLT == "MEH") {
            KSdata[18][1]++;
          } else if (currLT == "JOY") {
            KSdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            KSdata[19][0]++;
          } else if (currLH == "MEH") {
            KSdata[19][1]++;
          } else if (currLH == "JOY") {
            KSdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            KSdata[20][0]++;
          } else if (currLN == "MEH") {
            KSdata[20][1]++;
          } else if (currLN == "JOY") {
            KSdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            KSdata[21][0]++;
          } else if (currLB == "MEH") {
            KSdata[21][1]++;
          } else if (currLB == "JOY") {
            KSdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            KSdata[22][0]++;
          } else if (currLP == "MEH") {
            KSdata[22][1]++;
          } else if (currLP == "JOY") {
            KSdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            KSdata[23][0]++;
          } else if (currMI == "MEH") {
            KSdata[23][1]++;
          } else if (currMI == "JOY") {
            KSdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            KSdata[24][0]++;
          } else if (currMD == "MEH") {
            KSdata[24][1]++;
          } else if (currMD == "JOY") {
            KSdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            KSdata[25][0]++;
          } else if (currMW == "MEH") {
            KSdata[25][1]++;
          } else if (currMW == "JOY") {
            KSdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            KSdata[26][0]++;
          } else if (currMM == "MEH") {
            KSdata[26][1]++;
          } else if (currMM == "JOY") {
            KSdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            KSdata[27][0]++;
          } else if (currPM == "MEH") {
            KSdata[27][1]++;
          } else if (currPM == "JOY") {
            KSdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            KSdata[28][0]++;
          } else if (currMK == "MEH") {
            KSdata[28][1]++;
          } else if (currMK == "JOY") {
            KSdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            KSdata[29][0]++;
          } else if (currMG == "MEH") {
            KSdata[29][1]++;
          } else if (currMG == "JOY") {
            KSdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            KSdata[30][0]++;
          } else if (currND == "MEH") {
            KSdata[30][1]++;
          } else if (currND == "JOY") {
            KSdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            KSdata[31][0]++;
          } else if (currNC == "MEH") {
            KSdata[31][1]++;
          } else if (currNC == "JOY") {
            KSdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            KSdata[32][0]++;
          } else if (currPP == "MEH") {
            KSdata[32][1]++;
          } else if (currPP == "JOY") {
            KSdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            KSdata[33][0]++;
          } else if (currPS == "MEH") {
            KSdata[33][1]++;
          } else if (currPS == "JOY") {
            KSdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            KSdata[34][0]++;
          } else if (currRC == "MEH") {
            KSdata[34][1]++;
          } else if (currRC == "JOY") {
            KSdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            KSdata[35][0]++;
          } else if (currRP == "MEH") {
            KSdata[35][1]++;
          } else if (currRP == "JOY") {
            KSdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            KSdata[36][0]++;
          } else if (currRL == "MEH") {
            KSdata[36][1]++;
          } else if (currRL == "JOY") {
            KSdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            KSdata[37][0]++;
          } else if (currSK == "MEH") {
            KSdata[37][1]++;
          } else if (currSK == "JOY") {
            KSdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            KSdata[38][0]++;
          } else if (currSN == "MEH") {
            KSdata[38][1]++;
          } else if (currSN == "JOY") {
            KSdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            KSdata[39][0]++;
          } else if (currSP == "MEH") {
            KSdata[39][1]++;
          } else if (currSP == "JOY") {
            KSdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            KSdata[40][0]++;
          } else if (currST == "MEH") {
            KSdata[40][1]++;
          } else if (currST == "JOY") {
            KSdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            KSdata[41][0]++;
          } else if (currSF == "MEH") {
            KSdata[41][1]++;
          } else if (currSF == "JOY") {
            KSdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            KSdata[42][0]++;
          } else if (currTT == "MEH") {
            KSdata[42][1]++;
          } else if (currTT == "JOY") {
            KSdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            KSdata[43][0]++;
          } else if (currTM == "MEH") {
            KSdata[43][1]++;
          } else if (currTM == "JOY") {
            KSdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            KSdata[44][0]++;
          } else if (currTB == "MEH") {
            KSdata[44][1]++;
          } else if (currTB == "JOY") {
            KSdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            KSdata[45][0]++;
          } else if (currTM == "MEH") {
            KSdata[45][1]++;
          } else if (currTM == "JOY") {
            KSdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            KSdata[46][0]++;
          } else if (currTW == "MEH") {
            KSdata[46][1]++;
          } else if (currTW == "JOY") {
            KSdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            KSdata[47][0]++;
          } else if (currWM == "MEH") {
            KSdata[47][1]++;
          } else if (currWM == "JOY") {
            KSdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            KSdata[48][0]++;
          } else if (currYP == "MEH") {
            KSdata[48][1]++;
          } else if (currYP == "JOY") {
            KSdata[48][2]++;
          }
  
        break;
      case "KY" :
          KYdata[0]++;

          if (currOut == "No") {
            KYdata[1][0]++;
          } else if (currOut = "Yes") {
            KYdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            KYdata[2][0]++;
          } else if (currBF == "MEH") {
            KYdata[2][1]++;
          } else if (currBF == "JOY") {
            KYdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            KYdata[3][0]++;
          } else if (currCC == "MEH") {
            KYdata[3][1]++;
          } else if (currCC == "JOY") {
            KYdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            KYdata[4][0]++;
          } else if (currCL == "MEH") {
            KYdata[4][1]++;
          } else if (currCL == "JOY") {
            KYdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            KYdata[5][0]++;
          } else if (currDT == "MEH") {
            KYdata[5][1]++;
          } else if (currDT == "JOY") {
            KYdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            KYdata[6][0]++;
          } else if (currFP == "MEH") {
            KYdata[6][1]++;
          } else if (currFP == "JOY") {
            KYdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            KYdata[7][0]++;
          } else if (currGP == "MEH") {
            KYdata[7][1]++;
          } else if (currGP == "JOY") {
            KYdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            KYdata[8][0]++;
          } else if (currGB == "MEH") {
            KYdata[8][1]++;
          } else if (currGB == "JOY") {
            KYdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            KYdata[9][0]++;
          } else if (currHF == "MEH") {
            KYdata[9][1]++;
          } else if (currHF == "JOY") {
            KYdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            KYdata[10][0]++;
          } else if (currHB == "MEH") {
            KYdata[10][1]++;
          } else if (currHB == "JOY") {
            KYdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            KYdata[11][0]++;
          } else if (currHD == "MEH") {
            KYdata[11][1]++;
          } else if (currHD == "JOY") {
            KYdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            KYdata[12][0]++;
          } else if (currHM == "MEH") {
            KYdata[12][1]++;
          } else if (currHM == "JOY") {
            KYdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            KYdata[13][0]++;
          } else if (currHK == "MEH") {
            KYdata[13][1]++;
          } else if (currHK == "JOY") {
            KYdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            KYdata[14][0]++;
          } else if (currJB == "MEH") {
            KYdata[14][1]++;
          } else if (currJB == "JOY") {
            KYdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            KYdata[15][0]++;
          } else if (currJG == "MEH") {
            KYdata[15][1]++;
          } else if (currJG == "JOY") {
            KYdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            KYdata[16][0]++;
          } else if (currJM == "MEH") {
            KYdata[16][1]++;
          } else if (currJM == "JOY") {
            KYdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            KYdata[17][0]++;
          } else if (currKK == "MEH") {
            KYdata[17][1]++;
          } else if (currKK == "JOY") {
            KYdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            KYdata[18][0]++;
          } else if (currLT == "MEH") {
            KYdata[18][1]++;
          } else if (currLT == "JOY") {
            KYdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            KYdata[19][0]++;
          } else if (currLH == "MEH") {
            KYdata[19][1]++;
          } else if (currLH == "JOY") {
            KYdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            KYdata[20][0]++;
          } else if (currLN == "MEH") {
            KYdata[20][1]++;
          } else if (currLN == "JOY") {
            KYdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            KYdata[21][0]++;
          } else if (currLB == "MEH") {
            KYdata[21][1]++;
          } else if (currLB == "JOY") {
            KYdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            KYdata[22][0]++;
          } else if (currLP == "MEH") {
            KYdata[22][1]++;
          } else if (currLP == "JOY") {
            KYdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            KYdata[23][0]++;
          } else if (currMI == "MEH") {
            KYdata[23][1]++;
          } else if (currMI == "JOY") {
            KYdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            KYdata[24][0]++;
          } else if (currMD == "MEH") {
            KYdata[24][1]++;
          } else if (currMD == "JOY") {
            KYdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            KYdata[25][0]++;
          } else if (currMW == "MEH") {
            KYdata[25][1]++;
          } else if (currMW == "JOY") {
            KYdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            KYdata[26][0]++;
          } else if (currMM == "MEH") {
            KYdata[26][1]++;
          } else if (currMM == "JOY") {
            KYdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            KYdata[27][0]++;
          } else if (currPM == "MEH") {
            KYdata[27][1]++;
          } else if (currPM == "JOY") {
            KYdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            KYdata[28][0]++;
          } else if (currMK == "MEH") {
            KYdata[28][1]++;
          } else if (currMK == "JOY") {
            KYdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            KYdata[29][0]++;
          } else if (currMG == "MEH") {
            KYdata[29][1]++;
          } else if (currMG == "JOY") {
            KYdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            KYdata[30][0]++;
          } else if (currND == "MEH") {
            KYdata[30][1]++;
          } else if (currND == "JOY") {
            KYdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            KYdata[31][0]++;
          } else if (currNC == "MEH") {
            KYdata[31][1]++;
          } else if (currNC == "JOY") {
            KYdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            KYdata[32][0]++;
          } else if (currPP == "MEH") {
            KYdata[32][1]++;
          } else if (currPP == "JOY") {
            KYdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            KYdata[33][0]++;
          } else if (currPS == "MEH") {
            KYdata[33][1]++;
          } else if (currPS == "JOY") {
            KYdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            KYdata[34][0]++;
          } else if (currRC == "MEH") {
            KYdata[34][1]++;
          } else if (currRC == "JOY") {
            KYdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            KYdata[35][0]++;
          } else if (currRP == "MEH") {
            KYdata[35][1]++;
          } else if (currRP == "JOY") {
            KYdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            KYdata[36][0]++;
          } else if (currRL == "MEH") {
            KYdata[36][1]++;
          } else if (currRL == "JOY") {
            KYdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            KYdata[37][0]++;
          } else if (currSK == "MEH") {
            KYdata[37][1]++;
          } else if (currSK == "JOY") {
            KYdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            KYdata[38][0]++;
          } else if (currSN == "MEH") {
            KYdata[38][1]++;
          } else if (currSN == "JOY") {
            KYdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            KYdata[39][0]++;
          } else if (currSP == "MEH") {
            KYdata[39][1]++;
          } else if (currSP == "JOY") {
            KYdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            KYdata[40][0]++;
          } else if (currST == "MEH") {
            KYdata[40][1]++;
          } else if (currST == "JOY") {
            KYdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            KYdata[41][0]++;
          } else if (currSF == "MEH") {
            KYdata[41][1]++;
          } else if (currSF == "JOY") {
            KYdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            KYdata[42][0]++;
          } else if (currTT == "MEH") {
            KYdata[42][1]++;
          } else if (currTT == "JOY") {
            KYdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            KYdata[43][0]++;
          } else if (currTM == "MEH") {
            KYdata[43][1]++;
          } else if (currTM == "JOY") {
            KYdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            KYdata[44][0]++;
          } else if (currTB == "MEH") {
            KYdata[44][1]++;
          } else if (currTB == "JOY") {
            KYdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            KYdata[45][0]++;
          } else if (currTM == "MEH") {
            KYdata[45][1]++;
          } else if (currTM == "JOY") {
            KYdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            KYdata[46][0]++;
          } else if (currTW == "MEH") {
            KYdata[46][1]++;
          } else if (currTW == "JOY") {
            KYdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            KYdata[47][0]++;
          } else if (currWM == "MEH") {
            KYdata[47][1]++;
          } else if (currWM == "JOY") {
            KYdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            KYdata[48][0]++;
          } else if (currYP == "MEH") {
            KYdata[48][1]++;
          } else if (currYP == "JOY") {
            KYdata[48][2]++;
          }
  
        break;
      case "LA" :
          LAdata[0]++;

          if (currOut == "No") {
            LAdata[1][0]++;
          } else if (currOut = "Yes") {
            LAdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            LAdata[2][0]++;
          } else if (currBF == "MEH") {
            LAdata[2][1]++;
          } else if (currBF == "JOY") {
            LAdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            LAdata[3][0]++;
          } else if (currCC == "MEH") {
            LAdata[3][1]++;
          } else if (currCC == "JOY") {
            LAdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            LAdata[4][0]++;
          } else if (currCL == "MEH") {
            LAdata[4][1]++;
          } else if (currCL == "JOY") {
            LAdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            LAdata[5][0]++;
          } else if (currDT == "MEH") {
            LAdata[5][1]++;
          } else if (currDT == "JOY") {
            LAdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            LAdata[6][0]++;
          } else if (currFP == "MEH") {
            LAdata[6][1]++;
          } else if (currFP == "JOY") {
            LAdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            LAdata[7][0]++;
          } else if (currGP == "MEH") {
            LAdata[7][1]++;
          } else if (currGP == "JOY") {
            LAdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            LAdata[8][0]++;
          } else if (currGB == "MEH") {
            LAdata[8][1]++;
          } else if (currGB == "JOY") {
            LAdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            LAdata[9][0]++;
          } else if (currHF == "MEH") {
            LAdata[9][1]++;
          } else if (currHF == "JOY") {
            LAdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            LAdata[10][0]++;
          } else if (currHB == "MEH") {
            LAdata[10][1]++;
          } else if (currHB == "JOY") {
            LAdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            LAdata[11][0]++;
          } else if (currHD == "MEH") {
            LAdata[11][1]++;
          } else if (currHD == "JOY") {
            LAdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            LAdata[12][0]++;
          } else if (currHM == "MEH") {
            LAdata[12][1]++;
          } else if (currHM == "JOY") {
            LAdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            LAdata[13][0]++;
          } else if (currHK == "MEH") {
            LAdata[13][1]++;
          } else if (currHK == "JOY") {
            LAdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            LAdata[14][0]++;
          } else if (currJB == "MEH") {
            LAdata[14][1]++;
          } else if (currJB == "JOY") {
            LAdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            LAdata[15][0]++;
          } else if (currJG == "MEH") {
            LAdata[15][1]++;
          } else if (currJG == "JOY") {
            LAdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            LAdata[16][0]++;
          } else if (currJM == "MEH") {
            LAdata[16][1]++;
          } else if (currJM == "JOY") {
            LAdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            LAdata[17][0]++;
          } else if (currKK == "MEH") {
            LAdata[17][1]++;
          } else if (currKK == "JOY") {
            LAdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            LAdata[18][0]++;
          } else if (currLT == "MEH") {
            LAdata[18][1]++;
          } else if (currLT == "JOY") {
            LAdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            LAdata[19][0]++;
          } else if (currLH == "MEH") {
            LAdata[19][1]++;
          } else if (currLH == "JOY") {
            LAdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            LAdata[20][0]++;
          } else if (currLN == "MEH") {
            LAdata[20][1]++;
          } else if (currLN == "JOY") {
            LAdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            LAdata[21][0]++;
          } else if (currLB == "MEH") {
            LAdata[21][1]++;
          } else if (currLB == "JOY") {
            LAdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            LAdata[22][0]++;
          } else if (currLP == "MEH") {
            LAdata[22][1]++;
          } else if (currLP == "JOY") {
            LAdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            LAdata[23][0]++;
          } else if (currMI == "MEH") {
            LAdata[23][1]++;
          } else if (currMI == "JOY") {
            LAdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            LAdata[24][0]++;
          } else if (currMD == "MEH") {
            LAdata[24][1]++;
          } else if (currMD == "JOY") {
            LAdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            LAdata[25][0]++;
          } else if (currMW == "MEH") {
            LAdata[25][1]++;
          } else if (currMW == "JOY") {
            LAdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            LAdata[26][0]++;
          } else if (currMM == "MEH") {
            LAdata[26][1]++;
          } else if (currMM == "JOY") {
            LAdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            LAdata[27][0]++;
          } else if (currPM == "MEH") {
            LAdata[27][1]++;
          } else if (currPM == "JOY") {
            LAdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            LAdata[28][0]++;
          } else if (currMK == "MEH") {
            LAdata[28][1]++;
          } else if (currMK == "JOY") {
            LAdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            LAdata[29][0]++;
          } else if (currMG == "MEH") {
            LAdata[29][1]++;
          } else if (currMG == "JOY") {
            LAdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            LAdata[30][0]++;
          } else if (currND == "MEH") {
            LAdata[30][1]++;
          } else if (currND == "JOY") {
            LAdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            LAdata[31][0]++;
          } else if (currNC == "MEH") {
            LAdata[31][1]++;
          } else if (currNC == "JOY") {
            LAdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            LAdata[32][0]++;
          } else if (currPP == "MEH") {
            LAdata[32][1]++;
          } else if (currPP == "JOY") {
            LAdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            LAdata[33][0]++;
          } else if (currPS == "MEH") {
            LAdata[33][1]++;
          } else if (currPS == "JOY") {
            LAdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            LAdata[34][0]++;
          } else if (currRC == "MEH") {
            LAdata[34][1]++;
          } else if (currRC == "JOY") {
            LAdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            LAdata[35][0]++;
          } else if (currRP == "MEH") {
            LAdata[35][1]++;
          } else if (currRP == "JOY") {
            LAdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            LAdata[36][0]++;
          } else if (currRL == "MEH") {
            LAdata[36][1]++;
          } else if (currRL == "JOY") {
            LAdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            LAdata[37][0]++;
          } else if (currSK == "MEH") {
            LAdata[37][1]++;
          } else if (currSK == "JOY") {
            LAdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            LAdata[38][0]++;
          } else if (currSN == "MEH") {
            LAdata[38][1]++;
          } else if (currSN == "JOY") {
            LAdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            LAdata[39][0]++;
          } else if (currSP == "MEH") {
            LAdata[39][1]++;
          } else if (currSP == "JOY") {
            LAdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            LAdata[40][0]++;
          } else if (currST == "MEH") {
            LAdata[40][1]++;
          } else if (currST == "JOY") {
            LAdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            LAdata[41][0]++;
          } else if (currSF == "MEH") {
            LAdata[41][1]++;
          } else if (currSF == "JOY") {
            LAdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            LAdata[42][0]++;
          } else if (currTT == "MEH") {
            LAdata[42][1]++;
          } else if (currTT == "JOY") {
            LAdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            LAdata[43][0]++;
          } else if (currTM == "MEH") {
            LAdata[43][1]++;
          } else if (currTM == "JOY") {
            LAdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            LAdata[44][0]++;
          } else if (currTB == "MEH") {
            LAdata[44][1]++;
          } else if (currTB == "JOY") {
            LAdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            LAdata[45][0]++;
          } else if (currTM == "MEH") {
            LAdata[45][1]++;
          } else if (currTM == "JOY") {
            LAdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            LAdata[46][0]++;
          } else if (currTW == "MEH") {
            LAdata[46][1]++;
          } else if (currTW == "JOY") {
            LAdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            LAdata[47][0]++;
          } else if (currWM == "MEH") {
            LAdata[47][1]++;
          } else if (currWM == "JOY") {
            LAdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            LAdata[48][0]++;
          } else if (currYP == "MEH") {
            LAdata[48][1]++;
          } else if (currYP == "JOY") {
            LAdata[48][2]++;
          }
  
        break;
      case "ME" :
          MEdata[0]++;

          if (currOut == "No") {
            MEdata[1][0]++;
          } else if (currOut = "Yes") {
            MEdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MEdata[2][0]++;
          } else if (currBF == "MEH") {
            MEdata[2][1]++;
          } else if (currBF == "JOY") {
            MEdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MEdata[3][0]++;
          } else if (currCC == "MEH") {
            MEdata[3][1]++;
          } else if (currCC == "JOY") {
            MEdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MEdata[4][0]++;
          } else if (currCL == "MEH") {
            MEdata[4][1]++;
          } else if (currCL == "JOY") {
            MEdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MEdata[5][0]++;
          } else if (currDT == "MEH") {
            MEdata[5][1]++;
          } else if (currDT == "JOY") {
            MEdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MEdata[6][0]++;
          } else if (currFP == "MEH") {
            MEdata[6][1]++;
          } else if (currFP == "JOY") {
            MEdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MEdata[7][0]++;
          } else if (currGP == "MEH") {
            MEdata[7][1]++;
          } else if (currGP == "JOY") {
            MEdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MEdata[8][0]++;
          } else if (currGB == "MEH") {
            MEdata[8][1]++;
          } else if (currGB == "JOY") {
            MEdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MEdata[9][0]++;
          } else if (currHF == "MEH") {
            MEdata[9][1]++;
          } else if (currHF == "JOY") {
            MEdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MEdata[10][0]++;
          } else if (currHB == "MEH") {
            MEdata[10][1]++;
          } else if (currHB == "JOY") {
            MEdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MEdata[11][0]++;
          } else if (currHD == "MEH") {
            MEdata[11][1]++;
          } else if (currHD == "JOY") {
            MEdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MEdata[12][0]++;
          } else if (currHM == "MEH") {
            MEdata[12][1]++;
          } else if (currHM == "JOY") {
            MEdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MEdata[13][0]++;
          } else if (currHK == "MEH") {
            MEdata[13][1]++;
          } else if (currHK == "JOY") {
            MEdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MEdata[14][0]++;
          } else if (currJB == "MEH") {
            MEdata[14][1]++;
          } else if (currJB == "JOY") {
            MEdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MEdata[15][0]++;
          } else if (currJG == "MEH") {
            MEdata[15][1]++;
          } else if (currJG == "JOY") {
            MEdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MEdata[16][0]++;
          } else if (currJM == "MEH") {
            MEdata[16][1]++;
          } else if (currJM == "JOY") {
            MEdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MEdata[17][0]++;
          } else if (currKK == "MEH") {
            MEdata[17][1]++;
          } else if (currKK == "JOY") {
            MEdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MEdata[18][0]++;
          } else if (currLT == "MEH") {
            MEdata[18][1]++;
          } else if (currLT == "JOY") {
            MEdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MEdata[19][0]++;
          } else if (currLH == "MEH") {
            MEdata[19][1]++;
          } else if (currLH == "JOY") {
            MEdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MEdata[20][0]++;
          } else if (currLN == "MEH") {
            MEdata[20][1]++;
          } else if (currLN == "JOY") {
            MEdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MEdata[21][0]++;
          } else if (currLB == "MEH") {
            MEdata[21][1]++;
          } else if (currLB == "JOY") {
            MEdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MEdata[22][0]++;
          } else if (currLP == "MEH") {
            MEdata[22][1]++;
          } else if (currLP == "JOY") {
            MEdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MEdata[23][0]++;
          } else if (currMI == "MEH") {
            MEdata[23][1]++;
          } else if (currMI == "JOY") {
            MEdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MEdata[24][0]++;
          } else if (currMD == "MEH") {
            MEdata[24][1]++;
          } else if (currMD == "JOY") {
            MEdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MEdata[25][0]++;
          } else if (currMW == "MEH") {
            MEdata[25][1]++;
          } else if (currMW == "JOY") {
            MEdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MEdata[26][0]++;
          } else if (currMM == "MEH") {
            MEdata[26][1]++;
          } else if (currMM == "JOY") {
            MEdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MEdata[27][0]++;
          } else if (currPM == "MEH") {
            MEdata[27][1]++;
          } else if (currPM == "JOY") {
            MEdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MEdata[28][0]++;
          } else if (currMK == "MEH") {
            MEdata[28][1]++;
          } else if (currMK == "JOY") {
            MEdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MEdata[29][0]++;
          } else if (currMG == "MEH") {
            MEdata[29][1]++;
          } else if (currMG == "JOY") {
            MEdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MEdata[30][0]++;
          } else if (currND == "MEH") {
            MEdata[30][1]++;
          } else if (currND == "JOY") {
            MEdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MEdata[31][0]++;
          } else if (currNC == "MEH") {
            MEdata[31][1]++;
          } else if (currNC == "JOY") {
            MEdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MEdata[32][0]++;
          } else if (currPP == "MEH") {
            MEdata[32][1]++;
          } else if (currPP == "JOY") {
            MEdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MEdata[33][0]++;
          } else if (currPS == "MEH") {
            MEdata[33][1]++;
          } else if (currPS == "JOY") {
            MEdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MEdata[34][0]++;
          } else if (currRC == "MEH") {
            MEdata[34][1]++;
          } else if (currRC == "JOY") {
            MEdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MEdata[35][0]++;
          } else if (currRP == "MEH") {
            MEdata[35][1]++;
          } else if (currRP == "JOY") {
            MEdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MEdata[36][0]++;
          } else if (currRL == "MEH") {
            MEdata[36][1]++;
          } else if (currRL == "JOY") {
            MEdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MEdata[37][0]++;
          } else if (currSK == "MEH") {
            MEdata[37][1]++;
          } else if (currSK == "JOY") {
            MEdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MEdata[38][0]++;
          } else if (currSN == "MEH") {
            MEdata[38][1]++;
          } else if (currSN == "JOY") {
            MEdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MEdata[39][0]++;
          } else if (currSP == "MEH") {
            MEdata[39][1]++;
          } else if (currSP == "JOY") {
            MEdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MEdata[40][0]++;
          } else if (currST == "MEH") {
            MEdata[40][1]++;
          } else if (currST == "JOY") {
            MEdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MEdata[41][0]++;
          } else if (currSF == "MEH") {
            MEdata[41][1]++;
          } else if (currSF == "JOY") {
            MEdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MEdata[42][0]++;
          } else if (currTT == "MEH") {
            MEdata[42][1]++;
          } else if (currTT == "JOY") {
            MEdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MEdata[43][0]++;
          } else if (currTM == "MEH") {
            MEdata[43][1]++;
          } else if (currTM == "JOY") {
            MEdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MEdata[44][0]++;
          } else if (currTB == "MEH") {
            MEdata[44][1]++;
          } else if (currTB == "JOY") {
            MEdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MEdata[45][0]++;
          } else if (currTM == "MEH") {
            MEdata[45][1]++;
          } else if (currTM == "JOY") {
            MEdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MEdata[46][0]++;
          } else if (currTW == "MEH") {
            MEdata[46][1]++;
          } else if (currTW == "JOY") {
            MEdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MEdata[47][0]++;
          } else if (currWM == "MEH") {
            MEdata[47][1]++;
          } else if (currWM == "JOY") {
            MEdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MEdata[48][0]++;
          } else if (currYP == "MEH") {
            MEdata[48][1]++;
          } else if (currYP == "JOY") {
            MEdata[48][2]++;
          }
  
        break;
      case "MD" :
          MDdata[0]++;

          if (currOut == "No") {
            MDdata[1][0]++;
          } else if (currOut = "Yes") {
            MDdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MDdata[2][0]++;
          } else if (currBF == "MEH") {
            MDdata[2][1]++;
          } else if (currBF == "JOY") {
            MDdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MDdata[3][0]++;
          } else if (currCC == "MEH") {
            MDdata[3][1]++;
          } else if (currCC == "JOY") {
            MDdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MDdata[4][0]++;
          } else if (currCL == "MEH") {
            MDdata[4][1]++;
          } else if (currCL == "JOY") {
            MDdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MDdata[5][0]++;
          } else if (currDT == "MEH") {
            MDdata[5][1]++;
          } else if (currDT == "JOY") {
            MDdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MDdata[6][0]++;
          } else if (currFP == "MEH") {
            MDdata[6][1]++;
          } else if (currFP == "JOY") {
            MDdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MDdata[7][0]++;
          } else if (currGP == "MEH") {
            MDdata[7][1]++;
          } else if (currGP == "JOY") {
            MDdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MDdata[8][0]++;
          } else if (currGB == "MEH") {
            MDdata[8][1]++;
          } else if (currGB == "JOY") {
            MDdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MDdata[9][0]++;
          } else if (currHF == "MEH") {
            MDdata[9][1]++;
          } else if (currHF == "JOY") {
            MDdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MDdata[10][0]++;
          } else if (currHB == "MEH") {
            MDdata[10][1]++;
          } else if (currHB == "JOY") {
            MDdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MDdata[11][0]++;
          } else if (currHD == "MEH") {
            MDdata[11][1]++;
          } else if (currHD == "JOY") {
            MDdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MDdata[12][0]++;
          } else if (currHM == "MEH") {
            MDdata[12][1]++;
          } else if (currHM == "JOY") {
            MDdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MDdata[13][0]++;
          } else if (currHK == "MEH") {
            MDdata[13][1]++;
          } else if (currHK == "JOY") {
            MDdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MDdata[14][0]++;
          } else if (currJB == "MEH") {
            MDdata[14][1]++;
          } else if (currJB == "JOY") {
            MDdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MDdata[15][0]++;
          } else if (currJG == "MEH") {
            MDdata[15][1]++;
          } else if (currJG == "JOY") {
            MDdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MDdata[16][0]++;
          } else if (currJM == "MEH") {
            MDdata[16][1]++;
          } else if (currJM == "JOY") {
            MDdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MDdata[17][0]++;
          } else if (currKK == "MEH") {
            MDdata[17][1]++;
          } else if (currKK == "JOY") {
            MDdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MDdata[18][0]++;
          } else if (currLT == "MEH") {
            MDdata[18][1]++;
          } else if (currLT == "JOY") {
            MDdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MDdata[19][0]++;
          } else if (currLH == "MEH") {
            MDdata[19][1]++;
          } else if (currLH == "JOY") {
            MDdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MDdata[20][0]++;
          } else if (currLN == "MEH") {
            MDdata[20][1]++;
          } else if (currLN == "JOY") {
            MDdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MDdata[21][0]++;
          } else if (currLB == "MEH") {
            MDdata[21][1]++;
          } else if (currLB == "JOY") {
            MDdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MDdata[22][0]++;
          } else if (currLP == "MEH") {
            MDdata[22][1]++;
          } else if (currLP == "JOY") {
            MDdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MDdata[23][0]++;
          } else if (currMI == "MEH") {
            MDdata[23][1]++;
          } else if (currMI == "JOY") {
            MDdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MDdata[24][0]++;
          } else if (currMD == "MEH") {
            MDdata[24][1]++;
          } else if (currMD == "JOY") {
            MDdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MDdata[25][0]++;
          } else if (currMW == "MEH") {
            MDdata[25][1]++;
          } else if (currMW == "JOY") {
            MDdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MDdata[26][0]++;
          } else if (currMM == "MEH") {
            MDdata[26][1]++;
          } else if (currMM == "JOY") {
            MDdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MDdata[27][0]++;
          } else if (currPM == "MEH") {
            MDdata[27][1]++;
          } else if (currPM == "JOY") {
            MDdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MDdata[28][0]++;
          } else if (currMK == "MEH") {
            MDdata[28][1]++;
          } else if (currMK == "JOY") {
            MDdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MDdata[29][0]++;
          } else if (currMG == "MEH") {
            MDdata[29][1]++;
          } else if (currMG == "JOY") {
            MDdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MDdata[30][0]++;
          } else if (currND == "MEH") {
            MDdata[30][1]++;
          } else if (currND == "JOY") {
            MDdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MDdata[31][0]++;
          } else if (currNC == "MEH") {
            MDdata[31][1]++;
          } else if (currNC == "JOY") {
            MDdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MDdata[32][0]++;
          } else if (currPP == "MEH") {
            MDdata[32][1]++;
          } else if (currPP == "JOY") {
            MDdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MDdata[33][0]++;
          } else if (currPS == "MEH") {
            MDdata[33][1]++;
          } else if (currPS == "JOY") {
            MDdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MDdata[34][0]++;
          } else if (currRC == "MEH") {
            MDdata[34][1]++;
          } else if (currRC == "JOY") {
            MDdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MDdata[35][0]++;
          } else if (currRP == "MEH") {
            MDdata[35][1]++;
          } else if (currRP == "JOY") {
            MDdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MDdata[36][0]++;
          } else if (currRL == "MEH") {
            MDdata[36][1]++;
          } else if (currRL == "JOY") {
            MDdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MDdata[37][0]++;
          } else if (currSK == "MEH") {
            MDdata[37][1]++;
          } else if (currSK == "JOY") {
            MDdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MDdata[38][0]++;
          } else if (currSN == "MEH") {
            MDdata[38][1]++;
          } else if (currSN == "JOY") {
            MDdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MDdata[39][0]++;
          } else if (currSP == "MEH") {
            MDdata[39][1]++;
          } else if (currSP == "JOY") {
            MDdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MDdata[40][0]++;
          } else if (currST == "MEH") {
            MDdata[40][1]++;
          } else if (currST == "JOY") {
            MDdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MDdata[41][0]++;
          } else if (currSF == "MEH") {
            MDdata[41][1]++;
          } else if (currSF == "JOY") {
            MDdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MDdata[42][0]++;
          } else if (currTT == "MEH") {
            MDdata[42][1]++;
          } else if (currTT == "JOY") {
            MDdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MDdata[43][0]++;
          } else if (currTM == "MEH") {
            MDdata[43][1]++;
          } else if (currTM == "JOY") {
            MDdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MDdata[44][0]++;
          } else if (currTB == "MEH") {
            MDdata[44][1]++;
          } else if (currTB == "JOY") {
            MDdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MDdata[45][0]++;
          } else if (currTM == "MEH") {
            MDdata[45][1]++;
          } else if (currTM == "JOY") {
            MDdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MDdata[46][0]++;
          } else if (currTW == "MEH") {
            MDdata[46][1]++;
          } else if (currTW == "JOY") {
            MDdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MDdata[47][0]++;
          } else if (currWM == "MEH") {
            MDdata[47][1]++;
          } else if (currWM == "JOY") {
            MDdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MDdata[48][0]++;
          } else if (currYP == "MEH") {
            MDdata[48][1]++;
          } else if (currYP == "JOY") {
            MDdata[48][2]++;
          }
  
        break;
      case "MA" :
          MAdata[0]++;

          if (currOut == "No") {
            MAdata[1][0]++;
          } else if (currOut = "Yes") {
            MAdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MAdata[2][0]++;
          } else if (currBF == "MEH") {
            MAdata[2][1]++;
          } else if (currBF == "JOY") {
            MAdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MAdata[3][0]++;
          } else if (currCC == "MEH") {
            MAdata[3][1]++;
          } else if (currCC == "JOY") {
            MAdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MAdata[4][0]++;
          } else if (currCL == "MEH") {
            MAdata[4][1]++;
          } else if (currCL == "JOY") {
            MAdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MAdata[5][0]++;
          } else if (currDT == "MEH") {
            MAdata[5][1]++;
          } else if (currDT == "JOY") {
            MAdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MAdata[6][0]++;
          } else if (currFP == "MEH") {
            MAdata[6][1]++;
          } else if (currFP == "JOY") {
            MAdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MAdata[7][0]++;
          } else if (currGP == "MEH") {
            MAdata[7][1]++;
          } else if (currGP == "JOY") {
            MAdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MAdata[8][0]++;
          } else if (currGB == "MEH") {
            MAdata[8][1]++;
          } else if (currGB == "JOY") {
            MAdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MAdata[9][0]++;
          } else if (currHF == "MEH") {
            MAdata[9][1]++;
          } else if (currHF == "JOY") {
            MAdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MAdata[10][0]++;
          } else if (currHB == "MEH") {
            MAdata[10][1]++;
          } else if (currHB == "JOY") {
            MAdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MAdata[11][0]++;
          } else if (currHD == "MEH") {
            MAdata[11][1]++;
          } else if (currHD == "JOY") {
            MAdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MAdata[12][0]++;
          } else if (currHM == "MEH") {
            MAdata[12][1]++;
          } else if (currHM == "JOY") {
            MAdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MAdata[13][0]++;
          } else if (currHK == "MEH") {
            MAdata[13][1]++;
          } else if (currHK == "JOY") {
            MAdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MAdata[14][0]++;
          } else if (currJB == "MEH") {
            MAdata[14][1]++;
          } else if (currJB == "JOY") {
            MAdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MAdata[15][0]++;
          } else if (currJG == "MEH") {
            MAdata[15][1]++;
          } else if (currJG == "JOY") {
            MAdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MAdata[16][0]++;
          } else if (currJM == "MEH") {
            MAdata[16][1]++;
          } else if (currJM == "JOY") {
            MAdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MAdata[17][0]++;
          } else if (currKK == "MEH") {
            MAdata[17][1]++;
          } else if (currKK == "JOY") {
            MAdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MAdata[18][0]++;
          } else if (currLT == "MEH") {
            MAdata[18][1]++;
          } else if (currLT == "JOY") {
            MAdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MAdata[19][0]++;
          } else if (currLH == "MEH") {
            MAdata[19][1]++;
          } else if (currLH == "JOY") {
            MAdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MAdata[20][0]++;
          } else if (currLN == "MEH") {
            MAdata[20][1]++;
          } else if (currLN == "JOY") {
            MAdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MAdata[21][0]++;
          } else if (currLB == "MEH") {
            MAdata[21][1]++;
          } else if (currLB == "JOY") {
            MAdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MAdata[22][0]++;
          } else if (currLP == "MEH") {
            MAdata[22][1]++;
          } else if (currLP == "JOY") {
            MAdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MAdata[23][0]++;
          } else if (currMI == "MEH") {
            MAdata[23][1]++;
          } else if (currMI == "JOY") {
            MAdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MAdata[24][0]++;
          } else if (currMD == "MEH") {
            MAdata[24][1]++;
          } else if (currMD == "JOY") {
            MAdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MAdata[25][0]++;
          } else if (currMW == "MEH") {
            MAdata[25][1]++;
          } else if (currMW == "JOY") {
            MAdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MAdata[26][0]++;
          } else if (currMM == "MEH") {
            MAdata[26][1]++;
          } else if (currMM == "JOY") {
            MAdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MAdata[27][0]++;
          } else if (currPM == "MEH") {
            MAdata[27][1]++;
          } else if (currPM == "JOY") {
            MAdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MAdata[28][0]++;
          } else if (currMK == "MEH") {
            MAdata[28][1]++;
          } else if (currMK == "JOY") {
            MAdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MAdata[29][0]++;
          } else if (currMG == "MEH") {
            MAdata[29][1]++;
          } else if (currMG == "JOY") {
            MAdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MAdata[30][0]++;
          } else if (currND == "MEH") {
            MAdata[30][1]++;
          } else if (currND == "JOY") {
            MAdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MAdata[31][0]++;
          } else if (currNC == "MEH") {
            MAdata[31][1]++;
          } else if (currNC == "JOY") {
            MAdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MAdata[32][0]++;
          } else if (currPP == "MEH") {
            MAdata[32][1]++;
          } else if (currPP == "JOY") {
            MAdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MAdata[33][0]++;
          } else if (currPS == "MEH") {
            MAdata[33][1]++;
          } else if (currPS == "JOY") {
            MAdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MAdata[34][0]++;
          } else if (currRC == "MEH") {
            MAdata[34][1]++;
          } else if (currRC == "JOY") {
            MAdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MAdata[35][0]++;
          } else if (currRP == "MEH") {
            MAdata[35][1]++;
          } else if (currRP == "JOY") {
            MAdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MAdata[36][0]++;
          } else if (currRL == "MEH") {
            MAdata[36][1]++;
          } else if (currRL == "JOY") {
            MAdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MAdata[37][0]++;
          } else if (currSK == "MEH") {
            MAdata[37][1]++;
          } else if (currSK == "JOY") {
            MAdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MAdata[38][0]++;
          } else if (currSN == "MEH") {
            MAdata[38][1]++;
          } else if (currSN == "JOY") {
            MAdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MAdata[39][0]++;
          } else if (currSP == "MEH") {
            MAdata[39][1]++;
          } else if (currSP == "JOY") {
            MAdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MAdata[40][0]++;
          } else if (currST == "MEH") {
            MAdata[40][1]++;
          } else if (currST == "JOY") {
            MAdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MAdata[41][0]++;
          } else if (currSF == "MEH") {
            MAdata[41][1]++;
          } else if (currSF == "JOY") {
            MAdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MAdata[42][0]++;
          } else if (currTT == "MEH") {
            MAdata[42][1]++;
          } else if (currTT == "JOY") {
            MAdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MAdata[43][0]++;
          } else if (currTM == "MEH") {
            MAdata[43][1]++;
          } else if (currTM == "JOY") {
            MAdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MAdata[44][0]++;
          } else if (currTB == "MEH") {
            MAdata[44][1]++;
          } else if (currTB == "JOY") {
            MAdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MAdata[45][0]++;
          } else if (currTM == "MEH") {
            MAdata[45][1]++;
          } else if (currTM == "JOY") {
            MAdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MAdata[46][0]++;
          } else if (currTW == "MEH") {
            MAdata[46][1]++;
          } else if (currTW == "JOY") {
            MAdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MAdata[47][0]++;
          } else if (currWM == "MEH") {
            MAdata[47][1]++;
          } else if (currWM == "JOY") {
            MAdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MAdata[48][0]++;
          } else if (currYP == "MEH") {
            MAdata[48][1]++;
          } else if (currYP == "JOY") {
            MAdata[48][2]++;
          }
  
        break;
      case "MI" :
          MIdata[0]++;

          if (currOut == "No") {
            MIdata[1][0]++;
          } else if (currOut = "Yes") {
            MIdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MIdata[2][0]++;
          } else if (currBF == "MEH") {
            MIdata[2][1]++;
          } else if (currBF == "JOY") {
            MIdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MIdata[3][0]++;
          } else if (currCC == "MEH") {
            MIdata[3][1]++;
          } else if (currCC == "JOY") {
            MIdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MIdata[4][0]++;
          } else if (currCL == "MEH") {
            MIdata[4][1]++;
          } else if (currCL == "JOY") {
            MIdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MIdata[5][0]++;
          } else if (currDT == "MEH") {
            MIdata[5][1]++;
          } else if (currDT == "JOY") {
            MIdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MIdata[6][0]++;
          } else if (currFP == "MEH") {
            MIdata[6][1]++;
          } else if (currFP == "JOY") {
            MIdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MIdata[7][0]++;
          } else if (currGP == "MEH") {
            MIdata[7][1]++;
          } else if (currGP == "JOY") {
            MIdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MIdata[8][0]++;
          } else if (currGB == "MEH") {
            MIdata[8][1]++;
          } else if (currGB == "JOY") {
            MIdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MIdata[9][0]++;
          } else if (currHF == "MEH") {
            MIdata[9][1]++;
          } else if (currHF == "JOY") {
            MIdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MIdata[10][0]++;
          } else if (currHB == "MEH") {
            MIdata[10][1]++;
          } else if (currHB == "JOY") {
            MIdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MIdata[11][0]++;
          } else if (currHD == "MEH") {
            MIdata[11][1]++;
          } else if (currHD == "JOY") {
            MIdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MIdata[12][0]++;
          } else if (currHM == "MEH") {
            MIdata[12][1]++;
          } else if (currHM == "JOY") {
            MIdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MIdata[13][0]++;
          } else if (currHK == "MEH") {
            MIdata[13][1]++;
          } else if (currHK == "JOY") {
            MIdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MIdata[14][0]++;
          } else if (currJB == "MEH") {
            MIdata[14][1]++;
          } else if (currJB == "JOY") {
            MIdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MIdata[15][0]++;
          } else if (currJG == "MEH") {
            MIdata[15][1]++;
          } else if (currJG == "JOY") {
            MIdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MIdata[16][0]++;
          } else if (currJM == "MEH") {
            MIdata[16][1]++;
          } else if (currJM == "JOY") {
            MIdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MIdata[17][0]++;
          } else if (currKK == "MEH") {
            MIdata[17][1]++;
          } else if (currKK == "JOY") {
            MIdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MIdata[18][0]++;
          } else if (currLT == "MEH") {
            MIdata[18][1]++;
          } else if (currLT == "JOY") {
            MIdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MIdata[19][0]++;
          } else if (currLH == "MEH") {
            MIdata[19][1]++;
          } else if (currLH == "JOY") {
            MIdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MIdata[20][0]++;
          } else if (currLN == "MEH") {
            MIdata[20][1]++;
          } else if (currLN == "JOY") {
            MIdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MIdata[21][0]++;
          } else if (currLB == "MEH") {
            MIdata[21][1]++;
          } else if (currLB == "JOY") {
            MIdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MIdata[22][0]++;
          } else if (currLP == "MEH") {
            MIdata[22][1]++;
          } else if (currLP == "JOY") {
            MIdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MIdata[23][0]++;
          } else if (currMI == "MEH") {
            MIdata[23][1]++;
          } else if (currMI == "JOY") {
            MIdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MIdata[24][0]++;
          } else if (currMD == "MEH") {
            MIdata[24][1]++;
          } else if (currMD == "JOY") {
            MIdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MIdata[25][0]++;
          } else if (currMW == "MEH") {
            MIdata[25][1]++;
          } else if (currMW == "JOY") {
            MIdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MIdata[26][0]++;
          } else if (currMM == "MEH") {
            MIdata[26][1]++;
          } else if (currMM == "JOY") {
            MIdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MIdata[27][0]++;
          } else if (currPM == "MEH") {
            MIdata[27][1]++;
          } else if (currPM == "JOY") {
            MIdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MIdata[28][0]++;
          } else if (currMK == "MEH") {
            MIdata[28][1]++;
          } else if (currMK == "JOY") {
            MIdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MIdata[29][0]++;
          } else if (currMG == "MEH") {
            MIdata[29][1]++;
          } else if (currMG == "JOY") {
            MIdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MIdata[30][0]++;
          } else if (currND == "MEH") {
            MIdata[30][1]++;
          } else if (currND == "JOY") {
            MIdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MIdata[31][0]++;
          } else if (currNC == "MEH") {
            MIdata[31][1]++;
          } else if (currNC == "JOY") {
            MIdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MIdata[32][0]++;
          } else if (currPP == "MEH") {
            MIdata[32][1]++;
          } else if (currPP == "JOY") {
            MIdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MIdata[33][0]++;
          } else if (currPS == "MEH") {
            MIdata[33][1]++;
          } else if (currPS == "JOY") {
            MIdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MIdata[34][0]++;
          } else if (currRC == "MEH") {
            MIdata[34][1]++;
          } else if (currRC == "JOY") {
            MIdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MIdata[35][0]++;
          } else if (currRP == "MEH") {
            MIdata[35][1]++;
          } else if (currRP == "JOY") {
            MIdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MIdata[36][0]++;
          } else if (currRL == "MEH") {
            MIdata[36][1]++;
          } else if (currRL == "JOY") {
            MIdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MIdata[37][0]++;
          } else if (currSK == "MEH") {
            MIdata[37][1]++;
          } else if (currSK == "JOY") {
            MIdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MIdata[38][0]++;
          } else if (currSN == "MEH") {
            MIdata[38][1]++;
          } else if (currSN == "JOY") {
            MIdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MIdata[39][0]++;
          } else if (currSP == "MEH") {
            MIdata[39][1]++;
          } else if (currSP == "JOY") {
            MIdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MIdata[40][0]++;
          } else if (currST == "MEH") {
            MIdata[40][1]++;
          } else if (currST == "JOY") {
            MIdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MIdata[41][0]++;
          } else if (currSF == "MEH") {
            MIdata[41][1]++;
          } else if (currSF == "JOY") {
            MIdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MIdata[42][0]++;
          } else if (currTT == "MEH") {
            MIdata[42][1]++;
          } else if (currTT == "JOY") {
            MIdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MIdata[43][0]++;
          } else if (currTM == "MEH") {
            MIdata[43][1]++;
          } else if (currTM == "JOY") {
            MIdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MIdata[44][0]++;
          } else if (currTB == "MEH") {
            MIdata[44][1]++;
          } else if (currTB == "JOY") {
            MIdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MIdata[45][0]++;
          } else if (currTM == "MEH") {
            MIdata[45][1]++;
          } else if (currTM == "JOY") {
            MIdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MIdata[46][0]++;
          } else if (currTW == "MEH") {
            MIdata[46][1]++;
          } else if (currTW == "JOY") {
            MIdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MIdata[47][0]++;
          } else if (currWM == "MEH") {
            MIdata[47][1]++;
          } else if (currWM == "JOY") {
            MIdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MIdata[48][0]++;
          } else if (currYP == "MEH") {
            MIdata[48][1]++;
          } else if (currYP == "JOY") {
            MIdata[48][2]++;
          }
  
        break;
      case "MN" :
          MNdata[0]++;

          if (currOut == "No") {
            MNdata[1][0]++;
          } else if (currOut = "Yes") {
            MNdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MNdata[2][0]++;
          } else if (currBF == "MEH") {
            MNdata[2][1]++;
          } else if (currBF == "JOY") {
            MNdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MNdata[3][0]++;
          } else if (currCC == "MEH") {
            MNdata[3][1]++;
          } else if (currCC == "JOY") {
            MNdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MNdata[4][0]++;
          } else if (currCL == "MEH") {
            MNdata[4][1]++;
          } else if (currCL == "JOY") {
            MNdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MNdata[5][0]++;
          } else if (currDT == "MEH") {
            MNdata[5][1]++;
          } else if (currDT == "JOY") {
            MNdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MNdata[6][0]++;
          } else if (currFP == "MEH") {
            MNdata[6][1]++;
          } else if (currFP == "JOY") {
            MNdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MNdata[7][0]++;
          } else if (currGP == "MEH") {
            MNdata[7][1]++;
          } else if (currGP == "JOY") {
            MNdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MNdata[8][0]++;
          } else if (currGB == "MEH") {
            MNdata[8][1]++;
          } else if (currGB == "JOY") {
            MNdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MNdata[9][0]++;
          } else if (currHF == "MEH") {
            MNdata[9][1]++;
          } else if (currHF == "JOY") {
            MNdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MNdata[10][0]++;
          } else if (currHB == "MEH") {
            MNdata[10][1]++;
          } else if (currHB == "JOY") {
            MNdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MNdata[11][0]++;
          } else if (currHD == "MEH") {
            MNdata[11][1]++;
          } else if (currHD == "JOY") {
            MNdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MNdata[12][0]++;
          } else if (currHM == "MEH") {
            MNdata[12][1]++;
          } else if (currHM == "JOY") {
            MNdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MNdata[13][0]++;
          } else if (currHK == "MEH") {
            MNdata[13][1]++;
          } else if (currHK == "JOY") {
            MNdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MNdata[14][0]++;
          } else if (currJB == "MEH") {
            MNdata[14][1]++;
          } else if (currJB == "JOY") {
            MNdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MNdata[15][0]++;
          } else if (currJG == "MEH") {
            MNdata[15][1]++;
          } else if (currJG == "JOY") {
            MNdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MNdata[16][0]++;
          } else if (currJM == "MEH") {
            MNdata[16][1]++;
          } else if (currJM == "JOY") {
            MNdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MNdata[17][0]++;
          } else if (currKK == "MEH") {
            MNdata[17][1]++;
          } else if (currKK == "JOY") {
            MNdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MNdata[18][0]++;
          } else if (currLT == "MEH") {
            MNdata[18][1]++;
          } else if (currLT == "JOY") {
            MNdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MNdata[19][0]++;
          } else if (currLH == "MEH") {
            MNdata[19][1]++;
          } else if (currLH == "JOY") {
            MNdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MNdata[20][0]++;
          } else if (currLN == "MEH") {
            MNdata[20][1]++;
          } else if (currLN == "JOY") {
            MNdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MNdata[21][0]++;
          } else if (currLB == "MEH") {
            MNdata[21][1]++;
          } else if (currLB == "JOY") {
            MNdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MNdata[22][0]++;
          } else if (currLP == "MEH") {
            MNdata[22][1]++;
          } else if (currLP == "JOY") {
            MNdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MNdata[23][0]++;
          } else if (currMI == "MEH") {
            MNdata[23][1]++;
          } else if (currMI == "JOY") {
            MNdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MNdata[24][0]++;
          } else if (currMD == "MEH") {
            MNdata[24][1]++;
          } else if (currMD == "JOY") {
            MNdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MNdata[25][0]++;
          } else if (currMW == "MEH") {
            MNdata[25][1]++;
          } else if (currMW == "JOY") {
            MNdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MNdata[26][0]++;
          } else if (currMM == "MEH") {
            MNdata[26][1]++;
          } else if (currMM == "JOY") {
            MNdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MNdata[27][0]++;
          } else if (currPM == "MEH") {
            MNdata[27][1]++;
          } else if (currPM == "JOY") {
            MNdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MNdata[28][0]++;
          } else if (currMK == "MEH") {
            MNdata[28][1]++;
          } else if (currMK == "JOY") {
            MNdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MNdata[29][0]++;
          } else if (currMG == "MEH") {
            MNdata[29][1]++;
          } else if (currMG == "JOY") {
            MNdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MNdata[30][0]++;
          } else if (currND == "MEH") {
            MNdata[30][1]++;
          } else if (currND == "JOY") {
            MNdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MNdata[31][0]++;
          } else if (currNC == "MEH") {
            MNdata[31][1]++;
          } else if (currNC == "JOY") {
            MNdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MNdata[32][0]++;
          } else if (currPP == "MEH") {
            MNdata[32][1]++;
          } else if (currPP == "JOY") {
            MNdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MNdata[33][0]++;
          } else if (currPS == "MEH") {
            MNdata[33][1]++;
          } else if (currPS == "JOY") {
            MNdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MNdata[34][0]++;
          } else if (currRC == "MEH") {
            MNdata[34][1]++;
          } else if (currRC == "JOY") {
            MNdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MNdata[35][0]++;
          } else if (currRP == "MEH") {
            MNdata[35][1]++;
          } else if (currRP == "JOY") {
            MNdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MNdata[36][0]++;
          } else if (currRL == "MEH") {
            MNdata[36][1]++;
          } else if (currRL == "JOY") {
            MNdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MNdata[37][0]++;
          } else if (currSK == "MEH") {
            MNdata[37][1]++;
          } else if (currSK == "JOY") {
            MNdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MNdata[38][0]++;
          } else if (currSN == "MEH") {
            MNdata[38][1]++;
          } else if (currSN == "JOY") {
            MNdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MNdata[39][0]++;
          } else if (currSP == "MEH") {
            MNdata[39][1]++;
          } else if (currSP == "JOY") {
            MNdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MNdata[40][0]++;
          } else if (currST == "MEH") {
            MNdata[40][1]++;
          } else if (currST == "JOY") {
            MNdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MNdata[41][0]++;
          } else if (currSF == "MEH") {
            MNdata[41][1]++;
          } else if (currSF == "JOY") {
            MNdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MNdata[42][0]++;
          } else if (currTT == "MEH") {
            MNdata[42][1]++;
          } else if (currTT == "JOY") {
            MNdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MNdata[43][0]++;
          } else if (currTM == "MEH") {
            MNdata[43][1]++;
          } else if (currTM == "JOY") {
            MNdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MNdata[44][0]++;
          } else if (currTB == "MEH") {
            MNdata[44][1]++;
          } else if (currTB == "JOY") {
            MNdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MNdata[45][0]++;
          } else if (currTM == "MEH") {
            MNdata[45][1]++;
          } else if (currTM == "JOY") {
            MNdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MNdata[46][0]++;
          } else if (currTW == "MEH") {
            MNdata[46][1]++;
          } else if (currTW == "JOY") {
            MNdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MNdata[47][0]++;
          } else if (currWM == "MEH") {
            MNdata[47][1]++;
          } else if (currWM == "JOY") {
            MNdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MNdata[48][0]++;
          } else if (currYP == "MEH") {
            MNdata[48][1]++;
          } else if (currYP == "JOY") {
            MNdata[48][2]++;
          }
  
        break;
      case "MS" :
          MSdata[0]++;

          if (currOut == "No") {
            MSdata[1][0]++;
          } else if (currOut = "Yes") {
            MSdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MSdata[2][0]++;
          } else if (currBF == "MEH") {
            MSdata[2][1]++;
          } else if (currBF == "JOY") {
            MSdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MSdata[3][0]++;
          } else if (currCC == "MEH") {
            MSdata[3][1]++;
          } else if (currCC == "JOY") {
            MSdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MSdata[4][0]++;
          } else if (currCL == "MEH") {
            MSdata[4][1]++;
          } else if (currCL == "JOY") {
            MSdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MSdata[5][0]++;
          } else if (currDT == "MEH") {
            MSdata[5][1]++;
          } else if (currDT == "JOY") {
            MSdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MSdata[6][0]++;
          } else if (currFP == "MEH") {
            MSdata[6][1]++;
          } else if (currFP == "JOY") {
            MSdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MSdata[7][0]++;
          } else if (currGP == "MEH") {
            MSdata[7][1]++;
          } else if (currGP == "JOY") {
            MSdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MSdata[8][0]++;
          } else if (currGB == "MEH") {
            MSdata[8][1]++;
          } else if (currGB == "JOY") {
            MSdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MSdata[9][0]++;
          } else if (currHF == "MEH") {
            MSdata[9][1]++;
          } else if (currHF == "JOY") {
            MSdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MSdata[10][0]++;
          } else if (currHB == "MEH") {
            MSdata[10][1]++;
          } else if (currHB == "JOY") {
            MSdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MSdata[11][0]++;
          } else if (currHD == "MEH") {
            MSdata[11][1]++;
          } else if (currHD == "JOY") {
            MSdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MSdata[12][0]++;
          } else if (currHM == "MEH") {
            MSdata[12][1]++;
          } else if (currHM == "JOY") {
            MSdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MSdata[13][0]++;
          } else if (currHK == "MEH") {
            MSdata[13][1]++;
          } else if (currHK == "JOY") {
            MSdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MSdata[14][0]++;
          } else if (currJB == "MEH") {
            MSdata[14][1]++;
          } else if (currJB == "JOY") {
            MSdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MSdata[15][0]++;
          } else if (currJG == "MEH") {
            MSdata[15][1]++;
          } else if (currJG == "JOY") {
            MSdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MSdata[16][0]++;
          } else if (currJM == "MEH") {
            MSdata[16][1]++;
          } else if (currJM == "JOY") {
            MSdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MSdata[17][0]++;
          } else if (currKK == "MEH") {
            MSdata[17][1]++;
          } else if (currKK == "JOY") {
            MSdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MSdata[18][0]++;
          } else if (currLT == "MEH") {
            MSdata[18][1]++;
          } else if (currLT == "JOY") {
            MSdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MSdata[19][0]++;
          } else if (currLH == "MEH") {
            MSdata[19][1]++;
          } else if (currLH == "JOY") {
            MSdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MSdata[20][0]++;
          } else if (currLN == "MEH") {
            MSdata[20][1]++;
          } else if (currLN == "JOY") {
            MSdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MSdata[21][0]++;
          } else if (currLB == "MEH") {
            MSdata[21][1]++;
          } else if (currLB == "JOY") {
            MSdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MSdata[22][0]++;
          } else if (currLP == "MEH") {
            MSdata[22][1]++;
          } else if (currLP == "JOY") {
            MSdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MSdata[23][0]++;
          } else if (currMI == "MEH") {
            MSdata[23][1]++;
          } else if (currMI == "JOY") {
            MSdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MSdata[24][0]++;
          } else if (currMD == "MEH") {
            MSdata[24][1]++;
          } else if (currMD == "JOY") {
            MSdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MSdata[25][0]++;
          } else if (currMW == "MEH") {
            MSdata[25][1]++;
          } else if (currMW == "JOY") {
            MSdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MSdata[26][0]++;
          } else if (currMM == "MEH") {
            MSdata[26][1]++;
          } else if (currMM == "JOY") {
            MSdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MSdata[27][0]++;
          } else if (currPM == "MEH") {
            MSdata[27][1]++;
          } else if (currPM == "JOY") {
            MSdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MSdata[28][0]++;
          } else if (currMK == "MEH") {
            MSdata[28][1]++;
          } else if (currMK == "JOY") {
            MSdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MSdata[29][0]++;
          } else if (currMG == "MEH") {
            MSdata[29][1]++;
          } else if (currMG == "JOY") {
            MSdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MSdata[30][0]++;
          } else if (currND == "MEH") {
            MSdata[30][1]++;
          } else if (currND == "JOY") {
            MSdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MSdata[31][0]++;
          } else if (currNC == "MEH") {
            MSdata[31][1]++;
          } else if (currNC == "JOY") {
            MSdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MSdata[32][0]++;
          } else if (currPP == "MEH") {
            MSdata[32][1]++;
          } else if (currPP == "JOY") {
            MSdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MSdata[33][0]++;
          } else if (currPS == "MEH") {
            MSdata[33][1]++;
          } else if (currPS == "JOY") {
            MSdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MSdata[34][0]++;
          } else if (currRC == "MEH") {
            MSdata[34][1]++;
          } else if (currRC == "JOY") {
            MSdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MSdata[35][0]++;
          } else if (currRP == "MEH") {
            MSdata[35][1]++;
          } else if (currRP == "JOY") {
            MSdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MSdata[36][0]++;
          } else if (currRL == "MEH") {
            MSdata[36][1]++;
          } else if (currRL == "JOY") {
            MSdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MSdata[37][0]++;
          } else if (currSK == "MEH") {
            MSdata[37][1]++;
          } else if (currSK == "JOY") {
            MSdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MSdata[38][0]++;
          } else if (currSN == "MEH") {
            MSdata[38][1]++;
          } else if (currSN == "JOY") {
            MSdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MSdata[39][0]++;
          } else if (currSP == "MEH") {
            MSdata[39][1]++;
          } else if (currSP == "JOY") {
            MSdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MSdata[40][0]++;
          } else if (currST == "MEH") {
            MSdata[40][1]++;
          } else if (currST == "JOY") {
            MSdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MSdata[41][0]++;
          } else if (currSF == "MEH") {
            MSdata[41][1]++;
          } else if (currSF == "JOY") {
            MSdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MSdata[42][0]++;
          } else if (currTT == "MEH") {
            MSdata[42][1]++;
          } else if (currTT == "JOY") {
            MSdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MSdata[43][0]++;
          } else if (currTM == "MEH") {
            MSdata[43][1]++;
          } else if (currTM == "JOY") {
            MSdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MSdata[44][0]++;
          } else if (currTB == "MEH") {
            MSdata[44][1]++;
          } else if (currTB == "JOY") {
            MSdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MSdata[45][0]++;
          } else if (currTM == "MEH") {
            MSdata[45][1]++;
          } else if (currTM == "JOY") {
            MSdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MSdata[46][0]++;
          } else if (currTW == "MEH") {
            MSdata[46][1]++;
          } else if (currTW == "JOY") {
            MSdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MSdata[47][0]++;
          } else if (currWM == "MEH") {
            MSdata[47][1]++;
          } else if (currWM == "JOY") {
            MSdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MSdata[48][0]++;
          } else if (currYP == "MEH") {
            MSdata[48][1]++;
          } else if (currYP == "JOY") {
            MSdata[48][2]++;
          }
  
        break;
      case "MO" :
          MOdata[0]++;

          if (currOut == "No") {
            MOdata[1][0]++;
          } else if (currOut = "Yes") {
            MOdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MOdata[2][0]++;
          } else if (currBF == "MEH") {
            MOdata[2][1]++;
          } else if (currBF == "JOY") {
            MOdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MOdata[3][0]++;
          } else if (currCC == "MEH") {
            MOdata[3][1]++;
          } else if (currCC == "JOY") {
            MOdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MOdata[4][0]++;
          } else if (currCL == "MEH") {
            MOdata[4][1]++;
          } else if (currCL == "JOY") {
            MOdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MOdata[5][0]++;
          } else if (currDT == "MEH") {
            MOdata[5][1]++;
          } else if (currDT == "JOY") {
            MOdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MOdata[6][0]++;
          } else if (currFP == "MEH") {
            MOdata[6][1]++;
          } else if (currFP == "JOY") {
            MOdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MOdata[7][0]++;
          } else if (currGP == "MEH") {
            MOdata[7][1]++;
          } else if (currGP == "JOY") {
            MOdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MOdata[8][0]++;
          } else if (currGB == "MEH") {
            MOdata[8][1]++;
          } else if (currGB == "JOY") {
            MOdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MOdata[9][0]++;
          } else if (currHF == "MEH") {
            MOdata[9][1]++;
          } else if (currHF == "JOY") {
            MOdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MOdata[10][0]++;
          } else if (currHB == "MEH") {
            MOdata[10][1]++;
          } else if (currHB == "JOY") {
            MOdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MOdata[11][0]++;
          } else if (currHD == "MEH") {
            MOdata[11][1]++;
          } else if (currHD == "JOY") {
            MOdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MOdata[12][0]++;
          } else if (currHM == "MEH") {
            MOdata[12][1]++;
          } else if (currHM == "JOY") {
            MOdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MOdata[13][0]++;
          } else if (currHK == "MEH") {
            MOdata[13][1]++;
          } else if (currHK == "JOY") {
            MOdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MOdata[14][0]++;
          } else if (currJB == "MEH") {
            MOdata[14][1]++;
          } else if (currJB == "JOY") {
            MOdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MOdata[15][0]++;
          } else if (currJG == "MEH") {
            MOdata[15][1]++;
          } else if (currJG == "JOY") {
            MOdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MOdata[16][0]++;
          } else if (currJM == "MEH") {
            MOdata[16][1]++;
          } else if (currJM == "JOY") {
            MOdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MOdata[17][0]++;
          } else if (currKK == "MEH") {
            MOdata[17][1]++;
          } else if (currKK == "JOY") {
            MOdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MOdata[18][0]++;
          } else if (currLT == "MEH") {
            MOdata[18][1]++;
          } else if (currLT == "JOY") {
            MOdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MOdata[19][0]++;
          } else if (currLH == "MEH") {
            MOdata[19][1]++;
          } else if (currLH == "JOY") {
            MOdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MOdata[20][0]++;
          } else if (currLN == "MEH") {
            MOdata[20][1]++;
          } else if (currLN == "JOY") {
            MOdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MOdata[21][0]++;
          } else if (currLB == "MEH") {
            MOdata[21][1]++;
          } else if (currLB == "JOY") {
            MOdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MOdata[22][0]++;
          } else if (currLP == "MEH") {
            MOdata[22][1]++;
          } else if (currLP == "JOY") {
            MOdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MOdata[23][0]++;
          } else if (currMI == "MEH") {
            MOdata[23][1]++;
          } else if (currMI == "JOY") {
            MOdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MOdata[24][0]++;
          } else if (currMD == "MEH") {
            MOdata[24][1]++;
          } else if (currMD == "JOY") {
            MOdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MOdata[25][0]++;
          } else if (currMW == "MEH") {
            MOdata[25][1]++;
          } else if (currMW == "JOY") {
            MOdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MOdata[26][0]++;
          } else if (currMM == "MEH") {
            MOdata[26][1]++;
          } else if (currMM == "JOY") {
            MOdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MOdata[27][0]++;
          } else if (currPM == "MEH") {
            MOdata[27][1]++;
          } else if (currPM == "JOY") {
            MOdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MOdata[28][0]++;
          } else if (currMK == "MEH") {
            MOdata[28][1]++;
          } else if (currMK == "JOY") {
            MOdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MOdata[29][0]++;
          } else if (currMG == "MEH") {
            MOdata[29][1]++;
          } else if (currMG == "JOY") {
            MOdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MOdata[30][0]++;
          } else if (currND == "MEH") {
            MOdata[30][1]++;
          } else if (currND == "JOY") {
            MOdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MOdata[31][0]++;
          } else if (currNC == "MEH") {
            MOdata[31][1]++;
          } else if (currNC == "JOY") {
            MOdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MOdata[32][0]++;
          } else if (currPP == "MEH") {
            MOdata[32][1]++;
          } else if (currPP == "JOY") {
            MOdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MOdata[33][0]++;
          } else if (currPS == "MEH") {
            MOdata[33][1]++;
          } else if (currPS == "JOY") {
            MOdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MOdata[34][0]++;
          } else if (currRC == "MEH") {
            MOdata[34][1]++;
          } else if (currRC == "JOY") {
            MOdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MOdata[35][0]++;
          } else if (currRP == "MEH") {
            MOdata[35][1]++;
          } else if (currRP == "JOY") {
            MOdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MOdata[36][0]++;
          } else if (currRL == "MEH") {
            MOdata[36][1]++;
          } else if (currRL == "JOY") {
            MOdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MOdata[37][0]++;
          } else if (currSK == "MEH") {
            MOdata[37][1]++;
          } else if (currSK == "JOY") {
            MOdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MOdata[38][0]++;
          } else if (currSN == "MEH") {
            MOdata[38][1]++;
          } else if (currSN == "JOY") {
            MOdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MOdata[39][0]++;
          } else if (currSP == "MEH") {
            MOdata[39][1]++;
          } else if (currSP == "JOY") {
            MOdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MOdata[40][0]++;
          } else if (currST == "MEH") {
            MOdata[40][1]++;
          } else if (currST == "JOY") {
            MOdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MOdata[41][0]++;
          } else if (currSF == "MEH") {
            MOdata[41][1]++;
          } else if (currSF == "JOY") {
            MOdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MOdata[42][0]++;
          } else if (currTT == "MEH") {
            MOdata[42][1]++;
          } else if (currTT == "JOY") {
            MOdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MOdata[43][0]++;
          } else if (currTM == "MEH") {
            MOdata[43][1]++;
          } else if (currTM == "JOY") {
            MOdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MOdata[44][0]++;
          } else if (currTB == "MEH") {
            MOdata[44][1]++;
          } else if (currTB == "JOY") {
            MOdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MOdata[45][0]++;
          } else if (currTM == "MEH") {
            MOdata[45][1]++;
          } else if (currTM == "JOY") {
            MOdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MOdata[46][0]++;
          } else if (currTW == "MEH") {
            MOdata[46][1]++;
          } else if (currTW == "JOY") {
            MOdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MOdata[47][0]++;
          } else if (currWM == "MEH") {
            MOdata[47][1]++;
          } else if (currWM == "JOY") {
            MOdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MOdata[48][0]++;
          } else if (currYP == "MEH") {
            MOdata[48][1]++;
          } else if (currYP == "JOY") {
            MOdata[48][2]++;
          }
  
        break;
      case "MT" :
          MTdata[0]++;

          if (currOut == "No") {
            MTdata[1][0]++;
          } else if (currOut = "Yes") {
            MTdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MTdata[2][0]++;
          } else if (currBF == "MEH") {
            MTdata[2][1]++;
          } else if (currBF == "JOY") {
            MTdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MTdata[3][0]++;
          } else if (currCC == "MEH") {
            MTdata[3][1]++;
          } else if (currCC == "JOY") {
            MTdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MTdata[4][0]++;
          } else if (currCL == "MEH") {
            MTdata[4][1]++;
          } else if (currCL == "JOY") {
            MTdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MTdata[5][0]++;
          } else if (currDT == "MEH") {
            MTdata[5][1]++;
          } else if (currDT == "JOY") {
            MTdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MTdata[6][0]++;
          } else if (currFP == "MEH") {
            MTdata[6][1]++;
          } else if (currFP == "JOY") {
            MTdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MTdata[7][0]++;
          } else if (currGP == "MEH") {
            MTdata[7][1]++;
          } else if (currGP == "JOY") {
            MTdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MTdata[8][0]++;
          } else if (currGB == "MEH") {
            MTdata[8][1]++;
          } else if (currGB == "JOY") {
            MTdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MTdata[9][0]++;
          } else if (currHF == "MEH") {
            MTdata[9][1]++;
          } else if (currHF == "JOY") {
            MTdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MTdata[10][0]++;
          } else if (currHB == "MEH") {
            MTdata[10][1]++;
          } else if (currHB == "JOY") {
            MTdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MTdata[11][0]++;
          } else if (currHD == "MEH") {
            MTdata[11][1]++;
          } else if (currHD == "JOY") {
            MTdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MTdata[12][0]++;
          } else if (currHM == "MEH") {
            MTdata[12][1]++;
          } else if (currHM == "JOY") {
            MTdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MTdata[13][0]++;
          } else if (currHK == "MEH") {
            MTdata[13][1]++;
          } else if (currHK == "JOY") {
            MTdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MTdata[14][0]++;
          } else if (currJB == "MEH") {
            MTdata[14][1]++;
          } else if (currJB == "JOY") {
            MTdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MTdata[15][0]++;
          } else if (currJG == "MEH") {
            MTdata[15][1]++;
          } else if (currJG == "JOY") {
            MTdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MTdata[16][0]++;
          } else if (currJM == "MEH") {
            MTdata[16][1]++;
          } else if (currJM == "JOY") {
            MTdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MTdata[17][0]++;
          } else if (currKK == "MEH") {
            MTdata[17][1]++;
          } else if (currKK == "JOY") {
            MTdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MTdata[18][0]++;
          } else if (currLT == "MEH") {
            MTdata[18][1]++;
          } else if (currLT == "JOY") {
            MTdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MTdata[19][0]++;
          } else if (currLH == "MEH") {
            MTdata[19][1]++;
          } else if (currLH == "JOY") {
            MTdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MTdata[20][0]++;
          } else if (currLN == "MEH") {
            MTdata[20][1]++;
          } else if (currLN == "JOY") {
            MTdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MTdata[21][0]++;
          } else if (currLB == "MEH") {
            MTdata[21][1]++;
          } else if (currLB == "JOY") {
            MTdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MTdata[22][0]++;
          } else if (currLP == "MEH") {
            MTdata[22][1]++;
          } else if (currLP == "JOY") {
            MTdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MTdata[23][0]++;
          } else if (currMI == "MEH") {
            MTdata[23][1]++;
          } else if (currMI == "JOY") {
            MTdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MTdata[24][0]++;
          } else if (currMD == "MEH") {
            MTdata[24][1]++;
          } else if (currMD == "JOY") {
            MTdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MTdata[25][0]++;
          } else if (currMW == "MEH") {
            MTdata[25][1]++;
          } else if (currMW == "JOY") {
            MTdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MTdata[26][0]++;
          } else if (currMM == "MEH") {
            MTdata[26][1]++;
          } else if (currMM == "JOY") {
            MTdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MTdata[27][0]++;
          } else if (currPM == "MEH") {
            MTdata[27][1]++;
          } else if (currPM == "JOY") {
            MTdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MTdata[28][0]++;
          } else if (currMK == "MEH") {
            MTdata[28][1]++;
          } else if (currMK == "JOY") {
            MTdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MTdata[29][0]++;
          } else if (currMG == "MEH") {
            MTdata[29][1]++;
          } else if (currMG == "JOY") {
            MTdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MTdata[30][0]++;
          } else if (currND == "MEH") {
            MTdata[30][1]++;
          } else if (currND == "JOY") {
            MTdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MTdata[31][0]++;
          } else if (currNC == "MEH") {
            MTdata[31][1]++;
          } else if (currNC == "JOY") {
            MTdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MTdata[32][0]++;
          } else if (currPP == "MEH") {
            MTdata[32][1]++;
          } else if (currPP == "JOY") {
            MTdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MTdata[33][0]++;
          } else if (currPS == "MEH") {
            MTdata[33][1]++;
          } else if (currPS == "JOY") {
            MTdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MTdata[34][0]++;
          } else if (currRC == "MEH") {
            MTdata[34][1]++;
          } else if (currRC == "JOY") {
            MTdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MTdata[35][0]++;
          } else if (currRP == "MEH") {
            MTdata[35][1]++;
          } else if (currRP == "JOY") {
            MTdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MTdata[36][0]++;
          } else if (currRL == "MEH") {
            MTdata[36][1]++;
          } else if (currRL == "JOY") {
            MTdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MTdata[37][0]++;
          } else if (currSK == "MEH") {
            MTdata[37][1]++;
          } else if (currSK == "JOY") {
            MTdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MTdata[38][0]++;
          } else if (currSN == "MEH") {
            MTdata[38][1]++;
          } else if (currSN == "JOY") {
            MTdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MTdata[39][0]++;
          } else if (currSP == "MEH") {
            MTdata[39][1]++;
          } else if (currSP == "JOY") {
            MTdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MTdata[40][0]++;
          } else if (currST == "MEH") {
            MTdata[40][1]++;
          } else if (currST == "JOY") {
            MTdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MTdata[41][0]++;
          } else if (currSF == "MEH") {
            MTdata[41][1]++;
          } else if (currSF == "JOY") {
            MTdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MTdata[42][0]++;
          } else if (currTT == "MEH") {
            MTdata[42][1]++;
          } else if (currTT == "JOY") {
            MTdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MTdata[43][0]++;
          } else if (currTM == "MEH") {
            MTdata[43][1]++;
          } else if (currTM == "JOY") {
            MTdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MTdata[44][0]++;
          } else if (currTB == "MEH") {
            MTdata[44][1]++;
          } else if (currTB == "JOY") {
            MTdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MTdata[45][0]++;
          } else if (currTM == "MEH") {
            MTdata[45][1]++;
          } else if (currTM == "JOY") {
            MTdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MTdata[46][0]++;
          } else if (currTW == "MEH") {
            MTdata[46][1]++;
          } else if (currTW == "JOY") {
            MTdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MTdata[47][0]++;
          } else if (currWM == "MEH") {
            MTdata[47][1]++;
          } else if (currWM == "JOY") {
            MTdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MTdata[48][0]++;
          } else if (currYP == "MEH") {
            MTdata[48][1]++;
          } else if (currYP == "JOY") {
            MTdata[48][2]++;
          }
  
        break;
      case "NE" :
          NEdata[0]++;

          if (currOut == "No") {
            NEdata[1][0]++;
          } else if (currOut = "Yes") {
            NEdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NEdata[2][0]++;
          } else if (currBF == "MEH") {
            NEdata[2][1]++;
          } else if (currBF == "JOY") {
            NEdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NEdata[3][0]++;
          } else if (currCC == "MEH") {
            NEdata[3][1]++;
          } else if (currCC == "JOY") {
            NEdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NEdata[4][0]++;
          } else if (currCL == "MEH") {
            NEdata[4][1]++;
          } else if (currCL == "JOY") {
            NEdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NEdata[5][0]++;
          } else if (currDT == "MEH") {
            NEdata[5][1]++;
          } else if (currDT == "JOY") {
            NEdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NEdata[6][0]++;
          } else if (currFP == "MEH") {
            NEdata[6][1]++;
          } else if (currFP == "JOY") {
            NEdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NEdata[7][0]++;
          } else if (currGP == "MEH") {
            NEdata[7][1]++;
          } else if (currGP == "JOY") {
            NEdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NEdata[8][0]++;
          } else if (currGB == "MEH") {
            NEdata[8][1]++;
          } else if (currGB == "JOY") {
            NEdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NEdata[9][0]++;
          } else if (currHF == "MEH") {
            NEdata[9][1]++;
          } else if (currHF == "JOY") {
            NEdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NEdata[10][0]++;
          } else if (currHB == "MEH") {
            NEdata[10][1]++;
          } else if (currHB == "JOY") {
            NEdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NEdata[11][0]++;
          } else if (currHD == "MEH") {
            NEdata[11][1]++;
          } else if (currHD == "JOY") {
            NEdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NEdata[12][0]++;
          } else if (currHM == "MEH") {
            NEdata[12][1]++;
          } else if (currHM == "JOY") {
            NEdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NEdata[13][0]++;
          } else if (currHK == "MEH") {
            NEdata[13][1]++;
          } else if (currHK == "JOY") {
            NEdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NEdata[14][0]++;
          } else if (currJB == "MEH") {
            NEdata[14][1]++;
          } else if (currJB == "JOY") {
            NEdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NEdata[15][0]++;
          } else if (currJG == "MEH") {
            NEdata[15][1]++;
          } else if (currJG == "JOY") {
            NEdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NEdata[16][0]++;
          } else if (currJM == "MEH") {
            NEdata[16][1]++;
          } else if (currJM == "JOY") {
            NEdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NEdata[17][0]++;
          } else if (currKK == "MEH") {
            NEdata[17][1]++;
          } else if (currKK == "JOY") {
            NEdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NEdata[18][0]++;
          } else if (currLT == "MEH") {
            NEdata[18][1]++;
          } else if (currLT == "JOY") {
            NEdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NEdata[19][0]++;
          } else if (currLH == "MEH") {
            NEdata[19][1]++;
          } else if (currLH == "JOY") {
            NEdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NEdata[20][0]++;
          } else if (currLN == "MEH") {
            NEdata[20][1]++;
          } else if (currLN == "JOY") {
            NEdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NEdata[21][0]++;
          } else if (currLB == "MEH") {
            NEdata[21][1]++;
          } else if (currLB == "JOY") {
            NEdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NEdata[22][0]++;
          } else if (currLP == "MEH") {
            NEdata[22][1]++;
          } else if (currLP == "JOY") {
            NEdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NEdata[23][0]++;
          } else if (currMI == "MEH") {
            NEdata[23][1]++;
          } else if (currMI == "JOY") {
            NEdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NEdata[24][0]++;
          } else if (currMD == "MEH") {
            NEdata[24][1]++;
          } else if (currMD == "JOY") {
            NEdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NEdata[25][0]++;
          } else if (currMW == "MEH") {
            NEdata[25][1]++;
          } else if (currMW == "JOY") {
            NEdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NEdata[26][0]++;
          } else if (currMM == "MEH") {
            NEdata[26][1]++;
          } else if (currMM == "JOY") {
            NEdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NEdata[27][0]++;
          } else if (currPM == "MEH") {
            NEdata[27][1]++;
          } else if (currPM == "JOY") {
            NEdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NEdata[28][0]++;
          } else if (currMK == "MEH") {
            NEdata[28][1]++;
          } else if (currMK == "JOY") {
            NEdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NEdata[29][0]++;
          } else if (currMG == "MEH") {
            NEdata[29][1]++;
          } else if (currMG == "JOY") {
            NEdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NEdata[30][0]++;
          } else if (currND == "MEH") {
            NEdata[30][1]++;
          } else if (currND == "JOY") {
            NEdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NEdata[31][0]++;
          } else if (currNC == "MEH") {
            NEdata[31][1]++;
          } else if (currNC == "JOY") {
            NEdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NEdata[32][0]++;
          } else if (currPP == "MEH") {
            NEdata[32][1]++;
          } else if (currPP == "JOY") {
            NEdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NEdata[33][0]++;
          } else if (currPS == "MEH") {
            NEdata[33][1]++;
          } else if (currPS == "JOY") {
            NEdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NEdata[34][0]++;
          } else if (currRC == "MEH") {
            NEdata[34][1]++;
          } else if (currRC == "JOY") {
            NEdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NEdata[35][0]++;
          } else if (currRP == "MEH") {
            NEdata[35][1]++;
          } else if (currRP == "JOY") {
            NEdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NEdata[36][0]++;
          } else if (currRL == "MEH") {
            NEdata[36][1]++;
          } else if (currRL == "JOY") {
            NEdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NEdata[37][0]++;
          } else if (currSK == "MEH") {
            NEdata[37][1]++;
          } else if (currSK == "JOY") {
            NEdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NEdata[38][0]++;
          } else if (currSN == "MEH") {
            NEdata[38][1]++;
          } else if (currSN == "JOY") {
            NEdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NEdata[39][0]++;
          } else if (currSP == "MEH") {
            NEdata[39][1]++;
          } else if (currSP == "JOY") {
            NEdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NEdata[40][0]++;
          } else if (currST == "MEH") {
            NEdata[40][1]++;
          } else if (currST == "JOY") {
            NEdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NEdata[41][0]++;
          } else if (currSF == "MEH") {
            NEdata[41][1]++;
          } else if (currSF == "JOY") {
            NEdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NEdata[42][0]++;
          } else if (currTT == "MEH") {
            NEdata[42][1]++;
          } else if (currTT == "JOY") {
            NEdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NEdata[43][0]++;
          } else if (currTM == "MEH") {
            NEdata[43][1]++;
          } else if (currTM == "JOY") {
            NEdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NEdata[44][0]++;
          } else if (currTB == "MEH") {
            NEdata[44][1]++;
          } else if (currTB == "JOY") {
            NEdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NEdata[45][0]++;
          } else if (currTM == "MEH") {
            NEdata[45][1]++;
          } else if (currTM == "JOY") {
            NEdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NEdata[46][0]++;
          } else if (currTW == "MEH") {
            NEdata[46][1]++;
          } else if (currTW == "JOY") {
            NEdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NEdata[47][0]++;
          } else if (currWM == "MEH") {
            NEdata[47][1]++;
          } else if (currWM == "JOY") {
            NEdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NEdata[48][0]++;
          } else if (currYP == "MEH") {
            NEdata[48][1]++;
          } else if (currYP == "JOY") {
            NEdata[48][2]++;
          }
  
        break;
      case "NV" :
          NVdata[0]++;

          if (currOut == "No") {
            NVdata[1][0]++;
          } else if (currOut = "Yes") {
            NVdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NVdata[2][0]++;
          } else if (currBF == "MEH") {
            NVdata[2][1]++;
          } else if (currBF == "JOY") {
            NVdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NVdata[3][0]++;
          } else if (currCC == "MEH") {
            NVdata[3][1]++;
          } else if (currCC == "JOY") {
            NVdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NVdata[4][0]++;
          } else if (currCL == "MEH") {
            NVdata[4][1]++;
          } else if (currCL == "JOY") {
            NVdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NVdata[5][0]++;
          } else if (currDT == "MEH") {
            NVdata[5][1]++;
          } else if (currDT == "JOY") {
            NVdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NVdata[6][0]++;
          } else if (currFP == "MEH") {
            NVdata[6][1]++;
          } else if (currFP == "JOY") {
            NVdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NVdata[7][0]++;
          } else if (currGP == "MEH") {
            NVdata[7][1]++;
          } else if (currGP == "JOY") {
            NVdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NVdata[8][0]++;
          } else if (currGB == "MEH") {
            NVdata[8][1]++;
          } else if (currGB == "JOY") {
            NVdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NVdata[9][0]++;
          } else if (currHF == "MEH") {
            NVdata[9][1]++;
          } else if (currHF == "JOY") {
            NVdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NVdata[10][0]++;
          } else if (currHB == "MEH") {
            NVdata[10][1]++;
          } else if (currHB == "JOY") {
            NVdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NVdata[11][0]++;
          } else if (currHD == "MEH") {
            NVdata[11][1]++;
          } else if (currHD == "JOY") {
            NVdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NVdata[12][0]++;
          } else if (currHM == "MEH") {
            NVdata[12][1]++;
          } else if (currHM == "JOY") {
            NVdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NVdata[13][0]++;
          } else if (currHK == "MEH") {
            NVdata[13][1]++;
          } else if (currHK == "JOY") {
            NVdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NVdata[14][0]++;
          } else if (currJB == "MEH") {
            NVdata[14][1]++;
          } else if (currJB == "JOY") {
            NVdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NVdata[15][0]++;
          } else if (currJG == "MEH") {
            NVdata[15][1]++;
          } else if (currJG == "JOY") {
            NVdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NVdata[16][0]++;
          } else if (currJM == "MEH") {
            NVdata[16][1]++;
          } else if (currJM == "JOY") {
            NVdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NVdata[17][0]++;
          } else if (currKK == "MEH") {
            NVdata[17][1]++;
          } else if (currKK == "JOY") {
            NVdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NVdata[18][0]++;
          } else if (currLT == "MEH") {
            NVdata[18][1]++;
          } else if (currLT == "JOY") {
            NVdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NVdata[19][0]++;
          } else if (currLH == "MEH") {
            NVdata[19][1]++;
          } else if (currLH == "JOY") {
            NVdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NVdata[20][0]++;
          } else if (currLN == "MEH") {
            NVdata[20][1]++;
          } else if (currLN == "JOY") {
            NVdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NVdata[21][0]++;
          } else if (currLB == "MEH") {
            NVdata[21][1]++;
          } else if (currLB == "JOY") {
            NVdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NVdata[22][0]++;
          } else if (currLP == "MEH") {
            NVdata[22][1]++;
          } else if (currLP == "JOY") {
            NVdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NVdata[23][0]++;
          } else if (currMI == "MEH") {
            NVdata[23][1]++;
          } else if (currMI == "JOY") {
            NVdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NVdata[24][0]++;
          } else if (currMD == "MEH") {
            NVdata[24][1]++;
          } else if (currMD == "JOY") {
            NVdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NVdata[25][0]++;
          } else if (currMW == "MEH") {
            NVdata[25][1]++;
          } else if (currMW == "JOY") {
            NVdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NVdata[26][0]++;
          } else if (currMM == "MEH") {
            NVdata[26][1]++;
          } else if (currMM == "JOY") {
            NVdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NVdata[27][0]++;
          } else if (currPM == "MEH") {
            NVdata[27][1]++;
          } else if (currPM == "JOY") {
            NVdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NVdata[28][0]++;
          } else if (currMK == "MEH") {
            NVdata[28][1]++;
          } else if (currMK == "JOY") {
            NVdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NVdata[29][0]++;
          } else if (currMG == "MEH") {
            NVdata[29][1]++;
          } else if (currMG == "JOY") {
            NVdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NVdata[30][0]++;
          } else if (currND == "MEH") {
            NVdata[30][1]++;
          } else if (currND == "JOY") {
            NVdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NVdata[31][0]++;
          } else if (currNC == "MEH") {
            NVdata[31][1]++;
          } else if (currNC == "JOY") {
            NVdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NVdata[32][0]++;
          } else if (currPP == "MEH") {
            NVdata[32][1]++;
          } else if (currPP == "JOY") {
            NVdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NVdata[33][0]++;
          } else if (currPS == "MEH") {
            NVdata[33][1]++;
          } else if (currPS == "JOY") {
            NVdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NVdata[34][0]++;
          } else if (currRC == "MEH") {
            NVdata[34][1]++;
          } else if (currRC == "JOY") {
            NVdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NVdata[35][0]++;
          } else if (currRP == "MEH") {
            NVdata[35][1]++;
          } else if (currRP == "JOY") {
            NVdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NVdata[36][0]++;
          } else if (currRL == "MEH") {
            NVdata[36][1]++;
          } else if (currRL == "JOY") {
            NVdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NVdata[37][0]++;
          } else if (currSK == "MEH") {
            NVdata[37][1]++;
          } else if (currSK == "JOY") {
            NVdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NVdata[38][0]++;
          } else if (currSN == "MEH") {
            NVdata[38][1]++;
          } else if (currSN == "JOY") {
            NVdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NVdata[39][0]++;
          } else if (currSP == "MEH") {
            NVdata[39][1]++;
          } else if (currSP == "JOY") {
            NVdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NVdata[40][0]++;
          } else if (currST == "MEH") {
            NVdata[40][1]++;
          } else if (currST == "JOY") {
            NVdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NVdata[41][0]++;
          } else if (currSF == "MEH") {
            NVdata[41][1]++;
          } else if (currSF == "JOY") {
            NVdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NVdata[42][0]++;
          } else if (currTT == "MEH") {
            NVdata[42][1]++;
          } else if (currTT == "JOY") {
            NVdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NVdata[43][0]++;
          } else if (currTM == "MEH") {
            NVdata[43][1]++;
          } else if (currTM == "JOY") {
            NVdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NVdata[44][0]++;
          } else if (currTB == "MEH") {
            NVdata[44][1]++;
          } else if (currTB == "JOY") {
            NVdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NVdata[45][0]++;
          } else if (currTM == "MEH") {
            NVdata[45][1]++;
          } else if (currTM == "JOY") {
            NVdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NVdata[46][0]++;
          } else if (currTW == "MEH") {
            NVdata[46][1]++;
          } else if (currTW == "JOY") {
            NVdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NVdata[47][0]++;
          } else if (currWM == "MEH") {
            NVdata[47][1]++;
          } else if (currWM == "JOY") {
            NVdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NVdata[48][0]++;
          } else if (currYP == "MEH") {
            NVdata[48][1]++;
          } else if (currYP == "JOY") {
            NVdata[48][2]++;
          }
  
        break;
      case "NH" :
          NHdata[0]++;

          if (currOut == "No") {
            NHdata[1][0]++;
          } else if (currOut = "Yes") {
            NHdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NHdata[2][0]++;
          } else if (currBF == "MEH") {
            NHdata[2][1]++;
          } else if (currBF == "JOY") {
            NHdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NHdata[3][0]++;
          } else if (currCC == "MEH") {
            NHdata[3][1]++;
          } else if (currCC == "JOY") {
            NHdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NHdata[4][0]++;
          } else if (currCL == "MEH") {
            NHdata[4][1]++;
          } else if (currCL == "JOY") {
            NHdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NHdata[5][0]++;
          } else if (currDT == "MEH") {
            NHdata[5][1]++;
          } else if (currDT == "JOY") {
            NHdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NHdata[6][0]++;
          } else if (currFP == "MEH") {
            NHdata[6][1]++;
          } else if (currFP == "JOY") {
            NHdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NHdata[7][0]++;
          } else if (currGP == "MEH") {
            NHdata[7][1]++;
          } else if (currGP == "JOY") {
            NHdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NHdata[8][0]++;
          } else if (currGB == "MEH") {
            NHdata[8][1]++;
          } else if (currGB == "JOY") {
            NHdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NHdata[9][0]++;
          } else if (currHF == "MEH") {
            NHdata[9][1]++;
          } else if (currHF == "JOY") {
            NHdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NHdata[10][0]++;
          } else if (currHB == "MEH") {
            NHdata[10][1]++;
          } else if (currHB == "JOY") {
            NHdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NHdata[11][0]++;
          } else if (currHD == "MEH") {
            NHdata[11][1]++;
          } else if (currHD == "JOY") {
            NHdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NHdata[12][0]++;
          } else if (currHM == "MEH") {
            NHdata[12][1]++;
          } else if (currHM == "JOY") {
            NHdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NHdata[13][0]++;
          } else if (currHK == "MEH") {
            NHdata[13][1]++;
          } else if (currHK == "JOY") {
            NHdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NHdata[14][0]++;
          } else if (currJB == "MEH") {
            NHdata[14][1]++;
          } else if (currJB == "JOY") {
            NHdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NHdata[15][0]++;
          } else if (currJG == "MEH") {
            NHdata[15][1]++;
          } else if (currJG == "JOY") {
            NHdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NHdata[16][0]++;
          } else if (currJM == "MEH") {
            NHdata[16][1]++;
          } else if (currJM == "JOY") {
            NHdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NHdata[17][0]++;
          } else if (currKK == "MEH") {
            NHdata[17][1]++;
          } else if (currKK == "JOY") {
            NHdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NHdata[18][0]++;
          } else if (currLT == "MEH") {
            NHdata[18][1]++;
          } else if (currLT == "JOY") {
            NHdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NHdata[19][0]++;
          } else if (currLH == "MEH") {
            NHdata[19][1]++;
          } else if (currLH == "JOY") {
            NHdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NHdata[20][0]++;
          } else if (currLN == "MEH") {
            NHdata[20][1]++;
          } else if (currLN == "JOY") {
            NHdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NHdata[21][0]++;
          } else if (currLB == "MEH") {
            NHdata[21][1]++;
          } else if (currLB == "JOY") {
            NHdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NHdata[22][0]++;
          } else if (currLP == "MEH") {
            NHdata[22][1]++;
          } else if (currLP == "JOY") {
            NHdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NHdata[23][0]++;
          } else if (currMI == "MEH") {
            NHdata[23][1]++;
          } else if (currMI == "JOY") {
            NHdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NHdata[24][0]++;
          } else if (currMD == "MEH") {
            NHdata[24][1]++;
          } else if (currMD == "JOY") {
            NHdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NHdata[25][0]++;
          } else if (currMW == "MEH") {
            NHdata[25][1]++;
          } else if (currMW == "JOY") {
            NHdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NHdata[26][0]++;
          } else if (currMM == "MEH") {
            NHdata[26][1]++;
          } else if (currMM == "JOY") {
            NHdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NHdata[27][0]++;
          } else if (currPM == "MEH") {
            NHdata[27][1]++;
          } else if (currPM == "JOY") {
            NHdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NHdata[28][0]++;
          } else if (currMK == "MEH") {
            NHdata[28][1]++;
          } else if (currMK == "JOY") {
            NHdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NHdata[29][0]++;
          } else if (currMG == "MEH") {
            NHdata[29][1]++;
          } else if (currMG == "JOY") {
            NHdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NHdata[30][0]++;
          } else if (currND == "MEH") {
            NHdata[30][1]++;
          } else if (currND == "JOY") {
            NHdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NHdata[31][0]++;
          } else if (currNC == "MEH") {
            NHdata[31][1]++;
          } else if (currNC == "JOY") {
            NHdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NHdata[32][0]++;
          } else if (currPP == "MEH") {
            NHdata[32][1]++;
          } else if (currPP == "JOY") {
            NHdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NHdata[33][0]++;
          } else if (currPS == "MEH") {
            NHdata[33][1]++;
          } else if (currPS == "JOY") {
            NHdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NHdata[34][0]++;
          } else if (currRC == "MEH") {
            NHdata[34][1]++;
          } else if (currRC == "JOY") {
            NHdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NHdata[35][0]++;
          } else if (currRP == "MEH") {
            NHdata[35][1]++;
          } else if (currRP == "JOY") {
            NHdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NHdata[36][0]++;
          } else if (currRL == "MEH") {
            NHdata[36][1]++;
          } else if (currRL == "JOY") {
            NHdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NHdata[37][0]++;
          } else if (currSK == "MEH") {
            NHdata[37][1]++;
          } else if (currSK == "JOY") {
            NHdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NHdata[38][0]++;
          } else if (currSN == "MEH") {
            NHdata[38][1]++;
          } else if (currSN == "JOY") {
            NHdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NHdata[39][0]++;
          } else if (currSP == "MEH") {
            NHdata[39][1]++;
          } else if (currSP == "JOY") {
            NHdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NHdata[40][0]++;
          } else if (currST == "MEH") {
            NHdata[40][1]++;
          } else if (currST == "JOY") {
            NHdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NHdata[41][0]++;
          } else if (currSF == "MEH") {
            NHdata[41][1]++;
          } else if (currSF == "JOY") {
            NHdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NHdata[42][0]++;
          } else if (currTT == "MEH") {
            NHdata[42][1]++;
          } else if (currTT == "JOY") {
            NHdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NHdata[43][0]++;
          } else if (currTM == "MEH") {
            NHdata[43][1]++;
          } else if (currTM == "JOY") {
            NHdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NHdata[44][0]++;
          } else if (currTB == "MEH") {
            NHdata[44][1]++;
          } else if (currTB == "JOY") {
            NHdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NHdata[45][0]++;
          } else if (currTM == "MEH") {
            NHdata[45][1]++;
          } else if (currTM == "JOY") {
            NHdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NHdata[46][0]++;
          } else if (currTW == "MEH") {
            NHdata[46][1]++;
          } else if (currTW == "JOY") {
            NHdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NHdata[47][0]++;
          } else if (currWM == "MEH") {
            NHdata[47][1]++;
          } else if (currWM == "JOY") {
            NHdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NHdata[48][0]++;
          } else if (currYP == "MEH") {
            NHdata[48][1]++;
          } else if (currYP == "JOY") {
            NHdata[48][2]++;
          }
  
        break;
      case "NJ" :
          NJdata[0]++;

          if (currOut == "No") {
            NJdata[1][0]++;
          } else if (currOut = "Yes") {
            NJdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NJdata[2][0]++;
          } else if (currBF == "MEH") {
            NJdata[2][1]++;
          } else if (currBF == "JOY") {
            NJdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NJdata[3][0]++;
          } else if (currCC == "MEH") {
            NJdata[3][1]++;
          } else if (currCC == "JOY") {
            NJdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NJdata[4][0]++;
          } else if (currCL == "MEH") {
            NJdata[4][1]++;
          } else if (currCL == "JOY") {
            NJdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NJdata[5][0]++;
          } else if (currDT == "MEH") {
            NJdata[5][1]++;
          } else if (currDT == "JOY") {
            NJdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NJdata[6][0]++;
          } else if (currFP == "MEH") {
            NJdata[6][1]++;
          } else if (currFP == "JOY") {
            NJdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NJdata[7][0]++;
          } else if (currGP == "MEH") {
            NJdata[7][1]++;
          } else if (currGP == "JOY") {
            NJdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NJdata[8][0]++;
          } else if (currGB == "MEH") {
            NJdata[8][1]++;
          } else if (currGB == "JOY") {
            NJdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NJdata[9][0]++;
          } else if (currHF == "MEH") {
            NJdata[9][1]++;
          } else if (currHF == "JOY") {
            NJdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NJdata[10][0]++;
          } else if (currHB == "MEH") {
            NJdata[10][1]++;
          } else if (currHB == "JOY") {
            NJdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NJdata[11][0]++;
          } else if (currHD == "MEH") {
            NJdata[11][1]++;
          } else if (currHD == "JOY") {
            NJdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NJdata[12][0]++;
          } else if (currHM == "MEH") {
            NJdata[12][1]++;
          } else if (currHM == "JOY") {
            NJdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NJdata[13][0]++;
          } else if (currHK == "MEH") {
            NJdata[13][1]++;
          } else if (currHK == "JOY") {
            NJdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NJdata[14][0]++;
          } else if (currJB == "MEH") {
            NJdata[14][1]++;
          } else if (currJB == "JOY") {
            NJdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NJdata[15][0]++;
          } else if (currJG == "MEH") {
            NJdata[15][1]++;
          } else if (currJG == "JOY") {
            NJdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NJdata[16][0]++;
          } else if (currJM == "MEH") {
            NJdata[16][1]++;
          } else if (currJM == "JOY") {
            NJdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NJdata[17][0]++;
          } else if (currKK == "MEH") {
            NJdata[17][1]++;
          } else if (currKK == "JOY") {
            NJdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NJdata[18][0]++;
          } else if (currLT == "MEH") {
            NJdata[18][1]++;
          } else if (currLT == "JOY") {
            NJdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NJdata[19][0]++;
          } else if (currLH == "MEH") {
            NJdata[19][1]++;
          } else if (currLH == "JOY") {
            NJdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NJdata[20][0]++;
          } else if (currLN == "MEH") {
            NJdata[20][1]++;
          } else if (currLN == "JOY") {
            NJdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NJdata[21][0]++;
          } else if (currLB == "MEH") {
            NJdata[21][1]++;
          } else if (currLB == "JOY") {
            NJdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NJdata[22][0]++;
          } else if (currLP == "MEH") {
            NJdata[22][1]++;
          } else if (currLP == "JOY") {
            NJdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NJdata[23][0]++;
          } else if (currMI == "MEH") {
            NJdata[23][1]++;
          } else if (currMI == "JOY") {
            NJdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NJdata[24][0]++;
          } else if (currMD == "MEH") {
            NJdata[24][1]++;
          } else if (currMD == "JOY") {
            NJdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NJdata[25][0]++;
          } else if (currMW == "MEH") {
            NJdata[25][1]++;
          } else if (currMW == "JOY") {
            NJdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NJdata[26][0]++;
          } else if (currMM == "MEH") {
            NJdata[26][1]++;
          } else if (currMM == "JOY") {
            NJdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NJdata[27][0]++;
          } else if (currPM == "MEH") {
            NJdata[27][1]++;
          } else if (currPM == "JOY") {
            NJdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NJdata[28][0]++;
          } else if (currMK == "MEH") {
            NJdata[28][1]++;
          } else if (currMK == "JOY") {
            NJdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NJdata[29][0]++;
          } else if (currMG == "MEH") {
            NJdata[29][1]++;
          } else if (currMG == "JOY") {
            NJdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NJdata[30][0]++;
          } else if (currND == "MEH") {
            NJdata[30][1]++;
          } else if (currND == "JOY") {
            NJdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NJdata[31][0]++;
          } else if (currNC == "MEH") {
            NJdata[31][1]++;
          } else if (currNC == "JOY") {
            NJdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NJdata[32][0]++;
          } else if (currPP == "MEH") {
            NJdata[32][1]++;
          } else if (currPP == "JOY") {
            NJdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NJdata[33][0]++;
          } else if (currPS == "MEH") {
            NJdata[33][1]++;
          } else if (currPS == "JOY") {
            NJdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NJdata[34][0]++;
          } else if (currRC == "MEH") {
            NJdata[34][1]++;
          } else if (currRC == "JOY") {
            NJdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NJdata[35][0]++;
          } else if (currRP == "MEH") {
            NJdata[35][1]++;
          } else if (currRP == "JOY") {
            NJdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NJdata[36][0]++;
          } else if (currRL == "MEH") {
            NJdata[36][1]++;
          } else if (currRL == "JOY") {
            NJdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NJdata[37][0]++;
          } else if (currSK == "MEH") {
            NJdata[37][1]++;
          } else if (currSK == "JOY") {
            NJdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NJdata[38][0]++;
          } else if (currSN == "MEH") {
            NJdata[38][1]++;
          } else if (currSN == "JOY") {
            NJdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NJdata[39][0]++;
          } else if (currSP == "MEH") {
            NJdata[39][1]++;
          } else if (currSP == "JOY") {
            NJdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NJdata[40][0]++;
          } else if (currST == "MEH") {
            NJdata[40][1]++;
          } else if (currST == "JOY") {
            NJdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NJdata[41][0]++;
          } else if (currSF == "MEH") {
            NJdata[41][1]++;
          } else if (currSF == "JOY") {
            NJdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NJdata[42][0]++;
          } else if (currTT == "MEH") {
            NJdata[42][1]++;
          } else if (currTT == "JOY") {
            NJdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NJdata[43][0]++;
          } else if (currTM == "MEH") {
            NJdata[43][1]++;
          } else if (currTM == "JOY") {
            NJdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NJdata[44][0]++;
          } else if (currTB == "MEH") {
            NJdata[44][1]++;
          } else if (currTB == "JOY") {
            NJdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NJdata[45][0]++;
          } else if (currTM == "MEH") {
            NJdata[45][1]++;
          } else if (currTM == "JOY") {
            NJdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NJdata[46][0]++;
          } else if (currTW == "MEH") {
            NJdata[46][1]++;
          } else if (currTW == "JOY") {
            NJdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NJdata[47][0]++;
          } else if (currWM == "MEH") {
            NJdata[47][1]++;
          } else if (currWM == "JOY") {
            NJdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NJdata[48][0]++;
          } else if (currYP == "MEH") {
            NJdata[48][1]++;
          } else if (currYP == "JOY") {
            NJdata[48][2]++;
          }
  
        break;
      case "NM" :
          NMdata[0]++;

          if (currOut == "No") {
            NMdata[1][0]++;
          } else if (currOut = "Yes") {
            NMdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NMdata[2][0]++;
          } else if (currBF == "MEH") {
            NMdata[2][1]++;
          } else if (currBF == "JOY") {
            NMdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NMdata[3][0]++;
          } else if (currCC == "MEH") {
            NMdata[3][1]++;
          } else if (currCC == "JOY") {
            NMdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NMdata[4][0]++;
          } else if (currCL == "MEH") {
            NMdata[4][1]++;
          } else if (currCL == "JOY") {
            NMdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NMdata[5][0]++;
          } else if (currDT == "MEH") {
            NMdata[5][1]++;
          } else if (currDT == "JOY") {
            NMdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NMdata[6][0]++;
          } else if (currFP == "MEH") {
            NMdata[6][1]++;
          } else if (currFP == "JOY") {
            NMdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NMdata[7][0]++;
          } else if (currGP == "MEH") {
            NMdata[7][1]++;
          } else if (currGP == "JOY") {
            NMdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NMdata[8][0]++;
          } else if (currGB == "MEH") {
            NMdata[8][1]++;
          } else if (currGB == "JOY") {
            NMdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NMdata[9][0]++;
          } else if (currHF == "MEH") {
            NMdata[9][1]++;
          } else if (currHF == "JOY") {
            NMdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NMdata[10][0]++;
          } else if (currHB == "MEH") {
            NMdata[10][1]++;
          } else if (currHB == "JOY") {
            NMdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NMdata[11][0]++;
          } else if (currHD == "MEH") {
            NMdata[11][1]++;
          } else if (currHD == "JOY") {
            NMdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NMdata[12][0]++;
          } else if (currHM == "MEH") {
            NMdata[12][1]++;
          } else if (currHM == "JOY") {
            NMdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NMdata[13][0]++;
          } else if (currHK == "MEH") {
            NMdata[13][1]++;
          } else if (currHK == "JOY") {
            NMdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NMdata[14][0]++;
          } else if (currJB == "MEH") {
            NMdata[14][1]++;
          } else if (currJB == "JOY") {
            NMdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NMdata[15][0]++;
          } else if (currJG == "MEH") {
            NMdata[15][1]++;
          } else if (currJG == "JOY") {
            NMdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NMdata[16][0]++;
          } else if (currJM == "MEH") {
            NMdata[16][1]++;
          } else if (currJM == "JOY") {
            NMdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NMdata[17][0]++;
          } else if (currKK == "MEH") {
            NMdata[17][1]++;
          } else if (currKK == "JOY") {
            NMdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NMdata[18][0]++;
          } else if (currLT == "MEH") {
            NMdata[18][1]++;
          } else if (currLT == "JOY") {
            NMdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NMdata[19][0]++;
          } else if (currLH == "MEH") {
            NMdata[19][1]++;
          } else if (currLH == "JOY") {
            NMdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NMdata[20][0]++;
          } else if (currLN == "MEH") {
            NMdata[20][1]++;
          } else if (currLN == "JOY") {
            NMdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NMdata[21][0]++;
          } else if (currLB == "MEH") {
            NMdata[21][1]++;
          } else if (currLB == "JOY") {
            NMdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NMdata[22][0]++;
          } else if (currLP == "MEH") {
            NMdata[22][1]++;
          } else if (currLP == "JOY") {
            NMdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NMdata[23][0]++;
          } else if (currMI == "MEH") {
            NMdata[23][1]++;
          } else if (currMI == "JOY") {
            NMdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NMdata[24][0]++;
          } else if (currMD == "MEH") {
            NMdata[24][1]++;
          } else if (currMD == "JOY") {
            NMdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NMdata[25][0]++;
          } else if (currMW == "MEH") {
            NMdata[25][1]++;
          } else if (currMW == "JOY") {
            NMdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NMdata[26][0]++;
          } else if (currMM == "MEH") {
            NMdata[26][1]++;
          } else if (currMM == "JOY") {
            NMdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NMdata[27][0]++;
          } else if (currPM == "MEH") {
            NMdata[27][1]++;
          } else if (currPM == "JOY") {
            NMdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NMdata[28][0]++;
          } else if (currMK == "MEH") {
            NMdata[28][1]++;
          } else if (currMK == "JOY") {
            NMdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NMdata[29][0]++;
          } else if (currMG == "MEH") {
            NMdata[29][1]++;
          } else if (currMG == "JOY") {
            NMdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NMdata[30][0]++;
          } else if (currND == "MEH") {
            NMdata[30][1]++;
          } else if (currND == "JOY") {
            NMdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NMdata[31][0]++;
          } else if (currNC == "MEH") {
            NMdata[31][1]++;
          } else if (currNC == "JOY") {
            NMdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NMdata[32][0]++;
          } else if (currPP == "MEH") {
            NMdata[32][1]++;
          } else if (currPP == "JOY") {
            NMdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NMdata[33][0]++;
          } else if (currPS == "MEH") {
            NMdata[33][1]++;
          } else if (currPS == "JOY") {
            NMdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NMdata[34][0]++;
          } else if (currRC == "MEH") {
            NMdata[34][1]++;
          } else if (currRC == "JOY") {
            NMdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NMdata[35][0]++;
          } else if (currRP == "MEH") {
            NMdata[35][1]++;
          } else if (currRP == "JOY") {
            NMdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NMdata[36][0]++;
          } else if (currRL == "MEH") {
            NMdata[36][1]++;
          } else if (currRL == "JOY") {
            NMdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NMdata[37][0]++;
          } else if (currSK == "MEH") {
            NMdata[37][1]++;
          } else if (currSK == "JOY") {
            NMdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NMdata[38][0]++;
          } else if (currSN == "MEH") {
            NMdata[38][1]++;
          } else if (currSN == "JOY") {
            NMdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NMdata[39][0]++;
          } else if (currSP == "MEH") {
            NMdata[39][1]++;
          } else if (currSP == "JOY") {
            NMdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NMdata[40][0]++;
          } else if (currST == "MEH") {
            NMdata[40][1]++;
          } else if (currST == "JOY") {
            NMdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NMdata[41][0]++;
          } else if (currSF == "MEH") {
            NMdata[41][1]++;
          } else if (currSF == "JOY") {
            NMdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NMdata[42][0]++;
          } else if (currTT == "MEH") {
            NMdata[42][1]++;
          } else if (currTT == "JOY") {
            NMdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NMdata[43][0]++;
          } else if (currTM == "MEH") {
            NMdata[43][1]++;
          } else if (currTM == "JOY") {
            NMdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NMdata[44][0]++;
          } else if (currTB == "MEH") {
            NMdata[44][1]++;
          } else if (currTB == "JOY") {
            NMdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NMdata[45][0]++;
          } else if (currTM == "MEH") {
            NMdata[45][1]++;
          } else if (currTM == "JOY") {
            NMdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NMdata[46][0]++;
          } else if (currTW == "MEH") {
            NMdata[46][1]++;
          } else if (currTW == "JOY") {
            NMdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NMdata[47][0]++;
          } else if (currWM == "MEH") {
            NMdata[47][1]++;
          } else if (currWM == "JOY") {
            NMdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NMdata[48][0]++;
          } else if (currYP == "MEH") {
            NMdata[48][1]++;
          } else if (currYP == "JOY") {
            NMdata[48][2]++;
          }
  
        break;
      case "NY" :
          NYdata[0]++;

          if (currOut == "No") {
            NYdata[1][0]++;
          } else if (currOut = "Yes") {
            NYdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NYdata[2][0]++;
          } else if (currBF == "MEH") {
            NYdata[2][1]++;
          } else if (currBF == "JOY") {
            NYdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NYdata[3][0]++;
          } else if (currCC == "MEH") {
            NYdata[3][1]++;
          } else if (currCC == "JOY") {
            NYdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NYdata[4][0]++;
          } else if (currCL == "MEH") {
            NYdata[4][1]++;
          } else if (currCL == "JOY") {
            NYdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NYdata[5][0]++;
          } else if (currDT == "MEH") {
            NYdata[5][1]++;
          } else if (currDT == "JOY") {
            NYdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NYdata[6][0]++;
          } else if (currFP == "MEH") {
            NYdata[6][1]++;
          } else if (currFP == "JOY") {
            NYdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NYdata[7][0]++;
          } else if (currGP == "MEH") {
            NYdata[7][1]++;
          } else if (currGP == "JOY") {
            NYdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NYdata[8][0]++;
          } else if (currGB == "MEH") {
            NYdata[8][1]++;
          } else if (currGB == "JOY") {
            NYdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NYdata[9][0]++;
          } else if (currHF == "MEH") {
            NYdata[9][1]++;
          } else if (currHF == "JOY") {
            NYdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NYdata[10][0]++;
          } else if (currHB == "MEH") {
            NYdata[10][1]++;
          } else if (currHB == "JOY") {
            NYdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NYdata[11][0]++;
          } else if (currHD == "MEH") {
            NYdata[11][1]++;
          } else if (currHD == "JOY") {
            NYdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NYdata[12][0]++;
          } else if (currHM == "MEH") {
            NYdata[12][1]++;
          } else if (currHM == "JOY") {
            NYdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NYdata[13][0]++;
          } else if (currHK == "MEH") {
            NYdata[13][1]++;
          } else if (currHK == "JOY") {
            NYdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NYdata[14][0]++;
          } else if (currJB == "MEH") {
            NYdata[14][1]++;
          } else if (currJB == "JOY") {
            NYdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NYdata[15][0]++;
          } else if (currJG == "MEH") {
            NYdata[15][1]++;
          } else if (currJG == "JOY") {
            NYdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NYdata[16][0]++;
          } else if (currJM == "MEH") {
            NYdata[16][1]++;
          } else if (currJM == "JOY") {
            NYdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NYdata[17][0]++;
          } else if (currKK == "MEH") {
            NYdata[17][1]++;
          } else if (currKK == "JOY") {
            NYdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NYdata[18][0]++;
          } else if (currLT == "MEH") {
            NYdata[18][1]++;
          } else if (currLT == "JOY") {
            NYdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NYdata[19][0]++;
          } else if (currLH == "MEH") {
            NYdata[19][1]++;
          } else if (currLH == "JOY") {
            NYdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NYdata[20][0]++;
          } else if (currLN == "MEH") {
            NYdata[20][1]++;
          } else if (currLN == "JOY") {
            NYdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NYdata[21][0]++;
          } else if (currLB == "MEH") {
            NYdata[21][1]++;
          } else if (currLB == "JOY") {
            NYdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NYdata[22][0]++;
          } else if (currLP == "MEH") {
            NYdata[22][1]++;
          } else if (currLP == "JOY") {
            NYdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NYdata[23][0]++;
          } else if (currMI == "MEH") {
            NYdata[23][1]++;
          } else if (currMI == "JOY") {
            NYdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NYdata[24][0]++;
          } else if (currMD == "MEH") {
            NYdata[24][1]++;
          } else if (currMD == "JOY") {
            NYdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NYdata[25][0]++;
          } else if (currMW == "MEH") {
            NYdata[25][1]++;
          } else if (currMW == "JOY") {
            NYdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NYdata[26][0]++;
          } else if (currMM == "MEH") {
            NYdata[26][1]++;
          } else if (currMM == "JOY") {
            NYdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NYdata[27][0]++;
          } else if (currPM == "MEH") {
            NYdata[27][1]++;
          } else if (currPM == "JOY") {
            NYdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NYdata[28][0]++;
          } else if (currMK == "MEH") {
            NYdata[28][1]++;
          } else if (currMK == "JOY") {
            NYdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NYdata[29][0]++;
          } else if (currMG == "MEH") {
            NYdata[29][1]++;
          } else if (currMG == "JOY") {
            NYdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NYdata[30][0]++;
          } else if (currND == "MEH") {
            NYdata[30][1]++;
          } else if (currND == "JOY") {
            NYdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NYdata[31][0]++;
          } else if (currNC == "MEH") {
            NYdata[31][1]++;
          } else if (currNC == "JOY") {
            NYdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NYdata[32][0]++;
          } else if (currPP == "MEH") {
            NYdata[32][1]++;
          } else if (currPP == "JOY") {
            NYdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NYdata[33][0]++;
          } else if (currPS == "MEH") {
            NYdata[33][1]++;
          } else if (currPS == "JOY") {
            NYdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NYdata[34][0]++;
          } else if (currRC == "MEH") {
            NYdata[34][1]++;
          } else if (currRC == "JOY") {
            NYdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NYdata[35][0]++;
          } else if (currRP == "MEH") {
            NYdata[35][1]++;
          } else if (currRP == "JOY") {
            NYdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NYdata[36][0]++;
          } else if (currRL == "MEH") {
            NYdata[36][1]++;
          } else if (currRL == "JOY") {
            NYdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NYdata[37][0]++;
          } else if (currSK == "MEH") {
            NYdata[37][1]++;
          } else if (currSK == "JOY") {
            NYdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NYdata[38][0]++;
          } else if (currSN == "MEH") {
            NYdata[38][1]++;
          } else if (currSN == "JOY") {
            NYdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NYdata[39][0]++;
          } else if (currSP == "MEH") {
            NYdata[39][1]++;
          } else if (currSP == "JOY") {
            NYdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NYdata[40][0]++;
          } else if (currST == "MEH") {
            NYdata[40][1]++;
          } else if (currST == "JOY") {
            NYdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NYdata[41][0]++;
          } else if (currSF == "MEH") {
            NYdata[41][1]++;
          } else if (currSF == "JOY") {
            NYdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NYdata[42][0]++;
          } else if (currTT == "MEH") {
            NYdata[42][1]++;
          } else if (currTT == "JOY") {
            NYdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NYdata[43][0]++;
          } else if (currTM == "MEH") {
            NYdata[43][1]++;
          } else if (currTM == "JOY") {
            NYdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NYdata[44][0]++;
          } else if (currTB == "MEH") {
            NYdata[44][1]++;
          } else if (currTB == "JOY") {
            NYdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NYdata[45][0]++;
          } else if (currTM == "MEH") {
            NYdata[45][1]++;
          } else if (currTM == "JOY") {
            NYdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NYdata[46][0]++;
          } else if (currTW == "MEH") {
            NYdata[46][1]++;
          } else if (currTW == "JOY") {
            NYdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NYdata[47][0]++;
          } else if (currWM == "MEH") {
            NYdata[47][1]++;
          } else if (currWM == "JOY") {
            NYdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NYdata[48][0]++;
          } else if (currYP == "MEH") {
            NYdata[48][1]++;
          } else if (currYP == "JOY") {
            NYdata[48][2]++;
          }
  
        break;
      case "NC" :
          NCdata[0]++;

          if (currOut == "No") {
            NCdata[1][0]++;
          } else if (currOut = "Yes") {
            NCdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NCdata[2][0]++;
          } else if (currBF == "MEH") {
            NCdata[2][1]++;
          } else if (currBF == "JOY") {
            NCdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NCdata[3][0]++;
          } else if (currCC == "MEH") {
            NCdata[3][1]++;
          } else if (currCC == "JOY") {
            NCdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NCdata[4][0]++;
          } else if (currCL == "MEH") {
            NCdata[4][1]++;
          } else if (currCL == "JOY") {
            NCdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NCdata[5][0]++;
          } else if (currDT == "MEH") {
            NCdata[5][1]++;
          } else if (currDT == "JOY") {
            NCdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NCdata[6][0]++;
          } else if (currFP == "MEH") {
            NCdata[6][1]++;
          } else if (currFP == "JOY") {
            NCdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NCdata[7][0]++;
          } else if (currGP == "MEH") {
            NCdata[7][1]++;
          } else if (currGP == "JOY") {
            NCdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NCdata[8][0]++;
          } else if (currGB == "MEH") {
            NCdata[8][1]++;
          } else if (currGB == "JOY") {
            NCdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NCdata[9][0]++;
          } else if (currHF == "MEH") {
            NCdata[9][1]++;
          } else if (currHF == "JOY") {
            NCdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NCdata[10][0]++;
          } else if (currHB == "MEH") {
            NCdata[10][1]++;
          } else if (currHB == "JOY") {
            NCdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NCdata[11][0]++;
          } else if (currHD == "MEH") {
            NCdata[11][1]++;
          } else if (currHD == "JOY") {
            NCdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NCdata[12][0]++;
          } else if (currHM == "MEH") {
            NCdata[12][1]++;
          } else if (currHM == "JOY") {
            NCdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NCdata[13][0]++;
          } else if (currHK == "MEH") {
            NCdata[13][1]++;
          } else if (currHK == "JOY") {
            NCdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NCdata[14][0]++;
          } else if (currJB == "MEH") {
            NCdata[14][1]++;
          } else if (currJB == "JOY") {
            NCdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NCdata[15][0]++;
          } else if (currJG == "MEH") {
            NCdata[15][1]++;
          } else if (currJG == "JOY") {
            NCdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NCdata[16][0]++;
          } else if (currJM == "MEH") {
            NCdata[16][1]++;
          } else if (currJM == "JOY") {
            NCdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NCdata[17][0]++;
          } else if (currKK == "MEH") {
            NCdata[17][1]++;
          } else if (currKK == "JOY") {
            NCdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NCdata[18][0]++;
          } else if (currLT == "MEH") {
            NCdata[18][1]++;
          } else if (currLT == "JOY") {
            NCdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NCdata[19][0]++;
          } else if (currLH == "MEH") {
            NCdata[19][1]++;
          } else if (currLH == "JOY") {
            NCdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NCdata[20][0]++;
          } else if (currLN == "MEH") {
            NCdata[20][1]++;
          } else if (currLN == "JOY") {
            NCdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NCdata[21][0]++;
          } else if (currLB == "MEH") {
            NCdata[21][1]++;
          } else if (currLB == "JOY") {
            NCdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NCdata[22][0]++;
          } else if (currLP == "MEH") {
            NCdata[22][1]++;
          } else if (currLP == "JOY") {
            NCdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NCdata[23][0]++;
          } else if (currMI == "MEH") {
            NCdata[23][1]++;
          } else if (currMI == "JOY") {
            NCdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NCdata[24][0]++;
          } else if (currMD == "MEH") {
            NCdata[24][1]++;
          } else if (currMD == "JOY") {
            NCdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NCdata[25][0]++;
          } else if (currMW == "MEH") {
            NCdata[25][1]++;
          } else if (currMW == "JOY") {
            NCdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NCdata[26][0]++;
          } else if (currMM == "MEH") {
            NCdata[26][1]++;
          } else if (currMM == "JOY") {
            NCdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NCdata[27][0]++;
          } else if (currPM == "MEH") {
            NCdata[27][1]++;
          } else if (currPM == "JOY") {
            NCdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NCdata[28][0]++;
          } else if (currMK == "MEH") {
            NCdata[28][1]++;
          } else if (currMK == "JOY") {
            NCdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NCdata[29][0]++;
          } else if (currMG == "MEH") {
            NCdata[29][1]++;
          } else if (currMG == "JOY") {
            NCdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NCdata[30][0]++;
          } else if (currND == "MEH") {
            NCdata[30][1]++;
          } else if (currND == "JOY") {
            NCdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NCdata[31][0]++;
          } else if (currNC == "MEH") {
            NCdata[31][1]++;
          } else if (currNC == "JOY") {
            NCdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NCdata[32][0]++;
          } else if (currPP == "MEH") {
            NCdata[32][1]++;
          } else if (currPP == "JOY") {
            NCdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NCdata[33][0]++;
          } else if (currPS == "MEH") {
            NCdata[33][1]++;
          } else if (currPS == "JOY") {
            NCdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NCdata[34][0]++;
          } else if (currRC == "MEH") {
            NCdata[34][1]++;
          } else if (currRC == "JOY") {
            NCdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NCdata[35][0]++;
          } else if (currRP == "MEH") {
            NCdata[35][1]++;
          } else if (currRP == "JOY") {
            NCdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NCdata[36][0]++;
          } else if (currRL == "MEH") {
            NCdata[36][1]++;
          } else if (currRL == "JOY") {
            NCdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NCdata[37][0]++;
          } else if (currSK == "MEH") {
            NCdata[37][1]++;
          } else if (currSK == "JOY") {
            NCdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NCdata[38][0]++;
          } else if (currSN == "MEH") {
            NCdata[38][1]++;
          } else if (currSN == "JOY") {
            NCdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NCdata[39][0]++;
          } else if (currSP == "MEH") {
            NCdata[39][1]++;
          } else if (currSP == "JOY") {
            NCdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NCdata[40][0]++;
          } else if (currST == "MEH") {
            NCdata[40][1]++;
          } else if (currST == "JOY") {
            NCdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NCdata[41][0]++;
          } else if (currSF == "MEH") {
            NCdata[41][1]++;
          } else if (currSF == "JOY") {
            NCdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NCdata[42][0]++;
          } else if (currTT == "MEH") {
            NCdata[42][1]++;
          } else if (currTT == "JOY") {
            NCdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NCdata[43][0]++;
          } else if (currTM == "MEH") {
            NCdata[43][1]++;
          } else if (currTM == "JOY") {
            NCdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NCdata[44][0]++;
          } else if (currTB == "MEH") {
            NCdata[44][1]++;
          } else if (currTB == "JOY") {
            NCdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NCdata[45][0]++;
          } else if (currTM == "MEH") {
            NCdata[45][1]++;
          } else if (currTM == "JOY") {
            NCdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NCdata[46][0]++;
          } else if (currTW == "MEH") {
            NCdata[46][1]++;
          } else if (currTW == "JOY") {
            NCdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NCdata[47][0]++;
          } else if (currWM == "MEH") {
            NCdata[47][1]++;
          } else if (currWM == "JOY") {
            NCdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NCdata[48][0]++;
          } else if (currYP == "MEH") {
            NCdata[48][1]++;
          } else if (currYP == "JOY") {
            NCdata[48][2]++;
          }
  
        break;
      case "ND" :
          NDdata[0]++;

          if (currOut == "No") {
            NDdata[1][0]++;
          } else if (currOut = "Yes") {
            NDdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NDdata[2][0]++;
          } else if (currBF == "MEH") {
            NDdata[2][1]++;
          } else if (currBF == "JOY") {
            NDdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NDdata[3][0]++;
          } else if (currCC == "MEH") {
            NDdata[3][1]++;
          } else if (currCC == "JOY") {
            NDdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NDdata[4][0]++;
          } else if (currCL == "MEH") {
            NDdata[4][1]++;
          } else if (currCL == "JOY") {
            NDdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NDdata[5][0]++;
          } else if (currDT == "MEH") {
            NDdata[5][1]++;
          } else if (currDT == "JOY") {
            NDdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NDdata[6][0]++;
          } else if (currFP == "MEH") {
            NDdata[6][1]++;
          } else if (currFP == "JOY") {
            NDdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NDdata[7][0]++;
          } else if (currGP == "MEH") {
            NDdata[7][1]++;
          } else if (currGP == "JOY") {
            NDdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NDdata[8][0]++;
          } else if (currGB == "MEH") {
            NDdata[8][1]++;
          } else if (currGB == "JOY") {
            NDdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NDdata[9][0]++;
          } else if (currHF == "MEH") {
            NDdata[9][1]++;
          } else if (currHF == "JOY") {
            NDdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NDdata[10][0]++;
          } else if (currHB == "MEH") {
            NDdata[10][1]++;
          } else if (currHB == "JOY") {
            NDdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NDdata[11][0]++;
          } else if (currHD == "MEH") {
            NDdata[11][1]++;
          } else if (currHD == "JOY") {
            NDdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NDdata[12][0]++;
          } else if (currHM == "MEH") {
            NDdata[12][1]++;
          } else if (currHM == "JOY") {
            NDdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NDdata[13][0]++;
          } else if (currHK == "MEH") {
            NDdata[13][1]++;
          } else if (currHK == "JOY") {
            NDdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NDdata[14][0]++;
          } else if (currJB == "MEH") {
            NDdata[14][1]++;
          } else if (currJB == "JOY") {
            NDdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NDdata[15][0]++;
          } else if (currJG == "MEH") {
            NDdata[15][1]++;
          } else if (currJG == "JOY") {
            NDdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NDdata[16][0]++;
          } else if (currJM == "MEH") {
            NDdata[16][1]++;
          } else if (currJM == "JOY") {
            NDdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NDdata[17][0]++;
          } else if (currKK == "MEH") {
            NDdata[17][1]++;
          } else if (currKK == "JOY") {
            NDdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NDdata[18][0]++;
          } else if (currLT == "MEH") {
            NDdata[18][1]++;
          } else if (currLT == "JOY") {
            NDdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NDdata[19][0]++;
          } else if (currLH == "MEH") {
            NDdata[19][1]++;
          } else if (currLH == "JOY") {
            NDdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NDdata[20][0]++;
          } else if (currLN == "MEH") {
            NDdata[20][1]++;
          } else if (currLN == "JOY") {
            NDdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NDdata[21][0]++;
          } else if (currLB == "MEH") {
            NDdata[21][1]++;
          } else if (currLB == "JOY") {
            NDdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NDdata[22][0]++;
          } else if (currLP == "MEH") {
            NDdata[22][1]++;
          } else if (currLP == "JOY") {
            NDdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NDdata[23][0]++;
          } else if (currMI == "MEH") {
            NDdata[23][1]++;
          } else if (currMI == "JOY") {
            NDdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NDdata[24][0]++;
          } else if (currMD == "MEH") {
            NDdata[24][1]++;
          } else if (currMD == "JOY") {
            NDdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NDdata[25][0]++;
          } else if (currMW == "MEH") {
            NDdata[25][1]++;
          } else if (currMW == "JOY") {
            NDdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NDdata[26][0]++;
          } else if (currMM == "MEH") {
            NDdata[26][1]++;
          } else if (currMM == "JOY") {
            NDdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NDdata[27][0]++;
          } else if (currPM == "MEH") {
            NDdata[27][1]++;
          } else if (currPM == "JOY") {
            NDdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NDdata[28][0]++;
          } else if (currMK == "MEH") {
            NDdata[28][1]++;
          } else if (currMK == "JOY") {
            NDdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NDdata[29][0]++;
          } else if (currMG == "MEH") {
            NDdata[29][1]++;
          } else if (currMG == "JOY") {
            NDdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NDdata[30][0]++;
          } else if (currND == "MEH") {
            NDdata[30][1]++;
          } else if (currND == "JOY") {
            NDdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NDdata[31][0]++;
          } else if (currNC == "MEH") {
            NDdata[31][1]++;
          } else if (currNC == "JOY") {
            NDdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NDdata[32][0]++;
          } else if (currPP == "MEH") {
            NDdata[32][1]++;
          } else if (currPP == "JOY") {
            NDdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NDdata[33][0]++;
          } else if (currPS == "MEH") {
            NDdata[33][1]++;
          } else if (currPS == "JOY") {
            NDdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NDdata[34][0]++;
          } else if (currRC == "MEH") {
            NDdata[34][1]++;
          } else if (currRC == "JOY") {
            NDdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NDdata[35][0]++;
          } else if (currRP == "MEH") {
            NDdata[35][1]++;
          } else if (currRP == "JOY") {
            NDdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NDdata[36][0]++;
          } else if (currRL == "MEH") {
            NDdata[36][1]++;
          } else if (currRL == "JOY") {
            NDdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NDdata[37][0]++;
          } else if (currSK == "MEH") {
            NDdata[37][1]++;
          } else if (currSK == "JOY") {
            NDdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NDdata[38][0]++;
          } else if (currSN == "MEH") {
            NDdata[38][1]++;
          } else if (currSN == "JOY") {
            NDdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NDdata[39][0]++;
          } else if (currSP == "MEH") {
            NDdata[39][1]++;
          } else if (currSP == "JOY") {
            NDdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NDdata[40][0]++;
          } else if (currST == "MEH") {
            NDdata[40][1]++;
          } else if (currST == "JOY") {
            NDdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NDdata[41][0]++;
          } else if (currSF == "MEH") {
            NDdata[41][1]++;
          } else if (currSF == "JOY") {
            NDdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NDdata[42][0]++;
          } else if (currTT == "MEH") {
            NDdata[42][1]++;
          } else if (currTT == "JOY") {
            NDdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NDdata[43][0]++;
          } else if (currTM == "MEH") {
            NDdata[43][1]++;
          } else if (currTM == "JOY") {
            NDdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NDdata[44][0]++;
          } else if (currTB == "MEH") {
            NDdata[44][1]++;
          } else if (currTB == "JOY") {
            NDdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NDdata[45][0]++;
          } else if (currTM == "MEH") {
            NDdata[45][1]++;
          } else if (currTM == "JOY") {
            NDdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NDdata[46][0]++;
          } else if (currTW == "MEH") {
            NDdata[46][1]++;
          } else if (currTW == "JOY") {
            NDdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NDdata[47][0]++;
          } else if (currWM == "MEH") {
            NDdata[47][1]++;
          } else if (currWM == "JOY") {
            NDdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NDdata[48][0]++;
          } else if (currYP == "MEH") {
            NDdata[48][1]++;
          } else if (currYP == "JOY") {
            NDdata[48][2]++;
          }
  
        break;
      case "OH" :
          OHdata[0]++;

          if (currOut == "No") {
            OHdata[1][0]++;
          } else if (currOut = "Yes") {
            OHdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            OHdata[2][0]++;
          } else if (currBF == "MEH") {
            OHdata[2][1]++;
          } else if (currBF == "JOY") {
            OHdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            OHdata[3][0]++;
          } else if (currCC == "MEH") {
            OHdata[3][1]++;
          } else if (currCC == "JOY") {
            OHdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            OHdata[4][0]++;
          } else if (currCL == "MEH") {
            OHdata[4][1]++;
          } else if (currCL == "JOY") {
            OHdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            OHdata[5][0]++;
          } else if (currDT == "MEH") {
            OHdata[5][1]++;
          } else if (currDT == "JOY") {
            OHdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            OHdata[6][0]++;
          } else if (currFP == "MEH") {
            OHdata[6][1]++;
          } else if (currFP == "JOY") {
            OHdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            OHdata[7][0]++;
          } else if (currGP == "MEH") {
            OHdata[7][1]++;
          } else if (currGP == "JOY") {
            OHdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            OHdata[8][0]++;
          } else if (currGB == "MEH") {
            OHdata[8][1]++;
          } else if (currGB == "JOY") {
            OHdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            OHdata[9][0]++;
          } else if (currHF == "MEH") {
            OHdata[9][1]++;
          } else if (currHF == "JOY") {
            OHdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            OHdata[10][0]++;
          } else if (currHB == "MEH") {
            OHdata[10][1]++;
          } else if (currHB == "JOY") {
            OHdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            OHdata[11][0]++;
          } else if (currHD == "MEH") {
            OHdata[11][1]++;
          } else if (currHD == "JOY") {
            OHdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            OHdata[12][0]++;
          } else if (currHM == "MEH") {
            OHdata[12][1]++;
          } else if (currHM == "JOY") {
            OHdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            OHdata[13][0]++;
          } else if (currHK == "MEH") {
            OHdata[13][1]++;
          } else if (currHK == "JOY") {
            OHdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            OHdata[14][0]++;
          } else if (currJB == "MEH") {
            OHdata[14][1]++;
          } else if (currJB == "JOY") {
            OHdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            OHdata[15][0]++;
          } else if (currJG == "MEH") {
            OHdata[15][1]++;
          } else if (currJG == "JOY") {
            OHdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            OHdata[16][0]++;
          } else if (currJM == "MEH") {
            OHdata[16][1]++;
          } else if (currJM == "JOY") {
            OHdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            OHdata[17][0]++;
          } else if (currKK == "MEH") {
            OHdata[17][1]++;
          } else if (currKK == "JOY") {
            OHdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            OHdata[18][0]++;
          } else if (currLT == "MEH") {
            OHdata[18][1]++;
          } else if (currLT == "JOY") {
            OHdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            OHdata[19][0]++;
          } else if (currLH == "MEH") {
            OHdata[19][1]++;
          } else if (currLH == "JOY") {
            OHdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            OHdata[20][0]++;
          } else if (currLN == "MEH") {
            OHdata[20][1]++;
          } else if (currLN == "JOY") {
            OHdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            OHdata[21][0]++;
          } else if (currLB == "MEH") {
            OHdata[21][1]++;
          } else if (currLB == "JOY") {
            OHdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            OHdata[22][0]++;
          } else if (currLP == "MEH") {
            OHdata[22][1]++;
          } else if (currLP == "JOY") {
            OHdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            OHdata[23][0]++;
          } else if (currMI == "MEH") {
            OHdata[23][1]++;
          } else if (currMI == "JOY") {
            OHdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            OHdata[24][0]++;
          } else if (currMD == "MEH") {
            OHdata[24][1]++;
          } else if (currMD == "JOY") {
            OHdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            OHdata[25][0]++;
          } else if (currMW == "MEH") {
            OHdata[25][1]++;
          } else if (currMW == "JOY") {
            OHdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            OHdata[26][0]++;
          } else if (currMM == "MEH") {
            OHdata[26][1]++;
          } else if (currMM == "JOY") {
            OHdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            OHdata[27][0]++;
          } else if (currPM == "MEH") {
            OHdata[27][1]++;
          } else if (currPM == "JOY") {
            OHdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            OHdata[28][0]++;
          } else if (currMK == "MEH") {
            OHdata[28][1]++;
          } else if (currMK == "JOY") {
            OHdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            OHdata[29][0]++;
          } else if (currMG == "MEH") {
            OHdata[29][1]++;
          } else if (currMG == "JOY") {
            OHdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            OHdata[30][0]++;
          } else if (currND == "MEH") {
            OHdata[30][1]++;
          } else if (currND == "JOY") {
            OHdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            OHdata[31][0]++;
          } else if (currNC == "MEH") {
            OHdata[31][1]++;
          } else if (currNC == "JOY") {
            OHdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            OHdata[32][0]++;
          } else if (currPP == "MEH") {
            OHdata[32][1]++;
          } else if (currPP == "JOY") {
            OHdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            OHdata[33][0]++;
          } else if (currPS == "MEH") {
            OHdata[33][1]++;
          } else if (currPS == "JOY") {
            OHdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            OHdata[34][0]++;
          } else if (currRC == "MEH") {
            OHdata[34][1]++;
          } else if (currRC == "JOY") {
            OHdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            OHdata[35][0]++;
          } else if (currRP == "MEH") {
            OHdata[35][1]++;
          } else if (currRP == "JOY") {
            OHdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            OHdata[36][0]++;
          } else if (currRL == "MEH") {
            OHdata[36][1]++;
          } else if (currRL == "JOY") {
            OHdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            OHdata[37][0]++;
          } else if (currSK == "MEH") {
            OHdata[37][1]++;
          } else if (currSK == "JOY") {
            OHdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            OHdata[38][0]++;
          } else if (currSN == "MEH") {
            OHdata[38][1]++;
          } else if (currSN == "JOY") {
            OHdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            OHdata[39][0]++;
          } else if (currSP == "MEH") {
            OHdata[39][1]++;
          } else if (currSP == "JOY") {
            OHdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            OHdata[40][0]++;
          } else if (currST == "MEH") {
            OHdata[40][1]++;
          } else if (currST == "JOY") {
            OHdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            OHdata[41][0]++;
          } else if (currSF == "MEH") {
            OHdata[41][1]++;
          } else if (currSF == "JOY") {
            OHdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            OHdata[42][0]++;
          } else if (currTT == "MEH") {
            OHdata[42][1]++;
          } else if (currTT == "JOY") {
            OHdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            OHdata[43][0]++;
          } else if (currTM == "MEH") {
            OHdata[43][1]++;
          } else if (currTM == "JOY") {
            OHdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            OHdata[44][0]++;
          } else if (currTB == "MEH") {
            OHdata[44][1]++;
          } else if (currTB == "JOY") {
            OHdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            OHdata[45][0]++;
          } else if (currTM == "MEH") {
            OHdata[45][1]++;
          } else if (currTM == "JOY") {
            OHdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            OHdata[46][0]++;
          } else if (currTW == "MEH") {
            OHdata[46][1]++;
          } else if (currTW == "JOY") {
            OHdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            OHdata[47][0]++;
          } else if (currWM == "MEH") {
            OHdata[47][1]++;
          } else if (currWM == "JOY") {
            OHdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            OHdata[48][0]++;
          } else if (currYP == "MEH") {
            OHdata[48][1]++;
          } else if (currYP == "JOY") {
            OHdata[48][2]++;
          }
  
        break;
      case "OK" :
          OKdata[0]++;

          if (currOut == "No") {
            OKdata[1][0]++;
          } else if (currOut = "Yes") {
            OKdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            OKdata[2][0]++;
          } else if (currBF == "MEH") {
            OKdata[2][1]++;
          } else if (currBF == "JOY") {
            OKdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            OKdata[3][0]++;
          } else if (currCC == "MEH") {
            OKdata[3][1]++;
          } else if (currCC == "JOY") {
            OKdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            OKdata[4][0]++;
          } else if (currCL == "MEH") {
            OKdata[4][1]++;
          } else if (currCL == "JOY") {
            OKdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            OKdata[5][0]++;
          } else if (currDT == "MEH") {
            OKdata[5][1]++;
          } else if (currDT == "JOY") {
            OKdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            OKdata[6][0]++;
          } else if (currFP == "MEH") {
            OKdata[6][1]++;
          } else if (currFP == "JOY") {
            OKdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            OKdata[7][0]++;
          } else if (currGP == "MEH") {
            OKdata[7][1]++;
          } else if (currGP == "JOY") {
            OKdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            OKdata[8][0]++;
          } else if (currGB == "MEH") {
            OKdata[8][1]++;
          } else if (currGB == "JOY") {
            OKdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            OKdata[9][0]++;
          } else if (currHF == "MEH") {
            OKdata[9][1]++;
          } else if (currHF == "JOY") {
            OKdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            OKdata[10][0]++;
          } else if (currHB == "MEH") {
            OKdata[10][1]++;
          } else if (currHB == "JOY") {
            OKdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            OKdata[11][0]++;
          } else if (currHD == "MEH") {
            OKdata[11][1]++;
          } else if (currHD == "JOY") {
            OKdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            OKdata[12][0]++;
          } else if (currHM == "MEH") {
            OKdata[12][1]++;
          } else if (currHM == "JOY") {
            OKdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            OKdata[13][0]++;
          } else if (currHK == "MEH") {
            OKdata[13][1]++;
          } else if (currHK == "JOY") {
            OKdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            OKdata[14][0]++;
          } else if (currJB == "MEH") {
            OKdata[14][1]++;
          } else if (currJB == "JOY") {
            OKdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            OKdata[15][0]++;
          } else if (currJG == "MEH") {
            OKdata[15][1]++;
          } else if (currJG == "JOY") {
            OKdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            OKdata[16][0]++;
          } else if (currJM == "MEH") {
            OKdata[16][1]++;
          } else if (currJM == "JOY") {
            OKdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            OKdata[17][0]++;
          } else if (currKK == "MEH") {
            OKdata[17][1]++;
          } else if (currKK == "JOY") {
            OKdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            OKdata[18][0]++;
          } else if (currLT == "MEH") {
            OKdata[18][1]++;
          } else if (currLT == "JOY") {
            OKdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            OKdata[19][0]++;
          } else if (currLH == "MEH") {
            OKdata[19][1]++;
          } else if (currLH == "JOY") {
            OKdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            OKdata[20][0]++;
          } else if (currLN == "MEH") {
            OKdata[20][1]++;
          } else if (currLN == "JOY") {
            OKdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            OKdata[21][0]++;
          } else if (currLB == "MEH") {
            OKdata[21][1]++;
          } else if (currLB == "JOY") {
            OKdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            OKdata[22][0]++;
          } else if (currLP == "MEH") {
            OKdata[22][1]++;
          } else if (currLP == "JOY") {
            OKdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            OKdata[23][0]++;
          } else if (currMI == "MEH") {
            OKdata[23][1]++;
          } else if (currMI == "JOY") {
            OKdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            OKdata[24][0]++;
          } else if (currMD == "MEH") {
            OKdata[24][1]++;
          } else if (currMD == "JOY") {
            OKdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            OKdata[25][0]++;
          } else if (currMW == "MEH") {
            OKdata[25][1]++;
          } else if (currMW == "JOY") {
            OKdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            OKdata[26][0]++;
          } else if (currMM == "MEH") {
            OKdata[26][1]++;
          } else if (currMM == "JOY") {
            OKdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            OKdata[27][0]++;
          } else if (currPM == "MEH") {
            OKdata[27][1]++;
          } else if (currPM == "JOY") {
            OKdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            OKdata[28][0]++;
          } else if (currMK == "MEH") {
            OKdata[28][1]++;
          } else if (currMK == "JOY") {
            OKdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            OKdata[29][0]++;
          } else if (currMG == "MEH") {
            OKdata[29][1]++;
          } else if (currMG == "JOY") {
            OKdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            OKdata[30][0]++;
          } else if (currND == "MEH") {
            OKdata[30][1]++;
          } else if (currND == "JOY") {
            OKdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            OKdata[31][0]++;
          } else if (currNC == "MEH") {
            OKdata[31][1]++;
          } else if (currNC == "JOY") {
            OKdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            OKdata[32][0]++;
          } else if (currPP == "MEH") {
            OKdata[32][1]++;
          } else if (currPP == "JOY") {
            OKdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            OKdata[33][0]++;
          } else if (currPS == "MEH") {
            OKdata[33][1]++;
          } else if (currPS == "JOY") {
            OKdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            OKdata[34][0]++;
          } else if (currRC == "MEH") {
            OKdata[34][1]++;
          } else if (currRC == "JOY") {
            OKdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            OKdata[35][0]++;
          } else if (currRP == "MEH") {
            OKdata[35][1]++;
          } else if (currRP == "JOY") {
            OKdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            OKdata[36][0]++;
          } else if (currRL == "MEH") {
            OKdata[36][1]++;
          } else if (currRL == "JOY") {
            OKdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            OKdata[37][0]++;
          } else if (currSK == "MEH") {
            OKdata[37][1]++;
          } else if (currSK == "JOY") {
            OKdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            OKdata[38][0]++;
          } else if (currSN == "MEH") {
            OKdata[38][1]++;
          } else if (currSN == "JOY") {
            OKdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            OKdata[39][0]++;
          } else if (currSP == "MEH") {
            OKdata[39][1]++;
          } else if (currSP == "JOY") {
            OKdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            OKdata[40][0]++;
          } else if (currST == "MEH") {
            OKdata[40][1]++;
          } else if (currST == "JOY") {
            OKdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            OKdata[41][0]++;
          } else if (currSF == "MEH") {
            OKdata[41][1]++;
          } else if (currSF == "JOY") {
            OKdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            OKdata[42][0]++;
          } else if (currTT == "MEH") {
            OKdata[42][1]++;
          } else if (currTT == "JOY") {
            OKdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            OKdata[43][0]++;
          } else if (currTM == "MEH") {
            OKdata[43][1]++;
          } else if (currTM == "JOY") {
            OKdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            OKdata[44][0]++;
          } else if (currTB == "MEH") {
            OKdata[44][1]++;
          } else if (currTB == "JOY") {
            OKdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            OKdata[45][0]++;
          } else if (currTM == "MEH") {
            OKdata[45][1]++;
          } else if (currTM == "JOY") {
            OKdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            OKdata[46][0]++;
          } else if (currTW == "MEH") {
            OKdata[46][1]++;
          } else if (currTW == "JOY") {
            OKdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            OKdata[47][0]++;
          } else if (currWM == "MEH") {
            OKdata[47][1]++;
          } else if (currWM == "JOY") {
            OKdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            OKdata[48][0]++;
          } else if (currYP == "MEH") {
            OKdata[48][1]++;
          } else if (currYP == "JOY") {
            OKdata[48][2]++;
          }
  
        break;
      case "OR" :
          ORdata[0]++;

          if (currOut == "No") {
            ORdata[1][0]++;
          } else if (currOut = "Yes") {
            ORdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            ORdata[2][0]++;
          } else if (currBF == "MEH") {
            ORdata[2][1]++;
          } else if (currBF == "JOY") {
            ORdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            ORdata[3][0]++;
          } else if (currCC == "MEH") {
            ORdata[3][1]++;
          } else if (currCC == "JOY") {
            ORdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            ORdata[4][0]++;
          } else if (currCL == "MEH") {
            ORdata[4][1]++;
          } else if (currCL == "JOY") {
            ORdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            ORdata[5][0]++;
          } else if (currDT == "MEH") {
            ORdata[5][1]++;
          } else if (currDT == "JOY") {
            ORdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            ORdata[6][0]++;
          } else if (currFP == "MEH") {
            ORdata[6][1]++;
          } else if (currFP == "JOY") {
            ORdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            ORdata[7][0]++;
          } else if (currGP == "MEH") {
            ORdata[7][1]++;
          } else if (currGP == "JOY") {
            ORdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            ORdata[8][0]++;
          } else if (currGB == "MEH") {
            ORdata[8][1]++;
          } else if (currGB == "JOY") {
            ORdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            ORdata[9][0]++;
          } else if (currHF == "MEH") {
            ORdata[9][1]++;
          } else if (currHF == "JOY") {
            ORdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            ORdata[10][0]++;
          } else if (currHB == "MEH") {
            ORdata[10][1]++;
          } else if (currHB == "JOY") {
            ORdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            ORdata[11][0]++;
          } else if (currHD == "MEH") {
            ORdata[11][1]++;
          } else if (currHD == "JOY") {
            ORdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            ORdata[12][0]++;
          } else if (currHM == "MEH") {
            ORdata[12][1]++;
          } else if (currHM == "JOY") {
            ORdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            ORdata[13][0]++;
          } else if (currHK == "MEH") {
            ORdata[13][1]++;
          } else if (currHK == "JOY") {
            ORdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            ORdata[14][0]++;
          } else if (currJB == "MEH") {
            ORdata[14][1]++;
          } else if (currJB == "JOY") {
            ORdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            ORdata[15][0]++;
          } else if (currJG == "MEH") {
            ORdata[15][1]++;
          } else if (currJG == "JOY") {
            ORdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            ORdata[16][0]++;
          } else if (currJM == "MEH") {
            ORdata[16][1]++;
          } else if (currJM == "JOY") {
            ORdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            ORdata[17][0]++;
          } else if (currKK == "MEH") {
            ORdata[17][1]++;
          } else if (currKK == "JOY") {
            ORdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            ORdata[18][0]++;
          } else if (currLT == "MEH") {
            ORdata[18][1]++;
          } else if (currLT == "JOY") {
            ORdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            ORdata[19][0]++;
          } else if (currLH == "MEH") {
            ORdata[19][1]++;
          } else if (currLH == "JOY") {
            ORdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            ORdata[20][0]++;
          } else if (currLN == "MEH") {
            ORdata[20][1]++;
          } else if (currLN == "JOY") {
            ORdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            ORdata[21][0]++;
          } else if (currLB == "MEH") {
            ORdata[21][1]++;
          } else if (currLB == "JOY") {
            ORdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            ORdata[22][0]++;
          } else if (currLP == "MEH") {
            ORdata[22][1]++;
          } else if (currLP == "JOY") {
            ORdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            ORdata[23][0]++;
          } else if (currMI == "MEH") {
            ORdata[23][1]++;
          } else if (currMI == "JOY") {
            ORdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            ORdata[24][0]++;
          } else if (currMD == "MEH") {
            ORdata[24][1]++;
          } else if (currMD == "JOY") {
            ORdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            ORdata[25][0]++;
          } else if (currMW == "MEH") {
            ORdata[25][1]++;
          } else if (currMW == "JOY") {
            ORdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            ORdata[26][0]++;
          } else if (currMM == "MEH") {
            ORdata[26][1]++;
          } else if (currMM == "JOY") {
            ORdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            ORdata[27][0]++;
          } else if (currPM == "MEH") {
            ORdata[27][1]++;
          } else if (currPM == "JOY") {
            ORdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            ORdata[28][0]++;
          } else if (currMK == "MEH") {
            ORdata[28][1]++;
          } else if (currMK == "JOY") {
            ORdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            ORdata[29][0]++;
          } else if (currMG == "MEH") {
            ORdata[29][1]++;
          } else if (currMG == "JOY") {
            ORdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            ORdata[30][0]++;
          } else if (currND == "MEH") {
            ORdata[30][1]++;
          } else if (currND == "JOY") {
            ORdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            ORdata[31][0]++;
          } else if (currNC == "MEH") {
            ORdata[31][1]++;
          } else if (currNC == "JOY") {
            ORdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            ORdata[32][0]++;
          } else if (currPP == "MEH") {
            ORdata[32][1]++;
          } else if (currPP == "JOY") {
            ORdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            ORdata[33][0]++;
          } else if (currPS == "MEH") {
            ORdata[33][1]++;
          } else if (currPS == "JOY") {
            ORdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            ORdata[34][0]++;
          } else if (currRC == "MEH") {
            ORdata[34][1]++;
          } else if (currRC == "JOY") {
            ORdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            ORdata[35][0]++;
          } else if (currRP == "MEH") {
            ORdata[35][1]++;
          } else if (currRP == "JOY") {
            ORdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            ORdata[36][0]++;
          } else if (currRL == "MEH") {
            ORdata[36][1]++;
          } else if (currRL == "JOY") {
            ORdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            ORdata[37][0]++;
          } else if (currSK == "MEH") {
            ORdata[37][1]++;
          } else if (currSK == "JOY") {
            ORdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            ORdata[38][0]++;
          } else if (currSN == "MEH") {
            ORdata[38][1]++;
          } else if (currSN == "JOY") {
            ORdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            ORdata[39][0]++;
          } else if (currSP == "MEH") {
            ORdata[39][1]++;
          } else if (currSP == "JOY") {
            ORdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            ORdata[40][0]++;
          } else if (currST == "MEH") {
            ORdata[40][1]++;
          } else if (currST == "JOY") {
            ORdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            ORdata[41][0]++;
          } else if (currSF == "MEH") {
            ORdata[41][1]++;
          } else if (currSF == "JOY") {
            ORdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            ORdata[42][0]++;
          } else if (currTT == "MEH") {
            ORdata[42][1]++;
          } else if (currTT == "JOY") {
            ORdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            ORdata[43][0]++;
          } else if (currTM == "MEH") {
            ORdata[43][1]++;
          } else if (currTM == "JOY") {
            ORdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            ORdata[44][0]++;
          } else if (currTB == "MEH") {
            ORdata[44][1]++;
          } else if (currTB == "JOY") {
            ORdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            ORdata[45][0]++;
          } else if (currTM == "MEH") {
            ORdata[45][1]++;
          } else if (currTM == "JOY") {
            ORdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            ORdata[46][0]++;
          } else if (currTW == "MEH") {
            ORdata[46][1]++;
          } else if (currTW == "JOY") {
            ORdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            ORdata[47][0]++;
          } else if (currWM == "MEH") {
            ORdata[47][1]++;
          } else if (currWM == "JOY") {
            ORdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            ORdata[48][0]++;
          } else if (currYP == "MEH") {
            ORdata[48][1]++;
          } else if (currYP == "JOY") {
            ORdata[48][2]++;
          }
  
        break;
      case "PA" :
          PAdata[0]++;

          if (currOut == "No") {
            PAdata[1][0]++;
          } else if (currOut = "Yes") {
            PAdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            PAdata[2][0]++;
          } else if (currBF == "MEH") {
            PAdata[2][1]++;
          } else if (currBF == "JOY") {
            PAdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            PAdata[3][0]++;
          } else if (currCC == "MEH") {
            PAdata[3][1]++;
          } else if (currCC == "JOY") {
            PAdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            PAdata[4][0]++;
          } else if (currCL == "MEH") {
            PAdata[4][1]++;
          } else if (currCL == "JOY") {
            PAdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            PAdata[5][0]++;
          } else if (currDT == "MEH") {
            PAdata[5][1]++;
          } else if (currDT == "JOY") {
            PAdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            PAdata[6][0]++;
          } else if (currFP == "MEH") {
            PAdata[6][1]++;
          } else if (currFP == "JOY") {
            PAdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            PAdata[7][0]++;
          } else if (currGP == "MEH") {
            PAdata[7][1]++;
          } else if (currGP == "JOY") {
            PAdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            PAdata[8][0]++;
          } else if (currGB == "MEH") {
            PAdata[8][1]++;
          } else if (currGB == "JOY") {
            PAdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            PAdata[9][0]++;
          } else if (currHF == "MEH") {
            PAdata[9][1]++;
          } else if (currHF == "JOY") {
            PAdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            PAdata[10][0]++;
          } else if (currHB == "MEH") {
            PAdata[10][1]++;
          } else if (currHB == "JOY") {
            PAdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            PAdata[11][0]++;
          } else if (currHD == "MEH") {
            PAdata[11][1]++;
          } else if (currHD == "JOY") {
            PAdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            PAdata[12][0]++;
          } else if (currHM == "MEH") {
            PAdata[12][1]++;
          } else if (currHM == "JOY") {
            PAdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            PAdata[13][0]++;
          } else if (currHK == "MEH") {
            PAdata[13][1]++;
          } else if (currHK == "JOY") {
            PAdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            PAdata[14][0]++;
          } else if (currJB == "MEH") {
            PAdata[14][1]++;
          } else if (currJB == "JOY") {
            PAdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            PAdata[15][0]++;
          } else if (currJG == "MEH") {
            PAdata[15][1]++;
          } else if (currJG == "JOY") {
            PAdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            PAdata[16][0]++;
          } else if (currJM == "MEH") {
            PAdata[16][1]++;
          } else if (currJM == "JOY") {
            PAdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            PAdata[17][0]++;
          } else if (currKK == "MEH") {
            PAdata[17][1]++;
          } else if (currKK == "JOY") {
            PAdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            PAdata[18][0]++;
          } else if (currLT == "MEH") {
            PAdata[18][1]++;
          } else if (currLT == "JOY") {
            PAdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            PAdata[19][0]++;
          } else if (currLH == "MEH") {
            PAdata[19][1]++;
          } else if (currLH == "JOY") {
            PAdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            PAdata[20][0]++;
          } else if (currLN == "MEH") {
            PAdata[20][1]++;
          } else if (currLN == "JOY") {
            PAdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            PAdata[21][0]++;
          } else if (currLB == "MEH") {
            PAdata[21][1]++;
          } else if (currLB == "JOY") {
            PAdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            PAdata[22][0]++;
          } else if (currLP == "MEH") {
            PAdata[22][1]++;
          } else if (currLP == "JOY") {
            PAdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            PAdata[23][0]++;
          } else if (currMI == "MEH") {
            PAdata[23][1]++;
          } else if (currMI == "JOY") {
            PAdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            PAdata[24][0]++;
          } else if (currMD == "MEH") {
            PAdata[24][1]++;
          } else if (currMD == "JOY") {
            PAdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            PAdata[25][0]++;
          } else if (currMW == "MEH") {
            PAdata[25][1]++;
          } else if (currMW == "JOY") {
            PAdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            PAdata[26][0]++;
          } else if (currMM == "MEH") {
            PAdata[26][1]++;
          } else if (currMM == "JOY") {
            PAdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            PAdata[27][0]++;
          } else if (currPM == "MEH") {
            PAdata[27][1]++;
          } else if (currPM == "JOY") {
            PAdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            PAdata[28][0]++;
          } else if (currMK == "MEH") {
            PAdata[28][1]++;
          } else if (currMK == "JOY") {
            PAdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            PAdata[29][0]++;
          } else if (currMG == "MEH") {
            PAdata[29][1]++;
          } else if (currMG == "JOY") {
            PAdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            PAdata[30][0]++;
          } else if (currND == "MEH") {
            PAdata[30][1]++;
          } else if (currND == "JOY") {
            PAdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            PAdata[31][0]++;
          } else if (currNC == "MEH") {
            PAdata[31][1]++;
          } else if (currNC == "JOY") {
            PAdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            PAdata[32][0]++;
          } else if (currPP == "MEH") {
            PAdata[32][1]++;
          } else if (currPP == "JOY") {
            PAdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            PAdata[33][0]++;
          } else if (currPS == "MEH") {
            PAdata[33][1]++;
          } else if (currPS == "JOY") {
            PAdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            PAdata[34][0]++;
          } else if (currRC == "MEH") {
            PAdata[34][1]++;
          } else if (currRC == "JOY") {
            PAdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            PAdata[35][0]++;
          } else if (currRP == "MEH") {
            PAdata[35][1]++;
          } else if (currRP == "JOY") {
            PAdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            PAdata[36][0]++;
          } else if (currRL == "MEH") {
            PAdata[36][1]++;
          } else if (currRL == "JOY") {
            PAdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            PAdata[37][0]++;
          } else if (currSK == "MEH") {
            PAdata[37][1]++;
          } else if (currSK == "JOY") {
            PAdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            PAdata[38][0]++;
          } else if (currSN == "MEH") {
            PAdata[38][1]++;
          } else if (currSN == "JOY") {
            PAdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            PAdata[39][0]++;
          } else if (currSP == "MEH") {
            PAdata[39][1]++;
          } else if (currSP == "JOY") {
            PAdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            PAdata[40][0]++;
          } else if (currST == "MEH") {
            PAdata[40][1]++;
          } else if (currST == "JOY") {
            PAdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            PAdata[41][0]++;
          } else if (currSF == "MEH") {
            PAdata[41][1]++;
          } else if (currSF == "JOY") {
            PAdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            PAdata[42][0]++;
          } else if (currTT == "MEH") {
            PAdata[42][1]++;
          } else if (currTT == "JOY") {
            PAdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            PAdata[43][0]++;
          } else if (currTM == "MEH") {
            PAdata[43][1]++;
          } else if (currTM == "JOY") {
            PAdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            PAdata[44][0]++;
          } else if (currTB == "MEH") {
            PAdata[44][1]++;
          } else if (currTB == "JOY") {
            PAdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            PAdata[45][0]++;
          } else if (currTM == "MEH") {
            PAdata[45][1]++;
          } else if (currTM == "JOY") {
            PAdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            PAdata[46][0]++;
          } else if (currTW == "MEH") {
            PAdata[46][1]++;
          } else if (currTW == "JOY") {
            PAdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            PAdata[47][0]++;
          } else if (currWM == "MEH") {
            PAdata[47][1]++;
          } else if (currWM == "JOY") {
            PAdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            PAdata[48][0]++;
          } else if (currYP == "MEH") {
            PAdata[48][1]++;
          } else if (currYP == "JOY") {
            PAdata[48][2]++;
          }
  
        break;
      case "RI" :
          RIdata[0]++;

          if (currOut == "No") {
            RIdata[1][0]++;
          } else if (currOut = "Yes") {
            RIdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            RIdata[2][0]++;
          } else if (currBF == "MEH") {
            RIdata[2][1]++;
          } else if (currBF == "JOY") {
            RIdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            RIdata[3][0]++;
          } else if (currCC == "MEH") {
            RIdata[3][1]++;
          } else if (currCC == "JOY") {
            RIdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            RIdata[4][0]++;
          } else if (currCL == "MEH") {
            RIdata[4][1]++;
          } else if (currCL == "JOY") {
            RIdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            RIdata[5][0]++;
          } else if (currDT == "MEH") {
            RIdata[5][1]++;
          } else if (currDT == "JOY") {
            RIdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            RIdata[6][0]++;
          } else if (currFP == "MEH") {
            RIdata[6][1]++;
          } else if (currFP == "JOY") {
            RIdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            RIdata[7][0]++;
          } else if (currGP == "MEH") {
            RIdata[7][1]++;
          } else if (currGP == "JOY") {
            RIdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            RIdata[8][0]++;
          } else if (currGB == "MEH") {
            RIdata[8][1]++;
          } else if (currGB == "JOY") {
            RIdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            RIdata[9][0]++;
          } else if (currHF == "MEH") {
            RIdata[9][1]++;
          } else if (currHF == "JOY") {
            RIdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            RIdata[10][0]++;
          } else if (currHB == "MEH") {
            RIdata[10][1]++;
          } else if (currHB == "JOY") {
            RIdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            RIdata[11][0]++;
          } else if (currHD == "MEH") {
            RIdata[11][1]++;
          } else if (currHD == "JOY") {
            RIdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            RIdata[12][0]++;
          } else if (currHM == "MEH") {
            RIdata[12][1]++;
          } else if (currHM == "JOY") {
            RIdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            RIdata[13][0]++;
          } else if (currHK == "MEH") {
            RIdata[13][1]++;
          } else if (currHK == "JOY") {
            RIdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            RIdata[14][0]++;
          } else if (currJB == "MEH") {
            RIdata[14][1]++;
          } else if (currJB == "JOY") {
            RIdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            RIdata[15][0]++;
          } else if (currJG == "MEH") {
            RIdata[15][1]++;
          } else if (currJG == "JOY") {
            RIdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            RIdata[16][0]++;
          } else if (currJM == "MEH") {
            RIdata[16][1]++;
          } else if (currJM == "JOY") {
            RIdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            RIdata[17][0]++;
          } else if (currKK == "MEH") {
            RIdata[17][1]++;
          } else if (currKK == "JOY") {
            RIdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            RIdata[18][0]++;
          } else if (currLT == "MEH") {
            RIdata[18][1]++;
          } else if (currLT == "JOY") {
            RIdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            RIdata[19][0]++;
          } else if (currLH == "MEH") {
            RIdata[19][1]++;
          } else if (currLH == "JOY") {
            RIdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            RIdata[20][0]++;
          } else if (currLN == "MEH") {
            RIdata[20][1]++;
          } else if (currLN == "JOY") {
            RIdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            RIdata[21][0]++;
          } else if (currLB == "MEH") {
            RIdata[21][1]++;
          } else if (currLB == "JOY") {
            RIdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            RIdata[22][0]++;
          } else if (currLP == "MEH") {
            RIdata[22][1]++;
          } else if (currLP == "JOY") {
            RIdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            RIdata[23][0]++;
          } else if (currMI == "MEH") {
            RIdata[23][1]++;
          } else if (currMI == "JOY") {
            RIdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            RIdata[24][0]++;
          } else if (currMD == "MEH") {
            RIdata[24][1]++;
          } else if (currMD == "JOY") {
            RIdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            RIdata[25][0]++;
          } else if (currMW == "MEH") {
            RIdata[25][1]++;
          } else if (currMW == "JOY") {
            RIdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            RIdata[26][0]++;
          } else if (currMM == "MEH") {
            RIdata[26][1]++;
          } else if (currMM == "JOY") {
            RIdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            RIdata[27][0]++;
          } else if (currPM == "MEH") {
            RIdata[27][1]++;
          } else if (currPM == "JOY") {
            RIdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            RIdata[28][0]++;
          } else if (currMK == "MEH") {
            RIdata[28][1]++;
          } else if (currMK == "JOY") {
            RIdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            RIdata[29][0]++;
          } else if (currMG == "MEH") {
            RIdata[29][1]++;
          } else if (currMG == "JOY") {
            RIdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            RIdata[30][0]++;
          } else if (currND == "MEH") {
            RIdata[30][1]++;
          } else if (currND == "JOY") {
            RIdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            RIdata[31][0]++;
          } else if (currNC == "MEH") {
            RIdata[31][1]++;
          } else if (currNC == "JOY") {
            RIdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            RIdata[32][0]++;
          } else if (currPP == "MEH") {
            RIdata[32][1]++;
          } else if (currPP == "JOY") {
            RIdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            RIdata[33][0]++;
          } else if (currPS == "MEH") {
            RIdata[33][1]++;
          } else if (currPS == "JOY") {
            RIdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            RIdata[34][0]++;
          } else if (currRC == "MEH") {
            RIdata[34][1]++;
          } else if (currRC == "JOY") {
            RIdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            RIdata[35][0]++;
          } else if (currRP == "MEH") {
            RIdata[35][1]++;
          } else if (currRP == "JOY") {
            RIdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            RIdata[36][0]++;
          } else if (currRL == "MEH") {
            RIdata[36][1]++;
          } else if (currRL == "JOY") {
            RIdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            RIdata[37][0]++;
          } else if (currSK == "MEH") {
            RIdata[37][1]++;
          } else if (currSK == "JOY") {
            RIdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            RIdata[38][0]++;
          } else if (currSN == "MEH") {
            RIdata[38][1]++;
          } else if (currSN == "JOY") {
            RIdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            RIdata[39][0]++;
          } else if (currSP == "MEH") {
            RIdata[39][1]++;
          } else if (currSP == "JOY") {
            RIdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            RIdata[40][0]++;
          } else if (currST == "MEH") {
            RIdata[40][1]++;
          } else if (currST == "JOY") {
            RIdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            RIdata[41][0]++;
          } else if (currSF == "MEH") {
            RIdata[41][1]++;
          } else if (currSF == "JOY") {
            RIdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            RIdata[42][0]++;
          } else if (currTT == "MEH") {
            RIdata[42][1]++;
          } else if (currTT == "JOY") {
            RIdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            RIdata[43][0]++;
          } else if (currTM == "MEH") {
            RIdata[43][1]++;
          } else if (currTM == "JOY") {
            RIdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            RIdata[44][0]++;
          } else if (currTB == "MEH") {
            RIdata[44][1]++;
          } else if (currTB == "JOY") {
            RIdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            RIdata[45][0]++;
          } else if (currTM == "MEH") {
            RIdata[45][1]++;
          } else if (currTM == "JOY") {
            RIdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            RIdata[46][0]++;
          } else if (currTW == "MEH") {
            RIdata[46][1]++;
          } else if (currTW == "JOY") {
            RIdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            RIdata[47][0]++;
          } else if (currWM == "MEH") {
            RIdata[47][1]++;
          } else if (currWM == "JOY") {
            RIdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            RIdata[48][0]++;
          } else if (currYP == "MEH") {
            RIdata[48][1]++;
          } else if (currYP == "JOY") {
            RIdata[48][2]++;
          }
  
        break;
      case "SC" :
          SCdata[0]++;

          if (currOut == "No") {
            SCdata[1][0]++;
          } else if (currOut = "Yes") {
            SCdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            SCdata[2][0]++;
          } else if (currBF == "MEH") {
            SCdata[2][1]++;
          } else if (currBF == "JOY") {
            SCdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            SCdata[3][0]++;
          } else if (currCC == "MEH") {
            SCdata[3][1]++;
          } else if (currCC == "JOY") {
            SCdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            SCdata[4][0]++;
          } else if (currCL == "MEH") {
            SCdata[4][1]++;
          } else if (currCL == "JOY") {
            SCdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            SCdata[5][0]++;
          } else if (currDT == "MEH") {
            SCdata[5][1]++;
          } else if (currDT == "JOY") {
            SCdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            SCdata[6][0]++;
          } else if (currFP == "MEH") {
            SCdata[6][1]++;
          } else if (currFP == "JOY") {
            SCdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            SCdata[7][0]++;
          } else if (currGP == "MEH") {
            SCdata[7][1]++;
          } else if (currGP == "JOY") {
            SCdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            SCdata[8][0]++;
          } else if (currGB == "MEH") {
            SCdata[8][1]++;
          } else if (currGB == "JOY") {
            SCdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            SCdata[9][0]++;
          } else if (currHF == "MEH") {
            SCdata[9][1]++;
          } else if (currHF == "JOY") {
            SCdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            SCdata[10][0]++;
          } else if (currHB == "MEH") {
            SCdata[10][1]++;
          } else if (currHB == "JOY") {
            SCdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            SCdata[11][0]++;
          } else if (currHD == "MEH") {
            SCdata[11][1]++;
          } else if (currHD == "JOY") {
            SCdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            SCdata[12][0]++;
          } else if (currHM == "MEH") {
            SCdata[12][1]++;
          } else if (currHM == "JOY") {
            SCdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            SCdata[13][0]++;
          } else if (currHK == "MEH") {
            SCdata[13][1]++;
          } else if (currHK == "JOY") {
            SCdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            SCdata[14][0]++;
          } else if (currJB == "MEH") {
            SCdata[14][1]++;
          } else if (currJB == "JOY") {
            SCdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            SCdata[15][0]++;
          } else if (currJG == "MEH") {
            SCdata[15][1]++;
          } else if (currJG == "JOY") {
            SCdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            SCdata[16][0]++;
          } else if (currJM == "MEH") {
            SCdata[16][1]++;
          } else if (currJM == "JOY") {
            SCdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            SCdata[17][0]++;
          } else if (currKK == "MEH") {
            SCdata[17][1]++;
          } else if (currKK == "JOY") {
            SCdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            SCdata[18][0]++;
          } else if (currLT == "MEH") {
            SCdata[18][1]++;
          } else if (currLT == "JOY") {
            SCdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            SCdata[19][0]++;
          } else if (currLH == "MEH") {
            SCdata[19][1]++;
          } else if (currLH == "JOY") {
            SCdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            SCdata[20][0]++;
          } else if (currLN == "MEH") {
            SCdata[20][1]++;
          } else if (currLN == "JOY") {
            SCdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            SCdata[21][0]++;
          } else if (currLB == "MEH") {
            SCdata[21][1]++;
          } else if (currLB == "JOY") {
            SCdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            SCdata[22][0]++;
          } else if (currLP == "MEH") {
            SCdata[22][1]++;
          } else if (currLP == "JOY") {
            SCdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            SCdata[23][0]++;
          } else if (currMI == "MEH") {
            SCdata[23][1]++;
          } else if (currMI == "JOY") {
            SCdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            SCdata[24][0]++;
          } else if (currMD == "MEH") {
            SCdata[24][1]++;
          } else if (currMD == "JOY") {
            SCdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            SCdata[25][0]++;
          } else if (currMW == "MEH") {
            SCdata[25][1]++;
          } else if (currMW == "JOY") {
            SCdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            SCdata[26][0]++;
          } else if (currMM == "MEH") {
            SCdata[26][1]++;
          } else if (currMM == "JOY") {
            SCdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            SCdata[27][0]++;
          } else if (currPM == "MEH") {
            SCdata[27][1]++;
          } else if (currPM == "JOY") {
            SCdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            SCdata[28][0]++;
          } else if (currMK == "MEH") {
            SCdata[28][1]++;
          } else if (currMK == "JOY") {
            SCdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            SCdata[29][0]++;
          } else if (currMG == "MEH") {
            SCdata[29][1]++;
          } else if (currMG == "JOY") {
            SCdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            SCdata[30][0]++;
          } else if (currND == "MEH") {
            SCdata[30][1]++;
          } else if (currND == "JOY") {
            SCdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            SCdata[31][0]++;
          } else if (currNC == "MEH") {
            SCdata[31][1]++;
          } else if (currNC == "JOY") {
            SCdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            SCdata[32][0]++;
          } else if (currPP == "MEH") {
            SCdata[32][1]++;
          } else if (currPP == "JOY") {
            SCdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            SCdata[33][0]++;
          } else if (currPS == "MEH") {
            SCdata[33][1]++;
          } else if (currPS == "JOY") {
            SCdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            SCdata[34][0]++;
          } else if (currRC == "MEH") {
            SCdata[34][1]++;
          } else if (currRC == "JOY") {
            SCdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            SCdata[35][0]++;
          } else if (currRP == "MEH") {
            SCdata[35][1]++;
          } else if (currRP == "JOY") {
            SCdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            SCdata[36][0]++;
          } else if (currRL == "MEH") {
            SCdata[36][1]++;
          } else if (currRL == "JOY") {
            SCdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            SCdata[37][0]++;
          } else if (currSK == "MEH") {
            SCdata[37][1]++;
          } else if (currSK == "JOY") {
            SCdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            SCdata[38][0]++;
          } else if (currSN == "MEH") {
            SCdata[38][1]++;
          } else if (currSN == "JOY") {
            SCdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            SCdata[39][0]++;
          } else if (currSP == "MEH") {
            SCdata[39][1]++;
          } else if (currSP == "JOY") {
            SCdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            SCdata[40][0]++;
          } else if (currST == "MEH") {
            SCdata[40][1]++;
          } else if (currST == "JOY") {
            SCdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            SCdata[41][0]++;
          } else if (currSF == "MEH") {
            SCdata[41][1]++;
          } else if (currSF == "JOY") {
            SCdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            SCdata[42][0]++;
          } else if (currTT == "MEH") {
            SCdata[42][1]++;
          } else if (currTT == "JOY") {
            SCdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            SCdata[43][0]++;
          } else if (currTM == "MEH") {
            SCdata[43][1]++;
          } else if (currTM == "JOY") {
            SCdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            SCdata[44][0]++;
          } else if (currTB == "MEH") {
            SCdata[44][1]++;
          } else if (currTB == "JOY") {
            SCdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            SCdata[45][0]++;
          } else if (currTM == "MEH") {
            SCdata[45][1]++;
          } else if (currTM == "JOY") {
            SCdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            SCdata[46][0]++;
          } else if (currTW == "MEH") {
            SCdata[46][1]++;
          } else if (currTW == "JOY") {
            SCdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            SCdata[47][0]++;
          } else if (currWM == "MEH") {
            SCdata[47][1]++;
          } else if (currWM == "JOY") {
            SCdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            SCdata[48][0]++;
          } else if (currYP == "MEH") {
            SCdata[48][1]++;
          } else if (currYP == "JOY") {
            SCdata[48][2]++;
          }
  
        break;
      case "SD" :
          SDdata[0]++;

          if (currOut == "No") {
            SDdata[1][0]++;
          } else if (currOut = "Yes") {
            SDdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            SDdata[2][0]++;
          } else if (currBF == "MEH") {
            SDdata[2][1]++;
          } else if (currBF == "JOY") {
            SDdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            SDdata[3][0]++;
          } else if (currCC == "MEH") {
            SDdata[3][1]++;
          } else if (currCC == "JOY") {
            SDdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            SDdata[4][0]++;
          } else if (currCL == "MEH") {
            SDdata[4][1]++;
          } else if (currCL == "JOY") {
            SDdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            SDdata[5][0]++;
          } else if (currDT == "MEH") {
            SDdata[5][1]++;
          } else if (currDT == "JOY") {
            SDdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            SDdata[6][0]++;
          } else if (currFP == "MEH") {
            SDdata[6][1]++;
          } else if (currFP == "JOY") {
            SDdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            SDdata[7][0]++;
          } else if (currGP == "MEH") {
            SDdata[7][1]++;
          } else if (currGP == "JOY") {
            SDdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            SDdata[8][0]++;
          } else if (currGB == "MEH") {
            SDdata[8][1]++;
          } else if (currGB == "JOY") {
            SDdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            SDdata[9][0]++;
          } else if (currHF == "MEH") {
            SDdata[9][1]++;
          } else if (currHF == "JOY") {
            SDdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            SDdata[10][0]++;
          } else if (currHB == "MEH") {
            SDdata[10][1]++;
          } else if (currHB == "JOY") {
            SDdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            SDdata[11][0]++;
          } else if (currHD == "MEH") {
            SDdata[11][1]++;
          } else if (currHD == "JOY") {
            SDdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            SDdata[12][0]++;
          } else if (currHM == "MEH") {
            SDdata[12][1]++;
          } else if (currHM == "JOY") {
            SDdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            SDdata[13][0]++;
          } else if (currHK == "MEH") {
            SDdata[13][1]++;
          } else if (currHK == "JOY") {
            SDdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            SDdata[14][0]++;
          } else if (currJB == "MEH") {
            SDdata[14][1]++;
          } else if (currJB == "JOY") {
            SDdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            SDdata[15][0]++;
          } else if (currJG == "MEH") {
            SDdata[15][1]++;
          } else if (currJG == "JOY") {
            SDdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            SDdata[16][0]++;
          } else if (currJM == "MEH") {
            SDdata[16][1]++;
          } else if (currJM == "JOY") {
            SDdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            SDdata[17][0]++;
          } else if (currKK == "MEH") {
            SDdata[17][1]++;
          } else if (currKK == "JOY") {
            SDdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            SDdata[18][0]++;
          } else if (currLT == "MEH") {
            SDdata[18][1]++;
          } else if (currLT == "JOY") {
            SDdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            SDdata[19][0]++;
          } else if (currLH == "MEH") {
            SDdata[19][1]++;
          } else if (currLH == "JOY") {
            SDdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            SDdata[20][0]++;
          } else if (currLN == "MEH") {
            SDdata[20][1]++;
          } else if (currLN == "JOY") {
            SDdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            SDdata[21][0]++;
          } else if (currLB == "MEH") {
            SDdata[21][1]++;
          } else if (currLB == "JOY") {
            SDdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            SDdata[22][0]++;
          } else if (currLP == "MEH") {
            SDdata[22][1]++;
          } else if (currLP == "JOY") {
            SDdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            SDdata[23][0]++;
          } else if (currMI == "MEH") {
            SDdata[23][1]++;
          } else if (currMI == "JOY") {
            SDdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            SDdata[24][0]++;
          } else if (currMD == "MEH") {
            SDdata[24][1]++;
          } else if (currMD == "JOY") {
            SDdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            SDdata[25][0]++;
          } else if (currMW == "MEH") {
            SDdata[25][1]++;
          } else if (currMW == "JOY") {
            SDdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            SDdata[26][0]++;
          } else if (currMM == "MEH") {
            SDdata[26][1]++;
          } else if (currMM == "JOY") {
            SDdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            SDdata[27][0]++;
          } else if (currPM == "MEH") {
            SDdata[27][1]++;
          } else if (currPM == "JOY") {
            SDdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            SDdata[28][0]++;
          } else if (currMK == "MEH") {
            SDdata[28][1]++;
          } else if (currMK == "JOY") {
            SDdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            SDdata[29][0]++;
          } else if (currMG == "MEH") {
            SDdata[29][1]++;
          } else if (currMG == "JOY") {
            SDdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            SDdata[30][0]++;
          } else if (currND == "MEH") {
            SDdata[30][1]++;
          } else if (currND == "JOY") {
            SDdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            SDdata[31][0]++;
          } else if (currNC == "MEH") {
            SDdata[31][1]++;
          } else if (currNC == "JOY") {
            SDdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            SDdata[32][0]++;
          } else if (currPP == "MEH") {
            SDdata[32][1]++;
          } else if (currPP == "JOY") {
            SDdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            SDdata[33][0]++;
          } else if (currPS == "MEH") {
            SDdata[33][1]++;
          } else if (currPS == "JOY") {
            SDdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            SDdata[34][0]++;
          } else if (currRC == "MEH") {
            SDdata[34][1]++;
          } else if (currRC == "JOY") {
            SDdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            SDdata[35][0]++;
          } else if (currRP == "MEH") {
            SDdata[35][1]++;
          } else if (currRP == "JOY") {
            SDdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            SDdata[36][0]++;
          } else if (currRL == "MEH") {
            SDdata[36][1]++;
          } else if (currRL == "JOY") {
            SDdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            SDdata[37][0]++;
          } else if (currSK == "MEH") {
            SDdata[37][1]++;
          } else if (currSK == "JOY") {
            SDdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            SDdata[38][0]++;
          } else if (currSN == "MEH") {
            SDdata[38][1]++;
          } else if (currSN == "JOY") {
            SDdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            SDdata[39][0]++;
          } else if (currSP == "MEH") {
            SDdata[39][1]++;
          } else if (currSP == "JOY") {
            SDdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            SDdata[40][0]++;
          } else if (currST == "MEH") {
            SDdata[40][1]++;
          } else if (currST == "JOY") {
            SDdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            SDdata[41][0]++;
          } else if (currSF == "MEH") {
            SDdata[41][1]++;
          } else if (currSF == "JOY") {
            SDdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            SDdata[42][0]++;
          } else if (currTT == "MEH") {
            SDdata[42][1]++;
          } else if (currTT == "JOY") {
            SDdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            SDdata[43][0]++;
          } else if (currTM == "MEH") {
            SDdata[43][1]++;
          } else if (currTM == "JOY") {
            SDdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            SDdata[44][0]++;
          } else if (currTB == "MEH") {
            SDdata[44][1]++;
          } else if (currTB == "JOY") {
            SDdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            SDdata[45][0]++;
          } else if (currTM == "MEH") {
            SDdata[45][1]++;
          } else if (currTM == "JOY") {
            SDdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            SDdata[46][0]++;
          } else if (currTW == "MEH") {
            SDdata[46][1]++;
          } else if (currTW == "JOY") {
            SDdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            SDdata[47][0]++;
          } else if (currWM == "MEH") {
            SDdata[47][1]++;
          } else if (currWM == "JOY") {
            SDdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            SDdata[48][0]++;
          } else if (currYP == "MEH") {
            SDdata[48][1]++;
          } else if (currYP == "JOY") {
            SDdata[48][2]++;
          }
  
        break;
      case "TN" :
          TNdata[0]++;

          if (currOut == "No") {
            TNdata[1][0]++;
          } else if (currOut = "Yes") {
            TNdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            TNdata[2][0]++;
          } else if (currBF == "MEH") {
            TNdata[2][1]++;
          } else if (currBF == "JOY") {
            TNdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            TNdata[3][0]++;
          } else if (currCC == "MEH") {
            TNdata[3][1]++;
          } else if (currCC == "JOY") {
            TNdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            TNdata[4][0]++;
          } else if (currCL == "MEH") {
            TNdata[4][1]++;
          } else if (currCL == "JOY") {
            TNdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            TNdata[5][0]++;
          } else if (currDT == "MEH") {
            TNdata[5][1]++;
          } else if (currDT == "JOY") {
            TNdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            TNdata[6][0]++;
          } else if (currFP == "MEH") {
            TNdata[6][1]++;
          } else if (currFP == "JOY") {
            TNdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            TNdata[7][0]++;
          } else if (currGP == "MEH") {
            TNdata[7][1]++;
          } else if (currGP == "JOY") {
            TNdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            TNdata[8][0]++;
          } else if (currGB == "MEH") {
            TNdata[8][1]++;
          } else if (currGB == "JOY") {
            TNdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            TNdata[9][0]++;
          } else if (currHF == "MEH") {
            TNdata[9][1]++;
          } else if (currHF == "JOY") {
            TNdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            TNdata[10][0]++;
          } else if (currHB == "MEH") {
            TNdata[10][1]++;
          } else if (currHB == "JOY") {
            TNdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            TNdata[11][0]++;
          } else if (currHD == "MEH") {
            TNdata[11][1]++;
          } else if (currHD == "JOY") {
            TNdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            TNdata[12][0]++;
          } else if (currHM == "MEH") {
            TNdata[12][1]++;
          } else if (currHM == "JOY") {
            TNdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            TNdata[13][0]++;
          } else if (currHK == "MEH") {
            TNdata[13][1]++;
          } else if (currHK == "JOY") {
            TNdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            TNdata[14][0]++;
          } else if (currJB == "MEH") {
            TNdata[14][1]++;
          } else if (currJB == "JOY") {
            TNdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            TNdata[15][0]++;
          } else if (currJG == "MEH") {
            TNdata[15][1]++;
          } else if (currJG == "JOY") {
            TNdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            TNdata[16][0]++;
          } else if (currJM == "MEH") {
            TNdata[16][1]++;
          } else if (currJM == "JOY") {
            TNdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            TNdata[17][0]++;
          } else if (currKK == "MEH") {
            TNdata[17][1]++;
          } else if (currKK == "JOY") {
            TNdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            TNdata[18][0]++;
          } else if (currLT == "MEH") {
            TNdata[18][1]++;
          } else if (currLT == "JOY") {
            TNdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            TNdata[19][0]++;
          } else if (currLH == "MEH") {
            TNdata[19][1]++;
          } else if (currLH == "JOY") {
            TNdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            TNdata[20][0]++;
          } else if (currLN == "MEH") {
            TNdata[20][1]++;
          } else if (currLN == "JOY") {
            TNdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            TNdata[21][0]++;
          } else if (currLB == "MEH") {
            TNdata[21][1]++;
          } else if (currLB == "JOY") {
            TNdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            TNdata[22][0]++;
          } else if (currLP == "MEH") {
            TNdata[22][1]++;
          } else if (currLP == "JOY") {
            TNdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            TNdata[23][0]++;
          } else if (currMI == "MEH") {
            TNdata[23][1]++;
          } else if (currMI == "JOY") {
            TNdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            TNdata[24][0]++;
          } else if (currMD == "MEH") {
            TNdata[24][1]++;
          } else if (currMD == "JOY") {
            TNdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            TNdata[25][0]++;
          } else if (currMW == "MEH") {
            TNdata[25][1]++;
          } else if (currMW == "JOY") {
            TNdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            TNdata[26][0]++;
          } else if (currMM == "MEH") {
            TNdata[26][1]++;
          } else if (currMM == "JOY") {
            TNdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            TNdata[27][0]++;
          } else if (currPM == "MEH") {
            TNdata[27][1]++;
          } else if (currPM == "JOY") {
            TNdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            TNdata[28][0]++;
          } else if (currMK == "MEH") {
            TNdata[28][1]++;
          } else if (currMK == "JOY") {
            TNdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            TNdata[29][0]++;
          } else if (currMG == "MEH") {
            TNdata[29][1]++;
          } else if (currMG == "JOY") {
            TNdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            TNdata[30][0]++;
          } else if (currND == "MEH") {
            TNdata[30][1]++;
          } else if (currND == "JOY") {
            TNdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            TNdata[31][0]++;
          } else if (currNC == "MEH") {
            TNdata[31][1]++;
          } else if (currNC == "JOY") {
            TNdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            TNdata[32][0]++;
          } else if (currPP == "MEH") {
            TNdata[32][1]++;
          } else if (currPP == "JOY") {
            TNdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            TNdata[33][0]++;
          } else if (currPS == "MEH") {
            TNdata[33][1]++;
          } else if (currPS == "JOY") {
            TNdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            TNdata[34][0]++;
          } else if (currRC == "MEH") {
            TNdata[34][1]++;
          } else if (currRC == "JOY") {
            TNdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            TNdata[35][0]++;
          } else if (currRP == "MEH") {
            TNdata[35][1]++;
          } else if (currRP == "JOY") {
            TNdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            TNdata[36][0]++;
          } else if (currRL == "MEH") {
            TNdata[36][1]++;
          } else if (currRL == "JOY") {
            TNdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            TNdata[37][0]++;
          } else if (currSK == "MEH") {
            TNdata[37][1]++;
          } else if (currSK == "JOY") {
            TNdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            TNdata[38][0]++;
          } else if (currSN == "MEH") {
            TNdata[38][1]++;
          } else if (currSN == "JOY") {
            TNdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            TNdata[39][0]++;
          } else if (currSP == "MEH") {
            TNdata[39][1]++;
          } else if (currSP == "JOY") {
            TNdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            TNdata[40][0]++;
          } else if (currST == "MEH") {
            TNdata[40][1]++;
          } else if (currST == "JOY") {
            TNdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            TNdata[41][0]++;
          } else if (currSF == "MEH") {
            TNdata[41][1]++;
          } else if (currSF == "JOY") {
            TNdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            TNdata[42][0]++;
          } else if (currTT == "MEH") {
            TNdata[42][1]++;
          } else if (currTT == "JOY") {
            TNdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            TNdata[43][0]++;
          } else if (currTM == "MEH") {
            TNdata[43][1]++;
          } else if (currTM == "JOY") {
            TNdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            TNdata[44][0]++;
          } else if (currTB == "MEH") {
            TNdata[44][1]++;
          } else if (currTB == "JOY") {
            TNdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            TNdata[45][0]++;
          } else if (currTM == "MEH") {
            TNdata[45][1]++;
          } else if (currTM == "JOY") {
            TNdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            TNdata[46][0]++;
          } else if (currTW == "MEH") {
            TNdata[46][1]++;
          } else if (currTW == "JOY") {
            TNdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            TNdata[47][0]++;
          } else if (currWM == "MEH") {
            TNdata[47][1]++;
          } else if (currWM == "JOY") {
            TNdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            TNdata[48][0]++;
          } else if (currYP == "MEH") {
            TNdata[48][1]++;
          } else if (currYP == "JOY") {
            TNdata[48][2]++;
          }
  
        break;
      case "TX" :
          TXdata[0]++;

          if (currOut == "No") {
            TXdata[1][0]++;
          } else if (currOut = "Yes") {
            TXdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            TXdata[2][0]++;
          } else if (currBF == "MEH") {
            TXdata[2][1]++;
          } else if (currBF == "JOY") {
            TXdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            TXdata[3][0]++;
          } else if (currCC == "MEH") {
            TXdata[3][1]++;
          } else if (currCC == "JOY") {
            TXdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            TXdata[4][0]++;
          } else if (currCL == "MEH") {
            TXdata[4][1]++;
          } else if (currCL == "JOY") {
            TXdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            TXdata[5][0]++;
          } else if (currDT == "MEH") {
            TXdata[5][1]++;
          } else if (currDT == "JOY") {
            TXdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            TXdata[6][0]++;
          } else if (currFP == "MEH") {
            TXdata[6][1]++;
          } else if (currFP == "JOY") {
            TXdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            TXdata[7][0]++;
          } else if (currGP == "MEH") {
            TXdata[7][1]++;
          } else if (currGP == "JOY") {
            TXdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            TXdata[8][0]++;
          } else if (currGB == "MEH") {
            TXdata[8][1]++;
          } else if (currGB == "JOY") {
            TXdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            TXdata[9][0]++;
          } else if (currHF == "MEH") {
            TXdata[9][1]++;
          } else if (currHF == "JOY") {
            TXdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            TXdata[10][0]++;
          } else if (currHB == "MEH") {
            TXdata[10][1]++;
          } else if (currHB == "JOY") {
            TXdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            TXdata[11][0]++;
          } else if (currHD == "MEH") {
            TXdata[11][1]++;
          } else if (currHD == "JOY") {
            TXdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            TXdata[12][0]++;
          } else if (currHM == "MEH") {
            TXdata[12][1]++;
          } else if (currHM == "JOY") {
            TXdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            TXdata[13][0]++;
          } else if (currHK == "MEH") {
            TXdata[13][1]++;
          } else if (currHK == "JOY") {
            TXdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            TXdata[14][0]++;
          } else if (currJB == "MEH") {
            TXdata[14][1]++;
          } else if (currJB == "JOY") {
            TXdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            TXdata[15][0]++;
          } else if (currJG == "MEH") {
            TXdata[15][1]++;
          } else if (currJG == "JOY") {
            TXdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            TXdata[16][0]++;
          } else if (currJM == "MEH") {
            TXdata[16][1]++;
          } else if (currJM == "JOY") {
            TXdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            TXdata[17][0]++;
          } else if (currKK == "MEH") {
            TXdata[17][1]++;
          } else if (currKK == "JOY") {
            TXdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            TXdata[18][0]++;
          } else if (currLT == "MEH") {
            TXdata[18][1]++;
          } else if (currLT == "JOY") {
            TXdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            TXdata[19][0]++;
          } else if (currLH == "MEH") {
            TXdata[19][1]++;
          } else if (currLH == "JOY") {
            TXdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            TXdata[20][0]++;
          } else if (currLN == "MEH") {
            TXdata[20][1]++;
          } else if (currLN == "JOY") {
            TXdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            TXdata[21][0]++;
          } else if (currLB == "MEH") {
            TXdata[21][1]++;
          } else if (currLB == "JOY") {
            TXdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            TXdata[22][0]++;
          } else if (currLP == "MEH") {
            TXdata[22][1]++;
          } else if (currLP == "JOY") {
            TXdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            TXdata[23][0]++;
          } else if (currMI == "MEH") {
            TXdata[23][1]++;
          } else if (currMI == "JOY") {
            TXdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            TXdata[24][0]++;
          } else if (currMD == "MEH") {
            TXdata[24][1]++;
          } else if (currMD == "JOY") {
            TXdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            TXdata[25][0]++;
          } else if (currMW == "MEH") {
            TXdata[25][1]++;
          } else if (currMW == "JOY") {
            TXdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            TXdata[26][0]++;
          } else if (currMM == "MEH") {
            TXdata[26][1]++;
          } else if (currMM == "JOY") {
            TXdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            TXdata[27][0]++;
          } else if (currPM == "MEH") {
            TXdata[27][1]++;
          } else if (currPM == "JOY") {
            TXdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            TXdata[28][0]++;
          } else if (currMK == "MEH") {
            TXdata[28][1]++;
          } else if (currMK == "JOY") {
            TXdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            TXdata[29][0]++;
          } else if (currMG == "MEH") {
            TXdata[29][1]++;
          } else if (currMG == "JOY") {
            TXdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            TXdata[30][0]++;
          } else if (currND == "MEH") {
            TXdata[30][1]++;
          } else if (currND == "JOY") {
            TXdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            TXdata[31][0]++;
          } else if (currNC == "MEH") {
            TXdata[31][1]++;
          } else if (currNC == "JOY") {
            TXdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            TXdata[32][0]++;
          } else if (currPP == "MEH") {
            TXdata[32][1]++;
          } else if (currPP == "JOY") {
            TXdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            TXdata[33][0]++;
          } else if (currPS == "MEH") {
            TXdata[33][1]++;
          } else if (currPS == "JOY") {
            TXdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            TXdata[34][0]++;
          } else if (currRC == "MEH") {
            TXdata[34][1]++;
          } else if (currRC == "JOY") {
            TXdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            TXdata[35][0]++;
          } else if (currRP == "MEH") {
            TXdata[35][1]++;
          } else if (currRP == "JOY") {
            TXdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            TXdata[36][0]++;
          } else if (currRL == "MEH") {
            TXdata[36][1]++;
          } else if (currRL == "JOY") {
            TXdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            TXdata[37][0]++;
          } else if (currSK == "MEH") {
            TXdata[37][1]++;
          } else if (currSK == "JOY") {
            TXdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            TXdata[38][0]++;
          } else if (currSN == "MEH") {
            TXdata[38][1]++;
          } else if (currSN == "JOY") {
            TXdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            TXdata[39][0]++;
          } else if (currSP == "MEH") {
            TXdata[39][1]++;
          } else if (currSP == "JOY") {
            TXdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            TXdata[40][0]++;
          } else if (currST == "MEH") {
            TXdata[40][1]++;
          } else if (currST == "JOY") {
            TXdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            TXdata[41][0]++;
          } else if (currSF == "MEH") {
            TXdata[41][1]++;
          } else if (currSF == "JOY") {
            TXdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            TXdata[42][0]++;
          } else if (currTT == "MEH") {
            TXdata[42][1]++;
          } else if (currTT == "JOY") {
            TXdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            TXdata[43][0]++;
          } else if (currTM == "MEH") {
            TXdata[43][1]++;
          } else if (currTM == "JOY") {
            TXdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            TXdata[44][0]++;
          } else if (currTB == "MEH") {
            TXdata[44][1]++;
          } else if (currTB == "JOY") {
            TXdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            TXdata[45][0]++;
          } else if (currTM == "MEH") {
            TXdata[45][1]++;
          } else if (currTM == "JOY") {
            TXdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            TXdata[46][0]++;
          } else if (currTW == "MEH") {
            TXdata[46][1]++;
          } else if (currTW == "JOY") {
            TXdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            TXdata[47][0]++;
          } else if (currWM == "MEH") {
            TXdata[47][1]++;
          } else if (currWM == "JOY") {
            TXdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            TXdata[48][0]++;
          } else if (currYP == "MEH") {
            TXdata[48][1]++;
          } else if (currYP == "JOY") {
            TXdata[48][2]++;
          }
  
        break;
      case "UT" :
          UTdata[0]++;

          if (currOut == "No") {
            UTdata[1][0]++;
          } else if (currOut = "Yes") {
            UTdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            UTdata[2][0]++;
          } else if (currBF == "MEH") {
            UTdata[2][1]++;
          } else if (currBF == "JOY") {
            UTdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            UTdata[3][0]++;
          } else if (currCC == "MEH") {
            UTdata[3][1]++;
          } else if (currCC == "JOY") {
            UTdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            UTdata[4][0]++;
          } else if (currCL == "MEH") {
            UTdata[4][1]++;
          } else if (currCL == "JOY") {
            UTdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            UTdata[5][0]++;
          } else if (currDT == "MEH") {
            UTdata[5][1]++;
          } else if (currDT == "JOY") {
            UTdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            UTdata[6][0]++;
          } else if (currFP == "MEH") {
            UTdata[6][1]++;
          } else if (currFP == "JOY") {
            UTdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            UTdata[7][0]++;
          } else if (currGP == "MEH") {
            UTdata[7][1]++;
          } else if (currGP == "JOY") {
            UTdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            UTdata[8][0]++;
          } else if (currGB == "MEH") {
            UTdata[8][1]++;
          } else if (currGB == "JOY") {
            UTdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            UTdata[9][0]++;
          } else if (currHF == "MEH") {
            UTdata[9][1]++;
          } else if (currHF == "JOY") {
            UTdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            UTdata[10][0]++;
          } else if (currHB == "MEH") {
            UTdata[10][1]++;
          } else if (currHB == "JOY") {
            UTdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            UTdata[11][0]++;
          } else if (currHD == "MEH") {
            UTdata[11][1]++;
          } else if (currHD == "JOY") {
            UTdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            UTdata[12][0]++;
          } else if (currHM == "MEH") {
            UTdata[12][1]++;
          } else if (currHM == "JOY") {
            UTdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            UTdata[13][0]++;
          } else if (currHK == "MEH") {
            UTdata[13][1]++;
          } else if (currHK == "JOY") {
            UTdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            UTdata[14][0]++;
          } else if (currJB == "MEH") {
            UTdata[14][1]++;
          } else if (currJB == "JOY") {
            UTdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            UTdata[15][0]++;
          } else if (currJG == "MEH") {
            UTdata[15][1]++;
          } else if (currJG == "JOY") {
            UTdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            UTdata[16][0]++;
          } else if (currJM == "MEH") {
            UTdata[16][1]++;
          } else if (currJM == "JOY") {
            UTdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            UTdata[17][0]++;
          } else if (currKK == "MEH") {
            UTdata[17][1]++;
          } else if (currKK == "JOY") {
            UTdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            UTdata[18][0]++;
          } else if (currLT == "MEH") {
            UTdata[18][1]++;
          } else if (currLT == "JOY") {
            UTdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            UTdata[19][0]++;
          } else if (currLH == "MEH") {
            UTdata[19][1]++;
          } else if (currLH == "JOY") {
            UTdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            UTdata[20][0]++;
          } else if (currLN == "MEH") {
            UTdata[20][1]++;
          } else if (currLN == "JOY") {
            UTdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            UTdata[21][0]++;
          } else if (currLB == "MEH") {
            UTdata[21][1]++;
          } else if (currLB == "JOY") {
            UTdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            UTdata[22][0]++;
          } else if (currLP == "MEH") {
            UTdata[22][1]++;
          } else if (currLP == "JOY") {
            UTdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            UTdata[23][0]++;
          } else if (currMI == "MEH") {
            UTdata[23][1]++;
          } else if (currMI == "JOY") {
            UTdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            UTdata[24][0]++;
          } else if (currMD == "MEH") {
            UTdata[24][1]++;
          } else if (currMD == "JOY") {
            UTdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            UTdata[25][0]++;
          } else if (currMW == "MEH") {
            UTdata[25][1]++;
          } else if (currMW == "JOY") {
            UTdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            UTdata[26][0]++;
          } else if (currMM == "MEH") {
            UTdata[26][1]++;
          } else if (currMM == "JOY") {
            UTdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            UTdata[27][0]++;
          } else if (currPM == "MEH") {
            UTdata[27][1]++;
          } else if (currPM == "JOY") {
            UTdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            UTdata[28][0]++;
          } else if (currMK == "MEH") {
            UTdata[28][1]++;
          } else if (currMK == "JOY") {
            UTdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            UTdata[29][0]++;
          } else if (currMG == "MEH") {
            UTdata[29][1]++;
          } else if (currMG == "JOY") {
            UTdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            UTdata[30][0]++;
          } else if (currND == "MEH") {
            UTdata[30][1]++;
          } else if (currND == "JOY") {
            UTdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            UTdata[31][0]++;
          } else if (currNC == "MEH") {
            UTdata[31][1]++;
          } else if (currNC == "JOY") {
            UTdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            UTdata[32][0]++;
          } else if (currPP == "MEH") {
            UTdata[32][1]++;
          } else if (currPP == "JOY") {
            UTdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            UTdata[33][0]++;
          } else if (currPS == "MEH") {
            UTdata[33][1]++;
          } else if (currPS == "JOY") {
            UTdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            UTdata[34][0]++;
          } else if (currRC == "MEH") {
            UTdata[34][1]++;
          } else if (currRC == "JOY") {
            UTdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            UTdata[35][0]++;
          } else if (currRP == "MEH") {
            UTdata[35][1]++;
          } else if (currRP == "JOY") {
            UTdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            UTdata[36][0]++;
          } else if (currRL == "MEH") {
            UTdata[36][1]++;
          } else if (currRL == "JOY") {
            UTdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            UTdata[37][0]++;
          } else if (currSK == "MEH") {
            UTdata[37][1]++;
          } else if (currSK == "JOY") {
            UTdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            UTdata[38][0]++;
          } else if (currSN == "MEH") {
            UTdata[38][1]++;
          } else if (currSN == "JOY") {
            UTdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            UTdata[39][0]++;
          } else if (currSP == "MEH") {
            UTdata[39][1]++;
          } else if (currSP == "JOY") {
            UTdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            UTdata[40][0]++;
          } else if (currST == "MEH") {
            UTdata[40][1]++;
          } else if (currST == "JOY") {
            UTdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            UTdata[41][0]++;
          } else if (currSF == "MEH") {
            UTdata[41][1]++;
          } else if (currSF == "JOY") {
            UTdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            UTdata[42][0]++;
          } else if (currTT == "MEH") {
            UTdata[42][1]++;
          } else if (currTT == "JOY") {
            UTdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            UTdata[43][0]++;
          } else if (currTM == "MEH") {
            UTdata[43][1]++;
          } else if (currTM == "JOY") {
            UTdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            UTdata[44][0]++;
          } else if (currTB == "MEH") {
            UTdata[44][1]++;
          } else if (currTB == "JOY") {
            UTdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            UTdata[45][0]++;
          } else if (currTM == "MEH") {
            UTdata[45][1]++;
          } else if (currTM == "JOY") {
            UTdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            UTdata[46][0]++;
          } else if (currTW == "MEH") {
            UTdata[46][1]++;
          } else if (currTW == "JOY") {
            UTdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            UTdata[47][0]++;
          } else if (currWM == "MEH") {
            UTdata[47][1]++;
          } else if (currWM == "JOY") {
            UTdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            UTdata[48][0]++;
          } else if (currYP == "MEH") {
            UTdata[48][1]++;
          } else if (currYP == "JOY") {
            UTdata[48][2]++;
          }
  
        break;
      case "VT" :
          VTdata[0]++;

          if (currOut == "No") {
            VTdata[1][0]++;
          } else if (currOut = "Yes") {
            VTdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            VTdata[2][0]++;
          } else if (currBF == "MEH") {
            VTdata[2][1]++;
          } else if (currBF == "JOY") {
            VTdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            VTdata[3][0]++;
          } else if (currCC == "MEH") {
            VTdata[3][1]++;
          } else if (currCC == "JOY") {
            VTdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            VTdata[4][0]++;
          } else if (currCL == "MEH") {
            VTdata[4][1]++;
          } else if (currCL == "JOY") {
            VTdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            VTdata[5][0]++;
          } else if (currDT == "MEH") {
            VTdata[5][1]++;
          } else if (currDT == "JOY") {
            VTdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            VTdata[6][0]++;
          } else if (currFP == "MEH") {
            VTdata[6][1]++;
          } else if (currFP == "JOY") {
            VTdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            VTdata[7][0]++;
          } else if (currGP == "MEH") {
            VTdata[7][1]++;
          } else if (currGP == "JOY") {
            VTdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            VTdata[8][0]++;
          } else if (currGB == "MEH") {
            VTdata[8][1]++;
          } else if (currGB == "JOY") {
            VTdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            VTdata[9][0]++;
          } else if (currHF == "MEH") {
            VTdata[9][1]++;
          } else if (currHF == "JOY") {
            VTdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            VTdata[10][0]++;
          } else if (currHB == "MEH") {
            VTdata[10][1]++;
          } else if (currHB == "JOY") {
            VTdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            VTdata[11][0]++;
          } else if (currHD == "MEH") {
            VTdata[11][1]++;
          } else if (currHD == "JOY") {
            VTdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            VTdata[12][0]++;
          } else if (currHM == "MEH") {
            VTdata[12][1]++;
          } else if (currHM == "JOY") {
            VTdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            VTdata[13][0]++;
          } else if (currHK == "MEH") {
            VTdata[13][1]++;
          } else if (currHK == "JOY") {
            VTdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            VTdata[14][0]++;
          } else if (currJB == "MEH") {
            VTdata[14][1]++;
          } else if (currJB == "JOY") {
            VTdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            VTdata[15][0]++;
          } else if (currJG == "MEH") {
            VTdata[15][1]++;
          } else if (currJG == "JOY") {
            VTdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            VTdata[16][0]++;
          } else if (currJM == "MEH") {
            VTdata[16][1]++;
          } else if (currJM == "JOY") {
            VTdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            VTdata[17][0]++;
          } else if (currKK == "MEH") {
            VTdata[17][1]++;
          } else if (currKK == "JOY") {
            VTdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            VTdata[18][0]++;
          } else if (currLT == "MEH") {
            VTdata[18][1]++;
          } else if (currLT == "JOY") {
            VTdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            VTdata[19][0]++;
          } else if (currLH == "MEH") {
            VTdata[19][1]++;
          } else if (currLH == "JOY") {
            VTdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            VTdata[20][0]++;
          } else if (currLN == "MEH") {
            VTdata[20][1]++;
          } else if (currLN == "JOY") {
            VTdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            VTdata[21][0]++;
          } else if (currLB == "MEH") {
            VTdata[21][1]++;
          } else if (currLB == "JOY") {
            VTdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            VTdata[22][0]++;
          } else if (currLP == "MEH") {
            VTdata[22][1]++;
          } else if (currLP == "JOY") {
            VTdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            VTdata[23][0]++;
          } else if (currMI == "MEH") {
            VTdata[23][1]++;
          } else if (currMI == "JOY") {
            VTdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            VTdata[24][0]++;
          } else if (currMD == "MEH") {
            VTdata[24][1]++;
          } else if (currMD == "JOY") {
            VTdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            VTdata[25][0]++;
          } else if (currMW == "MEH") {
            VTdata[25][1]++;
          } else if (currMW == "JOY") {
            VTdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            VTdata[26][0]++;
          } else if (currMM == "MEH") {
            VTdata[26][1]++;
          } else if (currMM == "JOY") {
            VTdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            VTdata[27][0]++;
          } else if (currPM == "MEH") {
            VTdata[27][1]++;
          } else if (currPM == "JOY") {
            VTdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            VTdata[28][0]++;
          } else if (currMK == "MEH") {
            VTdata[28][1]++;
          } else if (currMK == "JOY") {
            VTdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            VTdata[29][0]++;
          } else if (currMG == "MEH") {
            VTdata[29][1]++;
          } else if (currMG == "JOY") {
            VTdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            VTdata[30][0]++;
          } else if (currND == "MEH") {
            VTdata[30][1]++;
          } else if (currND == "JOY") {
            VTdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            VTdata[31][0]++;
          } else if (currNC == "MEH") {
            VTdata[31][1]++;
          } else if (currNC == "JOY") {
            VTdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            VTdata[32][0]++;
          } else if (currPP == "MEH") {
            VTdata[32][1]++;
          } else if (currPP == "JOY") {
            VTdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            VTdata[33][0]++;
          } else if (currPS == "MEH") {
            VTdata[33][1]++;
          } else if (currPS == "JOY") {
            VTdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            VTdata[34][0]++;
          } else if (currRC == "MEH") {
            VTdata[34][1]++;
          } else if (currRC == "JOY") {
            VTdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            VTdata[35][0]++;
          } else if (currRP == "MEH") {
            VTdata[35][1]++;
          } else if (currRP == "JOY") {
            VTdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            VTdata[36][0]++;
          } else if (currRL == "MEH") {
            VTdata[36][1]++;
          } else if (currRL == "JOY") {
            VTdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            VTdata[37][0]++;
          } else if (currSK == "MEH") {
            VTdata[37][1]++;
          } else if (currSK == "JOY") {
            VTdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            VTdata[38][0]++;
          } else if (currSN == "MEH") {
            VTdata[38][1]++;
          } else if (currSN == "JOY") {
            VTdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            VTdata[39][0]++;
          } else if (currSP == "MEH") {
            VTdata[39][1]++;
          } else if (currSP == "JOY") {
            VTdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            VTdata[40][0]++;
          } else if (currST == "MEH") {
            VTdata[40][1]++;
          } else if (currST == "JOY") {
            VTdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            VTdata[41][0]++;
          } else if (currSF == "MEH") {
            VTdata[41][1]++;
          } else if (currSF == "JOY") {
            VTdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            VTdata[42][0]++;
          } else if (currTT == "MEH") {
            VTdata[42][1]++;
          } else if (currTT == "JOY") {
            VTdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            VTdata[43][0]++;
          } else if (currTM == "MEH") {
            VTdata[43][1]++;
          } else if (currTM == "JOY") {
            VTdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            VTdata[44][0]++;
          } else if (currTB == "MEH") {
            VTdata[44][1]++;
          } else if (currTB == "JOY") {
            VTdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            VTdata[45][0]++;
          } else if (currTM == "MEH") {
            VTdata[45][1]++;
          } else if (currTM == "JOY") {
            VTdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            VTdata[46][0]++;
          } else if (currTW == "MEH") {
            VTdata[46][1]++;
          } else if (currTW == "JOY") {
            VTdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            VTdata[47][0]++;
          } else if (currWM == "MEH") {
            VTdata[47][1]++;
          } else if (currWM == "JOY") {
            VTdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            VTdata[48][0]++;
          } else if (currYP == "MEH") {
            VTdata[48][1]++;
          } else if (currYP == "JOY") {
            VTdata[48][2]++;
          }
  
        break;
      case "VA" :
          VAdata[0]++;

          if (currOut == "No") {
            VAdata[1][0]++;
          } else if (currOut = "Yes") {
            VAdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            VAdata[2][0]++;
          } else if (currBF == "MEH") {
            VAdata[2][1]++;
          } else if (currBF == "JOY") {
            VAdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            VAdata[3][0]++;
          } else if (currCC == "MEH") {
            VAdata[3][1]++;
          } else if (currCC == "JOY") {
            VAdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            VAdata[4][0]++;
          } else if (currCL == "MEH") {
            VAdata[4][1]++;
          } else if (currCL == "JOY") {
            VAdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            VAdata[5][0]++;
          } else if (currDT == "MEH") {
            VAdata[5][1]++;
          } else if (currDT == "JOY") {
            VAdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            VAdata[6][0]++;
          } else if (currFP == "MEH") {
            VAdata[6][1]++;
          } else if (currFP == "JOY") {
            VAdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            VAdata[7][0]++;
          } else if (currGP == "MEH") {
            VAdata[7][1]++;
          } else if (currGP == "JOY") {
            VAdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            VAdata[8][0]++;
          } else if (currGB == "MEH") {
            VAdata[8][1]++;
          } else if (currGB == "JOY") {
            VAdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            VAdata[9][0]++;
          } else if (currHF == "MEH") {
            VAdata[9][1]++;
          } else if (currHF == "JOY") {
            VAdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            VAdata[10][0]++;
          } else if (currHB == "MEH") {
            VAdata[10][1]++;
          } else if (currHB == "JOY") {
            VAdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            VAdata[11][0]++;
          } else if (currHD == "MEH") {
            VAdata[11][1]++;
          } else if (currHD == "JOY") {
            VAdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            VAdata[12][0]++;
          } else if (currHM == "MEH") {
            VAdata[12][1]++;
          } else if (currHM == "JOY") {
            VAdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            VAdata[13][0]++;
          } else if (currHK == "MEH") {
            VAdata[13][1]++;
          } else if (currHK == "JOY") {
            VAdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            VAdata[14][0]++;
          } else if (currJB == "MEH") {
            VAdata[14][1]++;
          } else if (currJB == "JOY") {
            VAdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            VAdata[15][0]++;
          } else if (currJG == "MEH") {
            VAdata[15][1]++;
          } else if (currJG == "JOY") {
            VAdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            VAdata[16][0]++;
          } else if (currJM == "MEH") {
            VAdata[16][1]++;
          } else if (currJM == "JOY") {
            VAdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            VAdata[17][0]++;
          } else if (currKK == "MEH") {
            VAdata[17][1]++;
          } else if (currKK == "JOY") {
            VAdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            VAdata[18][0]++;
          } else if (currLT == "MEH") {
            VAdata[18][1]++;
          } else if (currLT == "JOY") {
            VAdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            VAdata[19][0]++;
          } else if (currLH == "MEH") {
            VAdata[19][1]++;
          } else if (currLH == "JOY") {
            VAdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            VAdata[20][0]++;
          } else if (currLN == "MEH") {
            VAdata[20][1]++;
          } else if (currLN == "JOY") {
            VAdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            VAdata[21][0]++;
          } else if (currLB == "MEH") {
            VAdata[21][1]++;
          } else if (currLB == "JOY") {
            VAdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            VAdata[22][0]++;
          } else if (currLP == "MEH") {
            VAdata[22][1]++;
          } else if (currLP == "JOY") {
            VAdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            VAdata[23][0]++;
          } else if (currMI == "MEH") {
            VAdata[23][1]++;
          } else if (currMI == "JOY") {
            VAdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            VAdata[24][0]++;
          } else if (currMD == "MEH") {
            VAdata[24][1]++;
          } else if (currMD == "JOY") {
            VAdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            VAdata[25][0]++;
          } else if (currMW == "MEH") {
            VAdata[25][1]++;
          } else if (currMW == "JOY") {
            VAdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            VAdata[26][0]++;
          } else if (currMM == "MEH") {
            VAdata[26][1]++;
          } else if (currMM == "JOY") {
            VAdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            VAdata[27][0]++;
          } else if (currPM == "MEH") {
            VAdata[27][1]++;
          } else if (currPM == "JOY") {
            VAdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            VAdata[28][0]++;
          } else if (currMK == "MEH") {
            VAdata[28][1]++;
          } else if (currMK == "JOY") {
            VAdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            VAdata[29][0]++;
          } else if (currMG == "MEH") {
            VAdata[29][1]++;
          } else if (currMG == "JOY") {
            VAdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            VAdata[30][0]++;
          } else if (currND == "MEH") {
            VAdata[30][1]++;
          } else if (currND == "JOY") {
            VAdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            VAdata[31][0]++;
          } else if (currNC == "MEH") {
            VAdata[31][1]++;
          } else if (currNC == "JOY") {
            VAdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            VAdata[32][0]++;
          } else if (currPP == "MEH") {
            VAdata[32][1]++;
          } else if (currPP == "JOY") {
            VAdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            VAdata[33][0]++;
          } else if (currPS == "MEH") {
            VAdata[33][1]++;
          } else if (currPS == "JOY") {
            VAdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            VAdata[34][0]++;
          } else if (currRC == "MEH") {
            VAdata[34][1]++;
          } else if (currRC == "JOY") {
            VAdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            VAdata[35][0]++;
          } else if (currRP == "MEH") {
            VAdata[35][1]++;
          } else if (currRP == "JOY") {
            VAdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            VAdata[36][0]++;
          } else if (currRL == "MEH") {
            VAdata[36][1]++;
          } else if (currRL == "JOY") {
            VAdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            VAdata[37][0]++;
          } else if (currSK == "MEH") {
            VAdata[37][1]++;
          } else if (currSK == "JOY") {
            VAdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            VAdata[38][0]++;
          } else if (currSN == "MEH") {
            VAdata[38][1]++;
          } else if (currSN == "JOY") {
            VAdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            VAdata[39][0]++;
          } else if (currSP == "MEH") {
            VAdata[39][1]++;
          } else if (currSP == "JOY") {
            VAdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            VAdata[40][0]++;
          } else if (currST == "MEH") {
            VAdata[40][1]++;
          } else if (currST == "JOY") {
            VAdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            VAdata[41][0]++;
          } else if (currSF == "MEH") {
            VAdata[41][1]++;
          } else if (currSF == "JOY") {
            VAdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            VAdata[42][0]++;
          } else if (currTT == "MEH") {
            VAdata[42][1]++;
          } else if (currTT == "JOY") {
            VAdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            VAdata[43][0]++;
          } else if (currTM == "MEH") {
            VAdata[43][1]++;
          } else if (currTM == "JOY") {
            VAdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            VAdata[44][0]++;
          } else if (currTB == "MEH") {
            VAdata[44][1]++;
          } else if (currTB == "JOY") {
            VAdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            VAdata[45][0]++;
          } else if (currTM == "MEH") {
            VAdata[45][1]++;
          } else if (currTM == "JOY") {
            VAdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            VAdata[46][0]++;
          } else if (currTW == "MEH") {
            VAdata[46][1]++;
          } else if (currTW == "JOY") {
            VAdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            VAdata[47][0]++;
          } else if (currWM == "MEH") {
            VAdata[47][1]++;
          } else if (currWM == "JOY") {
            VAdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            VAdata[48][0]++;
          } else if (currYP == "MEH") {
            VAdata[48][1]++;
          } else if (currYP == "JOY") {
            VAdata[48][2]++;
          }
  
        break;
      case "WA" :
          WAdata[0]++;

          if (currOut == "No") {
            WAdata[1][0]++;
          } else if (currOut = "Yes") {
            WAdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            WAdata[2][0]++;
          } else if (currBF == "MEH") {
            WAdata[2][1]++;
          } else if (currBF == "JOY") {
            WAdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            WAdata[3][0]++;
          } else if (currCC == "MEH") {
            WAdata[3][1]++;
          } else if (currCC == "JOY") {
            WAdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            WAdata[4][0]++;
          } else if (currCL == "MEH") {
            WAdata[4][1]++;
          } else if (currCL == "JOY") {
            WAdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            WAdata[5][0]++;
          } else if (currDT == "MEH") {
            WAdata[5][1]++;
          } else if (currDT == "JOY") {
            WAdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            WAdata[6][0]++;
          } else if (currFP == "MEH") {
            WAdata[6][1]++;
          } else if (currFP == "JOY") {
            WAdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            WAdata[7][0]++;
          } else if (currGP == "MEH") {
            WAdata[7][1]++;
          } else if (currGP == "JOY") {
            WAdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            WAdata[8][0]++;
          } else if (currGB == "MEH") {
            WAdata[8][1]++;
          } else if (currGB == "JOY") {
            WAdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            WAdata[9][0]++;
          } else if (currHF == "MEH") {
            WAdata[9][1]++;
          } else if (currHF == "JOY") {
            WAdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            WAdata[10][0]++;
          } else if (currHB == "MEH") {
            WAdata[10][1]++;
          } else if (currHB == "JOY") {
            WAdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            WAdata[11][0]++;
          } else if (currHD == "MEH") {
            WAdata[11][1]++;
          } else if (currHD == "JOY") {
            WAdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            WAdata[12][0]++;
          } else if (currHM == "MEH") {
            WAdata[12][1]++;
          } else if (currHM == "JOY") {
            WAdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            WAdata[13][0]++;
          } else if (currHK == "MEH") {
            WAdata[13][1]++;
          } else if (currHK == "JOY") {
            WAdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            WAdata[14][0]++;
          } else if (currJB == "MEH") {
            WAdata[14][1]++;
          } else if (currJB == "JOY") {
            WAdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            WAdata[15][0]++;
          } else if (currJG == "MEH") {
            WAdata[15][1]++;
          } else if (currJG == "JOY") {
            WAdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            WAdata[16][0]++;
          } else if (currJM == "MEH") {
            WAdata[16][1]++;
          } else if (currJM == "JOY") {
            WAdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            WAdata[17][0]++;
          } else if (currKK == "MEH") {
            WAdata[17][1]++;
          } else if (currKK == "JOY") {
            WAdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            WAdata[18][0]++;
          } else if (currLT == "MEH") {
            WAdata[18][1]++;
          } else if (currLT == "JOY") {
            WAdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            WAdata[19][0]++;
          } else if (currLH == "MEH") {
            WAdata[19][1]++;
          } else if (currLH == "JOY") {
            WAdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            WAdata[20][0]++;
          } else if (currLN == "MEH") {
            WAdata[20][1]++;
          } else if (currLN == "JOY") {
            WAdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            WAdata[21][0]++;
          } else if (currLB == "MEH") {
            WAdata[21][1]++;
          } else if (currLB == "JOY") {
            WAdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            WAdata[22][0]++;
          } else if (currLP == "MEH") {
            WAdata[22][1]++;
          } else if (currLP == "JOY") {
            WAdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            WAdata[23][0]++;
          } else if (currMI == "MEH") {
            WAdata[23][1]++;
          } else if (currMI == "JOY") {
            WAdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            WAdata[24][0]++;
          } else if (currMD == "MEH") {
            WAdata[24][1]++;
          } else if (currMD == "JOY") {
            WAdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            WAdata[25][0]++;
          } else if (currMW == "MEH") {
            WAdata[25][1]++;
          } else if (currMW == "JOY") {
            WAdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            WAdata[26][0]++;
          } else if (currMM == "MEH") {
            WAdata[26][1]++;
          } else if (currMM == "JOY") {
            WAdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            WAdata[27][0]++;
          } else if (currPM == "MEH") {
            WAdata[27][1]++;
          } else if (currPM == "JOY") {
            WAdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            WAdata[28][0]++;
          } else if (currMK == "MEH") {
            WAdata[28][1]++;
          } else if (currMK == "JOY") {
            WAdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            WAdata[29][0]++;
          } else if (currMG == "MEH") {
            WAdata[29][1]++;
          } else if (currMG == "JOY") {
            WAdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            WAdata[30][0]++;
          } else if (currND == "MEH") {
            WAdata[30][1]++;
          } else if (currND == "JOY") {
            WAdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            WAdata[31][0]++;
          } else if (currNC == "MEH") {
            WAdata[31][1]++;
          } else if (currNC == "JOY") {
            WAdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            WAdata[32][0]++;
          } else if (currPP == "MEH") {
            WAdata[32][1]++;
          } else if (currPP == "JOY") {
            WAdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            WAdata[33][0]++;
          } else if (currPS == "MEH") {
            WAdata[33][1]++;
          } else if (currPS == "JOY") {
            WAdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            WAdata[34][0]++;
          } else if (currRC == "MEH") {
            WAdata[34][1]++;
          } else if (currRC == "JOY") {
            WAdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            WAdata[35][0]++;
          } else if (currRP == "MEH") {
            WAdata[35][1]++;
          } else if (currRP == "JOY") {
            WAdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            WAdata[36][0]++;
          } else if (currRL == "MEH") {
            WAdata[36][1]++;
          } else if (currRL == "JOY") {
            WAdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            WAdata[37][0]++;
          } else if (currSK == "MEH") {
            WAdata[37][1]++;
          } else if (currSK == "JOY") {
            WAdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            WAdata[38][0]++;
          } else if (currSN == "MEH") {
            WAdata[38][1]++;
          } else if (currSN == "JOY") {
            WAdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            WAdata[39][0]++;
          } else if (currSP == "MEH") {
            WAdata[39][1]++;
          } else if (currSP == "JOY") {
            WAdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            WAdata[40][0]++;
          } else if (currST == "MEH") {
            WAdata[40][1]++;
          } else if (currST == "JOY") {
            WAdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            WAdata[41][0]++;
          } else if (currSF == "MEH") {
            WAdata[41][1]++;
          } else if (currSF == "JOY") {
            WAdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            WAdata[42][0]++;
          } else if (currTT == "MEH") {
            WAdata[42][1]++;
          } else if (currTT == "JOY") {
            WAdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            WAdata[43][0]++;
          } else if (currTM == "MEH") {
            WAdata[43][1]++;
          } else if (currTM == "JOY") {
            WAdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            WAdata[44][0]++;
          } else if (currTB == "MEH") {
            WAdata[44][1]++;
          } else if (currTB == "JOY") {
            WAdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            WAdata[45][0]++;
          } else if (currTM == "MEH") {
            WAdata[45][1]++;
          } else if (currTM == "JOY") {
            WAdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            WAdata[46][0]++;
          } else if (currTW == "MEH") {
            WAdata[46][1]++;
          } else if (currTW == "JOY") {
            WAdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            WAdata[47][0]++;
          } else if (currWM == "MEH") {
            WAdata[47][1]++;
          } else if (currWM == "JOY") {
            WAdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            WAdata[48][0]++;
          } else if (currYP == "MEH") {
            WAdata[48][1]++;
          } else if (currYP == "JOY") {
            WAdata[48][2]++;
          }
  
        break;
      case "WV" :
          WVdata[0]++;

          if (currOut == "No") {
            WVdata[1][0]++;
          } else if (currOut = "Yes") {
            WVdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            WVdata[2][0]++;
          } else if (currBF == "MEH") {
            WVdata[2][1]++;
          } else if (currBF == "JOY") {
            WVdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            WVdata[3][0]++;
          } else if (currCC == "MEH") {
            WVdata[3][1]++;
          } else if (currCC == "JOY") {
            WVdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            WVdata[4][0]++;
          } else if (currCL == "MEH") {
            WVdata[4][1]++;
          } else if (currCL == "JOY") {
            WVdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            WVdata[5][0]++;
          } else if (currDT == "MEH") {
            WVdata[5][1]++;
          } else if (currDT == "JOY") {
            WVdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            WVdata[6][0]++;
          } else if (currFP == "MEH") {
            WVdata[6][1]++;
          } else if (currFP == "JOY") {
            WVdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            WVdata[7][0]++;
          } else if (currGP == "MEH") {
            WVdata[7][1]++;
          } else if (currGP == "JOY") {
            WVdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            WVdata[8][0]++;
          } else if (currGB == "MEH") {
            WVdata[8][1]++;
          } else if (currGB == "JOY") {
            WVdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            WVdata[9][0]++;
          } else if (currHF == "MEH") {
            WVdata[9][1]++;
          } else if (currHF == "JOY") {
            WVdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            WVdata[10][0]++;
          } else if (currHB == "MEH") {
            WVdata[10][1]++;
          } else if (currHB == "JOY") {
            WVdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            WVdata[11][0]++;
          } else if (currHD == "MEH") {
            WVdata[11][1]++;
          } else if (currHD == "JOY") {
            WVdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            WVdata[12][0]++;
          } else if (currHM == "MEH") {
            WVdata[12][1]++;
          } else if (currHM == "JOY") {
            WVdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            WVdata[13][0]++;
          } else if (currHK == "MEH") {
            WVdata[13][1]++;
          } else if (currHK == "JOY") {
            WVdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            WVdata[14][0]++;
          } else if (currJB == "MEH") {
            WVdata[14][1]++;
          } else if (currJB == "JOY") {
            WVdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            WVdata[15][0]++;
          } else if (currJG == "MEH") {
            WVdata[15][1]++;
          } else if (currJG == "JOY") {
            WVdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            WVdata[16][0]++;
          } else if (currJM == "MEH") {
            WVdata[16][1]++;
          } else if (currJM == "JOY") {
            WVdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            WVdata[17][0]++;
          } else if (currKK == "MEH") {
            WVdata[17][1]++;
          } else if (currKK == "JOY") {
            WVdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            WVdata[18][0]++;
          } else if (currLT == "MEH") {
            WVdata[18][1]++;
          } else if (currLT == "JOY") {
            WVdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            WVdata[19][0]++;
          } else if (currLH == "MEH") {
            WVdata[19][1]++;
          } else if (currLH == "JOY") {
            WVdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            WVdata[20][0]++;
          } else if (currLN == "MEH") {
            WVdata[20][1]++;
          } else if (currLN == "JOY") {
            WVdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            WVdata[21][0]++;
          } else if (currLB == "MEH") {
            WVdata[21][1]++;
          } else if (currLB == "JOY") {
            WVdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            WVdata[22][0]++;
          } else if (currLP == "MEH") {
            WVdata[22][1]++;
          } else if (currLP == "JOY") {
            WVdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            WVdata[23][0]++;
          } else if (currMI == "MEH") {
            WVdata[23][1]++;
          } else if (currMI == "JOY") {
            WVdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            WVdata[24][0]++;
          } else if (currMD == "MEH") {
            WVdata[24][1]++;
          } else if (currMD == "JOY") {
            WVdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            WVdata[25][0]++;
          } else if (currMW == "MEH") {
            WVdata[25][1]++;
          } else if (currMW == "JOY") {
            WVdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            WVdata[26][0]++;
          } else if (currMM == "MEH") {
            WVdata[26][1]++;
          } else if (currMM == "JOY") {
            WVdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            WVdata[27][0]++;
          } else if (currPM == "MEH") {
            WVdata[27][1]++;
          } else if (currPM == "JOY") {
            WVdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            WVdata[28][0]++;
          } else if (currMK == "MEH") {
            WVdata[28][1]++;
          } else if (currMK == "JOY") {
            WVdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            WVdata[29][0]++;
          } else if (currMG == "MEH") {
            WVdata[29][1]++;
          } else if (currMG == "JOY") {
            WVdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            WVdata[30][0]++;
          } else if (currND == "MEH") {
            WVdata[30][1]++;
          } else if (currND == "JOY") {
            WVdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            WVdata[31][0]++;
          } else if (currNC == "MEH") {
            WVdata[31][1]++;
          } else if (currNC == "JOY") {
            WVdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            WVdata[32][0]++;
          } else if (currPP == "MEH") {
            WVdata[32][1]++;
          } else if (currPP == "JOY") {
            WVdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            WVdata[33][0]++;
          } else if (currPS == "MEH") {
            WVdata[33][1]++;
          } else if (currPS == "JOY") {
            WVdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            WVdata[34][0]++;
          } else if (currRC == "MEH") {
            WVdata[34][1]++;
          } else if (currRC == "JOY") {
            WVdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            WVdata[35][0]++;
          } else if (currRP == "MEH") {
            WVdata[35][1]++;
          } else if (currRP == "JOY") {
            WVdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            WVdata[36][0]++;
          } else if (currRL == "MEH") {
            WVdata[36][1]++;
          } else if (currRL == "JOY") {
            WVdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            WVdata[37][0]++;
          } else if (currSK == "MEH") {
            WVdata[37][1]++;
          } else if (currSK == "JOY") {
            WVdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            WVdata[38][0]++;
          } else if (currSN == "MEH") {
            WVdata[38][1]++;
          } else if (currSN == "JOY") {
            WVdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            WVdata[39][0]++;
          } else if (currSP == "MEH") {
            WVdata[39][1]++;
          } else if (currSP == "JOY") {
            WVdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            WVdata[40][0]++;
          } else if (currST == "MEH") {
            WVdata[40][1]++;
          } else if (currST == "JOY") {
            WVdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            WVdata[41][0]++;
          } else if (currSF == "MEH") {
            WVdata[41][1]++;
          } else if (currSF == "JOY") {
            WVdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            WVdata[42][0]++;
          } else if (currTT == "MEH") {
            WVdata[42][1]++;
          } else if (currTT == "JOY") {
            WVdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            WVdata[43][0]++;
          } else if (currTM == "MEH") {
            WVdata[43][1]++;
          } else if (currTM == "JOY") {
            WVdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            WVdata[44][0]++;
          } else if (currTB == "MEH") {
            WVdata[44][1]++;
          } else if (currTB == "JOY") {
            WVdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            WVdata[45][0]++;
          } else if (currTM == "MEH") {
            WVdata[45][1]++;
          } else if (currTM == "JOY") {
            WVdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            WVdata[46][0]++;
          } else if (currTW == "MEH") {
            WVdata[46][1]++;
          } else if (currTW == "JOY") {
            WVdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            WVdata[47][0]++;
          } else if (currWM == "MEH") {
            WVdata[47][1]++;
          } else if (currWM == "JOY") {
            WVdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            WVdata[48][0]++;
          } else if (currYP == "MEH") {
            WVdata[48][1]++;
          } else if (currYP == "JOY") {
            WVdata[48][2]++;
          }
  
        break;
      case "WI" :
          WIdata[0]++;

          if (currOut == "No") {
            WIdata[1][0]++;
          } else if (currOut = "Yes") {
            WIdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            WIdata[2][0]++;
          } else if (currBF == "MEH") {
            WIdata[2][1]++;
          } else if (currBF == "JOY") {
            WIdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            WIdata[3][0]++;
          } else if (currCC == "MEH") {
            WIdata[3][1]++;
          } else if (currCC == "JOY") {
            WIdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            WIdata[4][0]++;
          } else if (currCL == "MEH") {
            WIdata[4][1]++;
          } else if (currCL == "JOY") {
            WIdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            WIdata[5][0]++;
          } else if (currDT == "MEH") {
            WIdata[5][1]++;
          } else if (currDT == "JOY") {
            WIdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            WIdata[6][0]++;
          } else if (currFP == "MEH") {
            WIdata[6][1]++;
          } else if (currFP == "JOY") {
            WIdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            WIdata[7][0]++;
          } else if (currGP == "MEH") {
            WIdata[7][1]++;
          } else if (currGP == "JOY") {
            WIdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            WIdata[8][0]++;
          } else if (currGB == "MEH") {
            WIdata[8][1]++;
          } else if (currGB == "JOY") {
            WIdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            WIdata[9][0]++;
          } else if (currHF == "MEH") {
            WIdata[9][1]++;
          } else if (currHF == "JOY") {
            WIdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            WIdata[10][0]++;
          } else if (currHB == "MEH") {
            WIdata[10][1]++;
          } else if (currHB == "JOY") {
            WIdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            WIdata[11][0]++;
          } else if (currHD == "MEH") {
            WIdata[11][1]++;
          } else if (currHD == "JOY") {
            WIdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            WIdata[12][0]++;
          } else if (currHM == "MEH") {
            WIdata[12][1]++;
          } else if (currHM == "JOY") {
            WIdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            WIdata[13][0]++;
          } else if (currHK == "MEH") {
            WIdata[13][1]++;
          } else if (currHK == "JOY") {
            WIdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            WIdata[14][0]++;
          } else if (currJB == "MEH") {
            WIdata[14][1]++;
          } else if (currJB == "JOY") {
            WIdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            WIdata[15][0]++;
          } else if (currJG == "MEH") {
            WIdata[15][1]++;
          } else if (currJG == "JOY") {
            WIdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            WIdata[16][0]++;
          } else if (currJM == "MEH") {
            WIdata[16][1]++;
          } else if (currJM == "JOY") {
            WIdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            WIdata[17][0]++;
          } else if (currKK == "MEH") {
            WIdata[17][1]++;
          } else if (currKK == "JOY") {
            WIdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            WIdata[18][0]++;
          } else if (currLT == "MEH") {
            WIdata[18][1]++;
          } else if (currLT == "JOY") {
            WIdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            WIdata[19][0]++;
          } else if (currLH == "MEH") {
            WIdata[19][1]++;
          } else if (currLH == "JOY") {
            WIdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            WIdata[20][0]++;
          } else if (currLN == "MEH") {
            WIdata[20][1]++;
          } else if (currLN == "JOY") {
            WIdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            WIdata[21][0]++;
          } else if (currLB == "MEH") {
            WIdata[21][1]++;
          } else if (currLB == "JOY") {
            WIdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            WIdata[22][0]++;
          } else if (currLP == "MEH") {
            WIdata[22][1]++;
          } else if (currLP == "JOY") {
            WIdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            WIdata[23][0]++;
          } else if (currMI == "MEH") {
            WIdata[23][1]++;
          } else if (currMI == "JOY") {
            WIdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            WIdata[24][0]++;
          } else if (currMD == "MEH") {
            WIdata[24][1]++;
          } else if (currMD == "JOY") {
            WIdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            WIdata[25][0]++;
          } else if (currMW == "MEH") {
            WIdata[25][1]++;
          } else if (currMW == "JOY") {
            WIdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            WIdata[26][0]++;
          } else if (currMM == "MEH") {
            WIdata[26][1]++;
          } else if (currMM == "JOY") {
            WIdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            WIdata[27][0]++;
          } else if (currPM == "MEH") {
            WIdata[27][1]++;
          } else if (currPM == "JOY") {
            WIdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            WIdata[28][0]++;
          } else if (currMK == "MEH") {
            WIdata[28][1]++;
          } else if (currMK == "JOY") {
            WIdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            WIdata[29][0]++;
          } else if (currMG == "MEH") {
            WIdata[29][1]++;
          } else if (currMG == "JOY") {
            WIdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            WIdata[30][0]++;
          } else if (currND == "MEH") {
            WIdata[30][1]++;
          } else if (currND == "JOY") {
            WIdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            WIdata[31][0]++;
          } else if (currNC == "MEH") {
            WIdata[31][1]++;
          } else if (currNC == "JOY") {
            WIdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            WIdata[32][0]++;
          } else if (currPP == "MEH") {
            WIdata[32][1]++;
          } else if (currPP == "JOY") {
            WIdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            WIdata[33][0]++;
          } else if (currPS == "MEH") {
            WIdata[33][1]++;
          } else if (currPS == "JOY") {
            WIdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            WIdata[34][0]++;
          } else if (currRC == "MEH") {
            WIdata[34][1]++;
          } else if (currRC == "JOY") {
            WIdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            WIdata[35][0]++;
          } else if (currRP == "MEH") {
            WIdata[35][1]++;
          } else if (currRP == "JOY") {
            WIdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            WIdata[36][0]++;
          } else if (currRL == "MEH") {
            WIdata[36][1]++;
          } else if (currRL == "JOY") {
            WIdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            WIdata[37][0]++;
          } else if (currSK == "MEH") {
            WIdata[37][1]++;
          } else if (currSK == "JOY") {
            WIdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            WIdata[38][0]++;
          } else if (currSN == "MEH") {
            WIdata[38][1]++;
          } else if (currSN == "JOY") {
            WIdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            WIdata[39][0]++;
          } else if (currSP == "MEH") {
            WIdata[39][1]++;
          } else if (currSP == "JOY") {
            WIdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            WIdata[40][0]++;
          } else if (currST == "MEH") {
            WIdata[40][1]++;
          } else if (currST == "JOY") {
            WIdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            WIdata[41][0]++;
          } else if (currSF == "MEH") {
            WIdata[41][1]++;
          } else if (currSF == "JOY") {
            WIdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            WIdata[42][0]++;
          } else if (currTT == "MEH") {
            WIdata[42][1]++;
          } else if (currTT == "JOY") {
            WIdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            WIdata[43][0]++;
          } else if (currTM == "MEH") {
            WIdata[43][1]++;
          } else if (currTM == "JOY") {
            WIdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            WIdata[44][0]++;
          } else if (currTB == "MEH") {
            WIdata[44][1]++;
          } else if (currTB == "JOY") {
            WIdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            WIdata[45][0]++;
          } else if (currTM == "MEH") {
            WIdata[45][1]++;
          } else if (currTM == "JOY") {
            WIdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            WIdata[46][0]++;
          } else if (currTW == "MEH") {
            WIdata[46][1]++;
          } else if (currTW == "JOY") {
            WIdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            WIdata[47][0]++;
          } else if (currWM == "MEH") {
            WIdata[47][1]++;
          } else if (currWM == "JOY") {
            WIdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            WIdata[48][0]++;
          } else if (currYP == "MEH") {
            WIdata[48][1]++;
          } else if (currYP == "JOY") {
            WIdata[48][2]++;
          }
  
        break;
      case "WY" :
          WYdata[0]++;

          if (currOut == "No") {
            WYdata[1][0]++;
          } else if (currOut = "Yes") {
            WYdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            WYdata[2][0]++;
          } else if (currBF == "MEH") {
            WYdata[2][1]++;
          } else if (currBF == "JOY") {
            WYdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            WYdata[3][0]++;
          } else if (currCC == "MEH") {
            WYdata[3][1]++;
          } else if (currCC == "JOY") {
            WYdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            WYdata[4][0]++;
          } else if (currCL == "MEH") {
            WYdata[4][1]++;
          } else if (currCL == "JOY") {
            WYdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            WYdata[5][0]++;
          } else if (currDT == "MEH") {
            WYdata[5][1]++;
          } else if (currDT == "JOY") {
            WYdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            WYdata[6][0]++;
          } else if (currFP == "MEH") {
            WYdata[6][1]++;
          } else if (currFP == "JOY") {
            WYdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            WYdata[7][0]++;
          } else if (currGP == "MEH") {
            WYdata[7][1]++;
          } else if (currGP == "JOY") {
            WYdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            WYdata[8][0]++;
          } else if (currGB == "MEH") {
            WYdata[8][1]++;
          } else if (currGB == "JOY") {
            WYdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            WYdata[9][0]++;
          } else if (currHF == "MEH") {
            WYdata[9][1]++;
          } else if (currHF == "JOY") {
            WYdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            WYdata[10][0]++;
          } else if (currHB == "MEH") {
            WYdata[10][1]++;
          } else if (currHB == "JOY") {
            WYdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            WYdata[11][0]++;
          } else if (currHD == "MEH") {
            WYdata[11][1]++;
          } else if (currHD == "JOY") {
            WYdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            WYdata[12][0]++;
          } else if (currHM == "MEH") {
            WYdata[12][1]++;
          } else if (currHM == "JOY") {
            WYdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            WYdata[13][0]++;
          } else if (currHK == "MEH") {
            WYdata[13][1]++;
          } else if (currHK == "JOY") {
            WYdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            WYdata[14][0]++;
          } else if (currJB == "MEH") {
            WYdata[14][1]++;
          } else if (currJB == "JOY") {
            WYdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            WYdata[15][0]++;
          } else if (currJG == "MEH") {
            WYdata[15][1]++;
          } else if (currJG == "JOY") {
            WYdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            WYdata[16][0]++;
          } else if (currJM == "MEH") {
            WYdata[16][1]++;
          } else if (currJM == "JOY") {
            WYdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            WYdata[17][0]++;
          } else if (currKK == "MEH") {
            WYdata[17][1]++;
          } else if (currKK == "JOY") {
            WYdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            WYdata[18][0]++;
          } else if (currLT == "MEH") {
            WYdata[18][1]++;
          } else if (currLT == "JOY") {
            WYdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            WYdata[19][0]++;
          } else if (currLH == "MEH") {
            WYdata[19][1]++;
          } else if (currLH == "JOY") {
            WYdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            WYdata[20][0]++;
          } else if (currLN == "MEH") {
            WYdata[20][1]++;
          } else if (currLN == "JOY") {
            WYdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            WYdata[21][0]++;
          } else if (currLB == "MEH") {
            WYdata[21][1]++;
          } else if (currLB == "JOY") {
            WYdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            WYdata[22][0]++;
          } else if (currLP == "MEH") {
            WYdata[22][1]++;
          } else if (currLP == "JOY") {
            WYdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            WYdata[23][0]++;
          } else if (currMI == "MEH") {
            WYdata[23][1]++;
          } else if (currMI == "JOY") {
            WYdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            WYdata[24][0]++;
          } else if (currMD == "MEH") {
            WYdata[24][1]++;
          } else if (currMD == "JOY") {
            WYdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            WYdata[25][0]++;
          } else if (currMW == "MEH") {
            WYdata[25][1]++;
          } else if (currMW == "JOY") {
            WYdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            WYdata[26][0]++;
          } else if (currMM == "MEH") {
            WYdata[26][1]++;
          } else if (currMM == "JOY") {
            WYdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            WYdata[27][0]++;
          } else if (currPM == "MEH") {
            WYdata[27][1]++;
          } else if (currPM == "JOY") {
            WYdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            WYdata[28][0]++;
          } else if (currMK == "MEH") {
            WYdata[28][1]++;
          } else if (currMK == "JOY") {
            WYdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            WYdata[29][0]++;
          } else if (currMG == "MEH") {
            WYdata[29][1]++;
          } else if (currMG == "JOY") {
            WYdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            WYdata[30][0]++;
          } else if (currND == "MEH") {
            WYdata[30][1]++;
          } else if (currND == "JOY") {
            WYdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            WYdata[31][0]++;
          } else if (currNC == "MEH") {
            WYdata[31][1]++;
          } else if (currNC == "JOY") {
            WYdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            WYdata[32][0]++;
          } else if (currPP == "MEH") {
            WYdata[32][1]++;
          } else if (currPP == "JOY") {
            WYdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            WYdata[33][0]++;
          } else if (currPS == "MEH") {
            WYdata[33][1]++;
          } else if (currPS == "JOY") {
            WYdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            WYdata[34][0]++;
          } else if (currRC == "MEH") {
            WYdata[34][1]++;
          } else if (currRC == "JOY") {
            WYdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            WYdata[35][0]++;
          } else if (currRP == "MEH") {
            WYdata[35][1]++;
          } else if (currRP == "JOY") {
            WYdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            WYdata[36][0]++;
          } else if (currRL == "MEH") {
            WYdata[36][1]++;
          } else if (currRL == "JOY") {
            WYdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            WYdata[37][0]++;
          } else if (currSK == "MEH") {
            WYdata[37][1]++;
          } else if (currSK == "JOY") {
            WYdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            WYdata[38][0]++;
          } else if (currSN == "MEH") {
            WYdata[38][1]++;
          } else if (currSN == "JOY") {
            WYdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            WYdata[39][0]++;
          } else if (currSP == "MEH") {
            WYdata[39][1]++;
          } else if (currSP == "JOY") {
            WYdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            WYdata[40][0]++;
          } else if (currST == "MEH") {
            WYdata[40][1]++;
          } else if (currST == "JOY") {
            WYdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            WYdata[41][0]++;
          } else if (currSF == "MEH") {
            WYdata[41][1]++;
          } else if (currSF == "JOY") {
            WYdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            WYdata[42][0]++;
          } else if (currTT == "MEH") {
            WYdata[42][1]++;
          } else if (currTT == "JOY") {
            WYdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            WYdata[43][0]++;
          } else if (currTM == "MEH") {
            WYdata[43][1]++;
          } else if (currTM == "JOY") {
            WYdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            WYdata[44][0]++;
          } else if (currTB == "MEH") {
            WYdata[44][1]++;
          } else if (currTB == "JOY") {
            WYdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            WYdata[45][0]++;
          } else if (currTM == "MEH") {
            WYdata[45][1]++;
          } else if (currTM == "JOY") {
            WYdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            WYdata[46][0]++;
          } else if (currTW == "MEH") {
            WYdata[46][1]++;
          } else if (currTW == "JOY") {
            WYdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            WYdata[47][0]++;
          } else if (currWM == "MEH") {
            WYdata[47][1]++;
          } else if (currWM == "JOY") {
            WYdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            WYdata[48][0]++;
          } else if (currYP == "MEH") {
            WYdata[48][1]++;
          } else if (currYP == "JOY") {
            WYdata[48][2]++;
          }
  
        break;

    //CANADA
      case "BC" :
          BCdata[0]++;

          if (currOut == "No") {
            BCdata[1][0]++;
          } else if (currOut = "Yes") {
            BCdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            BCdata[2][0]++;
          } else if (currBF == "MEH") {
            BCdata[2][1]++;
          } else if (currBF == "JOY") {
            BCdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            BCdata[3][0]++;
          } else if (currCC == "MEH") {
            BCdata[3][1]++;
          } else if (currCC == "JOY") {
            BCdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            BCdata[4][0]++;
          } else if (currCL == "MEH") {
            BCdata[4][1]++;
          } else if (currCL == "JOY") {
            BCdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            BCdata[5][0]++;
          } else if (currDT == "MEH") {
            BCdata[5][1]++;
          } else if (currDT == "JOY") {
            BCdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            BCdata[6][0]++;
          } else if (currFP == "MEH") {
            BCdata[6][1]++;
          } else if (currFP == "JOY") {
            BCdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            BCdata[7][0]++;
          } else if (currGP == "MEH") {
            BCdata[7][1]++;
          } else if (currGP == "JOY") {
            BCdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            BCdata[8][0]++;
          } else if (currGB == "MEH") {
            BCdata[8][1]++;
          } else if (currGB == "JOY") {
            BCdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            BCdata[9][0]++;
          } else if (currHF == "MEH") {
            BCdata[9][1]++;
          } else if (currHF == "JOY") {
            BCdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            BCdata[10][0]++;
          } else if (currHB == "MEH") {
            BCdata[10][1]++;
          } else if (currHB == "JOY") {
            BCdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            BCdata[11][0]++;
          } else if (currHD == "MEH") {
            BCdata[11][1]++;
          } else if (currHD == "JOY") {
            BCdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            BCdata[12][0]++;
          } else if (currHM == "MEH") {
            BCdata[12][1]++;
          } else if (currHM == "JOY") {
            BCdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            BCdata[13][0]++;
          } else if (currHK == "MEH") {
            BCdata[13][1]++;
          } else if (currHK == "JOY") {
            BCdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            BCdata[14][0]++;
          } else if (currJB == "MEH") {
            BCdata[14][1]++;
          } else if (currJB == "JOY") {
            BCdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            BCdata[15][0]++;
          } else if (currJG == "MEH") {
            BCdata[15][1]++;
          } else if (currJG == "JOY") {
            BCdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            BCdata[16][0]++;
          } else if (currJM == "MEH") {
            BCdata[16][1]++;
          } else if (currJM == "JOY") {
            BCdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            BCdata[17][0]++;
          } else if (currKK == "MEH") {
            BCdata[17][1]++;
          } else if (currKK == "JOY") {
            BCdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            BCdata[18][0]++;
          } else if (currLT == "MEH") {
            BCdata[18][1]++;
          } else if (currLT == "JOY") {
            BCdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            BCdata[19][0]++;
          } else if (currLH == "MEH") {
            BCdata[19][1]++;
          } else if (currLH == "JOY") {
            BCdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            BCdata[20][0]++;
          } else if (currLN == "MEH") {
            BCdata[20][1]++;
          } else if (currLN == "JOY") {
            BCdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            BCdata[21][0]++;
          } else if (currLB == "MEH") {
            BCdata[21][1]++;
          } else if (currLB == "JOY") {
            BCdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            BCdata[22][0]++;
          } else if (currLP == "MEH") {
            BCdata[22][1]++;
          } else if (currLP == "JOY") {
            BCdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            BCdata[23][0]++;
          } else if (currMI == "MEH") {
            BCdata[23][1]++;
          } else if (currMI == "JOY") {
            BCdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            BCdata[24][0]++;
          } else if (currMD == "MEH") {
            BCdata[24][1]++;
          } else if (currMD == "JOY") {
            BCdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            BCdata[25][0]++;
          } else if (currMW == "MEH") {
            BCdata[25][1]++;
          } else if (currMW == "JOY") {
            BCdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            BCdata[26][0]++;
          } else if (currMM == "MEH") {
            BCdata[26][1]++;
          } else if (currMM == "JOY") {
            BCdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            BCdata[27][0]++;
          } else if (currPM == "MEH") {
            BCdata[27][1]++;
          } else if (currPM == "JOY") {
            BCdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            BCdata[28][0]++;
          } else if (currMK == "MEH") {
            BCdata[28][1]++;
          } else if (currMK == "JOY") {
            BCdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            BCdata[29][0]++;
          } else if (currMG == "MEH") {
            BCdata[29][1]++;
          } else if (currMG == "JOY") {
            BCdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            BCdata[30][0]++;
          } else if (currND == "MEH") {
            BCdata[30][1]++;
          } else if (currND == "JOY") {
            BCdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            BCdata[31][0]++;
          } else if (currNC == "MEH") {
            BCdata[31][1]++;
          } else if (currNC == "JOY") {
            BCdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            BCdata[32][0]++;
          } else if (currPP == "MEH") {
            BCdata[32][1]++;
          } else if (currPP == "JOY") {
            BCdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            BCdata[33][0]++;
          } else if (currPS == "MEH") {
            BCdata[33][1]++;
          } else if (currPS == "JOY") {
            BCdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            BCdata[34][0]++;
          } else if (currRC == "MEH") {
            BCdata[34][1]++;
          } else if (currRC == "JOY") {
            BCdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            BCdata[35][0]++;
          } else if (currRP == "MEH") {
            BCdata[35][1]++;
          } else if (currRP == "JOY") {
            BCdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            BCdata[36][0]++;
          } else if (currRL == "MEH") {
            BCdata[36][1]++;
          } else if (currRL == "JOY") {
            BCdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            BCdata[37][0]++;
          } else if (currSK == "MEH") {
            BCdata[37][1]++;
          } else if (currSK == "JOY") {
            BCdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            BCdata[38][0]++;
          } else if (currSN == "MEH") {
            BCdata[38][1]++;
          } else if (currSN == "JOY") {
            BCdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            BCdata[39][0]++;
          } else if (currSP == "MEH") {
            BCdata[39][1]++;
          } else if (currSP == "JOY") {
            BCdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            BCdata[40][0]++;
          } else if (currST == "MEH") {
            BCdata[40][1]++;
          } else if (currST == "JOY") {
            BCdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            BCdata[41][0]++;
          } else if (currSF == "MEH") {
            BCdata[41][1]++;
          } else if (currSF == "JOY") {
            BCdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            BCdata[42][0]++;
          } else if (currTT == "MEH") {
            BCdata[42][1]++;
          } else if (currTT == "JOY") {
            BCdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            BCdata[43][0]++;
          } else if (currTM == "MEH") {
            BCdata[43][1]++;
          } else if (currTM == "JOY") {
            BCdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            BCdata[44][0]++;
          } else if (currTB == "MEH") {
            BCdata[44][1]++;
          } else if (currTB == "JOY") {
            BCdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            BCdata[45][0]++;
          } else if (currTM == "MEH") {
            BCdata[45][1]++;
          } else if (currTM == "JOY") {
            BCdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            BCdata[46][0]++;
          } else if (currTW == "MEH") {
            BCdata[46][1]++;
          } else if (currTW == "JOY") {
            BCdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            BCdata[47][0]++;
          } else if (currWM == "MEH") {
            BCdata[47][1]++;
          } else if (currWM == "JOY") {
            BCdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            BCdata[48][0]++;
          } else if (currYP == "MEH") {
            BCdata[48][1]++;
          } else if (currYP == "JOY") {
            BCdata[48][2]++;
          }
  
        break;
      case "AB" :
          ABdata[0]++;

          if (currOut == "No") {
            ABdata[1][0]++;
          } else if (currOut = "Yes") {
            ABdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            ABdata[2][0]++;
          } else if (currBF == "MEH") {
            ABdata[2][1]++;
          } else if (currBF == "JOY") {
            ABdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            ABdata[3][0]++;
          } else if (currCC == "MEH") {
            ABdata[3][1]++;
          } else if (currCC == "JOY") {
            ABdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            ABdata[4][0]++;
          } else if (currCL == "MEH") {
            ABdata[4][1]++;
          } else if (currCL == "JOY") {
            ABdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            ABdata[5][0]++;
          } else if (currDT == "MEH") {
            ABdata[5][1]++;
          } else if (currDT == "JOY") {
            ABdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            ABdata[6][0]++;
          } else if (currFP == "MEH") {
            ABdata[6][1]++;
          } else if (currFP == "JOY") {
            ABdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            ABdata[7][0]++;
          } else if (currGP == "MEH") {
            ABdata[7][1]++;
          } else if (currGP == "JOY") {
            ABdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            ABdata[8][0]++;
          } else if (currGB == "MEH") {
            ABdata[8][1]++;
          } else if (currGB == "JOY") {
            ABdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            ABdata[9][0]++;
          } else if (currHF == "MEH") {
            ABdata[9][1]++;
          } else if (currHF == "JOY") {
            ABdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            ABdata[10][0]++;
          } else if (currHB == "MEH") {
            ABdata[10][1]++;
          } else if (currHB == "JOY") {
            ABdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            ABdata[11][0]++;
          } else if (currHD == "MEH") {
            ABdata[11][1]++;
          } else if (currHD == "JOY") {
            ABdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            ABdata[12][0]++;
          } else if (currHM == "MEH") {
            ABdata[12][1]++;
          } else if (currHM == "JOY") {
            ABdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            ABdata[13][0]++;
          } else if (currHK == "MEH") {
            ABdata[13][1]++;
          } else if (currHK == "JOY") {
            ABdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            ABdata[14][0]++;
          } else if (currJB == "MEH") {
            ABdata[14][1]++;
          } else if (currJB == "JOY") {
            ABdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            ABdata[15][0]++;
          } else if (currJG == "MEH") {
            ABdata[15][1]++;
          } else if (currJG == "JOY") {
            ABdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            ABdata[16][0]++;
          } else if (currJM == "MEH") {
            ABdata[16][1]++;
          } else if (currJM == "JOY") {
            ABdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            ABdata[17][0]++;
          } else if (currKK == "MEH") {
            ABdata[17][1]++;
          } else if (currKK == "JOY") {
            ABdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            ABdata[18][0]++;
          } else if (currLT == "MEH") {
            ABdata[18][1]++;
          } else if (currLT == "JOY") {
            ABdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            ABdata[19][0]++;
          } else if (currLH == "MEH") {
            ABdata[19][1]++;
          } else if (currLH == "JOY") {
            ABdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            ABdata[20][0]++;
          } else if (currLN == "MEH") {
            ABdata[20][1]++;
          } else if (currLN == "JOY") {
            ABdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            ABdata[21][0]++;
          } else if (currLB == "MEH") {
            ABdata[21][1]++;
          } else if (currLB == "JOY") {
            ABdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            ABdata[22][0]++;
          } else if (currLP == "MEH") {
            ABdata[22][1]++;
          } else if (currLP == "JOY") {
            ABdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            ABdata[23][0]++;
          } else if (currMI == "MEH") {
            ABdata[23][1]++;
          } else if (currMI == "JOY") {
            ABdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            ABdata[24][0]++;
          } else if (currMD == "MEH") {
            ABdata[24][1]++;
          } else if (currMD == "JOY") {
            ABdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            ABdata[25][0]++;
          } else if (currMW == "MEH") {
            ABdata[25][1]++;
          } else if (currMW == "JOY") {
            ABdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            ABdata[26][0]++;
          } else if (currMM == "MEH") {
            ABdata[26][1]++;
          } else if (currMM == "JOY") {
            ABdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            ABdata[27][0]++;
          } else if (currPM == "MEH") {
            ABdata[27][1]++;
          } else if (currPM == "JOY") {
            ABdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            ABdata[28][0]++;
          } else if (currMK == "MEH") {
            ABdata[28][1]++;
          } else if (currMK == "JOY") {
            ABdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            ABdata[29][0]++;
          } else if (currMG == "MEH") {
            ABdata[29][1]++;
          } else if (currMG == "JOY") {
            ABdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            ABdata[30][0]++;
          } else if (currND == "MEH") {
            ABdata[30][1]++;
          } else if (currND == "JOY") {
            ABdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            ABdata[31][0]++;
          } else if (currNC == "MEH") {
            ABdata[31][1]++;
          } else if (currNC == "JOY") {
            ABdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            ABdata[32][0]++;
          } else if (currPP == "MEH") {
            ABdata[32][1]++;
          } else if (currPP == "JOY") {
            ABdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            ABdata[33][0]++;
          } else if (currPS == "MEH") {
            ABdata[33][1]++;
          } else if (currPS == "JOY") {
            ABdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            ABdata[34][0]++;
          } else if (currRC == "MEH") {
            ABdata[34][1]++;
          } else if (currRC == "JOY") {
            ABdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            ABdata[35][0]++;
          } else if (currRP == "MEH") {
            ABdata[35][1]++;
          } else if (currRP == "JOY") {
            ABdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            ABdata[36][0]++;
          } else if (currRL == "MEH") {
            ABdata[36][1]++;
          } else if (currRL == "JOY") {
            ABdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            ABdata[37][0]++;
          } else if (currSK == "MEH") {
            ABdata[37][1]++;
          } else if (currSK == "JOY") {
            ABdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            ABdata[38][0]++;
          } else if (currSN == "MEH") {
            ABdata[38][1]++;
          } else if (currSN == "JOY") {
            ABdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            ABdata[39][0]++;
          } else if (currSP == "MEH") {
            ABdata[39][1]++;
          } else if (currSP == "JOY") {
            ABdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            ABdata[40][0]++;
          } else if (currST == "MEH") {
            ABdata[40][1]++;
          } else if (currST == "JOY") {
            ABdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            ABdata[41][0]++;
          } else if (currSF == "MEH") {
            ABdata[41][1]++;
          } else if (currSF == "JOY") {
            ABdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            ABdata[42][0]++;
          } else if (currTT == "MEH") {
            ABdata[42][1]++;
          } else if (currTT == "JOY") {
            ABdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            ABdata[43][0]++;
          } else if (currTM == "MEH") {
            ABdata[43][1]++;
          } else if (currTM == "JOY") {
            ABdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            ABdata[44][0]++;
          } else if (currTB == "MEH") {
            ABdata[44][1]++;
          } else if (currTB == "JOY") {
            ABdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            ABdata[45][0]++;
          } else if (currTM == "MEH") {
            ABdata[45][1]++;
          } else if (currTM == "JOY") {
            ABdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            ABdata[46][0]++;
          } else if (currTW == "MEH") {
            ABdata[46][1]++;
          } else if (currTW == "JOY") {
            ABdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            ABdata[47][0]++;
          } else if (currWM == "MEH") {
            ABdata[47][1]++;
          } else if (currWM == "JOY") {
            ABdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            ABdata[48][0]++;
          } else if (currYP == "MEH") {
            ABdata[48][1]++;
          } else if (currYP == "JOY") {
            ABdata[48][2]++;
          }
  
        break;
      case "SK" :
          SKdata[0]++;

          if (currOut == "No") {
            SKdata[1][0]++;
          } else if (currOut = "Yes") {
            SKdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            SKdata[2][0]++;
          } else if (currBF == "MEH") {
            SKdata[2][1]++;
          } else if (currBF == "JOY") {
            SKdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            SKdata[3][0]++;
          } else if (currCC == "MEH") {
            SKdata[3][1]++;
          } else if (currCC == "JOY") {
            SKdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            SKdata[4][0]++;
          } else if (currCL == "MEH") {
            SKdata[4][1]++;
          } else if (currCL == "JOY") {
            SKdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            SKdata[5][0]++;
          } else if (currDT == "MEH") {
            SKdata[5][1]++;
          } else if (currDT == "JOY") {
            SKdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            SKdata[6][0]++;
          } else if (currFP == "MEH") {
            SKdata[6][1]++;
          } else if (currFP == "JOY") {
            SKdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            SKdata[7][0]++;
          } else if (currGP == "MEH") {
            SKdata[7][1]++;
          } else if (currGP == "JOY") {
            SKdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            SKdata[8][0]++;
          } else if (currGB == "MEH") {
            SKdata[8][1]++;
          } else if (currGB == "JOY") {
            SKdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            SKdata[9][0]++;
          } else if (currHF == "MEH") {
            SKdata[9][1]++;
          } else if (currHF == "JOY") {
            SKdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            SKdata[10][0]++;
          } else if (currHB == "MEH") {
            SKdata[10][1]++;
          } else if (currHB == "JOY") {
            SKdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            SKdata[11][0]++;
          } else if (currHD == "MEH") {
            SKdata[11][1]++;
          } else if (currHD == "JOY") {
            SKdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            SKdata[12][0]++;
          } else if (currHM == "MEH") {
            SKdata[12][1]++;
          } else if (currHM == "JOY") {
            SKdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            SKdata[13][0]++;
          } else if (currHK == "MEH") {
            SKdata[13][1]++;
          } else if (currHK == "JOY") {
            SKdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            SKdata[14][0]++;
          } else if (currJB == "MEH") {
            SKdata[14][1]++;
          } else if (currJB == "JOY") {
            SKdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            SKdata[15][0]++;
          } else if (currJG == "MEH") {
            SKdata[15][1]++;
          } else if (currJG == "JOY") {
            SKdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            SKdata[16][0]++;
          } else if (currJM == "MEH") {
            SKdata[16][1]++;
          } else if (currJM == "JOY") {
            SKdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            SKdata[17][0]++;
          } else if (currKK == "MEH") {
            SKdata[17][1]++;
          } else if (currKK == "JOY") {
            SKdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            SKdata[18][0]++;
          } else if (currLT == "MEH") {
            SKdata[18][1]++;
          } else if (currLT == "JOY") {
            SKdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            SKdata[19][0]++;
          } else if (currLH == "MEH") {
            SKdata[19][1]++;
          } else if (currLH == "JOY") {
            SKdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            SKdata[20][0]++;
          } else if (currLN == "MEH") {
            SKdata[20][1]++;
          } else if (currLN == "JOY") {
            SKdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            SKdata[21][0]++;
          } else if (currLB == "MEH") {
            SKdata[21][1]++;
          } else if (currLB == "JOY") {
            SKdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            SKdata[22][0]++;
          } else if (currLP == "MEH") {
            SKdata[22][1]++;
          } else if (currLP == "JOY") {
            SKdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            SKdata[23][0]++;
          } else if (currMI == "MEH") {
            SKdata[23][1]++;
          } else if (currMI == "JOY") {
            SKdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            SKdata[24][0]++;
          } else if (currMD == "MEH") {
            SKdata[24][1]++;
          } else if (currMD == "JOY") {
            SKdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            SKdata[25][0]++;
          } else if (currMW == "MEH") {
            SKdata[25][1]++;
          } else if (currMW == "JOY") {
            SKdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            SKdata[26][0]++;
          } else if (currMM == "MEH") {
            SKdata[26][1]++;
          } else if (currMM == "JOY") {
            SKdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            SKdata[27][0]++;
          } else if (currPM == "MEH") {
            SKdata[27][1]++;
          } else if (currPM == "JOY") {
            SKdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            SKdata[28][0]++;
          } else if (currMK == "MEH") {
            SKdata[28][1]++;
          } else if (currMK == "JOY") {
            SKdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            SKdata[29][0]++;
          } else if (currMG == "MEH") {
            SKdata[29][1]++;
          } else if (currMG == "JOY") {
            SKdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            SKdata[30][0]++;
          } else if (currND == "MEH") {
            SKdata[30][1]++;
          } else if (currND == "JOY") {
            SKdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            SKdata[31][0]++;
          } else if (currNC == "MEH") {
            SKdata[31][1]++;
          } else if (currNC == "JOY") {
            SKdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            SKdata[32][0]++;
          } else if (currPP == "MEH") {
            SKdata[32][1]++;
          } else if (currPP == "JOY") {
            SKdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            SKdata[33][0]++;
          } else if (currPS == "MEH") {
            SKdata[33][1]++;
          } else if (currPS == "JOY") {
            SKdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            SKdata[34][0]++;
          } else if (currRC == "MEH") {
            SKdata[34][1]++;
          } else if (currRC == "JOY") {
            SKdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            SKdata[35][0]++;
          } else if (currRP == "MEH") {
            SKdata[35][1]++;
          } else if (currRP == "JOY") {
            SKdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            SKdata[36][0]++;
          } else if (currRL == "MEH") {
            SKdata[36][1]++;
          } else if (currRL == "JOY") {
            SKdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            SKdata[37][0]++;
          } else if (currSK == "MEH") {
            SKdata[37][1]++;
          } else if (currSK == "JOY") {
            SKdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            SKdata[38][0]++;
          } else if (currSN == "MEH") {
            SKdata[38][1]++;
          } else if (currSN == "JOY") {
            SKdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            SKdata[39][0]++;
          } else if (currSP == "MEH") {
            SKdata[39][1]++;
          } else if (currSP == "JOY") {
            SKdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            SKdata[40][0]++;
          } else if (currST == "MEH") {
            SKdata[40][1]++;
          } else if (currST == "JOY") {
            SKdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            SKdata[41][0]++;
          } else if (currSF == "MEH") {
            SKdata[41][1]++;
          } else if (currSF == "JOY") {
            SKdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            SKdata[42][0]++;
          } else if (currTT == "MEH") {
            SKdata[42][1]++;
          } else if (currTT == "JOY") {
            SKdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            SKdata[43][0]++;
          } else if (currTM == "MEH") {
            SKdata[43][1]++;
          } else if (currTM == "JOY") {
            SKdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            SKdata[44][0]++;
          } else if (currTB == "MEH") {
            SKdata[44][1]++;
          } else if (currTB == "JOY") {
            SKdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            SKdata[45][0]++;
          } else if (currTM == "MEH") {
            SKdata[45][1]++;
          } else if (currTM == "JOY") {
            SKdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            SKdata[46][0]++;
          } else if (currTW == "MEH") {
            SKdata[46][1]++;
          } else if (currTW == "JOY") {
            SKdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            SKdata[47][0]++;
          } else if (currWM == "MEH") {
            SKdata[47][1]++;
          } else if (currWM == "JOY") {
            SKdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            SKdata[48][0]++;
          } else if (currYP == "MEH") {
            SKdata[48][1]++;
          } else if (currYP == "JOY") {
            SKdata[48][2]++;
          }
  
        break;
      case "MB" :
          MBdata[0]++;

          if (currOut == "No") {
            MBdata[1][0]++;
          } else if (currOut = "Yes") {
            MBdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            MBdata[2][0]++;
          } else if (currBF == "MEH") {
            MBdata[2][1]++;
          } else if (currBF == "JOY") {
            MBdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            MBdata[3][0]++;
          } else if (currCC == "MEH") {
            MBdata[3][1]++;
          } else if (currCC == "JOY") {
            MBdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            MBdata[4][0]++;
          } else if (currCL == "MEH") {
            MBdata[4][1]++;
          } else if (currCL == "JOY") {
            MBdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            MBdata[5][0]++;
          } else if (currDT == "MEH") {
            MBdata[5][1]++;
          } else if (currDT == "JOY") {
            MBdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            MBdata[6][0]++;
          } else if (currFP == "MEH") {
            MBdata[6][1]++;
          } else if (currFP == "JOY") {
            MBdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            MBdata[7][0]++;
          } else if (currGP == "MEH") {
            MBdata[7][1]++;
          } else if (currGP == "JOY") {
            MBdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            MBdata[8][0]++;
          } else if (currGB == "MEH") {
            MBdata[8][1]++;
          } else if (currGB == "JOY") {
            MBdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            MBdata[9][0]++;
          } else if (currHF == "MEH") {
            MBdata[9][1]++;
          } else if (currHF == "JOY") {
            MBdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            MBdata[10][0]++;
          } else if (currHB == "MEH") {
            MBdata[10][1]++;
          } else if (currHB == "JOY") {
            MBdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            MBdata[11][0]++;
          } else if (currHD == "MEH") {
            MBdata[11][1]++;
          } else if (currHD == "JOY") {
            MBdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            MBdata[12][0]++;
          } else if (currHM == "MEH") {
            MBdata[12][1]++;
          } else if (currHM == "JOY") {
            MBdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            MBdata[13][0]++;
          } else if (currHK == "MEH") {
            MBdata[13][1]++;
          } else if (currHK == "JOY") {
            MBdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            MBdata[14][0]++;
          } else if (currJB == "MEH") {
            MBdata[14][1]++;
          } else if (currJB == "JOY") {
            MBdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            MBdata[15][0]++;
          } else if (currJG == "MEH") {
            MBdata[15][1]++;
          } else if (currJG == "JOY") {
            MBdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            MBdata[16][0]++;
          } else if (currJM == "MEH") {
            MBdata[16][1]++;
          } else if (currJM == "JOY") {
            MBdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            MBdata[17][0]++;
          } else if (currKK == "MEH") {
            MBdata[17][1]++;
          } else if (currKK == "JOY") {
            MBdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            MBdata[18][0]++;
          } else if (currLT == "MEH") {
            MBdata[18][1]++;
          } else if (currLT == "JOY") {
            MBdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            MBdata[19][0]++;
          } else if (currLH == "MEH") {
            MBdata[19][1]++;
          } else if (currLH == "JOY") {
            MBdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            MBdata[20][0]++;
          } else if (currLN == "MEH") {
            MBdata[20][1]++;
          } else if (currLN == "JOY") {
            MBdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            MBdata[21][0]++;
          } else if (currLB == "MEH") {
            MBdata[21][1]++;
          } else if (currLB == "JOY") {
            MBdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            MBdata[22][0]++;
          } else if (currLP == "MEH") {
            MBdata[22][1]++;
          } else if (currLP == "JOY") {
            MBdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            MBdata[23][0]++;
          } else if (currMI == "MEH") {
            MBdata[23][1]++;
          } else if (currMI == "JOY") {
            MBdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            MBdata[24][0]++;
          } else if (currMD == "MEH") {
            MBdata[24][1]++;
          } else if (currMD == "JOY") {
            MBdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            MBdata[25][0]++;
          } else if (currMW == "MEH") {
            MBdata[25][1]++;
          } else if (currMW == "JOY") {
            MBdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            MBdata[26][0]++;
          } else if (currMM == "MEH") {
            MBdata[26][1]++;
          } else if (currMM == "JOY") {
            MBdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            MBdata[27][0]++;
          } else if (currPM == "MEH") {
            MBdata[27][1]++;
          } else if (currPM == "JOY") {
            MBdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            MBdata[28][0]++;
          } else if (currMK == "MEH") {
            MBdata[28][1]++;
          } else if (currMK == "JOY") {
            MBdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            MBdata[29][0]++;
          } else if (currMG == "MEH") {
            MBdata[29][1]++;
          } else if (currMG == "JOY") {
            MBdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            MBdata[30][0]++;
          } else if (currND == "MEH") {
            MBdata[30][1]++;
          } else if (currND == "JOY") {
            MBdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            MBdata[31][0]++;
          } else if (currNC == "MEH") {
            MBdata[31][1]++;
          } else if (currNC == "JOY") {
            MBdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            MBdata[32][0]++;
          } else if (currPP == "MEH") {
            MBdata[32][1]++;
          } else if (currPP == "JOY") {
            MBdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            MBdata[33][0]++;
          } else if (currPS == "MEH") {
            MBdata[33][1]++;
          } else if (currPS == "JOY") {
            MBdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            MBdata[34][0]++;
          } else if (currRC == "MEH") {
            MBdata[34][1]++;
          } else if (currRC == "JOY") {
            MBdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            MBdata[35][0]++;
          } else if (currRP == "MEH") {
            MBdata[35][1]++;
          } else if (currRP == "JOY") {
            MBdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            MBdata[36][0]++;
          } else if (currRL == "MEH") {
            MBdata[36][1]++;
          } else if (currRL == "JOY") {
            MBdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            MBdata[37][0]++;
          } else if (currSK == "MEH") {
            MBdata[37][1]++;
          } else if (currSK == "JOY") {
            MBdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            MBdata[38][0]++;
          } else if (currSN == "MEH") {
            MBdata[38][1]++;
          } else if (currSN == "JOY") {
            MBdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            MBdata[39][0]++;
          } else if (currSP == "MEH") {
            MBdata[39][1]++;
          } else if (currSP == "JOY") {
            MBdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            MBdata[40][0]++;
          } else if (currST == "MEH") {
            MBdata[40][1]++;
          } else if (currST == "JOY") {
            MBdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            MBdata[41][0]++;
          } else if (currSF == "MEH") {
            MBdata[41][1]++;
          } else if (currSF == "JOY") {
            MBdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            MBdata[42][0]++;
          } else if (currTT == "MEH") {
            MBdata[42][1]++;
          } else if (currTT == "JOY") {
            MBdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            MBdata[43][0]++;
          } else if (currTM == "MEH") {
            MBdata[43][1]++;
          } else if (currTM == "JOY") {
            MBdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            MBdata[44][0]++;
          } else if (currTB == "MEH") {
            MBdata[44][1]++;
          } else if (currTB == "JOY") {
            MBdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            MBdata[45][0]++;
          } else if (currTM == "MEH") {
            MBdata[45][1]++;
          } else if (currTM == "JOY") {
            MBdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            MBdata[46][0]++;
          } else if (currTW == "MEH") {
            MBdata[46][1]++;
          } else if (currTW == "JOY") {
            MBdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            MBdata[47][0]++;
          } else if (currWM == "MEH") {
            MBdata[47][1]++;
          } else if (currWM == "JOY") {
            MBdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            MBdata[48][0]++;
          } else if (currYP == "MEH") {
            MBdata[48][1]++;
          } else if (currYP == "JOY") {
            MBdata[48][2]++;
          }
  
        break;
      case "ON" :
          ONdata[0]++;

          if (currOut == "No") {
            ONdata[1][0]++;
          } else if (currOut = "Yes") {
            ONdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            ONdata[2][0]++;
          } else if (currBF == "MEH") {
            ONdata[2][1]++;
          } else if (currBF == "JOY") {
            ONdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            ONdata[3][0]++;
          } else if (currCC == "MEH") {
            ONdata[3][1]++;
          } else if (currCC == "JOY") {
            ONdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            ONdata[4][0]++;
          } else if (currCL == "MEH") {
            ONdata[4][1]++;
          } else if (currCL == "JOY") {
            ONdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            ONdata[5][0]++;
          } else if (currDT == "MEH") {
            ONdata[5][1]++;
          } else if (currDT == "JOY") {
            ONdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            ONdata[6][0]++;
          } else if (currFP == "MEH") {
            ONdata[6][1]++;
          } else if (currFP == "JOY") {
            ONdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            ONdata[7][0]++;
          } else if (currGP == "MEH") {
            ONdata[7][1]++;
          } else if (currGP == "JOY") {
            ONdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            ONdata[8][0]++;
          } else if (currGB == "MEH") {
            ONdata[8][1]++;
          } else if (currGB == "JOY") {
            ONdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            ONdata[9][0]++;
          } else if (currHF == "MEH") {
            ONdata[9][1]++;
          } else if (currHF == "JOY") {
            ONdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            ONdata[10][0]++;
          } else if (currHB == "MEH") {
            ONdata[10][1]++;
          } else if (currHB == "JOY") {
            ONdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            ONdata[11][0]++;
          } else if (currHD == "MEH") {
            ONdata[11][1]++;
          } else if (currHD == "JOY") {
            ONdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            ONdata[12][0]++;
          } else if (currHM == "MEH") {
            ONdata[12][1]++;
          } else if (currHM == "JOY") {
            ONdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            ONdata[13][0]++;
          } else if (currHK == "MEH") {
            ONdata[13][1]++;
          } else if (currHK == "JOY") {
            ONdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            ONdata[14][0]++;
          } else if (currJB == "MEH") {
            ONdata[14][1]++;
          } else if (currJB == "JOY") {
            ONdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            ONdata[15][0]++;
          } else if (currJG == "MEH") {
            ONdata[15][1]++;
          } else if (currJG == "JOY") {
            ONdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            ONdata[16][0]++;
          } else if (currJM == "MEH") {
            ONdata[16][1]++;
          } else if (currJM == "JOY") {
            ONdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            ONdata[17][0]++;
          } else if (currKK == "MEH") {
            ONdata[17][1]++;
          } else if (currKK == "JOY") {
            ONdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            ONdata[18][0]++;
          } else if (currLT == "MEH") {
            ONdata[18][1]++;
          } else if (currLT == "JOY") {
            ONdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            ONdata[19][0]++;
          } else if (currLH == "MEH") {
            ONdata[19][1]++;
          } else if (currLH == "JOY") {
            ONdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            ONdata[20][0]++;
          } else if (currLN == "MEH") {
            ONdata[20][1]++;
          } else if (currLN == "JOY") {
            ONdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            ONdata[21][0]++;
          } else if (currLB == "MEH") {
            ONdata[21][1]++;
          } else if (currLB == "JOY") {
            ONdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            ONdata[22][0]++;
          } else if (currLP == "MEH") {
            ONdata[22][1]++;
          } else if (currLP == "JOY") {
            ONdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            ONdata[23][0]++;
          } else if (currMI == "MEH") {
            ONdata[23][1]++;
          } else if (currMI == "JOY") {
            ONdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            ONdata[24][0]++;
          } else if (currMD == "MEH") {
            ONdata[24][1]++;
          } else if (currMD == "JOY") {
            ONdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            ONdata[25][0]++;
          } else if (currMW == "MEH") {
            ONdata[25][1]++;
          } else if (currMW == "JOY") {
            ONdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            ONdata[26][0]++;
          } else if (currMM == "MEH") {
            ONdata[26][1]++;
          } else if (currMM == "JOY") {
            ONdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            ONdata[27][0]++;
          } else if (currPM == "MEH") {
            ONdata[27][1]++;
          } else if (currPM == "JOY") {
            ONdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            ONdata[28][0]++;
          } else if (currMK == "MEH") {
            ONdata[28][1]++;
          } else if (currMK == "JOY") {
            ONdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            ONdata[29][0]++;
          } else if (currMG == "MEH") {
            ONdata[29][1]++;
          } else if (currMG == "JOY") {
            ONdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            ONdata[30][0]++;
          } else if (currND == "MEH") {
            ONdata[30][1]++;
          } else if (currND == "JOY") {
            ONdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            ONdata[31][0]++;
          } else if (currNC == "MEH") {
            ONdata[31][1]++;
          } else if (currNC == "JOY") {
            ONdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            ONdata[32][0]++;
          } else if (currPP == "MEH") {
            ONdata[32][1]++;
          } else if (currPP == "JOY") {
            ONdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            ONdata[33][0]++;
          } else if (currPS == "MEH") {
            ONdata[33][1]++;
          } else if (currPS == "JOY") {
            ONdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            ONdata[34][0]++;
          } else if (currRC == "MEH") {
            ONdata[34][1]++;
          } else if (currRC == "JOY") {
            ONdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            ONdata[35][0]++;
          } else if (currRP == "MEH") {
            ONdata[35][1]++;
          } else if (currRP == "JOY") {
            ONdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            ONdata[36][0]++;
          } else if (currRL == "MEH") {
            ONdata[36][1]++;
          } else if (currRL == "JOY") {
            ONdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            ONdata[37][0]++;
          } else if (currSK == "MEH") {
            ONdata[37][1]++;
          } else if (currSK == "JOY") {
            ONdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            ONdata[38][0]++;
          } else if (currSN == "MEH") {
            ONdata[38][1]++;
          } else if (currSN == "JOY") {
            ONdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            ONdata[39][0]++;
          } else if (currSP == "MEH") {
            ONdata[39][1]++;
          } else if (currSP == "JOY") {
            ONdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            ONdata[40][0]++;
          } else if (currST == "MEH") {
            ONdata[40][1]++;
          } else if (currST == "JOY") {
            ONdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            ONdata[41][0]++;
          } else if (currSF == "MEH") {
            ONdata[41][1]++;
          } else if (currSF == "JOY") {
            ONdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            ONdata[42][0]++;
          } else if (currTT == "MEH") {
            ONdata[42][1]++;
          } else if (currTT == "JOY") {
            ONdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            ONdata[43][0]++;
          } else if (currTM == "MEH") {
            ONdata[43][1]++;
          } else if (currTM == "JOY") {
            ONdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            ONdata[44][0]++;
          } else if (currTB == "MEH") {
            ONdata[44][1]++;
          } else if (currTB == "JOY") {
            ONdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            ONdata[45][0]++;
          } else if (currTM == "MEH") {
            ONdata[45][1]++;
          } else if (currTM == "JOY") {
            ONdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            ONdata[46][0]++;
          } else if (currTW == "MEH") {
            ONdata[46][1]++;
          } else if (currTW == "JOY") {
            ONdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            ONdata[47][0]++;
          } else if (currWM == "MEH") {
            ONdata[47][1]++;
          } else if (currWM == "JOY") {
            ONdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            ONdata[48][0]++;
          } else if (currYP == "MEH") {
            ONdata[48][1]++;
          } else if (currYP == "JOY") {
            ONdata[48][2]++;
          }
  
        break;
      case "QC" :
          QCdata[0]++;

          if (currOut == "No") {
            QCdata[1][0]++;
          } else if (currOut = "Yes") {
            QCdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            QCdata[2][0]++;
          } else if (currBF == "MEH") {
            QCdata[2][1]++;
          } else if (currBF == "JOY") {
            QCdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            QCdata[3][0]++;
          } else if (currCC == "MEH") {
            QCdata[3][1]++;
          } else if (currCC == "JOY") {
            QCdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            QCdata[4][0]++;
          } else if (currCL == "MEH") {
            QCdata[4][1]++;
          } else if (currCL == "JOY") {
            QCdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            QCdata[5][0]++;
          } else if (currDT == "MEH") {
            QCdata[5][1]++;
          } else if (currDT == "JOY") {
            QCdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            QCdata[6][0]++;
          } else if (currFP == "MEH") {
            QCdata[6][1]++;
          } else if (currFP == "JOY") {
            QCdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            QCdata[7][0]++;
          } else if (currGP == "MEH") {
            QCdata[7][1]++;
          } else if (currGP == "JOY") {
            QCdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            QCdata[8][0]++;
          } else if (currGB == "MEH") {
            QCdata[8][1]++;
          } else if (currGB == "JOY") {
            QCdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            QCdata[9][0]++;
          } else if (currHF == "MEH") {
            QCdata[9][1]++;
          } else if (currHF == "JOY") {
            QCdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            QCdata[10][0]++;
          } else if (currHB == "MEH") {
            QCdata[10][1]++;
          } else if (currHB == "JOY") {
            QCdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            QCdata[11][0]++;
          } else if (currHD == "MEH") {
            QCdata[11][1]++;
          } else if (currHD == "JOY") {
            QCdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            QCdata[12][0]++;
          } else if (currHM == "MEH") {
            QCdata[12][1]++;
          } else if (currHM == "JOY") {
            QCdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            QCdata[13][0]++;
          } else if (currHK == "MEH") {
            QCdata[13][1]++;
          } else if (currHK == "JOY") {
            QCdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            QCdata[14][0]++;
          } else if (currJB == "MEH") {
            QCdata[14][1]++;
          } else if (currJB == "JOY") {
            QCdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            QCdata[15][0]++;
          } else if (currJG == "MEH") {
            QCdata[15][1]++;
          } else if (currJG == "JOY") {
            QCdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            QCdata[16][0]++;
          } else if (currJM == "MEH") {
            QCdata[16][1]++;
          } else if (currJM == "JOY") {
            QCdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            QCdata[17][0]++;
          } else if (currKK == "MEH") {
            QCdata[17][1]++;
          } else if (currKK == "JOY") {
            QCdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            QCdata[18][0]++;
          } else if (currLT == "MEH") {
            QCdata[18][1]++;
          } else if (currLT == "JOY") {
            QCdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            QCdata[19][0]++;
          } else if (currLH == "MEH") {
            QCdata[19][1]++;
          } else if (currLH == "JOY") {
            QCdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            QCdata[20][0]++;
          } else if (currLN == "MEH") {
            QCdata[20][1]++;
          } else if (currLN == "JOY") {
            QCdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            QCdata[21][0]++;
          } else if (currLB == "MEH") {
            QCdata[21][1]++;
          } else if (currLB == "JOY") {
            QCdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            QCdata[22][0]++;
          } else if (currLP == "MEH") {
            QCdata[22][1]++;
          } else if (currLP == "JOY") {
            QCdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            QCdata[23][0]++;
          } else if (currMI == "MEH") {
            QCdata[23][1]++;
          } else if (currMI == "JOY") {
            QCdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            QCdata[24][0]++;
          } else if (currMD == "MEH") {
            QCdata[24][1]++;
          } else if (currMD == "JOY") {
            QCdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            QCdata[25][0]++;
          } else if (currMW == "MEH") {
            QCdata[25][1]++;
          } else if (currMW == "JOY") {
            QCdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            QCdata[26][0]++;
          } else if (currMM == "MEH") {
            QCdata[26][1]++;
          } else if (currMM == "JOY") {
            QCdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            QCdata[27][0]++;
          } else if (currPM == "MEH") {
            QCdata[27][1]++;
          } else if (currPM == "JOY") {
            QCdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            QCdata[28][0]++;
          } else if (currMK == "MEH") {
            QCdata[28][1]++;
          } else if (currMK == "JOY") {
            QCdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            QCdata[29][0]++;
          } else if (currMG == "MEH") {
            QCdata[29][1]++;
          } else if (currMG == "JOY") {
            QCdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            QCdata[30][0]++;
          } else if (currND == "MEH") {
            QCdata[30][1]++;
          } else if (currND == "JOY") {
            QCdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            QCdata[31][0]++;
          } else if (currNC == "MEH") {
            QCdata[31][1]++;
          } else if (currNC == "JOY") {
            QCdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            QCdata[32][0]++;
          } else if (currPP == "MEH") {
            QCdata[32][1]++;
          } else if (currPP == "JOY") {
            QCdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            QCdata[33][0]++;
          } else if (currPS == "MEH") {
            QCdata[33][1]++;
          } else if (currPS == "JOY") {
            QCdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            QCdata[34][0]++;
          } else if (currRC == "MEH") {
            QCdata[34][1]++;
          } else if (currRC == "JOY") {
            QCdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            QCdata[35][0]++;
          } else if (currRP == "MEH") {
            QCdata[35][1]++;
          } else if (currRP == "JOY") {
            QCdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            QCdata[36][0]++;
          } else if (currRL == "MEH") {
            QCdata[36][1]++;
          } else if (currRL == "JOY") {
            QCdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            QCdata[37][0]++;
          } else if (currSK == "MEH") {
            QCdata[37][1]++;
          } else if (currSK == "JOY") {
            QCdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            QCdata[38][0]++;
          } else if (currSN == "MEH") {
            QCdata[38][1]++;
          } else if (currSN == "JOY") {
            QCdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            QCdata[39][0]++;
          } else if (currSP == "MEH") {
            QCdata[39][1]++;
          } else if (currSP == "JOY") {
            QCdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            QCdata[40][0]++;
          } else if (currST == "MEH") {
            QCdata[40][1]++;
          } else if (currST == "JOY") {
            QCdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            QCdata[41][0]++;
          } else if (currSF == "MEH") {
            QCdata[41][1]++;
          } else if (currSF == "JOY") {
            QCdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            QCdata[42][0]++;
          } else if (currTT == "MEH") {
            QCdata[42][1]++;
          } else if (currTT == "JOY") {
            QCdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            QCdata[43][0]++;
          } else if (currTM == "MEH") {
            QCdata[43][1]++;
          } else if (currTM == "JOY") {
            QCdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            QCdata[44][0]++;
          } else if (currTB == "MEH") {
            QCdata[44][1]++;
          } else if (currTB == "JOY") {
            QCdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            QCdata[45][0]++;
          } else if (currTM == "MEH") {
            QCdata[45][1]++;
          } else if (currTM == "JOY") {
            QCdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            QCdata[46][0]++;
          } else if (currTW == "MEH") {
            QCdata[46][1]++;
          } else if (currTW == "JOY") {
            QCdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            QCdata[47][0]++;
          } else if (currWM == "MEH") {
            QCdata[47][1]++;
          } else if (currWM == "JOY") {
            QCdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            QCdata[48][0]++;
          } else if (currYP == "MEH") {
            QCdata[48][1]++;
          } else if (currYP == "JOY") {
            QCdata[48][2]++;
          }
  
        break;
      case "NB" :
          NBdata[0]++;

          if (currOut == "No") {
            NBdata[1][0]++;
          } else if (currOut = "Yes") {
            NBdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NBdata[2][0]++;
          } else if (currBF == "MEH") {
            NBdata[2][1]++;
          } else if (currBF == "JOY") {
            NBdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NBdata[3][0]++;
          } else if (currCC == "MEH") {
            NBdata[3][1]++;
          } else if (currCC == "JOY") {
            NBdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NBdata[4][0]++;
          } else if (currCL == "MEH") {
            NBdata[4][1]++;
          } else if (currCL == "JOY") {
            NBdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NBdata[5][0]++;
          } else if (currDT == "MEH") {
            NBdata[5][1]++;
          } else if (currDT == "JOY") {
            NBdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NBdata[6][0]++;
          } else if (currFP == "MEH") {
            NBdata[6][1]++;
          } else if (currFP == "JOY") {
            NBdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NBdata[7][0]++;
          } else if (currGP == "MEH") {
            NBdata[7][1]++;
          } else if (currGP == "JOY") {
            NBdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NBdata[8][0]++;
          } else if (currGB == "MEH") {
            NBdata[8][1]++;
          } else if (currGB == "JOY") {
            NBdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NBdata[9][0]++;
          } else if (currHF == "MEH") {
            NBdata[9][1]++;
          } else if (currHF == "JOY") {
            NBdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NBdata[10][0]++;
          } else if (currHB == "MEH") {
            NBdata[10][1]++;
          } else if (currHB == "JOY") {
            NBdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NBdata[11][0]++;
          } else if (currHD == "MEH") {
            NBdata[11][1]++;
          } else if (currHD == "JOY") {
            NBdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NBdata[12][0]++;
          } else if (currHM == "MEH") {
            NBdata[12][1]++;
          } else if (currHM == "JOY") {
            NBdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NBdata[13][0]++;
          } else if (currHK == "MEH") {
            NBdata[13][1]++;
          } else if (currHK == "JOY") {
            NBdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NBdata[14][0]++;
          } else if (currJB == "MEH") {
            NBdata[14][1]++;
          } else if (currJB == "JOY") {
            NBdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NBdata[15][0]++;
          } else if (currJG == "MEH") {
            NBdata[15][1]++;
          } else if (currJG == "JOY") {
            NBdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NBdata[16][0]++;
          } else if (currJM == "MEH") {
            NBdata[16][1]++;
          } else if (currJM == "JOY") {
            NBdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NBdata[17][0]++;
          } else if (currKK == "MEH") {
            NBdata[17][1]++;
          } else if (currKK == "JOY") {
            NBdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NBdata[18][0]++;
          } else if (currLT == "MEH") {
            NBdata[18][1]++;
          } else if (currLT == "JOY") {
            NBdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NBdata[19][0]++;
          } else if (currLH == "MEH") {
            NBdata[19][1]++;
          } else if (currLH == "JOY") {
            NBdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NBdata[20][0]++;
          } else if (currLN == "MEH") {
            NBdata[20][1]++;
          } else if (currLN == "JOY") {
            NBdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NBdata[21][0]++;
          } else if (currLB == "MEH") {
            NBdata[21][1]++;
          } else if (currLB == "JOY") {
            NBdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NBdata[22][0]++;
          } else if (currLP == "MEH") {
            NBdata[22][1]++;
          } else if (currLP == "JOY") {
            NBdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NBdata[23][0]++;
          } else if (currMI == "MEH") {
            NBdata[23][1]++;
          } else if (currMI == "JOY") {
            NBdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NBdata[24][0]++;
          } else if (currMD == "MEH") {
            NBdata[24][1]++;
          } else if (currMD == "JOY") {
            NBdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NBdata[25][0]++;
          } else if (currMW == "MEH") {
            NBdata[25][1]++;
          } else if (currMW == "JOY") {
            NBdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NBdata[26][0]++;
          } else if (currMM == "MEH") {
            NBdata[26][1]++;
          } else if (currMM == "JOY") {
            NBdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NBdata[27][0]++;
          } else if (currPM == "MEH") {
            NBdata[27][1]++;
          } else if (currPM == "JOY") {
            NBdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NBdata[28][0]++;
          } else if (currMK == "MEH") {
            NBdata[28][1]++;
          } else if (currMK == "JOY") {
            NBdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NBdata[29][0]++;
          } else if (currMG == "MEH") {
            NBdata[29][1]++;
          } else if (currMG == "JOY") {
            NBdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NBdata[30][0]++;
          } else if (currND == "MEH") {
            NBdata[30][1]++;
          } else if (currND == "JOY") {
            NBdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NBdata[31][0]++;
          } else if (currNC == "MEH") {
            NBdata[31][1]++;
          } else if (currNC == "JOY") {
            NBdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NBdata[32][0]++;
          } else if (currPP == "MEH") {
            NBdata[32][1]++;
          } else if (currPP == "JOY") {
            NBdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NBdata[33][0]++;
          } else if (currPS == "MEH") {
            NBdata[33][1]++;
          } else if (currPS == "JOY") {
            NBdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NBdata[34][0]++;
          } else if (currRC == "MEH") {
            NBdata[34][1]++;
          } else if (currRC == "JOY") {
            NBdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NBdata[35][0]++;
          } else if (currRP == "MEH") {
            NBdata[35][1]++;
          } else if (currRP == "JOY") {
            NBdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NBdata[36][0]++;
          } else if (currRL == "MEH") {
            NBdata[36][1]++;
          } else if (currRL == "JOY") {
            NBdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NBdata[37][0]++;
          } else if (currSK == "MEH") {
            NBdata[37][1]++;
          } else if (currSK == "JOY") {
            NBdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NBdata[38][0]++;
          } else if (currSN == "MEH") {
            NBdata[38][1]++;
          } else if (currSN == "JOY") {
            NBdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NBdata[39][0]++;
          } else if (currSP == "MEH") {
            NBdata[39][1]++;
          } else if (currSP == "JOY") {
            NBdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NBdata[40][0]++;
          } else if (currST == "MEH") {
            NBdata[40][1]++;
          } else if (currST == "JOY") {
            NBdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NBdata[41][0]++;
          } else if (currSF == "MEH") {
            NBdata[41][1]++;
          } else if (currSF == "JOY") {
            NBdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NBdata[42][0]++;
          } else if (currTT == "MEH") {
            NBdata[42][1]++;
          } else if (currTT == "JOY") {
            NBdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NBdata[43][0]++;
          } else if (currTM == "MEH") {
            NBdata[43][1]++;
          } else if (currTM == "JOY") {
            NBdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NBdata[44][0]++;
          } else if (currTB == "MEH") {
            NBdata[44][1]++;
          } else if (currTB == "JOY") {
            NBdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NBdata[45][0]++;
          } else if (currTM == "MEH") {
            NBdata[45][1]++;
          } else if (currTM == "JOY") {
            NBdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NBdata[46][0]++;
          } else if (currTW == "MEH") {
            NBdata[46][1]++;
          } else if (currTW == "JOY") {
            NBdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NBdata[47][0]++;
          } else if (currWM == "MEH") {
            NBdata[47][1]++;
          } else if (currWM == "JOY") {
            NBdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NBdata[48][0]++;
          } else if (currYP == "MEH") {
            NBdata[48][1]++;
          } else if (currYP == "JOY") {
            NBdata[48][2]++;
          }
  
        break;
      case "NS" :
          NSdata[0]++;

          if (currOut == "No") {
            NSdata[1][0]++;
          } else if (currOut = "Yes") {
            NSdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NSdata[2][0]++;
          } else if (currBF == "MEH") {
            NSdata[2][1]++;
          } else if (currBF == "JOY") {
            NSdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NSdata[3][0]++;
          } else if (currCC == "MEH") {
            NSdata[3][1]++;
          } else if (currCC == "JOY") {
            NSdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NSdata[4][0]++;
          } else if (currCL == "MEH") {
            NSdata[4][1]++;
          } else if (currCL == "JOY") {
            NSdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NSdata[5][0]++;
          } else if (currDT == "MEH") {
            NSdata[5][1]++;
          } else if (currDT == "JOY") {
            NSdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NSdata[6][0]++;
          } else if (currFP == "MEH") {
            NSdata[6][1]++;
          } else if (currFP == "JOY") {
            NSdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NSdata[7][0]++;
          } else if (currGP == "MEH") {
            NSdata[7][1]++;
          } else if (currGP == "JOY") {
            NSdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NSdata[8][0]++;
          } else if (currGB == "MEH") {
            NSdata[8][1]++;
          } else if (currGB == "JOY") {
            NSdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NSdata[9][0]++;
          } else if (currHF == "MEH") {
            NSdata[9][1]++;
          } else if (currHF == "JOY") {
            NSdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NSdata[10][0]++;
          } else if (currHB == "MEH") {
            NSdata[10][1]++;
          } else if (currHB == "JOY") {
            NSdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NSdata[11][0]++;
          } else if (currHD == "MEH") {
            NSdata[11][1]++;
          } else if (currHD == "JOY") {
            NSdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NSdata[12][0]++;
          } else if (currHM == "MEH") {
            NSdata[12][1]++;
          } else if (currHM == "JOY") {
            NSdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NSdata[13][0]++;
          } else if (currHK == "MEH") {
            NSdata[13][1]++;
          } else if (currHK == "JOY") {
            NSdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NSdata[14][0]++;
          } else if (currJB == "MEH") {
            NSdata[14][1]++;
          } else if (currJB == "JOY") {
            NSdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NSdata[15][0]++;
          } else if (currJG == "MEH") {
            NSdata[15][1]++;
          } else if (currJG == "JOY") {
            NSdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NSdata[16][0]++;
          } else if (currJM == "MEH") {
            NSdata[16][1]++;
          } else if (currJM == "JOY") {
            NSdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NSdata[17][0]++;
          } else if (currKK == "MEH") {
            NSdata[17][1]++;
          } else if (currKK == "JOY") {
            NSdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NSdata[18][0]++;
          } else if (currLT == "MEH") {
            NSdata[18][1]++;
          } else if (currLT == "JOY") {
            NSdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NSdata[19][0]++;
          } else if (currLH == "MEH") {
            NSdata[19][1]++;
          } else if (currLH == "JOY") {
            NSdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NSdata[20][0]++;
          } else if (currLN == "MEH") {
            NSdata[20][1]++;
          } else if (currLN == "JOY") {
            NSdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NSdata[21][0]++;
          } else if (currLB == "MEH") {
            NSdata[21][1]++;
          } else if (currLB == "JOY") {
            NSdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NSdata[22][0]++;
          } else if (currLP == "MEH") {
            NSdata[22][1]++;
          } else if (currLP == "JOY") {
            NSdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NSdata[23][0]++;
          } else if (currMI == "MEH") {
            NSdata[23][1]++;
          } else if (currMI == "JOY") {
            NSdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NSdata[24][0]++;
          } else if (currMD == "MEH") {
            NSdata[24][1]++;
          } else if (currMD == "JOY") {
            NSdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NSdata[25][0]++;
          } else if (currMW == "MEH") {
            NSdata[25][1]++;
          } else if (currMW == "JOY") {
            NSdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NSdata[26][0]++;
          } else if (currMM == "MEH") {
            NSdata[26][1]++;
          } else if (currMM == "JOY") {
            NSdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NSdata[27][0]++;
          } else if (currPM == "MEH") {
            NSdata[27][1]++;
          } else if (currPM == "JOY") {
            NSdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NSdata[28][0]++;
          } else if (currMK == "MEH") {
            NSdata[28][1]++;
          } else if (currMK == "JOY") {
            NSdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NSdata[29][0]++;
          } else if (currMG == "MEH") {
            NSdata[29][1]++;
          } else if (currMG == "JOY") {
            NSdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NSdata[30][0]++;
          } else if (currND == "MEH") {
            NSdata[30][1]++;
          } else if (currND == "JOY") {
            NSdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NSdata[31][0]++;
          } else if (currNC == "MEH") {
            NSdata[31][1]++;
          } else if (currNC == "JOY") {
            NSdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NSdata[32][0]++;
          } else if (currPP == "MEH") {
            NSdata[32][1]++;
          } else if (currPP == "JOY") {
            NSdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NSdata[33][0]++;
          } else if (currPS == "MEH") {
            NSdata[33][1]++;
          } else if (currPS == "JOY") {
            NSdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NSdata[34][0]++;
          } else if (currRC == "MEH") {
            NSdata[34][1]++;
          } else if (currRC == "JOY") {
            NSdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NSdata[35][0]++;
          } else if (currRP == "MEH") {
            NSdata[35][1]++;
          } else if (currRP == "JOY") {
            NSdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NSdata[36][0]++;
          } else if (currRL == "MEH") {
            NSdata[36][1]++;
          } else if (currRL == "JOY") {
            NSdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NSdata[37][0]++;
          } else if (currSK == "MEH") {
            NSdata[37][1]++;
          } else if (currSK == "JOY") {
            NSdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NSdata[38][0]++;
          } else if (currSN == "MEH") {
            NSdata[38][1]++;
          } else if (currSN == "JOY") {
            NSdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NSdata[39][0]++;
          } else if (currSP == "MEH") {
            NSdata[39][1]++;
          } else if (currSP == "JOY") {
            NSdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NSdata[40][0]++;
          } else if (currST == "MEH") {
            NSdata[40][1]++;
          } else if (currST == "JOY") {
            NSdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NSdata[41][0]++;
          } else if (currSF == "MEH") {
            NSdata[41][1]++;
          } else if (currSF == "JOY") {
            NSdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NSdata[42][0]++;
          } else if (currTT == "MEH") {
            NSdata[42][1]++;
          } else if (currTT == "JOY") {
            NSdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NSdata[43][0]++;
          } else if (currTM == "MEH") {
            NSdata[43][1]++;
          } else if (currTM == "JOY") {
            NSdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NSdata[44][0]++;
          } else if (currTB == "MEH") {
            NSdata[44][1]++;
          } else if (currTB == "JOY") {
            NSdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NSdata[45][0]++;
          } else if (currTM == "MEH") {
            NSdata[45][1]++;
          } else if (currTM == "JOY") {
            NSdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NSdata[46][0]++;
          } else if (currTW == "MEH") {
            NSdata[46][1]++;
          } else if (currTW == "JOY") {
            NSdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NSdata[47][0]++;
          } else if (currWM == "MEH") {
            NSdata[47][1]++;
          } else if (currWM == "JOY") {
            NSdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NSdata[48][0]++;
          } else if (currYP == "MEH") {
            NSdata[48][1]++;
          } else if (currYP == "JOY") {
            NSdata[48][2]++;
          }
  
        break;
      case "PE" :
          PEdata[0]++;

          if (currOut == "No") {
            PEdata[1][0]++;
          } else if (currOut = "Yes") {
            PEdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            PEdata[2][0]++;
          } else if (currBF == "MEH") {
            PEdata[2][1]++;
          } else if (currBF == "JOY") {
            PEdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            PEdata[3][0]++;
          } else if (currCC == "MEH") {
            PEdata[3][1]++;
          } else if (currCC == "JOY") {
            PEdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            PEdata[4][0]++;
          } else if (currCL == "MEH") {
            PEdata[4][1]++;
          } else if (currCL == "JOY") {
            PEdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            PEdata[5][0]++;
          } else if (currDT == "MEH") {
            PEdata[5][1]++;
          } else if (currDT == "JOY") {
            PEdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            PEdata[6][0]++;
          } else if (currFP == "MEH") {
            PEdata[6][1]++;
          } else if (currFP == "JOY") {
            PEdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            PEdata[7][0]++;
          } else if (currGP == "MEH") {
            PEdata[7][1]++;
          } else if (currGP == "JOY") {
            PEdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            PEdata[8][0]++;
          } else if (currGB == "MEH") {
            PEdata[8][1]++;
          } else if (currGB == "JOY") {
            PEdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            PEdata[9][0]++;
          } else if (currHF == "MEH") {
            PEdata[9][1]++;
          } else if (currHF == "JOY") {
            PEdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            PEdata[10][0]++;
          } else if (currHB == "MEH") {
            PEdata[10][1]++;
          } else if (currHB == "JOY") {
            PEdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            PEdata[11][0]++;
          } else if (currHD == "MEH") {
            PEdata[11][1]++;
          } else if (currHD == "JOY") {
            PEdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            PEdata[12][0]++;
          } else if (currHM == "MEH") {
            PEdata[12][1]++;
          } else if (currHM == "JOY") {
            PEdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            PEdata[13][0]++;
          } else if (currHK == "MEH") {
            PEdata[13][1]++;
          } else if (currHK == "JOY") {
            PEdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            PEdata[14][0]++;
          } else if (currJB == "MEH") {
            PEdata[14][1]++;
          } else if (currJB == "JOY") {
            PEdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            PEdata[15][0]++;
          } else if (currJG == "MEH") {
            PEdata[15][1]++;
          } else if (currJG == "JOY") {
            PEdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            PEdata[16][0]++;
          } else if (currJM == "MEH") {
            PEdata[16][1]++;
          } else if (currJM == "JOY") {
            PEdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            PEdata[17][0]++;
          } else if (currKK == "MEH") {
            PEdata[17][1]++;
          } else if (currKK == "JOY") {
            PEdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            PEdata[18][0]++;
          } else if (currLT == "MEH") {
            PEdata[18][1]++;
          } else if (currLT == "JOY") {
            PEdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            PEdata[19][0]++;
          } else if (currLH == "MEH") {
            PEdata[19][1]++;
          } else if (currLH == "JOY") {
            PEdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            PEdata[20][0]++;
          } else if (currLN == "MEH") {
            PEdata[20][1]++;
          } else if (currLN == "JOY") {
            PEdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            PEdata[21][0]++;
          } else if (currLB == "MEH") {
            PEdata[21][1]++;
          } else if (currLB == "JOY") {
            PEdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            PEdata[22][0]++;
          } else if (currLP == "MEH") {
            PEdata[22][1]++;
          } else if (currLP == "JOY") {
            PEdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            PEdata[23][0]++;
          } else if (currMI == "MEH") {
            PEdata[23][1]++;
          } else if (currMI == "JOY") {
            PEdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            PEdata[24][0]++;
          } else if (currMD == "MEH") {
            PEdata[24][1]++;
          } else if (currMD == "JOY") {
            PEdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            PEdata[25][0]++;
          } else if (currMW == "MEH") {
            PEdata[25][1]++;
          } else if (currMW == "JOY") {
            PEdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            PEdata[26][0]++;
          } else if (currMM == "MEH") {
            PEdata[26][1]++;
          } else if (currMM == "JOY") {
            PEdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            PEdata[27][0]++;
          } else if (currPM == "MEH") {
            PEdata[27][1]++;
          } else if (currPM == "JOY") {
            PEdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            PEdata[28][0]++;
          } else if (currMK == "MEH") {
            PEdata[28][1]++;
          } else if (currMK == "JOY") {
            PEdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            PEdata[29][0]++;
          } else if (currMG == "MEH") {
            PEdata[29][1]++;
          } else if (currMG == "JOY") {
            PEdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            PEdata[30][0]++;
          } else if (currND == "MEH") {
            PEdata[30][1]++;
          } else if (currND == "JOY") {
            PEdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            PEdata[31][0]++;
          } else if (currNC == "MEH") {
            PEdata[31][1]++;
          } else if (currNC == "JOY") {
            PEdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            PEdata[32][0]++;
          } else if (currPP == "MEH") {
            PEdata[32][1]++;
          } else if (currPP == "JOY") {
            PEdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            PEdata[33][0]++;
          } else if (currPS == "MEH") {
            PEdata[33][1]++;
          } else if (currPS == "JOY") {
            PEdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            PEdata[34][0]++;
          } else if (currRC == "MEH") {
            PEdata[34][1]++;
          } else if (currRC == "JOY") {
            PEdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            PEdata[35][0]++;
          } else if (currRP == "MEH") {
            PEdata[35][1]++;
          } else if (currRP == "JOY") {
            PEdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            PEdata[36][0]++;
          } else if (currRL == "MEH") {
            PEdata[36][1]++;
          } else if (currRL == "JOY") {
            PEdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            PEdata[37][0]++;
          } else if (currSK == "MEH") {
            PEdata[37][1]++;
          } else if (currSK == "JOY") {
            PEdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            PEdata[38][0]++;
          } else if (currSN == "MEH") {
            PEdata[38][1]++;
          } else if (currSN == "JOY") {
            PEdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            PEdata[39][0]++;
          } else if (currSP == "MEH") {
            PEdata[39][1]++;
          } else if (currSP == "JOY") {
            PEdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            PEdata[40][0]++;
          } else if (currST == "MEH") {
            PEdata[40][1]++;
          } else if (currST == "JOY") {
            PEdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            PEdata[41][0]++;
          } else if (currSF == "MEH") {
            PEdata[41][1]++;
          } else if (currSF == "JOY") {
            PEdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            PEdata[42][0]++;
          } else if (currTT == "MEH") {
            PEdata[42][1]++;
          } else if (currTT == "JOY") {
            PEdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            PEdata[43][0]++;
          } else if (currTM == "MEH") {
            PEdata[43][1]++;
          } else if (currTM == "JOY") {
            PEdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            PEdata[44][0]++;
          } else if (currTB == "MEH") {
            PEdata[44][1]++;
          } else if (currTB == "JOY") {
            PEdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            PEdata[45][0]++;
          } else if (currTM == "MEH") {
            PEdata[45][1]++;
          } else if (currTM == "JOY") {
            PEdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            PEdata[46][0]++;
          } else if (currTW == "MEH") {
            PEdata[46][1]++;
          } else if (currTW == "JOY") {
            PEdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            PEdata[47][0]++;
          } else if (currWM == "MEH") {
            PEdata[47][1]++;
          } else if (currWM == "JOY") {
            PEdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            PEdata[48][0]++;
          } else if (currYP == "MEH") {
            PEdata[48][1]++;
          } else if (currYP == "JOY") {
            PEdata[48][2]++;
          }
  
        break;
      case "NF" :
          NFdata[0]++;

          if (currOut == "No") {
            NFdata[1][0]++;
          } else if (currOut = "Yes") {
            NFdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NFdata[2][0]++;
          } else if (currBF == "MEH") {
            NFdata[2][1]++;
          } else if (currBF == "JOY") {
            NFdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NFdata[3][0]++;
          } else if (currCC == "MEH") {
            NFdata[3][1]++;
          } else if (currCC == "JOY") {
            NFdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NFdata[4][0]++;
          } else if (currCL == "MEH") {
            NFdata[4][1]++;
          } else if (currCL == "JOY") {
            NFdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NFdata[5][0]++;
          } else if (currDT == "MEH") {
            NFdata[5][1]++;
          } else if (currDT == "JOY") {
            NFdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NFdata[6][0]++;
          } else if (currFP == "MEH") {
            NFdata[6][1]++;
          } else if (currFP == "JOY") {
            NFdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NFdata[7][0]++;
          } else if (currGP == "MEH") {
            NFdata[7][1]++;
          } else if (currGP == "JOY") {
            NFdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NFdata[8][0]++;
          } else if (currGB == "MEH") {
            NFdata[8][1]++;
          } else if (currGB == "JOY") {
            NFdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NFdata[9][0]++;
          } else if (currHF == "MEH") {
            NFdata[9][1]++;
          } else if (currHF == "JOY") {
            NFdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NFdata[10][0]++;
          } else if (currHB == "MEH") {
            NFdata[10][1]++;
          } else if (currHB == "JOY") {
            NFdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NFdata[11][0]++;
          } else if (currHD == "MEH") {
            NFdata[11][1]++;
          } else if (currHD == "JOY") {
            NFdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NFdata[12][0]++;
          } else if (currHM == "MEH") {
            NFdata[12][1]++;
          } else if (currHM == "JOY") {
            NFdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NFdata[13][0]++;
          } else if (currHK == "MEH") {
            NFdata[13][1]++;
          } else if (currHK == "JOY") {
            NFdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NFdata[14][0]++;
          } else if (currJB == "MEH") {
            NFdata[14][1]++;
          } else if (currJB == "JOY") {
            NFdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NFdata[15][0]++;
          } else if (currJG == "MEH") {
            NFdata[15][1]++;
          } else if (currJG == "JOY") {
            NFdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NFdata[16][0]++;
          } else if (currJM == "MEH") {
            NFdata[16][1]++;
          } else if (currJM == "JOY") {
            NFdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NFdata[17][0]++;
          } else if (currKK == "MEH") {
            NFdata[17][1]++;
          } else if (currKK == "JOY") {
            NFdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NFdata[18][0]++;
          } else if (currLT == "MEH") {
            NFdata[18][1]++;
          } else if (currLT == "JOY") {
            NFdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NFdata[19][0]++;
          } else if (currLH == "MEH") {
            NFdata[19][1]++;
          } else if (currLH == "JOY") {
            NFdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NFdata[20][0]++;
          } else if (currLN == "MEH") {
            NFdata[20][1]++;
          } else if (currLN == "JOY") {
            NFdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NFdata[21][0]++;
          } else if (currLB == "MEH") {
            NFdata[21][1]++;
          } else if (currLB == "JOY") {
            NFdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NFdata[22][0]++;
          } else if (currLP == "MEH") {
            NFdata[22][1]++;
          } else if (currLP == "JOY") {
            NFdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NFdata[23][0]++;
          } else if (currMI == "MEH") {
            NFdata[23][1]++;
          } else if (currMI == "JOY") {
            NFdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NFdata[24][0]++;
          } else if (currMD == "MEH") {
            NFdata[24][1]++;
          } else if (currMD == "JOY") {
            NFdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NFdata[25][0]++;
          } else if (currMW == "MEH") {
            NFdata[25][1]++;
          } else if (currMW == "JOY") {
            NFdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NFdata[26][0]++;
          } else if (currMM == "MEH") {
            NFdata[26][1]++;
          } else if (currMM == "JOY") {
            NFdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NFdata[27][0]++;
          } else if (currPM == "MEH") {
            NFdata[27][1]++;
          } else if (currPM == "JOY") {
            NFdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NFdata[28][0]++;
          } else if (currMK == "MEH") {
            NFdata[28][1]++;
          } else if (currMK == "JOY") {
            NFdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NFdata[29][0]++;
          } else if (currMG == "MEH") {
            NFdata[29][1]++;
          } else if (currMG == "JOY") {
            NFdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NFdata[30][0]++;
          } else if (currND == "MEH") {
            NFdata[30][1]++;
          } else if (currND == "JOY") {
            NFdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NFdata[31][0]++;
          } else if (currNC == "MEH") {
            NFdata[31][1]++;
          } else if (currNC == "JOY") {
            NFdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NFdata[32][0]++;
          } else if (currPP == "MEH") {
            NFdata[32][1]++;
          } else if (currPP == "JOY") {
            NFdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NFdata[33][0]++;
          } else if (currPS == "MEH") {
            NFdata[33][1]++;
          } else if (currPS == "JOY") {
            NFdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NFdata[34][0]++;
          } else if (currRC == "MEH") {
            NFdata[34][1]++;
          } else if (currRC == "JOY") {
            NFdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NFdata[35][0]++;
          } else if (currRP == "MEH") {
            NFdata[35][1]++;
          } else if (currRP == "JOY") {
            NFdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NFdata[36][0]++;
          } else if (currRL == "MEH") {
            NFdata[36][1]++;
          } else if (currRL == "JOY") {
            NFdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NFdata[37][0]++;
          } else if (currSK == "MEH") {
            NFdata[37][1]++;
          } else if (currSK == "JOY") {
            NFdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NFdata[38][0]++;
          } else if (currSN == "MEH") {
            NFdata[38][1]++;
          } else if (currSN == "JOY") {
            NFdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NFdata[39][0]++;
          } else if (currSP == "MEH") {
            NFdata[39][1]++;
          } else if (currSP == "JOY") {
            NFdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NFdata[40][0]++;
          } else if (currST == "MEH") {
            NFdata[40][1]++;
          } else if (currST == "JOY") {
            NFdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NFdata[41][0]++;
          } else if (currSF == "MEH") {
            NFdata[41][1]++;
          } else if (currSF == "JOY") {
            NFdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NFdata[42][0]++;
          } else if (currTT == "MEH") {
            NFdata[42][1]++;
          } else if (currTT == "JOY") {
            NFdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NFdata[43][0]++;
          } else if (currTM == "MEH") {
            NFdata[43][1]++;
          } else if (currTM == "JOY") {
            NFdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NFdata[44][0]++;
          } else if (currTB == "MEH") {
            NFdata[44][1]++;
          } else if (currTB == "JOY") {
            NFdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NFdata[45][0]++;
          } else if (currTM == "MEH") {
            NFdata[45][1]++;
          } else if (currTM == "JOY") {
            NFdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NFdata[46][0]++;
          } else if (currTW == "MEH") {
            NFdata[46][1]++;
          } else if (currTW == "JOY") {
            NFdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NFdata[47][0]++;
          } else if (currWM == "MEH") {
            NFdata[47][1]++;
          } else if (currWM == "JOY") {
            NFdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NFdata[48][0]++;
          } else if (currYP == "MEH") {
            NFdata[48][1]++;
          } else if (currYP == "JOY") {
            NFdata[48][2]++;
          }
  
        break;
      case "NT" :
          NTdata[0]++;

          if (currOut == "No") {
            NTdata[1][0]++;
          } else if (currOut = "Yes") {
            NTdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            NTdata[2][0]++;
          } else if (currBF == "MEH") {
            NTdata[2][1]++;
          } else if (currBF == "JOY") {
            NTdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            NTdata[3][0]++;
          } else if (currCC == "MEH") {
            NTdata[3][1]++;
          } else if (currCC == "JOY") {
            NTdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            NTdata[4][0]++;
          } else if (currCL == "MEH") {
            NTdata[4][1]++;
          } else if (currCL == "JOY") {
            NTdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            NTdata[5][0]++;
          } else if (currDT == "MEH") {
            NTdata[5][1]++;
          } else if (currDT == "JOY") {
            NTdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            NTdata[6][0]++;
          } else if (currFP == "MEH") {
            NTdata[6][1]++;
          } else if (currFP == "JOY") {
            NTdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            NTdata[7][0]++;
          } else if (currGP == "MEH") {
            NTdata[7][1]++;
          } else if (currGP == "JOY") {
            NTdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            NTdata[8][0]++;
          } else if (currGB == "MEH") {
            NTdata[8][1]++;
          } else if (currGB == "JOY") {
            NTdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            NTdata[9][0]++;
          } else if (currHF == "MEH") {
            NTdata[9][1]++;
          } else if (currHF == "JOY") {
            NTdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            NTdata[10][0]++;
          } else if (currHB == "MEH") {
            NTdata[10][1]++;
          } else if (currHB == "JOY") {
            NTdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            NTdata[11][0]++;
          } else if (currHD == "MEH") {
            NTdata[11][1]++;
          } else if (currHD == "JOY") {
            NTdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            NTdata[12][0]++;
          } else if (currHM == "MEH") {
            NTdata[12][1]++;
          } else if (currHM == "JOY") {
            NTdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            NTdata[13][0]++;
          } else if (currHK == "MEH") {
            NTdata[13][1]++;
          } else if (currHK == "JOY") {
            NTdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            NTdata[14][0]++;
          } else if (currJB == "MEH") {
            NTdata[14][1]++;
          } else if (currJB == "JOY") {
            NTdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            NTdata[15][0]++;
          } else if (currJG == "MEH") {
            NTdata[15][1]++;
          } else if (currJG == "JOY") {
            NTdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            NTdata[16][0]++;
          } else if (currJM == "MEH") {
            NTdata[16][1]++;
          } else if (currJM == "JOY") {
            NTdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            NTdata[17][0]++;
          } else if (currKK == "MEH") {
            NTdata[17][1]++;
          } else if (currKK == "JOY") {
            NTdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            NTdata[18][0]++;
          } else if (currLT == "MEH") {
            NTdata[18][1]++;
          } else if (currLT == "JOY") {
            NTdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            NTdata[19][0]++;
          } else if (currLH == "MEH") {
            NTdata[19][1]++;
          } else if (currLH == "JOY") {
            NTdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            NTdata[20][0]++;
          } else if (currLN == "MEH") {
            NTdata[20][1]++;
          } else if (currLN == "JOY") {
            NTdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            NTdata[21][0]++;
          } else if (currLB == "MEH") {
            NTdata[21][1]++;
          } else if (currLB == "JOY") {
            NTdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            NTdata[22][0]++;
          } else if (currLP == "MEH") {
            NTdata[22][1]++;
          } else if (currLP == "JOY") {
            NTdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            NTdata[23][0]++;
          } else if (currMI == "MEH") {
            NTdata[23][1]++;
          } else if (currMI == "JOY") {
            NTdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            NTdata[24][0]++;
          } else if (currMD == "MEH") {
            NTdata[24][1]++;
          } else if (currMD == "JOY") {
            NTdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            NTdata[25][0]++;
          } else if (currMW == "MEH") {
            NTdata[25][1]++;
          } else if (currMW == "JOY") {
            NTdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            NTdata[26][0]++;
          } else if (currMM == "MEH") {
            NTdata[26][1]++;
          } else if (currMM == "JOY") {
            NTdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            NTdata[27][0]++;
          } else if (currPM == "MEH") {
            NTdata[27][1]++;
          } else if (currPM == "JOY") {
            NTdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            NTdata[28][0]++;
          } else if (currMK == "MEH") {
            NTdata[28][1]++;
          } else if (currMK == "JOY") {
            NTdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            NTdata[29][0]++;
          } else if (currMG == "MEH") {
            NTdata[29][1]++;
          } else if (currMG == "JOY") {
            NTdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            NTdata[30][0]++;
          } else if (currND == "MEH") {
            NTdata[30][1]++;
          } else if (currND == "JOY") {
            NTdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            NTdata[31][0]++;
          } else if (currNC == "MEH") {
            NTdata[31][1]++;
          } else if (currNC == "JOY") {
            NTdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            NTdata[32][0]++;
          } else if (currPP == "MEH") {
            NTdata[32][1]++;
          } else if (currPP == "JOY") {
            NTdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            NTdata[33][0]++;
          } else if (currPS == "MEH") {
            NTdata[33][1]++;
          } else if (currPS == "JOY") {
            NTdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            NTdata[34][0]++;
          } else if (currRC == "MEH") {
            NTdata[34][1]++;
          } else if (currRC == "JOY") {
            NTdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            NTdata[35][0]++;
          } else if (currRP == "MEH") {
            NTdata[35][1]++;
          } else if (currRP == "JOY") {
            NTdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            NTdata[36][0]++;
          } else if (currRL == "MEH") {
            NTdata[36][1]++;
          } else if (currRL == "JOY") {
            NTdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            NTdata[37][0]++;
          } else if (currSK == "MEH") {
            NTdata[37][1]++;
          } else if (currSK == "JOY") {
            NTdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            NTdata[38][0]++;
          } else if (currSN == "MEH") {
            NTdata[38][1]++;
          } else if (currSN == "JOY") {
            NTdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            NTdata[39][0]++;
          } else if (currSP == "MEH") {
            NTdata[39][1]++;
          } else if (currSP == "JOY") {
            NTdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            NTdata[40][0]++;
          } else if (currST == "MEH") {
            NTdata[40][1]++;
          } else if (currST == "JOY") {
            NTdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            NTdata[41][0]++;
          } else if (currSF == "MEH") {
            NTdata[41][1]++;
          } else if (currSF == "JOY") {
            NTdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            NTdata[42][0]++;
          } else if (currTT == "MEH") {
            NTdata[42][1]++;
          } else if (currTT == "JOY") {
            NTdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            NTdata[43][0]++;
          } else if (currTM == "MEH") {
            NTdata[43][1]++;
          } else if (currTM == "JOY") {
            NTdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            NTdata[44][0]++;
          } else if (currTB == "MEH") {
            NTdata[44][1]++;
          } else if (currTB == "JOY") {
            NTdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            NTdata[45][0]++;
          } else if (currTM == "MEH") {
            NTdata[45][1]++;
          } else if (currTM == "JOY") {
            NTdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            NTdata[46][0]++;
          } else if (currTW == "MEH") {
            NTdata[46][1]++;
          } else if (currTW == "JOY") {
            NTdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            NTdata[47][0]++;
          } else if (currWM == "MEH") {
            NTdata[47][1]++;
          } else if (currWM == "JOY") {
            NTdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            NTdata[48][0]++;
          } else if (currYP == "MEH") {
            NTdata[48][1]++;
          } else if (currYP == "JOY") {
            NTdata[48][2]++;
          }
  
        break;
      case "YT" :
          YTdata[0]++;

          if (currOut == "No") {
            YTdata[1][0]++;
          } else if (currOut = "Yes") {
            YTdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            YTdata[2][0]++;
          } else if (currBF == "MEH") {
            YTdata[2][1]++;
          } else if (currBF == "JOY") {
            YTdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            YTdata[3][0]++;
          } else if (currCC == "MEH") {
            YTdata[3][1]++;
          } else if (currCC == "JOY") {
            YTdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            YTdata[4][0]++;
          } else if (currCL == "MEH") {
            YTdata[4][1]++;
          } else if (currCL == "JOY") {
            YTdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            YTdata[5][0]++;
          } else if (currDT == "MEH") {
            YTdata[5][1]++;
          } else if (currDT == "JOY") {
            YTdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            YTdata[6][0]++;
          } else if (currFP == "MEH") {
            YTdata[6][1]++;
          } else if (currFP == "JOY") {
            YTdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            YTdata[7][0]++;
          } else if (currGP == "MEH") {
            YTdata[7][1]++;
          } else if (currGP == "JOY") {
            YTdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            YTdata[8][0]++;
          } else if (currGB == "MEH") {
            YTdata[8][1]++;
          } else if (currGB == "JOY") {
            YTdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            YTdata[9][0]++;
          } else if (currHF == "MEH") {
            YTdata[9][1]++;
          } else if (currHF == "JOY") {
            YTdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            YTdata[10][0]++;
          } else if (currHB == "MEH") {
            YTdata[10][1]++;
          } else if (currHB == "JOY") {
            YTdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            YTdata[11][0]++;
          } else if (currHD == "MEH") {
            YTdata[11][1]++;
          } else if (currHD == "JOY") {
            YTdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            YTdata[12][0]++;
          } else if (currHM == "MEH") {
            YTdata[12][1]++;
          } else if (currHM == "JOY") {
            YTdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            YTdata[13][0]++;
          } else if (currHK == "MEH") {
            YTdata[13][1]++;
          } else if (currHK == "JOY") {
            YTdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            YTdata[14][0]++;
          } else if (currJB == "MEH") {
            YTdata[14][1]++;
          } else if (currJB == "JOY") {
            YTdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            YTdata[15][0]++;
          } else if (currJG == "MEH") {
            YTdata[15][1]++;
          } else if (currJG == "JOY") {
            YTdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            YTdata[16][0]++;
          } else if (currJM == "MEH") {
            YTdata[16][1]++;
          } else if (currJM == "JOY") {
            YTdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            YTdata[17][0]++;
          } else if (currKK == "MEH") {
            YTdata[17][1]++;
          } else if (currKK == "JOY") {
            YTdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            YTdata[18][0]++;
          } else if (currLT == "MEH") {
            YTdata[18][1]++;
          } else if (currLT == "JOY") {
            YTdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            YTdata[19][0]++;
          } else if (currLH == "MEH") {
            YTdata[19][1]++;
          } else if (currLH == "JOY") {
            YTdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            YTdata[20][0]++;
          } else if (currLN == "MEH") {
            YTdata[20][1]++;
          } else if (currLN == "JOY") {
            YTdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            YTdata[21][0]++;
          } else if (currLB == "MEH") {
            YTdata[21][1]++;
          } else if (currLB == "JOY") {
            YTdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            YTdata[22][0]++;
          } else if (currLP == "MEH") {
            YTdata[22][1]++;
          } else if (currLP == "JOY") {
            YTdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            YTdata[23][0]++;
          } else if (currMI == "MEH") {
            YTdata[23][1]++;
          } else if (currMI == "JOY") {
            YTdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            YTdata[24][0]++;
          } else if (currMD == "MEH") {
            YTdata[24][1]++;
          } else if (currMD == "JOY") {
            YTdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            YTdata[25][0]++;
          } else if (currMW == "MEH") {
            YTdata[25][1]++;
          } else if (currMW == "JOY") {
            YTdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            YTdata[26][0]++;
          } else if (currMM == "MEH") {
            YTdata[26][1]++;
          } else if (currMM == "JOY") {
            YTdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            YTdata[27][0]++;
          } else if (currPM == "MEH") {
            YTdata[27][1]++;
          } else if (currPM == "JOY") {
            YTdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            YTdata[28][0]++;
          } else if (currMK == "MEH") {
            YTdata[28][1]++;
          } else if (currMK == "JOY") {
            YTdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            YTdata[29][0]++;
          } else if (currMG == "MEH") {
            YTdata[29][1]++;
          } else if (currMG == "JOY") {
            YTdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            YTdata[30][0]++;
          } else if (currND == "MEH") {
            YTdata[30][1]++;
          } else if (currND == "JOY") {
            YTdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            YTdata[31][0]++;
          } else if (currNC == "MEH") {
            YTdata[31][1]++;
          } else if (currNC == "JOY") {
            YTdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            YTdata[32][0]++;
          } else if (currPP == "MEH") {
            YTdata[32][1]++;
          } else if (currPP == "JOY") {
            YTdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            YTdata[33][0]++;
          } else if (currPS == "MEH") {
            YTdata[33][1]++;
          } else if (currPS == "JOY") {
            YTdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            YTdata[34][0]++;
          } else if (currRC == "MEH") {
            YTdata[34][1]++;
          } else if (currRC == "JOY") {
            YTdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            YTdata[35][0]++;
          } else if (currRP == "MEH") {
            YTdata[35][1]++;
          } else if (currRP == "JOY") {
            YTdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            YTdata[36][0]++;
          } else if (currRL == "MEH") {
            YTdata[36][1]++;
          } else if (currRL == "JOY") {
            YTdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            YTdata[37][0]++;
          } else if (currSK == "MEH") {
            YTdata[37][1]++;
          } else if (currSK == "JOY") {
            YTdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            YTdata[38][0]++;
          } else if (currSN == "MEH") {
            YTdata[38][1]++;
          } else if (currSN == "JOY") {
            YTdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            YTdata[39][0]++;
          } else if (currSP == "MEH") {
            YTdata[39][1]++;
          } else if (currSP == "JOY") {
            YTdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            YTdata[40][0]++;
          } else if (currST == "MEH") {
            YTdata[40][1]++;
          } else if (currST == "JOY") {
            YTdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            YTdata[41][0]++;
          } else if (currSF == "MEH") {
            YTdata[41][1]++;
          } else if (currSF == "JOY") {
            YTdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            YTdata[42][0]++;
          } else if (currTT == "MEH") {
            YTdata[42][1]++;
          } else if (currTT == "JOY") {
            YTdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            YTdata[43][0]++;
          } else if (currTM == "MEH") {
            YTdata[43][1]++;
          } else if (currTM == "JOY") {
            YTdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            YTdata[44][0]++;
          } else if (currTB == "MEH") {
            YTdata[44][1]++;
          } else if (currTB == "JOY") {
            YTdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            YTdata[45][0]++;
          } else if (currTM == "MEH") {
            YTdata[45][1]++;
          } else if (currTM == "JOY") {
            YTdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            YTdata[46][0]++;
          } else if (currTW == "MEH") {
            YTdata[46][1]++;
          } else if (currTW == "JOY") {
            YTdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            YTdata[47][0]++;
          } else if (currWM == "MEH") {
            YTdata[47][1]++;
          } else if (currWM == "JOY") {
            YTdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            YTdata[48][0]++;
          } else if (currYP == "MEH") {
            YTdata[48][1]++;
          } else if (currYP == "JOY") {
            YTdata[48][2]++;
          }
  
        break;

    //OTHER
      case "OTHER" :
          OTHERdata[0]++;

          if (currOut == "No") {
            OTHERdata[1][0]++;
          } else if (currOut = "Yes") {
            OTHERdata[1][1]++;
          }
  
          //Butterfinger 2
          if (currBF == "DESPAIR") {
            OTHERdata[2][0]++;
          } else if (currBF == "MEH") {
            OTHERdata[2][1]++;
          } else if (currBF == "JOY") {
            OTHERdata[2][2]++;
          }
  
          //CandyCorn 3
          if (currCC == "DESPAIR") {
            OTHERdata[3][0]++;
          } else if (currCC == "MEH") {
            OTHERdata[3][1]++;
          } else if (currCC == "JOY") {
            OTHERdata[3][2]++;
          }
  
          //chiclets 4
          if (currCL == "DESPAIR") {
            OTHERdata[4][0]++;
          } else if (currCL == "MEH") {
            OTHERdata[4][1]++;
          } else if (currCL == "JOY") {
            OTHERdata[4][2]++;
          }
  
          //Dots 5
          if (currDT == "DESPAIR") {
            OTHERdata[5][0]++;
          } else if (currDT == "MEH") {
            OTHERdata[5][1]++;
          } else if (currDT == "JOY") {
            OTHERdata[5][2]++;
          }
  
          //Fuzzy Peaches 6
          if (currFP == "DESPAIR") {
            OTHERdata[6][0]++;
          } else if (currFP == "MEH") {
            OTHERdata[6][1]++;
          } else if (currFP == "JOY") {
            OTHERdata[6][2]++;
          }
  
          //Good n Plenty 7
          if (currGP == "DESPAIR") {
            OTHERdata[7][0]++;
          } else if (currGP == "MEH") {
            OTHERdata[7][1]++;
          } else if (currGP == "JOY") {
            OTHERdata[7][2]++;
          }
  
          //Gummy Bears 8
          if (currGB == "DESPAIR") {
            OTHERdata[8][0]++;
          } else if (currGB == "MEH") {
            OTHERdata[8][1]++;
          } else if (currGB == "JOY") {
            OTHERdata[8][2]++;
          }
  
          //Healthy Fruit 9
          if (currHF == "DESPAIR") {
            OTHERdata[9][0]++;
          } else if (currHF == "MEH") {
            OTHERdata[9][1]++;
          } else if (currHF == "JOY") {
            OTHERdata[9][2]++;
          }
  
          //Heath Bar 10
          if (currHB == "DESPAIR") {
            OTHERdata[10][0]++;
          } else if (currHB == "MEH") {
            OTHERdata[10][1]++;
          } else if (currHB == "JOY") {
            OTHERdata[10][2]++;
          }
  
          //Hershey Dark 11
          if (currHD == "DESPAIR") {
            OTHERdata[11][0]++;
          } else if (currHD == "MEH") {
            OTHERdata[11][1]++;
          } else if (currHD == "JOY") {
            OTHERdata[11][2]++;
          }
  
          //Hershy Milk 12
          if (currHM == "DESPAIR") {
            OTHERdata[12][0]++;
          } else if (currHM == "MEH") {
            OTHERdata[12][1]++;
          } else if (currHM == "JOY") {
            OTHERdata[12][2]++;
          }
  
          //Hershey Kisses 13
          if (currHK == "DESPAIR") {
            OTHERdata[13][0]++;
          } else if (currHK == "MEH") {
            OTHERdata[13][1]++;
          } else if (currHK == "JOY") {
            OTHERdata[13][2]++;
          }
  
          //Jolly Rancher Bad 14
          if (currJB == "DESPAIR") {
            OTHERdata[14][0]++;
          } else if (currJB == "MEH") {
            OTHERdata[14][1]++;
          } else if (currJB == "JOY") {
            OTHERdata[14][2]++;
          }
  
          //Jolly Rancher Good 15
          if (currJG == "DESPAIR") {
            OTHERdata[15][0]++;
          } else if (currJG == "MEH") {
            OTHERdata[15][1]++;
          } else if (currJG == "JOY") {
            OTHERdata[15][2]++;
          }
  
          //Junior Mints 16
          if (currJM == "DESPAIR") {
            OTHERdata[16][0]++;
          } else if (currJM == "MEH") {
            OTHERdata[16][1]++;
          } else if (currJM == "JOY") {
            OTHERdata[16][2]++;
          }
  
          //Kit Kat 17
          if (currKK == "DESPAIR") {
            OTHERdata[17][0]++;
          } else if (currKK == "MEH") {
            OTHERdata[17][1]++;
          } else if (currKK == "JOY") {
            OTHERdata[17][2]++;
          }
  
          //Laffy Taffy 18
          if (currLT == "DESPAIR") {
            OTHERdata[18][0]++;
          } else if (currLT == "MEH") {
            OTHERdata[18][1]++;
          } else if (currLT == "JOY") {
            OTHERdata[18][2]++;
          }
  
          //Lemon Heads 19
          if (currLH == "DESPAIR") {
            OTHERdata[19][0]++;
          } else if (currLH == "MEH") {
            OTHERdata[19][1]++;
          } else if (currLH == "JOY") {
            OTHERdata[19][2]++;
          }
  
          //Licorice not black 20
          if (currLN == "DESPAIR") {
            OTHERdata[20][0]++;
          } else if (currLN == "MEH") {
            OTHERdata[20][1]++;
          } else if (currLN == "JOY") {
            OTHERdata[20][2]++;
          }
  
          //Licorice black 21
          if (currLB == "DESPAIR") {
            OTHERdata[21][0]++;
          } else if (currLB == "MEH") {
            OTHERdata[21][1]++;
          } else if (currLB == "JOY") {
            OTHERdata[21][2]++;
          }
  
          //Lollipops 22
          if (currLP == "DESPAIR") {
            OTHERdata[22][0]++;
          } else if (currLP == "MEH") {
            OTHERdata[22][1]++;
          } else if (currLP == "JOY") {
            OTHERdata[22][2]++;
          }
  
          //mike and ike 23
          if (currMI == "DESPAIR") {
            OTHERdata[23][0]++;
          } else if (currMI == "MEH") {
            OTHERdata[23][1]++;
          } else if (currMI == "JOY") {
            OTHERdata[23][2]++;
          }
  
          //milk duds 24
          if (currMD == "DESPAIR") {
            OTHERdata[24][0]++;
          } else if (currMD == "MEH") {
            OTHERdata[24][1]++;
          } else if (currMD == "JOY") {
            OTHERdata[24][2]++;
          }
  
          //milky way 25
          if (currMW == "DESPAIR") {
            OTHERdata[25][0]++;
          } else if (currMW == "MEH") {
            OTHERdata[25][1]++;
          } else if (currMW == "JOY") {
            OTHERdata[25][2]++;
          }
          
          //regular m&ms 26
          if (currMM == "DESPAIR") {
            OTHERdata[26][0]++;
          } else if (currMM == "MEH") {
            OTHERdata[26][1]++;
          } else if (currMM == "JOY") {
            OTHERdata[26][2]++;
          }
  
          //peanut mms 27
          if (currPM == "DESPAIR") {
            OTHERdata[27][0]++;
          } else if (currPM == "MEH") {
            OTHERdata[27][1]++;
          } else if (currPM == "JOY") {
            OTHERdata[27][2]++;
          }
  
          //mint kisses 28
          if (currMK == "DESPAIR") {
            OTHERdata[28][0]++;
          } else if (currMK == "MEH") {
            OTHERdata[28][1]++;
          } else if (currMK == "JOY") {
            OTHERdata[28][2]++;
          }
  
          //mr goodbar 29
          if (currMG == "DESPAIR") {
            OTHERdata[29][0]++;
          } else if (currMG == "MEH") {
            OTHERdata[29][1]++;
          } else if (currMG == "JOY") {
            OTHERdata[29][2]++;
          }
  
          //nerds 30
          if (currND == "DESPAIR") {
            OTHERdata[30][0]++;
          } else if (currND == "MEH") {
            OTHERdata[30][1]++;
          } else if (currND == "JOY") {
            OTHERdata[30][2]++;
          }
  
          //nestle crunch 31
          if (currNC == "DESPAIR") {
            OTHERdata[31][0]++;
          } else if (currNC == "MEH") {
            OTHERdata[31][1]++;
          } else if (currNC == "JOY") {
            OTHERdata[31][2]++;
          }
  
          //peeps 32
          if (currPP == "DESPAIR") {
            OTHERdata[32][0]++;
          } else if (currPP == "MEH") {
            OTHERdata[32][1]++;
          } else if (currPP == "JOY") {
            OTHERdata[32][2]++;
          }
  
          //pixy stix 33
          if (currPS == "DESPAIR") {
            OTHERdata[33][0]++;
          } else if (currPS == "MEH") {
            OTHERdata[33][1]++;
          } else if (currPS == "JOY") {
            OTHERdata[33][2]++;
          }
  
          //reeses cups 34
          if (currRC == "DESPAIR") {
            OTHERdata[34][0]++;
          } else if (currRC == "MEH") {
            OTHERdata[34][1]++;
          } else if (currRC == "JOY") {
            OTHERdata[34][2]++;
          }
  
          //reeses pieces 35
          if (currRP == "DESPAIR") {
            OTHERdata[35][0]++;
          } else if (currRP == "MEH") {
            OTHERdata[35][1]++;
          } else if (currRP == "JOY") {
            OTHERdata[35][2]++;
          }
  
          //rolos 36
          if (currRL == "DESPAIR") {
            OTHERdata[36][0]++;
          } else if (currRL == "MEH") {
            OTHERdata[36][1]++;
          } else if (currRL == "JOY") {
            OTHERdata[36][2]++;
          }
  
          //skittles 37
          if (currSK == "DESPAIR") {
            OTHERdata[37][0]++;
          } else if (currSK == "MEH") {
            OTHERdata[37][1]++;
          } else if (currSK == "JOY") {
            OTHERdata[37][2]++;
          }
  
          //snickers 38
          if (currSN == "DESPAIR") {
            OTHERdata[38][0]++;
          } else if (currSN == "MEH") {
            OTHERdata[38][1]++;
          } else if (currSN == "JOY") {
            OTHERdata[38][2]++;
          }
  
          //sour patch kids 39
          if (currSP == "DESPAIR") {
            OTHERdata[39][0]++;
          } else if (currSP == "MEH") {
            OTHERdata[39][1]++;
          } else if (currSP == "JOY") {
            OTHERdata[39][2]++;
          }
  
          //starbursts 40
          if (currST == "DESPAIR") {
            OTHERdata[40][0]++;
          } else if (currST == "MEH") {
            OTHERdata[40][1]++;
          } else if (currST == "JOY") {
            OTHERdata[40][2]++;
          }
  
          //swedish fish 41
          if (currSF == "DESPAIR") {
            OTHERdata[41][0]++;
          } else if (currSF == "MEH") {
            OTHERdata[41][1]++;
          } else if (currSF == "JOY") {
            OTHERdata[41][2]++;
          }
  
          //tic tacs 42
          if (currTT == "DESPAIR") {
            OTHERdata[42][0]++;
          } else if (currTT == "MEH") {
            OTHERdata[42][1]++;
          } else if (currTT == "JOY") {
            OTHERdata[42][2]++;
          }
  
          //three musketeers 43
          if (currTM == "DESPAIR") {
            OTHERdata[43][0]++;
          } else if (currTM == "MEH") {
            OTHERdata[43][1]++;
          } else if (currTM == "JOY") {
            OTHERdata[43][2]++;
          }
  
          //tolberone 44
          if (currTB == "DESPAIR") {
            OTHERdata[44][0]++;
          } else if (currTB == "MEH") {
            OTHERdata[44][1]++;
          } else if (currTB == "JOY") {
            OTHERdata[44][2]++;
          }
  
          //trail mix 45
          if (currTM == "DESPAIR") {
            OTHERdata[45][0]++;
          } else if (currTM == "MEH") {
            OTHERdata[45][1]++;
          } else if (currTM == "JOY") {
            OTHERdata[45][2]++;
          }
  
          //twix 46
          if (currTW == "DESPAIR") {
            OTHERdata[46][0]++;
          } else if (currTW == "MEH") {
            OTHERdata[46][1]++;
          } else if (currTW == "JOY") {
            OTHERdata[46][2]++;
          }
  
          //whatchamacallit 47
          if (currWM == "DESPAIR") {
            OTHERdata[47][0]++;
          } else if (currWM == "MEH") {
            OTHERdata[47][1]++;
          } else if (currWM == "JOY") {
            OTHERdata[47][2]++;
          }
  
          //york peppermint patties 48
          if (currYP == "DESPAIR") {
            OTHERdata[48][0]++;
          } else if (currYP == "MEH") {
            OTHERdata[48][1]++;
          } else if (currYP == "JOY") {
            OTHERdata[48][2]++;
          }
  
        break;
      
    

    }

  }


  

  for (var m = 2; m < ALdata.length; m++) {
    ALdata[m][3] = (ALdata[m][0] * 1 + ALdata[m][1] * 2 + ALdata[m][2] * 3)/ALdata[0];
    AKdata[m][3] = (AKdata[m][0] * 1 + AKdata[m][1] * 2 + AKdata[m][2] * 3)/AKdata[0]; //Arkansas AK
    AZdata[m][3] = (AZdata[m][0] * 1 + AZdata[m][1] * 2 + AZdata[m][2] * 3)/AZdata[0]; //Arizona AZ
    ARdata[m][3] = (ARdata[m][0] * 1 + ARdata[m][1] * 2 + ARdata[m][2] * 3)/ARdata[0]; //ARKANSAS	AR
    CAdata[m][3] = (CAdata[m][0] * 1 + CAdata[m][1] * 2 + CAdata[m][2] * 3)/CAdata[0];// CALIFORNIA	CA
    COdata[m][3] = (COdata[m][0] * 1 + COdata[m][1] * 2 + COdata[m][2] * 3)/COdata[0];// COLORADO	CO
    CTdata[m][3] = (CTdata[m][0] * 1 + CTdata[m][1] * 2 + CTdata[m][2] * 3)/CTdata[0];// CONNECTICUT	CT
    DEdata[m][3] = (DEdata[m][0] * 1 + DEdata[m][1] * 2 + DEdata[m][2] * 3)/DEdata[0];// DELAWARE	DE
    DCdata[m][3] = (DCdata[m][0] * 1 + DCdata[m][1] * 2 + DCdata[m][2] * 3)/DCdata[0];// DISTRICT OF COLUMBIA	DC
    FLdata[m][3] = (FLdata[m][0] * 1 + FLdata[m][1] * 2 + FLdata[m][2] * 3)/FLdata[0];// FLORIDA	FL
    GAdata[m][3] = (GAdata[m][0] * 1 + GAdata[m][1] * 2 + GAdata[m][2] * 3)/GAdata[0];// GEORGIA	GA
    HIdata[m][3] = (HIdata[m][0] * 1 + HIdata[m][1] * 2 + HIdata[m][2] * 3)/HIdata[0];// HAWAII	HI
    IDdata[m][3] = (IDdata[m][0] * 1 + IDdata[m][1] * 2 + IDdata[m][2] * 3)/IDdata[0];// IDAHO	ID
    ILdata[m][3] = (ILdata[m][0] * 1 + ILdata[m][1] * 2 + ILdata[m][2] * 3)/ILdata[0];// ILLINOIS	IL
    INdata[m][3] = (INdata[m][0] * 1 + INdata[m][1] * 2 + INdata[m][2] * 3)/INdata[0];// INDIANA	IN
    IAdata[m][3] = (IAdata[m][0] * 1 + IAdata[m][1] * 2 + IAdata[m][2] * 3)/IAdata[0];// IOWA	IA
    KSdata[m][3] = (KSdata[m][0] * 1 + KSdata[m][1] * 2 + KSdata[m][2] * 3)/KSdata[0];// KANSAS	KS
    KYdata[m][3] = (KYdata[m][0] * 1 + KYdata[m][1] * 2 + KYdata[m][2] * 3)/KYdata[0];// KENTUCKY	KY
    LAdata[m][3] = (LAdata[m][0] * 1 + LAdata[m][1] * 2 + LAdata[m][2] * 3)/LAdata[0];// LOUISIANA	LA
    MEdata[m][3] = (MEdata[m][0] * 1 + MEdata[m][1] * 2 + MEdata[m][2] * 3)/MEdata[0];// MAINE	ME
    MDdata[m][3] = (MDdata[m][0] * 1 + MDdata[m][1] * 2 + MDdata[m][2] * 3)/MDdata[0];// MARYLAND	MD
    MAdata[m][3] = (MAdata[m][0] * 1 + MAdata[m][1] * 2 + MAdata[m][2] * 3)/MAdata[0];// MASSACHUSETTS	MA
    MIdata[m][3] = (MIdata[m][0] * 1 + MIdata[m][1] * 2 + MIdata[m][2] * 3)/MIdata[0];// MICHIGAN	MI
    MNdata[m][3] = (MNdata[m][0] * 1 + MNdata[m][1] * 2 + MNdata[m][2] * 3)/MNdata[0];// MINNESOTA	MN
    MSdata[m][3] = (MSdata[m][0] * 1 + MSdata[m][1] * 2 + MSdata[m][2] * 3)/MSdata[0];// MISSISSIPPI	MS
    MOdata[m][3] = (MOdata[m][0] * 1 + MOdata[m][1] * 2 + MOdata[m][2] * 3)/MOdata[0];// MISSOURI	MO
    MTdata[m][3] = (MTdata[m][0] * 1 + MTdata[m][1] * 2 + MTdata[m][2] * 3)/MTdata[0];// MONTANA	MT
    NEdata[m][3] = (NEdata[m][0] * 1 + NEdata[m][1] * 2 + NEdata[m][2] * 3)/NEdata[0];// NEBRASKA	NE
    NVdata[m][3] = (NVdata[m][0] * 1 + NVdata[m][1] * 2 + NVdata[m][2] * 3)/NVdata[0];// NEVADA	NV
    NHdata[m][3] = (NHdata[m][0] * 1 + NHdata[m][1] * 2 + NHdata[m][2] * 3)/NHdata[0];// NEW HAMPSHIRE	NH
    NJdata[m][3] = (NJdata[m][0] * 1 + NJdata[m][1] * 2 + NJdata[m][2] * 3)/NJdata[0];// NEW JERSEY	NJ
    NMdata[m][3] = (NMdata[m][0] * 1 + NMdata[m][1] * 2 + NMdata[m][2] * 3)/NMdata[0];// NEW MEXICO	NM
    NYdata[m][3] = (NYdata[m][0] * 1 + NYdata[m][1] * 2 + NYdata[m][2] * 3)/NYdata[0];// NEW YORK	NY
    NCdata[m][3] = (NCdata[m][0] * 1 + NCdata[m][1] * 2 + NCdata[m][2] * 3)/NCdata[0];// NORTH CAROLINA	NC
    NDdata[m][3] = (NDdata[m][0] * 1 + NDdata[m][1] * 2 + NDdata[m][2] * 3)/NDdata[0];// NORTH DAKOTA	ND
    OHdata[m][3] = (OHdata[m][0] * 1 + OHdata[m][1] * 2 + OHdata[m][2] * 3)/OHdata[0];// OHIO	OH
    OKdata[m][3] = (OKdata[m][0] * 1 + OKdata[m][1] * 2 + OKdata[m][2] * 3)/OKdata[0];// OKLAHOMA	OK
    ORdata[m][3] = (ORdata[m][0] * 1 + ORdata[m][1] * 2 + ORdata[m][2] * 3)/ORdata[0];// OREGON	OR
    PAdata[m][3] = (PAdata[m][0] * 1 + PAdata[m][1] * 2 + PAdata[m][2] * 3)/PAdata[0];// PENNSYLVANIA	PA
    RIdata[m][3] = (RIdata[m][0] * 1 + RIdata[m][1] * 2 + RIdata[m][2] * 3)/RIdata[0];// RHODE ISLAND	RI
    SCdata[m][3] = (SCdata[m][0] * 1 + SCdata[m][1] * 2 + SCdata[m][2] * 3)/SCdata[0];// SOUTH CAROLINA	SC
    SDdata[m][3] = (SDdata[m][0] * 1 + SDdata[m][1] * 2 + SDdata[m][2] * 3)/SDdata[0];// SOUTH DAKOTA	SD
    TNdata[m][3] = (TNdata[m][0] * 1 + TNdata[m][1] * 2 + TNdata[m][2] * 3)/TNdata[0];// TENNESSEE	TN
    TXdata[m][3] = (TXdata[m][0] * 1 + TXdata[m][1] * 2 + TXdata[m][2] * 3)/TXdata[0];// TEXAS	TX
    UTdata[m][3] = (UTdata[m][0] * 1 + UTdata[m][1] * 2 + UTdata[m][2] * 3)/UTdata[0];// UTAH	UT
    VTdata[m][3] = (VTdata[m][0] * 1 + VTdata[m][1] * 2 + VTdata[m][2] * 3)/VTdata[0];// VERMONT	VT
    VAdata[m][3] = (VAdata[m][0] * 1 + VAdata[m][1] * 2 + VAdata[m][2] * 3)/VAdata[0];// VIRGINIA	VA
    WAdata[m][3] = (WAdata[m][0] * 1 + WAdata[m][1] * 2 + WAdata[m][2] * 3)/WAdata[0];// WASHINGTON	WA
    WVdata[m][3] = (WVdata[m][0] * 1 + WVdata[m][1] * 2 + WVdata[m][2] * 3)/WVdata[0];// WEST VIRGINIA	WV
    WIdata[m][3] = (WIdata[m][0] * 1 + WIdata[m][1] * 2 + WIdata[m][2] * 3)/WIdata[0];// WISCONSIN	WI
    WYdata[m][3] = (WYdata[m][0] * 1 + WYdata[m][1] * 2 + WYdata[m][2] * 3)/WYdata[0];// WYOMING	WY

    //CANADA
    BCdata[m][3] = (BCdata[m][0] * 1 + BCdata[m][1] * 2 + BCdata[m][2] * 3)/BCdata[0];// BRITISH COLUMBIA	BC
    ABdata[m][3] = (ABdata[m][0] * 1 + ABdata[m][1] * 2 + ABdata[m][2] * 3)/ABdata[0];// ALBERTA	AB
    SKdata[m][3] = (SKdata[m][0] * 1 + SKdata[m][1] * 2 + SKdata[m][2] * 3)/SKdata[0];// SASKATCHEWAN	SK
    MBdata[m][3] = (MBdata[m][0] * 1 + MBdata[m][1] * 2 + MBdata[m][2] * 3)/MBdata[0];// MANITOBA	MB
    ONdata[m][3] = (ONdata[m][0] * 1 + ONdata[m][1] * 2 + ONdata[m][2] * 3)/ONdata[0];// ONTARIO	ON
    QCdata[m][3] = (QCdata[m][0] * 1 + QCdata[m][1] * 2 + QCdata[m][2] * 3)/QCdata[0];// QUEBEC	QC
    NBdata[m][3] = (NBdata[m][0] * 1 + NBdata[m][1] * 2 + NBdata[m][2] * 3)/NBdata[0];// NEW BRUNSWICK	NB
    NSdata[m][3] = (NSdata[m][0] * 1 + NSdata[m][1] * 2 + NSdata[m][2] * 3)/NSdata[0];// NOVA SCOTIA	NS
    PEdata[m][3] = (PEdata[m][0] * 1 + PEdata[m][1] * 2 + PEdata[m][2] * 3)/PEdata[0];// PRINCE EDWARD ISLAND	PE
    NFdata[m][3] = (NFdata[m][0] * 1 + NFdata[m][1] * 2 + NFdata[m][2] * 3)/NFdata[0];// NEWFOUNDLAND	NF
    NTdata[m][3] = (NTdata[m][0] * 1 + NTdata[m][1] * 2 + NTdata[m][2] * 3)/NTdata[0];// NORTHWEST TERRITORIES	NT
    YTdata[m][3] = (YTdata[m][0] * 1 + YTdata[m][1] * 2 + YTdata[m][2] * 3)/YTdata[0];// YUKON	YT

    OTHERdata[m][3] = (OTHERdata[m][0] * 1 + OTHERdata[m][1] * 2 + OTHERdata[m][2] * 3)/OTHERdata[0];

  }
  // console.log(NYdata);






  stateData = [
    ALdata,
    AKdata,
    AZdata,
    COdata,
    FLdata,
    GAdata,
    INdata,
    KSdata,
    MEdata,
    MAdata,
    MNdata,
    NJdata,
    NCdata,
    NDdata,
    OKdata,
    PAdata,
    SDdata,
    TXdata,
    WYdata,
    CTdata,
    MOdata,
    WVdata,
    ILdata,
    NMdata,
    ARdata,
    CAdata,
    DEdata,
    DCdata,
    HIdata,
    IAdata,
    KYdata,
    MDdata,
    MIdata,
    MSdata,
    MTdata,
    NHdata,
    NYdata,
    OHdata,
    ORdata,
    TNdata,
    UTdata,
    VAdata,
    WAdata,
    WIdata,
    OTHERdata, // American Samoa
    OTHERdata, // Guam
    OTHERdata, //Commonwealth of the Northern Mariana Islands
    NEdata,
    SCdata,
    OTHERdata, // Puerto Rico
    OTHERdata, // US Virgin Islands
    IDdata,
    NVdata,
    VTdata,
    LAdata,
    RIdata
  ]

});

// end csv data
// stateData = [
//   ALdata,
//   AKdata,
//   AZdata,
//   ARdata,
//   CAdata,
//   COdata,
//   CTdata,
//   DEdata,
//   DCdata,
//   FLdata,
//   GAdata,
//   HIdata,
//   IDdata,
//   ILdata,
//   INdata,
//   IAdata,
//   KSdata,
//   KYdata,
//   LAdata,
//   MEdata,
//   MDdata,
//   MAdata,
//   MIdata,
//   MNdata,
//   MSdata,
//   MOdata,
//   MTdata,
//   NEdata,
//   NVdata,
//   NHdata,
//   NJdata,
//   NMdata,
//   NYdata,
//   NCdata,
//   NDdata,
//   OHdata,
//   OKdata,
//   ORdata,
//   PAdata,
//   RIdata,
//   SCdata,
//   SDdata,
//   TNdata,
//   TXdata,
//   UTdata,
//   VTdata,
//   VAdata,
//   WAdata,
//   WVdata,
//   WIdata,
//   WYdata
// ];