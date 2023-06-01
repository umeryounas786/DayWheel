/**
 * Created by EquatorTechnologies on 2/5/16.
*/

$(function(){
//key press event
    $(".login-body").bind('keypress',function(e){
        var code = e.keyCode || e.which;
        if(code == 13) {
            login();
        }
    });

/*user login function*/
   $('#login').click(function(){
        login();
   });

//login
    function login()
	{
        var username = $("#username").val();
        var password = $("#password").val();
	//validation
        if( username != ''){
            var mailValidation = validateEmail(username);
		//check validation
            if(mailValidation == true){
			//check password not null
                if(password != ''){
                    var data = {"username": username, "password": password}
                    var data=JSON.stringify(data);
                    $(".spinner").show();
                    $("#loader-wrapper").show();
                    $.support.cors = true;
				//server action
                    service.operationDataService('login',data,function(data){
                        if (data.data[0].Status  === "true") {
                            $.cookie("username", username);
                            localStorage.setItem("username", username);
                            localStorage.setItem("password", password);
                            localStorage.setItem("token", data.data[0].token);
                            localStorage.setItem("User_id", data.data[0].User_id);
                            var token = localStorage.getItem("token");
                         //loader show
                            $(".spinner").hide();
                            $("#loader-wrapper").hide();
                            var delay = 1000; //Your delay in milliseconds
						//fcmtoken update
							FCMPlugin.getToken(function(temp){
								var tempdata = {"user_id" : data.data[0].User_id, "fcm_token" : temp}
								var fcmdata =JSON.stringify(tempdata);
								service.operationDataService('update_fcm_token', fcmdata, function(data){
								});
							});
						//GPS (get cuurent location)
							navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationFailed, { maximumAge: 3000, enableHighAccuracy: true });
						//navigate page
                            setTimeout(function(){ window.location.href = 'dashboard.html'; }, delay);
                        }
                        else if(data.data[0].Status=== "false")
                        {
                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.error('Incorrect Username (or) Password');
						//loader show
                            $(".spinner").hide();
                            $("#loader-wrapper").hide();
                        }
                        else if(data.data[0].Status=== "Error")
                        {
                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.error('Database Error');
						//loader show
                            $(".spinner").hide();
                            $("#loader-wrapper").hide();
                        }
                        else if(data.data[0].Status == "Not Verified"){

                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.warning('Please verify your account before login. Verification Link Sent to your Email');
						//loader show
                            $(".spinner").hide();
                            $("#loader-wrapper").hide();
                           /* var delay = 1000; //Your delay in milliseconds
                            setTimeout(function(){ window.location.href =  'accountverification.html'; }, delay);*/
                        }
                        else{

                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.error('Unable to Process Your Request');
                            $("#username").focus();
						//loader show
                            $(".spinner").hide();
                            $("#loader-wrapper").hide();
                        }
                    });
                }
                else{
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please Enter Your Password');
                }
            }
            else{
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please enter valid email id');
            }
        }
        else{
            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please Enter Your Login Email');
        }

    }

//trigger event
    getCountries();

/*Function to get countries*/
    function getCountries()
	{
	//server action
        service.getDataService('getCountries',function(data){
            var itemLength = data.data[0].countries.length;
            for(var i = 0; i < itemLength; i++){
                $('#Country').append($('<option>', {
                    value: data.data[0].countries[i].countries_name,
                    text: data.data[0].countries[i].countries_name
                }));
            }
        });
    }

/*new user sign-up function*/
    $('#signup').click(function(){
        var email = $('#email').val();
        var firstName = $('#firstname').val();
        var lastName = $('#lastname').val();
        var passWord = $('#password').val();
        var zipCode = $('#zipcode').val();
        var gender = $(".gender-input input[type='radio']:checked").val();
        var ageRange = $('#Age :selected').val();
        var country = $('#Country :selected').val();
        var term = $('#accept-terms').is(':checked');
	//validation
        if(gender == undefined){
            gender = "";
        }
	//check validation
        var validationStatus = signUpValidation(firstName,lastName,passWord,email,ageRange,country,term);
        if(validationStatus == 'valid'){
            var data = {"email": email,"firstname":firstName,"lastname":lastName,"password":passWord,"zipcode":zipCode,"gender":gender,"agerange":ageRange,"country":country}
            data = JSON.stringify(data);
		//loader show
            $(".spinner").show();
            $("#loader-wrapper").show();
		//server action
            service.operationDataService('userRegister',data,function(data){
              //validation
                if (data.data[0].Status === "true") {
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    $('#alertModal').show();
                }
                else if(data.data[0].Status=== "false"){
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to Register Your Account');
                }
                else if(data.data[0].Status=== "Error"){
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Database Error');
                }
                else{
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to Process Your Request');
                }
            });
        }
    });

//click event
    $("#ok").click(function(){
        $('#alertModal').hide();
        window.location.href = 'index.html';
    });

/*existing user check function*/
    $("#email").focusout(function(){
        var emailId = $('#email').val();
	//validation
        if(emailId != ''){
            var mailValidation = validateEmail(emailId);
		//mail validation
            if(mailValidation == true){
                var url="checkUserEmailExist/"+emailId;
			//server action
                service.getDataService(url,function(data){

                    if(data.data[0].Status === "true"){
                        $("#firstname").removeAttr("disabled");
                        $("#lastname").removeAttr("disabled");
                        $("#password").removeAttr("disabled");
                        $("#zipcode").removeAttr("disabled");
                        $("input[type=radio]").attr("disabled",false);
                        $("#Age").removeAttr("disabled");
                        $("#Country").removeAttr("disabled");
                        $("#signup").removeAttr("disabled");
                        $("#password").focus();
                    }
                    else if(data.data[0].Status=== "false"){
                        $("#firstname").attr("disabled","disabled");
                        $("#lastname").attr("disabled","disabled");
                        $("#password").attr("disabled","disabled");
                        $("#zipcode").attr("disabled","disabled");
                        $("input[type=radio]").attr("disabled",true);
                        $("#Age").attr("disabled","disabled");
                        $("#Country").attr("disabled","disabled");
                        $("#signup").attr("disabled","disabled");

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('User Already Exist');
                        $('#email').focus();
                    }
                    else if(data.data[0].Status=== "Error"){
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Database Error');
                    }
                    else{
                        $("#firstname").attr("disabled","disabled");
                        $("#lastname").attr("disabled","disabled");
                        $("#password").attr("disabled","disabled");
                        $("#zipcode").attr("disabled","disabled");
                        $("input[type=radio]").attr("disabled",true);
                        $("#Age").attr("disabled","disabled");
                        $("#Country").attr("disabled","disabled");
                        $("#signup").attr("disabled","disabled");

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Unable to Process Your Request');
                        $('#email').focus();
                    }
                });
            }
            else{
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please enter valid email id');
                $("#email").focus();
            }
        }else{
            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please enter email');
            $('#email').focus();
        }
    });

/*verification user exist check*/
    $("#verification_mail").focusout(function(){
        var emailId = $('#verification_mail').val();
	//validation
        if(emailId != ''){
            var mailValidation = validateEmail(emailId);
		//validation
            if(mailValidation == true){
                var url="checkUserEmailExist/"+emailId;
			//server action
                service.getDataService(url,function(data){
				//validation
                    if(data.data[0].Status=== "true"){
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Email Not Found');
                        $('#verification_mail').focus();
                    }
                });
            }
            else{
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please enter valid email id');
                $("#verification_mail").focus();
            }
        }
    });

//modal click event
   $('#modal-ok').click(function(){
        window.location.href='index.html';
   });

/*sign-up module validation*/
    function signUpValidation(firstname,lastname,password,email,ageRange,country,term)
	{
        if(email != ''){
            if(password != ''){
                if(firstname != ''){
                    if(lastname != ''){
                         if(ageRange != ''){
                            if(country != ''){
                               if(term == true){
                                   return 'valid';
                               }
                               else{
                                  toastr.options.positionClass = "toast-bottom-right";
                                  toastr.options.timeout = 500;
                                  toastr.warning('Please accept terms and conditions');
                               }
                            }
                            else{
                               toastr.options.positionClass = "toast-bottom-right";
                               toastr.options.timeout = 500;
                               toastr.warning('Please select country');
                            }
                         }
                         else{
                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.warning('Please select age range');
                         }
                    }
                    else{
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('Please enter last name');
                    }
                }
                else{
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please enter first name');
                }
            }
            else{
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please enter password');
            }
        }
        else{
            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please enter email id');
        }
    }

//account verification
    $('#account_verification').click(function(){
        var email = $('#verification_mail').val();
        var accessCode = $('#access_code').val();

        var validationStatus = validateVerificationDetails(email,accessCode);
	//validation
        if(validationStatus == "success"){

            var data = {"email":email,"access_code": accessCode}
            data = JSON.stringify(data);
		//loader show
            $(".spinner").show();
            $("#loader-wrapper").show();
		//server action
            service.operationDataService('accountVerification',data,function(data){
                if(data.data[0].Status == "true"){
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Your account verified successfully');
				//loader action
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                    var delay = 1000; //Your delay in milliseconds
                    setTimeout(function(){window.location.href = 'index.html'; }, delay);
                }
                else if(data.data[0].Status=== "Invalid Access Code"){
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Invalid Access Code');
				//loader show
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status=== "Already Verified"){
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Account Already Verified');
				//loader show
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status=== "Invalid Email Id"){
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Invalid Email Id');
				//loader show
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status=== "Error"){
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Database Error');
				//loader show
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else{
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to Process Your Request');
				//loader show
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
            });
        }
    });

//validation
    function validateVerificationDetails(email,accessCode)
	{
	//validation
        if(email != ''){
            var mailStatus = validateEmail(email);
            if(mailStatus == true){
                if(accessCode != ''){
                    return "success";
                }
                else{
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please enter access code');
                }
            }
            else{
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please enter valid email');
            }
        }
        else{
            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please enter email');
        }
    }

/*e-mail validation function*/
    function validateEmail(email)
	{
        var emailRegex =  /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailRegex.test(email);
    }
});
