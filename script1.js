// var app = angular.module('myApp', ['ngRoute']);

// app.config(function ($routeProvider) {
//     $routeProvider.when('/', {
//         templateUrl: 'pages/home.html',
//         controller: 'homeController'
//     })
//         .when('/signin', {
//             templateUrl: 'pages/signin.html',
//             controller: 'signinController'
//         })
//         .when('/register', {

//             templateUrl: 'pages/register.html',
//             controller: 'registerController'
//         })
//         .when('/profile', {
//             templateUrl: 'pages/profile.html',
//             controller: 'profileController',
//             resolve: ['authService', function(authService, $location) {
//                 if(!authService.isLoggedIn){
//                     $location.path('/signin');
//                 }
//                 return authService.isLoggedIn;
//             }]
//         })
//         .when('/messages', {
//             templateUrl: 'pages/messages.html',
//             controller: 'messagesController'
//         })
//         .otherwise('/error', {
//             templateUrl: 'pages/error.html',
//             controller: 'errorController'
//         })
// });

// app.service('authService', function ($location) {
//     this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
//     this.isLoggedIn = this.loggedInUser.isLoggedIn;
//     this.loggedInUserObject = this.loggedInUser.loggedInUserObject;
// });

// app.controller('mainController', ['$scope', '$rootScope', '$location', '$route', function ($scope, $rootScope, $location, $route) {

//     // $scope.isLoggedIn = JSON.parse(localStorage.getItem('loggedInUser')) ? JSON.parse(localStorage.getItem('loggedInUser')).isLoggedIn : false;
//     // console.log($scope.isLoggedIn);

//     $scope.signOut = function () {

//         localStorage.removeItem('loggedInUser');
//         console.log("Heerere");
//         $scope.isLoggedIn = false;
//         // $location.path('/signin');
//     }
// }]);
// app.controller('homeController', ['$scope', function ($scope) {

//     $scope.companyName = "Marlabs Inc.";

// }]);

// app.controller('signinController', ['$scope', '$location', '$rootScope', function ($scope, $location, $rootScope) {
//     $scope.signinUser = function () {
//         console.log($scope.user);
//         // $rootScope.isLoggedIn = JSON.parse(localStorage.getItem('loggedInUser')).isLoggedIn;
//         console.log($scope.isLoggedIn);
//         var users = JSON.parse(localStorage.getItem('user'));

//         if (users.username !== $scope.user.username) {
//             console.log("Invalid username");
//         } else if (users.password !== $scope.user.password) {
//             console.log("Invalid password");
//         } else {
//             var loggedInUser = {
//                 isLoggedIn: true,
//                 user: users
//             }
//             localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
//             console.log(loggedInUser);
//             $location.path('/profile');
//         }
//     }

// }]);

// // app.controller('signoutController', ['$scope', function ($scope) {

// // }]);

// app.controller('registerController', ['$scope', function ($scope) {
//     $scope.registerNewUser = function () {
//         $scope.newUser.id = new Date().getTime().toString();
//         console.log($scope.newUser);
//         localStorage.setItem('user', JSON.stringify($scope.newUser));
//     }
// }]);

// app.controller('profileController', ['$scope', function ($scope) {

// }]);

// app.controller('messagesController', ['$scope', function ($scope) {

// }]);


var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })
        .when('/signin', {
            templateUrl: 'pages/signin.html',
            controller: 'signinController'
        })
        .when('/register', {

            templateUrl: 'pages/register.html',
            controller: 'registerController'
        })
        .when('/profile', {
            templateUrl: 'pages/profile.html',
            controller: 'profileController',
            resolve: ['authService', function(authService, $location) {
                return authService.isLoggedIn;
            }]
        })
        .when('/messages', {
            templateUrl: 'pages/messages.html',
            controller: 'messagesController'
        })
        .otherwise('/error', {
            templateUrl: 'pages/error.html',
            controller: 'errorController'
        })
});


app.factory('authService', function($location, $http, $q){
    var user = {};
    return {
        isLoggedIn: function() {
            var prom = $q.defer();
            $http.get('http://127.0.0.1:8080/auth.json').then(function(resp) {
                if(resp.data.isLoggedIn){
                    this.user = resp.data.user;
                    prom.resolve();
                } else {
                    prom.reject();
                    $location.path('/signin');
                }
            });
            return prom.promise;
        },

        getUser: function() {
            return this.user;
        },

        setUser: function(userObj){
            var prom = $q.defer();
            $http.post('http://127.0.0.1:8080/auth.json', JSON.stringify({
                isLoggedIn: true,
                user: userObj
            })).then(function(resp) {
                prom.resolve();
            }, function(resp) {
                prom.reject();
            });

            return prom.promise;
        }
    }
});



app.controller('mainController', ['$scope', '$rootScope', '$location', '$route', function ($scope, $rootScope, $location, $route) {

        // $scope.isLoggedIn = JSON.parse(localStorage.getItem('loggedInUser')) ? JSON.parse(localStorage.getItem('loggedInUser')).isLoggedIn : false;
        // console.log($scope.isLoggedIn);
    
        $scope.signOut = function () {
    
            localStorage.removeItem('loggedInUser');
            console.log("Heerere");
            $scope.isLoggedIn = false;
            // $location.path('/signin');
        }
    }]);
    app.controller('homeController', ['$scope', function ($scope) {
    
        $scope.companyName = "Marlabs Inc.";
    
    }]);
    
    app.controller('signinController', ['$scope', '$location', '$rootScope', function ($scope, $location, $rootScope) {
        $scope.signinUser = function () {
            console.log($scope.user);
            // $rootScope.isLoggedIn = JSON.parse(localStorage.getItem('loggedInUser')).isLoggedIn;
            console.log($scope.isLoggedIn);
            var users = JSON.parse(localStorage.getItem('user'));
    
            if (users.username !== $scope.user.username) {
                console.log("Invalid username");
            } else if (users.password !== $scope.user.password) {
                console.log("Invalid password");
            } else {
                var loggedInUser = {
                    isLoggedIn: true,
                    user: users
                }
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                console.log(loggedInUser);
                $location.path('/profile');
            }
        }
    
    }]);
    
    // app.controller('signoutController', ['$scope', function ($scope) {
    
    // }]);
    
    app.controller('registerController', ['$scope', function ($scope) {
        $scope.registerNewUser = function () {
            $scope.newUser.id = new Date().getTime().toString();
            console.log($scope.newUser);
            localStorage.setItem('user', JSON.stringify($scope.newUser));
        }
    }]);
    
    app.controller('profileController', ['$scope', function ($scope) {
    
    }]);
    
    app.controller('messagesController', ['$scope', function ($scope) {
    
    }]);



        // .service('loggedInUserDataService', function ($rootScope) {
    //     this.getLoggedInUser = function () {
    //         console.log('called from loggedInUserDataService');
    //         if (JSON.parse(localStorage.getItem('loggedInUserData'))) {
    //             $rootScope.isLoggedIn = JSON.parse(localStorage.getItem('loggedInUserData')).isLoggedIn;
    //             return JSON.parse(localStorage.getItem('loggedInUserData'));
    //         } else {
    //             $rootScope.isLoggedIn = false;
    //             return {
    //                 isLoggedIn: false,
    //                 user: {}
    //             };
    //         }
        // }

    //     this.setLoggedInUser = function (obj) {
    //         localStorage.setItem('loggedInUserData', JSON.stringify(obj));
    //         this.getLoggedInUser();
    //     }
    // })