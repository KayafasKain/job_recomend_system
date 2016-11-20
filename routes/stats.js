var express = require('express');
var router = express.Router();


var data_recieving = require('../modules/data_recieving');
var data_processing = require('../modules/data_processing');
var testing_functions = require('../modules/testing_functions.js');
var project_stats = require('../models/project_stats');
var cluster = require('../models/clusters');
var data_feedback = require('../models/feedback');
var skills = require('../models/skills');


//for testing purposes only!
	var test_array = [];
	var moc_users_count = 1000;



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('stats');
});


//Requests
	//get data

		//gathering counts of all grade-leveled
			router.post('/get_grades_count', function(req, res){

				project_stats.get_grades_count( function( response ){
					res.json( response );
				});

			});

		//gathering hours by skill			
			router.post('/get_hours_worked_by_skill', function(req, res){

				project_stats.get_hours_worked_by_skill( function( response ){
					res.json( response );
				});

			});

		//gathering hours by skill			
			router.post('/get_skill_counts', function(req, res){
				skills.calculate_skills_precentage( skills, function( response ){
					res.json( response );
				});
			});	

		//get dependecies of: hours-success, hours-payment, payment-success	 	
			router.post('/get_hs_hp_ps_dependecies', function(req, res){
				project_stats.get_hs_hp_ps_dependecies( function( response ){
					res.json( response );
				});
			});

		// get_country_count						
			router.post('/get_country_count', function(req, res){
				project_stats.get_country_count( function( response ){
					res.json( response );
				});
			});



module.exports = router;
