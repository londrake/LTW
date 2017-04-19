
module.exports = function () {
	var myparser = {},
        language,
        baseIri,
        graph,        
        maxId=0;
       
    
    myparser.set_language=function(l){
        
        language=l;
    }
        
		

myparser.start= function(grafo){
        graph=grafo;
        parsed=JSON.parse(_json);
        maxId=0;
}
    
    myparser.findClassIndex=function(id){
        
        var objindex=0;
        for(var i=0; i< parsed.class.length; i++){
            
            if (parsed.class[i].id==id)
                objindex=i;            
            
        }
        return objindex; 
}
    
    myparser.findPropertyIndex=function(id1,id2,op){
        
        var objindex=-1;
        
            if(op=="owl:disjointWith"){
                for(var i=0; i< parsed.property.length; i++){

                    if (parsed.property[i].type==op &&(( parsed.propertyAttribute[i].range==id1 && parsed.propertyAttribute[i].domain==id2)||(parsed.propertyAttribute[i].range==id2 && parsed.propertyAttribute[i].domain==id1)))
                        objindex=i;            

                }
            }else{
                for(var i=0; i< parsed.property.length; i++){

                    if (parsed.property[i].type==op && parsed.propertyAttribute[i].range==id1 && parsed.propertyAttribute[i].domain==id2)
                        objindex=i;            

                }
                
            }
        return objindex; 
}
    
    myparser.insert =function(data){
        //inserimento nuovo nodo
        var _maxId=myparser.getMaxId()+1;
        maxId=_maxId;
        parsed.metrics.classCount++;
        var classe={id:"", type:""},
            classAttribute={id:"", equivalent:[],iri:"",baseIri:"",istances:0,label:{},comment:{},attributes:[],id:"",superClasses:[],subClasses:[], union:[]};
         classe.id= _maxId.toString();
         classAttribute.id=classe.id;
         classe.type="owl:Class";
        classAttribute.iri=parsed.header.iri+"#"+data.name;
        classAttribute.baseIri=parsed.header.iri;
        classAttribute.label[language]=data.name;
        classAttribute.comment[language]=data.comment;
    //aggiungo tutti i nodi equivalent
        if(data.equivalent.length>0){
            classAttribute.attributes.push("equivalent");
            classe.type="owl:equivalentClass";
            classAttribute.equivalent=data.equivalent;
            //controllo se tutti i nodi presenti in equivalent sian equivalent a loro volta
            for(var i=0;i<data.equivalent.length;i++)
                {
                    parsed.class[myparser.findClassIndex(data.equivalent[i])].type="owl:equivalentClass";
                   if (parsed.classAttribute[myparser.findClassIndex(data.equivalent[i])].attributes!=undefined){
                        if (parsed.classAttribute[myparser.findClassIndex(data.equivalent[i])].attributes.indexOf("equivalent")==-1){
                            parsed.classAttribute[myparser.findClassIndex(data.equivalent[i])].attributes.push("equivalent");
                            
                        }
                   }else{
                       parsed.classAttribute[myparser.findClassIndex(data.equivalent[i])].attributes=["equivalent"];
                       
                   }
                    if(parsed.classAttribute[myparser.findClassIndex(data.equivalent[i])].equivalent==undefined)
                                parsed.classAttribute[myparser.findClassIndex(data.equivalent[i])].equivalent=[classe.id];
                            else
                                parsed.classAttribute[myparser.findClassIndex(data.equivalent[i])].equivalent.push(classe.id);
                }
            }
        // superclass
            if (data.superClasses.length>0){
        //assegno il vettore;
            classAttribute.superClasses=data.superClasses;
        // aggiungo l'id del nodo nei nodi padre.
                for(var i=0; i<data.superClasses.length;i++){
                
                    if (parsed.classAttribute[myparser.findClassIndex(data.superClasses[i])].subClasses==undefined){            
                    parsed.classAttribute[myparser.findClassIndex(data.superClasses[i])].subClasses=[];
                }
                    parsed.classAttribute[myparser.findClassIndex(data.superClasses[i])].subClasses.push(classe.id);
                }
        
        //aggiungo proprietà subclass of al padre
            addProperty(classe.id, data.superClasses, "subclassof");
            }
        //subclasses
            if(data.subClassOf.length>0){
                classAttribute.subClasses=data.subClassOf;
                for(var i=0;i<data.subClassOf.length;i++){
                    if (parsed.classAttribute[myparser.findClassIndex(data.subClassOf[i])].superClasses==undefined){            
                    parsed.classAttribute[myparser.findClassIndex(data.subClassOf[i])].superClasses=[];
                }
                    parsed.classAttribute[myparser.findClassIndex(data.subClassOf[i])].superClasses.push(classe.id);
            }
        //aggiungo proprietà subclass of al padre
            addProperty(classe.id, data.subClassOf, "superclass");
            }
        //union
            if (data.union.length>0){
                classAttribute.union=data.union;
                classAttribute.attributes.push("union");
                classe.type="owl:unionOf";
            }
        //disjoint
            addProperty(classe.id,data.disjoint,"disjoint");
            parsed.class.push(classe);
            parsed.classAttribute.push(classAttribute);        
            maxId=0;
   
        _json=JSON.stringify(parsed);
       return _json;
    }
    

    myparser.delete =function(id){
        var internalIndex=myparser.findClassIndex(id);
         parsed.class.splice(internalIndex,1);
        parsed.classAttribute.splice(internalIndex,1);
        
        //decremento il conteggio delle classi
        parsed.metrics.classCount--;
        //elimino tutti i reference diretti all'oggetto che stiamo eliminando
        var index=-1;
        for(var i=0;i<parsed.classAttribute.length;i++){
        //subclass
            if(parsed.classAttribute[i].subClasses!=undefined){
                index=parsed.classAttribute[i].subClasses.indexOf(id);
                if (index!=-1)
                    parsed.classAttribute[i].subClasses.splice(index,1);
            }
        //superclass
            if(parsed.classAttribute[i].superClasses!=undefined){
                index=parsed.classAttribute[i].superClasses.indexOf(id);
                if (index!=-1)
                    parsed.classAttribute[i].superClasses.splice(index,1);
            }
        //equivalent
            if(parsed.classAttribute[i].equivalent!=undefined){
                index=parsed.classAttribute[i].equivalent.indexOf(id);
                if (index!=-1){
                    parsed.classAttribute[i].equivalent.splice(index,1);
                    removeEquivalent(i,id);
                }
            }
        //union
            if(parsed.classAttribute[i].union!=undefined){
                index=parsed.classAttribute[i].union.indexOf(id);
                if (index!=-1){
                    parsed.classAttribute[i].union.splice(index,1);
                } 
                if(parsed.classAttribute[i].union.length==0)
                {
                    if(parsed.classAttribute[i].attributes!=undefined){
                        index=parsed.classAttribute[i].attributes.indexOf("union");
                        if (index!=-1)
                            parsed.classAttribute[i].attributes.splice(index,1);
                    }
                }
            } 
        }
         typeReparsing();
                    
                
        var propertyIndex=[];
        for(var i=0;i<parsed.property.length;i++){
            if(parsed.propertyAttribute[i].range==id||parsed.propertyAttribute[i].domain==id){
                propertyIndex.push(i);
            }
        }
        for(var i=0;i<propertyIndex.length;i++){
            parsed.property.splice(propertyIndex[propertyIndex.length-1-i],1);
            parsed.propertyAttribute.splice(propertyIndex[propertyIndex.length-1-i],1);
        }
     _json=JSON.stringify(parsed);
       return _json;
        
    }
    typeReparsing=function(){
        //reparsing per il controllo della consistenza dei tipi
            for(var i=0;i<parsed.classAttribute.length;i++)
                {
                    var equivalentBool=true,unionBool=true;
                    if(parsed.classAttribute[i].equivalent==undefined)
                        equivalentBool=false;
                    if(parsed.classAttribute[i].union==undefined)
                        unionBool=false;
                    if(equivalentBool==true&&unionBool==true)
                        {
                            if(parsed.classAttribute[i].union.length>0)
                                parsed.class[i].type="owl:unionOf";
                            else if(parsed.classAttribute[i].equivalent>0)
                                parsed.class[i].type="owl:equivalentClass";
                            else
                                parsed.class[i].type="owl:Class";
                        }
                    else if(equivalentBool==false&&unionBool==true)
                    {
                        if(parsed.classAttribute[i].union.length>0)
                                parsed.class[i].type="owl:unionOf";
                            else
                                parsed.class[i].type="owl:Class";
                    }
                    else if(equivalentBool==true&&unionBool==false)
                        {
                            if(parsed.classAttribute[i].equivalent.length>0)
                                parsed.class[i].type="owl:equivalentClass";
                            else
                                parsed.class[i].type="owl:Class";
                        }
                    else
                    { 
                        parsed.class[i].type="owl:Class";
                    }
                  }
    }
    myparser.getClasses= function(id,insert){
        var array=[];
        var item;    
        
        for (var i=0; i< parsed.class.length; i++){
            if((parsed.class[i].type=="owl:Thing" || parsed.class[i].type=="owl:Class" || parsed.class[i].type== "owl:equivalentClass" ||parsed.class[i].type== "owl:unionOf" ) && parsed.class[i].id!=id)
            {
                item={ id:"", name:"",  type: ""}; 
                item.id= parsed.class[i].id;
                item.type=parsed.class[i].type;
                item.name=parsed.classAttribute[i].label[language];
                if (typeof item.name=='undefined')
                    item.name= parsed.classAttribute[i].label["IRI-based"];
                
                array.push(item);
            }   
                
        }
        if(insert)
            {
                item={ id:"", name:"",  type: ""}; 
                item.id= parsed.class[myparser.findClassIndex(id)].id;
                item.type=parsed.class[myparser.findClassIndex(id)].type;
                item.name=parsed.classAttribute[myparser.findClassIndex(id)].label[language];
                if (typeof item.name=='undefined')
                    item.name= parsed.classAttribute[myparser.findClassIndex(id)].label["IRI-based"];
                
                array.push(item);
                
            }
        return array;        
        
    }
    //Restituisce due vettori added e deleted che dicono quali sono le modifiche da apportare all'Onto
    getDifference= function(editData,baseData, op){
        var added=[],
            deleted=[];
        
        
        if (op=="disjoint"){
            // popolamento vettore added
            var disjoint=[];
            for (var i=0; i<baseData.disjointWith.length;i++){
                disjoint.push(baseData.disjointWith[i].id);
            }
            
            for (var i=0; i<editData.disjoint.length;i++){
               
                if (disjoint.indexOf(editData.disjoint[i])==-1)
                    {
                        added.push(editData.disjoint[i]);
                    }                
            }
            //popolamento vettore deleted
            for (var i=0; i<disjoint.length;i++){
                if (editData.disjoint.indexOf(disjoint[i])==-1)
                    {
                        deleted.push(baseData.disjointWith[i]);
                    }                
            }
        }else if(op=="subclassof"){
            // popolamento vettore added
            var subclassof=[];
            for (var i=0; i<baseData.subClassOf.length;i++){
                subclassof.push(baseData.subClassOf[i].id);
            }
            
            for (var i=0; i<editData.subClassOf.length;i++){
                if (subclassof.indexOf(editData.subClassOf[i])==-1)
                    {
                        added.push(editData.subClassOf[i]);
                    }                
            }
            //popolamento vettore deleted
            for (var i=0; i<baseData.subClassOf.length;i++){
                if (editData.subClassOf.indexOf(baseData.subClassOf[i].id)==-1)
                    {
                        deleted.push(baseData.subClassOf[i]);
                    }                
            }
        }else if (op=="superclass"){
            // popolamento vettore added
            var superclass=[];
            for (var i=0; i<baseData.superClasses.length;i++){
                superclass.push(baseData.superClasses[i].id);
            }
            
            for (var i=0; i<editData.superClasses.length;i++){
                if (superclass.indexOf(editData.superClasses[i])==-1)
                    {
                        added.push(editData.superClasses[i]);
                    }                
            }
            //popolamento vettore deleted
            for (var i=0; i<baseData.superClasses.length;i++){
                if (editData.superClasses.indexOf(baseData.superClasses[i].id)==-1)
                    {
                        deleted.push(baseData.superClasses[i]);
                    }                
            }
        }else if (op=="equivalent"){
            // popolamento vettore added
            var equivalent=[];
            for (var i=0; i<baseData.equivalent.length;i++){
                equivalent.push(baseData.equivalent[i].id);
            }            
            
            for (var i=0; i<editData.equivalent.length;i++){
                if (equivalent.indexOf(editData.equivalent[i])==-1)
                    {
                        added.push(editData.equivalent[i]);
                    }                
            }
            //popolamento vettore deleted
            for (var i=0; i<baseData.equivalent.length;i++){
                if (editData.equivalent.indexOf(baseData.equivalent[i].id)==-1)
                    {
                        deleted.push(baseData.equivalent[i]);
                    }                
            }
        }
        
        return [added,deleted];// added: vettore di id, deleted : vettore di elementi da cancellare( hanno il relativo internal index)
    }
    
    
    myparser.getMaxId= function(){
        
        for (var i=0; i<parsed.property.length;i++)
            {   var temp=parseInt(parsed.property[i].id);
                if (temp>maxId)
                    maxId=temp;
                
            }
        
        for (var i=0; i<parsed.class.length;i++)
            {
                temp=parseInt(parsed.class[i].id);
                if (temp>maxId)
                    maxId=temp;
                
            }
        
        return maxId;
                
    }
    
    addProperty=function(id,add, type){
    
        var maxId=parseInt(myparser.getMaxId()),
        property={ id:"", type:""},
        propertyAttribute={ range:"", domain:"", attributes:"", id:"" };


    if( type=="disjoint"){
        for (var i=0;i<add.length;i++){
                property={ id:"", type:""},
                propertyAttribute={ range:"", domain:"", attributes:"", id:"" };
                maxId++;
                property.id=maxId.toString();
                property.type= "owl:disjointWith";
                propertyAttribute.range=id.toString();
                propertyAttribute.domain=add[i].toString();
                propertyAttribute.attributes=[ "object", "anonymous" ];
                propertyAttribute.id=maxId.toString();
                parsed.property.push(property);
                parsed.propertyAttribute.push(propertyAttribute);
        }
    }
        if( type=="subclassof"){
        for (var i=0;i<add.length;i++){
                property={ id:"", type:""},
                propertyAttribute={ range:"", domain:"", attributes:"", id:"" };
                maxId++;
                property.id=maxId.toString();
                property.type= "rdfs:SubClassOf";
                propertyAttribute.range=add[i].toString();
                propertyAttribute.domain=id.toString();
                propertyAttribute.attributes=[ "object", "anonymous" ];
                propertyAttribute.id=maxId.toString();
                parsed.property.push(property);
                parsed.propertyAttribute.push(propertyAttribute);
        }
    }if( type=="superclass"){
        for (var i=0;i<add.length;i++){
                property={ id:"", type:""},
                propertyAttribute={ range:"", domain:"", attributes:"", id:"" };
                maxId++;
                property.id=maxId.toString();
                property.type= "rdfs:SubClassOf";
                propertyAttribute.range=id.toString();
                propertyAttribute.domain=add[i].toString();
                propertyAttribute.attributes=[ "object", "anonymous" ];
                propertyAttribute.id=maxId.toString();
                parsed.property.push(property);
                parsed.propertyAttribute.push(propertyAttribute);
        }
    }
        
}
    removeProperty= function(id, del, type){
        if( type=="disjoint"){ 
            for(var i=0;i<del.length;i++){            
                var index= myparser.findPropertyIndex(del[i].id,id,"owl:disjointWith");
                if (index!=-1){
                    parsed.property.splice(index,1);
                    parsed.propertyAttribute.splice(index,1);
                }
            }          
        }else if (type=="subclassof"){ 
            for(var i=0;i<del.length;i++){            
                var index= myparser.findPropertyIndex(del[i].id,id,"rdfs:SubClassOf");
                if (index!=-1){
                    parsed.property.splice(index,1);
                    parsed.propertyAttribute.splice(index,1);
                }
            }          
        }else if (type=="superclass"){ 
            for(var i=0;i<del.length;i++){            
                var index= myparser.findPropertyIndex(id, del[i].id,"rdfs:SubClassOf");
                if (index!=-1){
                    parsed.property.splice(index,1);
                    parsed.propertyAttribute.splice(index,1);
                }
            }          
        }
    }
    
    removeEquivalent=function(index,id){    
        if (parsed.classAttribute[index].equivalent!=undefined)
             initialLength=parsed.classAttribute[index].equivalent.length;
        parsed.classAttribute[index].equivalent.splice(parsed.classAttribute[index].equivalent.indexOf(id),1);
        if (parsed.classAttribute[index].equivalent.length==0){
            if(parsed.classAttribute[index].union.length==0)
                parsed.class[index].type="owl:Class";
            if(parsed.classAttribute[index].attributes!=undefined){
                var ind= parsed.classAttribute[index].attributes.indexOf("equivalent");
                if (ind!=-1)
                    {
                        parsed.classAttribute[index].attributes.splice(ind,1);
                    }
            }
        }else{
            if(parsed.classAttribute[index].attributes!=undefined){
                var ind= parsed.classAttribute[index].attributes.indexOf("equivalent");
                if (ind==-1)
                    {
                        parsed.classAttribute[index].attributes.push("equivalent");
                    }
            
        }
            else 
                parsed.classAttribute[index].attributes=["equivalent"];
        }
        
        
        
    }
    myparser.edit= function(data,baseData){
        
    /*
   
    */  
      
        var added,deleted;
       var index= myparser.findClassIndex(data.id);//recupero l'indice
    //nome
        var temp= parsed.classAttribute[index].label[language];        
        
        if (typeof temp=='undefined')
            parsed.classAttribute[index].label["IRI-based"]=data.name;
        else
            parsed.classAttribute[index].label[language] =data.name;   
    //base-IRI
        parsed.classAttribute[index].iri= parsed.classAttribute[index].baseIri+"#"+data.name;
    //tipo
        parsed.class[index].type=data.type; 
    //commento
        if(parsed.classAttribute[index].comment== undefined)
                parsed.classAttribute[index].comment=[];
        parsed.classAttribute[index].comment[language]=data.comment;
        
    //superclasse
        parsed.classAttribute[index].superClasses=data.superClasses;
        [added,deleted]=getDifference(data,baseData,"superclass");
        //aggiungo al nodo padre un nuovo figlio(data.id)
        
        for(var i=0; i<added.length;i++){
            if (parsed.classAttribute[myparser.findClassIndex(added[i])].subClasses==undefined){            
                parsed.classAttribute[myparser.findClassIndex(added[i])].subClasses=[];
        }
            parsed.classAttribute[myparser.findClassIndex(added[i])].subClasses.push(data.id.toString());
        }
        
        //aggiungo proprietà subclass of al padre
        addProperty(data.id.toString(), added, "subclassof");
        //eliminato da classAttribute
         
        for (var i=0; i<deleted.length; i++){
            if (parsed.classAttribute[deleted[i].internalindex].subClasses==undefined){            
                parsed.classAttribute[deleted[i].internalindex].subClasses=[];
            }
            var temp=parsed.classAttribute[myparser.findClassIndex(deleted[i].id)].subClasses;
            for (var j=0; j<temp.length; j++)
                if(temp[j]== data.id)                    
                    parsed.classAttribute[myparser.findClassIndex(deleted[i].id)].subClasses.splice(j,1);
            }
        
        removeProperty(data.id.toString(),deleted,"subclassof");   
        
    //disjoint
        //aggiungiamo proprietà se ve ne sono
          [added,deleted]=getDifference(data,baseData,"disjoint");  
            addProperty(data.id.toString(),added,"disjoint");
            //rimozione nodi se ve ne sono
            removeProperty(data.id.toString(), deleted,"disjoint");
    //equivalent
            //rimozione nodi se ve ne sono da nodo selezionato
        var initialLength=0;      
        if (parsed.classAttribute[index].equivalent!=undefined)
             initialLength=parsed.classAttribute[index].equivalent.length;
        parsed.classAttribute[index].equivalent=data.equivalent;
        if (data.equivalent.length==0){
            parsed.class[index].type="owl:Class";
            if(parsed.classAttribute[index].attributes!=undefined){
                var ind= parsed.classAttribute[index].attributes.indexOf("equivalent");
                if (ind!=-1)
                    {
                        parsed.classAttribute[index].attributes.splice(ind,1);
                    }
            }
        }else{
            if(parsed.classAttribute[index].attributes!=undefined){
                var ind= parsed.classAttribute[index].attributes.indexOf("equivalent");
                if (ind==-1)
                    {
                        parsed.classAttribute[index].attributes.push("equivalent");
                    }
            
        }
            else 
                parsed.classAttribute[index].attributes=["equivalent"];
        }
        //reverse equivalent property                
        [added,deleted]=getDifference(data,baseData,"equivalent");
        //se stiamo aggiungendo nodi equivalenti ad un nodo che non ne ha il tipo della classe diventa equivalent class
        if(initialLength==0 && added.length>0){
         
            for(var i=0;i<added.length;i++)
                {
                    parsed.class[myparser.findClassIndex(added[i])].type="owl:equivalentClass";
                   if (parsed.classAttribute[myparser.findClassIndex(added[i])].attributes!=undefined){
                        if (parsed.classAttribute[myparser.findClassIndex(added[i])].attributes.indexOf("equivalent")==-1){
                            parsed.classAttribute[myparser.findClassIndex(added[i])].attributes.push("equivalent");
                            
                        }
                   }else{
                       parsed.classAttribute[myparser.findClassIndex(added[i])].attributes=["equivalent"];
                       
                   }
                    if(parsed.classAttribute[myparser.findClassIndex(added[i])].equivalent==undefined)
                                parsed.classAttribute[myparser.findClassIndex(added[i])].equivalent=[data.id.toString()];
                            else
                                parsed.classAttribute[myparser.findClassIndex(added[i])].equivalent.push(data.id.toString());
                }
        }
        //rimozione dai nodi equivalenti al nodo selezionato del nodo selezionato come equivalente
        for(var i=0;i<deleted.length;i++)
        {
            var ind=parsed.classAttribute[deleted[i].internalindex].equivalent.indexOf(data.id.toString());
            if(ind!=-1)
                parsed.classAttribute[deleted[i].internalindex].equivalent.splice(ind,1);
            //check sul tipo
           if(parsed.classAttribute[deleted[i].internalindex].equivalent.length==0){
                parsed.class[deleted[i].internalindex].type="owl:Class";
               if (parsed.classAttribute[deleted[i].internalindex].attributes!= undefined){ 
                ind= parsed.classAttribute[deleted[i].internalindex].attributes.indexOf("equivalent");
                   if (ind!=-1)
                        {
                            parsed.classAttribute[deleted[i].internalindex].attributes.splice(ind,1);
                        }  
               }
           }
        }
        
        //union
        initialLength=0;
        if (parsed.classAttribute[index].union!=undefined)
             initialLength=parsed.classAttribute[index].union.length;
        parsed.classAttribute[index].union=data.union;
        if (data.union.length==0){
            
            if(parsed.classAttribute[index].attributes!=undefined){
                var ind= parsed.classAttribute[index].attributes.indexOf("union");
                if (ind!=-1)
                    {
                        parsed.classAttribute[index].attributes.splice(ind,1);
                    }
            }
        }else{
            if(parsed.classAttribute[index].attributes!=undefined){
                var ind= parsed.classAttribute[index].attributes.indexOf("union");
                if (ind==-1)
                    {
                        parsed.classAttribute[index].attributes.push("union");
                    }
            
        }
            else 
                parsed.classAttribute[index].attributes=["union"];
        }
        
             
   //sub class
         
        parsed.classAttribute[index].subClasses=data.subClassOf;
        [added,deleted]=getDifference(data,baseData,"subclassof");
        for(var i=0; i<added.length;i++){
            if (parsed.classAttribute[myparser.findClassIndex(added[i])].superClasses==undefined){            
                parsed.classAttribute[myparser.findClassIndex(added[i])].superClasses=[];
            }
                parsed.classAttribute[myparser.findClassIndex(added[i])].superClasses.push(data.id.toString());
        }
        //aggiungo proprietà subclass of al padre
        addProperty(data.id.toString(), added, "superclass");
        //eliminato da classAttribute
        for (var i=0; i<deleted.length; i++){
            if (parsed.classAttribute[deleted[i].internalindex].superClasses==undefined){            
                parsed.classAttribute[deleted[i].internalindex].superClasses=[];
            }
            var temp=parsed.classAttribute[myparser.findClassIndex(deleted[i].id)].superClasses;
            for (var j=0; j<temp.length; j++)
                if(temp[j]== data.id)                    
                    parsed.classAttribute[myparser.findClassIndex(deleted[i].id)].superClasses.splice(j,1);
        }
        removeProperty(data.id.toString(),deleted,"superclass");
        typeReparsing();
        
        
            
        
        //console.log(JSON.stringify(parsed));  
        _json=JSON.stringify(parsed);
       return _json;
}
        
    
    myparser.read=function(id){
        
        
        var index= myparser.findClassIndex(id);
        var data= { name:"", type:"", comment:"", disjointWith:[], subClassOf:[], equivalent:[], superClasses:[], union:[]};
        //var element={name:"", internalindex:"", id:"", equivalentTo: ""};
        data.name= parsed.classAttribute[index].label[language];
        if (typeof data.name=='undefined')
            data.name= parsed.classAttribute[index].label["IRI-based"];
        data.type= parsed.class[index].type;  
        if (typeof parsed.classAttribute[index].comment != 'undefined'){
            data.comment=parsed.classAttribute[index].comment[language];
            if(typeof data.comment=='undefined')
                data.comment="";
        }
        //disjoint
        for(var i=0; i<parsed.propertyAttribute.length;i++)
            {

                if (parsed.propertyAttribute[i].domain==id && parsed.property[i].type=="owl:disjointWith"){
                    var element={name:"", internalindex:"", id:"", equivalentTo: "", type:""};
                    element.id= parsed.propertyAttribute[i].range;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                    element.type=parsed.class[myparser.findClassIndex(element.id)].type;
                    data.disjointWith.push(element);
                   
                    
                }
                if (parsed.propertyAttribute[i].range==id && parsed.property[i].type=="owl:disjointWith"){
                    var element={name:"", internalindex:"", id:"", equivalentTo: "", type:""};
                    element.id= parsed.propertyAttribute[i].domain;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"]; 
                    element.type=parsed.class[myparser.findClassIndex(element.id)].type;
                    data.disjointWith.push(element);
                   
                    
                }
            }
        //superclass
        if (typeof parsed.classAttribute[myparser.findClassIndex(id)].superClasses != 'undefined')
            {
                
                
                for(var i=0; i<parsed.classAttribute[myparser.findClassIndex(id)].superClasses.length;i++)
                {   var element={name:"", internalindex:"", id:"", equivalentTo: "", type:""};                 
                    element.id= parsed.classAttribute[myparser.findClassIndex(id)].superClasses[i]; 
                    element.internalindex=myparser.findClassIndex(id);
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                    element.type=parsed.class[myparser.findClassIndex(element.id)].type; 
                    data.superClasses.push(element);                   
                
                }                
                
                
                
            }
        //subclass
        if (typeof parsed.classAttribute[myparser.findClassIndex(id)].subClasses != 'undefined')
            {
                
                
                for(var i=0; i<parsed.classAttribute[myparser.findClassIndex(id)].subClasses.length;i++)
                {   var element={name:"", internalindex:"", id:"", equivalentTo: "", type:""};                 
                    element.id= parsed.classAttribute[myparser.findClassIndex(id)].subClasses[i]; 
                    element.internalindex=myparser.findClassIndex(id);
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                    element.type=parsed.class[myparser.findClassIndex(element.id)].type;
                    data.subClassOf.push(element);                   
                
                }
            }
        //Union
        if (typeof parsed.classAttribute[myparser.findClassIndex(id)].union != 'undefined'){
             var union= parsed.classAttribute[myparser.findClassIndex(id)].union;
             
            for(var i=0; i<union.length;i++)
                {       var element={name:"", internalindex:"", id:"", equivalentTo: "",type:"", union:""};//oggetto equivalent
                        element.id= union[i];
                        element.internalindex=myparser.findClassIndex(element.id);
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                        if (typeof element.name=='undefined')
                            element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                        element.type=parsed.class[myparser.findClassIndex(element.id)].type;
                        data.union.push(element);

                    
                }
            }
        
        
        
        //equivalent;
         if (typeof parsed.classAttribute[myparser.findClassIndex(id)].equivalent != 'undefined'){
             var equivalents= parsed.classAttribute[myparser.findClassIndex(id)].equivalent;
             
            for(var i=0; i<equivalents.length;i++)
                {       var element={name:"", internalindex:"", id:"", equivalentTo: "",type:""};//oggetto equivalent
                        element.id= equivalents[i];
                        element.internalindex=myparser.findClassIndex(element.id);
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                        if (typeof element.name=='undefined')
                            element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                        element.type=parsed.class[myparser.findClassIndex(element.id)].type;
                        data.equivalent.push(element);

                    
                }
            }
                
    return data;  
    }




return myparser;
}
    
       // console.log(node.id);