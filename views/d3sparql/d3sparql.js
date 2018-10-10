//
// d3sparql.js - utilities for visualizing SPARQL results with the D3 library
//
//   Web site: http://github.com/ktym/d3sparql/
//   Copyright: 2013-2015 (C) Toshiaki Katayama (ktym@dbcls.jp)
//   License: BSD license (same as D3.js)
//   Initial version: 2013-01-28
//


///TODO: This file is just copy of the released lib which is not complete by itself. should be clear more

var d3sparql = {
  version: "d3sparql.js version 2015-11-19",
  debug: false // set to true for showing debug information
}

/*
  Execute a SPARQL query and pass the result to a given callback function

  Synopsis:
    <!DOCTYPE html>
    <meta charset="utf-8">
    <html>
     <head>
      <script src="http://d3js.org/d3.v3.min.js"></script>
      <script src="d3sparql.js"></script>
      <script>
       function exec() {
         var endpoint = d3.select("#endpoint").property("value")
         var sparql = d3.select("#sparql").property("value")
         d3sparql.query(endpoint, sparql, render)
       }
       function render(json) {
         // set options and call the d3sparql.xxxxx visualization methods in this library ...
         var config = {
          "margin": {"top": 10, "right": 10, "bottom": 10, "left": 10},
          "selector": "#result",
          ...
         }
         d3sparql.xxxxx(json, config)
       }
      </script>
      <style>
      <!-- customize CSS -->
      </style>
     </head>
     <body onload="exec()">
      <form style="display:none">
       <input id="endpoint" value="http://dbpedia.org/sparql" type="text">
       <textarea id="sparql">
        PREFIX ...
        SELECT ...
        WHERE { ... }
       </textarea>
      </form>
      <div id="result"></div>
     </body>
    </html>
*/
d3sparql.query = function(endpoint, sparql, callback) {

  var url = document.URL.split("analyticsLink")[0] +
    'fuseki/dataset/sparql' + "?query=" +
    encodeURIComponent(sparql) + '&output=json';
  if (d3sparql.debug) {
    console.log(endpoint)
  }
  if (d3sparql.debug) {
    console.log(url)
  }
  var mime = "application/sparql-results+json"
  d3.xhr(url, mime, function(request) {
    var json = request.responseText
    if (d3sparql.debug) {
      console.log(json);
    }
    callback(JSON.parse(json))
  })
/*
  d3.json(url, function(error, json) {
    if (d3sparql.debug) { console.log(error) }
    if (d3sparql.debug) { console.log(json) }
    callback(json)
  })
*/
}

/*
  Convert sparql-results+json object into a JSON graph in the {"nodes": [], "links": []} form.
  Suitable for d3.layout.force(), d3.layout.sankey() etc.

  Options:
    config = {
      "key1":   "node1",       // SPARQL variable name for node1 (optional; default is the 1st variable)
      "key2":   "node2",       // SPARQL variable name for node2 (optional; default is the 2nd varibale)
      "label1": "node1label",  // SPARQL variable name for the label of node1 (optional; default is the 3rd variable)
      "label2": "node2label",  // SPARQL variable name for the label of node2 (optional; default is the 4th variable)
      "value1": "node1value",  // SPARQL variable name for the value of node1 (optional; default is the 5th variable)
      "value2": "node2value"   // SPARQL variable name for the value of node2 (optional; default is the 6th variable)
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.forcegraph(json, config)
      d3sparql.sankey(json, config)
    }

  TODO:
    Should follow the convention in the miserables.json https://gist.github.com/mbostock/4062045 to contain group for nodes and value for edges.
*/
d3sparql.graph = function(json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings

  var opts = {
    "key1": config.key1 || head[0] || "key1",
    "key2": config.key2 || head[1] || "key2",
    "label1": config.label1 || head[2] || false,
    "label2": config.label2 || head[3] || false,
    "value1": config.value1 || head[4] || false,
    "value2": config.value2 || head[5] || false,
  }
  var graph = {
    "nodes": [],
    "links": []
  }
  var check = d3.map()
  var index = 0
  for (var i = 0; i < data.length; i++) {
    var key1 = data[i][opts.key1].value
    var key2 = data[i][opts.key2].value
    var label1 = opts.label1 ? data[i][opts.label1].value : key1
    var label2 = opts.label2 ? data[i][opts.label2].value : key2
    var value1 = opts.value1 ? data[i][opts.value1].value : false
    var value2 = opts.value2 ? data[i][opts.value2].value : false
    if (!check.has(key1)) {
      graph.nodes.push({
        "key": key1,
        "label": label1,
        "value": value1
      })
      check.set(key1, index)
      index++
    }
    if (!check.has(key2)) {
      graph.nodes.push({
        "key": key2,
        "label": label2,
        "value": value2
      })
      check.set(key2, index)
      index++
    }
    graph.links.push({
      "source": check.get(key1),
      "target": check.get(key2)
    })
  }
  if (d3sparql.debug) {
    console.log(JSON.stringify(graph))
  }
  return graph
}

/*
  Convert sparql-results+json object into a JSON tree of {"name": name, "value": size, "children": []} format like in the flare.json file.

  Suitable for d3.layout.hierarchy() family
    * cluster:    d3sparql.dendrogram()
    * pack:       d3sparql.circlepack()
    * partition:  d3sparql.sunburst()
    * tree:       d3sparql.roundtree()
    * treemap:    d3sparql.treemap(), d3sparql.treemapzoom()

  Options:
    config = {
      "root":   "root_name",    // SPARQL variable name for root node (optional; default is the 1st variable)
      "parent": "parent_name",  // SPARQL variable name for parent node (optional; default is the 2nd variable)
      "child":  "child_name",   // SPARQL variable name for child node (ptional; default is the 3rd variable)
      "value":  "value_name"    // SPARQL variable name for numerical value of the child node (optional; default is the 4th variable or "value")
    }

  Synopsis:
    d3sparql.sparql(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.roundtree(json, config)
      d3sparql.dendrogram(json, config)
      d3sparql.sunburst(json, config)
      d3sparql.treemap(json, config)
      d3sparql.treemapzoom(json, config)
    }
*/
d3sparql.tree = function(json, config) {
  config = config || {}
  console.log(json);
  var head = json.head.vars;
  var data = json.results.bindings;

  var opts = {
    "root": config.root || head[0],
    "parent": config.parent || head[1],
    "child": config.child || head[2],
    "value": config.value || head[3] || "value",
  }

  var pair = d3.map();
  var size = d3.map();
  var root = data[0][opts.root].value;
  var parent = child = children = true;
  for (var i = 0; i < data.length; i++) {
    parent = data[i][opts.parent].value;
    child = data[i][opts.child].value;
    if (parent != child) {
      if (pair.has(parent)) {
        children = pair.get(parent);
        children.push(child);
      } else {
        children = [child];
      }
      pair.set(parent, children);
      if (data[i][opts.value]) {
        size.set(child, data[i][opts.value].value);
      }
    }
  }

  function traverse(node) {
    var list = pair.get(node)
    if (list) {
      var children = list.map(function(d) {
        return traverse(d)
      })
      // sum of values of children
      var subtotal = d3.sum(children, function(d) {
        return d.value
      })
      // add a value of parent if exists
      var total = d3.sum([subtotal, size.get(node)])
      return {
        "name": node,
        "children": children,
        "value": total
      }
    } else {
      return {
        "name": node,
        "value": size.get(node) || 1
      }
    }
  }
  var tree = traverse(root)

  if (d3sparql.debug) {
    console.log(JSON.stringify(tree))
  }
  return tree
}

/*
  Rendering sparql-results+json object containing multiple rows into a HTML table

  Options:
    config = {
      "selector": "#result"
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.htmltable(json, config)
    }

  CSS:
    <style>
    table {
      margin: 10px;
    }
    th {
      background: #eeeeee;
    }
    th:first-letter {
       text-transform: capitalize;
    }
    </style>
*/
d3sparql.htmltable = function(json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings

  var opts = {
    "selector": config.selector || null
  }

  var table = d3sparql.select(opts.selector, "htmltable").append("table").attr(
    "class", "table table-bordered")
  var thead = table.append("thead")
  var tbody = table.append("tbody")
  thead.append("tr")
    .selectAll("th")
    .data(head)
    .enter()
    .append("th")
    .text(function(col) {
      return col
    })
  var rows = tbody.selectAll("tr")
    .data(data)
    .enter()
    .append("tr")
  var cells = rows.selectAll("td")
    .data(function(row) {
      return head.map(function(col) {
        return row[col].value
      })
    })
    .enter()
    .append("td")
    .text(function(val) {
      return val
    })

  // default CSS
  table.style({
    "margin": "10px"
  })
  table.selectAll("th").style({
    "background": "#eeeeee",
    "text-transform": "capitalize",
  })
}

/*
  Rendering sparql-results+json object containing one row into a HTML table

  Options:
    config = {
      "selector": "#result"
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.htmlhash(json, config)
    }

  CSS:
    <style>
    table {
      margin: 10px;
    }
    th {
      background: #eeeeee;
    }
    th:first-letter {
       text-transform: capitalize;
    }
    </style>
*/
d3sparql.htmlhash = function(json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings[0]
  var opts = {
    "selector": config.selector || null
  }

  var table = d3sparql.select(opts.selector, "htmlhash").append("table").attr(
    "class", "table table-bordered")
  var tbody = table.append("tbody")
  var row = tbody.selectAll("tr")
    .data(function() {
      return head.map(function(col) {
        return {
          "head": col,
          "data": data[col].value
        }
      })
    })
    .enter()
    .append("tr")
  row.append("th")
    .text(function(d) {
      return d.head
    })
  row.append("td")
    .text(function(d) {
      return d.data
    })

  // default CSS
  table.style({
    "margin": "10px"
  })
  table.selectAll("th").style({
    "background": "#eeeeee",
    "text-transform": "capitalize",
  })
}

