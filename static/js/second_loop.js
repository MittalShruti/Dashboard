queue()
.defer(d3.json, "/data2")
.await(makeCharts);

function makeCharts(error, recordsJson) {
//Clean data
var records = recordsJson;
var dateForm = d3.time.format("%Y-%m-%d %H:%M:%S");

records.forEach(function(d) {
    d["timestamp"] = dateForm.parse(d["timestamp"]);
    d["timestamp"].setHours(0,0,0);
});

var ndx = crossfilter(records);
var dateDim = ndx.dimension(function(d) { return d["timestamp"]; }); 
var allDim = ndx.dimension(function(d) {return d;});

    //Define values (to be used in charts)
var minDate = dateDim.bottom(1)[0]["timestamp"];
var maxDate = dateDim.top(1)[0]["timestamp"];

var num_unique_ids_by_date = dateDim.group()
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

var all = ndx.groupAll();
var numberRecordsND = dc.numberDisplay("#number-records-nd");
var timeXChart = dc.barChart("#time-chartX");        

numberRecordsND
    .formatNumber(d3.format("d"))
    .valueAccessor(function(d){return d; })
    .group(all);

timeXChart
    .width(1550)
    .height(440)
    .margins({top: 10, right: 50,bottom: 30, left: 50})
    .dimension(dateDim)
    .group(num_unique_ids_by_date)
    .valueAccessor(function(d){
        return d.value.id_count;
    })
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .elasticY(true)
    // .elasticX(true) 
    .xAxisLabel("Date_of_Run")
    .yAxis();      

dc.renderAll();
};



