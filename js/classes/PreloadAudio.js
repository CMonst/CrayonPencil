// must have a .mp3 and a .ogg for the same file for cross platform comptability
// NOTE files are add without extension and the .oggand .mp3 will be concatinated to them
function AudioLoader(filesArray)
{
    this.filesArray = filesArray;
    this.filesLeft = this.filesArray.length;
    this.browserSupport = getAudioSupport();
    this.audioArray = [];
    var obj = this;
    
    function onProgress()
    {
        console.log('file loaded, ' + this.filesLeft + ' left');
    };
    this.onNoSupport = function()
    {
        console.log('this broswer doesn\'t support audio tags please provide a handler for this function');
    };
    this.onComplete = function()
    {
        console.log('finished loading all audio please support a handler for this function');
    };
    
    this.load = function()
    {
        if (this.browserSupport === 'none')
            this.onNoSupport();
        else
        {
            for (var i = 0; i < this.filesArray.length; i++)
            {
                var audio = new Audio();
                audio.src = this.filesArray[i] + '.' + this.browserSupport;
                audio.preload = "auto";
                $(audio).on("loadeddata", this.FileFinished);
                this.audioArray.push(audio);
            }
        }
    };
    
    //private methods

    //returns the extension that the browser supports
    function getAudioSupport()
    {
        var a = document.createElement('audio');
        var ogg = !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
        if (ogg)
            return 'ogg';
        var mp3 = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
        if (mp3)
            return 'mp3';
        else
            return 'none';
    }


    this.FileFinished = function()
    {
        --obj.filesLeft;
        //obj.onProgress();
        obj.onProgress();
        if (obj.filesLeft === 0)
            obj.onComplete();
    };
}
