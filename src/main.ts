import { ArcRotateCamera, Engine, Light, PointLight, Scene, Sprite, SpriteManager, Vector3 } from 'babylonjs'
import plpng from '../textures/player.png'
import palmpng from '../textures/palm.png'

class Game {
  private canvas: HTMLCanvasElement
  private engine: Engine
  private scene: Scene
  private camera: ArcRotateCamera
  private light: Light
  private spriteManagerTrees: SpriteManager
  private spriteManagerPlayer: SpriteManager
  private player: Sprite

  // Create canvas and engine
  constructor (canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement
    this.engine = new Engine(this.canvas, true)

        // Listen for browser/canvas resize events
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }

  createScene (): void {
    this.scene = new Scene(this.engine)

    // Create camera and light
    this.light = new PointLight('Point', new Vector3(5, 10, 5), this.scene)
    this.camera = new ArcRotateCamera('Camera', 1, 0.8, 8, new Vector3(0, 0, 0), this.scene)
    this.camera.attachControl(this.canvas, true)

    // Create a sprite manager to optimize GPU ressources
    // Parameters : name, imgUrl, capacity, cellSize, scene
    this.spriteManagerTrees = new SpriteManager('treesManager', palmpng, 2000, 800, this.scene)

    // We create 2000 trees at random positions
    for (let i = 0; i < 2000; i++) {
      let tree = new Sprite('tree', this.spriteManagerTrees)
      tree.position.x = Math.random() * 100 - 50
      tree.position.z = Math.random() * 100 - 50
      tree.isPickable = true

        // Some "dead" trees
      if (Math.round(Math.random() * 5) === 0) {
        tree.angle = Math.PI * 90 / 180
        tree.position.y = -0.3
      }
    }

    // Create a manager for the player's sprite animation
    this.spriteManagerPlayer = new SpriteManager('playerManager', plpng, 2, 64, this.scene)

    // First animated player
    this.player = new Sprite('player', this.spriteManagerPlayer)
    this.player.playAnimation(0, 40, true, 100, () => { /** */})
    this.player.position.y = -0.3
    this.player.size = 0.3
    this.player.isPickable = true

    // Second standing player
    let player2 = new Sprite('player2', this.spriteManagerPlayer)
    player2.stopAnimation() // Not animated
    player2.cellIndex = 2 // Going to frame number 2
    player2.position.y = -0.3
    player2.position.x = 1
    player2.size = 0.3
    player2.invertU = -1 // Change orientation
    player2.isPickable = true

    // Picking
    this.spriteManagerTrees.isPickable = true
    this.spriteManagerPlayer.isPickable = true

    this.scene.onPointerDown = (evt) => {
      let pickResult = this.scene.pickSprite(evt.x, evt.y)
      if (pickResult.hit) {
        pickResult.pickedSprite.angle += 0.5
      }
    }

  }

  run (): void {
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
}

// Create our game class using the render canvas element
let game = new Game('renderCanvas')

// Create the scene
game.createScene()

// start animation
game.run()
