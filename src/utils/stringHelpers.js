export const capitalize = (str) => {
    return str.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
}

export const formatEnum = (str = '') => {
    return str
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
}
