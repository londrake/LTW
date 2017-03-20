
module.exports = function () {
	var page = {},
        grafo,
        myparser=require("./myparser")();
        
        
		



page.initialize=function(g){
    this.grafo=g;
    //this.myparser.start();   
}


page.htmlCreator=function(oDom, insert,nodo){
    
    myparser.start();
    
    //insert= true : inserimento, altriment è edit
    var mainDiv = oDom.document.getElementById("maindiv");
    
    //odom.get elemetbyid("myid").value ottenere i valori dalla textbox
    var div =oDom.document.createElement("div");
    var input =oDom.document.createElement("input");
    var span =oDom.document.createElement("span");
    // creazione della pagina popup con gli elementi gestiti e relativi id
    span.setAttribute("class", "text");
    span.innerHTML="Name";    
    input.setAttribute("id","name");
    span.appendChild(input);    
    div.appendChild(span);        
    mainDiv.appendChild(div);
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Type";
    input =oDom.document.createElement("input");
    input.setAttribute("id","type");
    span.appendChild(input);
    div.appendChild(span);
    mainDiv.appendChild(div);
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Comment";
    input =oDom.document.createElement("input");
    input.setAttribute("id","comment");
    span.appendChild(input);
    div.appendChild(span);
    mainDiv.appendChild(div);
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Disjoint";
    input =oDom.document.createElement("input");
    input.setAttribute("id","disjoint");
    span.appendChild(input);
    div.appendChild(span);
    mainDiv.appendChild(div);
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="SubClassOf";
    input =oDom.document.createElement("input");
    input.setAttribute("id","subclassof");
    span.appendChild(input);
    div.appendChild(span);
    mainDiv.appendChild(div);
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Equivalent";
    input =oDom.document.createElement("input");
    input.setAttribute("id","equivalent");
    span.appendChild(input);
    div.appendChild(span);    
    mainDiv.appendChild(div);
    
    //if insert=false ->popola le text
    
    if (insert){
        //inserimento
        
    }else{
        //modifica
        console.log(nodo);
        input=oDom.document.getElementById("name");
        input.value=nodo.label()["IRI-based"];
        input=oDom.document.getElementById("type");
        input.value=nodo.type();
        input=oDom.document.getElementById("comment");
        input.value=nodo.commentForCurrentLanguage();
        input=oDom.document.getElementById("disjoint");
        
        var temp= nodo.disjoinWith();
        for(var i=0; i<temp.length();i++){
            input.value+=temp[i].label()["IRI-based"]+", ";        
        }
        
        input=oDom.document.getElementById("subclassof");
        input.value="Prendere da ontologia";
        input=oDom.document.getElementById("equivalent");
        temp=nodo.equivalents();
        for(var i=0; i<temp.length();i++){
            input.value+=node[i].label()["IRI-based"]+", ";        
        }        
        
                
        
        
    }
    
    
    
}





return page;
}