/*
  Rendering sparql-results+json object into a bar chart

  References:
    http://bl.ocks.org/mbostock/3885304
    http://bl.ocks.org/mbostock/4403522

  Options:
    config = {
      "label_x":  "Prefecture",  // label for x-axis (optional; default is same as var_x)
      "label_y":  "Area",        // label for y-axis (optional; default is same as var_y)
      "var_x":    "pref",        // SPARQL variable name for x-axis (optional; default is the 1st variable)
      "var_y":    "area",        // SPARQL variable name for y-axis (optional; default is the 2nd variable)
      "width":    850,           // canvas width (optional)
      "height":   300,           // canvas height (optional)
      "margin":   40,            // canvas margin (optional)
      "selector": "#result"
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.barchart(json, config)
    }

  CSS/SVG:
    <style>
    .bar {
      fill: steelblue;
    }
    .bar:hover {
      fill: brown;
    }
    .axis {
      font: 10px sans-serif;
    }
    .axis path,
    .axis line {
      fill: none;
      stroke: #000000;
      shape-rendering: crispEdges;
    }
    .x.axis path {
      display: none;
    }
    </style>
*/
d3sparql.barchart = function(json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings

  var opts = {
    "label_x": config.label_x || head[0],
    "label_y": config.label_y || head[1],
    "var_x": config.var_x || head[0],
    "var_y": config.var_y || head[1],
    "width": config.width || 750,
    "height": config.height || 300,
    "margin": config.margin || 80, // TODO: to make use of {top: 10, right: 10, bottom: 80, left: 80}
    "selector": config.selector || null
  }

  var scale_x = d3.scale.ordinal().rangeRoundBands([0, opts.width - opts.margin],
    0.1)
  var scale_y = d3.scale.linear().range([opts.height - opts.margin, 0])
  var axis_x = d3.svg.axis().scale(scale_x).orient("bottom")
  var axis_y = d3.svg.axis().scale(scale_y).orient("left") // .ticks(10, "%")
  scale_x.domain(data.map(function(d) {
    return d[opts.var_x].value
  }))
  scale_y.domain(d3.extent(data, function(d) {
    return parseInt(d[opts.var_y].value)
  }))

  var svg = d3sparql.select(opts.selector, "barchart").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height)
    //    .append("g")
    //    .attr("transform", "translate(" + opts.margin + "," + 0 + ")")

  var ax = svg.append("g")
    .attr("class", "axis x")
    .attr("transform", "translate(" + opts.margin + "," + (opts.height - opts
        .margin) + ")")
    .call(axis_x)
  var ay = svg.append("g")
    .attr("class", "axis y")
    .attr("transform", "translate(" + opts.margin + ",0)")
    .call(axis_y)
  var bar = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("transform", "translate(" + opts.margin + "," + 0 + ")")
    .attr("class", "bar")
    .attr("x", function(d) {
      return scale_x(d[opts.var_x].value)
    })
    .attr("width", scale_x.rangeBand())
    .attr("y", function(d) {
      return scale_y(d[opts.var_y].value)
    })
    .attr("height", function(d) {
      return opts.height - scale_y(parseInt(d[opts.var_y].value)) - opts.margin
    })
  /*
      .call(function(e) {
        e.each(function(d) {
          console.log(parseInt(d[opts.var_y].value))
        })
      })
  */
  ax.selectAll("text")
    .attr("dy", ".35em")
    .attr("x", 10)
    .attr("y", 0)
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start")
  ax.append("text")
    .attr("class", "label")
    .text(opts.label_x)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + ((opts.width - opts.margin) / 2) + "," +
      (opts.margin - 5) + ")")
  ay.append("text")
    .attr("class", "label")
    .text(opts.label_y)
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (opts.height / 2))
    .attr("y", 0 - (opts.margin - 20))

  // default CSS/SVG
  bar.attr({
    "fill": "steelblue",
  })
  svg.selectAll(".axis").attr({
    "stroke": "black",
    "fill": "none",
    "shape-rendering": "crispEdges",
  })
  svg.selectAll("text").attr({
    "stroke": "none",
    "fill": "black",
    "font-size": "8pt",
    "font-family": "sans-serif",
  })
}

/*
  Rendering sparql-results+json object into a pie chart

  References:
    http://bl.ocks.org/mbostock/3887235 Pie chart
    http://bl.ocks.org/mbostock/3887193 Donut chart

  Options:
    config = {
      "label":    "pref",    // SPARQL variable name for slice label (optional; default is the 1st variable)
      "size":     "area",    // SPARQL variable name for slice value (optional; default is the 2nd variable)
      "width":    700,       // canvas width (optional)
      "height":   600,       // canvas height (optional)
      "margin":   10,        // canvas margin (optional)
      "hole":     50,        // radius size of a center hole (optional; 0 for pie, r > 0 for doughnut)
      "selector": "#result"
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.piechart(json, config)
    }

  CSS/SVG:
    <style>
    .label {
      font: 10px sans-serif;
    }
    .arc path {
      stroke: #ffffff;
    }
    </style>
*/
d3sparql.piechart = function(json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings

  var opts = {
    "label": config.label || head[0],
    "size": config.size || head[1],
    "width": config.width || 700,
    "height": config.height || 700,
    "margin": config.margin || 10,
    "hole": config.hole || 100,
    "selector": config.selector || null
  }

  var radius = Math.min(opts.width, opts.height) / 2 - opts.margin
  var hole = Math.max(Math.min(radius - 50, opts.hole), 0)
  var color = d3.scale.category20()

  var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(hole)

  var pie = d3.layout.pie()
    //.sort(null)
    .value(function(d) {
      return d[opts.size].value
    })

  var svg = d3sparql.select(opts.selector, "piechart").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height)
    .append("g")
    .attr("transform", "translate(" + opts.width / 2 + "," + opts.height / 2 +
      ")")

  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc")
  var slice = g.append("path")
    .attr("d", arc)
    .attr("fill", function(d, i) {
      return color(i)
    })
  var text = g.append("text")
    .attr("class", "label")
    .attr("transform", function(d) {
      return "translate(" + arc.centroid(d) + ")"
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d.data[opts.label].value
    })

  // default CSS/SVG
  slice.attr({
    "stroke": "#ffffff",
  })
  // TODO: not working?
  svg.selectAll("text").attr({
    "stroke": "none",
    "fill": "black",
    "font-size": "20px",
    "font-family": "sans-serif",
  })
}

/*
  Rendering sparql-results+json object into a scatter plot

  References:
    http://bl.ocks.org/mbostock/3244058

  Options:
    config = {
      "label_x":  "Size",    // label for x-axis (optional; default is same as var_x)
      "label_y":  "Count",   // label for y-axis (optional; default is same as var_y)
      "var_x":    "size",    // SPARQL variable name for x-axis values (optional; default is the 1st variable)
      "var_y":    "count",   // SPARQL variable name for y-axis values (optional; default is the 2nd variable)
      "var_r":    "volume",  // SPARQL variable name for radius (optional; default is the 3rd variable)
      "min_r":    1,         // minimum radius size (optional; default is 1)
      "max_r":    20,        // maximum radius size (optional; default is 20)
      "width":    850,       // canvas width (optional)
      "height":   300,       // canvas height (optional)
      "margin_x": 80,        // canvas margin x (optional)
      "margin_y": 40,        // canvas margin y (optional)
      "selector": "#result"
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.scatterplot(json, config)
    }

  CSS/SVG:
    <style>
    .label {
      font-size: 10pt;
    }
    .node circle {
      stroke: black;
      stroke-width: 1px;
      fill: pink;
      opacity: 0.5;
    }
    </style>
*/
d3sparql.scatterplot = function(json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings

  var opts = {
    "label_x": config.label_x || head[0],
    "label_y": config.label_y || head[1],
    "var_x": config.var_x || head[0],
    "var_y": config.var_y || head[1],
    "var_r": config.var_r || head[2] || 5,
    "min_r": config.min_r || 1,
    "max_r": config.max_r || 20,
    "width": config.width || 850,
    "height": config.height || 300,
    "margin_x": config.margin_x || 80,
    "margin_y": config.margin_y || 40,
    "selector": config.selector || null
  }

  var extent_x = d3.extent(data, function(d) {
    return parseInt(d[opts.var_x].value)
  })
  var extent_y = d3.extent(data, function(d) {
    return parseInt(d[opts.var_y].value)
  })
  var extent_r = d3.extent(data, function(d) {
    return parseInt(d[opts.var_r].value)
  })
  var scale_x = d3.scale.linear().range([opts.margin_x, opts.width - opts.margin_x])
    .domain(extent_x)
  var scale_y = d3.scale.linear().range([opts.height - opts.margin_y, opts.margin_y])
    .domain(extent_y)
  var scale_r = d3.scale.linear().range([opts.min_r, opts.max_r]).domain(
    extent_r)
  var axis_x = d3.svg.axis().scale(scale_x)
  var axis_y = d3.svg.axis().scale(scale_y).orient("left")

  var svg = d3sparql.select(opts.selector, "scatterplot").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height)
  var circle = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("cx", function(d) {
      return scale_x(d[opts.var_x].value)
    })
    .attr("cy", function(d) {
      return scale_y(d[opts.var_y].value)
    })
    .attr("r", function(d) {
      return scale_r(d[opts.var_r].value)
    })
  var ax = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (opts.height - opts.margin_y) + ")")
    .call(axis_x)
  var ay = svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + opts.margin_x + ",0)")
    .call(axis_y)
  ax.append("text")
    .attr("class", "label")
    .text(opts.label_x)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + ((opts.width - opts.margin_x) / 2) +
      "," + (opts.margin_y - 5) + ")")
  ay.append("text")
    .attr("class", "label")
    .text(opts.label_y)
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (opts.height / 2))
    .attr("y", 0 - (opts.margin_x - 20))

  // default CSS/SVG
  ax.attr({
    "stroke": "black",
    "fill": "none",
  })
  ay.attr({
    "stroke": "black",
    "fill": "none",
  })
  circle.attr({
    "stroke": "gray",
    "stroke-width": "1px",
    "fill": "lightblue",
    "opacity": 0.5,
  })
  //svg.selectAll(".label")
  svg.selectAll("text").attr({
    "stroke": "none",
    "fill": "black",
    "font-size": "8pt",
    "font-family": "sans-serif",
  })
}

