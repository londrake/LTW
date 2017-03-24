
module.exports = function () {
	var myparser = {},
        language,
        data= { name:"", type:"", comment:"", disjoinWith:[], subClassOf:[], equivalent:[], superClasses:[]};;  
    
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
    myparser.findName=function(id){
        data.name= parsed.classAttribute[myparser.findClassIndex(id)].label[language];
        if (typeof data.name=='undefined')
            data.name= parsed.classAttribute[myparser.findClassIndex(id)].label["IRI-based"];
    }
    myparser.findComment=function(id){
        data.comment=parsed.classAttribute[index].comment[language];
            if(typeof data.comment=='undefined')
                data.comment="";
    }
    myparser.findType=function(id){
        data.type= parsed.class[myparser.findClassIndex(id)].type;
    }
    myparser.findDisjointWith=function(id){
        for(var i=0; i<parsed.propertyAttribute.length;i++)
            {

                if (parsed.propertyAttribute[i].domain==id && parsed.property[i].type=="owl:disjointWith"){
                    var element={name:"", internalindex:"", id:"", equivalentTo: ""};
                    element.id= parsed.propertyAttribute[i].range;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                    element.equivalentTo=myparser.findEquivalentClasses(id);
                    data.disjoinWith.push(element);
                   
                    
                }
    }
    myparser.findSubclasses=function(id){
        if (typeof parsed.classAttribute[myparser.findClassIndex(id)].subClasses != 'undefined')
            {
                
                
                for(var i=0; i<parsed.classAttribute[myparser.findClassIndex(id)].subClasses.length;i++)
                {   var element={name:"", internalindex:"", id:"", equivalentTo: ""};                 
                    element.id= parsed.classAttribute[myparser.findClassIndex(id)].subClasses[i];                    
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                 element.equivalentTo=myparser.findEquivalentClasses(id);   
                 data.subClassOf.push(element);                   
                
                }                
                
                
                
            }
    }
    myparser.findSuperclasses=function(id){
    if (typeof parsed.classAttribute[myparser.findClassIndex(id)].superClasses != 'undefined')
            {
                
                
                for(var i=0; i<parsed.classAttribute[myparser.findClassIndex(id)].superClasses.length;i++)
                {   var element={name:"", internalindex:"", id:"", equivalentTo: ""};                 
                    element.id= parsed.classAttribute[myparser.findClassIndex(id)].superClasses[i];                    
                    element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                    if (typeof element.name=='undefined')
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                 element.equivalentTo=myparser.findEquivalentClasses(id);   
                 data.superClasses.push(element);                   
                
                }                
                
                
                
            }}
    myparser.findEquivalentClasses=function(id){
        if (typeof parsed.classAttribute[myparser.findClassIndex(id)].equivalent != 'undefined'){
             var equivalents= parsed.classAttribute[myparser.findClassIndex(id)].equivalent;
             var ind=myparser.findClassIndex(id);
             var element={name:"", internalindex:"", id:"", equivalentTo: ""};//oggetto equivalent
             for(var i=0; i<equivalents.length;i++)
                {       
                        element.id= equivalents[i].id();
                        element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label[language];
                        if (typeof element.name=='undefined')
                            element.name= parsed.classAttribute[myparser.findClassIndex(element.id)].label["IRI-based"];
                        data.equivalent.push(element);

                    
                }
            return element;
            }
    }
    myparser.read=function(id){
        myparser.findName(id);
        myparser.findComment(id);
        myparser.findType(id);
        myparser.findDisjointWith(id);
        myparser.findEquivalentClasses(id);
        myparser.findSubclasses(id);
        myparser.findSuperclasses(id);
        return data;  
    }




return myparser;
}
    
       // console.log(node.id);