import {Point} from "./objects/Point";
import {GameObject, IGameObject} from "./objects/objectTypes/GameObject";
import {Vars} from "./data/Vars";
import {Plank} from "./objects/Plank";
import {Vector2} from "./data/Vector2";
import {Collisions} from "./data/Collisions";
import {BalloonObject} from "./objects/objectTypes/BalloonObject";

export enum ControlType {
    POINT_PLACE,
    OBJECT_PLACE,
}

export namespace Control {
    export let selectedPoint: Point | undefined
    export let buildingPoint: Point | undefined
    export let buildingObject: GameObject | undefined

    export let controlType = ControlType.POINT_PLACE

    export function init() {
        window.addEventListener("wheel", e => {
            if (!Vars.viewManager.active(Vars.gameView)) return

            if (e.deltaY < 0) Vars.gameView.camera.scale *= 1.1
            else Vars.gameView.camera.scale /= 1.1
            Vars.gameView.gameContainer.scale.set(Vars.gameView.camera.scale)
        })

        window.addEventListener("mousemove", e => {
            if (!Vars.viewManager.active(Vars.gameView)) return

            if (Vars.gameView.holdingMouse) {
                Vars.gameView.camera.pos.add(Vars.gameView.camera.screenToCanvas(new Vector2({
                    x: e.movementX,
                    y: e.movementY
                })))
                Vars.gameView.gameContainer.pivot.set(Vars.width / 2 - Vars.gameView.camera.pos.x, Vars.height / 2 - Vars.gameView.camera.pos.y)
            }

            Vars.gameView.camera.screenToWorld(Vars.gameView.cursorPos.set({
                x: e.clientX,
                y: e.clientY,
            }))
        })

        window.addEventListener("mouseup", e => {
            if (!Vars.viewManager.active(Vars.gameView)) return

            if (e.button === 2) {
                Vars.gameView.holdingMouse = false
            }
        })

        window.addEventListener("keydown", e => {
            if (!Vars.viewManager.active(Vars.gameView)) return

            if (e.code === "Enter") {
                Vars.gameView.points.filter(p => p !== buildingPoint).forEach(p => p.building = false)
                Vars.gameView.planks.forEach(p => p.building = false)
                Vars.gameView.objects.filter(o => o !== buildingObject).forEach(o => o.building = false)
            } else if (e.code === "Backspace") {
                if (selectedPoint !== undefined) {
                    selectedPoint.delete()
                    Vars.gameView.removeElement(selectedPoint)
                    unselect()
                    removeBuildingPoint()
                }
            } else if (e.code === "Digit1") setControlType(ControlType.POINT_PLACE)
            else if (e.code.startsWith("Digit")) {
                let digit = Number(e.code.substring(5))
                if (digit - 2 >= Vars.gameView.selectors.length) return;
                let selector = Vars.gameView.selectors[digit - 2]
                selector.select()
            }
        })

        window.addEventListener("mousedown", e => {
            if (!Vars.viewManager.active(Vars.gameView)) return

            if (e.button === 0 && e.clientX < window.innerWidth / 6 * 5) {
                if (controlType === ControlType.POINT_PLACE) {
                    let point = Vars.gameView.getPoint(Vars.gameView.cursorPos, p => p !== buildingPoint)
                    if (point !== undefined) {
                        if (selectedPoint !== undefined && Vars.gameView.canConnect(selectedPoint, point)) {
                            Vars.gameView.addElement(new Plank({
                                a: selectedPoint,
                                b: point,
                                building: true
                            }))
                        }
                        select(point)
                    } else if (selectedPoint !== undefined && buildingPoint !== undefined && Vars.gameView.canConnect(selectedPoint, buildingPoint)) {
                        Vars.gameView.addElement(new Plank({
                            a: selectedPoint,
                            b: buildingPoint,
                            building: true
                        }))
                        select(buildingPoint)
                    }
                } else if (controlType === ControlType.OBJECT_PLACE) {
                    if (buildingObject !== undefined && buildingObject.view.visible) {
                        let type = buildingObject.constructor as (new (params: IGameObject) => GameObject)
                        buildingObject = undefined
                        addBuildingObject(type)
                    }
                }
            } else if (e.button === 1) {
                unselect()
                removeBuildingPoint()
            } else if (e.button === 2) {
                Vars.gameView.holdingMouse = true
            }
        })
    }

    export function update(dt: number) {
        updatePos()
    }

    export function updatePos() {
        if (buildingPoint !== undefined) {
            let pointPos = Vars.gameView.cursorPos.copy
            Vars.gameView.terrain.push(pointPos)
            buildingPoint.pos.set(pointPos)
        }

        if (buildingObject !== undefined) {
            let minPlank: Plank | undefined
            let minDst = Number.MAX_VALUE
            Vars.gameView.planks.forEach(p => {
                let dst = Collisions.pointToLineDst2(p.line, Vars.gameView.cursorPos)
                if (dst >= 100 ** 2) return
                if (dst < minDst) {
                    minPlank = p
                    minDst = dst
                }
            })

            buildingObject.view.visible = minPlank !== undefined;
            if (minPlank !== undefined) {
                buildingObject.plank = minPlank
                let a = minPlank.a.pos.copy
                let proj = Collisions.pointToLineProj(minPlank.line, Vars.gameView.cursorPos).sub(a)
                let b = minPlank.b.pos.copy.sub(a)
                buildingObject.ratio = proj.dst() / b.dst()
                buildingObject.flip = minPlank.line.side(Vars.gameView.cursorPos) < 0;
            }
        }
    }

    export function setControlType(value: ControlType) {
        if (controlType === value) return

        if (controlType === ControlType.POINT_PLACE) {
            unselect()
            removeBuildingPoint()
        } else if (controlType === ControlType.OBJECT_PLACE) {
            Vars.gameView.unselectSelectors()
            removeBuildingObject()
        }

        controlType = value
    }

    export function removeBuildingObject() {
        if (buildingObject !== undefined) {
            buildingObject.delete()
            Vars.gameView.removeElement(buildingObject)
            buildingObject = undefined
        }
    }

    export function addBuildingObject(type: new (params: IGameObject) => GameObject) {
        if (buildingObject === undefined) {
            buildingObject = new type({building: true})
            Vars.gameView.addElement(buildingObject)
            updatePos()
        }
    }

    export function removeBuildingPoint() {
        if (buildingPoint !== undefined) {
            buildingPoint.delete()
            Vars.gameView.removeElement(buildingPoint)
            buildingPoint = undefined
        }
    }

    export function addBuildingPoint() {
        if (buildingPoint === undefined || buildingPoint === selectedPoint) {
            buildingPoint = new Point({building: true})
            Vars.gameView.addElement(buildingPoint)
            updatePos()
        }
    }

    export function unselect() {
        if (selectedPoint !== undefined)
            selectedPoint.selected = false
        selectedPoint = undefined
    }

    export function select(point: Point) {
        unselect()
        selectedPoint = point
        selectedPoint.selected = true
        addBuildingPoint()
    }
}