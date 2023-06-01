//get notification
	function getNotification()
	{
	//notification
		FCMPlugin.onNotification(function(data){
		//notification
			if(data.eventid!='undefined'){
				if(confirm(data.body)){
					localStorage.setItem('eventid', data.eventid);
					navigator.geolocation.getCurrentPosition(onLocateSuccess, onLocateError, { maximumAge: 3000, enableHighAccuracy: true });
				}
			}
			else{
				alert(data.body);
				location.href='dashboard.html'
			}
		},function(msg){
			console.log('onNotification callback successfully registered: ' + msg);
		},function(err){
			console.log('Error registering onNotification callback: ' + err);
		});
	}

// onSuccess Callback
    function onLocateSuccess(position)
	{
		var longitude 	= position.coords.latitude;
        longitude 		= longitude.toFixed(2);
        var latitude 	= position.coords.longitude;
        latitude 		= latitude.toFixed(2);
	//get location
        $.ajax({
            url			: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&sensor=true",
            timeout		: 10000,
            dataType	: 'json',
            type		: 'GET',
            success		: function(data){
				var location = data.results[0].formatted_address;
			//check condition
				var formData = {
					"latitude"	: latitude,
					"longitude"	: longitude,
					"current_location" : location,
					"eventid"	: localStorage.getItem('eventid'),
					"user_id"	: localStorage.getItem('User_id'),
					"token"		: localStorage.getItem('token')
				}
			//form data
				formData = JSON.stringify(formData);
			//server action
				service.operationDataService('update_event_Location', formData, function(data){
					if(data.data[0].Status == "true"){
						console.log('location saved successfully');
					}
				});
            }
        });
    }

// onError Callback receives a PositionError object
    function onLocateError(error)
	{
		console.log(error.code);
		console.log(error.message);
    }