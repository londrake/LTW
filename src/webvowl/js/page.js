
module.exports = function () {
	var page = {},
        graph,
        clickedNode;
        
        
		



page.initialize=function(g,c){
    this.graph=a;
    this.clickedNode=c;   
}

page.htmlCreator=function(oDom){
    
    var mainDiv = oDom.document.getElementById("maindiv");
    
    //odom.get elemetbyid("myid").value ottenere i valori dalla textbox
    var div =oDom.document.createElement("div");
    var input =oDom.document.createElement("input");
    var span =oDom.document.createElement("span");
   
    span.innerHTML="ciao";
    span.appendChild(input);  
    
    div.setAttribute("id","provaid");   
    div.appendChild(span);
    mainDiv.appendChild(div);
    
    
    
}





return page;
}