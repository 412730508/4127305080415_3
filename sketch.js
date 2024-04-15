//目前測試中 為0.1.3版本
//已知問題 怪物HITBOX過大
//已知問題 按下切換模式有機率觸發當機
let x;
let y;
let stars;
let scroll;
let isUp;
let isDown;
let isRight;
let isLeft;
let bullets; // 存儲所有子彈排列
let lastBulletTime; // 上一顆子彈的生成時間
let bulletInterval = 1000 / 3; // 子彈生成間隔（毫秒）
let bulletColors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#4B0082", "#800080"]; // 子彈顏色
let scatterMode = false; // 是否處於散射模式
let scatterInterval; // 散射模式的定時器
let scatterButton; // 按鈕
let monsters = []; // 怪樹數據
let monsterSpeed = 4; // 怪物移動速度
let monsterSpawnInterval = 1000; // 怪物出生的間隔（毫秒）
let monsterSpeedIncreaseInterval = 10000; // 怪物速度增加每10秒增加（毫秒）
let monsterSpeedIncreaseAmount = 1; // 怪物速度增加量

function generateBullet() {
  let bullet = new Bullet(x, y, random(bulletColors));
  bullets.push(bullet);
}

// 子彈類別
class Bullet {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 8;
    this.radius = 5;
    this.directionX = 0;
    this.directionY = -1;
  }

  // 更新子彈位置
  update() {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  }

  // 繪製子彈
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  // 子彈移動方向
  setDirection(dirX, dirY) {
    this.directionX = dirX;
    this.directionY = dirY;
  }
}

function setup() {
  createCanvas(600, 700);
  scroll = 0;
  
  isUp = false;
  isDown = false;
  isRight = false;
  isLeft = false;
 
  x = 300;
  y = 640;

  stars = [500, 300, 0, -200, -400, -600, -800, -1000, -1200, -1400, -1600, -1800, -2000, -2400, -2800, -3000, -3200, -3600, -3800, -4000];

  bullets = [];
  lastBulletTime = millis();
  generateBullet(); // 一開始就發射子彈*目前BUG

  // 創建按鈕*目前BUG按了會當機
  scatterButton = createButton('切換模式');
  scatterButton.position(width - 120, 10);
  scatterButton.mousePressed(toggleScatterMode);

  // 一開始的怪物
  setInterval(spawnMonster, monsterSpawnInterval);

  // 怪物增加的速度
  setInterval(increaseMonsterSpeed, monsterSpeedIncreaseInterval);
}

function draw() {
  background(60);

  push();
  translate(0, scroll);
  for (let i = 0; i < stars.length; i++) {
    fill(230, 255, 0);
    ellipse(50, stars[i] - 730, random(10, -10), random(10, -10));
    ellipse(150 + i, stars[i] - 850, random(10, -10), random(10, -10));
    ellipse(220, stars[i] - 350, random(10, -10), random(10, -10));
    ellipse(350 - i, stars[i] - 450, random(10, -10), random(10, -10));
    ellipse(450, stars[i] - 250, random(10, -10), random(10, -10));
    ellipse(580, stars[i] - 680, random(10, -10), random(10, -10));
  }

  fill(130);
  rect(260, 600, 10, 100);
  rect(260, 610, 40, 10);
  rect(260, 660, 50, 10);
  rect(300, 640, 10, 200);
  pop();

  // 繪製火箭
  drawRocket(x, y);

  // 更新和繪製子彈
  updateBullets();
  drawBullets();

  // 更新繪製怪物
  updateMonsters();
  drawMonsters();

  // 控制火箭移動
  moveRocket();
}

// 繪製火箭
function drawRocket(x, y) {
  noStroke();
  fill(255, 185, 0);
  ellipse(x, y + random(35, 55), 20, 60);
  fill(255, 255, 0);
  ellipse(x, y + random(35, 50), 15, 40);

  fill(30, 144, 255);
  arc(x, y + 36, 40, 40, PI, 0, CHORD);
  
  fill(255, 0, 0);
  ellipse(x, y, 30, 80);
  
  fill(255);
  ellipse(x, y - 12, 15, 15);
  ellipse(x, y + 6, 15, 15);
  
  fill(30, 144, 255);
  ellipse(x, y + 32, 5, 30);
}

// 更新子彈的位置
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    if (bullets[i].y < 0 || bullets[i].x < 0 || bullets[i].x > width) { // 子彈超出畫面，從陣列中刪除
      bullets.splice(i, 1);
    }
  }
}

// 子彈
function drawBullets() {
  for (let bullet of bullets) {
    bullet.draw();
  }
}

