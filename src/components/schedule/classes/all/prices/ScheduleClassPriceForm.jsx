import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from 'uuid'

import {
  Card,
  Grid,
  Form,
} from "tabler-react"

import ButtonFormCancel from '../../../../ui/ButtonFormCancel'
import ButtonFormSubmit from '../../../../ui/ButtonFormSubmit'
import CSDatePicker from "../../../../ui/CSDatePicker"

const ScheduleClassPriceForm = ({ t, history, match, isSubmitting, errors, values, inputData, returnUrl, setFieldTouched, setFieldValue }) => (
  <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.date_start')}>
              <CSDatePicker 
                selected={values.dateStart}
                onChange={(date) => setFieldValue("dateStart", date)}
                onBlur={() => setFieldTouched("dateStart", true)}
              />
              <ErrorMessage name="dateStart" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.date_end')}>
              <CSDatePicker 
                selected={values.dateEnd}
                onChange={(date) => setFieldValue("dateEnd", date)}
                onBlur={() => setFieldTouched("dateEnd", true)}
              />
              <ErrorMessage name="dateEnd" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('schedule.classes.classpass_dropin')}>
              <Field component="select" 
                      name="organizationClasspassDropin" 
                      className={(errors.organizationClasspassDropin) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off">
                {console.log("query data in schedule class price form:")}
                {console.log(inputData)}
                <option value="" key={v4()}>{t('general.please_select')}</option>
                {inputData.organizationClasspasses.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.name}</option>
                )}
              </Field>
              <ErrorMessage name="organizationClasspassDropin" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('schedule.classes.classpass_trial')}>
              <Field component="select" 
                      name="organizationClasspassTrial" 
                      className={(errors.organizationClasspassTrial) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off">
                <option value="" key={v4()}>{t('')}</option>
                {inputData.organizationClasspasses.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.name}</option>
                )}
              </Field>
              <ErrorMessage name="organizationClasspassTrial" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Footer>
        <ButtonFormSubmit disabled={isSubmitting} />
        <ButtonFormCancel returnUrl={returnUrl} />
      </Card.Footer>
  </FoForm>
);

export default withTranslation()(withRouter(ScheduleClassPriceForm))