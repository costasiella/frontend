// @flow

import React, {Component } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNT_CLASSPASSES_QUERY, GET_ACCOUNT_CLASSPASS_QUERY, UPDATE_ACCOUNT_CLASSPASS } from './queries'
import { CLASSPASS_SCHEMA } from './yupSchema'
import AccountClasspassForm from './AccountClasspassForm'
import RelationsAccountProfileBase from '../RelationsAccountProfileBase';

import {
  Page,
  Grid,
  Icon,
  Button,
  Card,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import { dateToLocalISO } from '../../../../tools/date_tools'

import ProfileMenu from "../ProfileMenu"


function AccountClasspassEdit({t, history, match}) {
  const id = match.params.id
  const accountId = match.params.account_id
  const activeLink = "classpasses"
  const cardTitle = t('relations.account.classpasses.title_edit')
  const returnUrl = `/relations/accounts/${accountId}/classpasses`
  
  const {loading, error, data} = useQuery(GET_ACCOUNT_CLASSPASS_QUERY, {
    variables: { id: id, accountId: accountId }
  })
  const [updateClasspass] = useMutation(UPDATE_ACCOUNT_CLASSPASS)

  const sidebarButton = <Link to={returnUrl}>
    <Button color="primary btn-block mb-6">
      <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
    </Button>
  </Link>

  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink} sidebarButton={sidebarButton}>
      <Card title={cardTitle}>
        {t('general.loading_with_dots')}
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return (
    <RelationsAccountProfileBase activeLink={activeLink} sidebarButton={sidebarButton}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </RelationsAccountProfileBase>
  )

  const inputData = data
  const account = data.account
  const initialdata = data.accountClasspass

    // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  let dateEnd = null
  if (initialdata.dateStart) {
    dateStart = new Date(initialdata.dateStart)
  }
  if (initialdata.dateEnd) {
    dateEnd = new Date(initialdata.dateEnd)
  }

  return (
    <RelationsAccountProfileBase
      activeLink={activeLink}
      user={account}
      sidebarButton={sidebarButton} 
    >
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={{ 
              organizationClasspass: initialdata.organizationClasspass.id,
              dateStart: dateStart,
              dateEnd: dateEnd,
              note: initialdata.note,
            }}
            validationSchema={CLASSPASS_SCHEMA}
            onSubmit={(values, { setSubmitting }, errors) => {
                console.log('submit values:')
                console.log(values)
                console.log(errors)

                
                let dateEnd
                if (values.dateEnd) {
                  dateEnd = dateToLocalISO(values.dateEnd)
                } else {
                  dateEnd = values.dateEnd
                }

                updateClasspass({ variables: {
                  input: {
                    id: id,
                    organizationClasspass: values.organizationClasspass,
                    dateStart: dateToLocalISO(values.dateStart),
                    dateEnd: dateEnd,
                    note: values.note,
                  }
                }, refetchQueries: [
                    {query: GET_ACCOUNT_CLASSPASSES_QUERY, variables: { accountId: accountId }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    toast.success((t('relations.account.classpasses.toast_edit_success')), {
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
              <AccountClasspassForm
                inputData={inputData}
                isSubmitting={isSubmitting}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                errors={errors}
                values={values}
                returnUrl={returnUrl}
              >
                {console.log(errors)}
              </AccountClasspassForm>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </RelationsAccountProfileBase>
  )
}

export default withTranslation()(withRouter(AccountClasspassEdit))
