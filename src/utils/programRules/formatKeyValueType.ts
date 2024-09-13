export function formatKeyValueType(sections: { fields: { name: any, valueType: any }[] }[]) {
    const keys: any = {}
    for (const iterator of sections) {
        for (const variable of iterator.fields) {
            keys[variable.name] = variable.valueType
        }
    }
    return keys
}


export function formatKeyValueTypeHeader(variables: any[]) {
    const keys: any = {}
    for (const variable of variables) {
        keys[variable.id] = variable.valueType
    }
    return keys
}
