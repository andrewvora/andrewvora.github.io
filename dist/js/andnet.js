(function(){
  "use strict";

  window.app = angular
  .module('site', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'HomeController'
      }).
      when('/resume', {
        templateUrl: 'views/resume.html',
        controller: 'ResumeController'
      }).
      when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
      })
      .otherwise({
        redirectTo: '/404',
        templateUrl: '404.html'
      });
  });
}());var setupInstantSearch = function(element, searchFunction){
    $(element).keyup(function(event){
        event.preventDefault();
        searchFunction($(element).val());
    });
};

var activateTooltips = function(){
    $("[data-toggle='tooltip']").tooltip();
};

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function LightenDarkenColor(col,amt) {
	var usePound = false;
	if ( col[0] == "#" ) {
		col = col.slice(1);
		usePound = true;
	}

	var num = parseInt(col,16);

	var r = (num >> 16) + amt;

	if ( r > 255 ) r = 255;
	else if  (r < 0) r = 0;

	var b = ((num >> 8) & 0x00FF) + amt;

	if ( b > 255 ) b = 255;
	else if  (b < 0) b = 0;

	var g = (num & 0x0000FF) + amt;

	if ( g > 255 ) g = 255;
	else if  ( g < 0 ) g = 0;

	return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}


angular.module('site')
	.factory('randomQuoteFactory', ['$http', function ($http) {
		var randomQuoteFactory = {};

		randomQuoteFactory.getQuotes = function(){
			//return the file contents
			return $http.get('res/quotes.json');
		};

		return randomQuoteFactory;
	}]);angular.module('site')
	.controller('AboutController', function ($scope) {

	});angular.module('site')
	.controller('HomeController', ['$scope', 'randomQuoteFactory',
		function ($scope, randomQuoteFactory) {
			var invisibleClass = "hide-content";
			var visibleClass = "show-content";
			var headlinerId = "#headliner";
			var subtitleId = "#subtitle";
			var quoteContainer = "#quoteBox";

			var generateQuote = function(headliner, subtitle){
				$(quoteContainer).fadeOut('fast', function(){
					$(headlinerId).text(headliner);
					$(subtitleId).text(subtitle);
					$(this).fadeIn('fast');
				});
			};

			//quote generator==========================================
			$scope.generateQuote = function(){
				var categories = [
					"movies",
					"television",
					"other"
				];

			var quoteObj = randomQuoteFactory.getQuotes()
			.success(function(quotes){
				//get a random category
				var randIndex = Math.floor(Math.sqrt(Math.pow((Math.random() * categories.length), 3))) % categories.length;
				var category = categories[randIndex];

				//get a random quote object for the category
				var collection = quotes[category];
				randIndex = Math.floor(Math.sqrt(Math.pow((Math.random() * collection.length), 3))) % collection.length;
				var quoteObj = collection[randIndex];
						
				//update the displayed quote
				generateQuote(quoteObj.quote, quoteObj.author);
			})
			.error(function(err){});
			
			};
			
			//on page load
			$scope.generateQuote();
}]);

angular.module('site').controller('NavController', function($scope, $location){
	$scope.isActive = function(viewLocation){
			return $location.path() === viewLocation;
		};
});angular.module('site')
	.controller('ResumeController', function ($scope) {
		$scope.searchResume = function(searchTerm){
			var resume = $('.resume').find('.main').find('.row');
			resume.map( function(i, el) {
				if ($(this).text().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) $(this).fadeIn('fast',$.show);
				else $(this).fadeOut('fast',$.hide);
			});
		};

		$scope.init = function(){
			setupInstantSearch('#resume-search', $scope.searchResume);
			$('.resume').find('.main').find('.row').addClass('fadeTransition');
		};
		
		$scope.init();
	});app.directive('infoModal', function(){
	return {
		templateUrl: 'views/info-modal.html'
	};
});