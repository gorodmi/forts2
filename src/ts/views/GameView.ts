import View from "./View";
import {Point} from "../objects/Point"
import {Plank} from "../objects/Plank";
import {Vars} from "../data/Vars";
import {Terrain} from "../objects/Terrain";
import {Vector2} from "../data/Vector2";
import {Camera} from "../data/Camera";
import {Container, Graphics, Texture, TilingSprite} from "pixi.js";
import {GameObject} from "../objects/objectTypes/GameObject";
import {Control} from "../Control";
import {GameElement} from "../objects/GameElement";
import {Menu} from "../ui/Menu";

export class GameView extends View {
    points: Array<Point> = []
    planks: Array<Plank> = []
    objects: Array<GameObject> = []
    camera: Camera = new Camera()
    terrain: Terrain
    holdingMouse: boolean = false

    cursorPos: Vector2 = new Vector2()

    menu: Menu
    gameContainer: Container
    graphics: Graphics
    background: TilingSprite

    constructor() {
        super()

        this.background = new TilingSprite(Texture.from("https://cdn.discordapp.com/attachments/754410919119028306/1092016645460987965/AkkQaNf.png"))
        this.background.uvRespectAnchor = true
        this.addChild(this.background)

        this.gameContainer = new Container()
        this.gameContainer.sortableChildren = true
        this.addChild(this.gameContainer)

        this.menu = new Menu()
        this.addChild(this.menu)

        this.graphics = new Graphics()
        this.gameContainer.addChild(this.graphics)

        Control.init()

        this.terrain = new Terrain({
            points: [
                {x: -2000, y: 1000},
                {x: -750, y: 1000},
                {x: -1000, y: 500},
                {x: -400, y: 500},
                {x: -650, y: 1000},
                {x: -300, y: 1000},
                {x: -300, y: 500},
                {x: -50, y: 500},
                {x: -50, y: 750},
                {x: 200, y: 750},
                {x: 200, y: 1000},
                {x: 2000, y: 1000},
                {x: 2000, y: 2000},
                {x: -2000, y: 2000},
            ]
        })
        this.gameContainer.addChild(this.terrain.view)
    }

    addElement(element: GameElement) {
        this.gameContainer.addChild(element.view)
    }

    removeElement(element: GameElement) {
        this.gameContainer.removeChild(element.view)
    }

    canConnect(a: Point, b: Point) {
        return a !== b && !this.planks.find(p => p.a === a && p.b === b || p.a === b && p.b === a)
    }

    getConnectedPlanks(p: Point) {
        return this.planks.filter(plank => plank.a === p || plank.b === p)
    }

    getPoint(vec: Vector2, filter: (p: Point) => boolean = () => true) {
        return this.points.find(p => filter(p) && p.pos.dst2(vec) < Point.radius * Point.radius)
    }

    onShow() {
        for (let i = 0; i <= 6; i++) {
            this.gameContainer.addChild(new Point({pos: {x: -1000 + i * 100, y: 500}, anchor: true}).view)
        }
        this.newPolygon(new Vector2({x: 0, y: -100}), 100, 4)
        this.newTower(new Vector2({x: -600, y: -100}), 10, 100)
    }

    onTimer(dt: number) {
        this.points.forEach(p => p.update(dt))
        this.terrain.update(dt)
        this.points.forEach(p => p.draw())
        this.planks.forEach(p => p.update(dt))
        this.objects.forEach(o => o.update(dt))
        Control.update(dt)
    }

    resize() {
        this.gameContainer.pivot.set(Vars.width / 2 - this.camera.pos.x, Vars.height / 2 - this.camera.pos.y)
        this.gameContainer.position.set(Vars.width / 2, Vars.height / 2)

        this.background.position.set(Vars.width / 2, Vars.height / 2)
        this.background.anchor.set(0.5)
        this.background.width = Vars.width
        this.background.height = Vars.height

        this.menu.resize()
    }

    newPolygon(pos: Vector2, radius: number, count: number) {
        let diagonals = count - 3
        let points = []
        for (let i = 0; i < count; i++) {
            points.push(new Point({
                pos: {
                    x: radius * Math.cos(2 * Math.PI * i / count) + pos.x,
                    y: radius * Math.sin(2 * Math.PI * i / count) + pos.y
                }
            }))
        }

        for (let i = 0; i < points.length; i++) {
            let point = points[i]
            for (let j = 0; j <= diagonals; j++) {
                if (i - j - 1 > 1 && j > 0) continue
                let nextPoint = points[(i + j + 1) % points.length]
                this.gameContainer.addChild(new Plank({a: point, b: nextPoint}).view)
            }
        }

        points.forEach(p => this.gameContainer.addChild(p.view))
    }

    newTower(pos: Vector2, levels: number, size: number) {
        let tl: Point, tr: Point
        let points: Array<Point> = []
        points.push(new Point({pos: new Vector2({x: -size, y: -size}).add(pos)}))
        points.push(new Point({pos: new Vector2({x: size, y: -size}).add(pos)}))
        points.push(new Point({pos: new Vector2({x: size, y: size}).add(pos)}))
        points.push(new Point({pos: new Vector2({x: -size, y: size}).add(pos)}))
        for (let i = 0; i < points.length; i++) {
            let thisPoint = points[i]
            for (let j = 1; j < points.length - 1; j++) {
                let nextPoint = points[(i + j) % points.length]
                this.gameContainer.addChild(new Plank({a: thisPoint, b: nextPoint}).view)
            }
        }
        tl = points[0]
        tr = points[1]

        for (let i = 1; i < levels; i++) {
            let add = i * 2 + 1
            let lPoint = new Point({pos: new Vector2({x: -size, y: -size * add}).add(pos)})
            let rPoint = new Point({pos: new Vector2({x: size, y: -size * add}).add(pos)})
            this.gameContainer.addChild(
                new Plank({a: lPoint, b: rPoint}).view,
                new Plank({a: lPoint, b: tl}).view,
                new Plank({a: lPoint, b: tr}).view,
                new Plank({a: rPoint, b: tl}).view,
                new Plank({a: rPoint, b: tr}).view,
            )
            tl = lPoint
            tr = rPoint
            points.push(lPoint, rPoint)
        }

        points.forEach(p => this.gameContainer.addChild(p.view))
    }
}