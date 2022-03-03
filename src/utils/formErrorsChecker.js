export const isError = (name, form) => {
	const touched = form.touched
	const errors = form.errors
	return errors[name] ? errors[name] : null
}
