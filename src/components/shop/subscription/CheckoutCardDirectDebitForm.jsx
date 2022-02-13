import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, ErrorMessage } from 'formik'

import {
  Button,
  Form,
  Icon
} from "tabler-react"

import CSDatePicker from "../../ui/CSDatePicker"
import cs_django_links from "../../../tools/cs_django_links"


const ShopClasspassForm = ({ t, isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
    <FoForm>
      <Form.Group label={t('shop.subscription.start_on')}>
        <CSDatePicker
          selected={values.dateStart}
          onChange={(date) => setFieldValue("dateStart", date)}
          onBlur={() => setFieldTouched("dateStart", true)}
        />
        <ErrorMessage name="dateStart" component="span" className="invalid-feedback" />
      </Form.Group>
      <small className="text-muted">
        {t("shop.order.by_placing_this_order")} <br />
        <ul>
          <li>{t("shop.order.agree_terms")} {" "}
            <a target="_blank" 
              rel="noreferrer" 
              href={cs_django_links.EXPORT_TERMS_AND_CONDITIONS}
            >
              {t("general.terms_and_conditions")}
            </a>
          </li>
          <li>{t("shop.order.agree_privacy")} {" "}
            <a target="_blank" 
              rel="noreferrer" 
              href={cs_django_links.EXPORT_PRIVACY_POLICY}
            >
              {t("general.privacy_policy")}
            </a>
          </li>
        </ul>
      </small>
      <Button 
        block
        color="primary"
        className="pull-right" 
        type="submit" 
        disabled={isSubmitting || !values.dateStart}
      >
        {(!values.dateStart) ? t("shop.subscription.please_select_date") : t("general.i_agree")}
        {" "} <Icon name="chevron-right" />
      </Button>
    </FoForm>
)

export default withTranslation()(withRouter(ShopClasspassForm))