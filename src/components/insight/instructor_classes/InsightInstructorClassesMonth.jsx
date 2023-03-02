import React, { useContext, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import moment from 'moment'

import {
  Button,
  Card,
  Container,
  Dimmer,
  Icon,
  List,
  Page
} from "tabler-react"

import AppSettingsContext from '../../../context/AppSettingsContext'
import SiteWrapper from '../../../SiteWrapper'
import { dateToLocalISO } from '../../../../tools/date_tools'
import ButtonBack from '../../../ui/ButtonBack';

// import { INVOICES_EXPORT_SCHEMA } from './yupSchema'
import { GET_INSTRUCTORS_QUERY } from './queries'
import InsightInstructorClassesMonthBase from './InsightInstructorClassesMonthBase'
import InsightInstructorClassesForm from './InsightInstructorClassesForm';
import moment from 'moment'


function InsightInstructorClassesMonth({t, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const [prepared, setPrepared] = useState(false)

  const cardTitle = t("finance.invoices.export.title")
  const returnUrl = "/finance/invoices" 

  const { loading, error, data } = useQuery(GET_INSTRUCTORS_QUERY)

  if (loading) {
    return (
      <InsightInstructorClassesMonthBase>
        <Card title={cardTitle}>
          <Card.Body>
            <Dimmer active={true} loader={true} />
          </Card.Body>
        </Card>
      </InsightInstructorClassesMonthBase>
    )
  }

  if (error) {
    console.error(error)
    return (
      <InsightInstructorClassesMonthBase>
        <Card title={cardTitle}>
          <Card.Body>
            {t("general.error_sad_smiley")}
          </Card.Body>
        </Card>
      </InsightInstructorClassesMonthBase>
    )
  }  


  return (
    <InsightInstructorClassesMonthBase>
      <Card title={cardTitle}>
        <Formik
        initialValues={{ 
          year: year,
          month: month,
          instructor: ""
        }}
        // validationSchema={INVOICES_EXPORT_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            // execute lazy query to fetch classes for instructor
            
            setSubmitting(false)
            setPrepared(true)  
        }}
        >
        {({ isSubmitting, setFieldValue, setFieldTouched, errors, values, touched }) => (
          <InsightInstructorClassesForm
            inputData={data}
            isSubmitting={isSubmitting}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            errors={errors}
            values={values}
            returnUrl={returnUrl}
          />
          )
        }
      </Formik>
    </Card>
    {/* Prepared & loaded lazy query */}
    {(prepared) ? 
    // List instructor classes in this card
      <Card title={t("finance.invoices.export.ready.title")}>
        <Card.Body>
          {t("finance.invoices.export.ready.explanation")}
          <List>
            <List.Item>
              {t("general.period")}{ ": " } 
              {moment(dateStart).format(dateFormat)} { " - " }
              {moment(dateEnd).format(dateFormat)}
            </List.Item>
            <List.Item>
              {t("general.status")}: {t(`finance.invoices.status.${status}`)}
            </List.Item>
          </List>
        </Card.Body>
      </Card>
      : ""}
    </InsightInstructorClassesMonthBase>
  )
}

export default withTranslation()(withRouter(InsightInstructorClassesMonth))