var mongoose = require('mongoose');


// Consumer Scema
var Users_Data = mongoose.Schema({
	profile_url: {
		type: String,
		unique: true,
		index:true
	},
	created: {
		type: Date
	},
	skill_cluster:{
		type: String
	},	
	name:{
		type: String
	},
	location:{
		type: String
	},
	pay_per_hour:{
		type: Number
	},
	hours_worked: {
		type: Number
	},
	succes_precent: {
		type: Number
	},
	skills:[],
	tests:[]	

});

var User_dat = module.exports = mongoose.model('Users_Data', Users_Data);

module.exports.add_user_data = function(newUser, callback){

		User_dat.find({ profile_url: newUser.profile_url },function(err, doc){

			if(doc.length > 0){
				newUser.save( newUser, function(err, doc){

				});
			}else{

			    User_dat.update({ profile_url: newUser.profile_url }, 
			        { 
			            $set: 
			                { 
				    			profile_url: newUser.profile_url,
				    			created: newUser.created,
				    			skill_cluster: newUser.skill_cluster,
				    			name: newUser.name,
				    			location: newUser.location,
				    			pay_per_hour: newUser.pay_per_hour,
				    			hours_worked: newUser.hours_worked,
				    			succes_precent: newUser.succes_precent,
				    			skills: newUser.skills,
				    			tests: newUser.tests
			                }
			        },function(err, doc){

			        });

			}

		});

	callback();
}

//get_all_users
module.exports.get_all_users = function(callback){
	User_dat.find(function(err, doc){
		callback( doc );
	});
}

//get_three_categories
module.exports.get_three_categories = function(callback){
	clusters = [];
	User_dat.find({ pay_per_hour: { $lte: 10 }, hours_worked: { $lte: 10 }, succes_precent: { $lte: 0.3 } },function(err, doc){
		clusters.push( doc );

		User_dat.find({ pay_per_hour: { $lte: 40,$gte: 11 }, hours_worked: { $lte: 200,$gte: 11 }, succes_precent: {  $lte: 0.8 , $gte: 0.3 } },function(err, doc){
			clusters.push( doc );

			User_dat.find({ pay_per_hour: { $gte: 41 }, hours_worked: { $gte: 201 }, succes_precent: { $gte: 0.8 } },function(err, doc){
				clusters.push( doc );
				console.log( doc[doc.length-1] );
				callback( clusters );
			}).limit( 50 );				
		}).limit( 50 );
	}).limit( 700 );

	
}

//get number of freelancers by level of skill
module.exports.get_grades_count = function( callback ){

		var defArr = [];
		var results = [];
		
	//counting low-grade
		var def = new Promise( resolve => {
			User_dat.count({ skill_cluster: "low" },function(err, doc){
				resolve();
				results.push( doc );
			});
		});
		defArr.push( def );

	//counting medium-grade	
		var def = new Promise( resolve => {
			User_dat.count({ skill_cluster: "med" },function(err, doc){
				resolve();
				results.push( doc );
			});
		});
		defArr.push( def );

	//counting hi-grade	
		var def = new Promise( resolve => {
			User_dat.count({ skill_cluster: "hight" },function(err, doc){
				resolve();
				results.push( doc );
			});
		});
		defArr.push( def );										
		

		Promise.all(defArr).then(() => {
			if(results){

				if(results.length == 3){
					callback({					        			
						low_count: results[0],
						med_count: results[1],
						hight_count: results[2],
						error: ""
					});

				} else {
					callback({
						error:"results array too short"
					});					
				}
			} else {
				callback({
					error:"results array is undefined"
				});
			}

		});

	
}

//gathering hours by skill	
module.exports.get_hours_worked_by_skill = function( callback ){

		var defArr = [];

		var low_hours = 0;
		var med_hours = 0;
		var hight_hours = 0;
		
	//counting low-grade
		var def = new Promise( resolve => {
			User_dat.find({ skill_cluster: "low" },function(err, doc){
				resolve();
					for( var i = 0; i < doc.length ; i++ ){
						low_hours = low_hours + doc[i].hours_worked
					}
		
			});
		});
		defArr.push( def );

	//counting medium-grade	
		var def = new Promise( resolve => {
			User_dat.find({ skill_cluster: "med" },function(err, doc){
				resolve();
					for( var i = 0; i < doc.length ; i++ ){
						med_hours = med_hours + doc[i].hours_worked
					}

			});
		});
		defArr.push( def );

	//counting hi-grade	
		var def = new Promise( resolve => {
			User_dat.find({ skill_cluster: "hight" },function(err, doc){
				resolve();
					for( var i = 0; i < doc.length ; i++ ){
						hight_hours = hight_hours + doc[i].hours_worked
					}
			});
		});
		defArr.push( def );										
		

		Promise.all(defArr).then(() => {

					callback({					        			
						low_hour_count: low_hours,
						med_hour_count: med_hours,
						hight_hour_count: hight_hours,
						error: ""
					});


		});

	
}

//get dependecies of: hours-success, hours-payment, payment-success	
module.exports.get_hs_hp_ps_dependecies = function( callback ){

		var defArr = [];
		
		User_dat.find({} , { skill_cluster: 1, pay_per_hour: 1, hours_worked: 1, succes_precent:1, _id: 0 }, function(err, doc){

				callback({					        			
					data: doc
				});

		});
	
}

//get country and lancers count
module.exports.get_country_count = function( callback ){

		
		
		User_dat.find({} , { location: 1, _id: 0 }, function( err, doc ){

			var defArr = [];

			var country_arr = [];

			for( var i = 0 ; i < doc.length ; i++ ){
				country_arr.push(doc[i].location); 
			}

			
			var uniqueArray = country_arr.filter(function( elem, pos ) {
			  return country_arr.indexOf(elem) == pos;
			});
			
			var countries_count = [];

			for( var j = 0 ; j < uniqueArray.length ; j++ ){
				var def = new Promise( resolve => {

					var country = uniqueArray[j];

					User_dat.count({ location: country },function( err, doc ){
						resolve();
						countries_count.push({
							country: country,
							count: doc
						});
					});
					
				});
				defArr.push(def);
			}
			Promise.all(defArr).then(() => {
				callback(countries_count);
			});

		});
	
}