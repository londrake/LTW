
module.exports = function () {
	var page = {},
        grafo,
        myparser=require("./myparser")(),
        oDom,// istanza di document relativa al popup
        data,
        classArray=[],// array di lavoro usata per l'autocompletamento.
        editData= {id:"", name:"",iri:"", type:"", comment:"", disjoint:[], subClassOf:[], equivalent:[], superClasses:[], union:[]},
        insert=false,// modalità insert
        delMode=false;//modalità delete
        
       

// funzione di inizializzazione del popup. 
page.initialize=function(g,insertMode){
    grafo=g;
    if(insertMode=="insert"){
        insert=true;
        delMode=false;
    }
    else if (insertMode=="delete"){
        insert=false;
        delMode=true;
    }
    else {
        insert=false;
        delMode=false;
    }
    
    
}
// funzione interna per il salvataggio delle modifiche apportate al nodo. Usata in fase di insert/edit.
save=function(){
     //Reperimento dei dati dal form.
    //Check che non si inseriscano/editino due nodi con lo stesso nome
     editData.name=oDom.document.getElementById("name").value;
     var select=oDom.document.getElementById("irislc");
     editData.iri=select.options[select.selectedIndex].text; 
    if (!myparser.existNode(editData.name, editData.iri))
        {
            //editData è l'oggetto contenente tutti i dati inseriti dall'utente.
             editData.id= parseInt(oDom.document.getElementById("id").innerHTML.substring(oDom.document.getElementById("id").innerHTML.lastIndexOf(":")+2));
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
            select=oDom.document.getElementById("unionslc");
            editData.union=[];
             for (var i=0; i<select.options.length; i++)
                {
                    editData.union.push(select.options[i].text.substring(select.options[i].text.lastIndexOf(":")+2));           

                }    
            var mode;
            if(!insert){
                mode= myparser.edit(editData,data);
            }else{
                mode= myparser.insert(editData);
            }
            _app.updateOntologyFromText(mode,undefined,undefined);
            oDom.close(); 
        }else{
            var message=oDom.document.getElementById("message");
             message.innerHTML="ERROR: Entity already exist - " + editData.iri + "#"+editData.name;
            
        }
}
//gestione del bottone ADD
add=function(id){
    var message=oDom.document.getElementById("message");
    var input= oDom.document.getElementById(id);
    var select= oDom.document.getElementById(id+"slc");
    var exist=false;
    var valore;
    message.innerHTML="";
    var error=0;//variabile usata per la gestione degli errori semantici dell'ontologia
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
    //no error
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
            message.innerHTML="ERROR: Cannot add as child node a parent node.";

        }else if (error==2){
            message.innerHTML="ERRORE: Cannot add as parent node a child node.";

        }else if (error==3){
            message.innerHTML="ERRORE: Node not present in ontology, create it first.";

        }
}
//gestione del pulsante DELETE
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
      }
