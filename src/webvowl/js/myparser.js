
module.exports = function () {
	var myparser = {},
        language;  
    
    myparser.set_language=function(l){
        
        language=l;
    }
        
		

myparser.start= function(){
    


    
 
}
    

    
    myparser.findClassIndex=function(id){
        
        var objindex=0;
        for(var i=0; i< parsed.class.length; i++){
            
            if (parsed.class[i].id==id)
                objindex=i;            
            
        }
        return objindex; 
}
        myparser.findPropertyIndex=function(id){
        
        var objindex=0;
        for(var i=0; i< parsed.property.length; i++){
            
            if (parsed.property[i].id==id)
                objindex=i;            
            
        }
        return objindex; 
}
    
    myparser.insert =function(data){
        
        
        
    }
    
    myparser.edit =function(data){
        
    }
    
    myparser.delete =function(id){
        
        
        
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
                    var element={name:"", internalindex:"", id:"", equivalentTo: ""};
                    element.id= parsed.propertyAttribute[i].range;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];                    
                    data.disjoinWith.push(element);
                   
                    
                }
                if (parsed.propertyAttribute[i].range==id && parsed.property[i].type=="owl:disjointWith"){
                    var element={name:"", internalindex:"", id:"", equivalentTo: ""};
                    element.id= parsed.propertyAttribute[i].domain;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];                    
                    data.disjoinWith.push(element);
                   
                    
                }
            }
        //superclass
        if (typeof parsed.classAttribute[myparser.findClassIndex(id)].superClasses != 'undefined')
            {
                
                
                for(var i=0; i<parsed.classAttribute[myparser.findClassIndex(id)].superClasses.length;i++)
                {   var element={name:"", internalindex:"", id:"", equivalentTo: ""};                 
                    element.id= parsed.classAttribute[myparser.findClassIndex(id)].superClasses[i];                    
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                    data.superClasses.push(element);                   
                
                }                
                
                
                
            }
        //subclass
        if (typeof parsed.classAttribute[myparser.findClassIndex(id)].subClasses != 'undefined')
            {
                
                
                for(var i=0; i<parsed.classAttribute[myparser.findClassIndex(id)].subClasses.length;i++)
                {   var element={name:"", internalindex:"", id:"", equivalentTo: ""};                 
                    element.id= parsed.classAttribute[myparser.findClassIndex(id)].subClasses[i];                    
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                    data.subClassOf.push(element);                   
                
                }                
                
                
                
            }
        
        
        
        //equivalent --- tratta come un oggetto;
         if (typeof parsed.classAttribute[myparser.findClassIndex(id)].equivalent != 'undefined'){
             var equivalents= parsed.classAttribute[myparser.findClassIndex(id)].equivalent;
             var ind=myparser.findClassIndex(id);
            for(var i=0; i<equivalents.length;i++)
                {       var element={name:"", internalindex:"", id:"", equivalentTo: ""};//oggetto equivalent
                        element.id= equivalents[i].id();
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                        if (typeof element.name=='undefined')
                            element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                        data.equivalent.push(element);

                    
                }
            }
                
    return data;  
    }




return myparser;
}
    
       // console.log(node.id);