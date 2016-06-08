// Settings
var e621 = {
	settings: {
		queryURL: "https://e621.net/post/index.json?limit=1&page=1&tags=gay+type:webm+-mlp+order:random&callback=?",
		maxSTime: 10,
		maxLoops: 10
	},

	data: {
		videoTag: null,
		curLoop: 0,
		curTime: 0
	}
};

// Global Var on Settings
var videoTag;
var eSet = e621.settings, eData = e621.data;

function e621_mainInit()
{
	eData.videoTag = $("video");

	videoTag = eData.videoTag;
	videoTag.on("ended", e621_triggerVideoQueue);
	videoTag.on("loadedmetadata", e621_onVideoData);
	videoTag.on("timeupdate", e621_onVideoTimeUpdate);

	$("#bypass").bind("click", function() {
		videoTag[0].play();
	});

	e621_triggerVideoQueue(true);

	console.log("Hey kid, wanna yiff -me-? JS Successfully Initialized!")
}

function e621_triggerVideoQueue(skip) {
	if (typeof skip === "undefined") { skip = false }

	if ( (eData.curTime >= eSet.maxSTime) || (eData.curLoop >= eSet.maxLoops) || (skip == true) ) {
		$.ajax({
			dataType: "jsonp",
			url: eSet.queryURL,
			success: e621_onSuccess
		});
	} else {
		e621_onVideoData(false);

		videoTag[0].play();
	}
}

function e621_onSuccess(data, status, jqXHR) {
	var e621_jsonData = data[0];
	var e621_postURL = "http://e621.net/post/show/" + e621_jsonData.id;

	// Change the attributes and text.
	videoTag.attr({"src": e621_jsonData.file_url});
	$("a#e621url").attr({"href": e621_postURL}).text(e621_postURL);

	// HTML5 Mobile Bypass
	// videoTag[0].play();
	// $("#bypass").trigger("click");
}

function e621_onVideoData(override) {
	if (typeof override === "undefined") { override = true }

	if (override) {
		eData.curLoop = 0;
		eData.curTime = videoTag[0].duration;
	} else {
		eData.curLoop += 1;
		eData.curTime += videoTag[0].duration;
	}

	$("#loopsleft").text(eSet.maxLoops - eData.curLoop);
	$("#durtime").text(videoTag[0].duration);

	console.log( "Loop: " + eData.curLoop );
	console.log( "Cur Time Loop: " + eData.curTime );
}

function e621_onVideoTimeUpdate() {
	$("#curtime").text(videoTag[0].currentTime);
}

$(document).ready(e621_mainInit);