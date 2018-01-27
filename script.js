

var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })
        .when('/signin', {
            templateUrl: 'pages/signin.html',
            controller: 'signinController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn(true);
            }]
        })
        .when('/register', {

            templateUrl: 'pages/register.html',
            controller: 'registerController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn(true);
            }]
        })
        .when('/profile', {
            templateUrl: 'pages/profile.html',
            controller: 'profileController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })
        .when('/messages', {
            templateUrl: 'pages/messages.html',
            controller: 'messagesController',
            resolve: ['authService', function (authService) {
                return authService.isLoggedIn();
            }]
        })
        .when('/error', {
            templateUrl: 'pages/error.html',
            controller: 'errorController'
        })
        .otherwise('/error', {
            redirectTo: '/error'
        })
})


app.factory('authService', function ($q, $location) {
    return {
        isLoggedIn: function (flag1) {
            var deferred = $q.defer();
            var userLoggedInData = JSON.parse(localStorage.getItem('loggedInUserData'));
            if (!userLoggedInData) {
                userLoggedInData = {
                    isLoggedIn: false,
                    user: {}
                }
            }
            if (!userLoggedInData.isLoggedIn) {
                console.log('/signin', userLoggedInData);
                if (!flag1) {
                    $location.path('/signin');
                }
                console.log('Test')
                deferred.resolve();
            } else {
                if (flag1) {
                    $location.path('/');
                }
                deferred.resolve();
            };

            return deferred.promise;
        }
    }
})

app.service('usersDataService', function () {
    this.getAllUsersData = function () {
        console.log('called');
        if (JSON.parse(localStorage.getItem('usersData'))) {
            // console.log(JSON.parse(localStorage.getItem('usersData')));
            return JSON.parse(localStorage.getItem('usersData'));
        } else {
            return [];
        }
    }

    this.setAllUsersData = function (obj) {
        localStorage.setItem('usersData', JSON.stringify(obj));
    }

    this.getAllUsernames = function () {
        var users = this.getAllUsersData();
        var usernames = [];
        for (let i = 0; i < users.length; i++) {
            usernames.push(users[i].username);
        }
        return usernames;
    }
});

app.service('msgsService', function () {
    this.getAllMessages = function () {
        if (JSON.parse(localStorage.getItem('allMessages'))) {
            return JSON.parse(localStorage.getItem('allMessages'));
        } else {
            return [];
        }
    }

    this.setAllMessages = function (msgs) {
        localStorage.setItem('allMessages', JSON.stringify(msgs));
    }

    this.updateSingleMessage = function (imp,prop, id) {
        msgs = this.getAllMessages();
        for (let i = 0; i < msgs.length; i++) {
            // const element = array[i];
            if (msgs[i].id == id) {
                msgs[i][prop] = imp;
                this.setAllMessages(msgs);
            }

        }
    }
});

app.controller('mainController', ['$scope', '$rootScope', '$location', 'authService', function ($scope, $location, $rootScope, authService) {
    console.log("Hello from mainController")
    $scope.$on('changedIsLoogedIn', function (event, args) {
        loggedInUserData = JSON.parse(localStorage.getItem('loggedInUserData'));
        $scope.isLoggedIn = args.value;
        $scope.uname = loggedInUserData.user.first_name + " " + loggedInUserData.user.last_name;
    })




    loggedInUserData = JSON.parse(localStorage.getItem('loggedInUserData'));
    if (!loggedInUserData) {
        loggedInUserData = {
            isLoggedIn: false,
            user: {}
        }
    }
    // console.log(loggedInUserData.user);
    $scope.isLoggedIn = loggedInUserData.isLoggedIn;

    $scope.uname = loggedInUserData.user.first_name + " " + loggedInUserData.user.last_name;
    $scope.signOut = function () {
        localStorage.setItem('loggedInUserData', JSON.stringify({
            isLoggedIn: false,
            user: {}
        }));
        $scope.isLoggedIn = false;
    }
}]);

app.controller('homeController', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.companyName = "Marlabs Inc.";
    $scope.user = JSON.parse(localStorage.getItem('loggedInUserData')).user;
    console.log($scope.user);

}])

app.controller('signinController', ['$scope', '$location', '$rootScope', 'usersDataService', '$route', function ($scope, $location, $rootScope, usersDataService, $route) {
    var allUsers;
    var allUsersLength;
    // console.log(allUsersLength);
    // if (allUsersLength > 0) {
    $scope.signinUser = function () {
        allUsers = usersDataService.getAllUsersData();
        console.log(allUsers);
        allUsersLength = allUsers.length;
        for (let index = 0; index < allUsersLength; index++) {

            if (allUsers[index].username == $scope.credentials.username &&
                allUsers[index].password == $scope.credentials.password) {
                console.log("Entered here in if")
                $scope.invalidUsername = false;
                $scope.invalidPassword = false;
                localStorage.setItem('loggedInUserData', JSON.stringify({
                    isLoggedIn: true,
                    user: allUsers[index]
                }));
                $location.path('/');
                $scope.$emit('changedIsLoogedIn', {
                    value: true
                });
            }

        }
    }
    // }
}]);

