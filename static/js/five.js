function render(filterByDates) {

queue()
    .defer(d3.json, "/data")
    .await(makeCharts);


function makeCharts(error, recordsJson) {

var parseDate = d3.time.format("%Y-%m-%d").parse;
var data = recordsJson;
var dateForm = d3.time.format("%Y-%m-%d %H:%M:%S");
var dateFormat = d3.time.format("%Y-%m-%d");

data.forEach(function(d) {
    d["date_of_joining"] = dateForm.parse(d["date_of_joining"]);
    d["date_of_run"] = dateFormat.parse(d["date_of_run"]);
    //d["date_of_run"].setHours(0,0,0);
    d["date_of_joining"].setHours(0,0,0);
});




if(filterByDates) {

// d3.select('numberRecordsND').remove();
// d3.select('timeChart').remove();
// d3.select('svg').remove();
// d3.select('timeXChart').remove();
// d3.select('timeYChart').remove();

    var date1 = parseDate(document.getElementById('field1').value);
    var date2 = parseDate(document.getElementById('field2').value);

    data = data.filter(function(d) {
    return d.date_of_run >= date1 && d.date_of_run <= date2;
                    });
    data = data.filter(function(d) {
    return d.date_of_joining >= date1 && d.date_of_joining <= date2;
                    });
        }
var ndx = crossfilter(data);

var fourDim = ndx.dimension(function(d) { return d["date_of_joining"]; }); 
var XDimension = ndx.dimension(function (d) {return d["date_of_run"];});
var range = ndx.dimension(function (d) {return d["date_of_run"];});
var dateDim = ndx.dimension(function (d) {return d["date_of_run"];});
var secDim = ndx.dimension(function(d) { return d["date_of_run"]; }); 
var allDim = ndx.dimension(function(d) {return d;});
    //Group Data
var numRecordsByDate = dateDim.group().reduceCount(function(d) {return d["date_of_run"];})
var all = ndx.groupAll();

var minDate = range.bottom(1)[0]["date_of_run"];
var maxDate = range.top(1)[0]["date_of_run"];

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
  return { };})

var num_unique_ids_by_date = secDim.group()
    .reduce(
    function (p, d) {
        if(d.userid in p.userids) p.userids[d.userid] ++;
        else{
            p.userids[d.userid] = 1;
            p.id_count++;
        }
        return p;
    },

    function (p, d) {
        p.userids[d.userid]--;
        if(p.userids[d.userid] === 0){
            delete p.userids[d.userid];
            p.id_count--;
        }
        return p;
    },

    function () {
            return {userids: {},
            id_count: 0};
        });


var fnum_unique_ids_by_date = fourDim.group()
    .reduce(
    function (p, d) {
        if(d.userid in p.userids) p.userids[d.userid] ++;
        else{
            p.userids[d.userid] = 1;
            p.id_count++;
        }
        return p;
    },

    function (p, d) {
        p.userids[d.userid]--;
        if(p.userids[d.userid] === 0){
            delete p.userids[d.userid];
            p.id_count--;
        }
        return p;
    },

    function () {
            return {userids: {},
            id_count: 0};
        });


var fminDate = fourDim.bottom(1)[0]["date_of_joining"];
var fmaxDate = fourDim.top(1)[0]["date_of_joining"];



var numberRecordsND = dc.numberDisplay("#number-records-nd");
var timeChart = dc.barChart("#time-chart");  //first  
var svg = dc.barChart("#Chart") ; //third
var timeXChart = dc.barChart("#time-chartX");  //second
var timeYChart = dc.barChart("#time-chartY");  //four 

numberRecordsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .group(all);

timeChart
        .width(950)
        .height(300)
        .margins({top: 40, right: 50, bottom: 40, left: 50})
        .dimension(dateDim)
        .xUnits(d3.time.days)
        .group(numRecordsByDate)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("No. Of Runs Daily")
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .renderLabel(true)
      //  .xAxis().ticks(d3.time.days,1)
        .yAxis() 

timeXChart
    .width(950)
    .height(300)
    .margins({top: 40, right: 50,bottom: 40, left: 50})
    .dimension(secDim)
    .xUnits(d3.time.days)
    .group(num_unique_ids_by_date)
    .valueAccessor(function(d){
        return d.value.id_count;
    })
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .elasticY(true)
    .xAxisLabel("Unique Runners Daily")
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true) 
    .renderLabel(true)   
    // .elasticX(true) 
    .yAxis()     

timeYChart
    .width(950)
    .height(300)
    .margins({top: 40, right: 50,bottom: 40, left: 50})
    .dimension(fourDim)
    .group(fnum_unique_ids_by_date)
    .valueAccessor(function(d){
        return d.value.id_count;
    })
    .transitionDuration(500)
    // .x(d3.scale.ordinal().domain(fourDim))
    // .xUnits(dc.units.ordinal)
    .x(d3.time.scale().domain([fminDate, fmaxDate]))
    .xUnits(d3.time.days)
    .xAxisLabel("Newly Registered Users Daily")
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    // .yAxis()
    .renderLabel(true)
    

function sel_stack(valueKey) {
    return function(d){
        return d.value[valueKey];
    };
}

svg
    .width(950)
    .height(300)
    .margins({top: 40, right: 50,bottom: 40, left: 50})
    .dimension(XDimension)
    
    // .stack(YDimension,"10-14",function(d) {return d.value["10-14"];})
    // .stack(YDimension,"14-18",function(d) {return d.value["14-18"];})
    // .stack(YDimension,"18-22",function(d) {return d.value["18-22"];})
    // .stack(YDimension,"22-2",function(d) {return d.value["22-2"];})
    // .stack(YDimension,"2-6",function(d) {return d.value["2-6"];}) 
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xUnits(d3.time.days)

 //    .xUnits(dc.units.ordinal)
 //    .x(d3.scale.ordinal().domain(XDimension))
    .xAxisLabel("Time Of Run Daily")
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .legend(dc.legend().x(100).y(20).gap(5).horizontal(true));

    svg.group(YDimension, "2-6") 
    .valueAccessor(function(d) {return d.value["2-6"];})
    .stack(YDimension,"6-10", sel_stack("6-10"))
    .stack(YDimension, "10-14", sel_stack("10-14"))
    .stack(YDimension, "14-18", sel_stack("14-18"))
    .stack(YDimension, "18-22", sel_stack("18-22"))
    .stack(YDimension, "22-2", sel_stack("22-2"))
    .elasticY(true);
    // svg.renderLabel(true);

    svg.renderlet(function (chart) {

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
    // svg.render();





dc.renderAll();
};
}
render(false);



