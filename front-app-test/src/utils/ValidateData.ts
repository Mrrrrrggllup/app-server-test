
export function isPresent(value: any) {
    return value !== undefined && value !== null && value !== '';
}

export function isAbsent(value: any) {
    return !isPresent(value);
}