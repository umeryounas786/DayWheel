/**
 * Created by EquatorTechnologies on 6/8/16.
 */
$(function(){

    $("#FilterWheelEvent").prop('selectedIndex',1);

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

    function getCount(start_date,end_date,filter,filterValue){
        $(".search_bottom").hide();
        $(".demo4_bottom").show();

        var page_num=0;

        if (localStorage.getItem("num") != null) {
            localStorage.removeItem("num");
        }

        var initialData = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"start_date":start_date,"end_date":end_date,"filter":filter,"filterValue":filterValue,"current_page":"0"}
        data = JSON.stringify(initialData);

        localStorage.setItem("start_date", start_date);
        localStorage.setItem("end_date", end_date);
        localStorage.setItem("filter", filter);
        localStorage.setItem("filterValue", filterValue);


        service.operationDataService('getPollsByDate',data,function(data){

            console.log(data);
            totCount = Math.ceil(data.data[0].Count/5);


            var dataStatus = data.data[0].Status;
            if(dataStatus == "true"){
                $("#pollList").show();
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

                    localStorage.setItem("num", num);

                    var pageFilter = localStorage.getItem('filter');
                    var pageFilterValue = localStorage.getItem('filterValue');
                    start_date=localStorage.getItem("start_date");
                    end_date=localStorage.getItem("end_date");

                    getPolls(start_date,end_date,pageFilter,pageFilterValue,num);
                });
            }
            else
            {
                console.log("No record");
                $("#pollList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }



        });
        if (localStorage.getItem("num") != null) {
            page_num=localStorage.getItem("num");
        }

        if(page_num==0)
        {
            getPolls(start_date,end_date,filter,filterValue,page_num);
        }


    }

    function getPolls(start_date,end_date,filter,filterValue,num){

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

        service.operationDataService('getPollsByDate',data,function(data){
            console.log(data);
            totCount = Math.ceil(data.data[0].Count/5);
            var totalResultCount = data.data[0].Count;
            var dataStatus = data.data[0].Status;
            if(dataStatus === "true"){

                $("#pollList").show();
                $('.demo4_bottom').css('display','block');
                $('#noData').hide();

                $(".spinner").hide();
                $("#loader-wrapper").hide();


                var  html = '';
                var dataLength =  data.data[0].polls.length;

                for(var i = 0; i < dataLength; i++){

                    var count = i+1;
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<div>' +
                        '<img class="event-list-img" data-original="images/pictures/poll.png" alt="img" src="images/pictures/poll.png" style="display: block;">'+
                        '<strong class="poll-title">Poll Title</strong>'+
                        '<p style="padding-left: 80px;">'+data.data[0].polls[i].poll_title+'</p>'+
                        '</div>'+
                        '<div>'+
                            '<strong class="poll-title">Poll Option</strong>'+
                            '<p style="padding-left: 80px; class="poll-desc" id="desc'+data.data[0].polls[i].row_id+'">'+data.data[0].polls[i].poll_option+'</p>'+
                        '</div>'+
                        '<em><span class="date" id="date'+data.data[0].polls[i].row_id+'"><i class="fa fa-calendar"></i><span></span>'+data.data[0].polls[i].polled_date+'</span></em>'+
                        '</div>';


                }
                $("#pollList").html(html);
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

                $("#pollList").hide();
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
                $("#pollList").hide();
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
                $("#pollList").hide();
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
                $("#pollList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();

            }
        });

    }

    /*Function for detecting the drop down change event*/
    $("#FilterWheelEvent").on("change",function(){
        var selectedValue =  $('#FilterWheelEvent :selected').index();
        if(selectedValue != 0 || selectedValue != ''){
            $("#FilterSubmit").show();
        }
        else{
            $("#FilterSubmit").hide();
        }
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

      //  console.log("momentDate"+momentDate);

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

    $("#my-poll-search").bind('keypress',function(e){
        var code = e.keyCode || e.which;
        if(code == 13) {
            $(".header-elements .search-section").hide();
            var searchTerm = $('#my-poll-search').val();
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

    /*Function for poll search*/
    $("#poll-search").on("click",function(){
        $(".header-elements .search-section").hide();
        var searchTerm = $('#my-poll-search').val();
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

    /*Function to get poll search count*/
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
        console.log(data);
        service.operationDataService('getPollSearch',data,function(data){

            console.log(data);
            totSearchCount = Math.ceil(data.data[0].Count/5);
            var searchDataStatus = data.data[0].Status;
            if(searchDataStatus == "true"){
                $("#pollList").show();
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
                console.log("No record");
                $("#pollList").hide();
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

        var data = {"User_id": User_id,"token":token,"search_term":searchTerm,"current_page":num}
        data = JSON.stringify(data);
        console.log(data);
        service.operationDataService('getPollSearch',data,function(data){
            console.log(data);
            totSearchCount = Math.ceil(data.data[0].Count/5);
            var searchDataStatus = data.data[0].Status;
            searchDisplayCount = data.data[0].Count;
            if(searchDataStatus == "true"){
                $("#pollList").show();
                $('.search_bottom').css('display','block');
                $('#noData').hide();

                $(".spinner").hide();
                $("#loader-wrapper").hide();


                var  html = '';
                var dataLength =  data.data[0].polls.length;

                for(var i = 0; i < dataLength; i++){

                    var count = i+1;
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<div>' +
                        '<img class="event-list-img" data-original="images/pictures/poll.png" alt="img" src="images/pictures/poll.png" style="display: block;">'+
                        '<strong class="poll-title">Poll Title</strong>'+
                        '<p style="padding-left: 80px;">'+data.data[0].polls[i].poll_title+'</p>'+
                        '</div>'+
                        '<div>'+
                        '<strong class="poll-title">Poll Option</strong>'+
                        '<p style="padding-left: 80px; class="poll-desc" id="desc'+data.data[0].polls[i].row_id+'">'+data.data[0].polls[i].poll_option+'</p>'+
                        '</div>'+
                        '<em><span class="date" id="date'+data.data[0].polls[i].row_id+'"><i class="fa fa-calendar"></i><span></span>'+data.data[0].polls[i].polled_date+'</span></em>'+
                        '</div>';


                }
                $("#pollList").html(html);
                $("#displaySelect").html("Searched");
                $("#totCount").html(searchDisplayCount);

            }
            else if(data.data[0].Status === "false")
            {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                $("#pollList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
            }
            else if(data.data[0].Status === "Error"){
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#pollList").hide();
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
                $("#pollList").hide();
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
                $("#pollList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();

            }
        });

    }


});
