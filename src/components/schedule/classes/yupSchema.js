import { t } from 'i18next'
import * as Yup from 'yup'

export const CLASS_SCHEMA = Yup.object().shape({
    frequencyType: Yup.string()
      .required(t('yup.field_required')),
    organizationLocationRoom: Yup.string()
      .required(t('yup.field_required')),
    organizationClasstype: Yup.string()
      .required(t('yup.field_required')),
    dateStart: Yup.date()
      .typeError(t('yup.date_required'))
      .required(t('yup.field_required')),
    timeStart: Yup.date()
      .typeError(t('yup.time_required'))
      .required(t('yup.field_required')),
    timeEnd: Yup.date()
      .typeError(t('yup.time_required'))
      .required(t('yup.field_required')),
    spaces: Yup.number()
      .required(t('yup.field_required')),
    walkInSpaces: Yup.number()
      .required(t('yup.field_required')),
    enrollmentSpaces: Yup.number()
      .required(t('yup.field_required')),
  })
