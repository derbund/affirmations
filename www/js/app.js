(function () {


var app = angular.module('affirm', ['ionic', 'affirm.store', 'ngCordova']);


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('list', {
    url: '/list',
    templateUrl: 'templates/list.html'
  });

  $stateProvider.state('add', {
    url: '/add',
    templateUrl: 'templates/edit.html',
    controller: 'AddCtrl'
  });

  $stateProvider.state('edit', {
    url: '/edit/:affirmationId',
    templateUrl: 'templates/edit.html',
    controller: 'EditCtrl'
  });

  $urlRouterProvider.otherwise('/list');
});

app.controller('ListCtrl', function($scope, Store) {

  $scope.affirmations = Store.list();

  $scope.remove = function(affirmationId) {
    Store.remove(affirmationId);
  };

});


app.controller('AddCtrl', function($scope, $state, Store, $ionicPlatform, $cordovaLocalNotification) {

  $scope.affirmation = {
    id: new Date().getTime().toString(),
    text: '',
  };

  $scope.save = function() {
    Store.create($scope.affirmation);

    $ionicPlatform.ready(function () {
      var now = new Date().getTime();
      var _10SecondsFromNow = new Date(now + 10 * 1000);
      $cordovaLocalNotification.schedule({
          id: $scope.affirmation.id,
          title: 'Daily Affirmation',
          text: $scope.affirmation.text,
          at: _10SecondsFromNow
          // data: {
          //   // customProperty: 'custom value'
          // }
      });
    });

    $state.go('list');
  };
});


app.controller('EditCtrl', function($scope, $state, Store) {

  $scope.affirmation = angular.copy(Store.get($state.params.affirmationId));

  $scope.save = function() {
    Store.update($scope.affirmation);
    $state.go('list');
  };
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    if(device.platform === "iOS") {
      window.plugin.notification.local.promptForPermission();
    }
  });
});

}());
