var project_stats = require('../models/project_stats');
var kmeans = require('node-kmeans');

	//test functions
		//Sort of key-array
			function compareWeight( objA, objB) {
				return objB.weight - objA.weight;
			}
		
		//Get random number
			function get_rand_num(min, max) {
  				return Math.floor(Math.random() * (max - min + 1)) + min;
			}

		//Generate moc data 

			var selected_keys = 5;//number of tags which be sended for job searching
			module.exports.create_moc_user = function( callback ){

				var target_verbs_local = target_verbs;

				 

				for(var i = 0; i < target_verbs_local.length; i++ ){
					
					for( var k = 0; k < target_verbs_local.length * 2; k++) {

						if(get_rand_num(0,5000) == 2){

							target_verbs_local[i].weight = target_verbs_local[i].weight + 1;

							for(var j = 0; j < target_verbs_local.length; j++ ){
								if(get_rand_num(0,3) == 1){
									target_verbs_local[j].weight = target_verbs_local[j].weight + 4;
								}	
							}
						}

					}
				}

				target_verbs_local.sort(compareWeight);

				var return_array = [];
				for(var i = 0; i < selected_keys; i++ ){
					return_array.push(target_verbs_local[i]);
				}				

				var return_object = {
					url: get_rand_num(0,20000),
					skills: return_array
				}

				callback(return_object);
			}

			module.exports.clusterize_moc_users = function(object , callback ){
				// // Create the data 2D-array (vectors) describing the data 
				// var vectors = new Array();
				// for (var i = 0 ; i < array.length ; i++) {
				// 	for (var j = 0 ; j < array[i].skills.length ; j++) {
				//   		vectors[i] = array[i]["skills"];
				//   	}
				// }

				// console.log(vectors);

				// kmeans.clusterize(vectors, {k: 2}, (err,res) => {
				//   if (err) console.error(err);
				//   else console.log(res);
				// });
				// callback();

				// Data source: LinkedIn 
				 
				// Create the data 2D-array (vectors) describing the data 
				var vectors = new Array();
				for (var i = 0 ; i < object.length ; i++) {
					vectors[i] = [object[i].skills[0].id, object[i].skills[1].id, object[i].skills[2].id, object[i].skills[3].id, object[i].skills[4].id];
				}
				 //console.log(vectors);

				
				kmeans.clusterize(vectors, {k: 4}, (err,res) => {
				  if (err) console.error(err);
				  else //console.log('%o',res);

				  var return_array = [];

				  for (var i = 0 ; i < 4 ; i++) {
				  	var return_object = ({
					  	skills: [],
				  		users_ids: []
				  	});

				  	return_object.skills = res[i].centroid;

				  		for (var j = 0 ; j < res[i].clusterInd.length ; j++) {
			  				return_object.users_ids

				  		}




				  }

				  callback(resp);

				});

			}


	var target_verbs = [
		{
			verb: "PHP",
			id: 1,
			type: "web development",
			weight: 0
		},
		{
			verb: "HTML",
			id: 2,
			type: "web development",
			weight: 0
		},
		{
			verb: "Math",
			id: 3,
			type: "web development",
			weight: 0
		},					
		{
			verb: "HTML",
			id: 4,
			type: "web development",
			weight: 0
		},		
		{
			verb: "Web",
			id: 5,
			type: "web development",
			weight: 0
		},			
		{
			verb: "JavaScript",
			id: 6,
			type: "web development",
			weight: 0
		},
		{
			verb: "Node",
			id: 7,
			type: "web development",
			weight: 0
		},
		{
			verb: "Ruby",
			id: 8,
			type: "web development",
			weight: 0
		},
		{
			verb: "Web development",
			id: 9,
			type: "web development",
			weight: 0
		},
		{
			verb: "MySQL",
			id: 10,
			type: "web development",
			weight: 0
		},
		{
			verb: "Mongo",
			id: 11,
			type: "web development",
			weight: 0
		},
		{
			verb: "Android",
			id: 21,
			type: "mobile development",
			weight: 0
		},
		{
			verb: "iOS",
			id: 22,
			type: "mobile development",
			weight: 0
		},
		{
			verb: "Java ",
			id: 23,
			type: "mobile development",
			weight: 0
		},
		{
			verb: "Objective C",
			id: 24,
			type: "mobile development",
			weight: 0
		},
		{
			verb: "C++",
			id: 31,
			type: "desktop",
			weight: 0
		},
		{
			verb: "Java ",
			id: 32,
			type: "desktop",
			weight: 0
		},
		{
			verb: "Basic",
			id: 33,
			type: "desktop",
			weight: 0
		},
		{
			verb: "Assembler",
			id: 34,
			type: "desktop",
			weight: 0
		},
		{
			verb: "Art",
			id: 41,
			type: "Art",
			weight: 0
		},
		{
			verb: "Design",
			id: 42,
			type: "Art",
			weight: 0
		},
		{
			verb: "Дизайн",
			id: 43,
			type: "Art",
			weight: 0
		},
		{
			verb: "Арт",
			id: 44,
			type: "Art",
			weight: 0
		}																																														
	]