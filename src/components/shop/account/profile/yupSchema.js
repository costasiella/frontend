import { t } from 'i18next'
import * as Yup from 'yup'

export const ACCOUNT_SCHEMA_MINIMAL = Yup.object().shape({
    firstName: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    lastName: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    email: Yup.string()
      .email(t('yup.email'))
      .required(t('yup.field_required')),
  })

export const ACCOUNT_SCHEMA_CONTACT = Yup.object().shape({
    firstName: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    lastName: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    email: Yup.string()
      .email(t('yup.email'))
      .required(t('yup.field_required')),
    address: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    postcode: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    city: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    country: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
    phone: Yup.string()
      .min(2, t('yup.min_len_2'))
      .required(t('yup.field_required')),
  })
