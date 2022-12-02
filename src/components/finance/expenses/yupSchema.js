import { t } from 'i18next'
import * as Yup from 'yup'

export const EXPENSE_SCHEMA = Yup.object().shape({
  dateStart: Yup.date()
  .required(t('yup.field_required')),
  summary: Yup.string()
    .min(3, t('yup.min_len_3'))
    .required(t('yup.field_required')),
  description: Yup.string(),
  amount: Yup.number()
    .required(t('yup.field_required')),
  tax: Yup.number()
    .required(t('yup.field_required')),
  financeTaxRate: Yup.string(),
  financeGlaccount: Yup.string(),
  financeCostcenter: Yup.string(),
})