/*
  Rendering sparql-results+json object into a force graph

  References:
    http://bl.ocks.org/mbostock/4062045

  Options:
    config = {
      "radius":   12,        // static value or a function to calculate radius of nodes (optional)
      "charge":   -250,      // force between nodes (optional; negative: repulsion, positive: attraction)
      "distance": 30,        // target distance between linked nodes (optional)
      "width":    1000,      // canvas width (optional)
      "height":   500,       // canvas height (optional)
      "label":    "name",    // SPARQL variable name for node labels (optional)
      "selector": "#result"
      // options for d3sparql.graph() can be added here ...
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.forcegraph(json, config)
    }

  CSS/SVG:
    <style>
    .link {
      stroke: #999999;
    }
    .node {
      stroke: black;
      opacity: 0.5;
    }
    circle.node {
      stroke-width: 1px;
      fill: lightblue;
    }
    text.node {
      font-family: "sans-serif";
      font-size: 8px;
    }
    </style>

  TODO:
    Try other d3.layout.force options.
*/

//My replaced function:

d3sparql.forcegraph = function(query) {

  var nodes = [],
    edges = [];


  // Get the word after hash char of a string
  function trimHash(str) {
    if (str.includes("#")) {
      var n = str.split('#');
      ;
      var p = n[n.length - 1];
      return p;
    } else {
      return str;
    }
  }


  // Get the word after slash char of a string
  function trimSlash(str) {
    if (str.includes("/")) {
      var n = str.split("/").pop(-1);
      ;
      return n;
    } else {
      return str;
    }
  }


  // Customization of the RDF type to show as in standards
  function replaceWithRDFType(str) {
    if (str.includes("22-rdf-syntax-ns")) {
      return "rdf:" + trimHash(str);
    } else if (str.includes('rdf-schema'))
      return "rdfs:" + trimHash(str);
    else if (str.includes('owl'))
      return "owl:" + trimHash(str);
    else if (str.includes('core#Concept') || str.includes('narrower') || str.includes(
        'broader'))
      return "skos:" + trimHash(str);
    else
      return str;
  }


  function makeNodeLabel(node) {
    var nodeLabel = "";
    var key2 = node.value;
    var key3 = "";
    if (node.hasOwnProperty("xml:lang"))
      key3 = node['xml:lang'];
    var key4 = node['type'];

    if ((key2.includes("http://") || key2.includes("https://")) && key4 ===
      "literal") {
      if (key2[key2.length - 1] === ('/'))
        key2 = key2.slice(0, -1);
      key2 = '<a href=' + key2 + '>' + key2 + '</a>';
    } else {
      if (key2[key2.length - 1] === ('/'))
        key2 = key2.slice(0, -1);
      key2 = trimHash(replaceWithRDFType(trimSlash(key2)));
    }

    if (key3) {
      nodeLabel = key2 + "@" + key3;
    } else {
      nodeLabel = key2;
    }
    return nodeLabel;
  }


  function createGraph(data) {

    var lastId = 0;
    for (var i = 0; i < data['results']['bindings'].length; i++) {

      var key1 = trimHash(replaceWithRDFType(trimSlash(data['results'][
        'bindings'
      ][i]['predicate'].value)));

      var subjectId = 0;
      var objectId = 0;
      var subjectLabel = makeNodeLabel(data['results']['bindings'][i][
        'subject'
      ]);
      var objectLabel = makeNodeLabel(data['results']['bindings'][i]['object']);

      var subjectFlag = false;
      var objectFlag = false;
      for (var j = 0; j < nodes.length; j++) {
        if (subjectLabel == nodes[j]['label']) {
          subjectFlag = true;
          subjectId = nodes[j]['id'];
        }

        if (objectLabel != nodes[j]['label']) {
          objectFlag = true;
          objectId = nodes[j]['id'];
        }
      }

      if (!subjectFlag) {
        nodes.push({
          id: lastId++,
          label: subjectLabel
        });
        subjectId = lastId;
      }

      if (!subjectFlag) {
        nodes.push({
          id: lastId++,
          label: objectLabel
        });
        objectId = lastId;
      }

      edges.push({
        from: subjectId,
        to: objectId,
        label: key1,
        font: {
          color: 'green'
        }
      });
    }
    var sparqlNodes = new vis.DataSet();
    sparqlNodes.add(nodes);
    var sparqlEdges = new vis.DataSet();
    sparqlEdges.add(edges);

    // create a network
    var container = document.getElementById('result');

    // provide the data in the vis format
    var graphData = {
      nodes: sparqlNodes,
      edges: sparqlEdges
    };

    var options = {
      autoResize: false,
      height: '600px',
      width: '1000px',
      nodes: {
        shape: 'dot',
        size: 20
      },
      layout: {
        randomSeed: undefined,
        improvedLayout: true,
        hierarchical: {
          enabled: false,
          levelSeparation: 150,
          nodeSpacing: 100,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: 'RL', // UD, DU, LR, RL
          sortMethod: 'hubsize' // hubsize, directed
        }
      },
      interaction: {
        navigationButtons: true,
        keyboard: true
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0
        },
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springConstant: 0.08,
          springLength: 100,
          damping: 0.4,
          avoidOverlap: 0
        },
        repulsion: {
          centralGravity: 0.2,
          springLength: 200,
          springConstant: 0.05,
          nodeDistance: 100,
          damping: 0.09
        },
        hierarchicalRepulsion: {
          centralGravity: 0.0,
          springLength: 100,
          springConstant: 0.01,
          nodeDistance: 120,
          damping: 0.09
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        solver: 'barnesHut',
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          onlyDynamicEdges: false,
          fit: true
        },
        timestep: 0.5,
        adaptiveTimestep: true
      }
    };

    console.log(graphData);
    // initialize your network!
    var network = new vis.Network(container, graphData, options);
  }


  function myError() {
    alert("Error in SPARQL query")
  }

  function doSparql(query) {
    var myQuery = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
  PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
  PREFIX owl:  <http://www.w3.org/2002/07/owl#> \
  PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
  PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#> \
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \
  SELECT ?subject ?predicate ?object \
  WHERE \
  { \
  ?sub ?predicate ?obj . \
  ?sub rdfs:label ?sub_label. \
  ?obj rdfs:label ?obj_label. \
  bind( str(?sub_label) as ?subject ) \
  bind( str(?obj_label) as ?object ) \
  }LIMIT 100";

    var myEndPoint = document.URL.split("analyticsLink")[0] +
      'fuseki/dataset/sparql';
    console.log(myQuery);

    $.ajax({
      dataType: "jsonp",
      url: myEndPoint,
      data: {
        "query": myQuery,
        "output": "json"
      },
      success: createGraph,
      error: myError
    });
    console.log('After .ajax');
  }

  doSparql(query);

}


/*
d3sparql.forcegraph = function(json, config) {
  config = config || {}

  var graph = (json.head && json.results) ? d3sparql.graph(json, config) : json

  var scale = d3.scale.linear()
    .domain(d3.extent(graph.nodes, function(d) { return parseFloat(d.value) }))
    .range([1, 20])

  var opts = {
    "radius":    config.radius    || function(d) { return d.value ? scale(d.value) : 1 + d.label.length },
    "charge":    config.charge    || -500,
    "distance":  config.distance  || 50,
    "width":     config.width     || 1000,
    "height":    config.height    || 750,
    "label":     config.label     || false,
    "selector":  config.selector  || null
  }

  var svg = d3sparql.select(opts.selector, "forcegraph").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height)
  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "link")
  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
  var circle = node.append("circle")
    .attr("class", "node")
    .attr("r", opts.radius)
  var text = node.append("text")
    .text(function(d) { return d[opts.label || "label"] })
    .attr("class", "node")
  var force = d3.layout.force()
    .charge(opts.charge)
    .linkDistance(opts.distance)
    .size([opts.width, opts.height])
    .nodes(graph.nodes)
    .links(graph.links)
    .start()
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x })
        .attr("y1", function(d) { return d.source.y })
        .attr("x2", function(d) { return d.target.x })
        .attr("y2", function(d) { return d.target.y })
    text.attr("x", function(d) { return d.x })
        .attr("y", function(d) { return d.y })
    circle.attr("cx", function(d) { return d.x })
          .attr("cy", function(d) { return d.y })
  })
  node.call(force.drag)

  // default CSS/SVG
  link.attr({
    "stroke": "#999999",
  })
  circle.attr({
    "stroke": "black",
    "stroke-width": "1px",
    "fill": "lightblue",
    "opacity": 1,
  })
  text.attr({
    "font-size": "8px",
    "font-family": "sans-serif",
  })
}
*/
/*
  Rendering sparql-results+json object into a sanky graph

  References:
    https://github.com/d3/d3-plugins/tree/master/sankey
    http://bost.ocks.org/mike/sankey/

  Options:
    config = {
      "width":    1000,      // canvas width (optional)
      "height":   900,       // canvas height (optional)
      "margin":   50,        // canvas margin (optional)
      "selector": "#result"
      // options for d3sparql.graph() can be added here ...
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.sankey(json, config)
    }

  CSS/SVG:
    <style>
    .node rect {
      cursor: move;
      fill-opacity: .9;
      shape-rendering: crispEdges;
    }
    .node text {
      pointer-events: none;
      text-shadow: 0 1px 0 #ffffff;
    }
    .link {
      fill: none;
      stroke: #000000;
      stroke-opacity: .2;
    }
    .link:hover {
      stroke-opacity: .5;
    }
    </style>

  Dependencies:
    * sankey.js
      * Download from https://github.com/d3/d3-plugins/tree/master/sankey
      * Put <script src="sankey.js"></script> in the HTML <head> section
*/
d3sparql.sankey = function(json, config) {
  config = config || {}

  var graph = (json.head && json.results) ? d3sparql.graph(json, config) :
    json

  var opts = {
    "width": config.width || 750,
    "height": config.height || 1200,
    "margin": config.margin || 10,
    "selector": config.selector || null
  }

  var nodes = graph.nodes
  var links = graph.links
  for (var i = 0; i < links.length; i++) {
    links[i].value = 2 // TODO: fix to use values on links
  }
  var sankey = d3.sankey()
    .size([opts.width, opts.height])
    .nodeWidth(15)
    .nodePadding(10)
    .nodes(nodes)
    .links(links)
    .layout(32)
  var path = sankey.link()
  var color = d3.scale.category20()
  var svg = d3sparql.select(opts.selector, "sankey").append("svg")
    .attr("width", opts.width + opts.margin * 2)
    .attr("height", opts.height + opts.margin * 2)
    .append("g")
    .attr("transform", "translate(" + opts.margin + "," + opts.margin + ")")
  var link = svg.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", path)
    .attr("stroke-width", function(d) {
      return Math.max(1, d.dy)
    })
    .sort(function(a, b) {
      return b.dy - a.dy
    })
  var node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")"
    })
    .call(d3.behavior.drag()
      .origin(function(d) {
        return d
      })
      .on("dragstart", function() {
        this.parentNode.appendChild(this)
      })
      .on("drag", dragmove)
  )
  node.append("rect")
    .attr("width", function(d) {
      return d.dx
    })
    .attr("height", function(d) {
      return d.dy
    })
    .attr("fill", function(d) {
      return color(d.label)
    })
    .attr("opacity", 0.5)
  node.append("text")
    .attr("x", -6)
    .attr("y", function(d) {
      return d.dy / 2
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function(d) {
      return d.label
    })
    .filter(function(d) {
      return d.x < opts.width / 2
    })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start")

  // default CSS/SVG
  link.attr({
    "fill": "none",
    "stroke": "grey",
    "opacity": 0.5,
  })

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(
        0, Math.min(opts.height - d.dy, d3.event.y))) + ")")
    sankey.relayout()
    link.attr("d", path)
  }
}


