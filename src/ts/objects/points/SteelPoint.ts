import { IPoint, Point } from "../Point";

export class SteelPoint extends Point {
    constructor(data: IPoint) {
        super(data)
        this.mass = 3
        this.color = 0xBBBBBB
    }
}