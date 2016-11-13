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
var XpDimension = ndx.dimension(function (d) {return d["date_of_run"];});
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
  return { //p["6-10"]:0, p["10-14"]:0, p["14-18"]:0, p["18-22"]:0, p["22-2"]:0, p["2-6"]:0 
  "6-10" : 0 , "10-14":0, "14-18":0, "18-22":0, "22-2":0, "2-6":0
};})

var YpDimension = XpDimension.group().reduce(
function reduceAdd(p, d) {
  p[d["running_slot"]] = (p[d["running_slot"]]|| 0) + 1;
  p["6-10"] = p["6-10"]*100/(p["6-10"]+p["10-14"]+p["14-18"]+p["18-22"]+p["22-2"]+p["2-6"]);
  p["10-14"] = p["10-14"]*100/(p["6-10"]+p["10-14"]+p["14-18"]+p["18-22"]+p["22-2"]+p["2-6"]);
  p["14-18"] = p["14-18"]*100/(p["6-10"]+p["10-14"]+p["14-18"]+p["18-22"]+p["22-2"]+p["2-6"]);
  p["18-22"] = p["18-22"]*100/(p["6-10"]+p["10-14"]+p["14-18"]+p["18-22"]+p["22-2"]+p["2-6"]);
  p["22-2"] = p["22-2"]*100/(p["6-10"]+p["10-14"]+p["14-18"]+p["18-22"]+p["22-2"]+p["2-6"]); 
  p["2-6"] = p["2-6"]*100/(p["6-10"]+p["10-14"]+p["14-18"]+p["18-22"]+p["22-2"]+p["2-6"]); 
  return p;
},
function reduceRemove(p, d) {
  p[d["running_slot"]] = (p[d["running_slot"]]|| 0)-1;
  return p;
},
function reduceInitial() {
  return {  
  "6-10" : 0 , "10-14":0, "14-18":0, "18-22":0, "22-2":0, "2-6":0
};})


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



// console.log(ndmonth);


// console.log(ndweek);


var numberRecordsND = dc.numberDisplay("#number-records-nd");
var timeChart = dc.barChart("#time-chart");  //first  
var svg = dc.barChart("#Chart") ; //third
var timeXChart = dc.barChart("#time-chartX");  //second
var timeYChart = dc.barChart("#time-chartY");  //four 
//var timepercent = dc.barChart("#percent-chart") ;


newdate1 = new Date(maxDate);
newdate1.setDate(newdate1.getDate() - 7);
ndweek = new Date(newdate1);

newdate = new Date(fmaxDate);
newdate.setDate(newdate.getDate() - 7);
fndweek = new Date(newdate) ;


numberRecordsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .group(all);

timeChart
//        .width(1270)
        .height(300)
        .margins({top: 80, right: 80, bottom: 40, left: 50})
        .dimension(dateDim)
        .xUnits(d3.time.days)
        .group(numRecordsByDate)
        .transitionDuration(500)
        .x(d3.time.scale().domain([ndweek, maxDate]))
        .elasticY(true)
        .xAxisLabel("No. Of Runs Daily")
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .renderLabel(true)
        .brushOn(false)
        .title(function(d) {
            return (new Date(d.key).toDateString()) + ': ' + d.value;
    })
      //  .xAxis().ticks(d3.time.days,1)
        .yAxis() 

timeXChart
//    .width(1270)
    .height(300)
    .margins({top: 80, right: 80,bottom: 40, left: 50})
    .dimension(secDim)
    .xUnits(d3.time.days)
    .group(num_unique_ids_by_date)
    .valueAccessor(function(d){
        return d.value.id_count;
    })
    .transitionDuration(500)
    .x(d3.time.scale().domain([ndweek, maxDate]))
    .elasticY(true)
    .xAxisLabel("Unique Runners Daily")
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true) 
    .renderLabel(true) 
    .brushOn(false)
    .title(function(d) {
        return (new Date(d.key).toDateString()) + ': ' + d.value.id_count;
    })  
    // .elasticX(true) 
    .yAxis()     

