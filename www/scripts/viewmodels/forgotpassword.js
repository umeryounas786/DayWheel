/**
 * Created by EquatorTechnologies on 6/3/16.
 */
$(function(){

    $('#forgotPass').click(function(){
        var registeredMail = $('#email').val();

        if(registeredMail != ''){

            var mailValidation = validateEmail(registeredMail);
            if(mailValidation == true){

                $(".spinner").show();
                $("#loader-wrapper").show();
                var url="forgetPassword/"+registeredMail;
                service.getDataService(url,function(data){

                    if(data.data[0].Status == "true"){

                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        localStorage.setItem('reset_email',registeredMail);
                         $('#alertModal').show();
                    }
                    else if(data.data[0].Status == "false"){
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('User Email Not Found');

                        $(".spinner").hide();
                        $("#loader-wrapper").hide();

                    }
                    else if(data.data[0].Status=== "Invalid User")
                    {
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Your Not Authorized to Access these Details');

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
                        toastr.warning('Invalid email Id');

                        $(".spinner").hide();
                        $("#loader-wrapper").hide();

                    }
                });

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
            toastr.warning('Please enter email id');

        }





    });

    $("#modal-ok").click(function(){
       $('#alertModal').hide();
       window.location.href='passwordreset.html';

    });

    /*Function to check email exist or not*/
   $("#email").focusout(function(){

       var emailId = $('#email').val();
       var url="checkUserEmailExist/"+emailId;
       service.getDataService(url,function(data){
           if(data.data[0].Status === "true"){

               toastr.options.positionClass = "toast-bottom-right";
               toastr.options.timeout = 500;
               toastr.warning('Please enter correct email');
               $("#email").focus();

           }
       });

   });


    $('#passwordReset').click(function(){

        var email = $('#email').val();
        var accessCode = $('#access_code').val();
        var password = $('#new_password').val();
        var confirmPassword = $('#confirm_password').val();

        var validationStatus = validateUserDetails(email,accessCode,password,confirmPassword);

        if(validationStatus == "success"){

            $(".spinner").show();
            $("#loader-wrapper").show();
            var registeredMail = $('#email').val();
            var data = {"email": registeredMail,"access_code":accessCode,"password":password}

                data = JSON.stringify(data);

                service.operationDataService('resetPassword',data,function(data){

                    if(data.data[0].Status == "true"){

                        localStorage.removeItem('reset_email');

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.success('Password Reset Successfully');


                        $(".spinner").hide();
                        $("#loader-wrapper").hide();

                        var delay = 1000; //Your delay in milliseconds
                        setTimeout(function(){window.location.href = 'index.html'; }, delay);

                    }
                    else if(data.data[0].Status == "Invalid Access Code"){

                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Invalid Access Code');

                    }
                    else if(data.data[0].Status=== "false")
                    {
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('Unable to Process your Request ');
                    }
                    else if(data.data[0].Status=== "Invalid User")
                    {

                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Your Not Authorized to Access these Details');
                    }
                    else if(data.data[0].Status=== "Error")
                    {

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
                        toastr.error('Unable to reset your password');

                    }

                });

            }

    });




    /*user details validation for password reset*/
    function validateUserDetails(email,accessCode,password,confirmPassword){

        if(email != ''){

            var mailValidation = validateEmail(email);
            if(mailValidation == true){

                if(accessCode != ''){

                    if(password != ''){

                        if(confirmPassword != ''){

                            if(password == confirmPassword){

                                return "success";

                            }
                            else{

                                toastr.options.positionClass = "toast-bottom-right";
                                toastr.options.timeout = 500;
                                toastr.warning('New Password and Confirm Password dose not match');

                            }

                        }
                        else{

                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.warning('Please enter confirm password');
                            $("#confirm_password").focus();

                        }
                    }
                    else{

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('Please enter password');
                        $("#new_password").focus();
                    }
                }
                else{
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please enter access code');
                    $('#access_code').focus();

                }
            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please enter valid email');
                $('#email').focus();
            }
        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please enter email');
            $('#email').focus();
        }


    }

    /*e-mail validation function*/
    function validateEmail(email){

        var emailRegex =  /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailRegex.test(email);

    }


});