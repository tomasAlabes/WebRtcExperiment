define(["jquery", "app/imageUtils"], function($, imageUtils){
    "use strict";

    window.URL = window.URL || window.webkitURL;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var onFailSoHard = function (e) {
        console.log('Reeeejected!', e);
    };

    var video = $('video')[0];
    var canvas = $('canvas')[0];
    var localMediaStream = null;

    function stopWebCam(){
        video.pause();
        localMediaStream.stop();
        $('video, #stop-button, #cameraInstructions').fadeOut(1000);
        $("#ghostCanvas").hide();
        var $photoCanvas = $("#photoCanvas");
        if (!$photoCanvas.data("photoTaken")) {
            $photoCanvas.hide();
        }
        $("#shadow").css('opacity', 0);
        $('#webcam').removeClass('container_2');
        $('.grid_1').removeClass('grid_1');
        $("#congratsMessage").text("Manually stopped").fadeIn(500);
        //ugly hack, correct it
        clearInterval(0);
        clearInterval(1);
        clearInterval(2);
    }

    function snapshot(canvas) {
        if (localMediaStream) {
            var canvasContext = canvas.getContext('2d');
            canvasContext.drawImage(video, 0, 0, 440, 320);
        }
    }

    function startReading(){
        var ghostCanvas = $('#ghostCanvas')[0];
        var intervalId = setInterval(function(){
            snapshot(ghostCanvas);
            if (imageUtils.darkyImage(ghostCanvas)) {
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

            startReading();
            $('#stop-button, #cameraInstructions').fadeIn(500);

        }, onFailSoHard);
    } else {
        alert('getUserMedia() is not supported in your browser');
    }

    video.addEventListener('click', function () {
        var $photoCanvas = $('#photoCanvas');
        snapshot($photoCanvas[0]);
        $photoCanvas.data("photoTaken", true);
        if($(".photoInstructions").is(":hidden")){
            $(".photoInstructions").show();
        }
    }, false);

    $('#stop-button').click(stopWebCam);

});