// 更新小怪物的位置和檢測与子弹的碰撞
function updateMonsters() {
  for (let i = monsters.length - 1; i >= 0; i--) {
    monsters[i].update();
    monsters[i].checkBulletCollision(); // 檢測與子弹的碰撞*目前BUG
    monsters[i].checkRocketCollision(); // 檢測與火箭的碰撞*目前BUG
  }
}

// 繪製小怪物
function drawMonsters() {
  for (let monster of monsters) {
    monster.draw();
  }
}

// 控制火箭移動
function moveRocket() {
  if (isUp && y > height * 0.2) {
    y -= 5;
  } else if (isUp && y <= height * 0.2) {
    scroll += 5;
  }

  if (isDown && y < height * 0.8) {
    y += 5;
  } else if (isDown && y >= height * 0.8) {
    scroll += 5;
  }

  if (isRight && x < width * 0.8) {
    x += 5;
  } else if (isRight && x >= width * 0.8) {
    scroll += 5;
  }

  if (isLeft && x > width * 0.2) {
    x -= 5;
  } else if (isLeft && x <= width * 0.2) {
    scroll += 5;
  }
}

// 按下按鍵
function keyPressed() {
  if (keyCode === UP_ARROW) {
    isUp = true;
  }
  if (keyCode === DOWN_ARROW) {
    isDown = true;
  }
  if (keyCode === RIGHT_ARROW) {
    isRight = true;
  }
  if (keyCode === LEFT_ARROW) {
    isLeft = true;
  }
}

// 釋放按鍵
function keyReleased() {
  if (keyCode === UP_ARROW) {
    isUp = false;
  }
  if (keyCode === DOWN_ARROW) {
    isDown = false;
  }
  if (keyCode === RIGHT_ARROW) {
    isRight = false;
  }
  if (keyCode === LEFT_ARROW) {
    isLeft = false;
  }
}

// 切換模式
function toggleScatterMode() {
  if (!scatterMode) {
    // 如果原本不是散射模式，切換到散射模式，每秒射兩次散射
    scatterMode = true;
    scatterBullets(); // 立即發射子彈
    scatterInterval = setInterval(scatterBullets, 1000 / 2);
    bulletInterval = 1000 / 2; // 更新子彈發射間隔時間
    bullets = []; // 清空普通模式的子彈
  } else {
    // 如果原本是散射模式，切換回原本模式，每秒射三顆子彈
    scatterMode = false;
    clearInterval(scatterInterval);
    bulletInterval = 1000 / 3; // 更新子彈發射間隔時間
    generateBullet(); // 立即發射子彈
  }
}

// 發射散射子彈
function scatterBullets() {
  let bullet1 = new Bullet(x, y, random(bulletColors));
  let bullet2 = new Bullet(x, y, random(bulletColors));
  let bullet3 = new Bullet(x, y, random(bulletColors));
  
  // 子彈1向前射擊
  bullet1.setDirection(0, -1);
  
  // 子彈2向左前方射擊
  bullet2.setDirection(-1, -1);
  
  // 子彈3向右前方射擊
  bullet3.setDirection(1, -1);
  
  bullets.push(bullet1);
  bullets.push(bullet2);
  bullets.push(bullet3);
}

// 创建随机的小怪物
function spawnMonster() {
  let monster = new Monster(random(width), random(-200, -50));
  monsters.push(monster);
}

// 每隔一段時間增加怪物速度
function increaseMonsterSpeed() {
  monsterSpeed += monsterSpeedIncreaseAmount;
}

// 小怪區
class Monster {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.speed = monsterSpeed;
  }

  // 更新小怪物位置
  update() {
    this.y += this.speed;
    if (this.y > height + this.size) {
      this.y = random(-200, -50); // 從上方隨機生成
      this.x = random(width); // 隨機生成 x 坐标標
    }
  }

  // 小怪物長相
  draw() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }

  // 火箭與小怪物的碰撞*目前BUG是體積太大
  checkRocketCollision() {
    let d = dist(this.x, this.y, x, y);
    if (d < this.size / 2 + 30) {
      // 火箭与小怪物碰撞，游戏结束
      gameOver();
    }
  }

  // 子弹与小怪物的碰撞區
  checkBulletCollision() {
    for (let i = bullets.length - 1; i >= 0; i--) {
      let d = dist(this.x, this.y, bullets[i].x, bullets[i].y);
      if (d < this.size / 2 + bullets[i].radius) {
        // 子弹击中小怪物，删除子弹和小怪物
        bullets.splice(i, 1);
        monsters.splice(this, 1);
        break; // 退出循环，避免多个子弹同时击中同一个小怪物
      }
    }
  }
}

// 游戏结束
function gameOver() {
  noLoop(); // 停止循环
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("按下F5重新開始此遊戲", width / 2, height / 2);
}