function formatAttributesFilter(attributes: { attribute: string, value: string }[]) {
    return attributes?.map((attr) => `${attr.attribute}:eq:${attr.value}`)
}

export { formatAttributesFilter }