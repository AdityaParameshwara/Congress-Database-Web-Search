/**
 * Created by Adhitya on 27-10-2016.
 */
angular.module('congressDatabase',['angularUtils.directives.dirPagination']);

angular.module('congressDatabase').controller('congressDatabaseController', ['$scope','$http', function($scope, $http){

    $scope.initHomePage = function(){
        document.getElementById('legislators').className = "activeSideMenu col-md-12";
        document.getElementById('bills').className = "col-md-12";
        document.getElementById('committees').className = "col-md-12";
        document.getElementById('favourites').className = "col-md-12";
        document.getElementById('billsContent').style.display = 'none';
        document.getElementById('committeesContent').style.display = 'none';
        document.getElementById('favouritesContent').style.display = 'none';
        $scope.showMenu = true;
        $scope.displayLegislatorsByStateInfo();
        $scope.displayBillsContent();
        $scope.displayCommitteesHouseInfo();
        $scope.displayFavouritesContent();
    };


    $scope.toggleMenu = function(){
        if($scope.showMenu){
            document.getElementById('sideMenuItems').style.display = "none";
            document.getElementById('sideMenuContents').setAttribute('class', 'col-md-12 col-xs-12');
            $scope.showMenu = false;
        }
        else{
            document.getElementById('sideMenuContents').setAttribute('class', 'col-md-11 col-xs-10');
            document.getElementById('sideMenuItems').style.display = "block";
            $scope.showMenu = true;
        }
    };

    menuItemClicked = function(id){
        var prevActiveEle = document.getElementsByClassName('activeSideMenu')[0].attributes[0].nodeValue;
        var preActiveEleContents = prevActiveEle+'Content';
        document.getElementById(prevActiveEle).className = "col-md-12";
        document.getElementById(id).className = "activeSideMenu col-md-12";
        document.getElementById(preActiveEleContents).style.display = 'none';
        document.getElementById(id+'Content').style.display = 'block';
        if(id == 'legislators') {
            document.getElementById('legislatorsIconActive').style.display = 'inline-block';
            document.getElementById('legislatorsIconInactive').style.display = 'none';
            $scope.displayLegislatorsByStateInfo();
        }
        else if(id == 'bills') {
            document.getElementById('billsIconActive').style.display = 'inline-block';
            document.getElementById('billsIconInactive').style.display = 'none';
            $scope.displayBillsContent();
        }
        else if(id == 'committees') {
            document.getElementById('committeesIconActive').style.display = 'inline-block';
            document.getElementById('committeesIconInactive').style.display = 'none';
            $scope.displayCommitteesHouseInfo();
        }
        else{
            document.getElementById('favouritesIconActive').style.display = 'inline-block';
            document.getElementById('favouritesIconInactive').style.display = 'none';
            $scope.displayFavouritesContent();
        }
    }

    $('.nav a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $scope.displayLegislatorsByStateInfo = function() {
        $http({method: "GET", url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/", params: {"type":"legislators"}})
            .then(function success(resp){
                 $scope.legislators = JSON.parse(resp.data);
                $scope.legislators = $scope.legislators.results;
            }, function failure(err){
                console.log(err);
            });
        $scope.state = {filterState: ""};
        $scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado","Connecticut","Delaware","District of Columbia","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Calorina","North Dakota","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","massachusetts","Michigan","Minnesota","Mississippi","Missouri","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","American Samoa","Guam","Northern Mariana Islands","Puerto Rico","Virgin Island"];
    };

    $scope.showLegislatorDetails = function(legislator) {
        $scope.selectedLegislator = legislator;
        var start = new Date($scope.selectedLegislator.term_start),  end = new Date($scope.selectedLegislator.term_end), today = new Date();
        $scope.dateDifference = Math.round(((today - start) / (end - start)) * 100);
        $http({
            method: "GET",
            url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/",
            params: {"type" : "fiveCommittees", "bioguide_id": $scope.selectedLegislator.bioguide_id}
        }).then(function success(resp){
            $scope.legislatorCommittees = JSON.parse(resp.data);
            $scope.legislatorCommittees = $scope.legislatorCommittees.results;
        }, function failure(err){
            console.log(err);
        });
        $http({
            method: "GET",
            url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/",
            params: {"type" : "fiveBills", "bioguide_id": $scope.selectedLegislator.bioguide_id}
        }).then(function success(resp){
            $scope.legislatorBills = JSON.parse(resp.data);
            $scope.legislatorBills = $scope.legislatorBills.results;
        }, function failure(err){
            console.log(err);
        });
        var favourites = JSON.parse(localStorage.getItem('legislator'));
        if(favourites != null || favourites != undefined) {
            if(favourites.indexOf(legislator.bioguide_id) == -1) {
                $scope.favourite = false;
            }
            else{
                $scope.favourite = true;
            }
        }
        else {
            $scope.favourite = false;
        }
    };

    $scope.displayBillsContent = function() {
      $http({
        method: "GET",
          url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/",
          params : {"type": "activeBills"}
      }).then(function success(resp){
        $scope.activeBills = JSON.parse(resp.data);
          $scope.activeBills = $scope.activeBills.results;
      }, function failure(err){
            console.log(err);
      });
    };

    $scope.displayNewBillsContent = function() {
      $http({
        method: "GET",
          url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/",
          params : {"type": "newBills"}
      }).then(function success(resp){
        $scope.newBills = JSON.parse(resp.data);
          $scope.newBills = $scope.newBills.results;
      }, function failure(err){
            console.log(err);
      });
    };

    $scope.showBillDetails = function(bill) {
        $scope.selectedBill = bill;
        var favourites = JSON.parse(localStorage.getItem('bill'));
        if(favourites == null || favourites ==undefined){
            $scope.favourite = false;
        }
        else if(favourites.indexOf(bill.bill_id) == -1) {
            $scope.favourite = false;
        }
        else{
            $scope.favourite = true;
        }
    };

    $scope.displayCommitteesHouseInfo = function() {
        $scope.favouriteCommittees = [];
        $http({method: "GET", url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/", params: {"type":"committees"}})
            .then(function success(resp){
                $scope.committees = JSON.parse(resp.data);
                $scope.committees = $scope.committees.results;
                if(localStorage.getItem('committeeFav') != null && localStorage.getItem('committeeFav') !=undefined){
                    $scope.favouriteCommittees = JSON.parse(localStorage.getItem('committeeFav'));
                }
            }, function failure(err){
                console.log(err);
        });
    };

    $scope.changeFavouritesColorCommittees = function(id) {
        var favouriteCommittees = JSON.parse(localStorage.getItem('committeeFav'));
        if(favouriteCommittees == null || favouriteCommittees ==undefined){
            var fav = [id];
            $scope.favouriteCommittees = fav;
            localStorage.setItem('committeeFav', JSON.stringify(fav));
        }
        else{
            if(favouriteCommittees.indexOf(id) == -1) {
                favouriteCommittees.push(id);
                localStorage.setItem('committeeFav', JSON.stringify(favouriteCommittees));
                $scope.favouriteCommittees = favouriteCommittees;
            }
            else{
                for(var i = 0; i < favouriteCommittees.length; i++) {
                    if(favouriteCommittees[i] == id) {
                        favouriteCommittees.splice(i, 1);
                        break;
                    }
                }
                localStorage.setItem('committeeFav', JSON.stringify(favouriteCommittees));
                $scope.favouriteCommittees = favouriteCommittees;
            }
        }
        $scope.displayFavouritesContent();
    };

    $scope.changeFavouritesColor = function(id, type) {
        if (typeof(Storage) !== "undefined") {
            var favourites = JSON.parse(localStorage.getItem(type));
            if(favourites == null || favourites ==undefined){
                var fav = [id];
                $scope.favourite = true;
                localStorage.setItem(type, JSON.stringify(fav));
            }
            else{
                if(favourites.indexOf(id) == -1) {
                    $scope.favourite = true;
                    favourites.push(id);
                    localStorage.setItem(type, JSON.stringify(favourites));
                }
                else{
                    $scope.favourite = false;
                    for(var i = 0; i < favourites.length; i++) {
                        if(favourites[i] == id) {
                            favourites.splice(i, 1);
                            break;
                        }
                    }
                    localStorage.setItem(type, JSON.stringify(favourites));
                }
            }
            $scope.displayFavouritesContent();
        }
    };

    $scope.deleteFavourite = function(id, type) {
        if (typeof(Storage) !== "undefined") {
            var favourites = JSON.parse(localStorage.getItem(type));
            for(var i = 0; i < favourites.length; i++) {
                if(favourites[i] == id) {
                    favourites.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem(type, JSON.stringify(favourites));
            $scope.displayFavouritesContent();
        }
    };

    $scope.displayFavouritesContent = function() {
        $scope.favouriteLegislatorsContents = [];
        $scope.favouriteBillsContents = [];
        $scope.favouriteCommitteesContents = [];
        if(localStorage.getItem('legislator') != null && localStorage.getItem('legislator') != undefined){
            $scope.favouriteLegislatorsIds = JSON.parse(localStorage.getItem('legislator'));

            if($scope.legislators == undefined || $scope.legislators == null) {
                $http({method: "GET", url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/", params: {"type":"legislators"}})
                    .then(function success(resp){
                        var legislators = JSON.parse(resp.data);
                        legislators = legislators.results;
                        for (var i = 0; i < $scope.favouriteLegislatorsIds.length; i++){
                            for(var j = 0; j < legislators.length; j++) {
                                if (legislators[j].bioguide_id == $scope.favouriteLegislatorsIds[i]) {
                                    $scope.favouriteLegislatorsContents.push(legislators[j]);
                                    break;
                                }
                            }
                        }
                    }, function failure(err){
                        console.log(err);
                    });
            }
            else{
                for (var i = 0; i < $scope.favouriteLegislatorsIds.length; i++){
                    for(var j = 0; j < $scope.legislators.length; j++) {
                        if ($scope.legislators[j].bioguide_id == $scope.favouriteLegislatorsIds[i]) {
                            $scope.favouriteLegislatorsContents.push($scope.legislators[j]);
                            break;
                        }
                    }
                }
            }
        }
        if(localStorage.getItem('bill') != null && localStorage.getItem('bill') != undefined){
            $scope.favouriteBillsIds = JSON.parse(localStorage.getItem('bill'));
            if($scope.activeBills == undefined || $scope.activeBills == null || $scope.newBills == undefined || $scope.newBills == null) {
                $http({
                    method: "GET",
                    url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/",
                    params : {"type": "activeBills"}
                }).then(function success(activeBills){
                    $http({
                        method: "GET",
                        url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/",
                        params : {"type": "newBills"}
                    }).then(function success(newBills){
                        var actbills = JSON.parse(activeBills.data);
                        var actbills = actbills.results;
                        var nbills = JSON.parse(newBills.data);
                        var nbills = nbills.results;
                        var bills = actbills.concat(nbills);
                        for (var i = 0; i < $scope.favouriteBillsIds.length; i++){
                            for(var j = 0; j < bills.length; j++) {
                                if (bills[j].bill_id == $scope.favouriteBillsIds[i]) {
                                    var dup = false;
                                    for(var k = 0; k < $scope.favouriteBillsContents.length; k++) {
                                        if($scope.favouriteBillsContents[k].bill_id == bills[j].bill_id){
                                            dup = true;
                                            break;
                                        }
                                    }
                                    if(!dup) {
                                        $scope.favouriteBillsContents.push(bills[j]);
                                    }
                                    break;
                                }
                            }
                        }
                    });
                }, function failure(err){
                    console.log(err);
                });
            }
            else{
                var bills = $scope.activeBills.concat($scope.newBills);
                for (var i = 0; i < $scope.favouriteBillsIds.length; i++){
                    for(var j = 0; j < bills.length; j++) {
                        if (bills[j].bill_id == $scope.favouriteBillsIds[i]) {
                            var dup = false;
                            for(var k = 0; k < $scope.favouriteBillsContents.length; k++) {
                                if($scope.favouriteBillsContents[k].bill_id == bills[j].bill_id){
                                    dup = true;
                                    break;
                                }
                            }
                            if(!dup) {
                                $scope.favouriteBillsContents.push(bills[j]);
                            }
                            break;
                        }
                    }
                }
            }
        }
        if(localStorage.getItem('committeeFav') != null && localStorage.getItem('committeeFav') != undefined){
            $scope.favouriteCommitteesIds = JSON.parse(localStorage.getItem('committeeFav'));
            if($scope.committees == undefined || $scope.committees == null) {
                $http({method: "GET", url: "http://lowcost-env.tzwskpm3qp.us-west-2.elasticbeanstalk.com/", params: {"type":"committees"}})
                    .then(function success(resp){
                        var committees = JSON.parse(resp.data);
                        var committees = committees.results;
                        for (var i = 0; i < $scope.favouriteCommitteesIds.length; i++){
                            for(var j = 0; j < committees.length; j++) {
                                if (committees[j].committee_id == $scope.favouriteCommitteesIds[i]) {
                                    $scope.favouriteCommitteesContents.push(committees[j]);
                                    break;
                                }
                            }
                        }
                    }, function failure(err){
                        console.log(err);
                    });
            }
            else{
                for (var i = 0; i < $scope.favouriteCommitteesIds.length; i++){
                    for(var j = 0; j < $scope.committees.length; j++) {
                        if ($scope.committees[j].committee_id == $scope.favouriteCommitteesIds[i]) {
                            $scope.favouriteCommitteesContents.push($scope.committees[j]);
                            break;
                        }
                    }
                }
            }
        }
    };
}]);