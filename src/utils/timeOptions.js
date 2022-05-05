import { format } from 'date-fns'

export const getTimeOptions = (type) => {
    const start = new Date()
    const end = new Date()
    const timeArr = []
    if (type === 'am') {
        start.setHours(0, 0, 0)
        end.setHours(12, 0, 0)
    } else {
        start.setHours(12, 0, 0)
        end.setHours(24, 0, 0)
    }
    while (start < end) {
        timeArr.push({
            label: format(start, 'hh:mm a'),
            value: format(start, 'hh:mm a'),
        })
        start.setMinutes(start.getMinutes() + 30)
    }
    return timeArr
}
