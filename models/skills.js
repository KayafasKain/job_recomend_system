var mongoose = require('mongoose');
var project_stats = require('../models/project_stats');

// feedback_scema
var skills_scema = mongoose.Schema({
	skill_name: {
		type: String,
		unique: true
	},
	count: {
		type: Number
	}
});

var skills = module.exports = mongoose.model('skills', skills_scema);

module.exports.add_skill = function( obj, array, callback ){
	var defArr = []
	var array = array;
	for(var i = 0; i < array.length ; i++){	

		var def = new Promise( resolve => {	
			resolve();
				var help = new obj({
					skill_name: array[i], 
					count: 0
				});

				help.save( help, function(err,doc){

				});
			defArr.push( def );		
		});
	}

	Promise.all( defArr ).then( () => {
		callback({ error:"" });
	});
}

module.exports.get_skills = function( callback ){
	skills.find({}, function( err, doc ){
		callback(doc);
	});
}

module.exports.calculate_skills_precentage = function( skills_objs, callback ){
	console.log("lol");
	project_stats.find( {}, { skills: 1, _id: 0 }, function( err, doc ){
		var doc = doc;
		var defArr = [];
		for( var i = 0 ; i < doc.length ; i++ ){

			var def = new Promise( resolve => {
				resolve();
					skills_objs.add_skill( skills_objs, doc[i].skills, function( callback ){
						
					});
				defArr.push( def );
			});		
		}

		Promise.all( defArr ).then( () => {
			skills.get_skills( function( result ){
				console.log("sdsds");

				var skills_array = result;
				var skills_responce = [];

				var defArr2 = [];
					for( var k = 0; k < skills_array.length ; k++ ){
						var deff = new Promise( resolve => {
							
							var temp = skills_array[k].skill_name;
							project_stats.count( {"skills" : temp },function( err, doc){
								resolve();
								skills_responce.push({
									skill_name: temp,
									count: doc
								});
								
							});

						})

						defArr2.push(deff);
					}

				Promise.all(defArr2).then(() => {

					callback({ 
						skills_array: skills_responce, 
						error:"" 
					});

				});

						// for( var k = 0; k < skills_array.length ; k++ ){
						// 	for( var j = 0 ; j < doc.length ; j++ ){
						// 		if (true) {
						// 			for( var l = 0; l < doc[j].skills.length ; l++ ){
						// 				if(skills_array[k] == doc[j].skills[l]){
						// 					console.log("228");
						// 					skills_array[k].count = skills_array[k].count + 1;
						// 				}
						// 			}									
						// 		}
						// 	}
						// }
						// console.log("skills_array");
						// console.log(skills_array);


				
			});

			
		});		
			
	});	
}



