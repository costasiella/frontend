import { t } from 'i18next'
import * as Yup from 'yup'

export const SCHEDULE_SHIFT_EMPLOYEE_SCHEMA = Yup.object().shape({
  account: Yup.string()
    .required(t('yup.field_required')),
  account2: Yup.string(),
  dateStart: Yup.date()
    .required(t('yup.field_required')),
  // dateEnd: Yup.date()
  })
