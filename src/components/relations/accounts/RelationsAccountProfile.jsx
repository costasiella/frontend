import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNTS_QUERY, GET_ACCOUNT_QUERY, UPDATE_ACCOUNT } from './queries'
import { ACCOUNT_SCHEMA } from './yupSchema'

import {
  Card,
} from "tabler-react"

import { dateToLocalISO } from '../../../tools/date_tools'
import { get_list_query_variables } from "./tools"
import RelationsAccountProfileForm from "./RelationsAccountProfileForm"
import RelationsAccountProfileBase from './RelationsAccountProfileBase'


function RelationsAccountProfile({t, match}) {
  const accountId = match.params.account_id
  const activeLink = "profile"

  const {loading, error, data} = useQuery(GET_ACCOUNT_QUERY, {
    variables: {id: accountId},
    fetchPolicy: "network-only"
  })
  const [updateAccount] = useMutation(UPDATE_ACCOUNT)

  if (loading) return (
    <RelationsAccountProfileBase activeLink={activeLink}>
      <Card>
        <Card.Header>
          <Card.Title>{t('relations.accounts.profile')}</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>  
        </Card.Body>
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return (
    <RelationsAccountProfileBase activeLink={activeLink}>
      {console.log(error)}
      <Card>
        <Card.Header>
          <Card.Title>{t('relations.accounts.profile')}</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>{t('general.error_sad_smiley')}</p>
        </Card.Body>
      </Card>
    </RelationsAccountProfileBase>
  )

  const account = data.account
  console.log(account)

  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateOfBirth = null
  if (account.dateOfBirth) {
    dateOfBirth = new Date(account.dateOfBirth)
  }

  let initialValues = { 
    customer: account.customer, 
    instructor: account.instructor, 
    employee: account.employee, 
    firstName: account.firstName, 
    lastName: account.lastName, 
    email: account.email,
    dateOfBirth: dateOfBirth,
    gender: account.gender,
    emergency: account.emergency,
    phone: account.phone,
    mobile: account.mobile,
    address: account.address,
    postcode: account.postcode,
    city: account.city,
    country: account.country,
    keyNumber: account.keyNumber
  }

  if (account.organizationDiscovery) {
    initialValues.organizationDiscovery = account.organizationDiscovery.id
  }

  if (account.organizationLanguage) {
    initialValues.organizationLanguage = account.organizationLanguage.id
  }

  if (account.invoiceToBusiness) {
    initialValues.invoiceToBusiness = account.invoiceToBusiness.id
  }

  return (
    <RelationsAccountProfileBase 
      user={account}
      activeLink={activeLink}
    >
      <Card>
        <Card.Header>
          <Card.Title>{t('relations.accounts.profile')}</Card.Title>
        </Card.Header>

        <Formik
            initialValues={initialValues}
            validationSchema={ACCOUNT_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                let input_vars = {
                  id: accountId,
                  customer: values.customer,
                  instructor: values.instructor,
                  employee: values.employee,
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  gender: values.gender,
                  emergency: values.emergency,
                  phone: values.phone,
                  mobile: values.mobile,
                  address: values.address,
                  postcode: values.postcode,
                  city: values.city,
                  country: values.country,
                  keyNumber: values.keyNumber,
                  organizationDiscovery: values.organizationDiscovery,
                  organizationLanguage: values.organizationLanguage,
                  invoiceToBusiness: values.invoiceToBusiness
                }

                if (values.dateOfBirth) {
                  input_vars['dateOfBirth'] = dateToLocalISO(values.dateOfBirth)
                } 

                updateAccount({ variables: {
                  input: input_vars
                }, refetchQueries: [
                    // Refetch list
                    {query: GET_ACCOUNTS_QUERY, variables: get_list_query_variables()},
                    // Refresh local cached results for this account
                    {query: GET_ACCOUNT_QUERY, variables: {id: accountId}}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    toast.success((t('relations.accounts.toast_edit_success')), {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    setSubmitting(false)
                  }).catch((error) => {
                    toast.error((t('general.toast_server_error')) +  error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    console.log('there was an error sending the query', error)
                    setSubmitting(false)
                  })
            }}
            >
            {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
              <RelationsAccountProfileForm
                isSubmitting={isSubmitting}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                errors={errors}
                values={values}
                inputData={data}
              />
            )}
          </Formik>
      </Card>
    </RelationsAccountProfileBase>
  )
}

export default withTranslation()(withRouter(RelationsAccountProfile))