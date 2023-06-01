/**
 * Created by EquatorTechnologies on 6/1/16.
 */
$(function(){

    getPollData();
    function getPollData(){
        $(".votetitle").remove();
        $(".votetitle").delete;
        $(".voting-radio").remove();
        $(".voting-radio").delete;
        var data = {"User_id":localStorage.getItem('User_id'),"token":localStorage.getItem('token')}
        service.operationDataService('getPoll',JSON.stringify(data),function(data){
            console.log(data.data[0].poll);
            console.log("Row Id:"+data.data[0].poll[0].row_id);
            console.log("Title:"+data.data[0].poll[0].poll_title);
            if(data.data[0].Status=='true' || data.data[0].Status1=='true')
            {

                $('<div id="'+data.data[0].poll[0].row_id+'" class="votetitle">' +
                    '<span>'+data.data[0].poll[0].poll_title+'</span>'+
                    '</div>').appendTo("#voteTitle");
                for(var i = 0; i < data.data[0].poll.length; i++){

                    $('<div class="voting-radio">'+
                        '<input id="radio-label-1" class="radiobox" name="myvote" value="'+data.data[0].poll[i].poll_option_id+'" type="radio">'+
                        '<label class="radio-label" for="radio-label-1">'+data.data[0].poll[i].poll_option+'</label>'+
                        '</div>').clone().appendTo("#vote-options");

                }
            }
            else if(data.data[0].Status=== "false")
            {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('Poll Details not found in Database');
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
            else {

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Unable to Process Your Request');

            }

        });
    }



    $("#saveVote").click(function(){

        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');
        var date = new moment();
        var pollDate = moment(date).format("YYYY-MM-DD");
        var voteOption = $(".voting-radio input[type='radio']:checked").val();
        var pollId = $("#voteTitle").find('div').attr("id");


        var validationStatus = validatePollData(voteOption);

        if(validationStatus == "success"){

            var pollData = {"User_id":User_id,"token":token,"poll_id":pollId,"poll_option":voteOption,"poll_date":pollDate}
            var data = JSON.stringify(pollData);

            service.operationDataService('savePoll',data,function(data){

                console.log(data);

                if(data.data[0].Status == "true"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.success('You voted  successfully');

                }
                else if(data.data[0].Status == "Polled"){

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('You voted  already');
                    getPollData();

                }
                else if(data.data[0].Status=== "false")
                {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.warning('Voting Failed');
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
                else {

                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.options.timeout = 500;
                    toastr.error('Unable to Process Your Request');

                }


            });
        }

    });

    /*Function to validate the vote data*/
    function validatePollData(voteOption){

        if(voteOption != undefined){

            return 'success';
        }
        else{

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.warning('Please select the vote option');

        }
    }


    //Pie Charts
    var poll_id = 0;
    $('body').on('click','.vote-result',function(){

        $('.vote-right-section').toggleClass('result-show');
        var User_id = localStorage.getItem('User_id');
        var token = localStorage.getItem('token');
        poll_id = $('.votetitle').attr('id');
        var pieData1 = [];

        var data = {"User_id":User_id,"token":token,"poll_id":poll_id}
        data = JSON.stringify(data);
        console.log("Data sent:"+data);
        service.operationDataService('getPollResults',data,function(data){

            if(data.data[0].Status == "true"){
                $('.text-center').show();
                $('#poll-count').show();
                $("#poll-count").text(data.data[0].poll[0].poll_count);
                for(var i=0;i<data.data[0].poll.length;i++)
                {
                    pieData1.push({value: data.data[0].poll[i].count_poll,	color: get_random_color(), highlight: "#34495e", label: data.data[0].poll[i].poll_option})
                }

                var pie_chart_1 = document.getElementById("generate-pie-chart").getContext("2d");
                window.pie_chart_1 = new Chart(pie_chart_1).Pie(pieData1);
                console.log(pieData1);

            }
            else if(data.data[0].Status=== "false")
            {
                $('.text-center').hide();
                $('#poll-count').hide();
                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.warning('No Polling results Found');
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
            else {

                toastr.options.positionClass = "toast-bottom-right";
                toastr.options.timeout = 500;
                toastr.error('Unable to Process Your Request');

            }

        });
    });
    function get_random_color() {
        function c() {
            var hex = Math.floor(Math.random()*256).toString(16);
            return ("0"+String(hex)).substr(-2); // pad with zero
        }
        return "#"+c()+c()+c();
    }
});