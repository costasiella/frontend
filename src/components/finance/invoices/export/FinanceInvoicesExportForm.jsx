import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from "uuid"

import {
  Button,
  Card,
  Form,
  Grid
  } from "tabler-react"
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import CSDatePicker from "../../../ui/CSDatePicker"
import ButtonFormCancel from '../../../ui/ButtonFormCancel'


const ScheduleClassForm = ({ t, history, isSubmitting, setFieldValue, setFieldTouched, errors, values, returnUrl }) => (
    <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={(values.frequencyType === "SPECIFIC") ? t('general.date') : t('general.date_start')}>
              <CSDatePicker 
                className={(errors.dateStart) ? "form-control is-invalid" : "form-control"} 
                selected={values.dateStart}
                onChange={(date) => {
                  setFieldValue("dateStart", date)
                  setFieldTouched("dateStart", true)
                }}
                onBlur={() => setFieldTouched("dateStart", true)}
              />
              <ErrorMessage name="dateStart" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.date_end')}>
              <CSDatePicker 
                selected={values.dateEnd}
                onChange={(date) => {
                  setFieldValue("dateEnd", date)
                  setFieldTouched("dateEnd", true)
                }}
                onBlur={() => setFieldTouched("dateEnd", true)}
                placeholderText={t('schedule.classes.placeholder_enddate')}
              />
              <ErrorMessage name="dateEnd" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.status')}>
              <Field component="select" 
                    name="status" 
                    className={(errors.status) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off">
                <option value="ALL" key={v4()}>{t('general.all')}</option>
                <option value="DRAFT" key={v4()}>{t('finance.invoices.status.DRAFT')}</option>
                <option value="SENT" key={v4()}>{t('finance.invoices.status.SENT')}</option>
                <option value="PAID" key={v4()}>{t('finance.invoices.status.PAID')}</option>
                <option value="CANCELLED" key={v4()}>{t('finance.invoices.status.CANCELLED')}</option>
              </Field>
              <ErrorMessage name="status" component="span" className="invalid-feedback" />
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
          {t('finance.invoices.export.btn_prepare_export')}
        </Button>
        <ButtonFormCancel returnUrl={returnUrl} />
      </Card.Footer>
    </FoForm>
)
  
  
  export default withTranslation()(withRouter(ScheduleClassForm))