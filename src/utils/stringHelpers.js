export const capitalize = (str) => {
    return str.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
}
