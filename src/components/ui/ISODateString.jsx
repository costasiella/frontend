import { useContext } from 'react'
import moment from 'moment'

import AppSettingsContext from '../context/AppSettingsContext'


function FormatISODateStr({ ISODateStr }) {
    const appSettings = useContext(AppSettingsContext)
    const dateFormat = appSettings.dateFormat

    return (
        moment(ISODateStr).format(dateFormat)    
    )
}

export default FormatISODateStr
