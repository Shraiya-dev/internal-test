export const extractResponse = (data) => {
    if (data?.data?.success) {
        return { data: data.data.data }
    }
    return { error: data?.data?.error }
}
