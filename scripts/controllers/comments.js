'use strict';

angular.module('redditApp' )
.controller('CommentCtrl', function ($scope, $http, $timeout,$store) {
	var addNewPosts = function(res){
		var newPosts = res.data.children.map(function(post){
			return post.data;
		}); 
		$scope.loading = false; 
		$scope.posts = newPosts;
		//$scope.posts.push.apply($scope.posts, newPosts)
		$scope.pos = 0;
		$scope.set_current();
		$scope.set_store();
	};
	$scope.list_url = '';
	$scope.data_url = 'http://www.reddit.com/.json';
	$scope.pages = 0;
	$scope.openwin = 'false'; 
	$scope.auto_skip = true;
	$scope.filter_sfw = true;	
	$scope.auto_timer = 60;
	$scope.count_max = 999;
	$scope.auto_next = false; 	
	$scope.auto_load = true;
	$scope.auto_open = true;
	$scope.loading = false;
	$scope.load_first = true;
	$scope.auto_timer_running = false; 
	$scope.posts = []; 
	$scope.visited = {}; 
	$scope.hidePost = function(post){
		if (  typeof post.url === 'undefined' ) {
			return true;
		}
		return false;
	}
	$scope.hideThumb = function(post){
		//console.log( post );
		//console.log( typeof post.thumbnail );

		if (     (typeof post.thumbnail != 'undefined' && ( post.thumbnail === 'self' || post.thumbnail === '')  )
				|| (typeof post.over_18 !="undefined" && post.over_18 )
				|| (typeof post.thumbnail == "undefined" )	
		   ) {
			return true;
		}
		return false;
	}
	$scope.get_subreddit = function() {
		return $scope.subreddit;	
	} 
	$scope.loadNextPage = function(){
		var lastPost = $scope.posts[$scope.posts.length - 1]; 
		var lastPostId; 
		if ( typeof lastPost =='object' && $scope.load_first == false) {
			lastPostId = lastPost.name;
		} 
		else {
			lastPostId = '';	
		}	
		$scope.loading = true;
		$scope.load_first = false;
		$scope.data_url = 'http://reddit.com/'+ $scope.subreddit +'.json?limit=100&after=' + lastPostId + '&jsonp=JSON_CALLBACK';
		$scope.list_url = 'http://reddit.com/'+ $scope.subreddit +'.mobile?limit=100&after=' + lastPostId + '';
		$http.jsonp( $scope.data_url ).success(addNewPosts);
	}
	$scope.subreddit='';	
	$scope.subreddit_filter='';	
	$scope.post = {}; 
	$scope.load_data = function() {
		return $scope.loadNextPage();
	}
	$scope.next = function() {
		if ( $scope.subreddit_filter != $store.get('subreddit_filter') ) {
			$store.set('subreddit_filter',$scope.subreddit_filter ); 
			//$scope.load_data();
			return;
		}
		if ( $scope.subreddit != $store.get('subreddit') ) {
			$store.set('subreddit',$scope.subreddit ); 
			$scope.load_first = true;	
			$scope.load_data();
			return;
		}
		//$scope.auto_skip = false;	
		$scope.pos = $scope.pos +1;
		if ( $scope.pos >= $scope.posts.length ) {
			// load more
			if ( ++ $scope.pages < 5 ){
				$scope.loadNextPage();
				$scope.loading = true;		
			} else {
				//alert( 'loading loop' + $scope.pages + ' pages' );
				$scope.pages = 0; 
				$scope.auto_skip = false;
				return;
			}

			//$scope.pos = 0;
			return; // wait for callback
		}
		$scope.set_current();
		$scope.set_store();	
		//$cookieStore.add('reddit-'+ $scope.post.name,1);
		//$scope.auto_next = true;
		//$scope.add_timeout();
	}
	$scope.prev = function() {
		$scope.auto_next = false;
		$scope.auto_skip = false;
		//$scope.pos --;	
		if ( $scope.pos > 1 ) {
			$scope.pos--; 
			$scope.set_current();
		}
	}

	$scope.set_current = function() {
		$scope.post = $scope.posts[ $scope.pos ] ; 
		$scope.post.url_orig = $scope.post.url+""; 
		
		if (typeof $scope.post.over_18 !="undefined" && $scope.post.over_18 ) {
			if ( $scope.filter_sfw == true ) {
				$scope.next();
				return;
			}
		}
		var filtered = 0; 
		var filter_str = $scope.subreddit_filter+" " ; 
		var filters = filter_str.split(' '); 
		for ( var i=0; i<= filters.length; i++  ) { 
			//filtered = filtered + "!" + filters[i];
			if ( $scope.post.subreddit == filters[i] 
					|| $scope.post.title == filters[i] ) {
				filtered = 1; 
			}
		}

		var that = 'reddit_'+ Math.abs( $scope.hash_code( $scope.post.url_orig )) ; 
		
		if ( ($store.get(that) || 0 ) != 0 )	{
			if ( $scope.auto_skip == true ) {
				filtered = 2; 
			}
		}
		$scope.filtered = filtered; 

		if ( filtered > 0  ) {
			$scope.next();
			//$scope.prev(); // show autoskip button . temp:debug
			return;
		}
		/*if ( $scope.post.domain == 'youtube.com' ) {
		  $scope.post.url = $scope.post.url.replace(/watch.*v\=/, "embed/");	
		  $scope.post.url = $scope.post.url.replace("&amp;", "?");	
		  }
		  if ( $scope.post.domain == 'youtu.be' ) {
		  $scope.post.url = $scope.post.url.replace(/youtu.be/, "youtube.com/embed/");	
		  }
		  $scope.post.url = $scope.post.url.replace('&amp;feature=player_embedded', "");	
		  $scope.post.url = $scope.post.url.replace(/\&amp\;/g, "&");	

*/		
		//		http://qkme.me/3up6t2	
		
		
		if ( typeof $scope.post.replaced == "undefined" ) {

			if ( $scope.post.domain == 'qkme.me' ) {
				$scope.post.url = $scope.post.url.replace(/qkme\.me\/([0-9a-z]+).*/, "i.qkme.me/$1.jpg");	
			}
			if ( $scope.post.domain == 'quickmeme.com' ) {
				$scope.post.url = $scope.post.url.replace(/www\.quickmeme\.com\/meme\/(.*)\//, "i.qkme.me/$1.jpg");	
			}
			if ( $scope.post.domain == 'imgur.com' ) {
				$scope.post.url = $scope.post.url.replace(/\.[a-zA-Z]+$/, "");	
			}
			if ( $scope.post.domain == 'i.imgur.com' ) {
				$scope.post.url = $scope.post.url.replace(/\.[a-zA-Z]+$/, "");	
			}
			$scope.post.url = $scope.post.url.replace(/\&amp\;/g, "&");	
			$scope.post.replaced = true;	
		}

		if ( $scope.auto_open == true ) {
			//alert('auto open');
			//if(  top.location.href != location.href ) {	
		        //		top.location.href = $scope.post.url;
			//} else {
				if ( $scope.openwin == 'false' || $scope.openwin.closed == true ) {
				//alert('new');
				//alert( location.search );
				var w = screen.availWidth;
				var h = screen.availHeight;
				//var w1 = parseInt( w * 0.7 ) ;
				//alert( window.outerWidth ); 
				var w1 = parseInt( w  - window.outerWidth );
				
				$scope.openwin = window.open( $scope.post.url , 'popup'    , 'width='+w1+',height='+h+',left=0' ); 
				
				if ( location.search !='?opened' ) {
					//window.close();
					//$scope.mainwin = window.open( location.href +"?opened"  , 'comments' , 'left='+w1+',width='+(w -w1)+',height='+h ); 
					//window.innerWidth = w - w1;
				}
					
				} else {
				//alert('set');
				$scope.openwin.location.href = $scope.post.url;
				}
			//}
			//	self.document.focus();
		} else {
			//alert( 'no auto open');
		}

		//console.log( $scope.post );	
	}
	
	$scope.hash_code = function(s){
      return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    }
	$scope.set_store = function() {
		//alert('set');
		//mark as read
		var count = $store.get('reddit_count') || 0 ;
		var that = 'reddit_'+ Math.abs( $scope.hash_code( $scope.post.url_orig )) ; 
		
		if( count == 0 ) {
			$store.set('reddit_first', that );	
			$store.set('reddit_last', that );	
			$store.set('reddit_count',0);
			count = 1;
		}	
		if ( count >= $scope.count_max ){
			// remove head
			var first  = $store.get('reddit_first') ;
			var second = $store.get( first );
			$store.remove( first );	
			$store.set( 'reddit_first', second );	
			count--;
		} else {	
		}
		var last = $store.get('reddit_last'); 
		$store.set(last , that)
			if ( ($store.get(that) || 0 ) == 0 ) {
				count++;
			}
		$store.set(that,1); 
		$store.set('reddit_last', that);	
		$store.set('subreddit', $scope.subreddit );
		$store.set('reddit_count', count  );

	}

	var try_auto_next = function(){
		$scope.auto_timer_running = false; 	
		if ( $scope.auto_next == true ) {
			$scope.next();
			$scope.add_timeout();
		}
	}
	$scope.add_timeout = function(){
		return; 
		if( $scope.auto_timer_running == false ) {
			$scope.auto_timer_running = true;
			$timeout(try_auto_next,$scope.auto_timer*1000);
		}
	}
	//$scope.global = global;
	// init
	$scope.subreddit = $store.get('subreddit');
	
	if ( $scope.subreddit == null || $scope.subreddit == '' ) {
		$scope.subreddit = "r/all";
	}
	
	$scope.subreddit_filter = $store.get('subreddit_filter');
	if ( $scope.subreddit_filter == null ) {
		$scope.subreddit_filter = " ";
	}
	
	$scope.load_data();
	//	$scope.add_timeout();
});
