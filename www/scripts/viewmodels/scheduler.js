/**
 * Created by Equator Technologies on 6/14/16.
 */

$(function(){
    var serverServiceBase='http://mydaywheel.com/api/v1.2/index.php/';
    //var serverServiceBase= 'http://demo.a2z4smb.com:7076/api/index.php';

    var requestData = {"User_id":localStorage.getItem('User_id'),"token":localStorage.getItem('token')}
    requestData = JSON.stringify(requestData);
    console.log(requestData);
    service.operationDataService('getSchedulerData',requestData,function(data){
        console.log(data);
        console.log(data.data[0].Status);
        if(data.data[0].Status=='true')
        {
            designScheduler();
        }
        else if(data.data[0].Status === 'false'){
            var data = {"User_id": localStorage.getItem("User_id"),"token": localStorage.getItem("token")}
            data=JSON.stringify(data);
            console.log(data);
            service.operationDataService('deleteFiles',data,function(data){
                console.log(data);
            });
            designScheduler();
        }
        else if(data.data[0].Status === "Invalid User"){

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.error('You are Not Authorized to Access these details');
        }
        else if(data.data[0].Status === "Error"){

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.timeout = 500;
            toastr.error('Database Error');
        }

    });
    $("#ok").click(function(){
        $('#alertModal').hide();

    });

    function designScheduler()
    {

        var fileName = localStorage.getItem('User_id');
        var theme = prepareSimulator("scheduler");
        var source = {

            dataType: "json",
            dataFields: [
                { name: 'event_id', type: 'string' },
                { name: 'event_title', type: 'string' },
                { name: 'event_address', type: 'string' },
                { name: 'event_description', type: 'string' },
                { name: 'calendar', type: 'string' },
                { name: 'start', type: 'date', format: "yyyy-MM-dd HH:mm:ss" },
                { name: 'end', type: 'date', format: "yyyy-MM-dd HH:mm:ss" }
            ],
            id: 'id',
            url: serverServiceBase+"/getFileData1/"+fileName
        };
        var adapter = new $.jqx.dataAdapter(source);
        var schedulerSettings =
        {
            date: new $.jqx.date(),
            width: '100%',
            height: 500,
            source: adapter,
            view: 'monthView',
            toolBarRangeFormat: 'dd MMM yyyy',
            toolBarRangeFormatAbbr: 'dd MMM yy',
            showLegend: true,
            theme: theme,
            ready: function () {
                $("#scheduler").jqxScheduler('ensureAppointmentVisible', 'id1');

            },
            resources:
            {
                colorScheme: "scheme07",
                dataField: "calendar",
                source: new $.jqx.dataAdapter(source)
            },
            appointmentDataFields:
            {
                from: "start",
                to: "end",
                id: "id",
                description: "event_description",
                location: "event_address",
                subject: "event_title"
            },
            localization:{
                editDialogTitleString: "Edit Events"
            },
            views:
                [
                    { type: "dayView", showWeekends: true, timeRuler: { hidden: false } },
                    { type: "weekView", showWeekends: true, timeRuler: { hidden: false } },
                    { type: "monthView", showWeekends: true },
                    { type:"agendaView", showWeekends: true }
                ]
        }
        initSimulator("scheduler", schedulerSettings);
        $("#scheduler").on('cellDoubleClick',function(event){
            $("#scheduler").jqxScheduler('closeDialog');
        });
        $("#scheduler").jqxScheduler({ editDialog: false});
        $("#scheduler").jqxScheduler({ contextMenu: false });
    }

});
