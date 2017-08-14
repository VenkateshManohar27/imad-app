console.log('Loaded!');
var element = document.getElementById('madi');

var marginLeft = 0;
function moveRight(){
    
    marginLeft = marginLeft+1;
    element.style.marginLeft = marginLeft+'px';
}

element.onclick = function(){
   var interval =  setInterval(moveRight,50);
}

var buttonEle = document.getElementById('counter');
var counter = 0;
buttonEle.onclick = function(){
    counter = counter+1;
    var span = document.getElementById('count');
    span.innerHTML = counter;
    
}

