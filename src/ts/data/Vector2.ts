export interface IVector2 {
    x?: number
    y?: number
}

export class Vector2 {
    x: number
    y: number

    constructor(params: IVector2 = {}) {
        this.x = params.x ?? 0
        this.y = params.y ?? 0
    }

    set(vec: IVector2) {
        if (vec.x !== undefined) this.x = vec.x
        if (vec.y !== undefined) this.y = vec.y
        return this
    }

    add(vec: IVector2 | number) {
        if (typeof vec === "number") {
            this.x += vec;
            this.y += vec;
        } else {
            this.x += vec.x ?? 1
            this.y += vec.y ?? 1
        }
        return this
    }

    sub(vec: IVector2 | number) {
        if (typeof vec === "number") {
            this.x -= vec;
            this.y -= vec;
        } else {
            this.x -= vec.x ?? 1
            this.y -= vec.y ?? 1
        }
        return this
    }

    mul(vec: IVector2 | number) {
        if (typeof vec === "number") {
            this.x *= vec;
            this.y *= vec;
        } else {
            this.x *= vec.x ?? 1
            this.y *= vec.y ?? 1
        }
        return this
    }

    div(vec: IVector2 | number) {
        if (typeof vec === "number") {
            this.x /= vec;
            this.y /= vec;
        } else {
            this.x /= vec.x ?? 1
            this.y /= vec.y ?? 1
        }
        return this
    }

    dst2(vec: IVector2 | undefined = undefined) {
        if (vec === undefined) return this.x * this.x + this.y * this.y
        let x = this.x - (vec.x ?? 0)
        let y = this.y - (vec.y ?? 0)
        return x * x + y * y
    }

    dst(vec: IVector2 | undefined = undefined) {
        return Math.sqrt(this.dst2(vec))
    }

    angle(vec: IVector2 | undefined = undefined) {
        if (vec === undefined) return Math.atan2(this.y, this.x)
        return Math.atan2(this.y - (vec.y ?? 0), this.x - (vec.x ?? 0))
    }

    init() {
        return this.set({x: 0, y: 0})
    }

    norm() {
        return this.div(this.length)
    }

    neg() {
        return this.mul(-1)
    }

    max(vec: IVector2 | number) {
        if (typeof vec === "number") {
            this.x = Math.max(this.x, vec)
            this.y = Math.max(this.y, vec)
        } else {
            if (vec.x !== undefined) this.x = Math.max(this.x, vec.x)
            if (vec.y !== undefined) this.y = Math.max(this.y, vec.y)
        }
        return this
    }

    min(vec: IVector2 | number) {
        if (typeof vec === "number") {
            this.x = Math.max(this.x, vec)
            this.y = Math.max(this.y, vec)
        } else {
            if (vec.x !== undefined) this.x = Math.min(this.x, vec.x)
            if (vec.y !== undefined) this.y = Math.min(this.y, vec.y)
        }
        return this
    }

    clamp(from: IVector2 | number, to: IVector2 | number) {
        return this.min(to).max(from)
    }

    dot(vec: Vector2) {
        return vec.x * this.x + vec.y * this.y
    }

    cross(vec: Vector2) {
        return this.x * vec.y - this.y * vec.x
    }

    flip() {
        let temp = this.x
        this.x = -this.y
        this.y = temp
        return this
    }

    rotate(rad: number) {
        let save = this.copy
        this.x = save.x * Math.cos(rad) - save.y * Math.sin(rad)
        this.y = save.x * Math.sin(rad) + save.y * Math.cos(rad)
        return this
    }

    get length() {
        return this.dst()
    }

    get copy() {
        return new Vector2(this)
    }

    static fromAngle(rad: number) {
        return new Vector2({x: Math.cos(rad), y: Math.sin(rad)})
    }
}