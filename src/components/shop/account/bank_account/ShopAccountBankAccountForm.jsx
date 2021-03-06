// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { Form as FoForm, Field, ErrorMessage } from 'formik'


import {
  Button,
  Card,
  Form,
  Grid
} from "tabler-react"


const ShopAccountBankAccountForm = ({ t, history, isSubmitting, errors, returnUrl }) => (
  <FoForm>
    <Card title={t("shop.account.bank_account.title")} >
    <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('relations.account.bank_accounts.holder')}>
              <Field type="text" 
                      name="holder" 
                      className={(errors.holder) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="bic" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('relations.account.bank_accounts.number')}>
              <Field type="text" 
                      name="number" 
                      className={(errors.number) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="number" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('relations.account.bank_accounts.bic')}>
              <Field type="text" 
                      name="bic" 
                      className={(errors.bic) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="bic" component="span" className="invalid-feedback" />
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
            <Button color="link">
                {t('general.cancel')}
            </Button>
          </Link>
      </Card.Footer>
    </Card>
  </FoForm>
)

export default withTranslation()(withRouter(ShopAccountBankAccountForm))

