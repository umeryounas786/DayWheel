/**
  Project Name: My Day wheel
  Version: 1.0
  Author: EquatorTechnologies
*/

$(function(){

    getCountries();
    /*Function to get countries*/
    function getCountries(){

       service.getDataService('getCountries',function(data){
           console.log(data);
           if(data.data[0].Status == "true"){
                var itemLength = data.data[0].countries.length;
                console.log(itemLength);
                for(var i = 0; i < itemLength; i++){
                    $('#Country').append($('<option>', {
                         value: data.data[0].countries[i].countries_name,
                        text: data.data[0].countries[i].countries_name
                    }));
                }
               bindUserDetails();
           }
           else if(data.data[0].Status == "false"){

               toastr.options.positionClass = "toast-bottom-right";
               toastr.options.timeout = 500;
               toastr.warning('Unable to bind list of countries');
           }
           else if(data.data[0].Status=== "Invalid User")
           {
               toastr.options.positionClass = "toast-bottom-right";
               toastr.options.timeout = 500;
               toastr.error('Your Not Authorized to Access these Details');
           }
           else if(data.data[0].Status=== "Error")
           {
               toastr.options.positionClass = "toast-bottom-right";
               toastr.options.timeout = 500;
               toastr.error('Database Error');
           }
           else{

               toastr.options.positionClass = "toast-bottom-right";
               toastr.options.timeout = 500;
               toastr.error('Unable to bind list of countries');
           }
       });
    }


    function bindUserDetails(){

        var data = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token")}
        data=JSON.stringify(data),
            service.operationDataService('getUserDetails',data,function(data){
                console.log(data);
                if (data.data[0].Status  === "true") {
                    $("#email").val(data.data[0].users.user_email);
                    $("#firstname").val(data.data[0].users.fstname);
                    $("#lastname").val(data.data[0].users.lstname);
                    $("#contactnum").val(data.data[0].users.contact_no);
                    $('#Country').val(data.data[0].users.country);
                }
                else if(data.data[0].Status=== "false")
                {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Your Details not found in Database');
                }
                else if(data.data[0].Status=== "Invalid User")
                {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Your Not Authorized to Access these Details');
                }
                else if(data.data[0].Status=== "Error")
                {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Database Error');
                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to Get Your Profile Details');
                }

            });
    }




    /*code to focus the initial text box*/
    $("#email").focus();

    /*function to update the user personal details*/
    $("#personalDetail").click(function(){

        var userMail = $("#email").val();
        var firstName = $("#firstname").val();
        var lastName = $("#lastname").val();
        var contactNum = $("#contactnum").val();
        var country = $('#Country :selected').val();

        if(validateDetails(userMail,firstName,lastName,country,contactNum) == "success"){
            $(".spinner").show();
            $("#loader-wrapper").show();
            var data = {"email": userMail,"firstname": firstName,"lastname":lastName,"contactnumber":contactNum,"country":country,"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token")}
            data=JSON.stringify(data)
            service.operationDataService('updateProfile',data,function(data){
                console.log(data);
                if (data.data[0].Status=== "true") {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Your profile updated successfully');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status=== "false")
                {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Your Profile Already Updated . No change in Details');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status=== "Invalid User")
                {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Your Not Authorized to Access these details');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status=== "Error")
                {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Database Error');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to update your profile');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }

            });
        }
    });

    /*validation function*/
    function validateDetails(email,firstname,lastname,country,contactNum){

        if(email != ''){

            var emailValidationStatus = validateEmail(email);
            if(emailValidationStatus == true){

                if(firstname != ''){

                    if(lastname != ''){

                        if(contactNum != ''){

                            var contactStatus = validateContactNum($("#contactnum").val());
                            if(contactStatus == true){

                                if($("#contactnum").val().length <= 13){

                                    if(country != ''){

                                        return "success";

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
                                    toastr.warning('Please enter valid contact number');
                                    $("#contactnum").focus();

                                }

                            }
                            else{
                                toastr.options.positionClass = "toast-bottom-right";
                                toastr.options.timeout = 500;
                                toastr.warning('Please enter numerical digits only');
                                $("#contactnum").val('');
                                $("#contactnum").focus();
                            }
                        }
                        else{

                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.warning('Please enter contact number');
                            $("#lastname").focus();
                        }

                    }
                    else{

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('Please enter last name');
                        $("#lastname").focus();
                    }

                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please enter first name');
                    $("#firstname").focus();
                }

            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please enter valid email id');
                $("#email").focus();

            }
        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please enter email');
            $("#email").focus();
        }

    }

    /*e-mail validation function*/
    function validateEmail(email){

        var emailRegex =  /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailRegex.test(email);

    }

    /*contact number validation function*/
    function validateContactNum(contactno){
        var  filter = /^[0-9-+]+$/;
        return filter.test(contactno);
    }

});
