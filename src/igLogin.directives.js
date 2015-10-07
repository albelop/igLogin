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