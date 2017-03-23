
module.exports = function () {
	var page = {},
        grafo,
        myparser=require("./myparser")();
        
        
		



page.initialize=function(g){
    grafo=g;
    
}


page.htmlCreator=function(oDom, insert,nodo){
    
    //console.log("lingua selezionata: "+ grafo.language());
    myparser.set_language(grafo.language());
    myparser.start();
    var data= myparser.read(nodo.id());
    
    
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
    input.setAttribute("id","superclass");
    span.appendChild(input);
    div.appendChild(span);
    mainDiv.appendChild(div);
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="SubClasses";
    input =oDom.document.createElement("input");
    input.setAttribute("id","subclass");
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
        
        
        input=oDom.document.getElementById("name");
        input.value=data.name;
        input=oDom.document.getElementById("type");
        input.value=data.type;
        input=oDom.document.getElementById("comment");
        input.value=data.comment;
        input=oDom.document.getElementById("disjoint"); 
        input=oDom.document.getElementById("superclass");               
                
        for(var i=0; i< data.superClass.length;i++){
            input.value+=data.superClass[i].name+", ";        
        }
        for(var i=0; i< data.disjoinWith.length;i++){
            input.value+=data.disjoinWith[i].name+", ";        
        }        
        input=oDom.document.getElementById("subclass");               
        for(var i=0; i< data.subClassOf.length;i++){
            input.value+=data.subClassOf[i].name+", ";        
        }
        input=oDom.document.getElementById("equivalent");       
        for(var i=0; i< data.equivalent.length;i++){
            input.value+=data.equivalent[i].name+", ";        
        }        
        
                
        
        
    }
    
    
    
}





return page;
}