var experiments = [
    { State_Name: "AL", Age_19_Under: 26.9, Age_19_64: 62.3, Age_65_84: 9.8, Age_85_and_Over: 0.9 },
    { State_Name: "AL", Age_19_Under: 23.5, Age_19_64: 60.3, Age_65_84: 14.5, Age_85_and_Over: 1.8 },
    { State_Name: "NW", Age_19_Under: 24.3, Age_19_64: 62.5, Age_65_84: 11.6, Age_85_and_Over: 1.6 },
    { State_Name: "NW", Age_19_Under: 24.6, Age_19_64: 63.3, Age_65_84: 10.9, Age_85_and_Over: 1.2 },
    { State_Name: "BR", Age_19_Under: 24.5, Age_19_64: 62.1, Age_65_84: 12.1, Age_85_and_Over: 1.3 },
    { State_Name: "BR", Age_19_Under: 24.7, Age_19_64: 63.2, Age_65_84: 10.0, Age_85_and_Over: 2.2 },
    { State_Name: "GH", Age_19_Under: 25.6, Age_19_64: 58.5, Age_65_84: 13.6, Age_85_and_Over: 2.4 },
    { State_Name: "GH", Age_19_Under: 24.1, Age_19_64: 61.6, Age_65_84: 12.7, Age_85_and_Over: 1.5 },
    { State_Name: "KS", Age_19_Under: 24.8, Age_19_64: 59.5, Age_65_84: 13.5, Age_85_and_Over: 2.2 },
];

var ndx = crossfilter(experiments);

var stateDim = ndx.dimension(function (d) { return d.State_Name; });
var age19UnderGroup = stateDim.group().reduceSum(function (d) { return d.Age_19_Under; });
var age19To64Group = stateDim.group().reduceSum(function (d) { return d.Age_19_64; });
var age65To84Group = stateDim.group().reduceSum(function (d) { return d.Age_65_84; });
var age85AndOverGroup = stateDim.group().reduceSum(function (d) { return d.Age_85_and_Over; });

var stackedBarChart = dc.barChart("#chart-row-Poverty1");

stackedBarChart
    .dimension(stateDim)
    .group(age19UnderGroup)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .stack(age19To64Group)
    .stack(age65To84Group)
    .stack(age85AndOverGroup)
;

dc.renderAll();


// queue()
// .defer(d3.json, "/data2")
// .await(makeCharts);

// //var data = [{Category: "A", ID: "1A"}, {Category: "A", ID: "1A"}, {Category: "A", ID: "1A"}, {Category: "A", ID: "2B"}, {Category: "A", ID: "2B"}, {Category: "B", ID: "1A"}, {Category: "B", ID: "1A"}, {Category: "B", ID: "1A"}, {Category: "B", ID: "2B"}, {Category: "B", ID: "3C"}, {Category: "B", ID: "3C"}, {Category: "B", ID: "3C"}, {Category: "B", ID: "4D"}, {Category: "C", ID: "1A"}, {Category: "C", ID: "2B"}, {Category: "C", ID: "3C"}, {Category: "C", ID: "4D"}, {Category: "C", ID: "4D"}, {Category: "C", ID: "5E"}];
// function makeCharts(error, recordsJson) {
// var records = recordsJson;
// var dateForm = d3.time.format("%Y-%m-%d %H:%M:%S");

// records.forEach(function(d) {
//     d["timestamp"] = dateForm.parse(d["timestamp"]);
//     d["timestamp"].setHours(0,0,0);
// });

// var ndx = crossfilter(records);

// // var XDimension = ndx.dimension(function (d) {return d.Category;});
// var XDimension = ndx.dimension(function (d) {return d["timestamp"];});


// var YDimension = XDimension.group().reduce(
//     function reduceAdd(p, d) {
//       p[d.running_slot] = (p[d.running_slot]|| 0) + 1;
//       return p;
//     },
//     function reduceRemove(p, d) {
//       p[d.running_slot] = (p[d.running_slot]|| 0) -1;
//       return p;
//     },
//     function reduceInitial() {
//       return {};})


// dc.barChart("#Chart")
//     .width(480).height(300)
//     .dimension(XDimension)
//     .group(YDimension,"6-10",function(d) {return d.value["6-10"];})
//     .stack(YDimension,"10-14",function(d) {return d.value["10-14"];})
//     .stack(YDimension,"14-18",function(d) {return d.value["14-18"];})
//     .stack(YDimension,"18-22",function(d) {return d.value["18-22"];})
//     .stack(YDimension,"22-2",function(d) {return d.value["22-2"];})
//     .stack(YDimension,"2-6",function(d) {return d.value["2-6"];})
//     .transitionDuration(500)
//     .xUnits(dc.units.ordinal)
//     .x(d3.scale.ordinal().domain(XDimension))
//     .renderlet(function (chart) {

//     //Check if labels exist
//     var gLabels = chart.select(".labels");
//     if (gLabels.empty()){
//         gLabels = chart.select(".chart-body").append('g').classed('labels', true);
//     }

//     var gLabelsData = gLabels.selectAll("text").data(chart.selectAll(".bar")[0]);

//     gLabelsData.exit().remove(); //Remove unused elements

//     gLabelsData.enter().append("text") //Add new elements

//     gLabelsData
//     .attr('text-anchor', 'middle')
//     .attr('fill', 'white')
//     .text(function(d){
//         text_object =  d3.select(d).data()[0].data.value
//         return text_object
//     })
//     .attr('x', function(d){ 
//         return +d.getAttribute('x') + (d.getAttribute('width')/2); 
//     })
//     .attr('y', function(d){ return +d.getAttribute('y') + 15; })
//     .attr('style', function(d){
//         if (+d.getAttribute('height') < 18) return "display:none";
//     });

// })


// dc.renderAll();

// };





