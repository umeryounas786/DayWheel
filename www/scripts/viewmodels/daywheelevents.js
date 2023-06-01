/**
 * Created by EquatorTechnologies on 5/27/16.
 */
$(function(){

    $("#FilterWheelEvent").prop('selectedIndex',0);

    localStorage.removeItem("start_date");
    localStorage.removeItem("end_date");
    localStorage.removeItem("filter");
    localStorage.removeItem("filterValue");
    localStorage.removeItem("num");
    localStorage.removeItem("search-term");
    localStorage.removeItem("search-flag");
    localStorage.setItem("filterDisplayContent","Today");
    var totCount=0;
    var totSearchCount = 0;

    var date = $("#curDate").val();
    var currentDate = moment(date).format("YYYY-MM-DD");

    $( 'body' ).on( 'change', '#curDate', function(){

        $("#FilterSubmit").hide();
        $("#FilterWheelEvent").prop('selectedIndex',0);
        if (localStorage.getItem("num") != null) {
            localStorage.removeItem("num");
        }

        var date = $("#curDate").val();
        var currentDate = moment(date).format("YYYY-MM-DD");

        var selectedDate = currentDate;
        localStorage.setItem("filterDisplayContent",selectedDate);
        getCount(currentDate,currentDate,"OFF","1") ;

    });
    getCount(currentDate,currentDate,"OFF","1","Today") ;

    $('.modal-close').click(function(){return false;});

    /*Function to add quick day wheel event*/
    $("#saveEvent").click(function(){
        var eventDate = $("#EventDate").val();
        console.log(eventDate);
        var eventTitle = $("#eventTitle").val();
        var eventColor = $("#colorselector_1").val();
        var startTime = $("#StartsAt").val();
        var endTime = $("#EndsAt").val();

        var validationStatus = validateQuickEvent(eventTitle,eventDate,eventColor,startTime,endTime);
        if(validationStatus == 'success'){

            $(".spinner").show();
            $("#loader-wrapper").show();

            var data = {

                "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"event_title":eventTitle,"event_color":eventColor,"start_date":eventDate,
                "end_date":eventDate,"start_time":startTime,"end_time":endTime,"event_category":"0","event_privacy":"0","address1":"",
                "address2":"","city":"","state":"","zipcode":"","repeatevent":"0","description":"","event_scheduled":"0"
            }

            data = JSON.stringify(data);
            service.operationDataService('addScheduleEvent',data,function(data){

                if (data.data[0].Status=== "true") {

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    $('.modal-close').click();

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Event created successfully!');


                    getCount(currentDate,currentDate,"OFF","1") ;
                    getDayWheelEvents(currentDate,currentDate,"OFF","1",0);
                }
                else if(data.data[0].Status=== "false")
                {

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to create your event');


                }
                else if(data.data[0].Status === "Event Exist"){
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Event is already exist between given date and time');
                }
                else if(data.data[0].Status=== "Invalid User")
                {
                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Your Not Authorized to Access these details');


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
                    toastr.error('Unable to create your event');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }

            });

        }

    });

    /*Function for quick event validation*/
    function validateQuickEvent(eventTitle,eventColor,eventDate,startTime,endTime){

        if(eventTitle !=''){

            if(eventColor !='') {

                if (eventDate !='') {

                    var timeComparisonStatus = validateDateTime(startTime, endTime);

                    if (timeComparisonStatus == 'success') {
                        return "success";
                    }
                    else {

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.success('Event Start time must be less then End time');


                    }

                }
                else
                    {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Specify the Event Date');

                }
            }
            else {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Choose event Color');
            }

        }
        else{


            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Specify the event title');
        }

    }

    /*Time Validation function*/
    function validateDateTime(startTime,endTime){

        if(startTime < endTime){
            return "success";
        }
        else{

            return "invalid";
        }
    }

    function getCount(start_date,end_date,filter,filterValue){

        $(".search_bottom").hide();
        $(".demo4_bottom").show();
        var page_num=0;

        if (localStorage.getItem("num") != null) {
            localStorage.removeItem("num");
        }

        var initialData = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"start_date":start_date,"end_date":end_date,"filter":filter,"filterValue":filterValue,"current_page":"0","event_scheduled":"0"}
        data = JSON.stringify(initialData);

        localStorage.setItem("start_date", start_date);
        localStorage.setItem("end_date", end_date);
        localStorage.setItem("filter", filter);
        localStorage.setItem("filterValue", filterValue);


        service.operationDataService('getDayWheelEvents',data,function(data){

            console.log(data);
            totCount = Math.ceil(data.data[0].Count/5);

            var dataStatus = data.data[0].Status;
            if(dataStatus == "true"){
                $("#eventList").show();
                $('.demo4_bottom').css('display','block');
                $('#noData').hide();

                $('.demo4_bottom').bootpag({

                    total: totCount,
                    page: 1,
                    maxVisible: 3,
                    leaps: true,
                    firstLastUse: true,
                    first: '←',
                    last: '→',
                    wrapClass: 'pagination',
                    activeClass: 'active',
                    disabledClass: 'disabled',
                    nextClass: 'next',
                    prevClass: 'prev',
                    lastClass: 'last',
                    firstClass: 'first'
                }).on("page", function(event, num){
                    console.log("num:"+num);
                    localStorage.setItem("num", num);

                    var pageFilter = localStorage.getItem('filter');
                    var pageFilterValue = localStorage.getItem('filterValue');
                    start_date=localStorage.getItem("start_date");
                    end_date=localStorage.getItem("end_date");
                    getDayWheelEvents(start_date,end_date,pageFilter,pageFilterValue,num);
                });
            }
            else
            {
                $("#eventList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }

        });
        if (localStorage.getItem("num") != null) {
            page_num=localStorage.getItem("num");
        }

        if(page_num==0)
        {
            getDayWheelEvents(start_date,end_date,filter,filterValue,page_num);
        }


    }

    function getDayWheelEvents(start_date,end_date,filter,filterValue,num){

        var displayContent = localStorage.getItem("filterDisplayContent");
        $(".search_bottom").hide();
        $(".demo4_bottom").show();
        if( num != 0){
            num = num-1;
        }

        var initialData = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"start_date":start_date,"end_date":end_date,"filter":filter,"filterValue":filterValue,"current_page":num,"event_scheduled":"0"}
        data = JSON.stringify(initialData);

        $(".spinner").show();
        $("#loader-wrapper").show();
        service.operationDataService('getDayWheelEvents',data,function(data){

            totCount = Math.ceil(data.data[0].Count/5);

            var dataStatus = data.data[0].Status;
            var totalResultCount = data.data[0].Count;
            if(dataStatus == "true"){
                $("#eventList").show();
                $('.demo4_bottom').css('display','block');
                $('#noData').hide();

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                var  html = '';
                var dataLength =  data.data[0].wheelEvents.length;

                for(var i = 0; i < dataLength; i++){

                    var date =  data.data[0].wheelEvents[i].start_date;
                    var color =  data.data[0].wheelEvents[i].event_color;
                    var count = i+1;
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<img class="event-list-img" data-original="images/pictures/calendar-icon.png" alt="img" src="images/pictures/calendar-icon.png" style="display: block;">'+
                        '<strong>'+data.data[0].wheelEvents[i].event_title+'</strong>'+
                        '<a href="#" class="event-list-icon-edit bg-green-dark scale-hover edit-modal" id="'+data.data[0].wheelEvents[i].event_id+'"><i class="fa fa-edit"></i></a>'+
                        '<a href="#" class="event-list-icon-delete bg-red-dark scale-hover delete-modal" id="'+data.data[0].wheelEvents[i].event_id+'"><i class="fa fa-trash"></i></a>'+
                        '<em><i class="fa fa-clock-o"></i><span>StartsAt:</span><span class="start_time" id="starts'+data.data[0].wheelEvents[i].event_id+'">'+data.data[0].wheelEvents[i].start_time+'</span><span></span><i class="fa fa-clock-o"></i><span>EndsAt:</span><span class="end_time" id="ends'+data.data[0].wheelEvents[i].event_id+'">'+data.data[0].wheelEvents[i].end_time+'</span><span id="date'+data.data[0].wheelEvents[i].event_id+'"><i class="fa fa-calendar"></i><span></span>'+date+'</span>' +
                        '<span style="font-size: 0px" id="color'+data.data[0].wheelEvents[i].event_id+'"><i class="fa fa-calendar"></i><span></span>'+color+'</span></em>'+
                        '</div>';


                }
                $("#eventList").html(html);
                $("#displaySelect").html(displayContent);
                $("#totCount").html(totalResultCount);
                console.log("totCount"+totCount)

            }
            else if(data.data[0].Status == "false")
            {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                $("#eventList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }
            else if(data.data[0].Status=== "Invalid User"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('You are Not Authorized to Access these details');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#eventList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();

            }
            else if(data.data[0].Status=== "Error"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#eventList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                console.log("No record");
                $("#eventList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }
        });


    }

     $("#FilterWheelEvent").on("load",function(){
         loadFilteredGoalData();
     });
    /*Function for detecting the drop down change event*/
    $("#FilterWheelEvent").on("change",function(){
        loadFilteredGoalData();
        /*var selectedValue =  $('#FilterWheelEvent :selected').index();
        if(selectedValue != 0 || selectedValue != ''){
            $("#FilterSubmit").show();
        }
        else{
            $("#FilterSubmit").hide();
        }*/
    });

    $("#FilterSubmit").click(function(){
        loadFilteredGoalData();
    });

    function loadFilteredGoalData(){


        /*ajax call to get the daywheel event filter data*/
        var ajaxData = '';
        var displayContent = '';
        var goalFilterBy = $('#FilterWheelEvent :selected').text();

        var momentDate =  $("#curDate").val();
        var currentDate = moment(momentDate).format("YYYY-MM-DD");

        console.log("momentDate"+momentDate);

        var momentPreviousDate = moment().add(-20,'days');
        var previousDate = moment(momentPreviousDate).format("YYYY-MM-DD");
        var filter,filterValue,start_date,end_date;

        if(goalFilterBy == 'Today'){

            displayContent = "Today";
            var momentDate = moment();
            var currentDate = moment(momentDate).format("YYYY-MM-DD");
            filter="ON";
            filterValue="1";
            start_date=currentDate,
            end_date=currentDate;
        }
        else if(goalFilterBy == "Last 20"){

            displayContent = "Last 20 days";
            filter="ON";
            filterValue="20";
            start_date=previousDate,
            end_date=currentDate;
        }
        else{

            displayContent = "All";
            filter="ON";
            filterValue="ALL";
            start_date="",
            end_date="";
        }
        localStorage.setItem("filterDisplayContent",displayContent);
        localStorage.setItem("filter", filter);
        localStorage.setItem("filterValue", filterValue);
        getCount(start_date,end_date,filter,filterValue) ;

    }


    $("#my-daywheel-search").bind('keypress',function(e){
        var code = e.keyCode || e.which;
        if(code == 13) {
            $(".header-elements .search-section").hide();
            var searchTerm = $('#my-daywheel-search').val();
            if(searchTerm != ''){

                $(".demo4_bottom").hide();
                $(".search_bottom").show();
                getSearchCount(searchTerm);
                localStorage.setItem('search-term',searchTerm);
                localStorage.setItem('search-flag','yes');
            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please specify your search term');
            }
        }
    });

    /*Function to daywheel search*/
    $("#daywheel-search").on("click",function(){

        $(".header-elements .search-section").hide();
        var searchTerm = $('#my-daywheel-search').val();
        if(searchTerm != ''){

            $(".demo4_bottom").hide();
            $(".search_bottom").show();
            getSearchCount(searchTerm);
            localStorage.setItem('search-term',searchTerm);
            localStorage.setItem('search-flag','yes');
        }
        else{
            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please specify your search term');
        }

    });


    /*Function to get daywheel search count*/
    function getSearchCount(searchTerm){

        var page_number = 0;

        if (localStorage.getItem("search_num") != null) {
            localStorage.removeItem("search_num");
        }
        var searchTerm =  searchTerm;

        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');

        var data = {"User_id": User_id,"token":token,"search_term":searchTerm,"event_scheduled":"0","current_page":"0"}
        data = JSON.stringify(data);
        service.operationDataService('getEventSearch',data,function(data){

            totSearchCount = Math.ceil(data.data[0].Count/5);
            var searchDataStatus = data.data[0].Status;
            if(searchDataStatus == "true"){
                $("#eventList").show();
                $('.search_bottom').css('display','block');
                $('#noData').hide();

                $('.search_bottom').bootpag({

                    total: totSearchCount,
                    page: 1,
                    maxVisible: 3,
                    leaps: true,
                    firstLastUse: true,
                    first: '←',
                    last: '→',
                    wrapClass: 'pagination',
                    activeClass: 'active',
                    disabledClass: 'disabled',
                    nextClass: 'next',
                    prevClass: 'prev',
                    lastClass: 'last',
                    firstClass: 'first'
                }).on("page", function(event, num){

                    console.log("num:"+num);
                    localStorage.setItem("search_num", num);
                    var recentSearchTerm = localStorage.getItem('search-term');
                    getSearchContents(recentSearchTerm,num);

                });

            }
            else{

                $("#eventList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();

            }

        });

        if (localStorage.getItem("num") != null) {
            page_number=localStorage.getItem("num");
        }

        if(page_number==0)
        {

            getSearchContents(searchTerm,page_number);
        }


    }

    /*Function to get search contents*/
    function getSearchContents(searchTerm,num){

        if( num != 0){
            num = num-1;
        }

        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');
        var searchDisplayCount = '';

        var data = {"User_id": User_id,"token":token,"search_term":searchTerm,"event_scheduled":"0","current_page":num}
        data = JSON.stringify(data);
        service.operationDataService('getEventSearch',data,function(data){
            totSearchCount = Math.ceil(data.data[0].Count/5);
            var searchDataStatus = data.data[0].Status;
            searchDisplayCount = data.data[0].Count;
            if(searchDataStatus == "true"){
                $("#eventList").show();
                $('.search_bottom').css('display','block');
                $('#noData').hide();

                var  html = '';
                var dataLength =  data.data[0].wheelEvents.length;

                for(var i = 0; i < dataLength; i++){

                    var date =  data.data[0].wheelEvents[i].start_date;
                    var color =  data.data[0].wheelEvents[i].event_color;
                    var count = i+1;
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<img class="event-list-img" data-original="images/pictures/calendar-icon.png" alt="img" src="images/pictures/calendar-icon.png" style="display: block;">'+
                        '<strong>'+data.data[0].wheelEvents[i].event_title+'</strong>'+
                        '<a href="#" class="event-list-icon-edit bg-green-dark scale-hover edit-modal" id="'+data.data[0].wheelEvents[i].event_id+'"><i class="fa fa-edit"></i></a>'+
                        '<a href="#" class="event-list-icon-delete bg-red-dark scale-hover delete-modal" id="'+data.data[0].wheelEvents[i].event_id+'"><i class="fa fa-trash"></i></a>'+
                        '<em><i class="fa fa-clock-o"></i>' +
                        '<span>StartsAt:</span><span class="start_time" id="starts'+data.data[0].wheelEvents[i].event_id+'">'+data.data[0].wheelEvents[i].start_time+'</span>' +
                        '<span></span><i class="fa fa-clock-o"></i><span>EndsAt:</span><span class="end_time" id="ends'+data.data[0].wheelEvents[i].event_id+'">'+data.data[0].wheelEvents[i].end_time+'</span>' +
                        '<span id="date'+data.data[0].wheelEvents[i].event_id+'"><i class="fa fa-calendar"></i><span></span>'+date+'</span>' +
                        '<span style="font-size" id="color'+data.data[0].wheelEvents[i].event_id+'"><i class="fa fa-calendar"></i><span></span>'+color+'</span>' +
                        '</em>'+
                        '</div>';


                }
                $("#eventList").html(html);
                $("#displaySelect").html("Searched");
                $("#totCount").html(searchDisplayCount);
            }
            else if(data.data[0].Status == "false")
            {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $("#eventList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
            }
            else if(data.data[0].Status=== "Invalid User"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('You are Not Authorized to Access these details');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $("#eventList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();

            }
            else if(data.data[0].Status=== "Error"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $("#eventList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);
                console.log("No record");
                $("#eventList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
            }
        });
    }



    /*Function for editing the event edit model*/
    $('#eventList').on('click', '.edit-modal', function() {

        var editButtonId = $(this).attr("id");
        var id = "#"+$("#"+editButtonId).closest("div").attr("id");
        var editId = $("#"+editButtonId).closest("div").attr("id");
        var divId = id+' '+"strong";

        var eventTitle = $(divId).text();
        var startTime = $("#starts"+editButtonId).text();
        var endTime = $("#ends"+editButtonId).text();
        var startDate = $("#date"+editButtonId).text();
        var eventColor = $("#color"+editButtonId).text();
        var date = moment(startDate).format("YYYY-MM-DD");

        $('#EditEventDate').val(date);
        $('#EditStartsAt').val(startTime);
        $('#EditEndsAt').val(endTime);
        $('.sp-preview-inner').css('background-color',eventColor);
        $('#edit-colorselector_1').attr('value',eventColor);
        $('#EditeventTitle').val(eventTitle);
        $('#eventid').html(editButtonId);
        $("#editIndex").val(editId);
        $('.edit-modal-content').modal();
    });

    /*Function for update the event*/
    $("#EditsaveEvent").on('click',function(){

        var eventDate = $("#EditEventDate").val();
        var eventTitle = $("#EditeventTitle").val();
        var eventColor = $("#edit-colorselector_1").val();
        console.log(eventColor);
        var startTime = $("#EditStartsAt").val();
        var endTime = $("#EditEndsAt").val();
        var token = localStorage.getItem("token");
        var user_id = localStorage.getItem("User_id");
        var eventId = $('#eventid').text();
        var editIndex = $('#editIndex').val();


        var data = {"event_id":eventId,"event_title":eventTitle,"event_color":eventColor,"start_date":eventDate,"end_date":eventDate,"start_time":startTime,"end_time":endTime,"User_id":user_id,"token":token};
        console.log(JSON.stringify(data));

        $(".spinner").show();
        $("#loader-wrapper").show();

        service.operationDataService('updateEvent',JSON.stringify(data),function(data){

            if(data.data[0].Status === "true")
            {

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Event updated successfully');
                setTimeout(function(){
                   location.reload(1);
                }, 1000);

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                $('#'+editIndex+ ' strong').text(eventTitle);
                $('#'+editIndex+' .start_time').text(startTime);
                $('#'+editIndex+' .end_time').text(endTime);
                $('.modal-close').click();

            }
            else if(data.data[0].Status === "false"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('No changes made to update event');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
            }
            else if(data.data[0].Status === "Event Exist"){
                $(".spinner").hide();
                $("#loader-wrapper").hide();

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Event is already exist between given date and time');
            }
            else if(data.data[0].Status === "Error"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

                $(".spinner").hide();
                $("#loader-wrapper").hide();

            }
            else if(data.data[0].Status === "Invalid User"){

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


    /*Function for delete event model*/
    $('#eventList').on('click', '.delete-modal', function() {

        var deleteButtonId = $(this).attr("id");
        $("#deleteId").html(deleteButtonId);
        $('.delete-modal-content').modal();
    });

    /*Function for delete event*/
    $("#DeleteEvent").on('click',function(){

        var start_date = localStorage.getItem("start_date");
        var end_date = localStorage.getItem("end_date");
        var filter = localStorage.getItem("filter");
        var filterValue = localStorage.getItem("filterValue");
        var num = localStorage.getItem("num");


        var token = localStorage.getItem("token");
        var user_id = localStorage.getItem("User_id");
        var eventId = $("#deleteId").text();
        var data = {"event_id":eventId,"User_id":user_id,"token":token};

        $(".spinner").show();
        $("#loader-wrapper").show();

        service.operationDataService('deleteEvent',JSON.stringify(data),function(data){

            if(data.data[0].Status == "true")
            {
                var searchFlagStatus = localStorage.getItem('search-flag');
                var searchPageNumber = localStorage.getItem('search_num');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $('.modal-close').click();

                if (localStorage.getItem("num") == null){
                    num = 0;
                }
                if (searchPageNumber == null){
                    searchPageNumber = 0;
                }
                if(searchFlagStatus != "yes"){
                    getDayWheelEvents(start_date,end_date,filter,filterValue,num);
                }
                else{
                    getSearchContents(localStorage.getItem('search-term'),searchPageNumber);
                }

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Event deleted successfully');
            }
            else if(data.data[0].Status == "false"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Unable to delete event');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
            }
            else if(data.data[0].Status === "Error"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

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
            else{
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Unable to delete event');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
            }

        });

    });

});