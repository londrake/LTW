
module.exports = function () {
	var myparser = {},
        language,
        graph;
       
    
    myparser.set_language=function(l){
        
        language=l;
    }
        
		

myparser.start= function(grafo){
        graph=grafo;
        parsed=JSON.parse(_json);
}
    
    myparser.findClassIndex=function(id){
        
        var objindex=0;
        for(var i=0; i< parsed.class.length; i++){
            
            if (parsed.class[i].id==id)
                objindex=i;            
            
        }
        return objindex; 
}
    
    myparser.findPropertyIndex=function(id1,id2){
        
        var objindex=-1,
        op="owl:disjointWith";
        for(var i=0; i< parsed.property.length; i++){
            
            if (parsed.property[i].type==op &&(( parsed.propertyAttribute[i].range==id1 && parsed.propertyAttribute[i].domain==id2)||(parsed.propertyAttribute[i].range==id2 && parsed.propertyAttribute[i].domain==id1)))
                objindex=i;            
            
        }
        return objindex; 
}
    
    myparser.insert =function(data){
        
        
        
    }
    

    myparser.delete =function(id){
        
        
        
    }
    myparser.getClasses= function(id){
        var array=[];
            
        
        for (var i=0; i< parsed.class.length; i++){
            if((parsed.class[i].type=="owl:Thing" || parsed.class[i].type=="owl:Class" || parsed.class[i].type== "owl:equivalentClass") && parsed.class[i].id!=id)
            {
                var item={ id:"", name:"",  type: ""};
                item.id= parsed.class[i].id;
                item.type=parsed.class[i].type;
                item.name=parsed.classAttribute[i].label[language];
                if (typeof item.name=='undefined')
                    item.name= parsed.classAttribute[i].label["IRI-based"];
                
                array.push(item);
            }
                
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
            for (var i=0; i<baseData.disjoint.length;i++){
                if (editData.disjoint.indexOf(disjoint[i])==-1)
                    {
                        deleted.push(disjoint[i]);
                    }                
            }
        }else if(op=="subclassof"){
            // popolamento vettore added
            
            for (var i=0; i<editData.subClassOf.length;i++){
                if (baseData.subClassOf.indexOf(editData.subClassOf[i])==-1)
                    {
                        added.push(editData.subClassOf[i]);
                    }                
            }
            //popolamento vettore deleted
            for (var i=0; i<baseData.subClassOf.length;i++){
                if (editData.subClassOf.indexOf(baseData.subClassOf[i])==-1)
                    {
                        deleted.push(baseData.subClassOf[i]);
                    }                
            }
        }else if (op=="superclass"){
            // popolamento vettore added
            
            for (var i=0; i<editData.superClasses.length;i++){
                if (baseData.superClasses.indexOf(editData.superClasses[i])==-1)
                    {
                        added.push(editData.superClasses[i]);
                    }                
            }
            //popolamento vettore deleted
            for (var i=0; i<baseData.superClasses.length;i++){
                if (editData.superClasses.indexOf(baseData.superClasses[i])==-1)
                    {
                        deleted.push(baseData.superClasses[i]);
                    }                
            }
        }else if (op=="equivalent"){
            // popolamento vettore added
            
            for (var i=0; i<editData.equivalent.length;i++){
                if (baseData.equivalent.indexOf(editData.equivalent[i])==-1)
                    {
                        added.push(editData.equivalent[i]);
                    }                
            }
            //popolamento vettore deleted
            for (var i=0; i<baseData.equivalent.length;i++){
                if (editData.equivalent.indexOf(baseData.equivalent[i])==-1)
                    {
                        deleted.push(baseData.equivalent[i]);
                    }                
            }
        }
        
        return [added,deleted];
    }
    
    
    getMaxId= function(){
        var cMax=0,pMax=0;// vettore contenente l'indice massimo delle classi[0] e delle proprietà[1]
        
        for (var i=0; i<parsed.property.length;i++)
            {
                if (parsed.property[i].id>pMax)
                    pMax=parsed.property[i].id;
                
            }
        
        for (var i=0; i<parsed.class.length;i++)
            {
                if (parsed.class[i].id>cMax)
                    cMax=parsed.class[i].id;
                
            }
        
        return [parseInt(cMax),parseInt(pMax)];
                
    }
    
    addProperty=function(id,add, type){
    
    var maxId=getMaxId(),//0 per classi 1 per proprietà
        property={ id:"", type:""},
        propertyAttribute={ range:"", domain:"", attributes:"", id:"" };


    if( type=="disjoint"){
        for (var i=0;i<add.length;i++){
                property.id=maxId[1]++;
                property.type= "owl:disjointWith";
                propertyAttribute.range=id;
                propertyAttribute.domain=add[i];
                propertyAttribute.attributes=[ "object", "anonymous" ];
                propertyAttribute.id=maxId[1];
                parsed.property.push(property);
                parsed.propertyAttribute.push(propertyAttribute);
        }
    }
}
    //funzione per trovare la posizione all'interno del vettore
    
    internalIndex= function(id){
        
        
        
    }
 
    
    
    myparser.edit= function(data,baseData){
        
    /*
    data= {id:"", name:"", type:"", comment:"", disjoint:{disjoinWith:[],added:[],deleted:[]}, subClassOf:[], equivalent:{equivalent:[], added:[], deleted:[]}, superClasses:[]};    
    */  
        //loadOntologyFromText(JSON.stringify(parsed),"undefined",undefined);
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
        parsed.classAttribute[index].comment[language]=data.comment;
        
        //superclasse        
        parsed.classAttribute[index].superClasses= data.superClasses;
        
        //disjoint
                //rimozione nodi se ve ne sono
          var [added,deleted]=getDifference(data,baseData,"disjoint");  
            addProperty(data.id,added,"disjoint");
        for(var i=0;i<deleted.lenght;i++){
            
            var index= findPropertyIndex(deleted[i],data.id);
            if (index!=1){
                parsed.property.splice(index,1);
                parsed.propertyAttribute.splice(index,1);
            }
        }
        
        
        
        //equivalent
            //rimozione nodi se ve ne sono
             parsed.classAttribute[index].equivalent= data.equivalent;
        //sub class
            parsed.classAttribute[index].subClasses= data.subClassOf;
        
        //console.log(JSON.stringify(parsed));  
        _json=JSON.stringify(parsed);
       return _json;
}
        
    
    myparser.read=function(id){
        
        
        var index= myparser.findClassIndex(id);
        var data= { name:"", type:"", comment:"", disjoinWith:[], subClassOf:[], equivalent:[], superClasses:[]};
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
                    data.disjoinWith.push(element);
                   
                    
                }
                if (parsed.propertyAttribute[i].range==id && parsed.property[i].type=="owl:disjointWith"){
                    var element={name:"", internalindex:"", id:"", equivalentTo: "", type:""};
                    element.id= parsed.propertyAttribute[i].domain;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"]; 
                    element.type=parsed.class[myparser.findClassIndex(element.id)].type;
                    data.disjoinWith.push(element);
                   
                    
                }
            }
        //superclass
        if (typeof parsed.classAttribute[myparser.findClassIndex(id)].superClasses != 'undefined')
            {
                
                
                for(var i=0; i<parsed.classAttribute[myparser.findClassIndex(id)].superClasses.length;i++)
                {   var element={name:"", internalindex:"", id:"", equivalentTo: "", type:""};                 
                    element.id= parsed.classAttribute[myparser.findClassIndex(id)].superClasses[i];                    
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
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                    element.type=parsed.class[myparser.findClassIndex(element.id)].type;
                    data.subClassOf.push(element);                   
                
                }                
                
                
                
            }
        
        
        
        //equivalent;
         if (typeof parsed.classAttribute[myparser.findClassIndex(id)].equivalent != 'undefined'){
             var equivalents= parsed.classAttribute[myparser.findClassIndex(id)].equivalent;
             
            for(var i=0; i<equivalents.length;i++)
                {       var element={name:"", internalindex:"", id:"", equivalentTo: "",type:""};//oggetto equivalent
                        element.id= equivalents[i];
                        element.internalindex=i;
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