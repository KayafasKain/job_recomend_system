var app = angular.module('myApp', ['ngAnimate', 'ngSanitize', 'chart.js']);

app.config(function( $interpolateProvider ) {
	$interpolateProvider.startSymbol('[{');
	$interpolateProvider.endSymbol('}]');
});



//custom directives

//factory
app.factory('exchange', function(){
    return { 
    			selected_goods: {}
    	   };
});


//filters


//controllers
	app.controller('main_cont', function($scope, $http, $sce) {




		//variables
			//user_profile url link
				$scope.usr_url = "";

			//errr_response messages
				$scope.error_response = undefined;

			//user_profile
				$scope.profile = {
					name: "",
					pay_per_hour: "",
					hours_worked: "",
					succes_precent: "",
					skill_cluster: ""
				};

			//status display variable
				$scope.status = "";

			//jobs display variable
				$scope.jobs_list = [];

			//rate visibility
				$scope.rate_visible = 0;

		//functions
			//validate user_profile url link
				$scope.validator = function( usr_url ) {
					if( usr_url.length > 0 ){

						 	var url_matched = usr_url.match(/vk.com.*/g);
						 	$scope.error_response = undefined;

						 	if(url_matched){
							 	var user_id = url_matched[url_matched.length - 1];
							 	user_id = user_id.split("/");
							 	user_id = user_id[user_id.length-1];
							 	console.log(user_id);

							 	var send_user_id = {
							 		user_id: user_id
							 	}

							 //if user_id inserted, send it to server for further procedures
							 	if( user_id.length > 0 ){

							 	

							 		$http.post('get_user_url', send_user_id).success(function( response ) {
							 			console.log("response");
							 			console.log( response );
							 			if(response.error != undefined){
							 				if(response.error.length > 0){
							 					$scope.error_response = response.error;
							 				}
							 			}
									});
								}
							}else{
								$scope.error_response = "please, insert link to your VK profile";
							}
					}
				}

				$scope.no_validator = function( usr_url ) {
					if( usr_url.length > 0 ){

								 	var send_user_url = {
								 		usr_url: usr_url
								 	}									
								 	console.log("get_user_url");
							 		$http.post('get_user_url', send_user_url).success(function( response ) {
							 			console.log("response");
							 			console.log( response );
							 			if(response.error != undefined){
							 				if(response.error.length > 0){
							 					$scope.error_response = response.error;
							 				}
							 			}
									});
						}

				}	

				$scope.clusterize_start = function() {
				 	var usr_url = "228";
					if( usr_url.length > 0 ){

								 	var send_user_url = {
								 		usr_url: usr_url
								 	}									

							 		$http.post('clusterize_all', send_user_url).success(function( response ) {
							 			console.log(response);
									});
						}

				}	

				$scope.get_upwork_data = function(usr_url) {
				 	
					if( usr_url.length > 0 ){

								 	var send_user_url = {
								 		usr_url: usr_url
								 	}									

								 	$scope.status = "pending response from server...";

							 		$http.post('get_user_profile_upwork', send_user_url).success(function( response ) {
							 			console.log(response);
							 			if(response.error){
							 				$scope.status = response.error;
							 			}else{
							 				$scope.status = "done!";
							 			}
							 			$scope.jobs_list = response.jobs;
							 			$scope.profile = response.profile;
							 			$scope.rate_visible = 1;
							 			console.log($scope.jobs_list);

									});
						}

				}

				$scope.get_linkedin_profile_data = function( usr_url ) {
				 	
					if( usr_url.length > 0 ){

								 	var send_user_url = {
								 		usr_url: usr_url
								 	}									

							 		$http.post('get_user_profile_linkedin', send_user_url).success(function( response ) {
							 			console.log(response);
									});
						}

				}		
				//neural_net_train
				$scope.get_upwork_users_by_name_search = function( usr_url ) {
				 	
					if( usr_url.length > 0 ){

								 	var send_user_name = {
								 		user_name: usr_url
								 	}									

							 		$http.post('get_upwork_users_by_name_search', send_user_name).success(function( response ) {
							 			console.log(response);
									});
						}

				}

				$scope.neural_net_train = function( usr_url ) {
				 	
					if( usr_url.length > 0 ){

								 	var send_user_name = {
								 		user_name: usr_url
								 	}									

								 	$scope.status = "network training...";

							 		$http.post('neural_net_train', send_user_name).success(function( response ) {
							 			console.log(response);
							 			$scope.status = response.stat;
									});
						}

				}										

				$scope.like_job = function( rate ) {
				 						
				 	var send_rate = {
				 		rate: rate
				 	}									

				 	$scope.rate_visible = 0;

			 		$http.post('rate_search_resoult', send_rate).success(function( response ) {
			 			console.log(response);
					});
						

				}


	})

	app.controller('statistics', function($scope, $http, $sce) {

	  	// $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  		// $scope.data = [300, 500, 100];
  		$scope.users = [];

	  	$scope.pie_labels = ["low grade", "medium", "seniors"];
  		$scope.pie_data = [100, 100, 100];

	  	$scope.pie_job_labels = ["wait", "wait", "wait"];
  		$scope.pie_job_data = [100, 100, 100];  		

		$scope.bar_labels = ['skills'];
		$scope.bar_series = ['low', 'med', 'hight'];

		$scope.bar_data = [
			[65, 59, 80, 81, 56, 55, 40],
			[28, 48, 40, 19, 86, 27, 90],
			[28, 48, 40, 19, 86, 27, 90]

		];


	//functions

	  //$scope.series = ['Series A', 'Series B'];

	  $scope.hs_labels;
	  $scope.hs_data = [
	  ];

	  $scope.hp_labels;
	  $scope.hp_data = [

	  ];

	  $scope.ps_labels;
	  $scope.ps_data = [
	  ];	  

	  $scope.onClick = function (points, evt) {
	    console.log(points, evt);
	  };



  		//drawing google map chart
  		$scope.draw_world_map = function( data_arr ){

		    google.charts.load('upcoming', {'packages':['geochart']});
		    google.charts.setOnLoadCallback(drawRegionsMap);

		    var data_arr = data_arr;

		    function drawRegionsMap() {
		    	var input_arr = [];
		    		input_arr.push(['Country', 'Freelancers']);

		    	for(var i = 0 ;  i < data_arr.length ; i++ ){
		    		input_arr.push([ data_arr[i].country, data_arr[i].count ]);
		    	}

		        var data = google.visualization.arrayToDataTable(input_arr);

		        var options = {};

		        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

		        chart.draw(data, options);
		    }
		}	

	// Gathering data for charts
  	
			//get number of freelancers by level of skill
		 		$http.post('/stats/get_grades_count').success(function( response ) {
	 				console.log(response);
		 			if(!response.error){
			 			$scope.pie_data[0] = (response.low_count);
			 			$scope.pie_data[1] = (response.med_count);
			 			$scope.pie_data[2] = (response.hight_count);
			 		}

				});	

			//get number of hours worked, by skill-groups
		 		$http.post('/stats/get_hours_worked_by_skill').success(function( response ) {
		 			console.log(response);

		 			if(!response.error){
						$scope.bar_data = [
							[response.low_hour_count],
							[response.med_hour_count],
							[response.hight_hour_count]
						];
					}

				});									

		 	// 	get_country_count
		 		$http.post('/stats/get_country_count').success(function( response ) {
		 			$scope.draw_world_map(response);
				});	

			//get dependecies of: hours-success, hours-payment, payment-success
		 		$http.post('/stats/get_hs_hp_ps_dependecies').success(function( response ) {
		 			console.log("response.data[0]");
		 			console.log(response.data);

		 			var hs_labels = [];
		 			var hs_data = [];

		 			var hp_labels = [];
		 			var hp_data = [];

		 			var ps_labels = [];
		 			var ps_data = [];

		 			for(var i = 0; i < response.data.length ; i++){

		 				if(response.data[i].hours_worked > 0 && response.data[i].succes_precent > 0){
							hs_labels.push(response.data[i].hours_worked);
		 				
							hs_data.push(response.data[i].succes_precent);
						}

						if(response.data[i].hours_worked > 0 && response.data[i].succes_precent > 0){
							hp_labels.push(response.data[i].hours_worked);
						
							hp_data.push(response.data[i].pay_per_hour);
						}

						if(response.data[i].hours_worked > 0 && response.data[i].succes_precent > 0){
							ps_labels.push(response.data[i].pay_per_hour);
						
							ps_data.push(response.data[i].succes_precent);
						} 						 				
		 			}
		 			
	 				$scope.hs_labels=(hs_labels);
	 				$scope.hs_data.push(hs_data);

	 				$scope.hp_labels=(hp_labels);
	 				$scope.hp_data.push(hp_data);

	 				$scope.ps_labels=(ps_labels);
	 				$scope.ps_data.push(ps_data);	

				});

			//get get skill counts for skill popularity diagram
		 		$http.post('/stats/get_skill_counts').success(function( response ) {
		 			console.log(response);
		 			var resp = response;
		 			$scope.pie_job_labels = [];
		 			$scope.pie_job_data = [];
		 			var names = [];
		 			var counts = [];
		 			for(var i = 0; i < resp.skills_array.length ; i++){
	 				  	names.push(resp.skills_array[i].skill_name);
						counts.push(resp.skills_array[i].count);
					}
		 			$scope.pie_job_labels = names;
		 			$scope.pie_job_data = counts;
				});	
							

  		


	})
