/**
 * Created by EquatorTechnologies on 5/27/16.
 */
$(function(){

    $("#FilterPeriod").prop('selectedIndex',0);

    localStorage.removeItem("start_date");
    localStorage.removeItem("end_date");
    localStorage.removeItem("filter");
    localStorage.removeItem("filterValue");
    localStorage.setItem("filter_category","ALL");
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
        $("#FilterPeriod").prop('selectedIndex',0);
        $("#FilterCategory").prop('selectedIndex',0);

        if (localStorage.getItem("num") != null) {
            localStorage.removeItem("num");
        }

        var date = $("#curDate").val();
        var currentDate = moment(date).format("YYYY-MM-DD");
        var selectedDate = currentDate;
        localStorage.setItem("filterDisplayContent",selectedDate);
        getCount(currentDate,currentDate,"OFF","1","ALL") ;
    });
    $('#Transamt').keypress(function (event) {
        var status = isNumber(event,this)
        if(status == false){
            $.notify({
                    icon: 'glyphicon glyphicon-ok',
                    message: "Enter numbers only"
                },
                {
                    element: '.modal-content',
                    placement:{
                        align:"center"
                    },
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                    offset: 50,
                    spacing: 40,
                    type: "info",
                    z_index: 1031,
                    delay: 500,
                    timer: 1000
                });
            return status;
        }


    });
    function isNumber(evt, element) {

        var charCode = (evt.which) ? evt.which : event.keyCode

        if (
            (charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
                (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
                (charCode < 48 || charCode > 57))
            return false;

        return true;
    }
    getCount(currentDate,currentDate,"OFF","1","ALL","Today") ;

    $('.modal-close').click(function(){return false;});

    $("#saveTransaction").on('click',function(){

        var transId = $('#TransId').val();
        var transDate = $('#TransDate').val();
        var transCategory = $('#TransCategory :selected').val();
        var transDescription = $('#Transdesc').val();
        var transAccount = $('#TransAcc').val();
        var transAmount = $('#Transamt').val();
        var transType = $('#TransType').val();
        var transTime = moment().format("H:mm:ss");


        var validationStatus = validateTransData(transId,transCategory,transAccount,transAmount,transType);
        if(validationStatus == 'success'){

            $(".spinner").show();
            $("#loader-wrapper").show();
            var data = {

                "User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"trans_id": transId,
                "trans_date": transDate,"trans_category": transCategory,"trans_desc": transDescription,"trans_account": transAccount,
                "trans_amount":transAmount,"trans_type":transType,"trans_time":transTime
            }
            data = JSON.stringify(data);

            service.operationDataService('saveTransaction',data,function(data){

                if (data.data[0].Status === "true") {

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Your transaction created successfully');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();
                    $('.modal-close').click();
                    getCount(currentDate,currentDate,"OFF","1","ALL") ;
                    getTransactions(currentDate,currentDate,"OFF","1","ALL",0);
                }
                else if(data.data[0].Status === "false"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('Unable to create your transaction');

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
                    toastr.success('Unable to create your transaction');

                    $(".spinner").hide();
                    $("#loader-wrapper").hide();

                }

            });
        }
    });
    /*Function for validating the transaction data*/
    function validateTransData(transId,transCategory,transAccount,transAmount,transType){

        if(transId != ''){

            if(transCategory != ''){

                if(transAccount != ''){

                    if(transAmount != ''){

                        if(transType != ''){

                            return "success";

                        }
                        else{

                            toastr.options.positionClass = "toast-bottom-right";
                            toastr.options.timeout = 500;
                            toastr.warning('Please specify Transaction Type');
                        }

                    }
                    else{

                        toastr.options.positionClass = "toast-bottom-right";
                        toastr.options.timeout = 500;
                        toastr.warning('Please specify Transaction Amount');
                    }
                }
                else{

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Please specify Transaction Account');
                }

            }
            else{


                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Please select Transaction Category');
            }

        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please Specify Transaction Id');

        }



    }


    function getCount(start_date,end_date,filter,filterValue,filter_category){
        $(".search_bottom").hide();
        $(".demo4_bottom").show();
        var page_num=0;


        if (localStorage.getItem("num") != null) {
            localStorage.removeItem("num");
        }

        var initialData = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"start_date":start_date,"end_date":end_date,"filter":filter,"filterValue":filterValue,"filter_category":filter_category,"current_page":"0"}
        data = JSON.stringify(initialData);

        localStorage.setItem("start_date", start_date);
        localStorage.setItem("end_date", end_date);
        localStorage.setItem("filter", filter);
        localStorage.setItem("filterValue", filterValue);


        service.operationDataService('getTransactionsByDate',data,function(data){


            totCount = Math.ceil(data.data[0].Count/5);

            var dataStatus = data.data[0].Status;
            if(dataStatus == "true"){
                $("#transactionList").show();
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
                    var pageFilterCategory = localStorage.getItem('filter_category');
                    start_date=localStorage.getItem("start_date");
                    end_date=localStorage.getItem("end_date");

                    getTransactions(start_date,end_date,pageFilter,pageFilterValue,pageFilterCategory,num);
                });
            }
            else
            {
                $("#transactionList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
            }



        });
        if (localStorage.getItem("num") != null) {
            page_num=localStorage.getItem("num");
        }

        if(page_num==0)
        {
            getTransactions(start_date,end_date,filter,filterValue,filter_category,page_num);
        }


    }

    function getTransactions(start_date,end_date,filter,filterValue,filter_category,num){

        var displayContent = localStorage.getItem("filterDisplayContent");
        $(".search_bottom").hide();
        $(".demo4_bottom").show();

       if( num != 0){
            num = num-1;
        }

        var initialData = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token"),"start_date":start_date,"end_date":end_date,"filter":filter,"filterValue":filterValue,"filter_category":filter_category,"current_page":num}
        data = JSON.stringify(initialData);

        $(".spinner").show();
        $("#loader-wrapper").show();
        service.operationDataService('getTransactionsByDate',data,function(data){

            totCount = Math.ceil(data.data[0].Count/5);

            var dataStatus = data.data[0].Status;
            var totalResultCount = data.data[0].Count;

            if(dataStatus === "true"){

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                $("#transactionList").show();
                $('.demo4_bottom').css('display','block');
                $('#noData').hide();
                var  html = '';
                var dataLength =  data.data[0].transactions.length;
                for(var i = 0; i < dataLength; i++){

                    var count = i+1;

                    var category = '';
                    if(data.data[0].transactions[i].category == 0){
                        category = "Spent";
                    }
                    else
                    {
                        category = "Received";
                    }
                    html += '<div class="event-list" id="div'+count+'">'+
                        '<img class="event-list-img" data-original="images/pictures/money.png" alt="img" src="images/pictures/money.png" style="display: block;">'+
                        '<strong>'+data.data[0].transactions[i].trans_id+'</strong>'+
                        '<p id="description'+data.data[0].transactions[i].row_id+'" style="display: none">'+data.data[0].transactions[i].trans_des+'</p>'+
                        '<p id="type'+data.data[0].transactions[i].row_id+'" style="display: none">'+data.data[0].transactions[i].trans_type+'</p>'+
                        '<p class="goal-desc"><i class="fa fa-university" aria-hidden="true"></i> <span class="acc-no'+data.data[0].transactions[i].row_id+'">'+data.data[0].transactions[i].trans_ac+'</span><span><i class="fa fa-money"></i> <span class="amt'+data.data[0].transactions[i].row_id+'">'+data.data[0].transactions[i].trans_amt+'</span></span></p>'+
                        '<a href="javascript:void(0)" class="event-list-icon-edit bg-green-dark scale-hover edit-modal" id="'+data.data[0].transactions[i].row_id+'"><i class="fa fa-edit"></i></a>'+
                        '<a href="javascript:void(0)" class="event-list-icon-delete bg-red-dark scale-hover delete-modal" id="'+data.data[0].transactions[i].row_id+'"><i class="fa fa-trash"></i></a>'+
                        '<em><i class="fa fa-calendar"></i> <span class="t-cat" id="date'+data.data[0].transactions[i].row_id+'">'+data.data[0].transactions[i].date+'</span><span class="t-cat-s"><i class="fa fa-tags"></i> <span class="t-cat" id="category'+data.data[0].transactions[i].row_id+'">'+category+'</span></span></em>'+
                        '</div>';
                }
                $("#transactionList").html(html);
                $("#displaySelect").html(displayContent);
                $("#totCount").html(totalResultCount);

                var transCategory = data.data[0].category;
                var amt = data.data[0].balance;
                var balanceLabel = '';
                if(transCategory == 0){

                    balanceLabel = "Total Spent:";

                }
                else if(transCategory == 1){
                    balanceLabel = "Total Received:";
                }
                else{
                    balanceLabel = "Total Balance:";
                }

                $("#balance").show();
                $("#balance-label").html(balanceLabel);
                $("#balance-amt").html(amt);

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

                $("#transactionList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
                $("#balance").hide();
            }
            else if(data.data[0].Status === "Error"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#transactionList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
                $("#balance").hide();
            }
            else if(data.data[0].Status === "Invalid User"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('You are Not Authorized to Access these details');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#transactionList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
                $("#balance").hide();

            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html(displayContent);
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#transactionList").hide();
                $('.demo4_bottom').css('display','none');
                $('#noData').show();
                $("#balance").hide();

            }
        });


    }


    /*Function for detecting the filter period drop down change event*/
    $("#FilterPeriod").on("change",function(){
        loadFilteredGoalData();
        /*
        var selectedValue =  $('#FilterPeriod :selected').index();
        var selectedCategoryValue = $('#FilterCategory :selected').index();
        if(selectedValue != 0 || selectedValue != ''){
            $("#FilterSubmit").show();
        }
        else if((selectedCategoryValue == 0 || selectedCategoryValue == '')&&(selectedPeriodValue == 0 || selectedPeriodValue == '')){
            $("#FilterSubmit").hide();
        }*/
    });
    $("#FilterCategory").on("load",function(){
        loadFilteredGoalData();
    });
    /*Function for detecting the filter category drop down change event*/
    $("#FilterCategory").on("change",function(){
        loadFilteredGoalData();
        /*var selectedCategoryValue = $('#FilterCategory :selected').index();
        var selectedPeriodValue = $('#FilterPeriod :selected').index();
        if(selectedCategoryValue != 0 || selectedCategoryValue != ''){
            $("#FilterSubmit").show();
        }
        else if((selectedCategoryValue == 0 || selectedCategoryValue == '')&&(selectedPeriodValue == 0 || selectedPeriodValue == '')){
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
        var transactionPeriod = $('#FilterPeriod :selected').text();
        var filter_category = $("#FilterCategory :selected").val();


        var momentDate =  $("#curDate").val();
        var currentDate = moment(momentDate).format("YYYY-MM-DD");



        var momentPreviousDate = moment(currentDate).add(-20,'days');
        var previousDate = moment(momentPreviousDate).format("YYYY-MM-DD");
        var filter,filterValue,start_date,end_date;

        if(transactionPeriod == 'Today'){
            var todayDate = moment().format("YYYY-MM-DD");
            displayContent = "Today";
            filter="ON";
            filterValue="1";
            start_date=todayDate,
            end_date=todayDate;
        }
        else if(transactionPeriod == "Last 20"){

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
        localStorage.setItem("filter_category", filter_category);
        getCount(start_date,end_date,filter,filterValue,filter_category) ;


    }

    $("#my-trans-search").bind('keypress',function(e){
        var code = e.keyCode || e.which;
        if(code == 13) {
            $(".header-elements .search-section").hide();
            var searchTerm = $('#my-trans-search').val();
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

    /*Function for transaction search*/
    $("#trans-search").on("click",function(){

        $(".header-elements .search-section").hide();
        var searchTerm = $('#my-trans-search').val();
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

        service.operationDataService('getTransactionSearch',data,function(data){

            totSearchCount = Math.ceil(data.data[0].Count/5);

            var searchDataStatus = data.data[0].Status;
            if(searchDataStatus == "true"){

                $("#transactionList").show();
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
                $("#transactionList").hide();
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

    /*Function get search contents*/
    function getSearchContents(searchTerm,num){

        if( num != 0){
            num = num-1;
        }

        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');
        var searchDisplayCount = '';

        var data = {"User_id": User_id,"token":token,"search_term":searchTerm,"current_page":num}
        data = JSON.stringify(data);

        service.operationDataService('getTransactionSearch',data,function(data){

            totSearchCount = Math.ceil(data.data[0].Count/5);
            var searchDataStatus = data.data[0].Status;
            searchDisplayCount = data.data[0].Count;
            if(searchDataStatus == "true"){


                $(".spinner").hide();
                $("#loader-wrapper").hide();

                $("#transactionList").show();
                $('.search_bottom').css('display','block');
                $('#noData').hide();
                var  html = '';
                var dataLength =  data.data[0].transactions.length;
                for(var i = 0; i < dataLength; i++){

                    var count = i+1;

                    var category = '';
                    if(data.data[0].transactions[i].category == 0){
                        category = "Spent";
                    }
                    else
                    {
                        category = "Received";
                    }

                    html += '<div class="event-list" id="div'+count+'">'+
                        '<img class="event-list-img" data-original="images/pictures/money.png" alt="img" src="images/pictures/money.png" style="display: block;">'+
                        '<strong>'+data.data[0].transactions[i].trans_id+'</strong>'+
                        '<p id="description'+data.data[0].transactions[i].row_id+'" style="display: none">'+data.data[0].transactions[i].trans_des+'</p>'+
                        '<p id="type'+data.data[0].transactions[i].row_id+'" style="display: none">'+data.data[0].transactions[i].trans_type+'</p>'+
                        '<p class="goal-desc"><i class="fa fa-university" aria-hidden="true"></i> <span class="acc-no'+data.data[0].transactions[i].row_id+'">'+data.data[0].transactions[i].trans_ac+'</span><span><i class="fa fa-money"></i> <span class="amt'+data.data[0].transactions[i].row_id+'">'+data.data[0].transactions[i].trans_amt+'</span></span></p>'+
                        '<a href="javascript:void(0)" class="event-list-icon-edit bg-green-dark scale-hover edit-modal" id="'+data.data[0].transactions[i].row_id+'"><i class="fa fa-edit"></i></a>'+
                        '<a href="javascript:void(0)" class="event-list-icon-delete bg-red-dark scale-hover delete-modal" id="'+data.data[0].transactions[i].row_id+'"><i class="fa fa-trash"></i></a>'+
                        '<em><i class="fa fa-calendar"></i> <span class="t-cat" id="date'+data.data[0].transactions[i].row_id+'">'+data.data[0].transactions[i].date+'</span><span class="t-cat-s"><i class="fa fa-tags"></i> <span class="t-cat" id="category'+data.data[0].transactions[i].row_id+'">'+category+'</span></span></em>'+
                        '</div>';

                }
                $("#transactionList").html(html);
                $("#displaySelect").html("Searched");
                $("#totCount").html(searchDisplayCount);
                var transCategory = data.data[0].category;
                var amt = data.data[0].balance;
                var balanceLabel = '';
                if(transCategory === 0){
                    balanceLabel = "Total Spent:";

                }
                else if(transCategory === 1){
                    balanceLabel = "Total Received:";
                }
                else if(transCategory === ""){
                    balanceLabel = "Total Balance:";
                }

                $("#balance").show();
                $("#balance-label").html(balanceLabel);
                $("#balance-amt").html(amt);

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

                $("#transactionList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
                $("#balance").hide();
            }
            else if(data.data[0].Status === "Error"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Database Error');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#transactionList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
                $("#balance").hide();
            }
            else if(data.data[0].Status === "Invalid User"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('You are Not Authorized to Access these details');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $("#transactionList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
                $("#balance").hide();

            }
            else{

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No data available for display');

                $("#displaySelect").html("Searched");
                $("#totCount").html(0);

                $(".spinner").hide();
                $("#loader-wrapper").hide();

                $("#transactionList").hide();
                $('.search_bottom').css('display','none');
                $('#noData').show();
                $("#balance").hide();

            }
        });



    }



    /*Function for editing the transaction edit model*/
    $('#transactionList').on('click', '.edit-modal', function() {

        var editButtonId = $(this).attr("id");
        var id = "#"+$("#"+editButtonId).closest("div").attr("id");
        var editId = $("#"+editButtonId).closest("div").attr("id");
        var divId = id+' '+"strong";

        var transId = $(divId).text();
        var transDesc = $("#description"+editButtonId).text();
        var transDate = $("#date"+editButtonId).text();
        var transCategory = $("#category"+editButtonId).text();
        var transAccount = $(".acc-no"+editButtonId).text();
        var transAmount = $(".amt"+editButtonId).text();
        var transType = $("#type"+editButtonId).text();

        /*Binding the values*/
        var transactionCategory = '';
        if(transCategory == "Spent"){
            transactionCategory = 0;
        }
        else{
            transactionCategory = 1;
        }

        $("#EditTransactionId").val(transId);
        $("#EditTransactionDate").val(transDate);
        $("#editTransCategory").val(transactionCategory);
        $("#editTransDesc").val(transDesc);
        $("#editTransAcc").val(transAccount);
        $("#editTransAmt").val(transAmount);
        $("#editTransType").val(transType);
        $("#editTransId").html(editButtonId);

        $('.edit-modal-content').modal();

    });

    /*Function for update the transactions*/
    $("#editTransaction").on('click',function(){

        var start_date = localStorage.getItem("start_date");
        var end_date = localStorage.getItem("end_date");
        var filter = localStorage.getItem("filter");
        var filterValue = localStorage.getItem("filterValue");
        var filterCategory = localStorage.getItem("filter_category")
        var num = localStorage.getItem("num");

        var transId = $("#EditTransactionId").val();
        var transDate = $("#EditTransactionDate").val();
        var transCategory = $("#editTransCategory").val();
        var transAccount = $("#editTransAcc").val();
        var transAmount = $("#editTransAmt").val();
        var transDesc =  $("#editTransDesc").val();
        var transType = $("#editTransType").val();
        var token = localStorage.getItem("token");
        var user_id = localStorage.getItem("User_id");
        var transactionTime = moment().format("H:mm:ss");
        var rowId = $('#editTransId').text();

        var data = {"trans_row_id":rowId,"trans_id":transId,"trans_date":transDate,"trans_category":transCategory,"trans_desc":transDesc,"trans_account":transAccount,
            "trans_amount":transAmount,"trans_type":transType,"trans_time":transactionTime,"User_id":user_id,"token":token};

        $(".spinner").show();
        $("#loader-wrapper").show();

        service.operationDataService('updateTransaction',JSON.stringify(data),function(data){
            console.log(data);
            if(data.data[0].Status === "true")
            {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Transaction updated successfully!');

                $(".spinner").hide();
                $("#loader-wrapper").hide();

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
                    getTransactions(start_date,end_date,filter,filterValue,filterCategory,num);
                }
                else{
                    getSearchContents(localStorage.getItem('search-term'),searchPageNumber);
                }


            }
            else if(data.data[0].Status === "false"){
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Unable to update transaction');

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
                toastr.error('Unable to update transaction');

                $(".spinner").hide();
                $("#loader-wrapper").hide();

            }

        });
    });


    /*Function for delete transaction model*/
    $('#transactionList').on('click', '.delete-modal', function() {

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
        var filterCategory = localStorage.getItem("filter_category")
        var num = localStorage.getItem("num");

        var token = localStorage.getItem("token");
        var user_id = localStorage.getItem("User_id");
        var rowId = $("#deleteId").text();
        var data = {"trans_row_id":rowId,"User_id":user_id,"token":token};
        console.log(JSON.stringify(data));

        $(".spinner").show();
        $("#loader-wrapper").show();
        service.operationDataService('deleteTransactionById',JSON.stringify(data),function(data){
            console.log(data);
            if(data.data[0].Status === "true")
            {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Transaction deleted successfully');

                $(".spinner").hide();
                $("#loader-wrapper").hide();
                $('.modal-close').click();
                var searchFlagStatus = localStorage.getItem('search-flag');
                var searchPageNumber = localStorage.getItem('search_num');
                if (localStorage.getItem("num") == null){
                    num = 0;
                }
                if (searchPageNumber == null){
                    searchPageNumber = 0;
                }
                if(searchFlagStatus != "yes"){
                    getTransactions(start_date,end_date,filter,filterValue,filterCategory,num);
                }
                else{
                    getSearchContents(localStorage.getItem('search-term'),searchPageNumber);
                }

            }
            else if(data.data[0].Status === "false"){

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.success('Unable to  delete transaction');

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
                toastr.success('Unable to  delete transaction');

                $(".spinner").hide();
                $("#loader-wrapper").hide();

            }

        });

    });

});