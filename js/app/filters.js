require(["jquery"], function($){
    var idx = 0;
    var filters = ['grayscale', 'sepia', 'blur', 'opacity', 'contrast', 'brightness', 'invert', 'saturate', ''];

    function changeFilter(e) {
        var el = e.target;
        el.className = '';
        var effect = filters[idx++ % filters.length]; // loop through filters.
        if (effect) {
            el.classList.add(effect);
        }else{
            effect = "none";
        }
        $('#currentFilter').text("Current filter: " + effect);
    }

    $('#photoCanvas').on('click', changeFilter);
});
