import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { Link } from "react-router-dom"
import { v4 } from 'uuid'

import {
  Button,
  Card,
  Grid,
  Form,
} from "tabler-react"


function ScheduleEventSubscriptionGroupDiscountForm ({ 
  t, 
  history, 
  match, 
  isSubmitting, 
  errors, 
  values, 
  returnUrl,
  inputData,
  setFieldTouched,
  setFieldValue,
})   
{
  return (
    <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.subscription_group')}>
              <Field component="select" 
                    name="organizationSubscriptionGroup" 
                    className={(errors.organizationSubscriptionGroup) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off">
                <option value="" key={v4()}>{t("general.please_select")}</option>
                {inputData.organizationSubscriptionGroups.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.name}</option>
                )}
              </Field>
              <ErrorMessage name="organizationSubscriptionGroup" component="span" className="invalid-feedback" />
            </Form.Group> 
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('schedule.events.earlybirds.discountPercentage')}>
              <Field type="text" 
                    name="discountPercentage" 
                    className={(errors.discountPercentage) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
              <ErrorMessage name="discountPercentage" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Footer>
          <Button 
            color="primary"
            className="pull-right" 
            type="submit" 
            disabled={isSubmitting}
          >
            {t('general.submit')}
          </Button>
          <Link to={returnUrl}>
            <Button color="link" role="button">
                {t('general.cancel')}
            </Button>
          </Link>
      </Card.Footer>
    </FoForm>
  )
}

export default withTranslation()(withRouter(ScheduleEventSubscriptionGroupDiscountForm))
