import { t } from 'i18next'
import * as Yup from 'yup'

export const ACCOUNT_SUBSCRIPTION_SCHEMA = Yup.object().shape({
    dateStart: Yup.string()
      .nullable()
      .required(t('yup.field_required')),
  })
