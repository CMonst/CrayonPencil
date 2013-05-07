function Level1()
{
    var obj = this;

    var LevelState = {
        Intro: 'intro',
        Outro: 'outro',
        InLevel: 'playing',
        Ended: 'ended',
        Paused: 'paused'
    };

    levelState = LevelState.Intro;

    var finishedLevel = false;
    var finishTime = null;
    var won = false;

    var lastShotTime = (new Date()).getTime();
    var shooting = false;
    var pencil;
    var pencil_projectiles = [];
    var enemies = [];


    var bgScrollSpeed = 1.2;
    var totalEnemies = 20;
    var enemySpeed = 3;
    var enemySpeedRange = 5;
    var pencilShootingInterval = 400;

    var score = 0;

    //load pencil
    pencil = PIXI.Sprite.fromFrame(pencilFrameName);
    pencil.anchor.x = 0.5;
    pencil.anchor.y = 0.5;
    pencil.position.x = canvasWidth / 2;
    pencil.position.y = canvasHeight - pencil.height;

    //make intro text
    var introText = new PIXI.Text("Level 1", "60px BuxtonSketch", "cyan", "black", 5);
    introText.anchor.x = 0.5;
    introText.anchor.y = 0.5;
    introText.position.x = canvasWidth / 2;
    introText.position.y = canvasHeight / 2 - 100;
    introText.alpha = 1;
    stage.addChild(introText);

    //make score text
    var scoreText = new PIXI.Text("Score: 0", "35px BuxtonSketch", "white", "black", 5);
    scoreText.anchor.x = 1;
    scoreText.anchor.y = 0;
    scoreText.position.x = canvasWidth - 5;
    scoreText.position.y = 0;
    stage.addChild(scoreText);

    //make lose text
    var lostText = new PIXI.Text("YOU ARE A LOSER", "60px BuxtonSketch", "red", "black", 5);
    lostText.anchor.x = 0.5;
    lostText.anchor.y = 0.5;
    lostText.position.x = canvasWidth / 2;
    lostText.position.y = canvasHeight / 2 - 100;
    lostText.alpha = 0;
    stage.addChild(lostText);

    //make win text
    var winText = new PIXI.Text("Sadly you won this time", "60px BuxtonSketch", "green", "black", 5);
    winText.anchor.x = 0.5;
    winText.anchor.y = 0.5;
    winText.position.x = canvasWidth / 2;
    winText.position.y = canvasHeight / 2 - 100;
    winText.alpha = 0;
    stage.addChild(winText);

    //make pause text
    var pauseText = new PIXI.Text("Paused", "60px BuxtonSketch", "yellow", "black", 5);
    pauseText.anchor.x = 0.5;
    pauseText.anchor.y = 0.5;
    pauseText.position.x = canvasWidth / 2;
    pauseText.position.y = canvasHeight / 2 - 100;
    pauseText.alpha = 0;
    stage.addChild(pauseText);

    //play track
    var menuTrack = audioArray[0];
    menuTrack.preload = 'auto';
    if (typeof menuTrack.loop === 'boolean')
    {
        menuTrack.loop = true;
        menuTrack.play();
    }
    else
    {
        menuTrack.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }


    //bind events 
    renderer.view.onmousemove = MouseMoved;
    renderer.view.onmousedown = MouseClicked;
    renderer.view.onmouseup = renderer.view.onmouseout = MouseUnClicked;
    
    var mute = false;
    
    var originalState = null;
    keyUpHandler = function(event)
    {
        console.log(originalState);
        if (event.keyCode === 80)
            if (levelState === LevelState.Paused)
            {
                pauseText.alpha = 0;
                levelState = originalState;
            }
            else
            {
                pauseText.alpha = 1;
                originalState = levelState;
                levelState = LevelState.Paused;
            }
            
        if (event.keyCode === 77)
        {
            mute = !mute;
            mute ? menuTrack.pause() : menuTrack.play();
        }
    };

    $(document).unbind("keyup");
    $(document).bind("keyup", keyUpHandler);

    try
    {
        $(renderer.view)[0].addEventListener("touchmove", MouseMoved, false);
        $(renderer.view)[0].addEventListener("touchstart", MouseClicked, false);
        $(renderer.view)[0].addEventListener("touchend", MouseUnClicked, false);
        $(renderer.view)[1].addEventListener("touchstart", function() {
            originalState = levelState;
            if (levelState === LevelState.Paused)
                levelState = originalState;
            else
                levelState = LevelState.Paused;
        }, false);
    } catch (e) {
    }

    stage.addChildAt(pencil, 9);


    this.animate = function()
    {
        switch (levelState)
        {
            case LevelState.Intro:
                introText.alpha -= 0.009;
                if (introText.alpha <= 0)
                    levelState = LevelState.InLevel;
                break;
            case LevelState.InLevel:
                GenerateEnemies();
                AnimateEnemies();
                ScrollBg();
                MoveProjectiles();
                if (shooting)
                    PencilShoot(Math.random() > 0.2 ? 1 : 2);
                CheckCollisions();
                scoreText.setText("Score: " + score);
                if (score >= 2000)
                {
                    win = true;
                    winText.alpha = 1;
                    levelState = LevelState.Outro;
                }
                break;
            case LevelState.Outro:
                if (win)
                {
                    winText.alpha -= 0.009;
                    if (winText.alpha <= 0)
                        endLevel();
                }
                else
                {
                    lostText.alpha -= 0.009;
                    if (lostText.alpha <= 0)
                        endLevel();
                }
            case LevelState.Paused:
                break;

        }
    };

    this.LevelEnded = function()
    {
        //callback for level end
    };

    function endLevel()
    {
        if (levelState === LevelState.Ended)
            return;

        levelState = LevelState.Ended;

        //TODO make a destroyer
        for (var i = 0; i < enemies.length; i++)
            enemies[i].removeFromStage();

        for (var i = 0; i < pencil_projectiles.length; i++)
            pencil_projectiles[i].removeFromStage();

        stage.removeChild(pencil);
        stage.removeChild(scoreText);
        stage.removeChild(winText);
        stage.removeChild(lostText);
        stage.removeChild(introText);

        //unbind events
        renderer.view.onmousemove = null;
        renderer.view.onmousedown = null;
        renderer.view.onmouseup = renderer.view.onmouseout = null;
        try
        {
            $(renderer.view)[0].removeEventListener("touchmove", MouseMoved, false);
            $(renderer.view)[0].removeEventListener("touchstart", MouseClicked, false);
            $(renderer.view)[0].removeEventListener("touchend", MouseUnClicked, false);
        } catch (e) {
        }

        menuTrack.pause();

        obj.LevelEnded(win);
    }

    //TODO make a Level class and inherit functions from it
    function isCollided(obj1, obj2)
    {
        if (!(obj1 && obj2))
            return false;

        var supposedXClearance = obj1.width / 2 + obj2.width / 2;
        var supposedYClearance = obj1.height / 2 + obj2.height / 2;
        if (Math.abs(obj1.position.x - obj2.position.x) < supposedXClearance && Math.abs(obj1.position.y - obj2.position.y) < supposedYClearance)
            return true;

        return false;
    }

    function CheckCollisions()
    {
        //check enemies collision with pencil projectiles
        for (var i = 0; i < pencil_projectiles.length; i++)
            for (var j = 0; j < enemies.length; j++)
                if (enemies[j].state === enemies[j].States.Moving && isCollided(pencil_projectiles[i].sprite, enemies[j].sprite))
                {
                    pencil_projectiles[i].removeFromStage();
                    pencil_projectiles.splice(i, 1);
                    --i;
                    enemies[j].blowUp();
                    score += 15;
                    break;
                }

        for (var i = 0; i < enemies.length; i++)
            if (enemies[i].state === enemies[i].States.Moving && isCollided(pencil, enemies[i].sprite))
            {
                enemies[i].blowUp();
                levelState = LevelState.Outro;
                lostText.alpha = 1;
                win = false;
                break;
            }
    }

    function GenerateEnemies()
    {
        if (enemies.length >= totalEnemies || Math.random() > 0.05)
            return;

        enemy = new Enemy(enemy1_eraserFrameName, enemySpeed, enemySpeedRange, enemies);
        enemy.placeAtStart();
        enemy.addToStage();
        enemies.push(enemy);
    }

    function AnimateEnemies()
    {
        for (var i = 0; i < enemies.length; i++)
        {
            if (enemies[i].state === enemies[i].States.Exploded)
            {
                enemies.splice(i, 1);
                i--;
                continue;
            }
            enemies[i].animate();
            if (enemies[i].isOutOfScreen())
                enemies[i].placeAtStart();
        }
    }
    function ScrollBg()
    {
        for (var i = 0; i < nTiles; i++)
        {
            var tile = bgTiles[i];
            if (tile.position.y > canvasHeight)
                tile.position.y -= (nTiles * tile.height);
            tile.position.y += bgScrollSpeed;
        }
    }
    function MoveProjectiles()
    {
        for (var i = 0; i < pencil_projectiles.length; i++)
        {
            pencil_projectiles[i].animate();
            if (pencil_projectiles[i].isOutOfScreen())
            {
                //clean projectiles if they exit the screen
                pencil_projectiles[i].removeFromStage();
                pencil_projectiles.splice(i, 1);
                i--;
            }
        }
    }
    function MouseMoved(data)
    {
        var mouseXNormalizer = canvasWidth / $(renderer.view).width();
        var mouseYNormalizer = canvasHeight / $(renderer.view).height();
        var mouseX = Math.round((data.clientX - $(renderer.view).position().left) * mouseXNormalizer);
        var mouseY = Math.round((data.clientY - $(renderer.view).position().top) * mouseYNormalizer);

        //if used on touch screen
        if (isNaN(mouseX) || isNaN(mouseY))
        {
            mouseX = Math.round((data.targetTouches[0].clientX - $(renderer.view).position().left) * mouseXNormalizer);
            mouseY = Math.round((data.targetTouches[0].clientY - $(renderer.view).position().top) * mouseYNormalizer);
        }

        //prevent getting out of the canvas
        if (mouseX > canvasWidth || mouseX < 0 || mouseY > canvasHeight || mouseY < 0)
            return;

        //center pencil at mouse location
        pencil.position.x = mouseX;
        pencil.position.y = mouseY;
    }
    function MouseClicked(data)
    {
        shooting = true;
    }
    function MouseUnClicked(data)
    {
        shooting = false;
    }
    function PencilShoot(projectileType)
    {
        if (!projectileType)
            projectileType = 1;

        if ((new Date()).getTime() - lastShotTime < pencilShootingInterval)
            return;

        lastShotTime = (new Date()).getTime();

        var projectile;
        switch (projectileType)
        {
            case 1:
                projectile = new Projectile(pencil_proj1_tipFrameName, -10.5);
                pencilShootingInterval = 300;
                break;
            case 2:
                //example for overriding the projectile motion
                projectile = new Projectile(pencil_proj1_tipFrameName, -8.5);
                pencilShootingInterval = 300;
                projectile.animate = function()
                {
                    this.sprite.position.y += this.speed;
                    this.sprite.position.x += Math.sin(this.sprite.position.y * 0.03) * 15;
                };
                break;
            default:
                console.log("undefined projectile id " + projectileType);
                return;
        }

        projectile.setPosition(pencil.position.x, pencil.position.y - pencil.height / 2 + projectile.sprite.height / 2);
        projectile.addToStage();
        pencil_projectiles.push(projectile);
    }
}