import moment from 'moment'

export function appointment_edit_all_subtitle({t, location, locationRoom, starttime}) {
  return t('general.appointment') + ': ' + location + ' (' + locationRoom + ') @ ' + moment(starttime).format('LT')
}


export function represent_instructor_role(t, role) {
  console.log(role)
  switch (role) {
    case "SUB":
      return t('schedule.classes.instructor_roles.sub')
      break
    case "ASSISTANT":
      return t('schedule.classes.instructor_roles.assistant')
      break
    case "KARMA":
      return t('schedule.classes.instructor_roles.karma')
      break
    default:
      return ""
      break
  }
}
