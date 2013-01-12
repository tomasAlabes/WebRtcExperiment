$(document).ready(function(){

    "use strict";

    window.URL = window.URL || window.webkitURL;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var onFailSoHard = function (e) {
        console.log('Reeeejected!', e);
    };

    var video = $('video')[0];
    var canvas = $('canvas')[0];
    var ctx = canvas.getContext('2d');
    var localMediaStream = null;


    function darkyPixel(rgba){
        //console.log(rgba[0]+' '+rgba[1]+' '+rgba[2]);
        var colorLimit = 40;
        return (rgba[0] < colorLimit && rgba[1] < colorLimit && rgba[2] < colorLimit);
    }

    function darkyImage(canvas){
        var canvasContext = canvas.getContext('2d'),
            i, j,
            x, y,
            image, data;

        for(i = 1; i<3; i++){
            for(j = 1; j<3; j++){
                x = canvas.width/ j - 1;
                y = canvas.height/i - 1;
                //console.log("x: "+ x + ', y: '+ y);
                image = canvasContext.getImageData(x, y, 1, 1);
                data = image.data;
                //console.log("analyzing point: " + data[0] + ' '+ data[1] + ' '+ data[2]);
                if(!darkyPixel(data)){
                    return false;
                }
            }
        }
        return true;
    }

    function stopWebCam(){
        video.pause();
        localMediaStream.stop();
    }

    function snapshot(canvas) {
        if (localMediaStream) {
            //if (video.width != 0) { //hack for normal chrome

                var canvasContext = canvas.getContext('2d');
                canvasContext.drawImage(video, 0, 0, 320, 240);

            //}
        }
    }

    function startReading(){
        var ghostCanvas = $('#ghostCanvas')[0];
        var intervalId = setInterval(function(){
            snapshot(ghostCanvas);
            if (darkyImage(ghostCanvas)) {
                stopWebCam();
                $(video).fadeOut(1000);
                $("ghostCanvas").hide();
                var $photoCanvas = $("#photoCanvas");
                if (!$photoCanvas.data("photoTaken")) {
                    $photoCanvas.hide();
                }
                clearInterval(intervalId);
                $("#congratsMessage").fadeIn(1000);
                $('#stop-button').fadeOut(500);
            }
        }, 1000);
    }

    if (navigator.getUserMedia) {

        navigator.getUserMedia({video: true}, function (stream) {
            video.src = window.URL.createObjectURL(stream);

            localMediaStream = stream;

            $('#stop-button').fadeIn(500);
            startReading();

        }, onFailSoHard);
    } else {
        alert('getUserMedia() is not supported in your browser');
    }

    video.addEventListener('click', function () {
        var $photoCanvas = $('#photoCanvas');
        snapshot($photoCanvas[0]);
        $photoCanvas.data("photoTaken", true);
    }, false);

    $('#stop-button').click(function () {
        stopWebCam();
        $(video).fadeOut(1000);
        $("#ghostCanvas").hide();
        var $photoCanvas = $("#photoCanvas");
        if (!$photoCanvas.data("photoTaken")) {
            $photoCanvas.hide();
        }
        $('#stop-button').fadeOut(1000);
        clearInterval(1);
        $("#congratsMessage").text("Manually stopped").fadeIn(500);
    });


});