/*
  Rendering sparql-results+json object into a round tree

  References:
    http://bl.ocks.org/4063550  Reingold-Tilford Tree

  Options:
    config = {
      "diameter": 800,       // canvas diameter (optional)
      "angle":    360,       // arc angle (optional; less than 360 for wedge)
      "depth":    200,       // arc depth (optional; less than diameter/2 - label length to fit)
      "radius":   5,         // node radius (optional)
      "selector": "#result"
      // options for d3sparql.tree() can be added here ...
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.roundtree(json, config)
    }

  CSS/SVG:
    <style>
    .link {
      fill: none;
      stroke: #cccccc;
      stroke-width: 1.5px;
    }
    .node circle {
      fill: #ffffff;
      stroke: darkgreen;
      stroke-width: 1.5px;
      opacity: 1;
    }
    .node text {
      font-size: 10px;
      font-family: sans-serif;
    }
    </style>
*/
d3sparql.roundtree = function(json, config) {
  config = config || {}

  var tree = (json.head && json.results) ? d3sparql.tree(json, config) : json

  var opts = {
    "diameter": config.diameter || 800,
    "angle": config.angle || 360,
    "depth": config.depth || 200,
    "radius": config.radius || 5,
    "selector": config.selector || null
  }

  var tree_layout = d3.layout.tree()
    .size([opts.angle, opts.depth])
    .separation(function(a, b) {
      return (a.parent === b.parent ? 1 : 2) / a.depth
    })
  var nodes = tree_layout.nodes(tree)
  var links = tree_layout.links(nodes)
  var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) {
      return [d.y, d.x / 180 * Math.PI]
    })
  var svg = d3sparql.select(opts.selector, "roundtree").append("svg")
    .attr("width", opts.diameter)
    .attr("height", opts.diameter)
    .append("g")
    .attr("transform", "translate(" + opts.diameter / 2 + "," + opts.diameter /
      2 + ")")
  var link = svg.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonal)
  var node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")"
    })
  var circle = node.append("circle")
    .attr("r", opts.radius)
  var text = node.append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.x < 180 ? "start" : "end"
    })
    .attr("transform", function(d) {
      return d.x < 180 ? "translate(8)" : "rotate(180) translate(-8)"
    })
    .text(function(d) {
      return d.name
    })

  // default CSS/SVG
  link.attr({
    "fill": "none",
    "stroke": "#cccccc",
    "stroke-width": "1.5px",
  })
  circle.attr({
    "fill": "#ffffff",
    "stroke": "steelblue",
    "stroke-width": "1.5px",
    "opacity": 1,
  })
  text.attr({
    "font-size": "10px",
    "font-family": "sans-serif",
  })
}


/*
  Rendering sparql-results+json object into a dendrogram

  References:
    http://bl.ocks.org/4063570  Cluster Dendrogram

  Options:
    config = {
      "width":    900,       // canvas width (optional)
      "height":   4500,      // canvas height (optional)
      "margin":   300,       // width margin for labels (optional)
      "radius":   5,         // radius of node circles (optional)
      "selector": "#result"
      // options for d3sparql.tree() can be added here ...
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.dendrogram(json, config)
    }

  CSS/SVG:
    <style>
    .link {
      fill: none;
      stroke: #cccccc;
      stroke-width: 1.5px;
    }
    .node circle {
      fill: #ffffff;
      stroke: steelblue;
      stroke-width: 1.5px;
      opacity: 1;
    }
    .node text {
      font-size: 10px;
      font-family: sans-serif;
    }
    </style>
*/


/*
d3sparql.dendrogram = function(json, config) {
  config = config || {}

  var treeData = (json.head && json.results) ? d3sparql.tree(json, config) : json;
  console.log('I am here jack!');

  showGraph(treeData);
  function showGraph(treeData) {
    console.log('Now here');
    console.log(treeData);
    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });


    // sort the tree according to the node names

    function sortTree() {
        tree.sort(function(a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    }
    // Sort the tree initially incase the JSON isn't in a sorted order.
    sortTree();

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
        d3.select(domNode).attr('class', 'node activeDrag');

        svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
            if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
            // remove link paths
            links = tree.links(nodes);
            nodePaths = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                }).remove();
            // remove child nodes
            nodesExit = svgGroup.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id;
                }).filter(function(d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // remove parent link
        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll('path.link').filter(function(d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
    }

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#tree-container").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);


    // Define the drag listeners for drag/drop behaviour of nodes.
    dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
            if (d == root) {
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            // get coords of mouseEvent relative to svg container to allow for panning
            relCoords = d3.mouse($('svg').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                pan(this, 'left');
            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                panTimer = true;
                pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                pan(this, 'up');
            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                panTimer = true;
                pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {

                }
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        }).on("dragend", function(d) {
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                    if (typeof selectedNode.children !== 'undefined') {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                expand(selectedNode);
                sortTree();
                endDrag();
            } else {
                endDrag();
            }
        });

    function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        updateTempConnector();
        if (draggingNode !== null) {
            update(root);
            centerNode(draggingNode);
            draggingNode = null;
        }
    }

    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
    };

    // Function to update the temporary connector indicating dragging affiliation
    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        centerNode(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .call(dragListener)
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 30)
            .attr("opacity", 0.2) // change this to zero to hide the target area
        .style("fill", "red")
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
                overCircle(node);
            })
            .on("mouseout", function(node) {
                outCircle(node);
            });

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", 4.5)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // Define the root
    root = treeData;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Layout the tree initially and center on the root node.
    update(root);
    centerNode(root);
}

}
*/


d3sparql.dendrogram = function(json, config) {


  var tree = d3sparql.tree(json, config);
  dendShow(tree);
/*  var opts = {
    "width": config.width || 400,
    "height": config.height || 6000,
    "margin": config.margin || 350,
    "radius": config.radius || 5,
    "selector": config.selector || null
  }

  var cluster = d3.layout.cluster()
    .size([opts.height, opts.width - opts.margin])
  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x]
    })
  var svg = d3sparql.select(opts.selector, "dendrogram").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height)
    .append("g")
    .attr("transform", "translate(40,0)")
  var nodes = cluster.nodes(tree)
  var links = cluster.links(nodes)
  var link = svg.selectAll(".link")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    .attr("d", diagonal)
  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")"
    })
  var circle = node.append("circle")
    .attr("r", opts.radius)
  var text = node.append("text")
    .attr("dx", function(d) {
      return (d.parent && d.children) ? -8 : 8
    })
    .attr("dy", 5)
    .style("text-anchor", function(d) {
      return (d.parent && d.children) ? "end" : "start"
    })
    .text(function(d) {
      return d.name
    })

  // default CSS/SVG
  link.attr({
    "fill": "none",
    "stroke": "#cccccc",
    "stroke-width": "1.5px",
  })
  circle.attr({
    "fill": "#ffffff",
    "stroke": "steelblue",
    "stroke-width": "1.5px",
    "opacity": 1,
  })
  text.attr({
    "font-size": "10px",
    "font-family": "sans-serif",
  }) */
}

