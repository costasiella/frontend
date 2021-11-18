import { t } from 'i18next'
import * as Yup from 'yup'

export const ACCOUNT_BANK_ACCOUNT_SCHEMA = Yup.object().shape({
    holder: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    number: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
  })
