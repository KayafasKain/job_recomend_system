/*
This module stands for recieving and validationg data from Vkontakete, and Upwork
*/

var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var scraperjs = require('scraperjs');
var resolve = require('url').resolve;
var phantom = require('phantom');
var fs = require('fs');
var casper = require('casper').create();

var https = require("https");

var Nightmare = require('nightmare');
// nightmare = Nightmare({ show: false });


//scrap URL`s
// var URL = 'https://www.upwork.com/o/jobs/browse/skill/html5/';

//var URL = "https://www.linkedin.com/in/oleg-meleshko-0b07615b?authType=name&authToken=AFmp&trk=hp-rr-pymk-name&csrfToken=ajax%3A441556827174461656890kkkkkkkl";

	//Ultimate functions
		//assemble response from serverhttps://www.upwork.com/o/jobs/browse/skill/html5/
			response_assemble = function( res, callback ){

			    var body = '';

			    res.on('data', function(chunk){
			        body += chunk;
			    });

			    res.on('end', function(){
			        var vkResponse = JSON.parse(body);
			        callback( vkResponse );
			    });
			}

	//Vkontakte functions
		//Account existance checking
			module.exports.is_vk_acc_exist = function( user_id, callback ){
				https.get('https://api.vkontakte.ru/method/users.get?user_ids=' + user_id, function( res ) {
					var response = {
						uid:"",
						account_exist: false
					};
						if(res != undefined){
							console.log("res != undefined");
							response_assemble(res, function( result ){
								if( result.error == undefined ){
									response.uid = result.response[0].uid;
									response.account_exist = true;
							   		callback( response );

							   	}else{

							   		response.account_exist = false;
							   		callback( response );

							   	}
							});
						}else{
							console.log("response undefined, at vk acc checking");
					   		response.account_exist = false;
					   		callback( response );
						}

				});
			}

		//Querying interesting data (wall, education, about, interests, quotes)
			//Querying user`s wall
				module.exports.vk_query_wall = function( user_uid, callback ){
					https.get('https://api.vkontakte.ru/method/wall.get?owner_id=' + user_uid + '&params[v]=5.58', function( res ) {
						var response = {
							user_uid: user_uid,
							wall_of_text:"",
							error: ""
						};
							if(res != undefined){
								response_assemble(res, function( result ){
									if( result.error == undefined ){
										
										console.log("result"); 
		
										for(var i = 1;i < result.response.length;i++){
											response.wall_of_text += result.response[i].text;//attachments
											
										}
									
										response.error = "";
								   		callback( response );

								   	}else{
								   		response.error = "response assemble error, Querying wall posts";
								   		callback( response );
								   	}
								});
							}else{
								console.log("response undefined, Querying wall posts");
						   		response.error = "response undefined, Querying wall posts";
						   		callback( response );
							}

					});
				}


			//Querying user`s:  education, about, interests, quotes
				module.exports.vk_query_profile = function( object, callback ){
					https.get('https://api.vkontakte.ru/method/users.get?user_ids=' + object.user_uid + '&fields=universities,activities,interests,books,about,quotes', function( res ) {
						var response = {
							user_uid: object.user_uid,
							wall_of_text: object.wall_of_text,
							error: ""
						};

							if(res != undefined){
								response_assemble(res, function( result ){
									if( result.error == undefined ){										
										
										response.wall_of_text += result.response[0].interests;
										response.wall_of_text += result.response[0].activities;
										response.wall_of_text += result.response[0].books;
										response.wall_of_text += result.response[0].about;
										response.wall_of_text += result.response[0].quotes;
										response.wall_of_text += result.response[0].interests;

										if( result.response[0].universities ){
											response.wall_of_text += result.response[0].faculty_name;
											response.wall_of_text += result.response[0].chair_name;
										}

										response.error = "";
								   		callback( response );

								   	}else{
								   		response.error = "response assemble error, Querying education, about, interests, quotes";
								   		callback( response );
								   	}
								});
							}else{
								console.log("response undefined, Querying education, about, interests, quotes");
						   		response.error = "response undefined, Querying education, about, interests, quotes";
						   		callback( response );
							}

					});
				}

	//LinkdIn functions
		//Querying functions
			//Get user job stats and full name vith scrapping by account url
				module.exports.linkedin_stats_query = function( linkedin_stats_url, callback ){

				  nightmare
				    .viewport(1000, 1000)
				    .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
				    .goto(linkedin_stats_url)
				    .inject("js","js/jquery.js")
				    .wait()
				    .wait(500)
					.evaluate(
					    function () 
					    {
				    		var return_mas = [];

					   
						        $('li.skill>a').each(function() {
						            return_mas.push($(this).attr('title'));
						        });
						        return return_mas;
					            //return $('span.btn-link.m-sm-left.inline-block.ng-binding.ng-scope').text(); //Get Heading
					        
		
					    }
				)			    
			    .run(function (err, nightmare) {
			      if (err) return console.log(err);
			      console.log('Done!');
			       console.log(nightmare);
			       callback(nightmare);
			    });			
			}
	// Upwork functions 

 		//Search by username 
				module.exports.get_upwork_users_by_name_search = function( name, page, callback ){



			   var bandcamp = new Nightmare({ show: false })
				    .viewport(1000, 1000)
				    .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
				    .goto("https://www.upwork.com/o/profiles/browse/?page="+ page +"&q="+ name +"")
				    .inject("js","js/jquery.js")
				    .wait()
				    .wait(500)
					.evaluate(
					    function () 
					    {
				    		var return_obj = {
				    			profile_urls: [],
				    		};

				    		

							    //take each skill
							       	$('#contractorTiles a.jsShortName').each(function() {
							       	    if(('https://www.upwork.com' + $(this).attr('href')).match(/.*users\//)){
							            	return_obj.profile_urls.push('https://www.upwork.com' + $(this).attr('href'));
							       	    }

							  		});

							    					        	

						        return return_obj;
					            //return $('span.btn-link.m-sm-left.inline-block.ng-binding.ng-scope').text(); //Get Heading
					        
		
					    })			    
					    // .run(function (err, nightmare) {
					    //   //if (err) return console.log("ERROR"+err);
					    //    console.log('Upwork profiles by name... Done!');
					    //    //console.log(nightmare);
					    //    callback( err, nightmare );
					    // });
					    .end()
					    .then(function ( nightmare ) {
					       //if (err) return console.log(err);
					       console.log('Upwork profiles by name... Done!');
					       //console.log(nightmare);
					       callback( nightmare );
					    });						    		
			     }

		//Querting user profile
				module.exports.upwork_stats_query = function( upwork_stats_url, callback ){
					console.log(upwork_stats_url)
				if(true){
				  var bandcamp  = new Nightmare({ show: false })
					    .viewport(1000, 1000)
					    .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
					    .goto(upwork_stats_url)
					    .inject("js","js/jquery.js")
					    .wait(5)
						.evaluate(
						    function (upwork_stats_url) 
						    {
					    		var return_obj = {
					    			profile_url: upwork_stats_url,
					    			created: new Date,
					    			skill_cluster:'',
					    			name:'',
					    			location:'',
					    			pay_per_hour:0,
					    			hours_worked:0,
					    			succes_precent:0,
					    			skills:[],
					    			tests:[]

					    		};

					    		


					    			//click to show all user skills 
							        	if($('span.btn-link.m-sm-left.inline-block.ng-binding.ng-scope').text()){

							        		$('span.btn-link.m-sm-left.inline-block.ng-binding.ng-scope').click();
									    }

								    //take name
								       	$("span[itemprop='name']").each(function() {
								            return_obj.name = $(this).text();
									    });

								    //take each skill
								       	$('#optimizely-header-container-default .o-tag.o-skill-tag.ng-binding.ng-scope').each(function() {

								            	return_obj.skills.push($(this).text());
									    });

							       	//take pay_per_hour
								        if($("span[itemprop='pricerange']")){
								        	$("span[itemprop='pricerange']").each(function() {
								            	return_obj.pay_per_hour = parseFloat(($(this).text()).match(/\d{1,}/g));
								        	});
								        }

							       	//take success_rate
								        if($("div[class='progress-bar progress-bar-complimentary']")){
								        	$("div[class='progress-bar progress-bar-complimentary']").each(function() {
								            	return_obj.succes_precent = parseFloat(($(this).attr('style')).match(/\d{1,}/g))/100;
								        	});
								        }

							       	//take hours_worked
								        if($("div[class='ng-binding ng-scope']")){
								        	//.replace(",", ".").replace(" ", ""							        	
								 
								            return_obj.hours_worked = ($("div[class='ng-binding ng-scope']:first").text()).match(/\d{1,}/g);

								        }

								    //take location country
								        if($("span[itemprop='country-name']")){
								        	$("span[itemprop='country-name']").each(function() {
								            	return_obj.location = ($(this).text());
								        	});
								        }							    					        	

							        return return_obj;
						            //return $('span.btn-link.m-sm-left.inline-block.ng-binding.ng-scope').text(); //Get Heading
						        
			
						    },upwork_stats_url
					)			    
				    .end()
				    .then(function ( nightmare ) {
				      //if (err) return console.log(err);
				       console.log('Upwork profile... Done!');
				       if(nightmare.hours_worked){
				       	 nightmare.hours_worked = parseInt(nightmare.hours_worked.join(''),10);
				       }
				       		       
				       console.log(nightmare);
				       callback(nightmare);
				    });				    
			    }		
			}

		//Quering jobs using key-verbs
				module.exports.upwork_jobs_query = function( user_object, callback ){

					console.log("OPERATIONS begin");

					var results = [];
					var tier = 1

					if( user_object.skill_cluster == "low" ){
						tier = 1;
					}

					if( user_object.skill_cluster == "med" ){
						tier = 2;
					}

					if( user_object.skill_cluster == "hight" ){
						tier = 3;
					}	


					for(var i = 0;i < user_object.skills.length;i++){
						var skill = (user_object.skills[i].toLowerCase()).replace(" ","-");
						var URL = "https://www.upwork.com/o/jobs/browse/skill/" + skill + "/?contractor_tier="+ tier +"&sort=create_time%2Bdesc"

							console.log(URL);

						
						    needle.get(URL, (err, res)=>{
						        if (err) throw err;

						        // парсим DOM
						        var $ = cheerio.load(res.body);

						        $("article[class='job-tile']").each((i,el)=> {
				                 //$("article[itemprop='url']").attr('href')
				                 //console.log($("a[itemprop='url']").html(""));

 				                 var $$$ = cheerio.load($(el).html());

						            results.push({
						            	href: "https://www.upwork.com" + $$$("a[itemprop='url']").attr("href"),
						            	title: $$$("a[itemprop='url']").text().replace(/\s\s/g, ""),
						            	salary: $$$("span[itemprop='baseSalary']").text()
						            });
						            console.log("////////////////////////////////////////////////");
						            //console.log(results);

						            //console.log($(this).attr('href'));
						            
						            
						        });

									if(this.index == user_object.skills.length - 1){

										results.sort( function( a, b){ return a.href - b.href; } );

										
										for( var i=0; i<results.length-1; i++ ) {
										  if ( results[i].href == results[i+1].href ) {
										    delete results[i];
										  }
										}

										
										results = results.filter( function( el ){ return (typeof el !== "undefined"); } );

						        		callback({					        			
						        			jobs: results,
						        			user: user_object
						        		});
						    		}

							}.bind({index: i}));
						
					}
					

				}	