/*
function dendShow(treeData) {

  // Calculate total nodes, max label length
  var totalNodes = 0;
  var maxLabelLength = 0;
  // variables for drag/drop
  var selectedNode = null;
  var draggingNode = null;
  // panning variables
  var panSpeed = 200;
  var panBoundary = 20; // Within 20px from edges will pan when dragging.
  // Misc. variables
  var i = 0;
  var duration = 750;
  var root;

  // size of the diagram
  var viewerWidth = $(document).width();
  var viewerHeight = $(document).height();

  var tree = d3.layout.tree()
    .size([viewerHeight, viewerWidth]);

  // define a d3 diagonal projection for use by the node paths later on.
  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

  // A recursive helper function for performing some setup by walking through all nodes

  function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        visit(children[i], visitFn, childrenFn);
      }
    }
  }

  // Call visit function to establish maxLabelLength
  visit(treeData, function(d) {
    totalNodes++;
    maxLabelLength = Math.max(d.name.length, maxLabelLength);
  }, function(d) {
    return d.children && d.children.length > 0 ? d.children : null;
  });


  // sort the tree according to the node names

  function sortTree() {
    tree.sort(function(a, b) {
      return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
  }
  // Sort the tree initially incase the JSON isn't in a sorted order.
  sortTree();

  // TODO: Pan function, can be better implemented.

  function pan(domNode, direction) {
    var speed = panSpeed;
    if (panTimer) {
      clearTimeout(panTimer);
      translateCoords = d3.transform(svgGroup.attr("transform"));
      if (direction == 'left' || direction == 'right') {
        translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
        translateY = translateCoords.translate[1];
      } else if (direction == 'up' || direction == 'down') {
        translateX = translateCoords.translate[0];
        translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
      }
      scaleX = translateCoords.scale[0];
      scaleY = translateCoords.scale[1];
      scale = zoomListener.scale();
      svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
      d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
      zoomListener.scale(zoomListener.scale());
      zoomListener.translate([translateX, translateY]);
      panTimer = setTimeout(function() {
        pan(domNode, speed, direction);
      }, 50);
    }
  }

  // Define the zoom function for the zoomable tree

  function zoom() {
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }


  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  function initiateDrag(d, domNode) {
    draggingNode = d;
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
    d3.select(domNode).attr('class', 'node activeDrag');

    svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's

      if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
      else return -1; // a is the hovered element, bring "a" to the front
    });
    // if nodes has children, remove the links and nodes
    if (nodes.length > 1) {
      // remove link paths
      links = tree.links(nodes);
      nodePaths = svgGroup.selectAll("path.link")
        .data(links, function(d) {
          return d.target.id;
        }).remove();
      // remove child nodes
      nodesExit = svgGroup.selectAll("g.node")
        .data(nodes, function(d) {
          return d.id;
        }).filter(function(d, i) {
          if (d.id == draggingNode.id) {
            return false;
          }
          return true;
        }).remove();
    }

    // remove parent link
    parentLink = tree.links(tree.nodes(draggingNode.parent));
    svgGroup.selectAll('path.link').filter(function(d, i) {
      if (d.target.id == draggingNode.id) {
        return true;
      }
      return false;
    }).remove();

    dragStarted = null;
  }

  // define the baseSvg, attaching a class for styling and the zoomListener
  var baseSvg = d3.select("#result").append("svg")
    .attr("width", viewerWidth) //TODO Define height and weidth here
    .attr("height", viewerHeight)
    .attr("class", "overlay")
    .call(zoomListener);


  // Define the drag listeners for drag/drop behaviour of nodes.
  dragListener = d3.behavior.drag()
    .on("dragstart", function(d) {
      if (d == root) {
        return;
      }
      dragStarted = true;
      nodes = tree.nodes(d);
      d3.event.sourceEvent.stopPropagation();
      // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
    })
    .on("drag", function(d) {
      if (d == root) {
        return;
      }
      if (dragStarted) {
        domNode = this;
        initiateDrag(d, domNode);
      }

      // get coords of mouseEvent relative to svg container to allow for panning
      relCoords = d3.mouse($('svg').get(0));
      if (relCoords[0] < panBoundary) {
        panTimer = true;
        pan(this, 'left');
      } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

        panTimer = true;
        pan(this, 'right');
      } else if (relCoords[1] < panBoundary) {
        panTimer = true;
        pan(this, 'up');
      } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
        panTimer = true;
        pan(this, 'down');
      } else {
        try {
          clearTimeout(panTimer);
        } catch (e) {

        }
      }

      d.x0 += d3.event.dy;
      d.y0 += d3.event.dx;
      var node = d3.select(this);
      node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
      updateTempConnector();
    }).on("dragend", function(d) {
      if (d == root) {
        return;
      }
      domNode = this;
      if (selectedNode) {
        // now remove the element from the parent, and insert it into the new elements children
        var index = draggingNode.parent.children.indexOf(draggingNode);
        if (index > -1) {
          draggingNode.parent.children.splice(index, 1);
        }
        if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
          if (typeof selectedNode.children !== 'undefined') {
            selectedNode.children.push(draggingNode);
          } else {
            selectedNode._children.push(draggingNode);
          }
        } else {
          selectedNode.children = [];
          selectedNode.children.push(draggingNode);
        }
        // Make sure that the node being added to is expanded so user can see added node is correctly moved
        expand(selectedNode);
        sortTree();
        endDrag();
      } else {
        endDrag();
      }
    });

  function endDrag() {
    selectedNode = null;
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
    d3.select(domNode).attr('class', 'node');
    // now restore the mouseover event or we won't be able to drag a 2nd time
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
    updateTempConnector();
    if (draggingNode !== null) {
      update(root);
      centerNode(draggingNode);
      draggingNode = null;
    }
  }

  // Helper functions for collapsing and expanding nodes.

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function expand(d) {
    if (d._children) {
      d.children = d._children;
      d.children.forEach(expand);
      d._children = null;
    }
  }

  var overCircle = function(d) {
    selectedNode = d;
    updateTempConnector();
  };
  var outCircle = function(d) {
    selectedNode = null;
    updateTempConnector();
  };

  // Function to update the temporary connector indicating dragging affiliation
  var updateTempConnector = function() {
    var data = [];
    if (draggingNode !== null && selectedNode !== null) {
      // have to flip the source coordinates since we did this for the existing connectors on the original tree
      data = [{
        source: {
          x: selectedNode.y0,
          y: selectedNode.x0
        },
        target: {
          x: draggingNode.y0,
          y: draggingNode.x0
        }
      }];
    }
    var link = svgGroup.selectAll(".templink").data(data);

    link.enter().append("path")
      .attr("class", "templink")
      .attr("d", d3.svg.diagonal())
      .attr('pointer-events', 'none');

    link.attr("d", d3.svg.diagonal());

    link.exit().remove();
  };

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

  function centerNode(source) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + viewerWidth / 2;
    y = y * scale + viewerHeight / 2;
    d3.select('g').transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }

  // Toggle children function

  function toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  }

  // Toggle children on click.

  function click(d) {
    if (d3.event.defaultPrevented) return; // click suppressed
    d = toggleChildren(d);
    update(d);
    centerNode(d);
  }

  function update(source) {
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [1];
    var childCount = function(level, n) {

      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function(d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
    tree = tree.size([newHeight, viewerWidth]);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function(d) {
      d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
      // alternatively to keep a fixed scale one can set a fixed depth per level
      // Normalize for fixed-depth by commenting out below line
      // d.y = (d.depth * 500); //500px per level.
    });

    // Update the nodes…
    node = svgGroup.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .call(dragListener)
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', click);

    nodeEnter.append("circle")
      .attr('class', 'nodeCircle')
      .attr("r", 0)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeEnter.append("text")
      .attr("x", function(d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr('class', 'nodeText')
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) {
        return d.name;
      })
      .style("fill-opacity", 0);

    // phantom node to give us mouseover in a radius around it
    nodeEnter.append("circle")
      .attr('class', 'ghostCircle')
      .attr("r", 30)
      .attr("opacity", 0.2) // change this to zero to hide the target area
      .style("fill", "red")
      .attr('pointer-events', 'mouseover')
      .on("mouseover", function(node) {
        overCircle(node);
      })
      .on("mouseout", function(node) {
        outCircle(node);
      });

    // Update the text to reflect whether node has children or not.
    node.select('text')
      .attr("x", function(d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) {
        return d.name;
      });

    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle")
      .attr("r", 4.5)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Fade the text in
    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 0);

    nodeExit.select("text")
      .style("fill-opacity", 0);

    // Update the links…
    var link = svgGroup.selectAll("path.link")
      .data(links, function(d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Append a group which holds all nodes and which the zoom Listener can act upon.
  var svgGroup = baseSvg.append("g");

  // Define the root
  root = treeData;
  root.x0 = viewerHeight / 2;
  root.y0 = 0;

  // Layout the tree initially and center on the root node.
  update(root);
  centerNode(root);
  //});
}

*/


