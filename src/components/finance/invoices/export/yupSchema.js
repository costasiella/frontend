import { t } from 'i18next'
import * as Yup from 'yup'

export const INVOICES_EXPORT_SCHEMA = Yup.object().shape({
    status: Yup.string()
      .required(t('yup.field_required')),
    dateStart: Yup.date()
      .required(t('yup.field_required')),
    dateEnd: Yup.date()
      .required(t('yup.field_required')),
  })
