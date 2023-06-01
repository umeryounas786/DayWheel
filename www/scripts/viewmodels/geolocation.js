//on device ready
	function onDeviceLocation () {
	// Options: throw an error if no update is received every 30 seconds.
		setInterval(function(){
		//GPS
			navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 3000, enableHighAccuracy: true });
		}, 30000);
	}

// onSuccess Callback
    function onSuccess(position)
	{
		var fullLongitude=position.coords.longitude;
		var fullLatitude =position.coords.latitude;

		var longitude 	= position.coords.latitude;
        longitude 		= longitude.toFixed(4);
        var latitude 	= position.coords.longitude;
        latitude 		= latitude.toFixed(4);
        var today = new Date();
        var currentDateLoc = today.getFullYear()+'-'+((today.getMonth()<10?'0':'')+(today.getMonth()+1))+'-'+((today.getDate()<10?'0':'')+today.getDate());
        var startTimeLoc = ((today.getHours()<10?'0':'') +today.getHours()) + ":" + ((today.getMinutes()<10?'0':'') + today.getMinutes()) + ":" +((today.getSeconds()<10?'0':'')+ today.getSeconds());
        console.log(currentDateLoc+"////"+startTimeLoc);
	//get location
        $.ajax({
            url			: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&sensor=true",
            timeout		: 10000,
            dataType	: 'json',
            type		: 'GET',
            success		: function(data){
				var location = data.results[0].formatted_address;
			//check condition
				if( localStorage.getItem("latitude")==null ){
					localStorage.setItem("latitude"	, latitude);
					localStorage.setItem("longitude", longitude);
					localStorage.setItem("location"	, location);
				}
				else if( localStorage.getItem("latitude")== latitude && localStorage.getItem("longitude")== longitude ){
					var formData = {
						"latitude"	: latitude,
						"longtitude"	: longitude,
						"current_location" : location,
						"user_id"	: localStorage.getItem('User_id'),
						"token"		: localStorage.getItem('token'),
                        "full_latitude"	: fullLatitude,
                        "full_longtitude": fullLongitude,
						"dateLoc":currentDateLoc,
						"timeLoc":startTimeLoc
					}
				//form data
					formData = JSON.stringify(formData);
				//confirm to save location
					//server action
						service.operationDataService('update_user_Location', formData, function(data){
							if(data.data[0].Status == "true"){
								console.log('location saved successfully');
							}
						});
				}
				else if( localStorage.getItem("latitude")!= latitude && localStorage.getItem("longitude")!= longitude ){
					var formData = {
						"latitude"	: latitude,
						"longtitude"	: longitude,
						"current_location" : location,
						"user_id"	: localStorage.getItem('User_id'),
						"token"		: localStorage.getItem('token'),
                        "full_latitude"	: fullLatitude,
                        "full_longtitude": fullLongitude,
                        "dateLoc":currentDateLoc,
                        "timeLoc":startTimeLoc
					}

				//form data
					formData = JSON.stringify(formData);
				//confirm to save location
					//server action
						service.operationDataService('update_user_Location', formData, function(data){
							if(data.data[0].Status == "true"){
								console.log('location saved successfully');
							}
						});
				}
            }
        });
    }

// onError Callback receives a PositionError object
    function onError(error)
	{
		console.log(error.code);
		console.log(error.message);
    }

//find new location
	function onLocationSuccess(position)
	{
		var longitude 	= position.coords.latitude;
        longitude 		= longitude.toFixed(2);
        var latitude 	= position.coords.longitude;
        latitude 		= latitude.toFixed(2);
	//if location not get
		if( localStorage.getItem("latitude")==null )
		{
			localStorage.setItem("latitude"	, latitude);
			localStorage.setItem("longitude", longitude);
		}
	}

//find new location
	function onLocationFailed(error)
	{
		console.log(error.code);
		console.log(error.message);
	}