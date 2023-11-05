import { t } from 'i18next'
import * as Yup from 'yup'

export const OPEN_INVOICES_SCHEMA = Yup.object().shape({
    date: Yup.date()
      .typeError(t('yup.date_required'))
      .required(t('yup.field_required')),
  })
