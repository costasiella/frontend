import { t } from 'i18next'
import * as Yup from 'yup'

export const SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT_SCHEMA = Yup.object().shape({
  organizationSubscriptionGroup: Yup.string()
    .required(t('yup.field_required')),
  discountPercentage: Yup.number()
    .required(t('yup.field_required')),
})