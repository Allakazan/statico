class LiquidEffect {
    constructor({
        appendTo: e,
        image: t,
        speed: i,
        displacementImage: n,
        displacementScale: a,
        intensityX: s,
        intensityY: o
    }) {
        this.appendTo = e,
        this.image = t,
        this.speed = i,
        this.displacementImage = n,
        this.displacementScale = a,
        this.intensityX = s,
        this.intensityY = o,
        this.generateCanvas(e, t, i, n, a, s, o)
    }
    generateCanvas(root, image, speed, displacementImage, displacementScale, intensityX, intensityY) {
        PIXI.utils.skipHello();

        const app = new PIXI.Application({
            width: 700,
            height: 700,
            transparent: true,
            resolution: window.devicePixelRatio || 1
        });

        document.querySelector(root).append(app.view);

        app.renderer.plugins.interaction.moveWhenInside = !0;
        app.stage.interactive = !0;

        const container = new PIXI.Container;
        app.stage.addChild(container);

        const spriteImage = PIXI.Sprite.from(image);
        container.addChild(spriteImage);
        spriteImage.x = 300;
        spriteImage.y = 300;
        spriteImage.anchor.set(.4);
        spriteImage.scale.set(.3);
        
        const spriteDisplacement = PIXI.Sprite.from(displacementImage);
        spriteDisplacement.scale.set(displacementScale);
        spriteDisplacement.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        spriteDisplacement.position = spriteImage.position;
        app.stage.addChild(spriteDisplacement);
        
        const graphics = new PIXI.Graphics;
        graphics.interactive = !0;
        graphics.buttonMode = !1;
        app.stage.addChild(graphics);
        graphics.beginFill(0, .001);
        graphics.drawRect(10, 10, 680, 580);
        graphics.endFill();
        
        const filter = new PIXI.filters.DisplacementFilter(spriteDisplacement);
        filter.padding = 20;

        const rgbFilter = new PIXI.filters.RGBSplitFilter;
        
        rgbFilter.red = [0, 0]
        rgbFilter.green = [0, 0]
        rgbFilter.blue = [0, 0]

        spriteImage.filters = [filter, rgbFilter];

        filter.scale.x = 15 * intensityX;
        filter.scale.y = 25 * intensityY;

        app.ticker.add(() => {
            
            graphics.on("pointermove", e => {
                const i = this.scale(e.data.global.x, 0, 700, 0, 5);

                rgbFilter.red = [5 * i, 0]
                rgbFilter.green = [0, 1]
                rgbFilter.blue = [5 * i, 0]
            });
            
            graphics.on("pointerout", e => {
                rgbFilter.red = [0, 0]
                rgbFilter.green = [0, 0]
                rgbFilter.blue = [0, 0]
            });
            
            spriteDisplacement.x += speed;
            spriteDisplacement.x > spriteDisplacement.width && (spriteDisplacement.x = 0)
        })
    }

    scale (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
}