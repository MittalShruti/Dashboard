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
    d["running_slot"]=+d["running_slot"];
});


var ndx = crossfilter(data);

//XDimension has each unique 'date_of_run' 

var XDimension = ndx.dimension(function (d) {return d["date_of_run"];});
var allDim = ndx.dimension(function(d) {return d;});
    //Group Data

var all = ndx.groupAll();

var YDimension = XDimension.group()
    .reduce(
function reduceAdd(p, d) {
  p[d.running_slot] = (p[d.running_slot]|| 0) + 1;
  return p;
},
function reduceRemove(p, d) {
  p[d.running_slot] = (p[d.running_slot]|| 0)-1;
  return p;
},
function reduceInitial() {
  return {};
});

function sel_stack(i) {
              return function(d) {
                  return d.value[i];
              };
          }


var minDate = XDimension.bottom(1)[0]["date_of_run"];
var maxDate = XDimension.top(1)[0]["date_of_run"];

var chart = dc.barChart("#test");

chart
              .width(768)
              .height(480)

              .x(d3.time.scale().domain([minDate,maxDate]))
              .margins({left: 80, top: 20, right: 10, bottom: 20})
              .brushOn(false)
              .clipPadding(10)
              .title(function(d) {
                  return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
              })
              .dimension(XDimension)
              .group(YDimension, "1", sel_stack('1'))
              .renderLabel(true);
          chart.legend(dc.legend());
          dc.override(chart, 'legendables', function() {
              var items = chart._legendables();
              return items.reverse();
          });
          for(var i = 2; i<7; ++i)
              chart.stack(YDimension, ''+i, sel_stack(i));
          chart.render();
    
}
