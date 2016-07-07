'use strict';

angular.module('mean.admin').controller('UsersController', ['$scope', 'Global', 'Menus', '$rootScope', '$http', 'Users','Boards', 'Circles',
    function ($scope, Global, Menus, $rootScope, $http, Users, Boards, Circles) {

        $scope.global = Global;
        $scope.user = {};
        $scope.curUser;
        $scope.isAdmin = false;

        Circles.mine(function (acl) {

            var circles = acl.allowed;

            $scope.userSchema = [{
                    title: 'Email',
                    schemaKey: 'email',
                    type: 'email',
                    inTable: true
                }, {
                    title: 'Name',
                    schemaKey: 'name',
                    type: 'text',
                    inTable: true
                }, {
                    title: 'Username',
                    schemaKey: 'username',
                    type: 'text',
                    inTable: true
                }, {
                    title: 'Roles',
                    schemaKey: 'roles',
                    type: 'select',
                    options: circles,
                    inTable: true
                }, {
                    title: 'Password',
                    schemaKey: 'password',
                    type: 'password',
                    inTable: false
                }, {
                    title: 'Repeat password',
                    schemaKey: 'confirmPassword',
                    type: 'password',
                    inTable: false
                }];

        });



        $scope.init = function () {
            //CUSTOM Get loggedin User
            $http.get('api/users/me').success(function (d) {
                $scope.curUser = d;
                //CUSTOM check if user is admin
                if (d.roles.indexOf("admin") > -1) {
                    $scope.isAdmin = true;
                }
                
                Users.query({}, function (users) {
                //CUSTOM remove user from user list when dev or logged in
                var usersToRemove = [];
                    users.forEach(function (u, n) {
//                    if (u.roles.indexOf("developer") > -1 || d.username == u.username) {
//                        usersToRemove.push(n);
//                    }
                });
                
                usersToRemove.reverse();
                usersToRemove.forEach(function(i,n){
                   users.splice(i,1); 
                });
                //CUSTOM  if the list is empty show message
                if(users.length == 0){
                    //TODO show message
                }
                $scope.users = users;
            });
            });
            
        };

        $scope.add = function (valid) {
            if (!valid)
                return;
            if (!$scope.users)
                $scope.users = [];

            var user = new Users({
                email: $scope.user.email,
                name: $scope.user.name,
                username: $scope.user.username,
                password: $scope.user.password,
                confirmPassword: $scope.user.confirmPassword,
                roles: $scope.user.roles
            });

            user.$save(function (data, headers) {
                $scope.user = {};
                $scope.users.push(user);
                $scope.userError = null;
            }, function (data, headers) {
                $scope.userError = data.data;
            });
        };

        $scope.remove = function (user) {
            for (var i in $scope.users) {
                if ($scope.users[i] === user) {
                    $scope.users.splice(i, 1);
                }
            }

            user.$remove();
        };

        $scope.update = function (user, userField) {
            if (userField && userField === 'roles' && user.tmpRoles.indexOf('admin') !== -1 && user.roles.indexOf('admin') === -1) {
                if (confirm('Are you sure you want to remove "admin" role?')) {
                    user.$update();
                } else {
                    user.roles = user.tmpRoles;
                }
            } else
                user.$update();
        };

        $scope.beforeSelect = function (userField, user) {
            if (userField === 'roles') {
                user.tmpRoles = user.roles;
            }
        };
    }
]);
