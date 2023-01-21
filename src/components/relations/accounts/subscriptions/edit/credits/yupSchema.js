import { t } from 'i18next'
import * as Yup from 'yup'

export const ACCOUNT_SUBSCRIPTION_CREDIT_ADD_SCHEMA = Yup.object().shape({
  amount: Yup.number()
    .required(t('yup.field_required'))
    .min(1)
    .max(200)
  })

export const ACCOUNT_SUBSCRIPTION_CREDIT_EDIT_SCHEMA = Yup.object().shape({
  expiration: Yup.date()
    .required(t('yup.field_required')),
  })