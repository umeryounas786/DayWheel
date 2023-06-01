var index = location.pathname.indexOf('index');
pathName = location.pathname.substr(0, index - 1);
var index = location.pathname.split('/', 2).join('/').length;
pathRoute = location.pathname.substr(0, index);
routeName=pathRoute.replace(/\//g,'');

var serverServiceBase='http://mydaywheel.com/api/v1.2/index.php/';
//var serverServiceBase='http://192.168.50.16/mydaywheel/api/index.php';
//var serverServiceBase= 'http://demo.a2z4smb.com:7076/api/index.php';

service = {
//POST method
    getDataService: function (url, callback, isAsynch, itemData) {
        var syn = isAsynch !== undefined ? isAsynch : true;
        $.ajax({
            url			: serverServiceBase + '/' + url,
            crossDomain	: true,
            dataType	: 'json',
            type		: 'GET',
            async		: syn
        }).done(function (data) {
            callback(data, itemData);
        });
    },
//POST data
    operationDataService: function (url, data, callback, isAsynch) {
        var syn = isAsynch !== undefined ? isAsynch : true;
        $.ajax({
            url		: serverServiceBase + '/' + url,
            dataType: 'json',
            type	: 'POST',
            data	: data,
            async	: syn
        }).done(function (data) {
            callback(data);
        });
    }
}