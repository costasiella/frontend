import moment from 'moment'

export function shiftSubtitle({t, location, locationRoom, shift, timeStart, date}) {
  return t('general.shift') + ': ' + 
         location + ' (' + locationRoom + ') - ' + 
         shift + ' @ ' + 
         moment(date).format('LL') + ' ' + moment(timeStart).format('LT')
}

