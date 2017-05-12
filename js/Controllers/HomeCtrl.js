/**
 * @ngdoc controller
 * @name Home
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */
var vechicals_types = ['Bike','Car','LCV','BUS/TRUCK','Upto 3 Axle Vehicle','4 to 6 Axle', 'HCM/EME','7 or more Axle'];

(function (angular) {
    'use strict';
    var myApp = angular.module('Tollr', ['ngAnimate', 'ngCookies']);
    myApp.controller('Home', function ($scope,$timeout, $cookieStore, $http, $filter, Approc, User) {
        $scope.logged = false;
        $scope.ve =[];
        if ($cookieStore.get('toll_id')) {
            $scope.logged = true;
            $scope.toll_id = $cookieStore.get('toll_id');
            $scope.access_token = $cookieStore.get('access_token');
            User.Load($http, $scope);
            //User.TollDetails($http, $scope);
            //User.UserDetails($http, $scope,$cookieStore);
            //Approc.GetList($http, $scope);
        }

        $scope.Login = function () {
            console.log($scope.user);
            User.login($http, $scope, $cookieStore);
        };

        var vm = this;

        $scope.cameraShot = function(){
            $timeout(function() {
                angular.element('#ng-camera-action').triggerHandler('click');

                console.log(vm.picture);
            });
            // console.log(link.getSnapshot());
        };
        //$cookieStore.put('toll_id','37');
        //$scope.logged = true;

        $scope.changeColor = function (color) {
            $scope.logincolor = color;
        };

        $scope.signOut = function () {
            $cookieStore.remove('access_token');
            $cookieStore.remove('toll_id');
            $scope.logged = false;
        };
        $scope.NOTTOLLERED = false;
        $scope.ShowDetails = function (vehic) {
            $scope.NOTTOLLERED = true;
            $scope.registration_number = vehic.registration_no;
            $scope.vehical_type = vechicals_types[vehic.vechical_type_id -1];
            $scope.vech = vehic;
            console.log(vehic.trip_details_id);
            //alert('kk');
        };

        $scope.SearchVehicle = function () {
            Approc.SearchVech($http, $scope);
            alert($scope.searchWord);
        };

        $scope.AllowButton = function () {
            $timeout(function() {
                angular.element('#ng-camera-action').triggerHandler('click');
                $scope.vehical_picture = vm.picture;
                Approc.AllowVech($http,$scope);
//                changeStatusService.getList($http, $scope, details);

                console.log(vm.picture);
            });
            //alert('kkk');
        };

        $scope.ReportButton = function () {
            angular.element('#ng-camera-action').triggerHandler('click');
            $scope.vehical_picture = vm.picture;
            //Approc.ReportVech($http,$scope);
            console.log($scope.ve.notToller.$$lastCommittedViewValue);
            alert('kkkk');
        };

        $scope.VehicalImage = function (vechicalt) {
            if (vechicalt == 1) {
                return "axel-1.png";
            } else if (vechicalt == 2) {
                return "axel-2.png";
            } else if (vechicalt == 3) {
                return "axel-3.png";
            } else if (vechicalt == 4) {
                return "axel-4.png";
            } else if (vechicalt == 5) {
                return "axel-5.png";
            } else if (vechicalt == 6) {
                return "axel-6.png";
            } else if (vechicalt == 7) {
                return "axel-7.png";
            } else if (vechicalt == 8) {
                return "axel-8.png";
            }

        };


        // Get cookie


    });
})(window.angular);


