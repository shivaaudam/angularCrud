var app = angular.module('demoCrud', ['demo.mock']);

app.controller('MainCtrl', function($scope, User, Color) {
  $scope.colors = Color.query();
  $scope.user = {};
  
  $scope.addUser = function() {
    if($scope.TestForm.$valid) {
      User.save($scope.user);
      $scope.user = {};
      $scope.users = User.query();
    }
  }
  
  $scope.findUsers = function() {
    $scope.users = User.query();
  }
  
  $scope.findUsers();
});

app.directive('controlGroup', function() {
  return {
    templateUrl: 'p_control-group.html',
    transclude: 'element',
    replace: true,
    scope: { controlGroup: '=controlGroup' },
    link: function(scope) {
      console.log(scope)
    }
  };
});

app.directive('formError', function(){
    return {
      restrict: 'EMCA',
      templateUrl: 'p_form-error.html',
      transclude: 'true',
      replace: true,
      scope: { inputKey : '=key'},
    };
});

app.directive('userNameValidation', function(){
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if(!ngModel) return; // do nothing if no ng-model
 
        var isConflict = function(value) {
          var conflict = false;
          angular.forEach(scope.users, function(u) {
            console.log(value, u, scope.users);
            if(u.name === value) {
              conflict = true;
            }
          });
          return conflict;
        }
        
    		var validator = function(value) {
          ngModel.$setValidity('minlength', !(value.length < 9)); 
          ngModel.$setValidity('maxlength', !(value.length > 9));
          ngModel.$setValidity('conflict', !isConflict(value));
          return value;
  			};
        
        ngModel.$parsers.push(validator);
      }
    };
});

app.directive('userAgeValidation', function(){
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if(!ngModel) return; // do nothing if no ng-model
 
        function AgeValidationSpec(value) {
          var age = value;
          return {
            get isInteger() {
              return /^[0-9]+$/.test(value);
            },
            get isLessThan30() {
              return age <= 30;
            },
            get isOlderThan5() { 
              return age >= 5;
            },
          }
        }
        
      	var validator = function(value) {
          var spec = AgeValidationSpec(value);
          ngModel.$setValidity('integer', spec.isInteger);
          ngModel.$setValidity('too_young', spec.isOlderThan5);
          ngModel.$setValidity('too_old', spec.isLessThan30);
          return value;
  			};
        
        ngModel.$parsers.push(validator);
      }
    };
});

var mock = angular.module('demo.mock', []);

mock.factory('User', function() {
  var users = [];
  
  return {
    query: function() {
      return users;
    },
    save: function(user) {
      users.push(angular.copy(user));
    }
  }
});

mock.factory('Color', function() {
  return {
    query: function() {
      return ['red', 'blue', 'green'];
    }
  }
});