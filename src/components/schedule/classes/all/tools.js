import moment from 'moment'

export function class_edit_all_subtitle({t, location, locationRoom, classtype, starttime}) {
  return t('general.class') + ': ' + location + ' (' + locationRoom + ') - ' + classtype + ' @ ' + moment(starttime).format('LT')
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