//gestione della rimozione di un nodo
del_confirm=function(id){
    var select= oDom.document.getElementById(id+"slc");
    var selectedId= select.options[select.selectedIndex].text.substring(select.options[select.selectedIndex].text.lastIndexOf(":")+2);// id del nodod selzionato
    select.remove(select.selectedIndex); 
    //inizio rimozione del nodo dall'ontologia
    _app.updateOntologyFromText(myparser.delete(selectedId),undefined,undefined);
    oDom.close();
}
//Creazione del popup con relativi tag html
page.htmlCreator=function(oDomm, id){
    //azzero le variabili
    editData= {id:"", name:"", type:"", comment:"", disjoint:[], subClassOf:[], equivalent:[], superClasses:[]};
    classArray=[];
    myparser.set_language(grafo.language());
    myparser.start(grafo);
    data=myparser.read(id);
    var classesArray=myparser.getClasses(id,insert);
    oDom=oDomm;
    var mainDiv = oDom.document.getElementById("maindiv");
    var div =oDom.document.createElement("div");
    var input =oDom.document.createElement("input");
    var span =oDom.document.createElement("span");
    var select= oDom.document.createElement("select");
    var add_btn= oDom.document.createElement("input");
    var del_btn=oDom.document.createElement("input");
    if(!delMode){
        // creazione della pagina popup con gli elementi gestiti e relativi id
        span.setAttribute("class", "text");
        span.innerHTML="Node:  ";    
        select.setAttribute("id","nodeslc");
        span.appendChild(select);    
        div.appendChild(span);        
        mainDiv.appendChild(div);
        if (insert==false && data.equivalent.length>0)
            {
                span.style.visibility = 'visible';
                select.add( new Option(data.name+" : "+ data.type +" : " + id));
            }
            else
                span.style.visibility='hidden';
        //id
        div =oDom.document.createElement("div");
        span =oDom.document.createElement("span");
        span.setAttribute("class", "text");
        span.setAttribute("id", "id");
        if(!insert)
            span.innerHTML="id:  "+ id;
        else
            span.innerHTML="id:  "+ (myparser.getMaxId()+1);
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
        //IRI
        div =oDom.document.createElement("div");
        span =oDom.document.createElement("span");
        select= oDom.document.createElement("select");    
        span.setAttribute("class", "text");
        span.innerHTML="IRIs:  ";
        select.setAttribute("id","irislc");
        span.appendChild(select);
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
        select= oDom.document.createElement("select");    
        span.setAttribute("class", "text");
        span.innerHTML="Disjoint:  ";
        select.setAttribute("id","disjointslc");
        select.setAttribute("class","selectBox");
        add_btn.setAttribute("id","disjointadd");
        del_btn.setAttribute("id", "disjointdel");
        add_btn.setAttribute("value","ADD");
        del_btn.setAttribute("value", "DELETE");
        add_btn.setAttribute("type", "button");
        del_btn.setAttribute("type", "button");
        add_btn.setAttribute("class", "pulsanteADD");
        del_btn.setAttribute("class", "pulsanteDel");
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
        add_btn.setAttribute("class", "pulsanteADD");
        del_btn.setAttribute("class", "pulsanteDel");
        select.setAttribute("id","superclassslc");
        select.setAttribute("class","selectBox");
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
        select.setAttribute("class","selectBox");
        add_btn.setAttribute("id","subclassesadd");
        del_btn.setAttribute("id", "subclassesdel");
        add_btn.setAttribute("class", "pulsanteADD");
        del_btn.setAttribute("class", "pulsanteDel");
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
        add_btn.setAttribute("class", "pulsanteADD");
        del_btn.setAttribute("class", "pulsanteDel");
        select.setAttribute("id","equivalentslc");
        select.setAttribute("class","selectBox");
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
        //Union
        div =oDom.document.createElement("div");
        span =oDom.document.createElement("span");
        span.setAttribute("class", "text");
        span.innerHTML="Union:  ";
        select= oDom.document.createElement("select");
        add_btn= oDom.document.createElement("input");
        del_btn=oDom.document.createElement("input");
        add_btn.setAttribute("value","ADD");
        del_btn.setAttribute("value", "DELETE");
        add_btn.setAttribute("type", "button");
        del_btn.setAttribute("type", "button");
        add_btn.setAttribute("class", "pulsanteADD");
        del_btn.setAttribute("class", "pulsanteDel");
        select.setAttribute("id","unionslc");
        select.setAttribute("class","selectBox");
        add_btn.setAttribute("id","unionadd");
        add_btn.onclick=function(){add("union")};
        del_btn.onclick=function(){del("union")};
        del_btn.setAttribute("id", "uniondel");
        input =oDom.document.createElement("input");
        input.setAttribute("id","union");
        input.setAttribute("list", "classList");
        input.setAttribute("class", "stile");
        input.onchange=function(){hightlightNode("union")};
        span.appendChild(input);
        span.appendChild(add_btn);
        span.appendChild(del_btn);
        span.appendChild(select);
        div.appendChild(span);
        mainDiv.appendChild(div);        
        //bottone salva
        div =oDom.document.createElement("div");
        span =oDom.document.createElement("span");
        span.setAttribute("class", "pulsanteSave");
        var save_btn= oDom.document.createElement("input");
        save_btn.setAttribute("value","SAVE");
        save_btn.setAttribute("type", "button");
        save_btn.setAttribute("class", "saveButton");
        save_btn.onclick=function(){save()}; 
        span.appendChild(save_btn);
        div.appendChild(span);
        mainDiv.appendChild(div);
        //label messaggi informativi
        div =oDom.document.createElement("div");
        span =oDom.document.createElement("span");
        span.setAttribute("class", "msg");
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
        //popolo la select iri
        select=oDom.document.getElementById("irislc");
        var iris=myparser.getIris(id);
        for (var i=0; i< iris.length; i++)
            select.add( new Option(iris[i]));        
        if (insert){
            //inserimento
            input=oDom.document.getElementById("type");
            input.value="owl:Class";
            select=oDom.document.getElementById("superclassslc");
            select.add( new Option(data.name+" : "+ data.type +" : " + id));


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
            for(var i=0; i< data.disjointWith.length;i++){
                select.add( new Option(data.disjointWith[i].name+" : "+ data.disjointWith[i].type +" : " + data.disjointWith[i].id));        
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
            selectNode=oDom.document.getElementById("nodeslc");
            for(var i=0; i< data.equivalent.length;i++){
                select.add( new Option(data.equivalent[i].name+" : "+ data.equivalent[i].type +" : " + data.equivalent[i].id)); 
                selectNode.add( new Option(data.equivalent[i].name+" : "+ data.equivalent[i].type +" : " + data.equivalent[i].id));

            }  
            selectNode.onchange=function(){
                var stile = "top=center, left=center, width=600, height=220, status=no, menubar=no, toolbar=no scrollbars=no";
                var newPage= window.open('../pop.html', "", stile);
                    newPage.onload = function() {
                string = selectNode.options[selectNode.selectedIndex].text;
                page.initialize(grafo,"edit");
                page.htmlCreator(newPage,string.substring(string.lastIndexOf(":")+2));
                oDomm.close();
                }
            };
            //UNION
            select=oDom.document.getElementById("unionslc");

            for(var i=0; i< data.union.length;i++){
                select.add( new Option(data.union[i].name+" : "+ data.union[i].type +" : " + data.union[i].id));       
            }  
            select.onchange=function(){hightlightNode("unionslc")};
        }
    }
    else if(delMode){
        //modalità rimuovi nodo
        var div, span, select, confirm_btn;
        div =oDom.document.createElement("div");
        span =oDom.document.createElement("span");
        span.setAttribute("class", "delete");
        span.innerHTML="Nodes:  ";
        select= oDom.document.createElement("select");
        confirm_btn= oDom.document.createElement("input");
        confirm_btn.setAttribute("value","Confirm");
        confirm_btn.setAttribute("type", "button");
        select.setAttribute("id","equivalentslc");
        select.setAttribute("class","deleteslc");
        confirm_btn.setAttribute("id","equivalentconfirm");
        confirm_btn.setAttribute("class","pulsanteConf");
        confirm_btn.onclick=function(){del_confirm("equivalent")};
        span.appendChild(select);
        span.appendChild(confirm_btn);        
        div.appendChild(span);
        mainDiv.appendChild(div);
        select.add( new Option(data.name+" : "+ data.type +" : " + id));
        for(var i=0; i< data.equivalent.length;i++){
            select.add( new Option(data.equivalent[i].name+" : "+ data.equivalent[i].type +" : " + data.equivalent[i].id));       
        }
    }
}
return page;
}