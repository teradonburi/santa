// ステージ作成
const app = new PIXI.Application(800, 600, {backgroundColor : 0x151515})
document.body.appendChild(app.view)


let isInit = false
const snows = []

// Listen for animate update
app.ticker.add((delta) => {
    if (!isInit) {
        // 雪
        const snowTexture = PIXI.Texture.fromImage('img/snow.png')
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const snow = new PIXI.Sprite(snowTexture)
                snow.blendMode = PIXI.BLEND_MODES.ADD
                snow.scale.set(0.05 + Math.random() * 0.01)
                snow.anchor.set(0.5)
                snow.x = i * 100
                snow.y = Math.random() * 200 * j
                snows.push(snow)
                app.stage.addChild(snow)
            }
        }

        // スプライト画像
        const opening = PIXI.Sprite.fromImage('img/opening.png')
        // 中央位置を真ん中に設定
        opening.anchor.set(0.5)
        opening.x = app.screen.width / 2
        opening.y = app.screen.height / 2

        app.stage.addChild(opening)

        // フォント
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#ff0040'], // gradient
            stroke: '#8a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        })

        // タイトル
        const openingText = new PIXI.Text('燃えよサンタ!', textStyle)
        openingText.x = app.screen.width / 2 - 150
        openingText.y = app.screen.height / 2 - 250
        app.stage.addChild(openingText)

        // スタートボタン
        const textureButton = PIXI.Texture.fromImage('img/startButton.png')
        const textureButtonOver = PIXI.Texture.fromImage('img/startButtonOver.png')
        const button = new PIXI.Sprite(textureButton)
        button.interactive = true
        button.buttonMode = true
        button
            .on('pointerdown', () => {
                console.log('start')
            })
            .on('pointerover', () => {
                button.texture = textureButtonOver
            })
            .on('pointerout', () => {
                button.texture = textureButton
            })
        button.x = app.screen.width / 2 - 150
        button.y = app.screen.height / 2 + 200
        app.stage.addChild(button)

        const buttonTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: '#ffffff', // gradient
            stroke: '#ff8000',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        })
        const buttonText = new PIXI.Text('スタート', buttonTextStyle)
        buttonText.x = 80
        buttonText.y = 10
        button.addChild(buttonText)

        isInit = true
    }

    for (let i = 0; i < snows.length; i++) {
        snows[i].x += Math.random() * 2 - 1
        snows[i].y += Math.random() * 10
        if (snows[i].y > 600) {
            snows[i].y = 0
        }
    }
})

