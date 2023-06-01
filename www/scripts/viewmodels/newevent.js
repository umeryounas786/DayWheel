/**
 * Created by EquatorTechnologies on 5/10/16.
 */
$(function(){

    params = getParams();
    console.log(params);
    console.log(params.module);
    console.log(params.event_id);
    console.log(params.lid);

    function getParams() {

        var params = {},
            pairs = document.URL.split('?')
                .pop()
                .split('&');

        for (var i = 0, p; i < pairs.length; i++) {
            p = pairs[i].split('=');
            params[ p[0] ] =  p[1];
        }

        return params;
    }

    if(params.module=="create_location")
    {
        getLocationData();
        function getLocationData(){
            var data = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"lid":params.lid}
            data = JSON.stringify(data);
            service.operationDataService('getLocationDetails',data,function(data){
                console.log(data);
                if(data.data[0].Status == "true") {
                    $("#eventTitle").val(data.data[0].wheelEvents[0].location);
                    $("#EventStartsFrom").val(data.data[0].wheelEvents[0].date);
                    $("#EventEndsTo").val(data.data[0].wheelEvents[0].date);
                    $("#EventStartsAt").val(data.data[0].wheelEvents[0].start_time);
                    $("#EventEndsAt").val(data.data[0].wheelEvents[0].end_time);
                }
            });
            if(params.type=="loc"){
                $('.my-header').html('Create Daywheel Event');
                $("#addScheduleEvent").show();
                $("#updateDayWheelEvent").hide();
                $("#updateScheduleEvent").hide();
            }
        }
    }

    if(params.module=="create_event")
    {

        getEventCategoriesType();

        /*function  for getting event categories*/
        function getEventCategoriesType(){

            var data = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token")}
            data = JSON.stringify(data);
            service.operationDataService('getEventCategory',data,function(data){
                console.log(data);
                if(data.data[0].Status == "true"){
                    var itemLength = data.data[0].category.length;
                    for(var i = 0 ; i < itemLength; i++){
                        $('#EventCategory').append($('<option>', {
                            value: data.data[0].category[i].row_id,
                            text: data.data[0].category[i].cat_title
                        }));
                    }
                    bindUpdateEventDetails();
                }
            });

        }


        function bindUpdateEventDetails(){

            var data = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"event_id":params.event_id}
            data = JSON.stringify(data);
            service.operationDataService('getEventDataById',data,function(data){
                console.log(data);

              /*  var SelectColor=data.data[0].eventData[0].event_color;
                localStorage.setItem("SelectColor",SelectColor);*/

                var eventCategory = data.data[0].eventData[0].event_cat;
                $("#eventTitle").val(data.data[0].eventData[0].event_title);
                $("#colorselector_1").val(data.data[0].eventData[0].event_color);
                $('.sp-preview-inner').css('background-color',data.data[0].eventData[0].event_color);
                $("#EventStartsFrom").val(data.data[0].eventData[0].start_date);
                $("#EventEndsTo").val(data.data[0].eventData[0].end_date);
                $("#EventStartsAt").val(data.data[0].eventData[0].start_time);
                $("#EventEndsAt").val(data.data[0].eventData[0].end_time);
                if(params.type=="day" && eventCategory == 0){
                    $('#EventCategory').val(1);                }
                else{
                    $('#EventCategory').val(eventCategory);
                }
                var eventPrivacy = data.data[0].eventData[0].event_privacy;
                if(eventPrivacy == 0){
                    $('#Private').prop('checked',true);
                }
                else{
                    $('#Public').prop('checked',true);
                }

                $("#StreetAddress1").val(data.data[0].eventData[0].event_add1);
                $("#StreetAddress2").val(data.data[0].eventData[0].event_add2);
                $("#EventCity").val(data.data[0].eventData[0].event_city);
                $("#EventState").val(data.data[0].eventData[0].event_state);
                $("#EventZip").val(data.data[0].eventData[0].event_zip);
                var eventRepeat = data.data[0].eventData[0].event_repeat;
                $('#radioSelect input[type="radio"][value="'+eventRepeat+'"]').prop("checked",true);
                $("#EventDescription").val(data.data[0].eventData[0].event_description);
            });

            if(params.type=="schedule"){
                $('.my-header').html('Update Schedule Event');
                $("#addScheduleEvent").hide();
                $("#updateDayWheelEvent").hide();
                $("#updateScheduleEvent").show();
            }
            else if(params.type=="day"){
                $('.my-header').html('Update Daywheel Event');
                $("#addScheduleEvent").hide();
                $("#updateDayWheelEvent").show();
                $("#updateScheduleEvent").hide();
            }

        }


        /*function to update the schedule events*/
        $("#updateScheduleEvent").click(function(){
            eventTitle = $("#eventTitle").val();
            eventColor = $("#colorselector_1").val();
            startDate = $("#EventStartsFrom").val();
            endDate = $("#EventEndsTo").val();
            startTime = $("#EventStartsAt").val();
            endTime = $("#EventEndsAt").val();
            eventCategory = $('#EventCategory :selected').val();
            eventPrivacy = $(".radio-group input[type='radio']:checked").val();

            address1 = $("#StreetAddress1").val();
            address2 = $("#StreetAddress2").val();
            city = $("#EventCity").val();
            state = $("#EventState").val();
            zipcode = $("#EventZip").val();

            repeatEvent = $('#radioSelect input[type="radio"]:checked').val();
            description = $("#EventDescription").val();
            var event_id = params.event_id;

            $(".spinner").show();
            $("#loader-wrapper").show();

            var data = {

                "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"event_title":eventTitle,"event_color":eventColor,"start_date":startDate,
                "end_date":endDate,"start_time":startTime,"end_time":endTime,"event_category":eventCategory,"event_privacy":eventPrivacy,"address1":address1,
                "address2":address2,"city":city,"state":state,"zipcode":zipcode,"repeatevent":repeatEvent,"description":description,"event_id":event_id,"event_scheduled":"1"
            }

            console.log(JSON.stringify(data));
            data = JSON.stringify(data);
            service.operationDataService('updateScheduleEvent',data,function(data){
                console.log(data.data[0].Status);
                if(data.data[0].Status == "true"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Event updated successfully');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    window.location.href = 'schedule-events.html';
                }
                else if(data.data[0].Status == "false"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('No changes made to update event');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status == "Error"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Database Error');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status == "Invalid User"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Your Not Authorized to Access these details');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to update event');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
            });

        });


        /*function to update the day wheel events*/
        $("#updateDayWheelEvent").click(function(){
            eventTitle = $("#eventTitle").val();
            eventColor = $("#colorselector_1").val();
            startDate = $("#EventStartsFrom").val();
            endDate = $("#EventEndsTo").val();
            startTime = $("#EventStartsAt").val();
            endTime = $("#EventEndsAt").val();
            eventCategory = $('#EventCategory :selected').val();
            eventPrivacy = $(".radio-group input[type='radio']:checked").val();

            address1 = $("#StreetAddress1").val();
            address2 = $("#StreetAddress2").val();
            city = $("#EventCity").val();
            state = $("#EventState").val();
            zipcode = $("#EventZip").val();

            repeatEvent = $('#radioSelect input[type="radio"]:checked').val();
            description = $("#EventDescription").val();
            var event_id = params.event_id;

            $(".spinner").show();
            $("#loader-wrapper").show();

            var data = {

                "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"event_title":eventTitle,"event_color":eventColor,"start_date":startDate,
                "end_date":endDate,"start_time":startTime,"end_time":endTime,"event_category":eventCategory,"event_privacy":eventPrivacy,"address1":address1,
                "address2":address2,"city":city,"state":state,"zipcode":zipcode,"repeatevent":repeatEvent,"description":description,"event_id":event_id,"event_scheduled":"0"
            }

            console.log(JSON.stringify(data));
            data = JSON.stringify(data);
            service.operationDataService('updateScheduleEvent',data,function(data){
                console.log(data.data[0].Status);
                if(data.data[0].Status == "true"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Event updated successfully');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    window.location.href = 'events.html';
                }
                else if(data.data[0].Status == "false"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('No changes made to update event');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status == "Error"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Database Error');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status == "Invalid User"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Your Not Authorized to Access these details');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to update event');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
            });

        });
    }
    else{

        $("#updateScheduleEvent").hide();
        $("#updateDayWheelEvent").hide();
        $("#addScheduleEvent").show();

        var eventTitle,eventColor,startDate,endDate,startTime,endTime,eventCategory,eventPrivacy,address1,address2,city,state,zipcode,repeatEvent,description;
        getEventCategories();

        /*function  for getting event categories*/
        function getEventCategories(){

            var data = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token")}
            data = JSON.stringify(data);
            service.operationDataService('getEventCategory',data,function(data){

                var itemLength = data.data[0].category.length;
                for(var i = 0 ; i < itemLength; i++){
                    $('#EventCategory').append($('<option>', {
                        value: data.data[0].category[i].row_id,
                        text: data.data[0].category[i].cat_title
                    }));
                }
            });

        }

        /*function for creating new schedule event*/
        $("#addScheduleEvent").click(function(){

            eventTitle = $("#eventTitle").val();
            eventColor = $("#colorselector_1").val();
            startDate = $("#EventStartsFrom").val();
            endDate = $("#EventEndsTo").val();
            startTime = $("#EventStartsAt").val();
            endTime = $("#EventEndsAt").val();
            eventCategory = $('#EventCategory :selected').val();
            eventPrivacy = $(".radio-group input[type='radio']:checked").val();
            address1 = $("#StreetAddress1").val();
            address2 = $("#StreetAddress2").val();
            city = $("#EventCity").val();
            state = $("#EventState").val();
            zipcode = $("#EventZip").val();

            repeatEvent = $('#radioSelect input[type="radio"]:checked').val();
            description = $("#EventDescription").val();

            $(".spinner").show();
            $("#loader-wrapper").show();
            if(params.type=="loc"){
                var eventScheduled='0';
            }
            else
            {
                eventScheduled='1';
            }

            var data = {

                "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"event_title":eventTitle,"event_color":eventColor,"start_date":startDate,
                "end_date":endDate,"start_time":startTime,"end_time":endTime,"event_category":eventCategory,"event_privacy":eventPrivacy,"address1":address1,
                "address2":address2,"city":city,"state":state,"zipcode":zipcode,"repeatevent":repeatEvent,"description":description,"event_scheduled":eventScheduled
            }

            data = JSON.stringify(data);
            service.operationDataService('addScheduleEvent',data,function(data){
                console.log(data.data[0].Status);
                if(data.data[0].Status == "true"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Event created successfully');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                    if(data.data[0].LocationStatus == "true"){
                        window.location.href = 'dashboard.html';
                    }
                    else
                    {
                        window.location.href = 'schedule-events.html';
                    }
                }
                else if(data.data[0].Status == "false"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to create event');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status == "Error"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Database Error');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else if(data.data[0].Status == "Invalid User"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Your Not Authorized to Access these details');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to create event');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
            });

        });

    }

    /*function for next button 1*/
    $("#EventNext1").click(function(){


        eventTitle = $("#eventTitle").val();
        eventColor = $("#colorselector_1").val();
        startDate = $("#EventStartsFrom").val();;
        endDate = $("#EventEndsTo").val();
        startTime = $("#EventStartsAt").val();
        endTime = $("#EventEndsAt").val();
        eventCategory = $('#EventCategory :selected').val();
        eventPrivacy = $(".radio-group input[type='radio']:checked").val();

        var validationStatus = validateGeneralInfo(eventTitle,eventColor,startDate,endDate,startTime,endTime,eventCategory,eventPrivacy);
        if(validationStatus == "valid"){

            var User_id = localStorage.getItem("User_id");
            var token = localStorage.getItem("token");
            var event_id = params.event_id;

            var eventType = params.module;
            var data = '';
            if(eventType == undefined){
                data = {"User_id":User_id,"token":token,"event_color":eventColor,"start_date":startDate,"end_date":endDate,"start_time":startTime,"end_time":endTime,"event_id":'',"type":"create_event"};
            }
            else if(eventType == "create_location"){
                data = {"User_id":User_id,"token":token,"event_color":eventColor,"start_date":startDate,"end_date":endDate,"start_time":startTime,"end_time":endTime,"event_id":'',"type":"create_event"};
            }
            else{

                data = {"User_id":User_id,"token":token,"event_color":eventColor,"start_date":startDate,"end_date":endDate,"start_time":startTime,"end_time":endTime,"event_id":event_id,"type":''};
            }


            service.operationDataService('checkEventExist',JSON.stringify(data),function(data){
                var status = data.data[0].Status;
                if( status == 'false'){

                    if(animating) return false;
                    animating = true;


                    current_fs = $('#EventNext1').parent();
                    console.log($('#EventNext1'));
                    next_fs = $('#EventNext1').parent().next();

                    //activate next step on progressbar using the index of next_fs
                    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

                    //show the next fieldset
                    next_fs.show();
                    //hide the current fieldset with style
                    current_fs.animate({opacity: 0}, {
                        step: function(now, mx) {
                            //as the opacity of current_fs reduces to 0 - stored in "now"
                            //1. scale current_fs down to 80%
                            scale = 1 - (1 - now) * 0.2;
                            //2. bring next_fs from the right(50%)
                            left = (now * 50)+"%";
                            //3. increase opacity of next_fs to 1 as it moves in
                            opacity = 1 - now;
                            current_fs.css({'transform': 'scale('+scale+')'});
                            next_fs.css({'left': left, 'opacity': opacity});
                        },
                        duration: 800,
                        complete: function(){
                            current_fs.hide();
                            animating = false;
                        },
                        //this comes from the custom easing plugin
                        easing: 'easeInOutBack'
                    });


                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Event is already exist between given date and time');

                }

            });

        }

    });



    /*function for next button 2*/
    $("#EventNext2").click(function(){




        if(animating) return false;
        animating = true;

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //activate next step on progressbar using the index of next_fs
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale current_fs down to 80%
                scale = 1 - (1 - now) * 0.2;
                //2. bring next_fs from the right(50%)
                left = (now * 50)+"%";
                //3. increase opacity of next_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({'transform': 'scale('+scale+')'});
                next_fs.css({'left': left, 'opacity': opacity});
            },
            duration: 800,
            complete: function(){
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });

    });

    /*function for validating the general info*/
    function validateGeneralInfo(eventTitle,eventColor,startDate,endDate,startTime,endTime,eventCategory,eventPrivacy){

        if(eventTitle != '') {
            if (eventColor != '') {

                if (startDate != '') {

                    if (endDate != '') {

                        var dateCompareStatus = validateDate(startDate, endDate);
                        if (dateCompareStatus != "invalid") {
                            if (startTime != '') {

                                if (endTime != '') {

                                    if (startTime < endTime || startDate < endDate) {

                                        if (eventCategory != '') {

                                            if (eventPrivacy != '') {

                                                return "valid";
                                            }
                                            else {


                                                toastr.options.positionClass = "toast-bottom-right";
                                                toastr.options.timeout = 500;
                                                toastr.warning('Please select event privacy');
                                            }

                                        }
                                        else {

                                            toastr.options.positionClass = "toast-bottom-right";
                                            toastr.options.timeout = 500;
                                            toastr.warning('Please select event category');
                                        }

                                    }
                                    else {

                                        toastr.options.positionClass = "toast-bottom-right";
                                        toastr.options.timeout = 500;
                                        toastr.warning('Start time must be less then end time');

                                    }

                                }
                                else {

                                    toastr.options.positionClass = "toast-bottom-right";
                                    toastr.options.timeout = 500;
                                    toastr.warning('Please enter end time');

                                }
                            }
                            else {

                                toastr.options.positionClass = "toast-bottom-right";
                                toastr.options.timeout = 500;
                                toastr.warning('Please enter start time');
                            }
                        }
                        else {


                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.warning('Start date should be less then end date');

                        }

                    }
                    else {


                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('Please enter end date');
                    }
                }
                else {


                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please enter start date');
                }


            }
            else {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Choose event color');
            }
        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please enter event title');
        }

    }


    /*function to compare two dates*/
    function validateDate(startDate,endDate){
        if(startDate > endDate){
            return "invalid";
        }
    }

});