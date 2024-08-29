export function findObject(data: Record<string, any> | null, targetKey: string): any {
    if (data === null || typeof data !== 'object') {
        return {};
    }

    const stack: Record<string, any>[] = [data];

    while (stack.length > 0) {
        const current = stack.pop();

        if (current && targetKey in current) {
            return current[targetKey];
        }

        for (const key in current) {
            if (typeof current[key] === 'object' && current[key] !== null) {
                stack.push(current[key]);
            }
        }
    }

    return {};
}