import { t } from 'i18next'
import * as Yup from 'yup'

export const EXPENSES_EXPORT_SCHEMA = Yup.object().shape({
    dateStart: Yup.date()
      .required(t('yup.field_required')),
    dateEnd: Yup.date()
      .required(t('yup.field_required')),
  })
