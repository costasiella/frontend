import moment from 'moment'

export function dateToLocalISO(date) {
    return moment(date).format("YYYY-MM-DD")
    // if (date instanceof Date) {
    //     return date.getFullYear() + '-' + 
    //            ("0" + (date.getMonth() + 1)).slice(-2) + '-' +
    //            ("0" + date.getDate()).slice(-2)
    // } else {
    //     return date
    // }
}

export function dateToLocalISOTime(date) {
    if (date instanceof Date) {
        return date.getHours() + ':' + 
               ('0' + date.getMinutes()).slice(-2)
    } else {
        return date
    }
}


export function TimeStringToJSDateOBJ(time_string) {
    // time_string is Expected to be "HH:MM:SS"
    let date_obj = new Date()
    let time_split = time_string.split(':')
    date_obj.setHours(time_split[0])
    date_obj.setMinutes(time_split[1])

    return date_obj
}


export function getFirstDayMonth(year, month) {
    const firstDayMonth = moment(`${year}-${month}-01`).startOf('month')
    return new Date(firstDayMonth)
}


export function getLastDayMonth(year, month) {
    const firstDayMonth = moment(`${year}-${month}-01`).endOf('month')
    return new Date(firstDayMonth)
}
