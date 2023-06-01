/**
 * Created by EquatorTechnologies on 6/5/16.
 */

$(function(){

    var data = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token")}
    data=JSON.stringify(data);
    service.operationDataService('deleteFiles',data,function(data){
        console.log(data);
    });

    $("#oldpassword").change(function(){

        var oldPassword = $("#oldpassword").val();
        var token = localStorage.getItem("token");
        var user_id = localStorage.getItem("User_id");

        var data={"oldpassword":oldPassword,"User_id":user_id,"token":token};
        data = JSON.stringify(data);
        service.operationDataService('checkOldPassword',data,function(data){

            if(data.data[0].Status === "true"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Old Password is Correct');

            }
            else if(data.data[0].Status === "false"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Incorrect Old Password');
                $('#oldpassword').focus();
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
                toastr.error('Unable to Check Your Old Password');
            }
        });
    });


    $("#changePassword").click(function(){

        var oldPassword = $("#oldpassword").val();
        var newPassword = $("#newpassword").val();
        var confirmPassword = $("#confirmpassword").val();

        if(validateModule(oldPassword,newPassword,confirmPassword) == "success"){

            $(".spinner").show();
            $("#loader-wrapper").show();

            var data = {"oldpassword":oldPassword,"newpassword": newPassword,"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token")}
            data=JSON.stringify(data);

            service.operationDataService('changePassword',data,function(data){

                if(data.data[0].Status === "true"){

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Your password changed successfully');

                }
                else if(data.data[0].Status === "false"){

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('No Change in Password details');
                    $('#oldpassword').focus();
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
                    toastr.error('Unable to change password');
                }

            });
        }

    });

    /*validation function*/
    function validateModule(oldPassword,newPassword,confirmPassword){

        if(oldPassword != ''){

            if(newPassword != ''){

                if(confirmPassword != ''){

                    if(newPassword == confirmPassword){

                        return "success";
                    }
                    else{

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('New & Confirm Password does not match');
                    }
                }
                else{


                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Specify confirm password');

                }
            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Specify your new password');
            }
        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Specify your old password');

        }

    }

});
