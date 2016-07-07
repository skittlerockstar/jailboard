(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('BoardManagerController', BoardManagerController);

  BoardManagerController.$inject = ['$interval', 'Users', '$scope', 'Global','Boards','Nodes', 'Jailboard','MeanUser','$http'];
  
  function BoardManagerController($interval,Users ,$scope, Global, Boards, Nodes, Jailboard ,MeanUser, $http) {
      $scope.global = Global;
        $scope.popup = false;
        $scope.board;
        $scope.boards;
        $scope.setter = function(val,prop){
            $scope[prop] = val;
        }
        $scope.getter = function(prop){
            return $scope[prop];
        }
        $scope.isAdmin = function(){
            if($.inArray('admin',MeanUser.user.roles) >=0 || $.inArray('developer',MeanUser.user.roles) >= 0 ) {return true;}
            else {return false;}
        }
        $scope.loggedin = function(){
            if(MeanUser.user._id === undefined){Jailboard.reLogin();}
            else {return true;}
        } 
         $interval($scope.loggedin,500);
        $scope.init = function(){
          
            var query;
            if($scope.isAdmin()){
               query = {};
            }else{
                query = {'ownerID':MeanUser.user._id};
            }
            Boards.query(query,function(boards,err){
                $scope.boards = boards;
                if(boards.length ==0){
                    $scope.message = "There are no boards linked to your account";
                }
                boards.forEach(function(b,n){
                    Nodes.count({'boardID':b._id},function(r,e){
                        console.log(r);
                        b.nodes = r.nodeCount;
                    });
//                    todo count users
//                    Nodes.count({'boardID':n._id},function(r,e){
//                        b.nodes = r.nodeCount;
//                    });
                });
                
            });    
            
        };
        $scope.setPopup=function(d){
            $scope.setter(false,'popup');
        }
        $scope.addBoard = function(board){
            $scope.boards.push(board);
        }
        $scope.removeBoard = function(board){
            $scope.boards.pop(board);
        }
        $scope.clearBoard = function(){
             $scope.board = null;
        }
        $scope.suspendBoard = function(board){
            board.suspended = !board.suspended;
             Boards.update(board);
        }
        $scope.createBoard = function(isValid,board){
            $scope.board = board;
            console.log(board);
                var newBoard = new Boards($scope.board);
                newBoard.$save(function(response,err) {
                   
                        $scope.setPopup(false);
                        $scope.addBoard(response);
                
                });
            return null;
        }
        $scope.deleteBoard = function(board){
            console.log(board);
            var c = confirm("Are you sure you want to delete "+board.name);
            if(c){
                board.$remove(function(response) {
                    var index = $scope.boards.indexOf(board);
                    $scope.boards.splice(index, 1);
                });
            }
        }
        $scope.getOwnerID = function(ownerID){
            
        }
          Boards.query({},function(boards){
            console.log(boards);
          });
          if($scope.isAdmin()){
        Users.query({},'name', function (users) {
            $scope.users = users;
        });
    }
  }

})();
