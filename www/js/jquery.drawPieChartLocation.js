;(function($, undefined) {
	//function for draw PieChart
	$.fn.drawPieChartLocation = function(data, options) {
		console.log(data);
/*        var dataLoc = {
            "User_id": localStorage.getItem("User_id"),
            "token": localStorage.getItem("token"),
            "currentDate": currentDate
        };
        dataLoc = JSON.stringify(dataLoc);
        service.operationDataService('getDataLocation', dataLoc, function(dataLoc) {
        console.log(dataLoc.data[0].wheelEvents);
        });*/
		var $this = this,
			W = 250,//$this.width(),
			H = 250,//$this.height(),
			centerX = W/2,
			centerY = H/2,
			cos = Math.cos,
			sin = Math.sin,
			PI = Math.PI,
			settings = $.extend({
				segmentShowStroke : true,
				segmentStrokeColor : "#fff",
				segmentStrokeWidth : 1,
				baseColor: "#fff",
				baseOffset: 15,
				edgeOffset: 30,//offset from edge of $this
				pieSegmentGroupClass: "pieSegmentGroupL",
				pieSegmentClass: "pieSegmentL",
				lightPiesOffset: 12,//lighten pie's width
				lightPiesOpacity: .3,//lighten pie's default opacity
				lightPieClass: "lightPieL",
				animation : true,
				animationSteps : 90,
				animationEasing : "easeInOutExpo",
				tipOffsetX: -15,
				tipOffsetY: -45,
				tipClass: "pieTipL",
				beforeDraw: function(){  },
				afterDrawed : function(){  },
				onPieMouseenter : function(e,data){  },
				onPieMouseleave : function(e,data){  },
				onPieClick : function(e,data){  }
			}, options),
			animationOptions = {
				linear : function (t){
					return t;
				},
				easeInOutExpo: function (t) {
					var v = t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
					return (v>1) ? 1 : v;
				}
			},
			requestAnimFrame = function(){
				return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function(callback) {
						window.setTimeout(callback, 1000 / 60);
					};
			}();
		// create svg chart
		var $wrapper = $('<svg class="dayWheelLocation" id="chart" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>').appendTo($this);
		var $groups = [],
			$pies = [],
			$lightPies = [],
			easingFunction = animationOptions[settings.animationEasing],
			pieRadius = Min([H/2,W/2]) - settings.edgeOffset+19,//svg pie radius
			segmentTotal = 0;

		//Draw base circle
		var drawBasePie = function(){
			var base = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			var $base = $(base).appendTo($wrapper);
			base.setAttribute("cx", centerX);
			base.setAttribute("cy", centerY);
			base.setAttribute("r", pieRadius+settings.baseOffset);
			base.setAttribute("fill", settings.baseColor);
		}();

		//Set up pie segments wrapper
		var pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		var $pathGroup = $(pathGroup).appendTo($wrapper);
		$pathGroup[0].setAttribute("opacity",0);

		//Set up tooltip
		var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('#pieChartLocation').hide(),
			tipW = $tip.width(),
			tipH = $tip.height();

		for (var i = 0, len = data.length; i < len; i++){

			// label function
			var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			g.setAttribute("data-order", i);
			g.setAttribute("location-id", data[i].id);
			g.setAttribute("class", settings.pieSegmentGroupClass);
			$groups[i] = $(g).appendTo($pathGroup);
			$groups[i]
				.on("mouseenter", pathMouseEnter)
				.on("mouseleave", pathMouseLeave)
				.on("mousemove", pathMouseMove)
				.on("click", pathClick);

			var svgWidth  =   250;//$('.dayWheelLocation').width();

			var svgHeight  =  250;// $('.dayWheelLocation').height();

			var lstart =Math.round(data[i].start);
			var lsend =Math.round(data[i].end);
			var txtAng=(lstart+(lsend-lstart)/2);

			txtAng = Math.ceil(txtAng,-2);
			var rad = (txtAng-90)*Math.PI/180;//(data[i].start - 90) * Math.PI / 180.0,
			var r = svgWidth/2-50;
			var lx= (svgWidth/2)+(r * Math.cos(rad));
			var ly= (svgWidth/2)+(r * Math.sin(rad));

			if(txtAng<180) txtAng -= 90; else txtAng += 90;

			var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			label.setAttribute('font-size', "10px");
			label.setAttribute('font-family', 'Helvetica');
			label.setAttribute('fill', '#000');
			label.setAttribute('text-anchor', 'middle');
			label.setAttribute('alignment-baseline', 'central');
			label.setAttribute('transform', 'translate('+lx+','+ly+')rotate('+txtAng+')');
			if(data.length==1) {
                if (data[0].location == null) {
                    label.textContent = 'No Location Found';
                }
                else {
                    var str = data[i].location;
                    console.log(data[i].location);
                    if (str.length >= 15) {
                        str = str.substring(0, 15) + "...";
                    }
                    else {
                        str = data[i].location;
                    }
                    label.textContent = str;
                }
            }
			else
			{
				var str = data[i].location;
				console.log(data[i].location);
				if(str.length >= 15) {str = str.substring(0,15)+"...";}
				else
					{
						str = data[i].location;
					}
				label.textContent = str;
			}
			$lightPies[i] = $(label).appendTo($groups[i]);

			// label Path function
			var lp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			lp.setAttribute("stroke-width", settings.segmentStrokeWidth);
			lp.setAttribute("stroke", settings.segmentStrokeColor);
			lp.setAttribute("stroke-miterlimit", 2);
			lp.setAttribute("fill","grey");
			lp.setAttribute("opacity", settings.lightPiesOpacity);
			lp.setAttribute("class", settings.lightPieClass);
			$lightPies[i] = $(lp).appendTo($groups[i]);


		}



		// Clock Designs function
		// clock hours
		var time=[1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12];
		var timeAngle=[15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345,360];
		for(var t=0;t<=(time.length)-1;t++) {
			var svgWidth = $('.dayWheelLocation').width();
			var svgHeight = $('.dayWheelLocation').height();
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
			$lightPies[i] = $(timeSvg).appendTo('.dayWheelLocation');
		}



		// Clock outer Circle
		var occ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		occ.setAttributeNS(null, "cx", svgWidth/2);
		occ.setAttributeNS(null, "cy", svgHeight/2);
		occ.setAttributeNS(null, "r",  ((svgWidth/2)-1));
		occ.setAttributeNS(null, "stroke", "#0180A3");
		occ.setAttributeNS(null, "fill-opacity", "0.0");
		occ.setAttributeNS(null, "fill", "none");
		$lightPies[i] = $(occ).appendTo('.dayWheelLocation');

		// Clock Inner Circle
		var icc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		icc.setAttributeNS(null, "cx", svgWidth/2);
		icc.setAttributeNS(null, "cy", svgHeight/2);
		icc.setAttributeNS(null, "r",  svgWidth/2-6);
		icc.setAttributeNS(null, "stroke", "#0180A3");
		icc.setAttributeNS(null, "fill-opacity", "0.0");
		icc.setAttributeNS(null, "fill", "none");
		$lightPies[i] = $(icc).appendTo('.dayWheelLocation');


		// Clock AM PM Text
		var PMT = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		PMT.setAttribute('x', 0);
		PMT.setAttribute('y', 15);
		PMT.setAttribute('font-size', "16px");
		PMT.setAttribute('fill', '#000');
		PMT.setAttribute('opacity', 0.7);
		PMT.setAttribute('font-family', 'Helvetica');
		PMT.textContent ="PM";
		$lightPies[i] = $(PMT).appendTo('.dayWheelLocation');

		var PMB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		PMB.setAttribute('x', 0);
		PMB.setAttribute('y', svgHeight);
		PMB.setAttribute('font-size', "16px");
		PMB.setAttribute('fill', '#000');
		PMB.setAttribute('opacity', 0.7);
		PMB.setAttribute('font-family', 'Helvetica');
		PMB.textContent ="PM";
		$lightPies[i] = $(PMB).appendTo('.dayWheelLocation');

		var AMT = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		AMT.setAttribute('x', svgWidth-30);
		AMT.setAttribute('y', 15);
		AMT.setAttribute('font-size', "16px");
		AMT.setAttribute('fill', '#000');
		AMT.setAttribute('opacity', 0.7);
		AMT.setAttribute('font-family', 'Helvetica');
		AMT.textContent ="AM";
		$lightPies[i] = $(AMT).appendTo('.dayWheelLocation');

		var AMB = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		AMB.setAttribute('x', svgWidth-30);
		AMB.setAttribute('y', svgHeight);
		AMB.setAttribute('font-size', "16px");
		AMB.setAttribute('fill', '#000');
		AMB.setAttribute('opacity', 0.7);
		AMB.setAttribute('font-family', 'Helvetica');
		AMB.textContent ="AM";
		$lightPies[i] = $(AMB).appendTo('.dayWheelLocation');

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
		$lightPies[i] = $(dot).appendTo('.dayWheelLocation');

		//circle radius line
		var ClockLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		ClockLine.setAttribute('x1', 125);
		ClockLine.setAttribute('y1', 125);
		ClockLine.setAttribute('x2', 125);
		ClockLine.setAttribute('y2', 0);
		ClockLine.setAttribute('style', "stroke:#0180A3");
		ClockLine.setAttribute('stroke-width', '1');
		$lightPies[i] = $(ClockLine).appendTo('.dayWheelLocation');

		settings.beforeDraw.call($this);
		//Animation start
		triggerAnimation();

		//Event hover function
		function pathMouseEnter(e){
			var index = $(this).data().order;
			if(data[index].location!=null)
			{
				$tip.text("Location:" + data[index].location).fadeIn(200);
			}
			else
			{
				$tip.text("location:" + "No Location Found").fadeIn(200);
			}
			if ($groups[index][0].getAttribute("data-active") !== "active"){
				$lightPies[index].animate({opacity: .8}, 180);
			}
			settings.onPieMouseenter.apply($(this),[e,data]);
		}
		function pathMouseLeave(e){
			var index = $(this).data().order;
			$tip.hide();
			if ($groups[index][0].getAttribute("data-active") !== "active"){
				$lightPies[index].animate({opacity: settings.lightPiesOpacity}, 100);
			}
			settings.onPieMouseleave.apply($(this),[e,data]);
		}
		function pathMouseMove(e){
			var pieWidth = $('.pieContainerL').width();
			var pieHeight = $('.pieContainerL').height();
		}
		function pathClick(e){
			var index = $(this).data().order;
			var targetGroup = $groups[index][0];
			for (var i = 0, len = data.length; i < len; i++){
				if (i === index) continue;
				$groups[i][0].setAttribute("data-active","");
				$lightPies[i].css({opacity: settings.lightPiesOpacity});
			}
			if (targetGroup.getAttribute("data-active") === "active"){
				targetGroup.setAttribute("data-active","");
				$lightPies[index].css({opacity: .8});
			} else {
				targetGroup.setAttribute("data-active","active");
				$lightPies[index].css({opacity: 1});
			}
			settings.onPieClick.apply($(this),[e,data]);
		}
		function drawPieSegments (animationDecimal){
			rotateAnimation = 1;
			if (settings.animation) {
				rotateAnimation = animationDecimal;//count up between0~1
			}

			$pathGroup[0].setAttribute("opacity",animationDecimal);
			//draw each path
			for (var i = 0, len = data.length; i < len; i++){
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
				var cmd = [
					'M', startX, startY,//Move pointer
					'A', pieRadius, pieRadius, 0, largeArc, 1, endX, endY,//Draw outer arc path
					'L', centerX, centerY,//Draw line to the center.
					'Z'//Cloth path
				];
				var cmd2 = [
					'M', startX2, startY2,
					'A', pieRadius + settings.lightPiesOffset, pieRadius + settings.lightPiesOffset, 0, largeArc, 1, endX2, endY2,//Draw outer arc path
					'L', centerX, centerY,
					'Z'
				];

				//$pies[i][0].setAttribute("d",cmd.join(' '));
				$lightPies[i][0].setAttribute("d", cmd2.join(' '));
				//startRadius += segmentAngle;
			}
		}

		var animFrameAmount = (settings.animation)? 1/settings.animationSteps : 1,//if settings.animationSteps is 10, animFrameAmount is 0.1
			animCount =(settings.animation)? 0 : 1;
		function triggerAnimation(){
			if (settings.animation) {
				requestAnimFrame(animationLoop);
			} else {
				drawPieSegments(1);
			}
		}
		function animationLoop(){
			animCount += animFrameAmount;//animCount start from 0, after "settings.animationSteps"-times executed, animCount reaches 1.
			drawPieSegments(easingFunction(animCount));
			if (animCount < 1){
				requestAnimFrame(arguments.callee);
			} else {
				settings.afterDrawed.call($this);
			}
		}
		function Max(arr){
			return Math.max.apply(null, arr);
		}
		function Min(arr){
			return Math.min.apply(null, arr);
		}
		return $this;


	};
})(jQuery);

//////////Mouse Click for Event Edit///////////////

$(document).on('click','.pieSegmentGroupL',function(){
	var location = $(this).attr('location-id');
    if(location=='0')
	{
		alert("No Location found..! ")
	}
	else {
        var url = "newevent.html?module=create_location&type=loc&lid=" + location;
        document.write("<span style='display:none;'>" + url + "<\/span>");
        window.location.assign(url);
    }
});


//////////////////////////////////////////////////////
