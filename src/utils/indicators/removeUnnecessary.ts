export function removeUnnecessary(condition : string) {
    condition = condition
        .replaceAll("#{", "")
        .replaceAll("A{", "")
        .replaceAll("}", "")
        .replaceAll("}", "");
    return condition;
}