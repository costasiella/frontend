import { t } from 'i18next'
import * as Yup from 'yup'

export const MAILCHIMP_LIST_SCHEMA = Yup.object().shape({
    name: Yup.string()
      .min(3, t('yup.min_len_3'))
      .required(t('yup.field_required')),
    description: Yup.string()
      .min(3, t('yup.min_len_3'))
      .required(t('yup.field_required')),
    frequency: Yup.string()
      .min(3, t('yup.min_len_3'))
      .required(t('yup.field_required')),
    mailchimpListId: Yup.string()
      .min(3, t('yup.min_len_3'))
      .required(t('yup.field_required')),
  })
