(function () {


var app = angular.module('affirm', ['ionic', 'affirm.store',
                                    'ngCordova', 'ionic-timepicker']);


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('list', {
    url: '/list',
    templateUrl: 'templates/list.html'
  });

  $stateProvider.state('add', {
    url: '/add',
    templateUrl: 'templates/edit.html',
    // controller: 'AddCtrl'
  });

  $stateProvider.state('edit', {
    url: '/edit/:affirmationId',
    templateUrl: 'templates/edit.html',
    // controller: 'EditCtrl'
  });

  $urlRouterProvider.otherwise('/list');
});


app.controller('ListCtrl', function($scope, Store) {

  $scope.affirmations = Store.list();

  $scope.remove = function(affirmationId) {
    Store.remove(affirmationId);
  };

});


app.controller('EditCtrl', function($scope, $state, Store, $ionicPlatform, $cordovaLocalNotification) {

  var defaultTime = 43200 * 1000;

  if (typeof($state.params.affirmationId) != 'undefined') {
    $scope.affirmation = angular.copy(Store.get($state.params.affirmationId));
  } else {
    $scope.affirmation = {
      id: new Date().getTime().toString(),
      text: '',
      time: defaultTime
    };
  }

  $scope.timePickerObject = {
    inputEpochTime: $scope.affirmation.time / 1000,
    step: 30,  //Optional
    format: 12,  //Optional
    titleLabel: '12-hour Format',  //Optional
    setLabel: 'Set',  //Optional
    closeLabel: 'Close',  //Optional
    setButtonType: 'button-positive',  //Optional
    closeButtonType: 'button-stable',  //Optional
    callback: function (val) {    //Mandatory
      if (typeof (val) != 'undefined') {
        $scope.affirmation.time = val * 1000;
      }
    }
  };

  $scope.save = function() {
    console.log($scope.affirmation);
    Store.update($scope.affirmation);

    var platform = ionic.Platform.platform();

    if (platform != "macintel") {
      $ionicPlatform.ready(function () {
        $cordovaLocalNotification.schedule({
            id: $scope.affirmation.id,
            title: 'Daily Affirmation',
            text: $scope.affirmation.text,
            firstAt: $scope.affirmation.time,
            every: 'day'
            // data: {
            //   // customProperty: 'custom value'
            // }
        });
      });
    }

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
    // if(device.platform === "iOS") {
    //   window.plugin.notification.local.promptForPermission();
    // }
  });
});

}());
