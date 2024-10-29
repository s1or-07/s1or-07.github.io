$(document).ready(function(){
    $('.no').on("click", function(){
        $('#f1').css('display', 'none');
        $('#f2').css('display', 'flex'); 
    })
    
    $('.weno').on("click", function(){ 
        $('#f2').css('display', 'none');
        $('#f3').css('display', 'flex');  
    });
      
    $('.si').on("click", function(){ 
        $('#f1').css('display', 'none');
        $('#f3').css('display', 'flex');  
    });
      
    $('.dale').on("click", function(){ 
        $('#f3').css('display', 'none');
        $('#f4').css('display', 'flex');  
    });
      
    $('.rega').on("click", function(){ 
        $('#f4').css('display', 'none');
        $('#f5').css('display', 'flex');  
    });
      
    $('.ojo').on("click", function(){ 
        $('#f5').css('display', 'none');
        $('#f6').css('display', 'flex');  
    });
      
    $('.ojo').on("click", function(){ 
        $('#f5').css('display', 'none');
        $('#f6').css('display', 'flex');  
    });
      
    $('.afi').on("click", function(){ 
        $('#f6').css('display', 'none');
        $('#f7').css('display', 'flex');
        $('#f8').css('display', 'flex');  
    });
      
    $('.salu').on("click", function(){ 
        $('#f8').css('display', 'none');
        $('#f9').css('display', 'flex');  
    });
      
    $('.copy').on("click", function(){ 
        $('#f9').css('display', 'none');
        $('#f10').css('display', 'flex');
        $('#f11').css('display', 'flex');
    });
      
    $('span.go').on("click", function(){ 
        $('#f13').css('display', 'none');
        $('#f14').css('display', 'block');   
    });
      
    $('.ca1').on("click", function(){ 
        $('#f12').css('display', 'flex'); 
        $('#f13').css('display', 'block'); 
    });
      
    $('.ca3').on("click", function(){ 
        $('#f15').css('display', 'block'); 
        $('#f16').css('display', 'flex'); 
    });
      
    $('.ca2').on("click", function(){ 
        $('#f18').css('display', 'block'); 
        $('#f19').css('display', 'flex'); 
    });
      
    $('.carta').on("click", function(){ 
        $('#f12').css('display', 'none'); 
    });
       
    $('.anillo').on("click", function(){ 
        $('#f16').css('display', 'none');
        $('#f17').css('display', 'flex');
    });
      
    $('.marry').on("click", function(){ 
        $('#f15').css('display', 'none');
        $('#f17').css('display', 'none');
    });
       
    $('.meme').on("click", function(){ 
        $('#f19').css('display', 'none');
        $('#f20').css('display', 'flex');
    });
      
    $('.meme2').on("click", function(){ 
        $('#f20').css('display', 'none');
        $('#f21').css('display', 'flex');
    });
      
    $('.yes').on("click", function(){ 
        $('#f21').css('display', 'none');
        $('#f22').css('display', 'flex');
    });
})