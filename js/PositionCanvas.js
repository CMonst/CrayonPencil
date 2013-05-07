previousWidth = 0;
previousHeight = 0;

jQuery(function()
{
    FixAppPos();
    setInterval(FixAppPos, 50);
});

function FixAppPos()
{
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    if (windowHeight === previousHeight && windowWidth === previousWidth)
        return;

    previousHeight = windowHeight;
    previousWidth = windowWidth;

    if (windowHeight / canvasHeight < windowWidth / canvasWidth)
    {
        $('canvas').css('height', '100%');
        $('canvas').css('width', 'auto');
        var leftMargin = ((windowWidth - ($('canvas').width())) / 2);
        $('canvas').css('left', leftMargin);
        $('canvas').css('top', 0);
    }
    else
    {
        $('canvas').css('height', 'auto');
        $('canvas').css('width', '100%');
        var topMargin = ((windowHeight - ($('canvas').height())) / 2);
        $('canvas').css('top', topMargin);
        $('canvas').css('left', 0);
    }

}