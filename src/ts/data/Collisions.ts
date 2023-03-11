import {Line} from "./Line";
import {Vector2} from "./Vector2";

export namespace Collisions {
    // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    export function pointToLineProj(line: Line, point: Vector2) {
        let len = line.length2
        if (len == 0) return line.a;
        let t = Math.max(0, Math.min(1, point.copy.sub(line.a).dot(line.b.copy.sub(line.a)) / len));
        return line.a.copy.add(line.b.copy.sub(line.a).mul(t))
    }

    export function pointToLineDst2(line: Line, point: Vector2) {
        return point.dst2(pointToLineProj(line, point));
    }

    export function pointToLineDst(line: Line, point: Vector2) {
        return Math.sqrt(pointToLineDst2(line, point))
    }

    // https://gamedev.stackexchange.com/questions/26004/how-to-detect-2d-line-on-line-collision
    export function lineLineCollision(a: Line, b: Line) {
        let denominator = ((a.b.x - a.a.x) * (b.b.y - b.a.y)) - ((a.b.y - a.a.y) * (b.b.x - b.a.x));
        let numerator1 = ((a.a.y - b.a.y) * (b.b.x - b.a.x)) - ((a.a.x - b.a.x) * (b.b.y - b.a.y));
        let numerator2 = ((a.a.y - b.a.y) * (a.b.x - a.a.x)) - ((a.a.x - b.a.x) * (a.b.y - a.a.y));
        
        if (denominator == 0) return numerator1 == 0 && numerator2 == 0;

        let r = numerator1 / denominator;
        let s = numerator2 / denominator;

        return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
    }

    // https://gamedev.stackexchange.com/questions/109991/most-efficient-way-to-calculate-angle-between-two-line-segments-that-do-not-nece
    export function angleBetweenLines(a: Line, b: Line) {
        let t1 = Math.atan2(a.a.y - a.b.y, a.a.x - a.b.x)
        let t2 = Math.atan2(b.a.y - b.b.y, b.a.x - b.b.x)
        let diff = Math.abs(t1 - t2)
        return Math.min(diff, Math.abs(Math.PI - diff))
    }
}