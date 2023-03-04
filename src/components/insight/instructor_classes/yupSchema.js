import { t } from 'i18next'
import * as Yup from 'yup'

export const INSIGHT_INSTRUCTOR_CLASSES_SCHEMA = Yup.object().shape({
    year: Yup.number()
      .required(t('yup.field_required')),
    month: Yup.number()
      .required(t('yup.field_required')),
    instructor: Yup.string()
      .required(t('yup.field_required')),
  })
