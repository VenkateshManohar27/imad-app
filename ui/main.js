console.log('Loaded!');
alert('Hello Users');
var element = document.getElementById('madi');

var marginLeft = 0;
function moveRight(){
    
    marginLeft = marginLeft+1;
    element.style.marginLeft = marginLeft+' px';
}

element.onclick = function(){
    setInterval(moveRight,50);
}
