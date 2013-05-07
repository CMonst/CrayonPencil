function Projectile(frameName, speed)
{
    this.frameName = frameName;
    this.speed = speed;
    this.sprite = PIXI.Sprite.fromFrame(frameName);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.addToStage = function()
    {
        stage.addChildAt(this.sprite,nTiles);
    };
    this.removeFromStage = function()
    {
        stage.removeChild(this.sprite);
    };
    this.animate = function()
    {
        this.sprite.position.y += speed;
    };
    this.isOutOfScreen = function()
    {
        return  (this.sprite.position.y < -this.sprite.height / 2) || (this.sprite.position.y > canvasHeight + this.sprite.height / 2);
    };
    this.setPosition = function(x,y)
    {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
    };   
}