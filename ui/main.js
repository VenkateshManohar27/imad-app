console.log('Loaded!');


var buttonEle = document.getElementById('counter');
var counter = 0;
buttonEle.onclick = function(){
    
    //Create a request Object
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function(){
        if(request.readyState=== XMLHttpRequest.DONE){
            if(request.status ===200){
                counter = request.responseText;
                var span = document.getElementById('count');
                span.innerHTML = counter;
    
            }
        }
    };
    
    request.open('GET',"http://venkateshmanohar.imad.hasura-app.io/counter", true);
    
    request.send(null);
};

var submitBtn = document.getElementById('submit_btn');

submitBtn.onclick=function(){
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    var request = new XMLHttpRequest();
   
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                var nameList = request.responseText;
                nameList = JSON.parse(nameList);
                var list = document.getElementById('nameList');
                var finalStr="";
                for(var i=0;i<nameList.length;i++){
                    finalStr +="<li>"+nameList[i]+"</li>";
                }
                list.innerHTML=finalStr;
            }
        }
    };
    
    request.open('GET',"http://venkateshmanohar.imad.hasura-app.io/submit-btn?name="+name, true)
    request.send(null);
    
};


/*submitBtn.onclick=function(){
    var nameList =['Name 1','Name 2','Name 3'];
    
    var list = document.getElementById('nameList');
    var finalStr="";
    for(var i=0;i<nameList.length;i++){
        finalStr +="<li>"+nameList[i]+"</li>";
    }
    list.innerHTML=finalStr;
}*/

/*var element = document.getElementById('madi');

var marginLeft = 0;
function moveRight(){
    
    marginLeft = marginLeft+1;
    element.style.marginLeft = marginLeft+'px';
}

element.onclick = function(){
   var interval =  setInterval(moveRight,50);
}*/
