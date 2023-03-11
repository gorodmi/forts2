export function setOrNew<T extends I, I>(data: I | undefined, constructor: new (from: I | undefined) => T): T {
    if (data instanceof constructor) return data as T
    return new constructor(data)
}