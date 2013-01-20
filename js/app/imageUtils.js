define({
    darkyPixel: function (rgba) {
        //console.log(rgba[0]+' '+rgba[1]+' '+rgba[2]);

        var offColor = 20,
            darkColor = 45,
            greyColor = 70,
            lightGreyColor = 100;

        var redOffset = 25;
        if ((rgba[0] < offColor + redOffset && rgba[1] < offColor && rgba[2] < offColor)) {
            //console.log('offColor');
            $("#shadow").css('opacity', 0);
            return true;
        } else if ((rgba[0] < darkColor + redOffset && rgba[1] < darkColor && rgba[2] < darkColor)) {
            //console.log('darkColor');
            $("#shadow").css('opacity', 0.9);
        } else if ((rgba[0] < greyColor + redOffset && rgba[1] < greyColor && rgba[2] < greyColor)) {
            //console.log('greyColor');
            $("#shadow").css('opacity', 0.4);
        } else if ((rgba[0] < lightGreyColor + redOffset && rgba[1] < lightGreyColor && rgba[2] < lightGreyColor)) {
            //console.log('lightGreyColor');
            $("#shadow").css('opacity', 0.2);
        } else {
            $("#shadow").css('opacity', 0);
        }
        return false;
    },

    darkyImage: function (canvas) {
        var canvasContext = canvas.getContext('2d'),
            i, j,
            x, y,
            image, data;

        for (i = 1; i < 3; i++) {
            for (j = 1; j < 3; j++) {
                x = canvas.width / j - 1;
                y = canvas.height / i - 1;
                //console.log("x: "+ x + ', y: '+ y);
                image = canvasContext.getImageData(x, y, 1, 1);
                data = image.data;
                //console.log("analyzing point: " + data[0] + ' '+ data[1] + ' '+ data[2]);
                if (!this.darkyPixel(data)) {
                    return false;
                }
            }
        }
        return true;
    }
});