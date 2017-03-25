
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
    var data= myparser.read(nodo.id()),
        classesArray=myparser.getClasses();
    
    
    //insert= true : inserimento, altriment è edit
    var mainDiv = oDom.document.getElementById("maindiv");
    
    //odom.get elemetbyid("myid").value ottenere i valori dalla textbox
    var div =oDom.document.createElement("div");
    var input =oDom.document.createElement("input");
    var span =oDom.document.createElement("span");
    var select= oDom.document.createElement("select");
    var add_btn= oDom.document.createElement("input");
    var del_btn=oDom.document.createElement("input");
    // creazione della pagina popup con gli elementi gestiti e relativi id
    //id
    span.setAttribute("class", "text");
    span.innerHTML="id:  "+ nodo.id();
    div.appendChild(span);
    mainDiv.appendChild(div);
    //nome
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Name:  ";    
    input.setAttribute("id","name");
    span.appendChild(input);    
    div.appendChild(span);        
    mainDiv.appendChild(div);
    //tipo
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Type:  ";
    input =oDom.document.createElement("input");
    input.setAttribute("id","type");
    span.appendChild(input);
    div.appendChild(span);
    mainDiv.appendChild(div);
    //commento
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Comment:  ";
    input =oDom.document.createElement("input");
    input.setAttribute("id","comment");
    span.appendChild(input);
    div.appendChild(span);
    mainDiv.appendChild(div);
    //disjoin
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Disjoint:  ";
    select.setAttribute("id","disjointslc");
    add_btn.setAttribute("id","disjointadd");
    del_btn.setAttribute("id", "disjointdel");
    add_btn.setAttribute("value","ADD");
    del_btn.setAttribute("value", "DELETE");
    add_btn.setAttribute("type", "button");
    del_btn.setAttribute("type", "button");
    input =oDom.document.createElement("input");
    input.setAttribute("id","disjoint");
    input.setAttribute("list", "classList");
    span.appendChild(input);
    span.appendChild(add_btn);
    span.appendChild(del_btn);
    span.appendChild(select);
    div.appendChild(span);
    mainDiv.appendChild(div);
    //super classe
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    add_btn= oDom.document.createElement("input");
    del_btn=oDom.document.createElement("input");
    span.innerHTML="SubClassOf:  ";    
    add_btn.setAttribute("id","superclassadd");
    del_btn.setAttribute("id", "superclassdel");
    add_btn.setAttribute("value","ADD");
    del_btn.setAttribute("value", "DELETE");
    add_btn.setAttribute("type", "button");
    del_btn.setAttribute("type", "button");
    input =oDom.document.createElement("input");
    input.setAttribute("id","superclass");
    input.setAttribute("list", "classList");
    span.appendChild(input);
    div.appendChild(span);
    mainDiv.appendChild(div);
    //sottoclasse
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    select= oDom.document.createElement("select");
    add_btn= oDom.document.createElement("input");
    del_btn=oDom.document.createElement("input");
    add_btn.setAttribute("value","ADD");
    del_btn.setAttribute("value", "DELETE");
     add_btn.setAttribute("type", "button");
    del_btn.setAttribute("type", "button");
    select.setAttribute("id","subclassesslc");
    add_btn.setAttribute("id","subclassesadd");
    del_btn.setAttribute("id", "subclassesdel");
    span.innerHTML="SubClasses:  ";
    input =oDom.document.createElement("input");
    input.setAttribute("id","subclass");
    input.setAttribute("list", "classList");
    span.appendChild(input);
    span.appendChild(add_btn);
    span.appendChild(del_btn);
    span.appendChild(select);
    div.appendChild(span);
    mainDiv.appendChild(div);  
    //equivalent
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Equivalent:  ";
    select= oDom.document.createElement("select");
    add_btn= oDom.document.createElement("input");
    del_btn=oDom.document.createElement("input");
    add_btn.setAttribute("value","ADD");
    del_btn.setAttribute("value", "DELETE");
    add_btn.setAttribute("type", "button");
    del_btn.setAttribute("type", "button");
    select.setAttribute("id","equivalentslc");
    add_btn.setAttribute("id","equivalentadd");
    del_btn.setAttribute("id", "equivalentdel");
    input =oDom.document.createElement("input");
    input.setAttribute("id","equivalent");
    input.setAttribute("list", "classList");
    span.appendChild(input);
    span.appendChild(add_btn);
    span.appendChild(del_btn);
    span.appendChild(select);
    div.appendChild(span);
    mainDiv.appendChild(div);
    //creo la lista di classi;
    var datalist=oDom.document.createElement("datalist");
    datalist.setAttribute("id", "classList");
    
    for (var i=0; i<classesArray.length;i++ )
        {
            var option=oDom.document.createElement("option");
            option.setAttribute("value", classesArray[i].name+ " : " + classesArray[i].type+ " : "+ classesArray[i].id);
            datalist.appendChild(option);
            
        }
    var body= oDom.document.getElementsByTagName("BODY")[0];
    body.appendChild(datalist);
    
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
        input=oDom.document.getElementById("superclass");               
                
        for(var i=0; i< data.superClasses.length;i++){
            input.value+=data.superClasses[i].name;        
        }
        select=oDom.document.getElementById("disjointslc");
        for(var i=0; i< data.disjoinWith.length;i++){
            select.add( new Option(data.disjoinWith[i].name));        
        }        
        select=oDom.document.getElementById("subclassesslc");               
        for(var i=0; i< data.subClassOf.length;i++){
            select.add( new Option(data.subClassOf[i].name));        
        }
        select=oDom.document.getElementById("equivalentslc");       
        for(var i=0; i< data.equivalent.length;i++){
            select.add( new Option(data.equivalent[i].name));       
        }        
        
                
        
        
    }
    
    
    
}





return page;
}