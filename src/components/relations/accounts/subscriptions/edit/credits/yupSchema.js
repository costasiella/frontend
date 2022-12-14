import { t } from 'i18next'
import * as Yup from 'yup'

export const ACCOUNT_SUBSCRIPTION_CREDIT_SCHEMA = Yup.object().shape({
  expiration: Yup.date()
    .required(t('yup.field_required')),
  })