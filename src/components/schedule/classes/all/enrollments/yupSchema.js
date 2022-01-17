import { t } from 'i18next'
import * as Yup from 'yup'

export const SCHEDULE_CLASS_ENROLLMENT_SCHEMA = Yup.object().shape({
  dateStart: Yup.date()
    .required(t('yup.field_required')),
  // dateEnd: Yup.date()
  })
