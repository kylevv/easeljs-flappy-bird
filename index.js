let stage;

function startGame() {

  stage = stage || new createjs.Stage("my-canvas");
  createjs.Ticker.reset();
  stage.removeAllChildren();
  stage.removeAllEventListeners();

  console.log("HIYA");
  let birdW = 50;
  let birdH = 50;
  let gravity = 0.1;
  let pillarW = 50;
  let pillars = [];
  let pillarSpeed = -1.5;
  let count = 0;

  // create message
  let msg = new createjs.Text("0 pillars", "22px Arial", "#000");
  stage.addChild(msg);
  msg.x = stage.canvas.width - msg.getMeasuredWidth();
  msg.y = stage.canvas.height - msg.getMeasuredHeight();

  // create bird container
  let bird = new createjs.Container();
  bird.x = 50;
  bird.y = stage.canvas.height/2 - birdH/2;
  bird.velocity = 0;
  stage.addChild(bird);

  // create body
  let body = new createjs.Shape();
  body.graphics.beginFill("#F00");
  body.graphics.drawRect(0,0,birdW,birdH);
  body.graphics.endFill();
  body.x = 0;
  body.y = 0;
  bird.addChild(body);

  // create wing
  let wing = new createjs.Shape();
  wing.graphics.beginFill("#00F");
  wing.graphics.drawRect(0,0,birdW,birdH/3);
  wing.graphics.endFill();
  bird.addChild(wing);
  wing.x = -birdW/3;
  wing.y = birdH/6;
  createjs.Tween.get(wing, {loop: true})
    .to({y: birdH/2}, 500).to({y: birdH/6}, 500);

  // create beak
  let beak = new createjs.Shape();
  beak.graphics.beginFill("#FB0");
  beak.graphics.drawRect(0,0,birdW/3,birdH/6);
  beak.graphics.endFill();
  bird.addChild(beak);
  beak.x = birdW;
  beak.y = birdH/6;

  // create eye
  let eye = new createjs.Shape();
  eye.graphics.beginFill("#000");
  eye.graphics.drawRect(0,0,birdW/6,birdH/6);
  eye.graphics.endFill();
  bird.addChild(eye);
  eye.x = birdW*9/12;
  eye.y = birdH/12;

  // handle frame updates
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", handleUpdate);
  function handleUpdate(e) {
    updateBird();
    updateMsg();
    // updatePillars();
    if (!pillars.length || createjs.Ticker.getTicks()%180 === 0) addPillars();
    // detectCollision();
    handlePillars();
    stage.update();
  }

  // performs actions for each pillar
  function handlePillars() {
    pillars.forEach((pillar, index) => {
      // updates pillar positions
      pillar.x += pillarSpeed;
      // checks for collisions
      if (!pillar.noCollision(bird)) endGame();
      // increments pillar count
      if (index===count && pillar.x < bird.x) count++;
    });
  }

  // detect collisions
  function detectCollision() {
    pillars.forEach(pillar => {
      if (!pillar.noCollision(bird)) endGame();
    });
  }

  // update bird position
  function updateBird() {
    bird.velocity += gravity;
    bird.y += bird.velocity;
    if (bird.y > stage.canvas.height - birdH) endGame();
  }

  function endGame() {
    createjs.Ticker.removeAllEventListeners();
    console.log("FAIL");
  }

  // update message text
  function updateMsg() {
    msg.text = count + " pillar" + (count!==1 ? "s" : "");
    msg.x = stage.canvas.width - msg.getMeasuredWidth();
  }

  // handle mouse clicks
  stage.addEventListener("stagemousedown", e => bird.velocity = -2)

  // add pillars
  function addPillars() {
    let gapY = Math.floor(Math.random()*(stage.canvas.height-4*birdH))+birdH;
    let pillar = new MakePillar(gapY);
    pillar.graphics.beginFill("#0F0");
    pillar.graphics.drawRect(0,0,pillarW,gapY);
    pillar.graphics.drawRect(0,gapY+2*birdH,pillarW,stage.canvas.height-gapY-2*birdH);
    pillar.graphics.endFill();
    stage.addChildAt(pillar, 0);
    pillar.x = stage.canvas.width;
    pillars.push(pillar);
  }

  // update pillars
  function updatePillars() {
    pillars.forEach(pillar => pillar.x += pillarSpeed);
  }

  // pillar constructor
  function MakePillar(gapY) {
    createjs.Shape.call(this);
    this.gapY = gapY;
  }
  MakePillar.prototype = Object.create(createjs.Shape.prototype);
  MakePillar.constructor = MakePillar;
  MakePillar.prototype.noCollision = function(obj) {
    return obj.x > this.x+pillarW
      || obj.x + birdW < this.x
      || (obj.y > this.gapY && obj.y < this.gapY + birdH);
  }

};