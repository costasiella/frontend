import React, { useContext } from 'react'
import DatePicker from "react-datepicker"
import { withTranslation } from 'react-i18next'

import AppSettingsContext from '../context/AppSettingsContext'

function CSTimePicker({t, selected, onChange=f=>f, onBlur=f=>f, className="form-control", clearable=true, placeholderText=""}) {
  const appSettings = useContext(AppSettingsContext)
  const timeFormat = appSettings.timeFormatMoment

  return (
    <DatePicker 
      dateFormat={timeFormat}
      selected={selected}
      placeholderText={(placeholderText) ? placeholderText : t('datepicker.placeholder_time')}
      isClearable={clearable}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption={t("general.time")}
      className={className}
      dropdownMode="select"
      onChange={(date) => onChange(date)}
      onBlur={() => onBlur()}
    />
  )
}

export default withTranslation()(CSTimePicker)