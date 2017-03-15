
module.exports = function () {
	var mio = {},
        classi,
        parser;
        
        
		

mio.pr=function(temp){console.log ("MIO STAMPA\n:"+ temp);}

mio.set_classi=function(classi, parser){
    this.classi=classi;
    this.parser=parser;
   // parser.getAttribute(classi[0].id);
    this.pr(classi[0].baseIri);
    
}





return mio;
}
    
       // console.log(node.id);