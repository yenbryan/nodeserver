
function addQuotes(sArray) {
	var symArray = [];
	
	for (var i = 0; i < sArray.length; i++) {
		symArray[i] = "%22" + sArray[i] + "%22";
	}
	
	return symArray.join();
}

function Controller($scope, $http, $attrs, $interval) {

	$scope.data = [];

	$scope.symbols= ["AAPL", "GOOG", "MSFT", "YHOO"];
	
	$scope.setCookie = function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
		
		// alert("Set cookie = " + document.cookie);
	};
	
	$scope.getCookie = function(cname) {
	    var name = cname + "=";
		
		// alert("Cookie = " + document.cookie);
		
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	
	var cresult = $scope.getCookie("sym");
	
	// alert("Get Cookie = " + cresult);
	
	if (cresult) {
		$scope.symbols = cresult.split(",");
	}
	
	$scope.getData = function() {
		
		var path = "http://query.yahooapis.com/v1/public/yql"
			+ "?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("
			+ addQuotes($scope.symbols)
			+ ")&env=store://datatables.org/alltableswithkeys&format=json";

		if ($scope.symbols.length < 1) {
			$scope.data = [];
			return;
		}
		
		var responsePromise = $http.get(path);
		
		responsePromise.success(function(data, status, headers, config) {
			var quote = data.query.results.quote;
			
			if (data.query.count > 1) {
				$scope.data = quote;
			} else {
				$scope.data = [ quote ];
			}
			
			$scope.setCookie("sym", $scope.symbols.join(), 1);
		});

		responsePromise.error(function(response, status) {
			alert("AJAX failed: " + response + " - " + status);
		});
	};

	$scope.removeData = function (sym) {

		while ($.inArray(sym, $scope.symbols) > -1) {
		    $scope.symbols.splice( $.inArray(sym, $scope.symbols), 1 );
		}
			
		$scope.getData();
	};
	
	$scope.addData = function() {
		
		var aSymArray = $scope.addSymbol.toUpperCase().replace(/ /g,'').split(",");
		$scope.addSymbol = "";
		
		for (var i in aSymArray) {
			if ($.inArray(aSymArray[i], $scope.symbols) == -1) {
				$scope.symbols.push(aSymArray[i]);
			}
		}

		$scope.getData();
	};

	var refreshTimer;
	
	$scope.startRefresh = function() {
		// Don't start a new refresh if we are already refreshing
        if ( angular.isDefined(refreshTimer) ) return;

        refreshTimer = $interval(function() {
			$scope.getData();
		}, 10 * 60 * 1000);
    };

	$scope.stopRefresh = function() {
		if (angular.isDefined(refreshTimer)) {
			$interval.cancel(refreshTimer);
			refreshTimer = undefined;
        }
    };

	$scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopRefresh();
    });

	$scope.getData();
	$scope.startRefresh();
}
