/*
This module stands for parsing data
*/

var kmeans = require('node-kmeans');

var project_stats = require('../models/project_stats');
var natural = require('natural'),
  classifier = new natural.BayesClassifier();

var brain = require('brain.js');
var net = new brain.NeuralNetwork();

	var target_verbs = [
		{
			verb: "PHP",
			type: "web development",
			weight: 0
		},
		{
			verb: "HTML",
			type: "web development",
			weight: 0
		},
		{
			verb: "Math",
			type: "web development",
			weight: 0
		},					
		{
			verb: "HTML",
			type: "web development",
			weight: 0
		},		
		{
			verb: "Web",
			type: "web development",
			weight: 0
		},			
		{
			verb: "JavaScript",
			type: "web development",
			weight: 0
		},
		{
			verb: "Node",
			type: "web development",
			weight: 0
		},
		{
			verb: "Ruby",
			type: "web development",
			weight: 0
		},
		{
			verb: "Web development",
			type: "web development",
			weight: 0
		},
		{
			verb: "MySQL",
			type: "web development",
			weight: 0
		},
		{
			verb: "Mongo",
			type: "web development",
			weight: 0
		},
		{
			verb: "Android",
			type: "mobile development",
			weight: 0
		},
		{
			verb: "iOS",
			type: "mobile development",
			weight: 0
		},
		{
			verb: "Java ",
			type: "mobile development",
			weight: 0
		},
		{
			verb: "Objective C",
			type: "mobile development",
			weight: 0
		},
		{
			verb: "C++",
			type: "desktop",
			weight: 0
		},
		{
			verb: "Java ",
			type: "desktop",
			weight: 0
		},
		{
			verb: "Basic",
			type: "desktop",
			weight: 0
		},
		{
			verb: "Assembler",
			type: "desktop",
			weight: 0
		},
		{
			verb: "Art",
			type: "Art",
			weight: 0
		},
		{
			verb: "Design",
			type: "Art",
			weight: 0
		},
		{
			verb: "Дизайн",
			type: "Art",
			weight: 0
		},
		{
			verb: "Арт",
			type: "Art",
			weight: 0
		}																																														
	]

	//Vkontakte functions
		//Sort of key-array
			function compareWeight( objA, objB) {
				return objB.weight - objA.weight;
			}


		//Parse wall of text from VK account

			var selected_keys = 5;//number of tags which be sended for job searching
			module.exports.wall_of_text_parser = function( object, callback ){
				var str = "Ослик Иа-Иа посмотрел на виадук"; // ищем в этой строке
				var target = "Иа"; // цель поиска

				var target_verbs_local = target_verbs;

				

				for(var i = 0; i < target_verbs_local.length; i++ ){
					var pos = -1;
					while ((pos = object.wall_of_text.indexOf(target_verbs_local[i].verb, pos + 1)) != -1) {
						target_verbs_local[i].weight = target_verbs_local[i].weight + 4;

						for(var j = 0; j < target_verbs_local.length; j++ ){
							if(target_verbs_local[j].type == target_verbs_local[i].type){
								target_verbs_local[j].weight = target_verbs_local[j].weight + 1;
							}	
						}
					}
				}

				target_verbs_local.sort(compareWeight);

				var return_array = [];
				//.log("target_verbs_local.sort(compareWeight);");
				for(var i = 0; i < selected_keys; i++ ){
					return_array.push(target_verbs_local[i]);
				}				

				callback(return_array);
			}

		//convert data from DB to easy analyzable form

			module.exports.clusterize_db = function( db_object, callback ){
				var klusters = 3;
				/*
					profile_url: user_profile.profile_url,
					created: user_profile.created,
					name: user_profile.name,
					location: user_profile.location,
					pay_per_hour: user_profile.pay_per_hour,
					hours_worked: user_profile.hours_worked,
					succes_precent: user_profile.succes_precent,
					skills: user_profile.skills,
					tests: user_profile.tests
				*/

				////.log(db_object);

				// Create the data 2D-array (vectors) describing the data 
				var vectors = new Array();
				for (var i = 0 ; i < db_object.length ; i++) {
					vectors[i] = [parseFloat(db_object[i].pay_per_hour), parseFloat(db_object[i].hours_worked), parseFloat(db_object[i].succes_precent) ];
				}
				 ////.log(vectors);

				

				kmeans.clusterize(vectors, {k: klusters}, (err,res) => {
				  if (err) //.error(err);
				 // else //.log('%o',res);

				  callback(res);

				});				


			};

			module.exports.neural_clust = function( array, callback ){

				// Даем classifier'у примеры хороших и плохих данных.
				for (var i = 0; i < array[0].length; i++) {
				  classifier.addDocument(array[0][i].pay_per_hour + " " + array[0][i].hours_worked + " " + array[0][i].succes_precent + " ", 'low'); 
				};

				for (var i = 0; i < array[1].length; i++) {
				  classifier.addDocument(array[1][i].pay_per_hour + " " + array[1][i].hours_worked + " " + array[1][i].succes_precent + " ", 'med'); 
				};

				for (var i = 0; i < array[2].length; i++) {
				  classifier.addDocument(array[2][i].pay_per_hour + " " + array[2][i].hours_worked + " " + array[2][i].succes_precent + " ", 'hight'); 
				};				

				// Запускаем обучение на переданных текстах.
				classifier.train();


			
				//.log('START CLASSIFICATION');
				//.log('Test on low');
				for (var i = 0; i < array[0].length; i++) {
				  //.log("> ",classifier.classify(array[0][i].pay_per_hour + " " + array[0][i].hours_worked + " " + array[0][i].succes_precent + " "));
				};

				//.log('Test on med');
				for (var i = 0; i < array[1].length; i++) {
				  //.log("> ",classifier.classify(array[1][i].pay_per_hour + " " + array[1][i].hours_worked + " " + array[1][i].succes_precent + " "));
				};		

				//.log('Test on hight');
				for (var i = 0; i < array[2].length; i++) {
				  //.log("> ",classifier.classify(array[2][i].pay_per_hour + " " + array[2][i].hours_worked + " " + array[2][i].succes_precent + " "));
				};	

				classifier.save(__dirname + '/saved_neural/classifier.json', function(err, classifier) {
				    callback();		
				});
						

			};	

			module.exports.clusterize_object = function( object, callback ){
				//.log("clustering");

				natural.BayesClassifier.load(__dirname + '/saved_neural/classifier.json', null, function(err, classifier) {
   				
					var result = classifier.classify(object.pay_per_hour + " " + object.hours_worked + " " + object.succes_precent + " ");
					//.log(result);
					
					object.skill_cluster = result;
		
					callback( object );	
				});
				
			}		