function dendShow(treeData) {
  var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120
  };


  var totalNodes = 0;
  var maxLabelLength = 0;
  // variables for drag/drop
  var selectedNode = null;
  var draggingNode = null;
  // panning variables
  var panSpeed = 200;
  var panBoundary = 20; // Within 20px from edges will pan when dragging.
  // Misc. variables
  var i = 0;
  var duration = 750;
  var root;

  // size of the diagram
  var viewerWidth = $(document).width();
  var viewerHeight = $(document).height();

  var tree = d3.layout.tree()
    .size([viewerHeight, viewerWidth]);

  // define a d3 diagonal projection for use by the node paths later on.
  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

  // A recursive helper function for performing some setup by walking through all nodes

  function visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        visit(children[i], visitFn, childrenFn);
      }
    }
  }

  // Call visit function to establish maxLabelLength
  visit(treeData, function(d) {
    totalNodes++;
    maxLabelLength = Math.max(d.name.length, maxLabelLength);
  }, function(d) {
    return d.children && d.children.length > 0 ? d.children : null;
  });


  // sort the tree according to the node names

  function sortTree() {
    tree.sort(function(a, b) {
      return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
    });
  }
  // Sort the tree initially incase the JSON isn't in a sorted order.
  sortTree();

  // TODO: Pan function, can be better implemented.

  function pan(domNode, direction) {
    var speed = panSpeed;
    if (panTimer) {
      clearTimeout(panTimer);
      translateCoords = d3.transform(svgGroup.attr("transform"));
      if (direction == 'left' || direction == 'right') {
        translateX = direction == 'left' ? translateCoords.translate[0] + speed :
          translateCoords.translate[0] - speed;
        translateY = translateCoords.translate[1];
      } else if (direction == 'up' || direction == 'down') {
        translateX = translateCoords.translate[0];
        translateY = direction == 'up' ? translateCoords.translate[1] + speed :
          translateCoords.translate[1] - speed;
      }
      scaleX = translateCoords.scale[0];
      scaleY = translateCoords.scale[1];
      scale = zoomListener.scale();
      svgGroup.transition().attr("transform", "translate(" + translateX + "," +
        translateY + ")scale(" + scale + ")");
      d3.select(domNode).select('g.node').attr("transform", "translate(" +
        translateX + "," + translateY + ")");
      zoomListener.scale(zoomListener.scale());
      zoomListener.translate([translateX, translateY]);
      panTimer = setTimeout(function() {
        pan(domNode, speed, direction);
      }, 50);
    }
  }

  // Define the zoom function for the zoomable tree

  function zoom() {
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" +
      d3.event.scale + ")");
  }


  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  function initiateDrag(d, domNode) {
    draggingNode = d;
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
    d3.select(domNode).attr('class', 'node activeDrag');

    svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's

      if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
      else return -1; // a is the hovered element, bring "a" to the front
    });
    // if nodes has children, remove the links and nodes
    if (nodes.length > 1) {
      // remove link paths
      links = tree.links(nodes);
      nodePaths = svgGroup.selectAll("path.link")
        .data(links, function(d) {
          return d.target.id;
        }).remove();
      // remove child nodes
      nodesExit = svgGroup.selectAll("g.node")
        .data(nodes, function(d) {
          console.log('I am here!');
          console.log(d.id);
          console.log(d);
          return d.id;
        }).filter(function(d, i) {
        if (d.id == draggingNode.id) {
          return false;
        }
        return true;
      }).remove();
    }

    // remove parent link
    parentLink = tree.links(tree.nodes(draggingNode.parent));
    svgGroup.selectAll('path.link').filter(function(d, i) {
      if (d.target.id == draggingNode.id) {
        return true;
      }
      return false;
    }).remove();

    dragStarted = null;
  }

  // define the baseSvg, attaching a class for styling and the zoomListener
  var baseSvg = d3.select("#result").append("svg")
    .attr("width", viewerWidth + margin.right + margin.left)
    .attr("height", viewerHeight + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "overlay")
    .call(zoomListener);


  // Define the drag listeners for drag/drop behaviour of nodes.
  dragListener = d3.behavior.drag()
    .on("dragstart", function(d) {
      if (d == root) {
        return;
      }
      dragStarted = true;
      nodes = tree.nodes(d);
      d3.event.sourceEvent.stopPropagation();
    // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
    })
    .on("drag", function(d) {
      if (d == root) {
        return;
      }
      if (dragStarted) {
        domNode = this;
        initiateDrag(d, domNode);
      }

      // get coords of mouseEvent relative to svg container to allow for panning
      relCoords = d3.mouse($('svg').get(0));
      if (relCoords[0] < panBoundary) {
        panTimer = true;
        pan(this, 'left');
      } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

        panTimer = true;
        pan(this, 'right');
      } else if (relCoords[1] < panBoundary) {
        panTimer = true;
        pan(this, 'up');
      } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
        panTimer = true;
        pan(this, 'down');
      } else {
        try {
          clearTimeout(panTimer);
        } catch (e) {}
      }

      d.x0 += d3.event.dy;
      d.y0 += d3.event.dx;
      var node = d3.select(this);
      node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
      updateTempConnector();
    }).on("dragend", function(d) {
    if (d == root) {
      return;
    }
    domNode = this;
    if (selectedNode) {
      // now remove the element from the parent, and insert it into the new elements children
      var index = draggingNode.parent.children.indexOf(draggingNode);
      if (index > -1) {
        draggingNode.parent.children.splice(index, 1);
      }
      if (typeof selectedNode.children !== 'undefined' || typeof selectedNode
          ._children !== 'undefined') {
        if (typeof selectedNode.children !== 'undefined') {
          selectedNode.children.push(draggingNode);
        } else {
          selectedNode._children.push(draggingNode);
        }
      } else {
        selectedNode.children = [];
        selectedNode.children.push(draggingNode);
      }
      // Make sure that the node being added to is expanded so user can see added node is correctly moved
      expand(selectedNode);
      sortTree();
      endDrag();
    } else {
      endDrag();
    }
  });

  function endDrag() {
    selectedNode = null;
    d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
    d3.select(domNode).attr('class', 'node');
    // now restore the mouseover event or we won't be able to drag a 2nd time
    d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
    updateTempConnector();
    if (draggingNode !== null) {
      update(root);
      centerNode(draggingNode);
      draggingNode = null;
    }
  }

  // Helper functions for collapsing and expanding nodes.

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function expand(d) {
    if (d._children) {
      d.children = d._children;
      d.children.forEach(expand);
      d._children = null;
    }
  }

  var overCircle = function(d) {
    selectedNode = d;
    updateTempConnector();
  };
  var outCircle = function(d) {
    selectedNode = null;
    updateTempConnector();
  };

  // Function to update the temporary connector indicating dragging affiliation
  var updateTempConnector = function() {
    var data = [];
    if (draggingNode !== null && selectedNode !== null) {
      // have to flip the source coordinates since we did this for the existing connectors on the original tree
      data = [{
        source: {
          x: selectedNode.y0,
          y: selectedNode.x0
        },
        target: {
          x: draggingNode.y0,
          y: draggingNode.x0
        }
      }];
    }
    var link = svgGroup.selectAll(".templink").data(data);

    link.enter().append("path")
      .attr("class", "templink")
      .attr("d", d3.svg.diagonal())
      .attr('pointer-events', 'none');

    link.attr("d", d3.svg.diagonal());

    link.exit().remove();
  };

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

  function centerNode(source) {
    scale = zoomListener.scale();
    x = -source.y0;
    y = -source.x0;
    x = x * scale + viewerWidth / 2;
    y = y * scale + viewerHeight / 2;
    d3.select('g').transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }

  // Toggle children function

  function toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  }

  // Toggle children on click.

  function click(d) {
    if (d3.event.defaultPrevented) return; // click suppressed
    d = toggleChildren(d);
    update(d);
    centerNode(d);
  }

  function update(source) {
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [1];
    var childCount = function(level, n) {

      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function(d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
    tree = tree.size([newHeight, viewerWidth]);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function(d) {
      d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
    // alternatively to keep a fixed scale one can set a fixed depth per level
    // Normalize for fixed-depth by commenting out below line
    // d.y = (d.depth * 500); //500px per level.
    });

    // Update the nodes…
    node = svgGroup.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .call(dragListener)
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on('click', click);

    nodeEnter.append("circle")
      .attr('class', 'nodeCircle')
      .attr("r", 0)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeEnter.append("text")
      .attr("x", function(d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr('class', 'nodeText')
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) {
        return d.name;
      })
      .style("fill-opacity", 0);

    // phantom node to give us mouseover in a radius around it
    nodeEnter.append("circle")
      .attr('class', 'ghostCircle')
      .attr("r", 30)
      .attr("opacity", 0.2) // change this to zero to hide the target area
      .style("fill", "red")
      .attr('pointer-events', 'mouseover')
      .on("mouseover", function(node) {
        overCircle(node);
      })
      .on("mouseout", function(node) {
        outCircle(node);
      });

    // Update the text to reflect whether node has children or not.
    node.select('text')
      .attr("x", function(d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function(d) {
        return d.name;
      });

    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle")
      .attr("r", 4.5)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Fade the text in
    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 0);

    nodeExit.select("text")
      .style("fill-opacity", 0);

    // Update the links…
    var link = svgGroup.selectAll("path.link")
      .data(links, function(d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Append a group which holds all nodes and which the zoom Listener can act upon.
  var svgGroup = baseSvg.append("g");

  // Define the root
  root = treeData;
  root.x0 = viewerHeight / 2;
  root.y0 = 0;

  // Layout the tree initially and center on the root node.
  root.children.forEach(collapse);
  update(root);
  centerNode(root);


  //d3.select(self.frameElement).style("height", "800px");


}


/*
  Rendering sparql-results+json object into a sunburst

  References:
    http://bl.ocks.org/4348373  Zoomable Sunburst
    http://www.jasondavies.com/coffee-wheel/  Coffee Flavour Wheel

  Options:
    config = {
      "width":    1000,      // canvas width (optional)
      "height":   900,       // canvas height (optional)
      "margin":   150,       // margin for labels (optional)
      "selector": "#result"
      // options for d3sparql.tree() can be added here ...
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.sunburst(json, config)
    }

  CSS/SVG:
    <style>
    .node text {
      font-size: 10px;
      font-family: sans-serif;
    }
    .arc {
      stroke: #ffffff;
      fill-rule: evenodd;
    }
    </style>
*/
d3sparql.sunburst = function(json, config) {
  config = config || {}

  var tree = (json.head && json.results) ? d3sparql.tree(json, config) : json

  var opts = {
    "width": config.width || 1000,
    "height": config.height || 900,
    "margin": config.margin || 150,
    "selector": config.selector || null
  }

  var radius = Math.min(opts.width, opts.height) / 2 - opts.margin
  var x = d3.scale.linear().range([0, 2 * Math.PI])
  var y = d3.scale.sqrt().range([0, radius])
  var color = d3.scale.category20()
  var svg = d3sparql.select(opts.selector, "sunburst").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height)
    .append("g")
    .attr("transform", "translate(" + opts.width / 2 + "," + opts.height / 2 +
      ")");
  var arc = d3.svg.arc()
    .startAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x)))
    })
    .endAngle(function(d) {
      return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)))
    })
    .innerRadius(function(d) {
      return Math.max(0, y(d.y))
    })
    .outerRadius(function(d) {
      return Math.max(0, y(d.y + d.dy))
    })
  var partition = d3.layout.partition()
    .value(function(d) {
      return d.value
    })
  var nodes = partition.nodes(tree)
  var path = svg.selectAll("path")
    .data(nodes)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("class", "arc")
    .style("fill", function(d) {
      return color((d.children ? d : d.parent).name)
    })
    .on("click", click)
  var text = svg.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("transform", function(d) {
      var rotate = x(d.x + d.dx / 2) * 180 / Math.PI - 90
      return "rotate(" + rotate + ") translate(" + y(d.y) + ")"
    })
    .attr("dx", ".5em")
    .attr("dy", ".35em")
    .text(function(d) {
      return d.name
    })
    .on("click", click)

  // default CSS/SVG
  path.attr({
    "stroke": "#ffffff",
    "fill-rule": "evenodd",
  })
  text.attr({
    "font-size": "10px",
    "font-family": "sans-serif",
  })

  function click(d) {
    path.transition()
      .duration(750)
      .attrTween("d", arcTween(d))
    text.style("visibility", function(e) {
      // required for showing labels just before the transition when zooming back to the upper level
      return isParentOf(d, e) ? null : d3.select(this).style("visibility")
    })
      .transition()
      .duration(750)
      .attrTween("transform", function(d) {
        return function() {
          var rotate = x(d.x + d.dx / 2) * 180 / Math.PI - 90
          return "rotate(" + rotate + ") translate(" + y(d.y) + ")"
        }
      })
      .each("end", function(e) {
        // required for hiding labels just after the transition when zooming down to the lower level
        d3.select(this).style("visibility", isParentOf(d, e) ? null :
          "hidden")
      })
  }

  function maxDepth(d) {
    return d.children ? Math.max.apply(Math, d.children.map(maxDepth)) : d.y +
    d.dy
  }

  function arcTween(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, maxDepth(d)]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius])
    return function(d) {
      return function(t) {
        x.domain(xd(t))
        y.domain(yd(t)).range(yr(t))
        return arc(d)
      }
    }
  }

  function isParentOf(p, c) {
    if (p === c) return true
    if (p.children) {
      return p.children.some(function(d) {
        return isParentOf(d, c)
      })
    }
    return false
  }
}

