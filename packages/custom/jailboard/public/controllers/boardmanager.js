(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('BoardManagerController', BoardManagerController);

  BoardManagerController.$inject = ['Users', '$scope', 'Global','Boards','Nodes', 'Jailboard','MeanUser','$http'];
  
  function BoardManagerController(Users ,$scope, Global, Boards, Nodes, Jailboard ,MeanUser, $http) {
      $scope.global = Global;
        $scope.popup = false;
        $scope.board;
        $scope.boards;
        $scope.init = function(){
            Boards.query({},function(boards,err){
                $scope.boards = boards;
                boards.forEach(function(b,n){
                    Nodes.count({'boardID':n._id},function(r,e){
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
            $scope.popup = false;
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
            board.suspended = true;
             Boards.update(board);
        }
        $scope.createBoard = function(isValid,board){
            $scope.board = board;
                var newBoard = new Boards($scope.board);
                newBoard.$save(function(response,err) {
                   
                        $scope.setPopup(false);
                        $scope.addBoard(response);
                
                });
            return null;
        }
        $scope.deleteBoard = function(board){
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
                Users.query({},'name', function (users) {
                    $scope.users = users;
                });
  }

})();
