/**
 * Created by EmployeeLogin on 26/5/16.
 */
$(function() {
    /**************** week in review Function**********/
    var date = $("#curDate").val();
    var currentDate = moment(date).format("YYYY-MM-DD");
    console.log("cur cdate" + currentDate);
    var stage;
    var review;
    var reviewlength;
    var serverServiceBase='http://mydaywheel.com/api/v1.2/index.php/';
    //var serverServiceBase = 'http://192.168.50.17/mydaywheel/api/index.php/';
    //var serverServiceBase= 'http://demo.a2z4smb.com:7076/api/index.php';

    $('body').on('change', '#curDate', function () {

        review = $('#ReviwWheel').val();
        $("#review-box div").remove();

        console.log("review wheel" + review);

        var date = $("#curDate").val();
        var currentDayDate = moment(date).format("YYYY-MM-DD");
        generateWheelDiv(review, currentDayDate);

    });

    function generateWheelDiv(review) {
        var date = $("#curDate").val();
        var currentDate = moment(date).format("YYYY-MM-DD");

        console.log("review" + review);

        var count = 0;
        if (review === '1') {
            count = 6;
        }
        else if (review === '2') {
            count = 13;
        }
        else {
            count = 27;
        }
        for (var i = 0; i <= count; i++) {

            var momentPreviousDate = moment(currentDate).add(-i, 'days');
            console.log("momentPreviousDate" + momentPreviousDate);
            var previousDate = moment(momentPreviousDate).format("YYYY-MM-DD");
            console.log("previousDate" + previousDate);
            var displayDate = moment(momentPreviousDate).format("ddd MMM DD ,gggg");
            var row = $("<div class='col-md-4'><div id='pieChart-" + i + "' class='chart' style='height: auto' class='my-wheel'></div><div><p class='text-center'>" + displayDate + "</p></div></div>");
            //console.log(row);
            $("#review-box").append(row);
            getDayWheelData(previousDate, i);
        }
        reviewlength = $("#review-box .col-md-4").length;
        $('.showing-result-count').text(reviewlength);
        $('#currentReviewDate').html(currentDate);
        $('#previousReviewDate').html(previousDate);
    }

    $(function () {
        review = $('#ReviwWheel').val();

        review = '1';
        generateWheelDiv(review);

    });
    $('body').on('change', '#ReviwWheel', function () {

        var review = $(this).val();
        $("#review-box div").remove();
        console.log("body cdate" + currentDate);
        generateWheelDiv(review, currentDate);
    });
    /**************** week in review End **********/
    function getDayWheelData(currentDate, i) {
        //alert(currentDate);
        var data = {
            "User_id": localStorage.getItem("User_id"),
            "token": localStorage.getItem("token"),
            "currentDate": currentDate
        }

        data = JSON.stringify(data);
        // $('#pieChart').empty();
        service.operationDataService('getData', data, function (data) {
            console.log(data.data[0].wheelEvents);
            // console.log(data.data[0]);
            $('#pieChart-' + i).drawPieChart(data.data[0].wheelEvents);
        });
    }


    ;(function($, undefined) {
        //function for draw pie chart
        $.fn.drawPieChart = function(data, options) {
            console.log(data);
            var $this = this,
                W = $this.width() ,
                H = $this.width() ,
                centerX = W / 2,
                centerY = H / 2,
                cos = Math.cos,
                sin = Math.sin,
                PI = Math.PI,
                settings = $.extend({
                    segmentShowStroke: true,
                    segmentStrokeColor: "#fff",
                    segmentStrokeWidth: 1,
                    baseColor: "#fff",
                    baseOffset: 15,
                    edgeOffset: 30, //offset from edge of $this
                    pieSegmentGroupClass: "pieSegmentGroup",
                    pieSegmentClass: "pieSegment",
                    lightPiesOffset: 0, //lighten pie's width 12
                    lightPiesOpacity: .3, //lighten pie's default opacity
                    lightPieClass: "lightPie",
                    animation: true,
                    animationSteps: 90,
                    animationEasing: "easeInOutExpo",
                    tipOffsetX: -15,
                    tipOffsetY: -45,
                    tipClass: "pieTip",
                    beforeDraw: function() {},
                    afterDrawed: function() {},
                    onPieMouseenter: function(e, data) {},
                    onPieMouseleave: function(e, data) {},
                    onPieClick: function(e, data) {}
                }, options),
                animationOptions = {
                    linear: function(t) {
                        return t;
                    },
                    easeInOutExpo: function(t) {
                        var v = t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
                        return (v > 1) ? 1 : v;
                    }
                },
                requestAnimFrame = function() {
                    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };
                }();
            var $wrapper = $('<svg class="dayWheel" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><\/svg>').appendTo($this);
            var $groups = [],
                $pies = [],
                $lightPies = [],
                easingFunction = animationOptions[settings.animationEasing],
                pieRadius = (Min([H / 2, W / 2]) - settings.edgeOffset)+29,//SVG Circle Radius
                segmentTotal = 0;

            //Draw base circle
            var drawBasePie = function() {
                var base = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                var $base = $(base).appendTo($wrapper);
                base.setAttribute("cx", centerX);
                base.setAttribute("cy", centerY);
                base.setAttribute("r", pieRadius); //+settings.baseOffset);
                base.setAttribute("fill", settings.baseColor);
            }();

            //Set up pie segments wrapper
            var pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            var $pathGroup = $(pathGroup).appendTo($wrapper);
            $pathGroup[0].setAttribute("opacity", 0);
            //Set up tooltip
            var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('body').hide(),
                tipW = $tip.width(),
                tipH = $tip.height();
            for (var i = 0, len = data.length; i < len; i++) {
                var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                event_id = data[i].id;
                event_name = data[i].title;
                g.setAttribute("data-order", i);
                g.setAttribute("event-id", event_id);
                g.setAttribute("event-name", event_name);
                g.setAttribute("class", settings.pieSegmentGroupClass);
                $groups[i] = $(g).appendTo($pathGroup);
                $groups[i].on("mouseenter", pathMouseEnter).on("mouseleave", pathMouseLeave).on("mousemove", pathMouseMove).on("click", pathClick);

                var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                p.setAttribute("stroke-width", settings.segmentStrokeWidth);
                p.setAttribute("stroke", settings.segmentStrokeColor);
                p.setAttribute("stroke-miterlimit", 2);
                p.setAttribute("fill", data[i].color);
                p.setAttribute("class", settings.pieSegmentClass);
                $pies[i] = $(p).appendTo($groups[i]);

                var lp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                lp.setAttribute("stroke-width", settings.segmentStrokeWidth);
                lp.setAttribute("stroke", settings.segmentStrokeColor);
                lp.setAttribute("stroke-miterlimit", 2);
                lp.setAttribute("fill", data[i].color);
                lp.setAttribute("opacity", settings.lightPiesOpacity);
                lp.setAttribute("class", settings.lightPieClass);
                $lightPies[i] = $(lp).appendTo($groups[i]);

                //label function
                var svgWidth  =   $('.dayWheel').width();
                var svgHeight  =   $('.dayWheel').height();
                var lstart =Math.round(data[i].start);
                var lsend =Math.round(data[i].end);
                var txtAng=(lstart+(lsend-lstart)/2);
                txtAng = Math.ceil(txtAng,-2);
                var rad = (txtAng-90)*Math.PI/180;//(data[i].start - 90) * Math.PI / 180.0,
                var r = svgWidth/2-70;
                var lx= (svgWidth/2)+(r * Math.cos(rad));
                var ly= (svgWidth/2)+(r * Math.sin(rad));
                if(txtAng<180) txtAng -= 90; else txtAng += 90;
                var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('font-size', "10px");
                label.setAttribute('fill', '#000');
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('alignment-baseline', 'central');
                label.setAttribute('transform', 'translate('+lx+','+ly+')rotate('+txtAng+')');
                if(data.length==1)
                {
                    if(data[0].title == '0') {
                        label.textContent = 'No Events Found';
                    }
                    else{
                        label.textContent = data[0].title;
                    }
                }
                else {
                    var str = data[i].title;
                    if(str.length >= 15) {str = str.substring(0,15)+"...";}
                    else{str = data[i].title;}
                    label.textContent = str;
                }

                $pies[i] = $(label).appendTo($groups[i]);
            }

            // function for Clock designs
            var time=[1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12];
            var timeAngle=[15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345,360];

            for(var t=0;t<=(time.length)-1;t++) {

                var svgWidth = $('.dayWheel').width();
                var svgHeight = $('.dayWheel').height();


                var lsend = timeAngle[t];
                var txtAng = lsend;//(lstart+(lsend-lstart)/2);


                var rad = (txtAng - 90) * Math.PI / 180;//(data[i].start - 90) * Math.PI / 180.0,
                var r = svgWidth / 2-15;
                var tlx = (svgWidth / 2) + (r * Math.cos(rad));
                var tly = (svgWidth / 2) + (r * Math.sin(rad));

                if (txtAng < 180) txtAng -= 90; else txtAng += 90;

                var timeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                timeSvg.setAttribute('x', tlx);
                timeSvg.setAttribute('y', tly);
                timeSvg.setAttribute('font-size', "12px");
                timeSvg.setAttribute('fill', '#0180A3');
                timeSvg.setAttribute('font-family', 'Helvetica');
                timeSvg.setAttribute('text-anchor', 'middle');
                timeSvg.setAttribute('alignment-baseline', 'central');
                //timeSvg.setAttribute('transform', 'translate(' + tlx + ',' + tly + ')');
                timeSvg.textContent = time[t];
                $lightPies[i] = $(timeSvg).appendTo('svg');
            }

            // Clock outer Circle
            var occ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            occ.setAttributeNS(null, "cx", svgWidth/2);
            occ.setAttributeNS(null, "cy", svgHeight/2);
            occ.setAttributeNS(null, "r",  (svgWidth/2)-1);
            occ.setAttributeNS(null, "stroke", "#0180A3");
            occ.setAttributeNS(null, "fill-opacity", "0.0");
            occ.setAttributeNS(null, "fill", "none");
            $lightPies[i] = $(occ).appendTo('svg');

            // Clock Inner Circle
            var icc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            icc.setAttributeNS(null, "cx", svgWidth/2);
            icc.setAttributeNS(null, "cy", svgHeight/2);
            icc.setAttributeNS(null, "r",  svgWidth/2-6);
            icc.setAttributeNS(null, "stroke", "#0180A3");
            icc.setAttributeNS(null, "fill-opacity", "0.0");
            icc.setAttributeNS(null, "fill", "none");
            $lightPies[i] = $(icc).appendTo('svg');

            // Clock AM PM Text
            var PMT = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            PMT.setAttribute('x', 0);
            PMT.setAttribute('y', 15);
            PMT.setAttribute('font-size', "16px");
            PMT.setAttribute('fill', '#000');
            PMT.setAttribute('opacity', 0.5);
            PMT.setAttribute('font-family', 'Helvetica');
            PMT.textContent ="PM";
            $lightPies[i] = $(PMT).appendTo('svg');

            var PMB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            PMB.setAttribute('x', 0);
            PMB.setAttribute('y', svgHeight);
            PMB.setAttribute('font-size', "16px");
            PMB.setAttribute('fill', '#000');
            PMB.setAttribute('opacity', 0.5);
            PMB.setAttribute('font-family', 'Helvetica');
            PMB.textContent ="PM";
            $lightPies[i] = $(PMB).appendTo('svg');

            var AMT = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            AMT.setAttribute('x', svgWidth-30);
            AMT.setAttribute('y', 15);
            AMT.setAttribute('font-size', "16px");
            AMT.setAttribute('fill', '#000');
            AMT.setAttribute('opacity', 0.5);
            AMT.setAttribute('font-family', 'Helvetica');
            AMT.textContent ="AM";
            $lightPies[i] = $(AMT).appendTo('svg');

            var AMB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            AMB.setAttribute('x', svgWidth-30);
            AMB.setAttribute('y', svgHeight);
            AMB.setAttribute('font-size', "16px");
            AMB.setAttribute('fill', '#000');
            AMB.setAttribute('opacity', 0.5);
            AMB.setAttribute('font-family', 'Helvetica');
            AMB.textContent ="AM";
            $lightPies[i] = $(AMB).appendTo('svg');

            var dx = svgWidth/2;
            var dy = (svgHeight/2)-5;
            var dot = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            dot.setAttribute('font-size', "20px");
            dot.setAttribute('font-family', 'Helvetica');
            dot.setAttribute('fill', '#0180A3');
            dot.setAttribute('text-anchor', 'middle');
            dot.setAttribute('alignment-baseline', 'central');
            dot.setAttribute('transform', 'translate('+dx+','+dy+')');
            dot.textContent = ".";
            $lightPies[i] = $(dot).appendTo('svg');

            //circle radius line
            var ClockLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            ClockLine.setAttribute('x1', 150);
            ClockLine.setAttribute('y1', 150);
            ClockLine.setAttribute('x2', 150);
            ClockLine.setAttribute('y2', 0);
            ClockLine.setAttribute('style', "stroke:#0180A3");
            ClockLine.setAttribute('stroke-width', '1');
            $lightPies[i] = $(ClockLine).appendTo('svg');

            settings.beforeDraw.call($this);
            //Animation start
            triggerAnimation();

            //function for mouse event hover
            function pathMouseEnter(e) {
                var index = $(this).data().order;
                var lb = document.createElement('br');
                if(data[index].location!=null)
                {
                    $tip.text("Title:" + data[index].title).fadeIn(200);
                    $tip.append(lb);
                    $tip.append("Location:" + data[index].location).fadeIn(200);
                }
                else
                {
                    if(data[index].title!=0) {
                        $tip.text("Title:" + data[index].title).fadeIn(200);
                    }
                    else {
                        $tip.text("Title:" + "No Events Found").fadeIn(200);
                    }
                }
                if ($groups[index][0].getAttribute("data-active") !== "active") {
                    $lightPies[index].animate({
                        opacity: .8
                    }, 180);
                }
                settings.onPieMouseenter.apply($(this), [e, data]);
            }

            function pathMouseLeave(e) {
                var index = $(this).data().order;
                $tip.hide();
                if ($groups[index][0].getAttribute("data-active") !== "active") {
                    $lightPies[index].animate({
                        opacity: settings.lightPiesOpacity
                    }, 100);
                }
                settings.onPieMouseleave.apply($(this), [e, data]);
            }

            function pathMouseMove(e) {

                $tip.css({
                    top: e.pageY + settings.tipOffsetY,
                    left: e.pageX - $tip.width() / 2 + settings.tipOffsetX
                });
            }

            function pathClick(e) {
                var index = $(this).data().order;
                var targetGroup = $groups[index][0];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (i === index) continue;
                    $groups[i][0].setAttribute("data-active", "");
                    $lightPies[i].css({
                        opacity: settings.lightPiesOpacity
                    });
                }
                if (targetGroup.getAttribute("data-active") === "active") {
                    targetGroup.setAttribute("data-active", "");
                    $lightPies[index].css({
                        opacity: .8
                    });
                } else {
                    targetGroup.setAttribute("data-active", "active");
                    $lightPies[index].css({
                        opacity: 1
                    });
                }
                settings.onPieClick.apply($(this), [e, data]);
            }
            /*****************************************************************************************************/
            function drawPieSegments(animationDecimal) {
                //var startRadius = -PI/2,//-90 degree
                //var startRadius = (data[0].value-90) * Math.PI / 180.0,//-90 degree
                rotateAnimation = 1;
                if (settings.animation) {
                    rotateAnimation = animationDecimal; //count up between0~1
                }
                $pathGroup[0].setAttribute("opacity", animationDecimal);
                //draw each path
                for (var i = 0, len = data.length; i < len; i++) {
                    var startRadius = (data[i].start - 90) * Math.PI / 180.0, //-90 degree
                        endRadius = (data[i].end - 90) * Math.PI / 180.0,
                        largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0,
                        startX = centerX + cos(startRadius) * pieRadius,
                        startY = centerY + sin(startRadius) * pieRadius,
                        endX = centerX + cos(endRadius) * pieRadius,
                        endY = centerY + sin(endRadius) * pieRadius,
                        startX2 = centerX + cos(startRadius) * (pieRadius + settings.lightPiesOffset),
                        startY2 = centerY + sin(startRadius) * (pieRadius + settings.lightPiesOffset),
                        endX2 = centerX + cos(endRadius) * (pieRadius + settings.lightPiesOffset),
                        endY2 = centerY + sin(endRadius) * (pieRadius + settings.lightPiesOffset);
                    var cmd = ['M', startX, startY, //Move pointer
                        'A', pieRadius, pieRadius, 0, largeArc, 1, endX, endY, //Draw outer arc path
                        'L', centerX, centerY, //Draw line to the center.
                        'Z' //Cloth path
                    ];
                    var cmd2 = ['M', startX2, startY2, 'A', pieRadius + settings.lightPiesOffset, pieRadius + settings.lightPiesOffset, 0, largeArc, 1, endX2, endY2, //Draw outer arc path
                        'L', centerX, centerY, 'Z'
                    ];
                    $pies[i][0].setAttribute("d", cmd.join(' '));
                    $lightPies[i][0].setAttribute("d", cmd2.join(' '));
                    //startRadius += segmentAngle;
                    //startRadius = (data[i].value-90) * Math.PI / 180.0;
                }
            }

            /*****************************************************************************************************/
            var animFrameAmount = (settings.animation) ? 1 / settings.animationSteps : 1, //if settings.animationSteps is 10, animFrameAmount is 0.1
                animCount = (settings.animation) ? 0 : 1;

            function triggerAnimation() {
                if (settings.animation) {
                    requestAnimFrame(animationLoop);
                } else {
                    drawPieSegments(1);
                }
            }

            function animationLoop() {
                animCount += animFrameAmount; //animCount start from 0, after "settings.animationSteps"-times executed, animCount reaches 1.
                drawPieSegments(easingFunction(animCount));
                if (animCount < 1) {
                    requestAnimFrame(arguments.callee);
                } else {
                    settings.afterDrawed.call($this);
                }
            }

            function Max(arr) {
                return Math.max.apply(null, arr);
            }

            function Min(arr) {
                return Math.min.apply(null, arr);
            }
            return $this;
        };
    })(jQuery);
});


//Mouse Click for Event Edit
$(document).on('click','.pieSegmentGroup',function(){
    var eid = $(this).attr('event-id');
    if(eid>0)
    {
        var url = "newevent.html?module=create_event&type=day&event_id=" + eid;
        //alert(url);
        document.write("<span style='display:none;'>" + url + "<\/span>");
        window.location.assign(url);
        //$(location).attr('href',url);
    }
    else
    {
        alert("No Events Found..!");
    }
});


