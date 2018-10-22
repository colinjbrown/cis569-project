
$(document).ready(function(){

    d3.json("https://raw.githubusercontent.com/colinjbrown/cis569-project1/master/data.json").then(function(data) {


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
                            return data[d];
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
            )
        ;

    //$( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        //let the IDs in the list can be ordered by mouse.
        $( "#sortable" ).sortable();
        $( "#sortable" ).disableSelection();

    });

    
});