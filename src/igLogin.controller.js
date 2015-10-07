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