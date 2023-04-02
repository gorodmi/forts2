import { IPlank, Plank } from "../Plank";

export class RubberPlank extends Plank {
    constructor(data: IPlank) {
        super(data)
        this.springCoefficient = 0.1
        this.color = 0x333333
        this.toughness = 50
    }
}