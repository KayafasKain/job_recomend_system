var express = require('express');
var router = express.Router();


var data_recieving = require('../modules/data_recieving');
var data_processing = require('../modules/data_processing');
var testing_functions = require('../modules/testing_functions.js');
var project_stats = require('../models/project_stats');
var cluster = require('../models/clusters');
var data_feedback = require('../models/feedback');


//for testing purposes only!
	var test_array = [];
	var moc_users_count = 1000;



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



//Requests
	//get data

			router.post('/get_user_url', function(req, res){
				console.log("get_user_url");
				data_recieving.upwork_stats_query( req.body.usr_url, function( user_profile ){
					console.log("228");

					data_processing.clusterize_object( user_profile, cluster, function(response){
						console.log("322");
					});					

				});
				res.json({
					stat: "ok..?"
				});	

			});			

			router.post('/clusterize_all', function(req, res){

				// project_stats.get_all_users(function( users_array ){
				// 	data_processing.clusterize_db( users_array, function(resp){

						// cluster.refresh_clusters( resp, function(){

						// });
						res.json(resp);


				// 	});
				// });
			});

			router.post('/get_user_profile_upwork', function(req, res){
													//https://www.upwork.com/fl/
				if (req.body.usr_url.match(/https:\/\/www\.upwork\.com\/o\/profiles\/users\/_~[a-z0-9]*/g) || 
						req.body.usr_url.match(/https:\/\/www\.upwork\.com\/fl\/[a-z0-9]*/g)  ) {
					data_recieving.upwork_stats_query( req.body.usr_url, function( user_profile ){

						//add_user_data

								if(user_profile.skills.length > 0){
									
									var new_project_stats = new project_stats({
						    			profile_url: user_profile.profile_url,
						    			created: user_profile.created,
						    			skill_cluster: user_profile.skill_cluster,
						    			name: user_profile.name,
						    			location: user_profile.location,
						    			pay_per_hour: user_profile.pay_per_hour,
						    			hours_worked: user_profile.hours_worked,
						    			succes_precent: user_profile.succes_precent,
						    			skills: user_profile.skills,
						    			tests: user_profile.tests
									});	

									data_processing.clusterize_object( new_project_stats, function( response ){
										data_recieving.upwork_jobs_query( response, function( response ){
											res.json({
												profile: response.profile,
												jobs: response.jobs
											});	

											project_stats.add_user_data( response.user, function(err, doc){
													console.log("user saved");		
											});
										});
									});

								}else{
									res.json({
										error: "wrong link"
									});	
								}
					});
				}else{
					res.json({
						error: "wrong link"
					});					
				}
			});

		//get upworj profiles by name 
			router.post('/get_upwork_users_by_name_search', function(req, res){

				var numb = 135;
				var total_lenth = 0;
				var saves_count = 0;

				res.json({
					stat: "ok"
				});
				var i = 0;

				//for(var i = 130; i < numb;i++){
				
				var intervalID = setInterval(function(){	
					this.index = this.index + 1;

					console.log("current page: "+this.index);
					if (this.index == 20) {
						clearInterval(intervalID);
					}

					data_recieving.get_upwork_users_by_name_search( req.body.user_name, this.index, function( url_array ){
							
							//console.log(url_array);

							if( url_array.profile_urls.length > 0){
									total_lenth = total_lenth + url_array.profile_urls.length;
									setTimeout(function(){
										for(var j = 0; j < this.url_array.profile_urls.length;j++){
											
											
												data_recieving.upwork_stats_query( this.url_array.profile_urls[j], function( user_profile ){

													if(user_profile){
														var new_project_stats ={
											    			profile_url: user_profile.profile_url,
											    			created: user_profile.created,
											    			skill_cluster: user_profile.skill_cluster,
											    			name: user_profile.name,
											    			location: user_profile.location,
											    			pay_per_hour: user_profile.pay_per_hour,
											    			hours_worked: user_profile.hours_worked,
											    			succes_precent: user_profile.succes_precent,
											    			skills: user_profile.skills,
											    			tests: user_profile.tests
														};	

														//project_stats.add_user_data( new_project_stats, function(err, doc){
															// data_processing.clusterize_db(project_stats ,function( clusterized_data ){
															// 	res.json(clusterized_data);
															// });
														
															// res.json({
															// 	stat: "ok"
															// });
															saves_count = saves_count + 1;
															console.log("saved...");
															if(saves_count == total_lenth){

															}
															
														//});
													}

												});
											
										}
									}.bind({url_array: url_array}),10);
							}

					});
				}.bind({index: i}),7500);
				//}
			});	

		//rate the search
			router.post('/rate_search_resoult', function(req, res){

				var rate = new data_feedback({
					like: parseInt(req.body.rate)
				});

				data_feedback.add_feedback( rate, function(){
					res.json({
						stat: "ok"
					});
				});
			});			

//clusterize_object
			router.post('/neural_net_train', function(req, res){
				// project_stats.get_three_categories(function(ans){
				// 	data_processing.neural_clust( ans, function(response){
						console.log("222");
						res.json({
							stat: "training ok..?"
						});							
				// 	});
					
				// });
			

			});	


			router.post('/get_user_profile_linkedin', function(req, res){

				//project_stats.linkedin_stats_query( req.body.usr_url, function(){
					res.json({
						stat: "ok"
					});
				//});
			});	




module.exports = router;
