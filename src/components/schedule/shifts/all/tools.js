import moment from 'moment'

export function shift_edit_all_subtitle({t, location, locationRoom, classtype, starttime}) {
  return t('general.shift') + ': ' + location + ' (' + locationRoom + ') - ' + classtype + ' @ ' + moment(starttime).format('LT')
}
