function LoadingLevel(imagesToLoad, audioToLoad)
{
    //load loading screen components :D
    this.loadingLevelFrames = [bgTileFrameName, loading_screenFrameName, pencilFrameName];
    this.loader = new PIXI.AssetLoader(this.loadingLevelFrames);
    //this.loader.onProgress = this.loadingProgress;
    var obj = this;
    var finishedLoading = false;
    var calledEnd = false;
    this.pencil;
    var loading_screen;
    //when loading screen is finished loading (inception ^^)
    this.LoadingLevelLoaded = function()
    {
        loading_screen = new PIXI.Sprite.fromFrame(loading_screenFrameName);
        loading_screen.anchor.x = 0.5;
        loading_screen.anchor.y = 0.5;
        loading_screen.position.x = 345;
        loading_screen.position.y = 326;

        //load first tile to get dimensions
        var tile = PIXI.Sprite.fromFrame(bgTileFrameName);
        //tiles to cover the screen + one extra tile to slide in
        nTiles = Math.ceil(canvasHeight / tile.height) + 1;
        //make the anchor at top to check when it's completely out 
        tile.anchor.x = 0;
        tile.anchor.y = 0;
        //position this first tile at the top left
        tile.position.x = 0;
        tile.position.y = 0;
        bgTiles.push(tile);

        obj.pencil = PIXI.Sprite.fromFrame(pencilFrameName);
        obj.pencil.anchor.x = 0.5;
        obj.pencil.anchor.y = 0.5;
        obj.pencil.position.x = loading_screen.position.x - loading_screen.width / 2 + 17;
        obj.pencil.position.y = loading_screen.position.y + loading_screen.height - 10;

        //push the other tiles
        for (var i = 0; i < nTiles - 1; i++)
        {
            tile = PIXI.Sprite.fromFrame(bgTileFrameName);
            tile.anchor.x = 0;
            tile.anchor.y = 0;
            //position this first tile at the top left
            tile.position.x = 0;
            tile.position.y = tile.height * (i + 1);
            bgTiles.push(tile);
        }

        //add objects to the stage
        for (var i = 0; i < nTiles; i++)
            stage.addChild(bgTiles[i]);

        stage.addChild(loading_screen);

        stage.addChild(obj.pencil);

        obj.audioPreloader.onProgress = obj.GameAssetsProgress;
        obj.audioPreloader.onComplete = obj.GameAssetsLoaded;

        obj.loader = new PIXI.AssetLoader(imagesToLoad);
        obj.loader.onProgress = obj.GameAssetsProgress;
        obj.loader.onComplete = obj.GameAssetsLoaded;

        obj.audioPreloader.load();
        obj.loader.load();
    };

    this.loader.onComplete = this.LoadingLevelLoaded;
    this.loader.load();
    this.totalGameAssets = imagesToLoad.length + audioToLoad.length;
    this.assetsLeft = this.totalGameAssets;
    this.audioPreloader = new AudioLoader(audioToLoad);


    //function loadingProgress()
    //{
    //    console.log(obj.totalGameAssets);
    //}

    //when a game asset is loaded
    this.GameAssetsProgress = function()
    {
        var loadingAreaWidth = 270;
        obj.assetsLeft--;
        obj.pencil.position.x += loadingAreaWidth / obj.totalGameAssets;
        //console.log(obj.totalGameAssets--);
    };

    //when a all game asset are loaded
    this.GameAssetsLoaded = function()
    {
        if (obj.assetsLeft > 0)
            return;
        finishedLoading = true;
    };

    //when a all game asset are loaded
    this.FinishedLoading = function()
    {
        console.log('all assets are loaded supply a function to handle this');
    };

    this.animate = function()
    {
        if (finishedLoading)
            if (loading_screen.alpha > 0)
            {
                loading_screen.alpha -= 0.01;
                this.pencil.alpha -= 0.01;
            }
            else if (!calledEnd)
            {
                gameState = GameStates.WaitingForState;
                obj.FinishedLoading();
            }
    };

    this.getAudioArray = function()
    {
        return obj.audioPreloader.audioArray;
    };

    this.End = function()
    {
        //TODO make a destroyer
        stage.removeChild(loading_screen);
        stage.removeChild(obj.pencil);
    };
}