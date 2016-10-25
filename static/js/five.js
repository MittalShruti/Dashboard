queue()
.defer(d3.json, "/data2")
.await(makeCharts);

function makeCharts(error, recordsJson) {

var data = recordsJson;
var dateForm = d3.time.format("%Y-%m-%d %H:%M:%S");

data.forEach(function(d) {
    d["timestamp"] = dateForm.parse(d["timestamp"]);
    d["timestamp"].setHours(0,0,0);
});

var ndx = crossfilter(data);

var XDimension = ndx.dimension(function (d) {return d["timestamp"];});


var YDimension = XDimension.group().reduce(
    function reduceAdd(p, d) {
      p[d["running_slot"]] = (p[d["running_slot"]]|| 0) + 1;
      return p;
    },
    function reduceRemove(p, d) {
      p[d["running_slot"]] = (p[d["running_slot"]]|| 0)-1;
      return p;
    },
    function reduceInitial() {
      return {};})


dc.barChart("#Chart")
    .width(3480).height(400)
    .dimension(XDimension)
    .group(YDimension,"6-10",function(d) {return d.value["6-10"];})
    .stack(YDimension,"10-14",function(d) {return d.value["10-14"];})
    .stack(YDimension,"14-18",function(d) {return d.value["14-18"];})
    .stack(YDimension,"18-22",function(d) {return d.value["18-22"];})
    .stack(YDimension,"22-2",function(d) {return d.value["22-2"];})
    .stack(YDimension,"2-6",function(d) {return d.value["2-6"];})    
    .transitionDuration(500)
    .xUnits(dc.units.ordinal)
    .x(d3.scale.ordinal().domain(XDimension)) 
    .renderlet(function (chart) {

    //Check if labels exist
    var gLabels = chart.select(".labels");
    if (gLabels.empty()){
        gLabels = chart.select(".chart-body").append('g').classed('labels', true);
    }

    var gLabelsData = gLabels.selectAll("text").data(chart.selectAll(".bar")[0]);

    gLabelsData.exit().remove(); //Remove unused elements

    gLabelsData.enter().append("text") //Add new elements

    gLabelsData
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .text(function(d){
        text_object =  d3.select(d).datum().y
        console.log(text_object)
        return text_object
    })
    .attr('x', function(d){ 
        return +d.getAttribute('x') + (d.getAttribute('width')/2); 
    })
    .attr('y', function(d){ return +d.getAttribute('y') + 15; })
    .attr('style', function(d){
        if (+d.getAttribute('height') < 18) return "display:none";
    });

})


dc.renderAll();

};


