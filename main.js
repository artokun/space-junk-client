var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  preload: preload,
  create: create,
  update: update,
});

function preload() {
  game.world.setBounds(0, 0, 1920, 1200);
  game.load.image('ship', 'assets/sprites/ship.png');
  game.load.image('missile', 'assets/sprites/missile.png');
  game.load.image('bullet', 'assets/sprites/bullet.png');
  game.load.spritesheet(
    'thrustflame',
    'assets/sprites/thrustflame.png',
    97,
    78,
    11
  );
  game.load.spritesheet(
    'thrustflame2',
    'assets/sprites/thrustflame_2.png',
    97,
    78,
    11
  );
}

function create() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  missiles = game.add.group();
  for (var i = 0; i < 10; i++) {
    var missile = missiles.create(
      game.rnd.integerInRange(200, 1700),
      game.rnd.integerInRange(-200, 400),
      'missile'
    );
    missile.scale.setTo(0.3, 0.3);
    game.physics.p2.enable(missile, false);
  }

  //  Creates 30 missiles, using the 'bullet' graphic
  weapon = game.add.weapon(30, 'bullet');

  //  The missiles will be automatically killed when they are 2000ms old
  weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
  weapon.bulletLifespan = 2000;
  weapon.bulletAngleOffset = 90;
  weapon.bulletAngleVariance = 2;
  weapon.fireAngle = Phaser.ANGLE_LEFT;
  weapon.bulletSpeed = 600;
  weapon.fireRate = 100;

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

  ship = game.add.sprite(32, game.world.height - 150, 'ship');
  ship.anchor.set(0.5);
  ship.scale.setTo(0.5, 0.5);
  weapon.trackSprite(ship, 0, 0, true);
  game.camera.follow(ship);
  game.physics.p2.enable(ship);
}

function update() {
  missiles.forEachAlive(movemissiles, this); //make missiles accelerate to ship

  if (cursors.left.isDown) {
    ship.body.rotateLeft(50);
  } else if (cursors.right.isDown) {
    //ship movement
    ship.body.rotateRight(50);
  } else {
    ship.body.setZeroRotation();
  }
  if (cursors.up.isDown) {
    ship.body.thrust(400);
  } else if (cursors.down.isDown) {
    ship.body.reverse(100);
  }
  if (game.input.keyboard.isDown(Phaser.KeyCode.A)) {
    ship.body.thrustLeft(250);
  } else if (game.input.keyboard.isDown(Phaser.KeyCode.D)) {
    ship.body.thrustRight(250);
  }
  if (fireButton.isDown) {
    weapon.fire();
  }
}

function movemissiles(bullet) {
  accelerateToObject(bullet, ship, 30); //start accelerateToObject on every bullet
}

function accelerateToObject(obj1, obj2, speed) {
  if (typeof speed === 'undefined') {
    speed = 160;
  }
  var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
  obj1.body.rotation = angle + game.math.degToRad(90); // correct angle of angry missiles (depends on the sprite used)
  obj1.body.force.x = Math.cos(angle) * speed; // accelerateToObject
  obj1.body.force.y = Math.sin(angle) * speed;
}
