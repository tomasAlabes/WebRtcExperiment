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
        var colorLimit = 120;
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
            canvasContext.drawImage(video, 0, 0);

                /*if (darkyImage(canvas)) {
                    stopWebCam();
                    $(video).remove();
                    clearInterval(intervalId);
                    $("#congratsMessage").show();
                }*/
            //}


            // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
            //document.querySelector('img').src = canvas.toDataURL('image/webp');
        }
    }

    function startReading(){
        var ghostCanvas = $('#ghostCanvas')[0];
        var intervalId = setInterval(function(){
            snapshot(ghostCanvas);
            if (darkyImage(ghostCanvas)) {
                stopWebCam();
                $(video).remove();
                clearInterval(intervalId);
                $("#congratsMessage").show();
            }
        }, 1000);
    }

    if (navigator.getUserMedia) {

        navigator.getUserMedia({video: true}, function (stream) {
            video.src = window.URL.createObjectURL(stream);

            localMediaStream = stream;

            startReading();

        }, onFailSoHard);
    } else {
        alert('getUserMedia() is not supported in your browser');
    }

video.addEventListener('click', function(){
    snapshot($('#photoCanvas')[0]);
}, false);

    /*$('#stop-button').click(function () {
     stopWebCam();
     });*/


});