/*
  Rendering sparql-results+json object into a circle pack

  References:
    http://mbostock.github.com/d3/talk/20111116/pack-hierarchy.html  Circle Packing

  Options:
    config = {
      "width":    800,       // canvas width (optional)
      "height":   800,       // canvas height (optional)
      "diameter": 700,       // diamieter of the outer circle (optional)
      "selector": "#result"
      // options for d3sparql.tree() can be added here ...
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.circlepack(json, config)
    }

  CSS/SVG:
    <style>
    text {
      font-size: 11px;
      pointer-events: none;
    }
    text.parent {
      fill: #1f77b4;
    }
    circle {
      fill: #cccccc;
      stroke: #999999;
      pointer-events: all;
    }
    circle.parent {
      fill: #1f77b4;
      fill-opacity: .1;
      stroke: steelblue;
    }
    circle.parent:hover {
      stroke: #ff7f0e;
      stroke-width: .5px;
    }
    circle.child {
      pointer-events: none;
    }
    </style>

  TODO:
    Fix rotation angle for each text to avoid string collision
*/
d3sparql.circlepack = function(json, config) {
  config = config || {}

  var tree = (json.head && json.results) ? d3sparql.tree(json, config) : json

  var opts = {
    "width": config.width || 800,
    "height": config.height || 800,
    "diameter": config.diameter || 700,
    "selector": config.selector || null
  }

  var w = opts.width,
    h = opts.height,
    r = opts.diameter,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r])

  var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) {
      return d.value
    })

  var node = tree
  var nodes = pack.nodes(tree)

  var vis = d3sparql.select(opts.selector, "circlepack").append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")")

  vis.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", function(d) {
      return d.children ? "parent" : "child"
    })
    .attr("cx", function(d) {
      return d.x
    })
    .attr("cy", function(d) {
      return d.y
    })
    .attr("r", function(d) {
      return d.r
    })
    /*
        // CSS: circle { ... }
        .attr("fill", function(d) { return d.children ? "#1f77b4" : "#cccccc" })
        .attr("fill-opacity", function(d) { return d.children ? ".1" : "1" })
        .attr("stroke", function(d) { return d.children ? "steelblue" : "#999999" })
        .attr("pointer-events", function(d) { return d.children ? "all" : "none" })
        .on("mouseover", function() { d3.select(this).attr("stroke", "#ff7f0e").attr("stroke-width", ".5px") })
        .on("mouseout", function() { d3.select(this).attr("stroke", "steelblue").attr("stroke-width", ".5px") })
    */
    .on("click", function(d) {
      return zoom(node === d ? tree : d)
    })

  vis.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", function(d) {
      return d.children ? "parent" : "child"
    })
    .attr("x", function(d) {
      return d.x
    })
    .attr("y", function(d) {
      return d.y
    })
    //    .attr("dy", ".35em")
    .style("opacity", function(d) {
      return d.r > 20 ? 1 : 0
    })
    .text(function(d) {
      return d.name
    })
    // rotate to avoid string collision
    //.attr("text-anchor", "middle")
    .attr("text-anchor", "start")
    .transition()
    .duration(1000)
    .attr("transform", function(d) {
      return "rotate(-30, " + d.x + ", " + d.y + ")"
    })

  d3.select(window).on("click", function() {
    zoom(tree)
  })

  function zoom(d, i) {
    var k = r / d.r / 2
    x.domain([d.x - d.r, d.x + d.r])
    y.domain([d.y - d.r, d.y + d.r])
    var t = vis.transition()
      .duration(d3.event.altKey ? 2000 : 500)
    t.selectAll("circle")
      .attr("cx", function(d) {
        return x(d.x)
      })
      .attr("cy", function(d) {
        return y(d.y)
      })
      .attr("r", function(d) {
        return k * d.r
      })
    t.selectAll("text")
      .attr("x", function(d) {
        return x(d.x)
      })
      .attr("y", function(d) {
        return y(d.y)
      })
      .style("opacity", function(d) {
        return k * d.r > 20 ? 1 : 0
      })
    d3.event.stopPropagation()
  }
}

/*
  Rendering sparql-results+json object into a treemap

  References:
    http://bl.ocks.org/4063582  Treemap

  Options:
    config = {
      "width":    800,       // canvas width (optional)
      "height":   500,       // canvas height (optional)
      "margin":   {"top": 10, "right": 10, "bottom": 10, "left": 10},
      "selector": "#result"
      // options for d3sparql.tree() can be added here ...
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.treemap(json, config)
    }

  CSS/SVG:
    <style>
    .node {
      border: solid 1px white;
      font: 10px sans-serif;
      line-height: 12px;
      overflow: hidden;
      position: absolute;
      text-indent: 2px;
    }
    </style>
*/
d3sparql.treemap = function(json, config) {
  config = config || {}

  var tree = (json.head && json.results) ? d3sparql.tree(json, config) : json

  var opts = {
    "width": config.width || 800,
    "height": config.height || 500,
    "count": config.count || false,
    "color": config.color || d3.scale.category20c(),
    "margin": config.margin || {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    "selector": config.selector || null
  }

  var width = opts.width - opts.margin.left - opts.margin.right
  var height = opts.height - opts.margin.top - opts.margin.bottom
  var color = opts.color

  function count(d) {
    return 1
  }

  function size(d) {
    return d.value
  }

  var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(opts.count ? count : size)

  var div = d3sparql.select(opts.selector, "treemap")
    .style("position", "relative")
    .style("width", opts.width + "px")
    .style("height", opts.height + "px")
    .style("left", opts.margin.left + "px")
    .style("top", opts.margin.top + "px")

  var node = div.datum(tree).selectAll(".node")
    .data(treemap.nodes)
    .enter()
    .append("div")
    .attr("class", "node")
    .call(position)
    .style("background", function(d) {
      return d.children ? color(d.name) : null
    })
    .text(function(d) {
      return d.children ? null : d.name
    })

  // default CSS/SVG
  node.style({
    "border-style": "solid",
    "border-width": "1px",
    "border-color": "white",
    "font-size": "10px",
    "font-family": "sans-serif",
    "line-height": "12px",
    "overflow": "hidden",
    "position": "absolute",
    "text-indent": "2px",
  })

  function position() {
    this.style("left", function(d) {
      return d.x + "px"
    })
      .style("top", function(d) {
        return d.y + "px"
      })
      .style("width", function(d) {
        return Math.max(0, d.dx - 1) + "px"
      })
      .style("height", function(d) {
        return Math.max(0, d.dy - 1) + "px"
      })
  }
}

/*
  Rendering sparql-results+json object into a zoomable treemap

  References:
    http://bost.ocks.org/mike/treemap/  Zoomable Treemaps
    http://bl.ocks.org/zanarmstrong/76d263bd36f312cb0f9f

  Options:
    config = {
      "width":    800,       // canvas width (optional)
      "height":   500,       // canvas height (optional)
      "margin":   {"top": 10, "right": 10, "bottom": 10, "left": 10},
      "selector": "#result"
      // options for d3sparql.tree() can be added here ...
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      var config = { ... }
      d3sparql.treemapzoom(json, config)
    }

  CSS/SVG:
    <style>
    rect {
      cursor: pointer;
    }
    .grandparent:hover rect {
      opacity: 0.8;
    }
    .children:hover rect.child {
      opacity: 0.2;
    }
    </style>
*/
d3sparql.treemapzoom = function(json, config) {
  config = config || {}

  var tree = (json.head && json.results) ? d3sparql.tree(json, config) : json

  var opts = {
    "width": config.width || 800,
    "height": config.height || 500,
    "margin": config.margin || {
        top: 25,
        right: 0,
        bottom: 0,
        left: 0
    },
    "color": config.color || d3.scale.category20(),
    "format": config.format || d3.format(",d"),
    "selector": config.selector || null
  }

  var width = opts.width - opts.margin.left - opts.margin.right
  var height = opts.height - opts.margin.top - opts.margin.bottom
  var color = opts.color
  var format = opts.format
  var transitioning

  var x = d3.scale.linear().domain([0, width]).range([0, width])
  var y = d3.scale.linear().domain([0, height]).range([0, height])

  var treemap = d3.layout.treemap()
    .children(function(d, depth) {
      return depth ? null : d.children
    })
    .sort(function(a, b) {
      return a.value - b.value
    })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false)

  var svg = d3sparql.select(opts.selector, "treemapzoom").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height)
    .style("margin-left", -opts.margin.left + "px")
    .style("margin.right", -opts.margin.right + "px")
    .append("g")
    .attr("transform", "translate(" + opts.margin.left + "," + opts.margin.top +
      ")")
    .style("shape-rendering", "crispEdges")

  var grandparent = svg.append("g")
    .attr("class", "grandparent")

  grandparent.append("rect")
    .attr("y", -opts.margin.top)
    .attr("width", width)
    .attr("height", opts.margin.top)
    .attr("fill", "#666666")

  grandparent.append("text")
    .attr("x", 6)
    .attr("y", 6 - opts.margin.top)
    .attr("dy", ".75em")
    .attr("stroke", "#ffffff")
    .attr("fill", "#ffffff")

  initialize(tree)
  layout(tree)
  display(tree)

  function initialize(tree) {
    tree.x = tree.y = 0
    tree.dx = width
    tree.dy = height
    tree.depth = 0
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d.children) {
      treemap.nodes({
        children: d.children
      })
      d.children.forEach(function(c) {
        c.x = d.x + c.x * d.dx
        c.y = d.y + c.y * d.dy
        c.dx *= d.dx
        c.dy *= d.dy
        c.parent = d
        layout(c)
      })
    }
  }

  function display(d) {
    grandparent
      .datum(d.parent)
      .on("click", transition)
      .select("text")
      .text(name(d))

    var g1 = svg.insert("g", ".grandparent")
      .datum(d)
      .attr("class", "depth")

    var g = g1.selectAll("g")
      .data(d.children)
      .enter()
      .append("g")

    g.filter(function(d) {
      return d.children
    })
      .classed("children", true)
      .on("click", transition)

    g.selectAll(".child")
      .data(function(d) {
        return d.children || [d]
      })
      .enter()
      .append("rect")
      .attr("class", "child")
      .call(rect)

    g.append("rect")
      .attr("class", "parent")
      .call(rect)
      .append("title")
      .text(function(d) {
        return format(d.value)
      })

    g.append("text")
      .attr("dy", ".75em")
      .text(function(d) {
        return d.name
      })
      .call(text)

    function transition(d) {
      if (transitioning || !d) return
      transitioning = true
      var g2 = display(d),
        t1 = g1.transition().duration(750),
        t2 = g2.transition().duration(750)

      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx])
      y.domain([d.y, d.y + d.dy])

      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null)

      // Draw child nodes on top of parent nodes.
      svg.selectAll(".depth").sort(function(a, b) {
        return a.depth - b.depth
      })

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0)

      // Transition to the new view.
      t1.selectAll("text").call(text).style("fill-opacity", 0)
      t2.selectAll("text").call(text).style("fill-opacity", 1)
      t1.selectAll("rect").call(rect)
      t2.selectAll("rect").call(rect)

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges")
        transitioning = false
      })
    }
    return g
  }

  function text(text) {
    text.attr("x", function(d) {
      return x(d.x) + 6
    })
      .attr("y", function(d) {
        return y(d.y) + 6
      })
  }

  function rect(rect) {
    rect.attr("x", function(d) {
      return x(d.x)
    })
      .attr("y", function(d) {
        return y(d.y)
      })
      .attr("width", function(d) {
        return x(d.x + d.dx) - x(d.x)
      })
      .attr("height", function(d) {
        return y(d.y + d.dy) - y(d.y)
      })
      .attr("fill", function(d) {
        return color(d.name)
      })
    rect.attr({
      "stroke": "#ffffff",
      "stroke-width": "1px",
      "opacity": 0.8,
    })
  }

  function name(d) {
    return d.parent ?
      name(d.parent) + " / " + d.name :
      d.name
  }
}

