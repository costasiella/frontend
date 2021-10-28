import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
    Button,
    Card,
    Grid,
    Icon
  } from "tabler-react"
  import { Form as FoForm, Field, ErrorMessage } from 'formik'


function AutomationAccountSubscriptionCreditExpirationForm({ t, history, isSubmitting, errors, returnUrl}) {
  return (
    <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            {t("automation.account.subscriptions.credits_expiration.explanation_new_expiration")}
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
          {t('general.new_task')} <Icon name="chevron-right" />
        </Button>
        <Link to={returnUrl}>
          <Button color="link">
            {t('general.cancel')}
          </Button>
        </Link>
      </Card.Footer>
    </FoForm>
  )
}
  
export default withTranslation()(withRouter(AutomationAccountSubscriptionCreditExpirationForm))