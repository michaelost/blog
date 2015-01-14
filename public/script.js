// script.js

	


	// create the module and name it scotchApp
        // also include ngRoute for all our routing needs
	var scotchApp = angular.module('scotchApp', ['ngRoute','ngAnimate']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'homeController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			})

			.when('/users',   {
				templateUrl : 'pages/users.html',
				controller  : 'usersController'
			})

			.when('/reg',   {
				templateUrl : 'pages/reg.html',
				controller  : 'regController'
			})
			.when('/login',   {
				templateUrl : 'pages/login.html',
				
				controller  : 'mainController'
				

			})

			.when('/user_profile',   {
				templateUrl : 'pages/user_profile.html',
				
				controller  : 'user_profileController'
				

			});
			

	});

	// create the controller and inject Angular's $scope





	scotchApp.factory('AuthenticationService',function(){
		var auth = {
			isLogged: false
		}
		return auth;
	});

	scotchApp.factory('UserService',function($http){
		return {
			logIn: function(username,password){
					return $http.post('/login',{login:username,password:password});
			},
			logOut: function(){

			}
		}


	});

	scotchApp.controller('user_profileController',['$http','$scope','$location','$window','UserService','AuthenticationService', 
		function($http,$scope,$location,$window,UserService,AuthenticationService) {

			$scope.user = [];

			
			$http.get('/user_profile',{params:{login: window.sessionStorage.profile}}).success(function(data, status, headers, config){
				$scope.user = data;	
			


			});






		}]);
	


	scotchApp.controller('homeController',['$http','$scope','$location','$window','UserService','AuthenticationService', 
		function($http,$scope,$location,$window,UserService,AuthenticationService) {

				$scope.isloged = (!window.sessionStorage.login=="");
				$scope.is_add_new_art_clicked = false;
				
				$scope.show = false;

				$scope.delet='';

				$scope.message = "blog themes";

				$scope.articles = [];

				$scope.delete_article = function(name){
					var i =0;
							$scope.articles.forEach(function(art){
						
									if(art.name == name ){
										$scope.articles.splice(i,1);

										
										i=0;
									}
									i++;
									
							});

					$http.post('/delete_article',{article_name:name})
					.success(function(data, status, headers, config){
							var i=0;


					}).error(function(data){});

				}

				$scope.add_article = function(name,title,article){
					
					var d=new Date();
					var day=d.getDate();
					var month=d.getMonth() + 1;
					var year=d.getFullYear();
					var hours = d.getHours();
					var minutes = d.getMinutes();
					var seconds = d.getSeconds();
					var time ="sent "+day +"."+ month+"."+year+" at "+hours+":"+minutes+":"+seconds;

					var art = {
						name: name,
						title: title,
						body: article,
						author: window.sessionStorage.login,
						comments: [],
						create_at: time
					}

					$http.post('/add_article',art).success(function(data, status, headers, config){
							art.delet="delete";
							$scope.articles.push(art);
					});
					$scope.new_art_article = "";
					$scope.new_art_title = "";
					$scope.new_art_name="";
					$scope.is_add_new_art_clicked = false;








				};

				$scope.delete_comment = function(comment,article_name,article){
					
					/*
					alert(JSON.stringify(article));
					article.name ="1111111111111111111name";
					alert(JSON.stringify(article));
					article.comments.pop();
					*/
					var i = 0;
						article.comments.forEach(function(comm){
							if (comm.comment == comment){
							 	article.comments.splice(i,1);
								i=0;
						var remove_object = {
							article_name : article_name,
							comment_text : comment
						}
						$http.post("/remove_comment",remove_object)
						.success(function(data, status, headers, config){
					
						}).error(function(data){});

							}
							i++;
							
						});
					
					

				}






			
				$http.get('/articles').success(function(data, status, headers, config){
				$scope.articles = data;

				// delete comment implementation
				$scope.articles.forEach(function(arts){
					
					if(arts.author == window.sessionStorage.login) {  arts.delet ="delete";}
												else {   arts.delet ="";}		
					//
					arts.comments.show=false;
					arts.comments.show_com="show comments/ write a comment";
					//
					
					arts.comments.forEach(function(comment){
						
						if(comment.author == window.sessionStorage.login) {  comment.delet ="delete";}
												else {   comment.delet ="";}
					});

				});


			    
				$scope.add_comment = function(art){
					

					var d=new Date();
					var day=d.getDate();
					var month=d.getMonth() + 1;
					var year=d.getFullYear();
					var hours = d.getHours();
					var minutes = d.getMinutes();
					var seconds = d.getSeconds();
					var time ="sent "+day +"."+ month+"."+year+" at "+hours+":"+minutes+":"+seconds;
					var new_comment ={
						author: window.sessionStorage.login,
						comment: $scope.comment_message,
						create_at: time,
						delet : "delete"
					}
					
					art.comments.push(new_comment);

					new_comment.article_name = art.name;
					
				
					$http.post('/add_comment',new_comment)
					.success(function(data, status, headers, config){
					


					}).error(function(data){});
				
				}


				});
				


		}]
		);




	scotchApp.controller('mainController',['$scope','$location','$window','UserService','AuthenticationService', 
		function($scope,$location,$window,UserService,AuthenticationService) {

		
    	$scope.login = "";
    	$scope.password = "";
    	$scope.quest = "";
		

		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';

	
		$scope.logIn = function(){
			if($scope.login !== undefined && $scope.password !== undefined){



				UserService.logIn($scope.login,$scope.password).success(function(data){
					AuthenticationService.isLogged = true;
					$window.sessionStorage.login = data[0].login;
					$scope.quest = data[0].login;
					window.location.href = "http://localhost:3000";
					
					 

					
					/*
					$location.path('/themes');
					*/
				}).error(function(status,data){
					console.log(status);
					console.log(data);
				});

			}
		
		$scope.quest = $window.sessionStorage.login;
		}

		$scope.logout = function logout(){
			if (AuthenticationService.isLogged){
				AuthenticationService.isLogged = false;
				delete $window.sessionStorage.token;
				$location.path('/');
			}
		}


	}
	]);


scotchApp.controller('auth', function($scope) {
		$scope.quest = window.sessionStorage.login;
	});

	scotchApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	scotchApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});

	scotchApp.controller('usersController', function($scope,$http,$location) {
			
				 $scope.go_profile = function(profile){
					window.sessionStorage.profile = profile;
					$location.path("user_profile");
				}

			$scope.users = [];
			
			$http.get('/users').success(function(data, status, headers, config){
			$scope.users = data;
			});
			

	});

		scotchApp.controller('regController', function($scope,$http) {
			
		


		$scope.register_user = function(){
			alert($scope.birth_day);
			alert($scope.birth_month);
			alert($scope.birth_year);
			
			var s = $scope.birth_day+"."+$scope.birth_month+"."+$scope.birth_year;
			alert(s);
			$scope.birth =  s;

				$http.post('/reg',{
					login: $scope.login, 
					password: $scope.password,
					email: $scope.email,
					username: $scope.username2,
					birth: $scope.birth,
					about: $scope.about
				})
				.success(function(data, status, headers, config){
				$scope.resp_status = data;
				}).error(function(data){});	


		};

	});
