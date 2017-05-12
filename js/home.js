/**
 * Created by admin on 11/23/2015.
 */
var base_url = "http://115.124.125.42/Tolls/api/2019/";
var loginstatus = true;
var refreshIntervalId;
var Tollr = angular.module('Tollr', []);


Tollr.controller('Ctrl2', function ($scope, $timeout) {
    $scope.format = 'H:mm:ss';
    $scope.dateformat = ' d MMM, y';

}).directive('myCurrentTime', function ($timeout, dateFilter) {

    return function (scope, element, attrs) {
        //console.log(attrs);
        var format,  // date format
            dateformat,
            timeoutId; // timeoutId, so that we can cancel the time updates

        // used to update the UI
        function updateTime() {
            element.text(dateFilter(new Date(), format, dateformat));
        }

        // watch the expression, and update the UI on change.
        scope.$watch(attrs.myCurrentTime, function (value) {
            format = value;
            dateformat = value;
            updateTime();
        });

        // schedule update in one second
        function updateLater() {
            // save the timeoutId for canceling
            timeoutId = $timeout(function () {
                updateTime(); // update DOM
                updateLater(); // schedule another update
            }, 1000);
        }

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time ofter the DOM element was removed.
        element.bind('$destroy', function () {
            $timeout.cancel(timeoutId);
        });

        updateLater(); // kick off the UI update process.
    }
});

Tollr.controller('HomeController', function ($scope, $timeout, $element, $http, loginService, listService, changeStatusService, searchService, violationAdd, vehicalTypes) {
    var tmp = true;
    $scope.logincolor = "";
    $scope.userdetails = true;
    $scope.userdetails2 = true;
    $scope.wrongentry2 = true;
    $scope.wrongentry3 = true;
    $scope.wrongentry1 = true;
    $scope.vioadd2;
    $scope.vioadd;
    $scope.vehical_types = vehicalTypes.GetList($http,$scope);

    $http.defaults.headers.post["Accept"] = "*/*";
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $scope.vehical_types = vehicalTypes.GetList($http,$scope);
    loginService.getList($http, $scope, 0, listService);
    setint();
    if (!loginstatus) {
        $scope.list = true;
        $scope.login = false;
        $scope.login = false;
        loginService.getList($http, $scope, 0, listService);
        setint();
        $scope.loginS = function (user_login) {
            //loginService.getList($http, $scope, user_login, listService);
            //setint();
        };
    }
    $scope.violationAdd = function(val){
        $timeout(function() {
            angular.element('#ng-camera-action').triggerHandler('click');
            $scope.vioadd.vehical_picture = vm.picture;
            violationAdd.SetViolation($http, $scope, listService);
            console.log(vm.picture);
        });

    };
    $scope.showDetails = function (x) {
        $scope.userdetails = true;
        $scope.userdetails2 = true;
        $scope.wrongentry1 = true;
        $scope.wrongentry2 = true;
        $scope.userdetails = false;
        $scope.userdetail = x;
        console.log($scope.userdetail.user_name);

    };
    $scope.signOut = function () {
        loginstatus = false;

        $scope.list = true;
        $scope.login = true;
        clearInterval(refreshIntervalId);
    };
    $scope.changeColor = function (color) {
        $scope.logincolor = color;
    };
    $scope.changeStatus = function (details) {
        $timeout(function() {
            angular.element('#ng-camera-action').triggerHandler('click');
            $scope.vehical_picture = vm.picture;
            changeStatusService.getList($http, $scope, details);

            console.log(vm.picture);
        });


    };
    $scope.vehicalImage = function (vechicalt) {
        if (vechicalt == 1) {
            return "veh-1.png";
        } else if (vechicalt == 2) {
            return "veh-2.png";
        } else if (vechicalt == 3) {
            return "veh-3.png";
        } else if (vechicalt == 4) {
            return "veh-4.png";
        } else if (vechicalt == 5) {
            return "veh-5.png";
        } else if (vechicalt == 6) {
            return "veh-6.png";
        } else if (vechicalt == 7) {
            return "veh-7.png";
        } else if (vechicalt == 8) {
            return "veh-8.png";
        }

    };
    function setint() {
        refreshIntervalId = setInterval(function () {
            listService.getList($http, $scope);
            loginstatus = true;

        }, 30000);
    }

    $scope.searchVechical = function () {
        if ($scope.search.length > 4) {
            searchService.getList($http, $scope);

        }

    };
    var vm = this;

    $scope.cameraShot = function(){
        $timeout(function() {
            angular.element('#ng-camera-action').triggerHandler('click');
            console.log(vm.picture);
        });
       // console.log(link.getSnapshot());
    };


});