//Fav Controller
angular.module('Tollr')
    .controller('Ctrl2', function ($scope, $http, $filter) {
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


//Services

angular.module('Tollr')
    .service('Approc', function () {
        return {
            GetList: function ($http, $scope) {
                $http.defaults.headers.post["Accept"] = "*/*";
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http({
                    //url: 'http://' + configVar.ip_address + '/Tolls/api/2019/t/list/' + $scope.toll_id,
                    url: 'http://' + configVar.ip_address + '/POS_SERVER/',
                    method: "POST",
                    data: $.param({'type': $scope.vehical_sele_type})
                })
                    .then(function (response) {
                            $scope.vehicles = [];//response.data.Info;

                        },
                        function (response) { // optional
                            //console.log(response);
                            // failed
                        });
            },
            SearchVech: function ($http, $scope) {
                $http.defaults.headers.post["Accept"] = "*/*";
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http({
                    //url: 'http://' + configVar.ip_address + '/Tolls/api/2019/t/searchvech',
                    url: 'http://' + configVar.ip_address + '/POS_SERVER/',
                    method: "POST",
                    data: $.param({
                        registration_number: $scope.searchWord,
                        toll_id: $scope.toll_id,
                        booth_id: configVar.booth_id,
                        boothside_id: configVar.bootside_id
                    })
                })
                    .then(function (response) {
                            //console.log($scope.search);
                            // success
                            //$scope.vehicles = response.data.Info;
                            if(response.data.trip_type == 1){

                            }
                            if(response.data.trip_type == 2){
                                $scope.vehicles = [response.data.Info];
                            }
                            if(response.data.trip_type == 3){
                                $scope.vehicles = [response.data.Info];
                                console.log($scope.vehicles);
                            }

                            //return $scope;
                            console.log(response.data);
                        },
                        function (response) { // optional
                            //console.log(response);
                            // failed
                        });
            },
            AllowVech: function ($http, $scope) {
                $http.defaults.headers.post["Accept"] = "*/*";
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http({
                    //url: 'http://' + configVar.ip_address + '/Tolls/api/2019/t/searchvech',
                    url: 'http://' + configVar.ip_address + '/POS_SERVER/geofence',
                    method: "POST",
                    data: $.param({
                        trip_details_id: $scope.vech.trip_details_id,
                        toll_user_id: $scope.toll_user_id,
                        booth_id: configVar.booth_id,
                        boothside_id: configVar.bootside_id,
                        vehical_picture:$scope.vehical_picture,
                        type: 'Local'
                    })
                })
                    .then(function (response) {
                            $scope.vehicles = [];
                            if(response.data.Info.vehicaldetails){
                                $scope.vehicles = response.data.Info.vehicaldetails;
                            }
                        },
                        function (response) { // optional
                            //console.log(response);
                            // failed
                        });
            },
            ReportVech: function ($http, $scope) {
                $http.defaults.headers.post["Accept"] = "*/*";
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http({
                    //url: 'http://' + configVar.ip_address + '/Tolls/api/2019/t/searchvech',
                    url: 'http://' + configVar.ip_address + '/POS_SERVER/report',
                    method: "POST",
                    data: $.param({
                        trip_details_id: $scope.vech.trip_details_id,
                        toll_user_id: $scope.toll_user_id,
                        booth_id: configVar.booth_id,
                        boothside_id: configVar.bootside_id,
                        vehical_picture:$scope.vehical_picture,
                        type: 'Local'
                    })
                })
                    .then(function (response) {
                            $scope.vehicles = [];
                            if(response.data.Info.vehicaldetails){
                                $scope.vehicles = response.data.Info.vehicaldetails;
                            }
                        },
                        function (response) { // optional
                            //console.log(response);
                            // failed
                        });
            }
        }
    });

angular.module('Tollr')
    .service('User', function () {
        return {
            login: function ($http, $scope, $cookieStore) {
                $http.defaults.headers.post["Accept"] = "*/*";
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http({
                    //url: 'http://' + configVar.ip_address + '/Tolls/api/2019/t/l',
                    url: 'http://' + configVar.ip_address + '/POS_SERVER/login',
                    method: "POST",
                    data: $.param({
                        username: $scope.employee_id,
                        password: $scope.password,//user_login.password,
                        toll_unique_number: configVar.toll_unique_number
                    })
                })
                    .then(function (response) {
                            //$scope = response.data;
                            if (response.data.Code == 200) {
                                $cookieStore.put('toll_id', response.data.Info.toll.toll_id);
                                $cookieStore.put('access_token', response.data.Info.user.access_token);
                                $scope.logged = true;
                                location.reload();
                                //listService.getList($http, $scope);
                                //return response;
                            } else {

                            }

                            // success

                            //console.log(response);
                        },
                        function (response) { // optional
                            //console.log(response);
                            // failed
                        });

            },
            UserDetails: function ($http, $scope) {
                $http.defaults.headers.post["Accept"] = "*/*";
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http({
                    //url: 'http://' + configVar.ip_address + '/Tolls/api/2019/t/auth',
                    url: 'http://' + configVar.ip_address + '/POS_SERVER/',
                    method: "POST",
                    data: $.param({
                        access_token: $scope.access_token
                    })

                })
                    .then(function (response) {
                            //$scope = response.data;
                            if (response.data.Code == 200) {
                                $scope.username = response.data.Info.toll_employee_id;
                                $scope.toll_user_id = response.data.Info.toll_user_id;
                            } else {

                            }

                            // success

                            //console.log(response);
                        },
                        function (response) { // optional
                            //console.log(response);
                            // failed
                        });

            },
            TollDetails: function ($http, $scope) {
                $http.defaults.headers.post["Accept"] = "*/*";
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http({
                    //url: 'http://' + configVar.ip_address + '/Tolls/api/2019/t/toll/' + $scope.toll_id,
                    url: 'http://' + configVar.ip_address + '/POS_SERVER/' + $scope.toll_id,
                    method: "GET"
                })
                    .then(function (response) {
                            //$scope = response.data;
                            if (response.data.Code == 200) {
                                $scope.TollName = response.data.Info.toll_name;
                                $scope.RoadName = response.data.Info.motorway_id;
                                $scope.TollID = response.data.Info.toll_unique_number;
                                $scope.TollKm = response.data.Info.toll_km;
                                $scope.TollLocation = response.data.Info.toll_location;
                                $scope.Towords = 'Both';//response.data.Info.boothside.boothside_from;
                                $scope.Concessioner = 'Ram';//response.data.Info.tolldetails.toll_concessionaire;
                                $scope.CollectorName = response.data.CollectorName;
                            } else {

                            }

                            // success

                            //console.log(response);
                        },
                        function (response) { // optional
                            //console.log(response);
                            // failed
                        });

            },
            Load:function ($http, $scope) {
                $http.defaults.headers.post["Accept"] = "*/*";
                $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                $http({
                    //url: 'http://' + configVar.ip_address + '/Tolls/api/2019/t/toll/' + $scope.toll_id,
                    url: 'http://' + configVar.ip_address + '/POS_SERVER/load',
                    method: "POST",
                    data: $.param({
                        access_token: $scope.access_token
                    })
                })
                    .then(function (response) {
                            //$scope = response.data;
                            if (response.data.Code == 200) {
                                $scope.TollName = response.data.Info.tolldetails.toll_name;
                                $scope.RoadName = response.data.Info.tolldetails.motorway_id;
                                $scope.TollID = response.data.Info.tolldetails.toll_unique_number;
                                $scope.TollKm = response.data.Info.tolldetails.toll_km;
                                $scope.TollLocation = response.data.Info.tolldetails.toll_location;
                                $scope.Towords = 'Both';//response.data.Info.boothside.boothside_from;
                                $scope.Concessioner = 'Ram';//response.data.Info.tolldetails.toll_concessionaire;
                                $scope.CollectorName = response.data.CollectorName;
                                $scope.vehicles = [];
                                if(response.data.Info.vehicaldetails){
                                    $scope.vehicles = response.data.Info.vehicaldetails;
                                }
                                $scope.username = response.data.Info.userdetails.toll_employee_id;
                                $scope.toll_user_id = response.data.Info.userdetails.toll_user_id;

                            } else {

                            }

                            // success

                            //console.log(response);
                        },
                        function (response) { // optional
                            //console.log(response);
                            // failed
                        });

            }
        }
    });


