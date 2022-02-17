import * as Yup from 'yup'

export const INVOICE_GROUP_DEFAULT_SCHEMA = Yup.object().shape({
    financeInvoiceGroup: Yup.string(),
  })
