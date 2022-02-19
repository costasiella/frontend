import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import {
  Container,
  Grid,
  Page
} from "tabler-react";

import SiteWrapper from "../../SiteWrapper"
import InsightBackHome from '../InsightBackHome'

import CSLS from "../../../tools/cs_local_storage"
import InsightTrialpassesFilter from './InsightTrialpassesFilter';
import { getListQueryVariables } from './tools'

// Set some initial values for dates, if not found
// if (!localStorage.getItem(CSLS.INSIGHT_CLASSPASSES_YEAR)) {
//   console.log('year from not found... defaulting to today...')
//   localStorage.setItem(CSLS.INSIGHT_CLASSPASSES_YEAR, moment().format('YYYY')) 
// } 

function InsightTrialpassesBase ({ t, history, children, year, month, refetch=f=>f }) {
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("insight.title")} subTitle={t("insight.trialpasses.title") + " " + year + "-" + month}>
            <div className="page-options d-flex">
              <InsightBackHome />
              {/* <Button.List className="schedule-list-page-options-btn-list">
                <Button 
                  icon="chevron-left"
                  color="secondary"
                  onClick={ () => {
                    let previousYear = parseInt(localStorage.getItem(CSLS.INSIGHT_CLASSPASSES_YEAR)) - 1                    
                    localStorage.setItem(CSLS.INSIGHT_CLASSPASSES_YEAR, previousYear) 

                    refetchData(previousYear)
                }} />
                <Button 
                  icon="sunset"
                  color="secondary"
                  onClick={ () => {
                    let currentYear = moment().format('YYYY')
                    localStorage.setItem(CSLS.INSIGHT_CLASSPASSES_YEAR, currentYear) 
                    
                    refetchData(currentYear)
                }} />
                <Button 
                  icon="chevron-right"
                  color="secondary"
                  onClick={ () => {
                    let nextYear = parseInt(localStorage.getItem(CSLS.INSIGHT_CLASSPASSES_YEAR)) + 1                    
                    localStorage.setItem(CSLS.INSIGHT_CLASSPASSES_YEAR, nextYear) 

                    refetchData(nextYear)
                }} />
              </Button.List>  */}
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
            <Formik 
                initialValues={{
                  year: localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_YEAR),
                  month: localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_MONTH)
                }}
                onSubmit={(values, { setSubmitting }) => {
                  console.log("hello world")
                  localStorage.setItem(CSLS.INSIGHT_TRIALPASSES_YEAR, values.year)
                  localStorage.setItem(CSLS.INSIGHT_TRIALPASSES_MONTH, values.month)

                  const listVariables = getListQueryVariables()
                  refetch(listVariables)
                  setSubmitting(false)
                  
                }}
              >
                {({ isSubmitting, errors, values }) => (
                <InsightTrialpassesFilter 
                  isSubmitting={isSubmitting}
                  errors={errors}
                  values={values}
                />
                )}
              </Formik>
            </Grid.Col>
          </Grid.Row>
        </Container>  
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(InsightTrialpassesBase))