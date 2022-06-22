import React from 'react'
import { withTranslation } from 'react-i18next'

import {
  Badge
} from "tabler-react"


const BadgePublic = ({ t, className, isPublic }) => (
    (isPublic) ?
        <Badge className={className} color="success">{t('general.public')}</Badge> :
        <Badge className={className} color="danger">{t('general.not_public')}</Badge> 
)

export default withTranslation()(BadgePublic)