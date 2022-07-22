import { useCallback } from 'react'

//hook to group repetitive props of forms
export function useFormikProps(form, initialValues) {
    const formikProps = useCallback(
        (name) => {
            const touched = form.touched
            const errors = form.errors
            return {
                name: name,
                value: form.values[name],
                error: !!(touched[name] && errors[name] ? errors[name] : null),
                onChange: form.handleChange,
                onBlur: form.handleBlur,
                helperText: touched[name] && errors[name] ? errors[name] : null,
                ...initialValues,
            }
        },
        [form]
    )

    return formikProps
}
