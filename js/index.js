//Colin Brown
//Rui Ming

//For hull k-means code please see
//http://bl.ocks.org/feyderm/75c18a9143aac50a24e392762f10d6a4

$(document).ready(function(){

    //Add clear button to empty workspace fast
    $( function() {
    $( "#clear" ).button();
    $( "#clear" ).click( function( event ) {
      $('.drag.card').remove();
      $('#sortable li p').toggleClass('active',false);
    } );
  } );

    // Initalize widgets
    $( "input" ).checkboxradio();
    $( ".plots").controlgroup();
    $( ".plots input" ).toggleClass('isDisabled',true);

        //Ensure active documents are still highlighted in the list post sort
        function resetActives(){
            var opendocs = $('#wp').find('.drag');
            if(opendocs.length){
                //This was a fun little piece of code to write, it just grabs the ids of all open docs
                // and toggles their respective list items on
                opendocs.map(function(a,b,c){$('#'+$(b).prop('id')+'-li').toggleClass('active')});
            }
        }

        var done = false;
        var original_order, tsne_x, tsne_y;


        var data_obj;

        var data_cluster = {};

        var keymaps = {'tsne':{'x':'tsne0','y':'tsne1'},'mds':{'x':'mds0','y':'mds1'},'pca':{'x':'pc0','y':'pc1'}};

    // dims
        var margin = { top: 60, right: 0, bottom: 50, left: 50 },
            svg_dx = 600,
            svg_dy = 600,
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


        var num_clusters = 7;


        var clusters = d3.range(0, num_clusters).map((n) => n.toString());

        // costs for each iteration
        var costs = [];


        function add_initial_hulls(){
            hulls.selectAll("path")
                 .data(clusters)
                 .enter()
                 .append("path")
                 .attr("class", "hull")
                 .attr("id", d => "hull_" + d)
                .on('mouseover',function (f) {
                    d3.selectAll('.cluster_'+f).attr('stroke','black');
                }).on('mouseout',function (f) {
                    d3.selectAll('.cluster_'+f).attr('stroke','none');
            }).on('click',function (f) {

                d3.selectAll('.cluster_'+f).data().forEach(function (d) {
                    openWSDocument(false,d['File Name'],d['Text']);
                });
            });
        }

        add_initial_hulls();

        function openWSDocument(removeFlag,d,text)
        {
            //if the document item isn't displayed, display it.
                    if($("#" + d.replace('.','')).length == 0) {
                        //try to creat the document in the workplace.
                        doc_div = d3.select('#wp').append('div').classed('drag',true).classed('card',true).attr('id',function (){return d.replace('.','');});

                        doc_div.append('h3').html(d).classed('card-header',true).classed('primary-color',true).classed('white-text',true).classed('label',true);

                        doc_div.append('div').classed('card-body',true).html(function () {
                            return text;
                        })
                        //let the document item can be draggable in the workplace, and user can delete it by double click.
                        $('#'+d.replace('.','')).unbind('draggable').draggable({stack:'.drag',containment: "parent"}).dblclick(function(){
                            $(this).remove();
                            $('#'+d.replace('.','')+'-li').toggleClass('active'); //Change the color of the ID box.
                        });
                    }
                    //if the document has been displaied, delete it.
                    else if (removeFlag){
                        $('#'+d.replace('.','')).remove();
                    }
                    else{
                        //Don't change active class if we're clicking a cluster
                        return;
                    }
                    $('#'+d.replace('.','')+'-li').toggleClass('active');
        }

    d3.json("https://raw.githubusercontent.com/colinjbrown/cis569-project1/master/reduced-data.json").then(function(data) {

        function make_list(docs) {

            var doc_list = d3.select('ul').selectAll('li').data(docs, function(d){return d;});


            doc_list
                .enter()
                //Creat document id in the list for each document.
                .append('li')
                .append('p').attr('id', function (d) {
                return d.replace('.', '') + '-li';
            })
                .classed('documentid', true)
                .classed('list-group-item', true)
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
                .on('click', function (d) {
                        openWSDocument(true, d, data[d]['Text']);

                    }
                ).style("color",function (d) {

                    if(done){
                        return d3.schemeCategory10[data_cluster[d]];
                    }
                    return "black";
            });

            resetActives();
        }

        original_order = Object.keys(data);

        make_list(original_order);

        $( function() {
            //Don't enable until after creating clusters
            $( "#sort" ).button();
            $("#sort").toggleClass('isDisabled',true);
            $( "#sort" ).click( function( event ) {

                if($("#sort").hasClass('isDisabled') == false){
                  $('#sortable').empty();
                  //Creates a new mapping based on clusters
                  var newmap = Array.apply(null, {length: num_clusters}).map(Number.call, Number).reduce(function (p1, p2, p3) { return [...p1, ...d3.selectAll('.cluster_'+p2).data().map(d => d['File Name'])]; },[]);
                  make_list(newmap);
                }

            } );
          } );

        $( function() {
            //Don't enable until after creating clusters
            $( "#reset" ).button();
            $( "#reset" ).click( function( event ) {

                  $('#sortable').empty();
                  make_list(original_order);

            } );
          } );

        /*
        Just so you know the replace ('.','') is to ensure that the id meets css id valid standards in HTML4
        ID and NAME tokens must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods (".").
         */

        //Change data representation for easier plotting
        //This also uses the ... (spread) operator which is part of ES6
        data_obj = Object.keys(data).map(function(f){return {'File Name':f, ...data[f]};})

        //use a closure here since we want to do multiple sorts
        function create_compare(key){
            function compare(a, b) {
                const  obja = a[key];
                const objb = b[key];
    
              let comparison = 0;
              if (obja > objb) {
                comparison = 1;
              } else if (obja < objb) {
                comparison = -1;
              }
              return comparison;
            }
        return compare
        }





        function start_clustering(keymap,d){

            tsne_x = d.sort(create_compare(keymap['x'])).map(d => d['File Name']);

            tsne_y = d.sort(create_compare(keymap['y'])).map(d => d['File Name']);

            [{'id':'#tsnex','value':tsne_x},{'id':'#tsney','value':tsne_y}].forEach(
                function(obj){
                    $( function() {
                        //Don't enable until after creating clusters
                        $(obj.id ).button();
                        $( obj.id ).click( function( event ) {
                              console.log(obj.id);
                              $('#sortable').empty();
                              make_list(obj.value);

                        } );
                      } );
                });

            //Map principal components to x and y
                d.forEach(d => {
                    d.x = +d[keymap['x']];
                    d.y = +d[keymap['y']];
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


        }

        start_clustering(keymaps['tsne'],data_obj);

        function restart_clustering(d){
            $('#viz svg g').empty();
            add_initial_hulls();
            done = false;
            $("#sort").toggleClass('isDisabled',true);
            $('.plots input').toggleClass('isDisabled',true);
            start_clustering(keymaps[this.id],data_obj);
        }

        $('.plots input').on("change",restart_clustering);

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


            //Enable sorting
            $("#sort").toggleClass('isDisabled',false);

            //Enable switching plot type
            $("input").toggleClass('isDisabled',false);

            //This is my favorite piece of code I've ever written...
            //This creates a dictionary of final clusters and filenames
            data_cluster = Array.apply(null, {length: num_clusters}).map(Number.call, Number).reduce(function (p1, p2, p3) { return Object.assign({},p1,[,...d3.selectAll('.cluster_'+p2).data().map(d => d['File Name'])].reduce(function(a,d){a[d] = p2; return a},{})); },[]);


            done=true;


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

                d3.select('#'+d['File Name']+'-li').style('color',d3.color(color).brighter(0.5));
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
                d3.select(this).attr('stroke','black');
                $('#'+(d['File Name'])+'-li').toggleClass('active-doc',true);
                Object.keys(d).map(function (a) {
                    var detailpanel = d3.select('#details');
                    detailpanel.append('p').text(a +': '+ d[a]);
                });
            })
            .on("mouseout",function (d){
                d3.select(this).attr('stroke','none');
                $('#'+(d['File Name'])+'-li').toggleClass('active-doc',false);
            })
            .on("click",function (d){
                openWSDocument(false,d['File Name'],d['Text']);
            });
        }

    //$( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        //let the IDs in the list can be ordered by mouse.
        $( "#sortable" ).sortable();
        $( "#sortable" ).disableSelection();

    });
