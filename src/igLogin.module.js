(function () {
	'use strict';

	angular.module('ig.login', ['ui.router', 'angular-jwt', 'cryptojs']);

	angular.module('ig.login').config(['$httpProvider', 'jwtInterceptorProvider', 'igLoginProvider', function ($httpProvider, jwtInterceptorProvider, igLoginProvider) {
		jwtInterceptorProvider.tokenGetter = igLoginProvider.getToken;
		$httpProvider.interceptors.push('jwtInterceptor');
		}]);

	angular.module('ig.login').run(['$rootScope', '$state', 'igLogin', function ($rootScope, $state, igLogin) {

		$rootScope.$on('access:logout',
			function () {
				$state.go('login');
			}
		);
		$rootScope.$on('access:login',
			function () {
				if (!!$state.previous && !$state.previous.abstract) {
					$state.go($state.previous, $state.previousParams);
				} else {
					$state.go('home');
				}
			}
		);

		$rootScope.$on('$stateChangeStart',
			function (event, toState) {
				if (toState.name !== 'login') {
					if (!igLogin.checkToken()) {
						event.preventDefault();
					}
				}
			});



		// TODO Mantenerme conectado
		//IgLogin.checkRemember();
		}]);

}());

(function () {
	'use strict';
	angular.module('cryptojs', []).factory('CryptoJS', ['$window', function ($window) {
		return $window.CryptoJS; // assumes underscore has already been loaded on the page
		}]);
}());