/*
  World Map spotted by coordinations (longitude and latitude)

  Options:
    config = {
      "var_lat":  "lat",     // SPARQL variable name for latitude (optional; default is the 1st variable)
      "var_lng":  "lng",     // SPARQL variable name for longitude (optional; default is the 2nd variable)
      "width":    960,       // canvas width (optional)
      "height":   480,       // canvas height (optional)
      "radius":   5,         // circle radius (optional)
      "color":    "#FF3333,  // circle color (optional)
      "topojson": "path/to/world-50m.json",  // TopoJSON file
      "selector": "#result"
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      d3sparql.coordmap(json, config = {})
    }

  Dependencies:
    * topojson.js
      * Download from http://d3js.org/topojson.v1.min.js
      * Put <script src="topojson.js"></script> in the HTML <head> section
    * world-50m.json
      * Download from https://github.com/mbostock/topojson/blob/master/examples/world-50m.json
*/
d3sparql.coordmap = function(json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings

  var opts = {
    "var_lat": config.var_lat || head[0] || "lat",
    "var_lng": config.var_lng || head[1] || "lng",
    "width": config.width || 960,
    "height": config.height || 480,
    "radius": config.radius || 5,
    "color": config.color || "#FF3333",
    "topojson": config.topojson || "world-50m.json",
    "selector": config.selector || null
  }

  var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([opts.width / 2, opts.height / 2])
    .precision(.1);
  var path = d3.geo.path()
    .projection(projection);
  var graticule = d3.geo.graticule();
  var svg = d3sparql.select(opts.selector, "coordmap").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height);

  svg.append("path")
    .datum(graticule.outline)
    .attr("fill", "#a4bac7")
    .attr("d", path);

  svg.append("path")
    .datum(graticule)
    .attr("fill", "none")
    .attr("stroke", "#333333")
    .attr("stroke-width", ".5px")
    .attr("stroke-opacity", ".5")
    .attr("d", path);

  d3.json(opts.topojson, function(error, world) {
    svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("fill", "#d7c7ad")
      .attr("stroke", "#766951")
      .attr("d", path);

    svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
        return a !== b
      }))
      .attr("class", "boundary")
      .attr("fill", "none")
      .attr("stroke", "#a5967e")
      .attr("stroke-width", ".5px")
      .attr("d", path);

    svg.selectAll(".pin")
      .data(data)
      .enter().append("circle", ".pin")
      .attr("fill", opts.color)
      .attr("r", opts.radius)
      .attr("stroke", "#455346")
      .attr("transform", function(d) {
        return "translate(" + projection([
            d[opts.var_lng].value,
            d[opts.var_lat].value
          ]) + ")"
      });
  });
}

/*
  World Map colored by location names defined in a TopoJSON file

  Options:
    config = {
      "label":       "name",    // SPARQL variable name for location names (optional; default is the 1st variable)
      "value":       "size",    // SPARQL variable name for numerical values (optional; default is the 2nd variable)
      "width":       1000,      // canvas width (optional)
      "height":      1000,      // canvas height (optional)
      "color_max":   "blue",    // color for maximum value (optional)
      "color_min":   "white",   // color for minimum value (optional)
      "color_scale": "linear"   // color scale (optional; "linear" or "log")
      "topojson":    "path/to/japan.topojson",  // TopoJSON file
      "mapname":     "japan",   // JSON key name of a map location root (e.g., "objects":{"japan":{"type":"GeometryCollection", ...)
      "keyname":     "name",    // JSON key name of map locations matched with "label" (e.g., "properties":{"name":"Tokyo", ...)
      "center_lat":  34,        // latitude for a map location center (optional; default is 34 for Japan)
      "center_lng":  137,       // longitude for a map location center (optional; default is 137 for Japan)
      "scale":       10000,     // scale of rendering (optional)
      "selector":    "#result"
    }

  Synopsis:
    d3sparql.query(endpoint, sparql, render)

    function render(json) {
      d3sparql.namedmap(json, config = {})
    }

  Dependencies:
    * topojson.js
      * Download from http://d3js.org/topojson.v1.min.js
      * Put <script src="topojson.js"></script> in the HTML <head> section
    * japan.topojson
      * Download from https://github.com/sparql-book/sparql-book/blob/master/chapter5/D3/japan.topojson
*/
d3sparql.namedmap = function(json, config) {
  config = config || {}

  var head = json.head.vars
  var data = json.results.bindings

  var opts = {
    "label": config.label || head[0] || "label",
    "value": config.value || head[1] || "value",
    "width": config.width || 1000,
    "height": config.height || 1000,
    "color_max": config.color_max || "red",
    "color_min": config.color_min || "white",
    "color_scale": config.color_scale || "log",
    "topojson": config.topojson || "japan.topojson",
    "mapname": config.mapname || "japan",
    "keyname": config.keyname || "name_local",
    "center_lat": config.center_lat || 34,
    "center_lng": config.center_lng || 137,
    "scale": config.scale || 10000,
    "selector": config.selector || null
  }

  var size = d3.nest()
    .key(function(d) {
      return d[opts.label].value
    })
    .rollup(function(d) {
      return d3.sum(d, function(d) {
        return parseInt(d[opts.value].value)
      })
    }).map(data, d3.map)
  var extent = d3.extent((d3.map(size).values()))

  if (d3sparql.debug) {
    console.log(JSON.stringify(size))
  }

  var svg = d3sparql.select(opts.selector, "namedmap").append("svg")
    .attr("width", opts.width)
    .attr("height", opts.height)

  d3.json(opts.topojson, function(topojson_map) {
    var geo = topojson.object(topojson_map, topojson_map.objects[opts.mapname])
      .geometries
    var projection = d3.geo.mercator()
      .center([opts.center_lng, opts.center_lat])
      .translate([opts.width / 2, opts.height / 2])
      .scale(opts.scale)
    var path = d3.geo.path().projection(projection)
    switch (opts.color_scale) {
      case "log":
        var scale = d3.scale.log()
        break
      default:
        var scale = d3.scale.linear()
        break
    }
    var color = scale.domain(extent).range([opts.color_min, opts.color_max])

    svg.selectAll("path")
      .data(geo)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .style("fill", function(d, i) {
        // map SPARQL results to colors
        return color(size[d.properties[opts.keyname]])
      })

    svg.selectAll(".place-label")
      .data(geo)
      .enter()
      .append("text")
      .attr("font-size", "8px")
      .attr("class", "place-label")
      .attr("transform", function(d) {
        var lat = d.properties.latitude
        var lng = d.properties.longitude
        return "translate(" + projection([lng, lat]) + ")"
      })
      .attr("dx", "-1.5em")
      .text(function(d) {
        return d.properties[opts.keyname]
      })
  })
}

d3sparql.select = function(selector, type) {
  if (selector) {
    return d3.select(selector).html("").append("div").attr("class",
      "d3sparql " + type)
  } else {
    return d3.select("body").append("div").attr("class", "d3sparql " + type)
  }
}

/* Helper function only for the d3sparql web site */
d3sparql.toggle = function() {
  var button = d3.select("#button")
  var elem = d3.select("#sparql")
  if (elem.style("display") === "none") {
    elem.style("display", "inline")
    button.attr("class", "icon-chevron-up")
  } else {
    elem.style("display", "none")
    button.attr("class", "icon-chevron-down")
  }
}

/* for IFRAME embed */
d3sparql.frameheight = function(height) {
  d3.select(self.frameElement).style("height", height + "px")
}

/* for Node.js */
//module.exports = d3sparql
