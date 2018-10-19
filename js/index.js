
$(document).ready(function(){
    $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});

    $(".documentid").hover(function(){
        $(this).css("background-color", "#ccc");
    },
    function(){
        $(this).css("background-color", "#aaa");
    });

    $( function(){
        $( "#sortable" ).sortable();
        $( "#sortable" ).disableSelection();
    });
     

    $("#p1").click(function (){
    
        $("#wp").append(" <div class='drag'>document 1</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){
            $(this).hide();
            $("#p1").css("background-color", "#aaa");
           
        });
        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });

    $("#p2").click(function(){
    
        $("#wp").append(" <div class='drag'>document 2</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){$(this).hide();});
        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });

    $("#p3").click(function(){
    
        $("#wp").append(" <div class='drag'>document 3</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){$(this).hide();});
        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });

    $("#p4").click(function(){
    
        $("#wp").append(" <div class='drag'>document 4</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){$(this).hide();});
        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });

    $("#p5").click(function(){
    
        $("#wp").append(" <div class='drag'>document 5</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){$(this).hide();});
        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });
    
    $("#p6").click(function(){
    
        $("#wp").append(" <div class='drag'>document 6</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){$(this).hide();});
        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });

    $("#p7").click(function(){
    
        $("#wp").append(" <div class='drag'>document 7</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){$(this).hide();});
        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });

    $("#p8").click(function(){
    
        $("#wp").append(" <div class='drag'>document 8</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){$(this).hide();});
        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });

    $("#p9").click(function(){
    
        $("#wp").append(" <div class='drag'>document 9</div>");
        $( ".drag" ).unbind("draggable").draggable({ containment: "parent"});
        $(".drag").dblclick(function(){$(this).hide();});

        $(this).css("background-color", "#ccc");
        
        $(this).unbind("click").click();

        $(this).unbind("mouseenter").mouseenter();

        $(this).unbind("mouseleave").mouseleave();
    });

    
    
});