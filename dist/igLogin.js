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
(function () {
	'use strict';

	angular.module('ig.login').controller('igLoginCtrl', ['$scope', 'igLogin', function ($scope, igLogin) {
		this.getUser = igLogin.getUserData;

		this.get = function (username, password, keeplogged) {
			keeplogged = keeplogged || false;
			igLogin.get(username, password).then(function (response) {
				igLogin.login(response.data, keeplogged);
			}, function (error) {
				$scope.error = error.data;
			});
		};

	}]);


}());
(function () {
	'use strict';

	angular.module('ig.login')
		.directive('igLoginForm', function () {
			return {
				restrict: 'EA',
				template: '<form ng-submit="login.get(username, password,keeplogged)">' +
					'<div class="form-group">' +
					'<label for="username">Usuario</label>' +
					'<input type="text" ng-model="username" class="form-control col-sm-12" id="username" placeholder="Introduzca el nombre de usuario"  required>' +
					'</div>' +
					'<div class="form-group">' +
					'<label for="password">Contraseña</label>' +
					'<input type="password" class="form-control col-sm-12" id="password" placeholder="Contraseña" ng-model="password" required>' +
					'</div>' +
					'<div class="form-group">' +
					'<input type="checkbox" ng-model="loginData.keeplogged"> No cerrar sesión' +
					'</div>' +
					'<button type="submit" class="btn btn-block btn-default">Entrar</button>' +
					'<div class="alert alert-danger" ng-if="error">{{error}}</div>' +
					'</form>',
				controller: 'igLoginCtrl',
				controllerAs: 'login'
			};
		});

	angular.module('ig.login')
		.directive('igLogout', function () {
			return {
				restrict: 'A',
				controller: ['$scope', 'igLogin', function ($scope, igLogin) {
					$scope.logOut = function () {
						igLogin.logout();
					};
				}],
				compile: function () {
					return {
						pre: function (scope, iElement, iAttrs) {
							iAttrs.ngClick = 'logOut()';
						}
					};
				}
			};
		});

}());
(function () {
	'use strict';

	angular.module('ig.login').provider('igLogin', function () {
		var params = {
			path: '../api/login',
		};

		var setParams = function (settings) {
			params=settings;
		};

		var getParams = function () {
			return params;
		};

		var setToken = function (token) {
			localStorage.setItem('id_token', token);
		};

		var getToken = function () {
			return localStorage.getItem('id_token');
		};
		var setRemember = function (remember) {
			localStorage.setItem('keeplogged', remember);
		};

		var getRemember = function () {
			return localStorage.getItem('keeplogged');
		};

		this.getToken = getToken;
		this.setParams = setParams;

		this.$get = ['$http', 'jwtHelper', '$rootScope', 'CryptoJS', function ($http, jwtHelper, $rootScope, CryptoJS) {
			var _provider = {};

			_provider.login = function (token, remember) {
				setToken(token);
				setRemember(remember);
				$rootScope.$broadcast('access:login');
			};

			_provider.logout = function () {
				localStorage.removeItem('id_token');
				localStorage.removeItem('keeplogged');
				$rootScope.$broadcast('access:logout');
			};
			_provider.checkToken = function () {
				var token = getToken();
				var result = true;
				if (!token || jwtHelper.isTokenExpired(token)) {
					$rootScope.$broadcast('access:logout');
					result = false;
				}
				return result;
			};


			_provider.checkRemember = function () {
				var remember = getRemember() === 'true';
				var result = true;
				if (remember) {
					$rootScope.$broadcast('access:logout');
					result = false;
				}
				return result;
			};

			_provider.getUserData = function () {
				var token = getToken();
				var result = {};
				if (token) {
					result = jwtHelper.decodeToken(token);
				}
				return result;
			};
			_provider.get = function (username, password) {
				var sha256pass = CryptoJS.SHA256(password);
				// Codificamos los campos user_password para la cabecera Authorization de HTTP
				var base64 = btoa(username + ':' + sha256pass);

				// TODO establecer ruta mediante constante y config.
				return $http.get(getParams().path, {
					headers: {
						'Authorization': 'Basic ' + base64
					}
				});
			};
			return _provider;
		}];
	});
}());