'use strict';

var appModule = angular.module('redditApp', [])
  .config(function ($locationProvider, $routeProvider) {
	
	// if using html5Mode(true) you MUST use full urls
	// in HashBang-Mode it also works with prefixes in path
	$locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/comments.html',
        controller: 'CommentCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
