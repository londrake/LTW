
module.exports = function () {
	var myparser = {},
        language;  
    
    myparser.set_language=function(l){
        
        language=l;
    }
        
		

myparser.start= function(){
    


    
 
}
    

    
    myparser.find=function(id){
        
        var objindex=0;
        for(var i=0; i< parsed.class.length; i++){
            
            if (parsed.class[i].id==id)
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
        
        
        var index= myparser.find(id);
        var data= { name:"", type:"", comment:"", disjoinWith:[], subClassOf:[], equivalent:[]};
        var element={name:"", internalindex:"", id:"" };
        data.name= parsed.classAttribute[index].label[language];
        data.type= parsed.class[index].type;
        data.comment=parsed.classAttribute[index].comment[language];// gestire se il campo non è presente UNDEFINED
        
        for(var i=0; i<parsed.propertyAttribute.length;i++)
            {
                //var count=0;
                if (parsed.propertyAttribute[i].range==id && parsed.property[i].type=="owl:disjointWith"){
                    
                    element.id= parsed.propertyAttribute[i].domain;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.find(element.id)].label[language];
                    data.disjoinWith.push(element);
                   
                    
                }
            }
        for(var i=0; i<parsed.propertyAttribute.length;i++)
            {
                //var count=0;
                if (parsed.propertyAttribute[i].range==id && parsed.property[i].type=="rdfs:SubClassOf"){
                    
                    element.id= parsed.propertyAttribute[i].domain;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.find(element.id)].label[language];
                    data.subClassOf.push(element);
                    
                }
            }
        for(var i=0; i<parsed.propertyAttribute.length;i++)
            {
                //var count=0;
                if (parsed.propertyAttribute[i].range==id && parsed.property[i].type=="owl:equivalentClass"){
                    
                    element.id= parsed.propertyAttribute[i].domain;
                    element.internalindex= i;
                    element.name= parsed.classAttribute[myparser.find(element.id)].label[language];
                    data.equivalent.push(element);
                    
                } 
                
            }
                
    return data;  
    }




return myparser;
}
    
       // console.log(node.id);