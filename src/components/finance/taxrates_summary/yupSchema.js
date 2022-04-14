import { t } from 'i18next'
import * as Yup from 'yup'

export const TAX_SUMMARY_SCHEMA = Yup.object().shape({
    dateStart: Yup.date()
      .typeError(t('yup.please_select_a_date'))
      .required(t('yup.field_required')),
    dateEnd: Yup.date()
      .typeError(t('yup.please_select_a_date'))
      .required(t('yup.field_required')),
  })
