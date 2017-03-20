
module.exports = function () {
	var myparser = {},
        parsed;  
    
    
        
		

myparser.start= function(){
    //usage:
    readTextFile(file_path, function(text){
     parsed = JSON.parse(text);
    console.log(parsed);
        });
}
    
    
 function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


    
    





return myparser;
}
    
       // console.log(node.id);