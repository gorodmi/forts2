import { IPlank, Plank } from "../Plank";

export class SteelPlank extends Plank {
    constructor(data: IPlank) {
        super(data)
        this.springCoefficient = 0.9
        this.color = 0x999999
        this.toughness = 100
    }
}