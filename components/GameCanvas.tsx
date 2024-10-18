import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

interface GameCanvasProps {
  userCode: string;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ userCode }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  let gameInstance: Phaser.Game | null = null;

  useEffect(() => {
    if (gameRef.current) {
      // Destroy existing game instance if any
      if (gameInstance) {
        gameInstance.destroy(true);
      }

      // Create a new game instance
      gameInstance = new Phaser.Game({
        type: Phaser.AUTO,
        parent: gameRef.current,
        width: 500, // Adjust the width
        height: 300, // Adjust the height
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 300 },
            debug: false,
          },
        },
        scale: {
          mode: Phaser.Scale.FIT, // Fit the game into the container
          autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game horizontally and vertically
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
      });

      return () => {
        if (gameInstance) {
          gameInstance.destroy(false); // Do not remove the canvas
        }
      };
    }
  }, [userCode]);

  const preload = function (this: Phaser.Scene) {
    this.load.image("sky", "https://labs.phaser.io/assets/skies/sky4.png");
    this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
    this.load.spritesheet("dude", "https://labs.phaser.io/assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.image("dragon", "https://labs.phaser.io/assets/sprites/dragon.png");
    this.load.image("griffin", "https://labs.phaser.io/assets/sprites/griffin.png");
    this.load.image("unicorn", "https://labs.phaser.io/assets/sprites/unicorn.png");

    this.load.image("tree", "https://labs.phaser.io/assets/sprites/tree.png");
    this.load.image("cloud", "https://labs.phaser.io/assets/sprites/cloud.png");
  };

  const create = function (this: Phaser.Scene) {
    this.add.image(250, 150, "sky");

    const cloud1 = this.add.image(80, 50, "cloud");
    const cloud2 = this.add.image(320, 80, "cloud");

    this.tweens.add({
      targets: cloud1,
      x: 400,
      duration: 20000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: cloud2,
      x: 0,
      duration: 25000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const platforms = this.physics.add.staticGroup();

    platforms.create(200, 290, "ground").setScale(2).refreshBody();
    platforms.create(300, 240, "ground").setScale(0.5).refreshBody();
    platforms.create(100, 200, "ground").setScale(0.5).refreshBody();
    platforms.create(300, 150, "ground").setScale(0.5).refreshBody();

    this.add.image(70, 230, "tree").setScale(0.5);
    this.add.image(330, 230, "tree").setScale(0.5);

    this.add.image(250, 180, "dragon").setScale(0.3);
    this.add.image(50, 220, "griffin").setScale(0.3);
    this.add.image(350, 190, "unicorn").setScale(0.3);

    const player = this.physics.add.sprite(100, 150, "dude");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    try {
      new Function(userCode).call(this);
    } catch (error) {
      console.error("Error executing user code:", error);
    }
  };

  const update = function (this: Phaser.Scene) {
    try {
      new Function(userCode).call(this);
    } catch (error) {
      console.error("Error in user code update:", error);
    }
  };

  return (
    <div
      ref={gameRef}
      className="w-full max-w-3xl mx-auto mt-4 rounded-lg overflow-hidden shadow-md"
      style={{ height: "auto", aspectRatio: "16 / 9" }}
    />
  );
};

export default GameCanvas;
