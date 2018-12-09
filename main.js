/* global PIXI */

function game() {
  // ステージ作成
  const app = new PIXI.Application(800, 600, {backgroundColor: 0x0b0b3b})
  document.body.appendChild(app.view)


  const openingScene = new PIXI.Container()
  app.stage.addChild(openingScene)
  const gameScene = new PIXI.Container()
  app.stage.addChild(gameScene)
  gameScene.visible = false
  const gameEndScene = new PIXI.Container()
  app.stage.addChild(gameEndScene)
  gameEndScene.visible = false

  const openingBGM = PIXI.sound.Sound.from({url: 'sound/opening.mp3', loop: true})
  openingBGM.play()
  const selectSE = PIXI.sound.Sound.from({url: 'sound/select.mp3'})
  const gameBGM = PIXI.sound.Sound.from({url: 'sound/game.mp3', loop: true})
  const damageSE = PIXI.sound.Sound.from({url: 'sound/damage.mp3'})
  const countDownSE = PIXI.sound.Sound.from({url: 'sound/countdown.mp3'})
  const startSE = PIXI.sound.Sound.from({url: 'sound/start.mp3'})
  const successSE = PIXI.sound.Sound.from({url: 'sound/success.mp3'})
  const gameEndBGM = PIXI.sound.Sound.from({url: 'sound/gameend.mp3', loop: true})


  ////////////////// opening ///////////////////

  // 背景
  const openingbg = PIXI.Sprite.fromImage('img/openingbg.jpg')
  // 中央位置を真ん中に設定
  openingbg.anchor.set(0.5)
  openingbg.scale.set(2.5)
  openingbg.blendMode = PIXI.BLEND_MODES.ADD
  openingbg.x = app.screen.width / 2
  openingbg.y = app.screen.height / 2
  openingScene.addChild(openingbg)

  // 雪
  const snows = []
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
      openingScene.addChild(snow)
    }
  }

  // スプライト画像
  const opening = PIXI.Sprite.fromImage('img/opening.png')
  // 中央位置を真ん中に設定
  opening.anchor.set(0.5)
  opening.x = app.screen.width / 2
  opening.y = app.screen.height / 2
  openingScene.addChild(opening)

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
    wordWrapWidth: 440,
  })

  // タイトル
  const openingText = new PIXI.Text('燃えよサンタ!', textStyle)
  openingText.x = app.screen.width / 2 - 150
  openingText.y = app.screen.height / 2 - 250
  openingScene.addChild(openingText)


  // スタートボタン
  const textureButton = PIXI.Texture.fromImage('img/startButton.png')
  const textureButtonOver = PIXI.Texture.fromImage('img/startButtonOver.png')
  const button = new PIXI.Sprite(textureButton)
  button.interactive = true
  button.buttonMode = true
  button
        .on('pointerdown', startGame)
        .on('pointerover', () => {
          button.texture = textureButtonOver
        })
        .on('pointerout', () => {
          button.texture = textureButton
        })
  button.x = app.screen.width / 2 - 150
  button.y = app.screen.height / 2 + 200
  openingScene.addChild(button)

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
    wordWrapWidth: 440,
  })
  const buttonText = new PIXI.Text('スタート', buttonTextStyle)
  buttonText.x = 80
  buttonText.y = 10
  button.addChild(buttonText)

  //////////////// game /////////////////////

  const startTime = 7
  const gameTime = 30
  let successCount = 0
  let damageCount = 0

  // スプライト画像
  const gamebg = PIXI.Sprite.fromImage('img/gamebg.jpg')
  // 中央位置を真ん中に設定
  gamebg.anchor.set(0.5)
  gamebg.x = app.screen.width / 2
  gamebg.y = app.screen.height / 2
  gameScene.addChild(gamebg)

  // スプライト画像
  const dark = PIXI.Sprite.fromImage('img/dark.png')
  // 中央位置を真ん中に設定
  dark.anchor.set(0.5)
  dark.scale.set(1.5)
  dark.x = app.screen.width / 2
  dark.y = app.screen.height / 2
  gameScene.addChild(dark)

  // スプライト画像
  const fire = PIXI.Sprite.fromImage('img/fire.png')
  // 中央位置を真ん中に設定
  fire.anchor.set(0.5)
  fire.scale.set(1.5)
  fire.x = app.screen.width / 2
  fire.y = app.screen.height / 2
  fire.visible = false
  gameScene.addChild(fire)

  // スプライト画像
  const player = PIXI.Sprite.fromImage('img/player.png')
  // 中央位置を真ん中に設定
  player.anchor.set(0.5)
  player.scale.set(0.5)
  player.x = app.screen.width / 2
  player.y = 0
  gameScene.addChild(player)

  // スプライト画像
  const danro = PIXI.Sprite.fromImage('img/danro.png')
  // 中央位置を真ん中に設定
  danro.anchor.set(0.5)
  danro.scale.set(1.5)
  danro.x = app.screen.width / 2
  danro.y = app.screen.height / 2
  gameScene.addChild(danro)
  let isStarted = false
  danro.interactive = true
  danro.on('pointerdown', game)


  const infoTextStyle = new PIXI.TextStyle({
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
    wordWrapWidth: 440,
  })
  const timerText = new PIXI.Text(`残り時間：${gameTime}`, infoTextStyle)
  timerText.x = 0
  timerText.y = 0
  gameScene.addChild(timerText)

  // アイコン
  const fireIcon = PIXI.Sprite.fromImage('img/fireIcon.png')
  fireIcon.anchor.set(0.5)
  fireIcon.x = app.screen.width - 80
  fireIcon.y = 32
  gameScene.addChild(fireIcon)
  const fireCountText = new PIXI.Text(damageCount, infoTextStyle)
  fireCountText.x = app.screen.width - 60
  fireCountText.y = 10
  gameScene.addChild(fireCountText)

  const boxIcon = PIXI.Sprite.fromImage('img/boxIcon.png')
  boxIcon.anchor.set(0.5)
  boxIcon.x = app.screen.width - 180
  boxIcon.y = 28
  gameScene.addChild(boxIcon)
  const boxCountText = new PIXI.Text(successCount, infoTextStyle)
  boxCountText.x = app.screen.width - 160
  boxCountText.y = 10
  gameScene.addChild(boxCountText)

  // フォント
  const messageStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 64,
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
    wordWrapWidth: 440,
  })

  // メッセージ
  const messageText = new PIXI.Text('火が消えてるタイミングでクリックせよ!', messageStyle)
  messageText.scale.set(0.5)
  messageText.x = app.screen.width / 2 - messageText.width / 2
  messageText.y = app.screen.height / 2
  gameScene.addChild(messageText)


  // アニメーション
  const playerShow = PIXI.tweenManager.createTween(player)
  const playerStay = PIXI.tweenManager.createTween(player)
  const playerHide = PIXI.tweenManager.createTween(player)
  playerShow.from({ y: 0 }).to({ y: app.screen.height / 2 })
  playerShow.from({ y: app.screen.height / 2 }).to({ y: app.screen.height / 2 })
  playerHide.from({ y: app.screen.height / 2 }).to({ y: 0 })
  playerShow.time = playerHide.time = 200
  playerStay.time = 300
  playerShow.chain(playerStay)
  playerStay.chain(playerHide)
  playerHide.on('end', () => {
    playerShow.reset()
    playerStay.reset()
    playerHide.reset()
  })

  const fireShow = PIXI.tweenManager.createTween(fire)
  fireShow.from({ visible: true }).to({ visible: false })
  fireShow.time = 500
  fireShow.on('end', () => {
    fireShow.reset()
  })


  ///////////////// gameend /////////////////////

  // フォント
  const gameEndStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 64,
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
    wordWrapWidth: 440,
  })

  const gameEndText = new PIXI.Text('任務完了!', gameEndStyle)
  gameEndText.x = app.screen.width / 2 - gameEndText.width / 2
  gameEndText.y = app.screen.height / 2
  gameEndScene.addChild(gameEndText)

  ///////////////////////////////////////////

  function startGame() {
    openingScene.visible = false
    gameScene.visible = true
    mode = 'game'
    openingBGM.stop()
    selectSE.play()
    gameBGM.play()
  }

  function scale (obj, scale) {
    obj.scale.set(scale)
    obj.x = app.screen.width / 2 - messageText.width / 2
    obj.y = app.screen.height / 2 - messageText.height / 2
  }

  function game() {
    if (isStarted && (!playerShow.active && !playerHide.active)) {
      playerShow.start()
      if (fireShow.active) {
        damageSE.play()
        damageCount++
        fireCountText.text = damageCount
      } else {
        successSE.play()
        successCount++
        boxCountText.text = successCount
      }
    }
  }

  const timeline = new Set()
  const fireCount = 10 + Math.floor(Math.random()) * 20
  for (let i = 0; i < fireCount; i++) {
    const time = Math.floor(Math.random() * gameTime)
    timeline.add({time})
  }


  const seconds = {}

  // モード
  let mode = 'opening'
  let frame = 0
  // ゲームループ
  app.ticker.add((delta) => {
    switch (mode) {
      case 'opening':
        for (let i = 0; i < snows.length; i++) {
          snows[i].x += Math.random() * 2 - 1
          snows[i].y += Math.random() * 10
          snows[i].rotation += 0.1
          if (snows[i].y > 600) {
            snows[i].y = 0
          }
        }
        break
      case 'game':
        {
          PIXI.tweenManager.update()
          frame += delta
          const time = frame / 60
          const second = Math.floor(time)
          for (let i = 3; i < startTime - 1; i++) {
            if (second === i) {
              messageText.text = startTime - 1 - i
              scale(messageText, 5)
              if (!seconds[second]) {
                countDownSE.play()
                seconds[second] = true
              }
            }
            if (time > i && time < i + 1) {
              scale(messageText, i + 1 - time * 0.5)
            }
          }
          if (second === startTime - 1) {
            messageText.text = '開始'
            scale(messageText, 2)
            if (!seconds[second]) {
              startSE.play()
              seconds[second] = true
            }
          }
          if (second >= startTime) {
            messageText.visible = false
            isStarted = true
            timerText.text = `残り時間：${Math.max(0, gameTime + startTime - second)}`
            for (let fire of Array.from(timeline)) {
              const time = fire.time
              if (time === second - startTime) {
                fireShow.start()
              }
            }

            if (second > gameTime + startTime) {
              isStarted = false
              gameScene.visible = true
              gameEndScene.visible = true
              gameBGM.stop()
              gameEndBGM.play()
              mode = 'gameend'
            }
          }
        }
        break
      case 'gameend':
        break
      default:
    }
  })

}


game()
