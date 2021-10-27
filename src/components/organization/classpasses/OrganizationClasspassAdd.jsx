import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'

import { GET_CLASSPASSES_QUERY, GET_INPUT_VALUES_QUERY, CREATE_CLASSPASS } from './queries'
import { CLASSPASS_SCHEMA } from './yupSchema'

import {
  Card,
  Dimmer
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationClasspassesBase from './OrganizationClasspassesBase';
import OrganizationClasspassForm from "./OrganizationClasspassForm"


function OrganizationClasspassAdd({t, match, history}) {
  const cardTitle = t('organization.classpasses.title_add')
  const returnUrl = "/organization/classpasses"
  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY)
  const [createClasspass] = useMutation(CREATE_CLASSPASS)

  if (loading) return (
    <OrganizationClasspassesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasspassesBase>
  )

  if (error) return (
    <OrganizationClasspassesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationClasspassesBase>
  )

                    
  console.log('query data')
  console.log(data)
  const initialData = data

  return (
    <OrganizationClasspassesBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            displayPublic: true,
            displayShop: true,
            trialPass: false,
            name: "",
            description: "",
            price: 0,
            financeTaxRate: "",
            validity: 1,
            validityUnit: "MONTHS",
            classes: 1,
            unlimited: false,
            organizationMembership: "",
            quickStatsAmount: 0,
            financeGlaccount: "",
            financeCostcenter: ""
          }}
          validationSchema={CLASSPASS_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              createClasspass({ variables: {
                input: {
                  displayPublic: values.displayPublic,
                  displayShop: values.displayShop,
                  trialPass: values.trialPass,
                  name: values.name,
                  description: values.description,
                  price: values.price,
                  financeTaxRate: values.financeTaxRate,
                  validity: values.validity,
                  validityUnit: values.validityUnit,
                  classes: values.classes,
                  unlimited: values.unlimited,
                  organizationMembership: values.organizationMembership,
                  quickStatsAmount: values.quickStatsAmount,
                  financeGlaccount: values.financeGlaccount,
                  financeCostcenter: values.financeCostcenter
                }
              }, refetchQueries: [
                  {query: GET_CLASSPASSES_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('organization.classpasses.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, setFieldValue, setFieldTouched, errors, values }) => (
            <OrganizationClasspassForm 
              initialData = {initialData}
              isSubmitting = {isSubmitting}
              setFieldValue = {setFieldValue}
              setFieldTouched = {setFieldTouched}
              errors = {errors}
              values = {values}
            />
          )}
        </Formik>
      </Card>
    </OrganizationClasspassesBase>
  )
}


export default withTranslation()(withRouter(OrganizationClasspassAdd))