Tollr.service('loginService', function () {

    return {
        getList: function ($http, $scope, user_login, listService) {
            console.log(user_login);
            $http.defaults.headers.post["Accept"] = "*/*";
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                url: base_url + 't/l',
                method: "POST",
                data: $.param({
                    username: 'IGIA_EID_01',//user_login.employee_id,
                    password: '123456789',//user_login.password,
                    toll_unique_number: configVar.toll_unique_number
                })
            })
                .then(function (response) {
                        //$scope = response.data;
                        loginstatus = true;
                        $scope.list = response.data.list;
                        $scope.login = response.data.login;
                        $scope.TollName = response.data.Info.toll.toll_name;
                        $scope.RoadName = response.data.Info.toll.motorway_id;
                        $scope.TollID = response.data.Info.toll.toll_unique_number;
                        $scope.toll_id= response.data.Info.toll.toll_id;
                        $scope.Towords = 'Both';//response.data.Info.boothside.boothside_from;
                        $scope.Concessioner = 'Ram';//response.data.Info.tolldetails.toll_concessionaire;
                        $scope.CollectorName = response.data.CollectorName;
                        $scope.access_token = response.data.Info.user.access_token;
                        $scope.username = response.data.Info.user.toll_employee_id;
                        $scope.toll_user_id = response.data.Info.user.toll_user_id;
                        if(response.data.Code == 200){
                            listService.getList($http, $scope);
                            return response;
                        }

                        // success

                        //console.log(response);
                    },
                    function (response) { // optional
                        //console.log(response);
                        // failed
                    });
        }
    };
});

Tollr.service('listService', function () {

    return {
        getList: function ($http, $scope) {
            $http.defaults.headers.post["Accept"] = "*/*";
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                url: base_url+"t/list/"+$scope.toll_id,
                method: "POST",
                data: $.param({toll_user_id: $scope.toll_user_id, access_token: $scope.access_token, booth_id:configVar.booth_id, boothside_id:configVar.bootside_id})
            })
                .then(function (response) {
                        // success
                        $scope.userdetails = true;
                        if(response.data.Code == 200){
                            $scope.listcars = response.data.Info;

                        }else{
                            $scope.listcars =[];
                        }

                        return response;
                        //console.log(response);
                    },
                    function (response) { // optional
                        //console.log(response);
                        // failed
                    });
        }
    };
});

Tollr.service('changeStatusService', function () {

    return {
        getList: function ($http, $scope, details) {
            $http.defaults.headers.post["Accept"] = "*/*";
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                url: base_url+"t/s",
                method: "POST",
                data: $.param({toll_user_id: $scope.toll_user_id, access_token: $scope.access_token, booth_id:configVar.booth_id, boothside_id:configVar.bootside_id,trip_details_id:details.trip_details_id,user_id:details.user_id,vehical_picture:$scope.vehical_picture})

            })
                .then(function (response) {
                        // success
                        $scope.userdetails = true;
                        if(response.data.Code == 200){
                            $scope.listcars = response.data.Info;
                        }else{
                            $scope.listcars =[];
                        }

                        return response;
                        //console.log(response);
                    },
                    function (response) { // optional
                        //console.log(response);
                        // failed
                    });
        }
    };
});

Tollr.service('searchService', function () {

    return {
        getList: function ($http, $scope) {
            $http.defaults.headers.post["Accept"] = "*/*";
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                url: base_url+"t/searchvech",
                method: "POST",
                data: $.param({registration_number: $scope.search, toll_id :$scope.toll_id, booth_id:configVar.booth_id, boothside_id:configVar.bootside_id})
            })
                .then(function (response) {
                        console.log($scope.search);
                        // success
                        $scope.userdetails = true;
                        $scope.userdetails2 = true;
                        $scope.wrongentry1 = true;
                        $scope.wrongentry2 = true;
                        $scope.wrongentry3 = true;

                        if (response.data.trip_type == 1) {
                            $scope.listcars = response.data.Info;
                            $scope.userdetail = response.data.Info[0];
                            $scope.userdetails = false;
                        } else if (response.data.trip_type == 2) {
                            $scope.userdetails2 = false;
                            $scope.userdetail = response.data.Info;
                        } else if (response.data.trip_type == 3) {
                            $scope.wrongentry1 = false;
                            $scope.vioadd = response.data.Info;
                        } else if (response.data.trip_type == 4) {
                            $scope.wrongentry2 = false;
                            $scope.vioadd = response.data.Info[0];
                        }else if (response.data.trip_type == 5) {
                            $scope.wrongentry3 = false;
                            $scope.vioadd2 = response.data.Info;
                            $scope.vioadd = response.data.Info[0];
                        }

                        return $scope;
                        //console.log(response);
                    },
                    function (response) { // optional
                        //console.log(response);
                        // failed
                    });
        }
    };
});

Tollr.service('violationAdd', function () {

    return {
        SetViolation: function ($http, $scope) {
            $scope.vioadd.toll_id = $scope.toll_id;
            $scope.vioadd.toll_booth_id = configVar.booth_id;
            $scope.vioadd.toll_side_id = configVar.bootside_id;
            $http.defaults.headers.post["Accept"] = "*/*";
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                url: base_url+'t/vioadd',
                method: "POST",
                data: $.param($scope.vioadd)
            })
                .then(function (response) {
                        console.log(response);
                    if(response.data.Code == 200){
                        $scope.wrongentry1 = true;
                        $scope.wrongentry2 = true;
                        $scope.wrongentry3 = true;
                    }

                        return response;
                        //console.log(response);
                    },
                    function (response) { // optional
                        //console.log(response);
                        // failed
                    });
        }
    };
});

Tollr.service('vehicalTypes', function () {

    return {
        GetList: function ($http, $scope) {
            $http.defaults.headers.post["Accept"] = "*/*";
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                url: base_url+'t/vehicaltypes',
                method: "GET",
            })
                .then(function (response) {
                        console.log(response);
                        $scope.vehical_types = response.data;

                        return response;
                        //console.log(response);
                    },
                    function (response) { // optional
                        //console.log(response);
                        // failed
                    });
        }
    };
});




