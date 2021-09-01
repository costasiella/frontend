import { t } from 'i18next'
import * as Yup from 'yup'

export const LANGUAGE_SCHEMA = Yup.object().shape({
    name: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
  })
