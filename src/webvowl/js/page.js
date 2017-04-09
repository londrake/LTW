
module.exports = function () {
	var page = {},
        grafo,
        myparser=require("./myparser")(),
        oDom,
        hDisjoint=[],// highlight disjoint
        hEquivalent=[],//highlight ...
        hSubclasses=[],
        data,
        classArray=[],
        editData= {id:"", name:"", type:"", comment:"", disjoint:[], subClassOf:[], equivalent:[], superClasses:[]};
        
        
		



page.initialize=function(g){
    grafo=g;
    
    
}
save=function(){
     
     editData.id= parseInt(oDom.document.getElementById("id").innerHTML.substring(oDom.document.getElementById("id").innerHTML.lastIndexOf(":")+2));
     editData.name=oDom.document.getElementById("name").value;
     editData.type=oDom.document.getElementById("type").value;
     editData.comment=oDom.document.getElementById("comment").value;
     
     
     var select =oDom.document.getElementById("disjointslc");
     editData.disjoint=[];
     for (var i=0; i<select.options.length; i++)
        {
            editData.disjoint.push(select.options[i].text.substring(select.options[i].text.lastIndexOf(":")+2));           
            
        }
    
    select=oDom.document.getElementById("superclassslc");
    editData.superClasses=[];
     for (var i=0; i<select.options.length; i++)
        {
            editData.superClasses.push(select.options[i].text.substring(select.options[i].text.lastIndexOf(":")+2));           
            
        }

    select=oDom.document.getElementById("subclassesslc");
    editData.subClassOf=[];
     for (var i=0; i<select.options.length; i++)
        {
            editData.subClassOf.push(select.options[i].text.substring(select.options[i].text.lastIndexOf(":")+2));           
            
        }
    select=oDom.document.getElementById("equivalentslc");
    editData.equivalent=[];
     for (var i=0; i<select.options.length; i++)
        {
            editData.equivalent.push(select.options[i].text.substring(select.options[i].text.lastIndexOf(":")+2));           
            
        }    
    console.log(editData);    
    _app.updateOntologyFromText(myparser.edit(editData,data),undefined,undefined);
    
}
//FUNZIONE ADD
add=function(id){
    var message=oDom.document.getElementById("message");
    var input= oDom.document.getElementById(id);
    var select= oDom.document.getElementById(id+"slc");
    var exist=false;
    var valore;
    message.innerHTML="";
    var error=0;//no errors
    if (classArray.indexOf(input.value)!=-1){
        if (id=="subclasses"){
            // aggiungo un nodo padre come figlio o viceversa.
            var superclasseSlc= oDom.document.getElementById("superclassslc").options;
           for (var i=0; i< superclasseSlc.length; i++){
               if (superclasseSlc[i].text==input.value)
                error=1;

           }       

        }else if(id=="superclass"){
            var subclassSlc= oDom.document.getElementById("subclassesslc").options;
            for (var i=0; i< subclassSlc.length; i++){
               if (subclassSlc[i].text==input.value)
                error=2;

           }

        }
    }else{
        error=3;
    }


        if (error==0){
            // se l'elemento esiste non lo aggiunge.
            for (var i=0; i<select.options.length; i++)
                {
                    valore=select.options[i].text;
                    if (select.options[i].text==input.value)
                        exist=true;
                }
            var selectedIndex=input.value.substring(input.value.lastIndexOf(":")+2);
            if(!exist){
                select.add(new Option(input.value));             
                }
            input.value="";
        }else if (error==1){
            message.innerHTML="ERRORE: NON PUOI AGGIUNGERE COME FIGLIO UN NODO PADRE.";

        }else if (error==2){
            message.innerHTML="ERRORE: NON PUOI AGGIUNGERE COME PADRE UN NODO FIGLIO.";

        }else if (error==3){
            message.innerHTML="ERRORE: NON PUOI AGGIUNGERE UN NODO NON ESISTENTE, LO DEVI PRIMA CREARE.";

        }
    
        
    
    
}
//FUNZIONE DEL
del=function(id){
    var select= oDom.document.getElementById(id+"slc");
    var selectedId= select.options[select.selectedIndex].text.substring(select.options[select.selectedIndex].text.lastIndexOf(":")+2);// id del nodod selzionato
    select.remove(select.selectedIndex);    
}


//evidenzia su grafo il nodo selezionato
hightlightNode= function(id){
    grafo.resetSearchHighlight();
    var obj= oDom.document.getElementById(id);
    var string;
    if (id.endsWith("slc")){
        string = obj.options[obj.selectedIndex].text;
    }else{
        string= obj.value;
    }     
    var id= string.substring(string.lastIndexOf(":")+2);
    grafo.highLightNodes([id]);
      
    /*if (id=="disjoint"){    
        hDisjoint.push(id);
        grafo.highLightNodes(hDisjoint);
    }else if (id=="equivalent"){
        hEquivalent.push(id);
        grafo.highLightNodes(hEquivalent);
    }else if( id=="subclass")
        hSubclasses.push(id);
        grafo.highLightNodes(hSubclasses);
    }else
        grafo.highLightNodes([id]);
        */
    
    
}


page.htmlCreator=function(oDomm, insert, node){
    
    //azzero le variabili
    editData= {id:"", name:"", type:"", comment:"", disjoint:{disjoinWith:[],added:[],deleted:[]}, subClassOf:[], equivalent:[], superClasses:[]};
    classArray=[];
    //console.log("lingua selezionata: "+ grafo.language());
    myparser.set_language(grafo.language());
    myparser.start(grafo);
    data=myparser.read(node.id());
    var classesArray=myparser.getClasses(node.id());
    
    oDom=oDomm;
    
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
    span.setAttribute("id", "id");
    span.innerHTML="id:  "+ node.id();
    div.appendChild(span);
    mainDiv.appendChild(div);
    //nome
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.innerHTML="Name:  ";    
    input.setAttribute("id","name");
    input.setAttribute("class", "stile");
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
    input.setAttribute("class", "stile");
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
    input.setAttribute("class", "stile");
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
    add_btn.onclick=function(){add("disjoint")};
    del_btn.onclick=function(){del("disjoint")};
    input =oDom.document.createElement("input");
    input.setAttribute("id","disjoint");
    input.setAttribute("list", "classList");
    input.setAttribute("class", "stile");
    input.onchange=function(){hightlightNode("disjoint")};
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
    select= oDom.document.createElement("select");
    add_btn= oDom.document.createElement("input");
    del_btn=oDom.document.createElement("input");
    add_btn.setAttribute("value","ADD");
    del_btn.setAttribute("value", "DELETE");
     add_btn.setAttribute("type", "button");
    del_btn.setAttribute("type", "button");
    select.setAttribute("id","superclassslc");
    add_btn.setAttribute("id","superclassadd");
    del_btn.setAttribute("id", "superclassdel");
    add_btn.onclick=function(){add("superclass")};
    del_btn.onclick=function(){del("superclass")};
    span.innerHTML="SuperClasses:  ";
    input =oDom.document.createElement("input");
    input.setAttribute("id","superclass");
    input.setAttribute("list", "classList");
    input.setAttribute("class", "stile");
    input.onchange=function(){hightlightNode("superclass")};
    span.appendChild(input);
    span.appendChild(add_btn);
    span.appendChild(del_btn);
    span.appendChild(select);
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
    add_btn.onclick=function(){add("subclasses")};
    del_btn.onclick=function(){del("subclasses")};
    span.innerHTML="SubClasses:  ";
    input =oDom.document.createElement("input");
    input.setAttribute("id","subclasses");
    input.setAttribute("list", "classList");
    input.setAttribute("class", "stile");
    input.onchange=function(){hightlightNode("subclasses")};
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
    add_btn.onclick=function(){add("equivalent")};
    del_btn.onclick=function(){del("equivalent")};
    del_btn.setAttribute("id", "equivalentdel");
    input =oDom.document.createElement("input");
    input.setAttribute("id","equivalent");
    input.setAttribute("list", "classList");
    input.setAttribute("class", "stile");
    input.onchange=function(){hightlightNode("equivalent")};
    span.appendChild(input);
    span.appendChild(add_btn);
    span.appendChild(del_btn);
    span.appendChild(select);
    div.appendChild(span);
    mainDiv.appendChild(div);
    //bottone salva
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    var save_btn= oDom.document.createElement("input");
    save_btn.setAttribute("value","SAVE");
    save_btn.setAttribute("type", "button");
    save_btn.onclick=function(){save()}; 
    span.appendChild(save_btn);
    div.appendChild(span);
    mainDiv.appendChild(div);
    //label messaggi informativi
    div =oDom.document.createElement("div");
    span =oDom.document.createElement("span");
    span.setAttribute("class", "text");
    span.setAttribute("id", "message");
    span.innerHTML="";    
    div.appendChild(span);
    mainDiv.appendChild(div);
    
    //creo la lista di classi;
    var datalist=oDom.document.createElement("datalist");
    datalist.setAttribute("id", "classList");
    
    for (var i=0; i<classesArray.length;i++ )
        {
            var option=oDom.document.createElement("option");
            option.setAttribute("value", classesArray[i].name+ " : " + classesArray[i].type+ " : "+ classesArray[i].id);
            classArray.push(classesArray[i].name+ " : " + classesArray[i].type+ " : "+ classesArray[i].id);
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
        //superclass        
        select=oDom.document.getElementById("superclassslc");       
        for(var i=0; i< data.superClasses.length;i++){
            select.add( new Option(data.superClasses[i].name+" : "+ data.superClasses[i].type +" : " + data.superClasses[i].id));        
        }       
        select.onchange=function(){hightlightNode("superclass")};
        //disjoint
        select=oDom.document.getElementById("disjointslc");       
        for(var i=0; i< data.disjoinWith.length;i++){
            select.add( new Option(data.disjoinWith[i].name+" : "+ data.disjoinWith[i].type +" : " + data.disjoinWith[i].id));        
        }
        select.onchange=function(){hightlightNode("disjointslc")};
        //subClass
        select=oDom.document.getElementById("subclassesslc");         
        for(var i=0; i< data.subClassOf.length;i++){
            select.add( new Option(data.subClassOf[i].name+" : "+ data.subClassOf[i].type +" : " + data.subClassOf[i].id));        
        }
        select.onchange=function(){hightlightNode("subclassesslc")};
        //equivalent
        select=oDom.document.getElementById("equivalentslc");
        
        for(var i=0; i< data.equivalent.length;i++){
            select.add( new Option(data.equivalent[i].name+" : "+ data.equivalent[i].type +" : " + data.equivalent[i].id));       
        }  
        select.onchange=function(){hightlightNode("equivalentslc")};
        
        
        
                
        
        
    }
    
    
    
}





return page;
}