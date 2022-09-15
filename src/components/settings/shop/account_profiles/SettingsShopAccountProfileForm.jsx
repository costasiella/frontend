import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'


import {
  Button,
  Card,
  Form,
} from "tabler-react"


const SettingsShopAccountProfileForm = ({ t, history, isSubmitting, errors, values, returnUrl }) => (
  <FoForm>
      <Card.Body>
          <Form.Group label={t('settings.shop.account_profiles.required_fields')}>
            <Field component="select" 
              name="shop_account_profile_required_fields" 
              className={(errors.shop_account_profile_required_fields) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off">
                <option value="MINIMAL">{t("settings.shop.account_profiles.options.minimal")}</option>
                <option value="CONTACT">{t("settings.shop.account_profiles.options.contact")}</option>
            </Field>
            <ErrorMessage name="shop_account_profile_required_fields" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(SettingsShopAccountProfileForm))
