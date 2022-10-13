import { t } from 'i18next'
import * as Yup from 'yup'

export const QUOTE_GROUP_SCHEMA = Yup.object().shape({
    name: Yup.string()
      .min(3, t('yup.min_len_3'))
      .required(t('yup.field_required')),
    expiresAfterDays: Yup.number()
      .moreThan(0, t('yup.field_above_0'))
      .required(t('yup.field_required')),
    nextId: Yup.number(),
    prefix: Yup.string(),
    prefixYear: Yup.boolean(),
    autoResetPrefixYear: Yup.boolean(),
    terms: Yup.string(),
    footer: Yup.string(),
  })
