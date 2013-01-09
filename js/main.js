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
        console.log(rgba[0]+' '+rgba[1]+' '+rgba[2]);
        return (rgba[0] < 80 && rgba[1] < 80 && rgba[2] < 80);
    }

    function stopWebCam(){
        video.pause();
        localMediaStream.stop();
    }

    function snapshot() {
        if (localMediaStream) {

            //if (video.width != 0) { //hack
                ctx.drawImage(video, 0, 0);
                var image = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1);

                if (darkyPixel(image.data)) {
                    stopWebCam();
                    $(video).remove();
                    clearInterval(1);
                    $("#congratsMessage").show();
                }
            //}


            // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
            //document.querySelector('img').src = canvas.toDataURL('image/webp');
        }
    }

    if (navigator.getUserMedia) {

        navigator.getUserMedia({video: true}, function (stream) {
            video.src = window.URL.createObjectURL(stream);

            localMediaStream = stream;

            setInterval(snapshot, 500);


        }, onFailSoHard);
    } else {
        alert('getUserMedia() is not supported in your browser');
    }

//video.addEventListener('click', snapshot, false);

    /*$('#stop-button').click(function () {
     stopWebCam();
     });*/


});
