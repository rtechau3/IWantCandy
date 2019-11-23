# IWantCandy
Data visualization about the feelings different candies evoke, using D3

## TODO 11/22/2019
- read the update below for context
- work on placement of key (not sure where/how to place it - it's currently set up in index.html)
- the map is NOT being recolored when a button is pressed. I'm not sure why. It seems averageRatings is being properly reset onClick, but perhaps calling d3.json in recolorMap again is not the correct thing.
- when the map first loads and no buttons have been pressed, the states need to be colored. We can
- - set a default candy to be selected on page load
- - populate averageRatings with the same value at every index, and default the map to the same color
- candy buttons
- Speaking of the candy buttons
- - they are ugly. We can style them differently, use radio buttons instead of buttons, arrange them nicer, whatever
- - when a button is pressed, we need to give feedback on which candy it's showing the ratings for. We can color the button darker, display the candy name somewhere on the page, etc.
- should we animate how the states are colored? may be a nice touch, but not necesarry
- update colors (joyColor, mehColor, despairColor in main.js) to match key
- ^ Or, modify the key (I just used a word doc called Key I put in Assets and Smiley shapes, I can recolor them or you can if you have a preference for how they look!)
- filter based on number of trick or treaters (unless we think this isn't important? what kind of questions/value does it add)
- work on placement of key (not sure where/how to place it - it's currently set up in index.html)

## Update - Rachel 11/22/2019
- added candy buttons (line 124)
- averageRatings[] on line 62 (global var)
- - used in drawMap to set the colors of the states
- - is reset when a button is clicked (i.e. recolorMap is called)
- - currently initialized with arbitrary data (initialColoring at line 67). This is so the states can be colored on page load, before any candy button is pressed. How this array is initially set up can/should be changed.
- drawMap (defined at line 90)
- - draws and colors the map based on the provided json file (set at line 120)
- - uses the averageRatings array to color the states
- recolorMap() (defined on line 136)
- - the onClick method for each button (line 132)
- - calls d3.json again to recolor the map. However, this doesn't seem to wrk
- - Note: I wrapped it in another function because if I pass recolorMap with an argument in the .on(), it calls the method on page load before STATEdata arrays are defined (yes, you can use STATEdata above where they aredefined/populated, but only AFTER the page has loaded). Aka, .on('click', recolorMap) is fine, but .on('click', recolorMap(index + 2)) is not. And recolorMap needs an index, unless there's another way to tell it which button was pressed
- assembleRatings() (defined on line 142)
- - creates an array of the average ratings for each state for the selected candy
- - sets averageRatings to this array
- - I haven't actually compared the end result with the data in each STATEdata array, so I don't know for sure if it works correctly, or if I matched the right indices with the right STATEdata arrays
- old code.txt - old code I'm keeping for my own reference

Possible cutoffs for feelings coloring:
- averages would need to be truncated to one decimal place

1.0-1.6 Despair (blue)
1.7-2.3 Meh (Green)
2.4-3.0 Joy (Yellow)

Averages can be found at STATEdata[candy index here][3]
Candy indices go from 2-end in order that they exist in the CSV

Data Sources
Assets/us.json https://github.com/rveciana/d3-composite-projections/tree/master/test/data (https://raw.githubusercontent.com/rveciana/d3-composite-projections/master/test/data/us.json)
-- For more composite projections: https://geoexamples.com/d3-composite-projections/
Assets/states-albers-10m.json https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json
Assets/states-10m.json https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json

Code Sources
// http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
// https://bl.ocks.org/almccon/410b4eb5cad61402c354afba67a878b8

Other code
https://medium.com/@amy.degenaro/introduction-to-digital-cartography-geojson-and-d3-js-c27f066aa84
https://us-svg.herokuapp.com/
https://www.toptal.com/javascript/a-map-to-perfection-using-d3-js-to-make-beautiful-web-maps
https://bl.ocks.org/almccon/410b4eb5cad61402c354afba67a878b8
https://bost.ocks.org/mike/leaflet/
