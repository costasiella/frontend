import moment from 'moment'

import { getWeekdayNames } from '../../../../tools/date_tools'

export function class_edit_all_subtitle({t, location, locationRoom, classtype, starttime, dateStart, frequencyType, frequencyInterval}) {
  const weekdayNames = getWeekdayNames(t)

  // Weekday for type single
  let isoWeekday
  if (frequencyType === "SINGLE") {
    isoWeekday = moment(dateStart).isoWeekday()
  } else {
    // Weekly (recurring)
    isoWeekday = frequencyInterval
  }

  const weekdayName = weekdayNames[isoWeekday-1]

  // return t('general.class') + ': ' + location + ' (' + locationRoom + ') - ' + classtype + ' @ ' +  moment(starttime).format('LT')
  return t('general.class') + ': ' + weekdayName + ' ' + moment(starttime).format('LT') + ' - ' + classtype + ' - ' + location + ' [' + locationRoom + ']'
}

export function represent_instructor_role(t, role) {
  console.log(role)
  switch (role) {
    case "SUB":
      return t('schedule.classes.instructor_roles.sub')
    case "ASSISTANT":
      return t('schedule.classes.instructor_roles.assistant')
    case "KARMA":
      return t('schedule.classes.instructor_roles.karma')
    default:
      return ""
  }
}
