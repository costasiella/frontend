import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'


import {
  Button,
  Card,
  Form,
} from "tabler-react"


const SettingsWorkflowShopForm = ({ t, history, isSubmitting, errors, values, returnUrl }) => (
  <FoForm>
      <Card.Body>
          <Form.Group label={t('settings.workflow.shop.subscription_payment_method')}>
            <Field component="select" 
              name="workflow_shop_subscription_payment_method" 
              className={(errors.workflow_shop_subscription_payment_method) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off">
                <option value="MOLLIE">{t("finance.payment_methods.mollie")}</option>
                <option value="DIRECTDEBIT">{t("finance.payment_methods.direct_debit")}</option>
            </Field>
            <ErrorMessage name="workflow_shop_subscription_payment_method" component="span" className="invalid-feedback" />
          </Form.Group>
      </Card.Body>
      <Card.Footer>
          <Button 
            color="primary"
            type="submit" 
            disabled={isSubmitting}
          >
            {t('general.submit')}
          </Button>
          {/* <Link to={returnUrl}>
            <Button 
              type="button" 
              color="link">
                {t('general.cancel')}
            </Button>
          </Link> */}
      </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(SettingsWorkflowShopForm))
