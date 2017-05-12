/**
 * Created by Kesava.M on 4/29/2016.
 */

var base_url = "http://115.124.125.42/Tolls/api/2019/";
var loginstatus = true;
var refreshIntervalId;
var Tollr = angular.module('Tollr', []);


Tollr.controller('HomeController', function ($scope){
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
    console.log('kk');
});

/*function loadDoc() {
    var xhttp;
    if (window.XMLHttpRequest) {
        // code for modern browsers
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            window.location.assign("home.html");
        }
    };
    xhttp.open("GET", "./js/Config.js", true);
    xhttp.send();
}*/






