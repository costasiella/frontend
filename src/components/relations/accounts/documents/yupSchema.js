import { t } from 'i18next'
import * as Yup from 'yup'

export const DOCUMENT_SCHEMA = Yup.object().shape({
    description: Yup.string()
      .min(3, t('yup.min_len_3'))
      .required(t('yup.field_required')),
  })
