/**
 * Created by EmployeeLogin on 4/5/16.
 * Modified by EmployeeLogin on 23/05/2017.
 */
$(function() {
    var momentDate = moment();
    var currentDate = moment(momentDate).format("YYYY-MM-DD");
    var stage;

//get daily quotes
    getDailyQuotes();

//get data
    getDayWheelData(currentDate);

//get location data
    getDayWheelLocation(currentDate);

    /*code to get the current date*/
    var momentDate = moment();
    var currentDate = moment(momentDate).format("YYYY-MM-DD");
    $("#currentDate").html(currentDate);
    $("#curDate").val(currentDate);

    /*code to get the previous date*/
    var momentPreviousDate = moment().add(-1, 'days');
    var previousDate = moment(momentPreviousDate).format("YYYY-MM-DD");
    $("#previousDate").html(previousDate);

    /*Function to get wheel by date*/
    $("#previousDate").click(function() {
        var currentDayDate = $("#previousDate").text();
        var currentMomentDate = moment(currentDayDate);
        var currentDate = moment(currentMomentDate).format("YYYY-MM-DD");
        getDayWheelData(currentDate);
        var date = moment(currentMomentDate);
        var formatedDate = moment(date).format("YYYY-MM-DD");
        var pDate = moment(formatedDate).add(-1, 'days');
        var previousDate = moment(pDate).format("YYYY-MM-DD");
        $('#previousDate').html(previousDate);
        $('#currentDate').html(currentDate);
        $("#curDate").val(currentDate);
    });

//current date click event
    $('#currentDate').click(function() {
        var displayDate = $('#currentDate').text();
        var actualCurrentDate = moment().format("YYYY-MM-DD");
        var currentDate = moment(displayDate).add(+1, "days").format("YYYY-MM-DD");
        $('#currentDate').text(currentDate);
        $('#previousDate').text(displayDate);
        $('#curDate').val(currentDate);
        getDayWheelData(currentDate);
    });

//current date change event
    $("#curDate").on("change", function() {
        var date = $("#curDate").val();
        var currentDayDate = moment(date);
        var previousDate = moment(currentDayDate).add(-1, 'days').format('YYYY-MM-DD');
        getDayWheelData(date);
        $("#currentDate").html(date);
        $("#previousDate").html(previousDate);
    });


    //location
    /*code to get the current date*/
    var momentDate = moment();
    var currentDate = moment(momentDate).format("YYYY-MM-DD");
    $("#currentDateL").html(currentDate);

    /*code to get the previous date*/
    var momentPreviousDate = moment().add(-1, 'days');
    var previousDate = moment(momentPreviousDate).format("YYYY-MM-DD");
    $("#previousDateL").html(previousDate);

    /*Function to get wheel by date*/
    $("#previousDateL").click(function() {
        var currentDayDate = $("#previousDateL").text();
        var currentMomentDate = moment(currentDayDate);
        var currentDate = moment(currentMomentDate).format("YYYY-MM-DD");
        getDayWheelLocation(currentDate);
        var date = moment(currentMomentDate);
        var formatedDate = moment(date).format("YYYY-MM-DD");
        var pDate = moment(formatedDate).add(-1, 'days');
        var previousDate = moment(pDate).format("YYYY-MM-DD");
        $('#previousDateL').html(previousDate);
        $('#currentDateL').html(currentDate);
    });

//current date click event
    $('#currentDateL').click(function() {
        var displayDate = $('#currentDateL').text();
        var actualCurrentDate = moment().format("YYYY-MM-DD");
        if(actualCurrentDate != displayDate) {
            var currentDate = moment(displayDate).add(+1, "days").format("YYYY-MM-DD");
            $('#currentDateL').text(currentDate);
            $('#previousDateL').text(displayDate);
            getDayWheelLocation(currentDate);
        }
    });


    /*Function to add quick event*/
    $("#saveEvent").click(function() {
        var qucikEventTitle = $("#eventTitle").val();
        var startDate = $("#currentDate").text();
        var endDate = $("#currentDate").text();
        var startTime = $("#StartsAt").val();
        var endTime = $("#EndsAt").val();
        var eventColor = $("#colorselector_1").val();
        var validationStatus = validateQuickEvent(qucikEventTitle, startTime, endTime, eventColor);
        if (validationStatus == "success") {
            $(".spinner").show();
            $("#loader-wrapper").show();
            var data = {
                "User_id": localStorage.getItem("User_id"),
                "token": localStorage.getItem("token"),
                "event_title": qucikEventTitle,
                "start_date": startDate,
                "end_date": endDate,
                "start_time": startTime,
                "end_time": endTime,
                "event_color": eventColor,
                "event_category": "0",
                "event_privacy": "0",
                "address1": "",
                "address2": "",
                "city": "",
                "state": "",
                "zipcode": "",
                "repeatevent": "0",
                "description": "",
                "event_scheduled": "0"
            }
            data = JSON.stringify(data),
                service.operationDataService('addScheduleEvent', data, function(data) {
                    if (data.data[0].Status === "true") {
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.success('Your event created successfully');
                        getDayWheelData(startDate);
                        setTimeout(function(){
                            location.reload(1);
                        }, 1000);
                    } else if (data.data[0].Status === "false") {
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Unable to create your event');
                    } else if (data.data[0].Status === "Event Exist") {
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('Unable to save Event...Event is already exist between given date and time');
                    } else if (data.data[0].Status === "Invalid User") {
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Your Not Authorized to Access these details');
                    } else if (data.data[0].Status === "Error") {
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Database Error');
                    } else {
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Unable to create your event');
                    }
                });
        }
    });

    /*Quick Event validation*/
    function validateQuickEvent(eventTitle, startTime, endTime) {
        if (eventTitle != '') {
            if (startTime != '') {
                if (endTime != '') {
                    if (startTime < endTime) {
                        return "success";
                    } else {
                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('Start time must be less then end time');
                    }
                } else {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please select end time');
                }
            } else {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please select start time');
            }
        } else {
            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please Enter Event Title');
        }
    }

//get daily quotes
    function getDailyQuotes() {
        service.getDataService('getQuoteByDay', function(data) {
            var quoteTitle = data.data[0].quote.qot_title;
            var quoteContent = data.data[0].quote.qot_content;
            var quoteAuthor = data.data[0].quote.qot_author;
            $('.quote-title').text(quoteTitle);
            $('.quote-content').text(quoteContent);
            $('.quote-author').text(quoteAuthor);
        });
    }

//get daywheel data
    function getDayWheelData(currentDate)
    {
        var data = {
            "User_id": localStorage.getItem("User_id"),
            "token": localStorage.getItem("token"),
            "currentDate": currentDate
        }
        data = JSON.stringify(data);
        $('#pieChart').empty();
        service.operationDataService('getData', data, function(data) {
            $("#pieChart").drawPieChart(data.data[0].wheelEvents);
        });
    }

    //get daywheel location
    function getDayWheelLocation(currentDate)
    {
        var dataLoc = {
            "User_id": localStorage.getItem("User_id"),
            "token": localStorage.getItem("token"),
            "currentDate": currentDate
        }
        dataLoc = JSON.stringify(dataLoc);
        $('#pieChartLocation').empty();
        service.operationDataService('getDataLocation', dataLoc, function(dataLoc) {
            $("#pieChartLocation").drawPieChartLocation(dataLoc.data[0].wheelEvents);
        });
    }
    
});