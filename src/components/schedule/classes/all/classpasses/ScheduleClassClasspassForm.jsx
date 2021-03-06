import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import {
  Dimmer,
  Grid,
  Form,
  Text
} from "tabler-react"

import FormHelp from "../../../../ui/FormHelp"


const ScheduleClassClasspassForm = ({ t, history, match, isSubmitting, setSubmitting, submitForm, errors, values, setFieldTouched, setFieldValue }) => (
  <FoForm>
    <Dimmer active={isSubmitting} loader={isSubmitting} >
      <Grid.Row>
        <Grid.Col>
          <Form.Group className='mb-0'>
            <Form.Label className="custom-switch">
              <Field 
                className="custom-switch-input"
                type="checkbox" 
                name="shopBook" 
                onChange={() => {
                  setFieldValue('shopBook', !values.shopBook)
                  setFieldTouched('shopBook', true)
                  if (!values.shopBook) {
                    setFieldValue('attend', true)
                    setFieldTouched('attend', true)
                  }
                  setSubmitting(true)
                  setTimeout(() => {submitForm()}, 200)
                }}
                checked={values.shopBook} />
              <span className="custom-switch-indicator" ></span>
              <span className="custom-switch-description">{t('schedule.classes.classpasses.shop_book')}</span>
            </Form.Label>
            <ErrorMessage name="shopBook" component="div" />   
          </Form.Group>  
        </Grid.Col>
        <Grid.Col>
          <Form.Group className='mb-0'>
            <Form.Label className="custom-switch">
              <Field 
                className="custom-switch-input"
                type="checkbox" 
                name="attend" 
                disabled={(values.shopBook)}
                onChange={() => {
                  setFieldValue('attend', !values.attend)
                  setFieldTouched('attend', true)
                  setSubmitting(true)
                  setTimeout(() => {submitForm()}, 200)
                }}
                checked={values.attend} />
              <span className="custom-switch-indicator" ></span>
              <span className="custom-switch-description">{t('general.attend')}</span>
            </Form.Label>
            {/* Show message to inform user they can't disable attend while enroll or shopBook is enabled*/}
            { (values.shopBook) ? <div>
                <Text.Small>{t('schedule.classes.classpasses.attend_disabled')}</Text.Small> { ' ' }
                <FormHelp message={t('schedule.classes.classpasses.attend_disabled_help')} />
              </div> : "" }
            <ErrorMessage name="attend" component="div" />   
          </Form.Group>  
        </Grid.Col>
      </Grid.Row>
    </Dimmer>
  </FoForm>
);

export default withTranslation()(withRouter(ScheduleClassClasspassForm))