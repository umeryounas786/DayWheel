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

    var status = $('input:radio[name=smilerad]');
    if(status.is(':checked') == false) {
        $('#sm1').prop('checked',true);
    }
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

    /*Function to save ratings*/
    $('#saveRating').on('click',function(){

        var ratingDate = $('#ratingDate').val();
        var rate = $(".rating-radio input[type='radio']:checked").val();
        var description = $('#ratingDescription').val();
        var choosenSmiley = $(".smiley-box input[type='radio']:checked").val();
        var ratingTime = moment().format("H:mm:ss");

        if(ratingDate != ''){

            if(rate != undefined){
                var data = {

                    "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"rating_date": ratingDate,
                    "rate": rate,"rating_desc": description,"rating_smiley": choosenSmiley,"rating_time": ratingTime

                }
                data = JSON.stringify(data);
                console.log(data);
                // loader
                $(".spinner").show();
                $("#loader-wrapper").show();
                service.operationDataService('saveRating',data,function(data){
                    if (data.data[0].Status === "true") {

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.success('Your rating saved successfully');
                        // loader
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                        $('.modal-close').click();
                        setTimeout(getCount(currentDate,currentDate,"OFF","1"),5000);
                        setTimeout(getRatings(currentDate,currentDate,"OFF","1",0),5000);
                    }
                    else if(data.data[0].Status === "false"){

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Unable to save your rating');
                        // loader
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                    }
                    else if(data.data[0].Status === "Error"){

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Database Error');
                        // loader
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();

                    }
                    else if(data.data[0].Status === "Invalid User"){

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Your Not Authorized to Access these details');
                        // loader
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                    }
                    else{

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.error('Unable to save your rating');
                        // loader
                        $(".spinner").hide();
                        $("#loader-wrapper").hide();
                    }
                });

            }else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please select the rating option');
            }
        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please select the rating date');

        }

    });

    function getCount(start_date,end_date,filter,filterValue){
        $(".search_bottom").hide();
        $(".demo4_bottom").show();
        var page_num=0;
        console.log("start-date:"+currentDate);
        console.log("end-date:"+currentDate);
        console.log("filter:"+filter);
        console.log("filterValue:"+filterValue);

        if (localStorage.getItem("num") != null) {
            localStorage.removeItem("num");
        }

        var initialData = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"start_date":start_date,"end_date":end_date,"filter":filter,"filterValue":filterValue,"current_page":"0"}
        data = JSON.stringify(initialData);

        localStorage.setItem("start_date", start_date);
        localStorage.setItem("end_date", end_date);
        localStorage.setItem("filter", filter);
        localStorage.setItem("filterValue", filterValue);


        service.operationDataService('getRatingsByDate',data,function(data){

            console.log(data);
            totCount = Math.ceil(data.data[0].Count/5);

            var dataStatus = data.data[0].Status;
            if(dataStatus == "true"){
                $("#ratingList").show();
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

                    getRatings(start_date,end_date,pageFilter,pageFilterValue,num);
                });
            }
            else
            {
                console.log("No record");
                $("#ratingList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }



        });
        if (localStorage.getItem("num") != null) {
            page_num=localStorage.getItem("num");
        }

        if(page_num==0)
        {

            getRatings(start_date,end_date,filter,filterValue,page_num);
        }


    }

    function getRatings(start_date,end_date,filter,filterValue,num){

        var displayContent = localStorage.getItem("filterDisplayContent");
        $(".search_bottom").hide();
        $(".demo4_bottom").show();
        if( num != 0){
            num = num-1;
        }

        var initialData = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"start_date":start_date,"end_date":end_date,"filter":filter,"filterValue":filterValue,"current_page":num}
        data = JSON.stringify(initialData);

        $(".spinner").show();
        $("#loader-wrapper").show();
        service.operationDataService('getRatingsByDate',data,function(data){

            var totalResultCount = data.data[0].Count;
            totCount = Math.ceil(data.data[0].Count/5);
            console.log("Total Record:"+data.data[0].Count);
            console.log("Total Page:"+totCount);
            var dataStatus = data.data[0].Status;
            if(dataStatus === "true"){

                $("#ratingList").show();
                $('.demo4_bottom').css('display','block');
                $('#noData').hide();

                $(".spinner").hide();
                $("#loader-wrapper").hide();


                var  html = '';
                var dataLength =  data.data[0].ratings.length;

                for(var i = 0; i < dataLength; i++){

                    var count = i+1;
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<img class="event-list-img" id="'+data.data[0].ratings[i].smiley+'" data-original="images/pictures/calendar-icon.png" alt="img" src="'+data.data[0].ratings[i].smiley_path+'" style="display: block;">'+
                        '<strong>'+data.data[0].ratings[i].rating+'</strong>'+
                        '<p class="goal-desc" id="desc'+data.data[0].ratings[i].row_id+'">'+data.data[0].ratings[i].description+'</p>'+
                        '<a href="javascript:void(0)" class="event-list-icon-edit bg-green-dark scale-hover edit-modal" id="'+data.data[0].ratings[i].row_id+'"><i class="fa fa-edit"></i></a>'+
                        '<a href="javascript:void(0)" class="event-list-icon-delete bg-red-dark scale-hover delete-modal" id="'+data.data[0].ratings[i].row_id+'"><i class="fa fa-trash"></i></a>'+
                        '<em><span id="date'+data.data[0].ratings[i].row_id+'"><i class="fa fa-calendar"></i><span></span>'+data.data[0].ratings[i].date+'</span><span>|</span><i class=""></i><span>at time:</span><span id="1">'+data.data[0].ratings[i].time+'</span></em>'+
                        '</div>';


                }
                $("#ratingList").html(html);
                $("#displaySelect").html(displayContent);
                $("#totCount").html(totalResultCount);

            }
            else if(data.data[0].Status === "false")
            {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                $("#ratingList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }
            else if(data.data[0].Status === "Error"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#ratingList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();

            }
            else if(data.data[0].Status === "Invalid User"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('You are Not Authorized to Access these details');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#ratingList").hide();
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

                $("#ratingList").hide();
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

    $("#my-rating-search").bind('keypress',function(e){
        var code = e.keyCode || e.which;
        if(code == 13) {
            $(".header-elements .search-section").hide();
            var searchTerm = $('#my-rating-search').val();
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

    /*Function for rating search*/
    $('#rating-search').on('click',function(){
        $(".demo4_bottom").hide();
        $(".search_bottom").show();
        $(".header-elements .search-section").hide();
        var searchTerm = $('#my-rating-search').val();
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

    function getSearchCount(searchTerm){

        var page_number = 0;
        if (localStorage.getItem("search_num") != null) {
            localStorage.removeItem("search_num");
        }
        var searchTerm =  searchTerm;
        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');
        var data = {"User_id": User_id,"token":token,"search_term":searchTerm,"current_page":"0"}
        data = JSON.stringify(data);

        service.operationDataService('getRatingSearch',data,function(data){

            console.log(data);
            totSearchCount = Math.ceil(data.data[0].Count/5);
            var searchDataStatus = data.data[0].Status;

            if(searchDataStatus == "true"){
                $("#ratingList").show();
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
                    localStorage.setItem("search_num", num);
                    var recentSearchTerm = localStorage.getItem('search-term');
                    getSearchContents(recentSearchTerm,num);
                });

            }
            else{

                $("#ratingList").hide();
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

    /*Funtion to get search contents*/
    function getSearchContents(searchTerm,num){

        if( num != 0){
            num = num-1;
        }
        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');
        var searchDisplayCount = '';

        var data = {"User_id": User_id,"token":token,"search_term":searchTerm,"current_page":num}
        data = JSON.stringify(data);

        service.operationDataService('getRatingSearch',data,function(data){

            console.log(data);
            totSearchCount = Math.ceil(data.data[0].Count/5);
            var searchDataStatus = data.data[0].Status;
            searchDisplayCount = data.data[0].Count;

            if(searchDataStatus == "true"){

                $("#ratingList").show();
                $('.search_bottom').css('display','block');
                $('#noData').hide();

                var  html = '';
                var dataLength =  data.data[0].ratings.length;

                for(var i = 0; i < dataLength; i++){

                    var count = i+1;
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<img class="event-list-img" id="'+data.data[0].ratings[i].smiley+'" data-original="images/pictures/calendar-icon.png" alt="img" src="'+data.data[0].ratings[i].smiley_path+'" style="display: block;">'+
                        '<strong>'+data.data[0].ratings[i].rating+'</strong>'+
                        '<p class="goal-desc" id="desc'+data.data[0].ratings[i].row_id+'">'+data.data[0].ratings[i].description+'</p>'+
                        '<a href="javascript:void(0)" class="event-list-icon-edit bg-green-dark scale-hover edit-modal" id="'+data.data[0].ratings[i].row_id+'"><i class="fa fa-edit"></i></a>'+
                        '<a href="javascript:void(0)" class="event-list-icon-delete bg-red-dark scale-hover delete-modal" id="'+data.data[0].ratings[i].row_id+'"><i class="fa fa-trash"></i></a>'+
                        '<em><span id="date'+data.data[0].ratings[i].row_id+'"><i class="fa fa-calendar"></i><span></span>'+data.data[0].ratings[i].date+'</span><span>|</span><i class=""></i><span>at time:</span><span id="1">'+data.data[0].ratings[i].time+'</span></em>'+
                        '</div>';


                }
                $("#ratingList").html(html);
                $("#displaySelect").html("Searched");
                $("#totCount").html(searchDisplayCount);

            }
            else if(data.data[0].Status === "Error"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#ratingList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();

            }
            else if(data.data[0].Status === "Invalid User"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('You are Not Authorized to Access these details');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#ratingList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                console.log("No record");
                $("#ratingList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();

            }
        });

    }

    /*Function for editing the goals*/
    $('#ratingList').on('click', '.edit-modal', function() {

        var editButtonId = $(this).attr("id");
        var id = "#"+$("#"+editButtonId).closest("div").attr("id");
        var editId = $("#"+editButtonId).closest("div").attr("id");
        var divId = id+' '+"strong";

        var smileyId = $(this).closest(id).find("img").attr("id");


        var ratingOption = $(divId).text();
        var ratingDescription = $("#desc"+editButtonId).text();
        var ratingDate = $("#date"+editButtonId).text();

        /*Binding Values*/
        $("#ratingEditDate").val(ratingDate);
        $("#ratingEditDescription").val(ratingDescription);
        $('input:radio[name=myrate][value="'+ratingOption+'"]').prop('checked',true);
        $('input:radio[name=smilerad][value="'+smileyId+'"]').prop('checked',true);
        $("#ratingId").html(editButtonId);
        $("#editIndex").val(editId);

        $('.edit-modal-content').modal();
    });

    $("#updateRating").on('click',function(){

        var start_date = localStorage.getItem("start_date");
        var end_date = localStorage.getItem("end_date");
        var filter = localStorage.getItem("filter");
        var filterValue = localStorage.getItem("filterValue");
        var num = localStorage.getItem("num");

        var ratingDate = $("#ratingEditDate").val();
        var rate = $(".rating-radio input[type='radio']:checked").val();
        var ratingDesc = $("#ratingEditDescription").val();
        var choosenRatingSmiley = $(".smiley-box input[type='radio']:checked").val();
        var ratingId = $("#ratingId").text();
        var ratingTime = moment().format("H:mm:ss");
        var editIndex = $('#editIndex').val();

        var validateStatus = validateRatingsData(ratingDate,rate);
        if(validateStatus == "success"){

            $(".spinner").show();
            $("#loader-wrapper").show();

            var data = {

                "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"rating_date": ratingDate,
                "rate": rate,"rating_desc": ratingDesc,"rating_smiley": choosenRatingSmiley,"rating_time": ratingTime,"rating_id":ratingId

            }

            data = JSON.stringify(data);
            service.operationDataService('updateRating',data,function(data){
                console.log(data);
                if(data.data[0].Status === "true")
                {

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Rating updated successfully');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                    $('#'+editIndex+ ' strong').text(rate);
                    $('#'+editIndex+ ' .goal-desc').text(ratingDesc);
                    $('#'+editIndex+' #date').text(ratingDate);
                    $('#'+editIndex+' #time').text(ratingTime);
                    $('.modal-close').click();
                    var searchPageNumber = localStorage.getItem('search_num');
                    var searchFlagStatus = localStorage.getItem('search-flag');
                    if (localStorage.getItem("num") == null){
                        num = 0;
                    }
                    if (searchPageNumber == null){
                        searchPageNumber = 0;
                    }
                    if(searchFlagStatus != "yes"){
                        getRatings(start_date,end_date,filter,filterValue,num);
                    }
                    else{
                        getSearchContents(localStorage.getItem('search-term'),searchPageNumber);
                    }
                }
                else if(data.data[0].Status === "false"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to update rating');

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
                    toastr.error('Unable to update rating');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
            });

        }

    });


    /*Function to validate the edit rating data*/
    function validateRatingsData(ratingDate,rate){

        if(ratingDate != ''){

            if(rate != undefined){

                return "success";

            }
            else{


                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please select the rating option');
            }
        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please specify rating date');
        }

    }

    /*Function for delete event model*/
    $('#ratingList').on('click', '.delete-modal', function() {

        var deleteButtonId = $(this).attr("id");
        $("#deleteId").html(deleteButtonId);
        $('.delete-modal-content').modal();

    });
    /*Function for delete event*/
    $("#Deleterating").on('click',function(){

        var start_date = localStorage.getItem("start_date");
        var end_date = localStorage.getItem("end_date");
        var filter = localStorage.getItem("filter");
        var filterValue = localStorage.getItem("filterValue");
        var num = localStorage.getItem("num");

        var token = localStorage.getItem("token");
        var user_id = localStorage.getItem("User_id");
        var ratingId = $("#deleteId").text();
        var data = {"rating_id":ratingId,"User_id":user_id,"token":token};

        $(".spinner").show();
        $("#loader-wrapper").show();
        service.operationDataService('deleteRating',JSON.stringify(data),function(data){
            console.log(data);
            if(data.data[0].Status === "true")
            {
                var searchFlagStatus = localStorage.getItem('search-flag');
                var searchPageNumber = localStorage.getItem('search_num');
                $('.modal-close').click();
                if (localStorage.getItem("num") == null){
                    num = 0;
                }
                if (searchPageNumber == null){
                    searchPageNumber = 0;
                }
                if(searchFlagStatus != "yes"){
                    getRatings(start_date,end_date,filter,filterValue,num);
                }
                else{
                    getSearchContents(localStorage.getItem('search-term'),searchPageNumber);
                }

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Rating deleted successfully');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
            }
            else if(data.data[0].Status === "false"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Unable to delete rating');

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
                toastr.error('Unable to delete rating');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
            }
        });

    });

});