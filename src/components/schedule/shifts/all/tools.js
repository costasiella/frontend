import moment from 'moment'

export function shift_edit_all_subtitle({t, location, locationRoom, shift, starttime}) {
  return t('general.shift') + ': ' + location + ' (' + locationRoom + ') - ' + shift + ' @ ' + moment(starttime).format('LT')
}
