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

export function getWeekdayNames(t) {
    return [
        t("datetime.isoweekdays.monday"),
        t("datetime.isoweekdays.tuesday"),
        t("datetime.isoweekdays.wednesday"),
        t("datetime.isoweekdays.thursday"),
        t("datetime.isoweekdays.friday"),
        t("datetime.isoweekdays.saturday"),
        t("datetime.isoweekdays.sunday"),
    ]
}

export function getMonthNamesShort(t) {
    return [
        t("datetime.months.short_january"),
        t("datetime.months.short_february"),
        t("datetime.months.short_march"),
        t("datetime.months.short_april"),
        t("datetime.months.short_may"),
        t("datetime.months.short_june"),
        t("datetime.months.short_july"),
        t("datetime.months.short_august"),
        t("datetime.months.short_september"),
        t("datetime.months.short_october"),
        t("datetime.months.short_november"),
        t("datetime.months.short_decemer"),
      ]
}
