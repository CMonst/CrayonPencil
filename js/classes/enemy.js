function Enemy(frameName, initialSpeed, speedRange)
{
    var obj = this;
    this.States = {
        Moving: 'moving',
        Exploding: 'exploding',
        Exploded: 'exploded'
    };
    this.state = this.States.Moving;
    this.frameName = frameName;
    this.speed = initialSpeed + Math.random() * speedRange;
    this.speedRange = speedRange;
    this.sprite = PIXI.Sprite.fromFrame(frameName);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.explosion = new PIXI.MovieClip(explosionTextures);
    this.explosion.anchor.x = 0.5;
    this.explosion.anchor.y = 0.5;

    this.addToStage = function()
    {
        stage.addChildAt(this.sprite, nTiles);
    };

    this.removeFromStage = function()
    {

        this.state = this.States.Exploded;
        try
        {
            stage.removeChild(this.sprite);
        } catch (e) {
        }

        try
        {
            stage.removeChild(this.explosion);
        } catch (e) {
        }
    };

    this.blowUp = function()
    {
        this.state = this.States.Exploding;
        this.explosion.position.x = this.sprite.position.x;
        this.explosion.position.y = this.sprite.position.y;
        this.explosion.loop = false;
        //this.explosion.animationSpeed = 1;
        this.explosion.gotoAndPlay(0);
        stage.addChildAt(this.explosion, nTiles);
        stage.removeChild(this.sprite);
    };

    this.movement = function()
    {
        this.sprite.position.y += this.speed;
    };

    this.animate = function()
    {
        switch (this.state)
        {
            case this.States.Moving:
                this.movement();
                break;
            case this.States.Exploding:
                this.explosion.alpha -= 0.03;
                if (!this.explosion.playing)
                {
                    stage.removeChild(this.explosion);
                    this.state = this.States.Exploded;
                }
        }
    };

    this.isOutOfScreen = function()
    {
        return  (this.sprite.position.y > canvasHeight + this.sprite.height / 2);
    };

    this.setPosition = function(x, y)
    {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
    };

    this.placeAtStart = function()
    {
        var proposedRandPos = Math.random() * canvasWidth + this.sprite.width / 2;
        this.sprite.position.x = proposedRandPos > (canvasWidth - this.sprite.width / 2) ? (canvasWidth - this.sprite.width / 2) : proposedRandPos;
        this.sprite.position.y = 0 - this.sprite.height / 2;
    };
}