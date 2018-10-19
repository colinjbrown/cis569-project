
$(document).ready(function(){

    d3.json("https://raw.githubusercontent.com/colinjbrown/cis569-project1/master/data/data.json").then(function(data) {


        var docs = Object.keys(data);

        var doc_list = d3.select('ul').selectAll('li').data(docs);

        /*
        Just so you know the replace ('.','') is to ensure that the id meets css id valid standards in HTML4
        ID and NAME tokens must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods (".").
         */

        doc_list
            .enter()
            .append('li')
            .append('p').attr('id',function (d) {
                return d.replace('.','')+'-li';
            })
            .classed('documentid', true)
            .html(function (d) {
                return d;
            }).on('mouseover', function () {
            $(this).toggleClass("hover", true);
            })
            .on('mouseout', function () {
                $(this).toggleClass("hover", false);
            })
            .on('click', function(d)
                {
                    if($("#" + d.replace('.','')).length == 0) {

                        d3.select('#wp').append('div').classed('drag',true).html(function () {
                            return data[d];
                        }).attr('id',function (){return d.replace('.','');});

                        $('#'+d.replace('.','')).unbind('draggable').draggable({containment: "parent"}).dblclick(function(){
                            $(this).remove();
                            $('#'+d.replace('.','')+'-li').toggleClass('active-doc');
                            //$("#p1").css("background-color", "#aaa");
                        });
                    }
                    else{
                        $('#'+d.replace('.','')).remove();
                    }
                    $('#'+d.replace('.','')+'-li').toggleClass('active-doc');
                }
            )
        ;

    //$( ".drag" ).unbind("draggable").draggable({ containment: "parent"});

        $( "#sortable" ).sortable();
        $( "#sortable" ).disableSelection();

    });

    
});