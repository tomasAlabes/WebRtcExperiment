define(["jquery", "app/imageUtils"], function($, imageUtils){
    "use strict";

    window.URL = window.URL || window.webkitURL;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var intervalForReading;
    var onFailSoHard = function (e) {
        $('#instructions').hide();
        $('#webcam').hide();
        $('#sorryMsg').show();
    };

    var video = $('video')[0];
    var canvas = $('canvas')[0];
    var localMediaStream = null;

    function clearUI() {
        $("video, #stop-button, #cameraInstructions").fadeOut(1000);
        $("#ghostCanvas").hide();
        //If no photo was taken, hide canvas
        var $photoCanvas = $("#photoCanvas");
        if (!$photoCanvas.data("photoTaken")) {
            $photoCanvas.hide();
        }
        $("#shadow").css('opacity', 0);
        $('#webcam').removeClass('container_2');
        $('.grid_1').removeClass('grid_1');
    }

    function stopWebCam(){
        clearUI();
        clearInterval(intervalForReading);
        video.pause();
        localMediaStream.stop();
    }

    function snapshot($canvas) {
        var canvas = $canvas[0];

        if (localMediaStream) {
            var canvasContext = canvas.getContext('2d');
            canvasContext.drawImage(video, 0, 0, 440, 320);
            $canvas.data("photoTaken", true);
        }
    }

    function startReading(){
        var $ghostCanvas = $('#ghostCanvas');
        intervalForReading = setInterval(function(){
            ghostSnapshot($ghostCanvas);
            if (imageUtils.darkyImage($ghostCanvas[0])) {
                stopWebCam();
                $(video).fadeOut(1000);
                $("$ghostCanvas").hide();
                var $photoCanvas = $("#photoCanvas");
                if (!$photoCanvas.data("photoTaken")) {
                    $photoCanvas.hide();
                }
                clearInterval(intervalForReading);
                $("#congratsMessage").fadeIn(1000);
                $('#stop-button').fadeOut(500);
            }
        }, 1000);
    }

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, function (stream) {
            $('video').show();
            video.src = window.URL.createObjectURL(stream);

            localMediaStream = stream;

            startReading();
            $('video, #photoCanvas, #stop-button, #cameraInstructions').fadeIn(500);

        }, onFailSoHard);
    } else {
        $('#sorryMsg').
            text('getUserMedia() is not supported in your browser. See here where you can see this demo: <a href="http://caniuse.com/#feat=stream">here.</a>').
            fadeIn(500);
    }

    video.addEventListener('click', function () {
        $('#cameraSide, #photoSide').addClass('grid_1');
        snapshot($('#photoCanvas'));
        if($(".photoInstructions").is(":hidden")){
            $(".photoInstructions").show();
        }
    }, false);

    $('#stop-button').click(function () {
        if($(".photoInstructions").is(":hidden")){
            snapshot($('#photoCanvas'));
            $(".photoInstructions").show();
        }
        stopWebCam();
        $("#congratsMessage").text("Manually stopped").fadeIn(500);
        $('#instructions').hide();
    });

});