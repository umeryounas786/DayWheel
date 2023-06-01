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

    /*Function to save daily thoughts*/
    $('#saveThoughts').on('click',function(){

        var date = $('#thoughtDate').val();
        var thoughtTitle = $('#thoughtTitle').val();
        var thoughtDisc = $('#thoughtDescription').val();
        var thoughtSmiley = $(".smiley-box input[type='radio']:checked").val();
        var thoughtTime = moment().format("H:mm:ss");


        var validationStatus = validateThoughtsData(date,thoughtTitle,thoughtDisc);

        if(validationStatus == "success"){
            $(".spinner").show();
            $("#loader-wrapper").show();
            var data = {

                "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"thought_date": date,
                "thought_title": thoughtTitle,"thought_desc": thoughtDisc,"thought_smiley": thoughtSmiley,"thought_time": thoughtTime

            }
            data = JSON.stringify(data);
            service.operationDataService('saveThought',data,function(data){

                if (data.data[0].Status === "true") {

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Your thought saved successfully');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    $('.modal-close').click();
                    getCount(currentDate,currentDate,"OFF","1") ;
                    getThoughts(currentDate,currentDate,"OFF","1",0);
                }
                else if(data.data[0].Status === "false"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to save your thought');

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
                    toastr.error('You are Not Authorized to Access these details');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to save your thought');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                }
            });

        }

    });

    function validateThoughtsData(date,thoughtTitle,thoughtDis){

        if(date != ''){

            if(thoughtTitle != ''){

                if(thoughtDis != ''){

                    return "success";

                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please specify thought description');
                }

            }
            else{


                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please specify thought title');

            }

        }
        else{


            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please select thought date');
        }


    }

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


        service.operationDataService('getThoughtsByDate',data,function(data){

            console.log(data);
            totCount = Math.ceil(data.data[0].Count/5);

            var dataStatus = data.data[0].Status;
            if(dataStatus == "true"){
                $("#thoughtList").show();
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
                    getThoughts(start_date,end_date,pageFilter,pageFilterValue,num);
                });
            }
            else
            {
                console.log("No record");
                $("#thoughtList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }



        });
        if (localStorage.getItem("num") != null) {
            page_num=localStorage.getItem("num");
        }

        if(page_num==0)
        {
            getThoughts(start_date,end_date,filter,filterValue,page_num);
        }


    }

    function getThoughts(start_date,end_date,filter,filterValue,num){

        var displayContent = localStorage.getItem("filterDisplayContent");
        $(".search_bottom").hide();
        $(".demo4_bottom").show();
        if( num != 0){
            num = num-1;
        }

        $(".spinner").show();
        $("#loader-wrapper").show();
        var initialData = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"start_date":start_date,"end_date":end_date,"filter":filter,"filterValue":filterValue,"current_page":num}
        data = JSON.stringify(initialData);

        service.operationDataService('getThoughtsByDate',data,function(data){

            var totalResultCount = data.data[0].Count;
            totCount = Math.ceil(data.data[0].Count/5);

            var dataStatus = data.data[0].Status;
            if(dataStatus == "true"){

                $("#thoughtList").show();
                $('.demo4_bottom').css('display','block');
                $('#noData').hide();

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                var  html = '';
                var dataLength =  data.data[0].thoughts.length;

                for(var i = 0; i < dataLength; i++){

                    var count = i+1;
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<img id="'+data.data[0].thoughts[i].smiley+'" class="event-list-img" data-original="images/pictures/calendar-icon.png" alt="img" src="'+data.data[0].thoughts[i].smiley_path+'" style="display: block;">'+
                        '<strong>'+data.data[0].thoughts[i].title+'</strong>'+
                        '<p class="goal-desc" id="desc'+data.data[0].thoughts[i].row_id+'">'+data.data[0].thoughts[i].description+'</p>'+
                        '<a href="javascript:void(0)" class="event-list-icon-edit bg-green-dark scale-hover edit-modal" id="'+data.data[0].thoughts[i].row_id+'"><i class="fa fa-edit"></i></a>'+
                        '<a href="javascript:void(0)" class="event-list-icon-delete bg-red-dark scale-hover delete-modal" id="'+data.data[0].thoughts[i].row_id+'"><i class="fa fa-trash"></i></a>'+
                        '<em><span id="date'+data.data[0].thoughts[i].row_id+'"><i class="fa fa-calendar"></i><span></span>'+data.data[0].thoughts[i].date+'</span><span>|</span><i class=""></i><span>at time:</span><span id="1">'+data.data[0].thoughts[i].time+'</span></em>'+
                        '</div>';
                }
                $("#thoughtList").html(html);
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

                $("#thoughtList").hide();
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
                $("#thoughtList").hide();
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
                $("#thoughtList").hide();
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

                $("#thoughtList").hide();
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

    $("#my-thought-search").bind('keypress',function(e){
        var code = e.keyCode || e.which;
        if(code == 13) { //Enter keycode
            $(".header-elements .search-section").hide();
            var searchTerm = $('#my-thought-search').val();
            if(searchTerm != ''){

                $(".demo4_bottom").hide();
                $(".search_bottom").show();
                getThoughtSearchCount(searchTerm);
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

    /*Function for thought search*/
    $('#thought-search').on('click',function(){

        $(".header-elements .search-section").hide();
        var searchTerm = $('#my-thought-search').val();
        if(searchTerm != ''){

            $(".demo4_bottom").hide();
            $(".search_bottom").show();
            getThoughtSearchCount(searchTerm);
            localStorage.setItem('search-term',searchTerm);
            localStorage.setItem('search-flag','yes');

        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please specify your search term');

        }

    });

    /*Function for search count*/
    function getThoughtSearchCount(searchTerm){

        var page_number = 0;

        if (localStorage.getItem("search_num") != null) {
            localStorage.removeItem("search_num");
        }

        var searchTerm =  searchTerm;

        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');

        var data = {"User_id": User_id,"token":token,"search_term":searchTerm,"current_page":"0"}
        data = JSON.stringify(data);

        service.operationDataService('getThoughtSearch',data,function(data){

            console.log(data);

            totSearchCount = Math.ceil(data.data[0].Count/5);

            var searchDataStatus = data.data[0].Status;

            if(searchDataStatus == "true"){

                $("#thoughtList").show();
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
                    getThoughtSearchContents(recentSearchTerm,num);

                });


            }
            else{

                $("#thoughtList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
            }
        });

        if (localStorage.getItem("num") != null) {
            page_number=localStorage.getItem("num");
        }

        if(page_number==0)
        {

            getThoughtSearchContents(searchTerm,page_number);
        }


    }

    /*Function for get thought serach contents*/
    function getThoughtSearchContents(searchTerm,num){

        if( num != 0){
            num = num-1;
        }

        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');
        var searchDisplayCount = '';

        var data = {"User_id": User_id,"token":token,"search_term":searchTerm,"current_page":num}
        data = JSON.stringify(data);

        service.operationDataService('getThoughtSearch',data,function(data){

            console.log(data);
            totSearchCount = Math.ceil(data.data[0].Count/5);
            var searchDataStatus = data.data[0].Status;
            searchDisplayCount = data.data[0].Count;
            if(searchDataStatus == "true"){

                $("#thoughtList").show();
                $('.search_bottom').css('display','block');
                $('#noData').hide();

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                var  html = '';
                var dataLength =  data.data[0].thoughts.length;

                for(var i = 0; i < dataLength; i++){

                    var count = i+1;
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<img id="'+data.data[0].thoughts[i].smiley+'" class="event-list-img" data-original="images/pictures/calendar-icon.png" alt="img" src="'+data.data[0].thoughts[i].smiley_path+'" style="display: block;">'+
                        '<strong>'+data.data[0].thoughts[i].title+'</strong>'+
                        '<p class="goal-desc" id="desc'+data.data[0].thoughts[i].row_id+'">'+data.data[0].thoughts[i].description+'</p>'+
                        '<a href="javascript:void(0)" class="event-list-icon-edit bg-green-dark scale-hover edit-modal" id="'+data.data[0].thoughts[i].row_id+'"><i class="fa fa-edit"></i></a>'+
                        '<a href="javascript:void(0)" class="event-list-icon-delete bg-red-dark scale-hover delete-modal" id="'+data.data[0].thoughts[i].row_id+'"><i class="fa fa-trash"></i></a>'+
                        '<em><span id="date'+data.data[0].thoughts[i].row_id+'"><i class="fa fa-calendar"></i><span></span>'+data.data[0].thoughts[i].date+'</span><span>|</span><i class=""></i><span>at time:</span><span id="1">'+data.data[0].thoughts[i].time+'</span></em>'+
                        '</div>';

                }
                $("#thoughtList").html(html);
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

                $("#thoughtList").hide();
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
                $("#thoughtList").hide();
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
                $("#thoughtList").hide();
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
                $("#thoughtList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();

            }

        });
    }



    /*Function for editing the goals*/
    $('#thoughtList').on('click', '.edit-modal', function() {

        var editButtonId = $(this).attr("id");
        var id = "#"+$("#"+editButtonId).closest("div").attr("id");
        var editId = $("#"+editButtonId).closest("div").attr("id");
        var divId = id+' '+"strong";


        var smileyId = $(this).closest(id).find("img").attr("id");


        var thoughtTitle = $(divId).text();
        var thoughtDescription = $("#desc"+editButtonId).text();
        var thoughtDate = $("#date"+editButtonId).text();

        /*Binding values*/
        $("#thoughtEditDate").val(thoughtDate);
        $("#thoughtEditTitle").val(thoughtTitle);
        $("#thoughtEditDescription").val(thoughtDescription);
        $('input:radio[name=smilerad][value="'+smileyId+'"]').prop('checked',true);
        $('#thoughtId').html(editButtonId);
        $("#editIndex").val(editId);
        $('.edit-modal-content').modal();
    });

    /*Function for update the goal*/
    $("#updateThought").on('click',function(){

        var start_date = localStorage.getItem("start_date");
        var end_date = localStorage.getItem("end_date");
        var filter = localStorage.getItem("filter");
        var filterValue = localStorage.getItem("filterValue");
        var num = localStorage.getItem("num");

        var thoughtDate = $("#thoughtEditDate").val();
        var thoughtTitle = $("#thoughtEditTitle").val();
        var thoughtDesc = $("#thoughtEditDescription").val();
        var choosenThoughtSmiley = $(".smiley-box input[type='radio']:checked").val();
        var thoughtId = $("#thoughtId").text();
        var thoughtTime = moment().format("H:mm:ss");
        var editIndex = $('#editIndex').val();

        var validateStatus = validateGoalsData(thoughtDate,thoughtTitle,thoughtDesc);
        if(validateStatus == 'success'){

            $(".spinner").show();
            $("#loader-wrapper").show();

            var data = {

                "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"thought_date": thoughtDate,
                "thought_title": thoughtTitle,"thought_desc": thoughtDesc,"thought_smiley": choosenThoughtSmiley,"thought_time": thoughtTime,"thought_id":thoughtId

            }

            service.operationDataService('updateThought',JSON.stringify(data),function(data){

                if(data.data[0].Status === "true")
                {

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Thought updated successfully');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    $('#'+editIndex+ ' strong').text(thoughtTitle);
                    $('#'+editIndex+ ' .goal-desc').text(thoughtDesc);
                    $('#'+editIndex+' #date').text(thoughtDate);
                    $('#'+editIndex+' #time').text(thoughtTime);
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
                        getThoughts(start_date,end_date,filter,filterValue,num);
                    }
                    else{
                        getThoughtSearchContents(localStorage.getItem('search-term'),searchPageNumber);
                    }

                }
                else if(data.data[0].Status === "false"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to update thought');

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
                    toastr.error('Unable to update thought');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                }

            });

        }

    });



    function validateGoalsData(goalDate,goalTitle,goalDesc){

        if(goalDate != ''){

            if(goalTitle != ''){

                if(goalDesc != ''){

                    return 'success';

                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please specify goal description');

                }


            }
            else{


                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please specify goal title');
            }

        }
        else{


            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please specify goal date');
        }


    }

    /*Function for delete event model*/
    $('#thoughtList').on('click', '.delete-modal', function() {
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
        var thoughtId = $("#deleteId").text();

        $(".spinner").show();
        $("#loader-wrapper").show();
        var data = {"thought_id":thoughtId,"User_id":user_id,"token":token};

        service.operationDataService('deleteThoughtById',JSON.stringify(data),function(data){

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
                    getThoughts(start_date,end_date,filter,filterValue,num);
                }
                else{
                    getThoughtSearchContents(localStorage.getItem('search-term'),searchPageNumber);
                }
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Thought deleted successfully');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
            }
            else if(data.data[0].Status === "false"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Unable to delete thought');

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
                toastr.success('Unable to delete thought');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
            }
        });

    });

});