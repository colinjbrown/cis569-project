
$(document).ready(function(){


    // dims
        var margin = { top: 20, right: 0, bottom: 50, left: 50 },
            svg_dx = 800,
            svg_dy = 400,
            plot_dx = svg_dx - margin.right - margin.left,
            plot_dy = svg_dy - margin.top - margin.bottom;

        // scales
        var x = d3.scaleLinear().range([margin.left, plot_dx]),
            y = d3.scaleLinear().range([plot_dy, margin.top]);

        var svg = d3.select("#clusters")
                    .append("svg")
                    .attr("width", svg_dx)
                    .attr("height", svg_dy);

        var hulls = svg.append("g")
                       .attr("id", "hulls");

        var circles = svg.append("g")
                         .attr("id", "circles");


        var num_clusters = 3;

        // Choosing 5 clusters based on the number of Cylinders
        // Choosing 3 clusters can be interesting for trying to differentiate country of origin
        //After choosing different cluster values 3 seems to provide the most interesting results
        //due to low value counts of certain cylinder values
        var clusters = d3.range(0, num_clusters).map((n) => n.toString());

        // costs for each iteration
        var costs = [];

        hulls.selectAll("path")
             .data(clusters)
             .enter()
             .append("path")
             .attr("class", "hull")
             .attr("id", d => "hull_" + d)
            .on('mouseover',function (f) {
                console.log(f);
                console.log(this);
            });



    d3.json("https://raw.githubusercontent.com/colinjbrown/cis569-project1/master/reduced-data.json").then(function(data) {


        var docs = Object.keys(data);

        var doc_list = d3.select('ul').selectAll('li').data(docs);

        /*
        Just so you know the replace ('.','') is to ensure that the id meets css id valid standards in HTML4
        ID and NAME tokens must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods (".").
         */

        doc_list
            .enter()
            //Creat document id in the list for each document.
            .append('li')
            .append('p').attr('id',function (d) {
                return d.replace('.','')+'-li';
            })
            .classed('documentid', true)
            .classed('list-group-item',true)
            .html(function (d) {
                return d;
            })
            //let the ID highlight when the mouse on it.
            .on('mouseover', function () {
            $(this).toggleClass("hover", true);
            })
            .on('mouseout', function () {
                $(this).toggleClass("hover", false);
            })
            //display or delete the document in the workplace by click the document ID.
            .on('click', function(d)
                {
                    //if the document item don't be displaied, display it.
                    if($("#" + d.replace('.','')).length == 0) {
                        //try to creat the document in the workplace.
                        doc_div = d3.select('#wp').append('div').classed('drag',true).classed('card',true).attr('id',function (){return d.replace('.','');});

                        doc_div.append('h3').html(d).classed('card-header',true).classed('primary-color',true).classed('white-text',true).classed('label',true);

                        doc_div.append('div').classed('card-body',true).html(function () {
                            return data[d]["Text"];
                        })
                        //let the document item can be draggable in the workplace, and user can delete it by double click.
                        $('#'+d.replace('.','')).unbind('draggable').draggable({stack:'.drag',containment: "parent"}).dblclick(function(){
                            $(this).remove();
                            $('#'+d.replace('.','')+'-li').toggleClass('active'); //Change the color of the ID box.
                            //$("#p1").css("background-color", "#aaa");
                        });
                    }
                    //if the document has been displaied, delete it.
                    else{
                        $('#'+d.replace('.','')).remove();
                    }
                    $('#'+d.replace('.','')+'-li').toggleClass('active');
                }
            );



        //Change data representation for easier plotting
        //This also uses the ... (spread) operator which is part of ES6
        var d = Object.keys(data).map(function(f){return {'File Name':f, ...data[f]};})

        //Map principal components to x and y
            d.forEach(d => {
                d.x = +d.tsne0;
                d.y = +d.tsne1;
            });

            setScaleDomains(d);
            plotCircles(d);

            //To start off with our initial K-means we randomly assign centroids for each of our num_clusters
            var initialCentroids = clusters.map(() => d[Math.round(d3.randomUniform(0, d.length)())]);


            assignCluster(initialCentroids);
            addHull();

            costs.push(computeCost());

            var iterate = d3.interval(() => {

                var c = computeCentroids();

                assignCluster(c);
                addHull();

                var cost = computeCost();

                // stop iterating when algorithm coverges to local minimum
                if (cost == costs[costs.length - 1]) {

                    displayStats(costs);
                    iterate.stop();
                }

                costs.push(cost)

            }, 500);


        });

        function displayStats(costs) {

            var stats = svg.append("g")
                           .attr("id", "stats");

            var formatMin = d3.format(".4");

            var n_iters = stats.append("text")
                               .attr("x", 10)
                               .attr("y", 20);

            n_iters.append("tspan")
                   .style("font-weight", "bold")
                   .text("Num. Iterations: ");

            n_iters.append("tspan")
                   .text(costs.length);

            var cost = stats.append("text")
                            .attr("x", 10)
                            .attr("y", 40);

            cost.append("tspan")
                .style("font-weight", "bold")
                .text("Local Minimum: ");

            cost.append("tspan")
                .text(formatMin(costs[costs.length - 1]));

        }

        function computeCentroids() {

            var centroids = clusters.map(cluster => {

                var d = d3.selectAll(".cluster_" + cluster)
                          .data(),
                    n = d.length;

                var x_sum = d3.sum(d, d => d.x),
                    y_sum = d3.sum(d, d => d.y);

                return { x:(x_sum / n), y:(y_sum / n) };

            });

            return centroids;
        }

        function addHull() {

            clusters.forEach(cluster => {

                // parse cluster data
                var d_cluster = d3.selectAll(".cluster_" + cluster)
                                  .data()
                                  .map((datum) => [x(datum.x), y(datum.y)]);

                // path given data points for cluster
                var d_path = d3.polygonHull(d_cluster);

                var color = d3.schemeCategory10[+cluster];

                // ref: https://bl.ocks.org/mbostock/4341699
                d3.select("#hull_" + cluster)
                  .attr("id", "hull_" + cluster)
                  .transition()
                  .duration(250)
                  .attr("d", d_path === null ? null : "M" + d_path.join("L") + "Z")
                  .attr("fill", color)
                  .style("stroke", color);
            });
        }

        function computeCost() {

            var dists = d3.selectAll("circle")
                          .data()
                          .map(d => d._dist);

            return d3.sum(dists);
        }

        function assignCluster(centroids) {

            d3.selectAll("circle")
              .each(function(d) {

                // distances of data point from all centroids
                var dists = computeDistances(centroids, d);

                // min. distance defines cluster number
                var dist_min = d3.min(dists);
                var cluster_num = dists.findIndex(dist => dist == dist_min);

                var color = d3.schemeCategory10[cluster_num];

                // stash min. distance to compute cost
                d._dist = dist_min;

                // assign data point to cluster of minimum distance
                d3.select(this)
                  .attr("fill", d3.color(color).brighter(0.5))
                  .attr("class", "pt cluster_" + cluster_num);
            });
        }

        function computeDistances(centroids, d_pt) {

            var dists = centroids.map(centroid => {
                var dist = Math.sqrt(Math.pow(d_pt.x - centroid.x, 2) + Math.pow(d_pt.y - centroid.y, 2));
                return dist;
            })
            return dists;
        }

        function setScaleDomains(d) {

            console.log(d3.extent(d,d => d.x));
            console.log(d3.extent(d,d => d.y));
             x.domain(d3.extent(d, d => d.x));
             y.domain(d3.extent(d, d => d.y));
        }

        function plotCircles(d) {

            circles.selectAll("circle")
                   .data(d)
                   .enter()
                   .append("circle")
                   .attr("class", "pt")
                   .attr("r", 5)
                   .attr("cx", (d) => x(d.x))
                   .attr("cy", (d) => y(d.y))
            .on("mouseover",function (d) {
                $('#details').empty();
                Object.keys(d).map(function (a) {
                    var detailpanel = d3.select('#details');
                    detailpanel.append('p').text(a +': '+ d[a]);
                });
            });
        }





    //$( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        //let the IDs in the list can be ordered by mouse.
        $( "#sortable" ).sortable();
        $( "#sortable" ).disableSelection();

    });

