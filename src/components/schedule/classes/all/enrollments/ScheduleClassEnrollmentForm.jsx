import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, ErrorMessage } from 'formik'

import {
  Alert,
  Button,
  Card,
  Grid,
  Form,
} from "tabler-react"

import CSDatePicker from "../../../../ui/CSDatePicker"
import ButtonFormCancel from '../../../../ui/ButtonFormCancel'


const ScheduleClassEnrollmentForm = ({ t, history, match, isSubmitting, errors, values, returnUrl, setFieldTouched, setFieldValue }) => (
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
                placeholderText={t('schedule.classes.enrollments.placeholder_date_end')}
                selected={values.dateEnd}
                onChange={(date) => setFieldValue("dateEnd", date)}
                onBlur={() => setFieldTouched("dateEnd", true)}
              />
              <ErrorMessage name="dateEnd" component="span" className="invalid-feedback" />
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
          <ButtonFormCancel returnUrl={returnUrl} />
          {(isSubmitting) ? 
            <Alert type="primary" hasExtraSpace>
              <strong>{t('general.please_wait')}</strong> {t('schedule.classes.enrollments.toast_creating_might_take_a_while')}
            </Alert> : 
          ""
          }
      </Card.Footer>
  </FoForm>
);

export default withTranslation()(withRouter(ScheduleClassEnrollmentForm))