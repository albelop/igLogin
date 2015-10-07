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