timeYChart
    .height(300)
    .margins({top: 80, right: 80,bottom: 40, left: 50})
    .dimension(fourDim)
    .group(fnum_unique_ids_by_date)
    .valueAccessor(function(d){
        return d.value.id_count;
    })
    .transitionDuration(500)
    .x(d3.time.scale().domain([fndweek, fmaxDate]))
    .xUnits(d3.time.days)
    .elasticY(true)
    .xAxisLabel("Newly Registered Users Daily")
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .brushOn(false)
    .title(function(d) {
        return (new Date(d.key).toDateString()) + ': ' + d.value.id_count;
    })
    .renderLabel(true);
    
    

svg
    .height(300)
    .margins({top: 80, right: 80,bottom: 40, left: 50})
    .dimension(XDimension)
    .transitionDuration(500)
    .x(d3.time.scale().domain([ndweek, maxDate]))
    .xUnits(d3.time.days)
    .xAxisLabel("Time Of Run Daily")
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .legend(dc.legend().x(100).y(20).gap(5).horizontal(true))
    .brushOn(false)
    .clipPadding(10)
    .title(function(d) {
        return (new Date(d.key).toDateString()) + '[' + this.layer + ']: ' + d.value[this.layer];
    })
    svg.group(YDimension, "6-10") 
    .valueAccessor(function(d) {return d.value["6-10"];})
    .stack(YDimension,"10-14",function(d) {return d.value["10-14"];})
    .stack(YDimension,"14-18",function(d) {return d.value["14-18"];})
    .stack(YDimension,"18-22",function(d) {return d.value["18-22"];})
    .stack(YDimension,"22-2",function(d) {return d.value["22-2"];})
    .stack(YDimension,"2-6",function(d) {return d.value["2-6"];}) 
    .elasticY(true);
    svg.renderLabel(true);


// timepercent    
//     .width(950)
//     .height(500)
//     .margins({top: 80, right: 80,bottom: 40, left: 50})
//     .dimension(XpDimension)
//     .transitionDuration(500)
//     .x(d3.time.scale().domain([minDate, maxDate]))
//     .xUnits(d3.time.days)
//     .xAxisLabel("Time Of Run Daily (%age-wise split)")
//     .renderHorizontalGridLines(true)
//     .renderVerticalGridLines(true)
//     .legend(dc.legend().x(100).y(10).gap(5).horizontal(true))
//     .brushOn(false)
//     .clipPadding(10)
//     .title(function(d) {
//         return (new Date(d.key).toDateString()) + '[' + this.layer + ']: ' + d.value[this.layer]+'%';
//     })
//     timepercent.group(YpDimension, "6-10") 
//     .valueAccessor(function(d) {return d.value["6-10"];})
//     .stack(YpDimension,"10-14",function(d) {return d.value["10-14"];})
//     .stack(YpDimension,"14-18",function(d) {return d.value["14-18"];})
//     .stack(YpDimension,"18-22",function(d) {return d.value["18-22"];})
//     .stack(YpDimension,"22-2",function(d) {return d.value["22-2"];})
//     .stack(YpDimension,"2-6",function(d) {return d.value["2-6"];}) 
//     .elasticY(true);
    // timepercent.renderLabel(true);


dc.renderAll();


$('#week_button').on('click', function(){



timeChart.x(d3.time.scale().domain([ndweek,maxDate]));
svg.x(d3.time.scale().domain([ndweek, maxDate]));
timeXChart.x(d3.time.scale().domain([ndweek, maxDate]));
timeYChart.x(d3.time.scale().domain([fndweek, maxDate]));
dc.redrawAll();
});



$('#month_button').on('click', function(){

newdate1 = new Date(maxDate);
newdate1.setDate(newdate1.getDate() - 30);
ndmonth = new Date(newdate1);

newdate = new Date(fmaxDate);
newdate.setDate(newdate.getDate() - 30);
fndmonth = new Date(newdate) ;

timeChart.x(d3.time.scale().domain([ndmonth,maxDate]));
svg.x(d3.time.scale().domain([ndmonth, maxDate]));
timeXChart.x(d3.time.scale().domain([ndmonth, maxDate]));
timeYChart.x(d3.time.scale().domain([fndmonth, maxDate]));
dc.redrawAll();
});

$('#reset_button').on('click', function(){

timeChart.x(d3.time.scale().domain([minDate,maxDate]));
svg.x(d3.time.scale().domain([minDate, maxDate]));
timeXChart.x(d3.time.scale().domain([minDate, maxDate]));
timeYChart.x(d3.time.scale().domain([fminDate, maxDate]));
dc.redrawAll();
});

};
}
render(false);