app.controller('registerController', ['$scope', 'usersDataService', '$location', function ($scope, usersDataService, $location) {

    var allUsers = usersDataService.getAllUsersData();
    var allUserNames;
    // console.log(allUsers);
    // console.log(allUserNames);
    $scope.registerNewUser = function () {
        allUserNames = usersDataService.getAllUsernames();
        $scope.newUser.id = new Date().getTime().toString();
        // console.log($scope.newUser);
        let flag = true;
        for (let i = 0; i < allUserNames.length; i++) {
            // const element = array[i];
            if (allUserNames[i] == $scope.newUser.username) {
                console.log("FLAG IS FALSE NOW");
                flag = false;
            }
        }
        if (flag) {
            allUsers.push($scope.newUser);
            usersDataService.setAllUsersData(allUsers);
            $location.path('/signin');
        } else {
            alert("username already exists!");
        }
    }
}])

app.controller('profileController', ['$scope', 'usersDataService', function ($scope, usersDataService) {
    $scope.editUser = JSON.parse(localStorage.getItem('loggedInUserData')).user;
    console.log("From profileController", $scope.editUser)
    $scope.editedUserSubmit = function () {
        console.log($scope.editUser);
        let allUsers = usersDataService.getAllUsersData();
        for (let i = 0; i < allUsers.length; i++) {
            // const element = array[i];
            if (allUsers[i].username == $scope.editUser.username) {
                allUsers[i] = $scope.editUser;
                usersDataService.setAllUsersData(allUsers);
                localStorage.setItem('loggedInUserData', JSON.stringify({
                    isLoggedIn: true,
                    user: $scope.editUser
                }));
            }
        }
    }

}])

app.controller('messagesController', ['$scope', 'usersDataService', 'msgsService', function ($scope, usersDataService, msgsService) {
    $scope.user = JSON.parse(localStorage.getItem('loggedInUserData')).user;
    $scope.usernames = usersDataService.getAllUsernames();
    var allMsgs = msgsService.getAllMessages();
    $scope.createMessagesFlag = true;
    $scope.newMessage = {
        username: "",
        title: "",
        messageContent: ""
    }
    console.log($scope.newMessage);
    if (!$scope.user.messages) {
        $scope.user.messages = [];
    }
    $scope.selectedClass = {}
    $scope.sendMessage = function () {

        console.log($scope.newMessage);
        let msg = {};
        msg.id = new Date().getTime().toString();
        msg.title = $scope.newMessage.title;
        msg.sender = $scope.user.username;
        msg.recipient = $scope.newMessage.username;
        msg.description = $scope.newMessage.messageContent;
        msg.created_at = new Date().toString();
        msg.important = false;
        msg.thread = [];

        console.log(msg);
        allMsgs.push(msg);
        msgsService.setAllMessages(allMsgs);
        console.log(allMsgs);
        $scope.newMessage = {};
        alert('Message sent successfully!')
        // $scope.myMessages.unshift(msg);
        $scope.myMessages = [];
        for (let i = 0; i < allMsgs.length; i++) {
            const element = allMsgs[i];
            if (element.recipient == $scope.user.username) {
                $scope.myMessages.unshift(element);
            }
        }
        console.log($scope.myMessages);
    }

    $scope.myMessages = [];
    for (let i = 0; i < allMsgs.length; i++) {
        const element = allMsgs[i];
        if (element.recipient == $scope.user.username) {
            $scope.myMessages.unshift(element);
        }
    }
    console.log($scope.myMessages);

    // $scope.randArr = [1, 1, 2, 34, 5, 4];
    // $scope.liClass = [];
    $scope.showMessageDetails = function (index) {
        // $scope.liClass.index = "msg-selected";
        console.log("From $scope.showMessageDetailsObj");
        $scope.showMessageDetailsObj = $scope.myMessages[index];
        $scope.showMessageDetailsFlag = true;
    }
    // $scope.replyContent = {};
    $scope.replyMsg = function () {
        console.log($scope.showMessageDetailsObj.replyContent);
        $scope.showMessageDetailsObj.thread.push({
            recipient: $scope.showMessageDetailsObj.sender,
            sender: $scope.showMessageDetailsObj.recipient,
            description: $scope.showMessageDetailsObj.replyContent,
            created_at: new Date().toString()
        });
        console.log($scope.showMessageDetailsObj)
        msgsService.updateSingleMessage($scope.showMessageDetailsObj.thread,'thread', $scope.showMessageDetailsObj.id);
        $scope.showMessageDetailsObj.replyContent = "";
    };
}]);

app.controller('errorController', ['$scope', function ($scope) {

}]);

app.directive('important', ['msgsService', function (msgsService) {
    return {
        template: '<button ng-click="clicked()"  ng-class="classValue"><i class="fa fa-star" aria-hidden="true"></i></button>',
        link: {
            pre: function (scope, elem, attr) {

                // scope.important = scope.message.important;
                if (scope.message.important) {
                    scope.classValue = 'important-class';
                } else {
                    scope.classValue = 'not-important-class';
                }
                scope.unam = scope.message.sender;
                // scope.classValue = 'important-class';
                scope.clicked = function () {
                    scope.message.important = !scope.message.important;
                    var hello = msgsService.getAllMessages();
                    msgsService.updateSingleMessage(scope.message.important, 'important',scope.message.id);
                    console.log(hello);
                    if (scope.message.important) {
                        scope.classValue = 'important-class';
                    } else {
                        scope.classValue = 'not-mportant-class';
                    }
                }
            }
        }
    }
}]);

// app.directive('changLiBackground', function () {
//     return {
//         template: '',
//         link: {
//             pre: function (scope, elem, attr) {
//                 scope.selectedClass = "msg-selected";
//             }
//         }
//     }
// })