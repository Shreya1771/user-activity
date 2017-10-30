var w = 550,
    h = 450;

var colorscale = d3.scale.category10();

//Language titles

var LanguageOptions = ['en.wikipedia.org', 'de.wikipedia.org', 'fr.wikipedia.org']
//Options for the Radar chart, other than default
var mycfg = {
    w: w,
    h: h,
    levels: 5,
    ExtraWidthX: 200
};

var d = [];
LanguageOptions.forEach(function(server) {
    d.push([
        {axis: "Edit", value: 0},
        {axis: "Categorize", value: 0},
        {axis: "New", value: 0},
        {axis: "Log", value: 0},
        {axis: "External", value: 0}
    ]);
});

RadarChart.draw("#chart", d, mycfg);

// Initiate Language

var svg = d3.select('#container')
    .selectAll('svg')
    .append('svg')
    .attr("width", w+300)
    .attr("height", h);

//Create the title for the Language
var text = svg.append("text")
    .attr("class", "title")
    .attr('transform', 'translate(90,0)')
    .attr("x", w - 70)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr("fill", "white")
    .text("Wikis");

//Initiate Language	
var Language = svg.append("g")
        .attr("class", "Language")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(90,20)');

//Create colour squares
Language.selectAll('rect')
    .data(LanguageOptions)
    .enter()
    .append("rect")
    .attr("x", w - 65)
    .attr("y", function(d, i){ return i * 20;})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i){ return colorscale(i);});

//Create text next to squares
Language.selectAll('text')
    .data(LanguageOptions)
    .enter()
    .append("text")
    .attr("x", w - 52)
    .attr("y", function(d, i){ return i * 20 + 9;})
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function(d) { return d; });

var title = svg.append("text")
    .attr("class", "header")
    .attr('transform', 'translate(90,0)')
    .attr("x", -90)
    .attr("y", h/20)
    .attr("font-size", "20px")
    .attr("fill", "#d3d3d3")
    .text("Geometries of different Wikipedia");

var title2 = svg.append("text")
    .attr("class", "header")
    .attr("transform", "translate(90,0)")
    .attr("x", -30)
    .attr("y", h/20+20)
    .attr("font-size", "20px")
    .attr("fill", "#d3d3d3")
    .text("language editions, created");

var title3 = svg.append("text")
    .attr("class", "header")
    .attr("transform", "translate(90,0)")
    .attr("x", 58)
    .attr("y", h/20+40)
    .attr("font-size", "20px")
    .attr("fill", "#d3d3d3")
    .text(" by user behavior");

var url = 'https://stream.wikimedia.org/v2/stream/recentchange';
var eventSource = new EventSource(url);
var mapping = {
    "edit": 0,
    "categorize": 1,
    "new": 2,
    "log": 3,
    "external": 4
}

function validateType(type) {
    return (["new", "edit", "categorize", "log", "external"].indexOf(type) >= 0);
}

function filterServer(server) {
    return (LanguageOptions.indexOf(server) >=0);
}

eventSource.onmessage = function (event) {
    var obj = JSON.parse(event.data);
    if(!obj.bot && validateType(obj.type) && filterServer(obj.server_name)) {

        var index = LanguageOptions.indexOf(obj.server_name);
        d[index][mapping[obj.type]].value++;

        RadarChart.update("#chart", d, mycfg);

    }
};
