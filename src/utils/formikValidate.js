export const checkError = (name, form) => {
    const touched = form.touched
    const errors = form.errors
    return touched[name] && errors[name] ? errors[name] : null
}
