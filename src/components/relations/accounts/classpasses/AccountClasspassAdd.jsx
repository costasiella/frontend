// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNT_CLASSPASSES_QUERY, GET_INPUT_VALUES_QUERY, CREATE_ACCOUNT_CLASSPASS } from './queries'
import { CLASSPASS_SCHEMA } from './yupSchema'
import AccountClasspassForm from './AccountClasspassForm'
import RelationsAccountProfileBase from '../RelationsAccountProfileBase';

import {
  Icon,
  Button,
  Card,
} from "tabler-react";
import { dateToLocalISO } from '../../../../tools/date_tools'



function AccountClasspassAdd({t, match, history}) {
  const accountId = match.params.account_id
  const activeLink = "classpasses"
  const cardTitle = t('relations.account.classpasses.title_add')
  const returnUrl = `/relations/accounts/${accountId}/classpasses`
  
  const {loading, error, data} = useQuery(GET_INPUT_VALUES_QUERY, { 
    variables: { accountId: accountId }
  })
  const [createAccountClasspass] = useMutation(CREATE_ACCOUNT_CLASSPASS)

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
          <Formik
            initialValues={{ 
              organizationClasspass: "",
              dateStart: new Date(),
              note: "",
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

                createAccountClasspass({ variables: {
                  input: {
                    account: accountId, 
                    organizationClasspass: values.organizationClasspass,
                    dateStart: dateToLocalISO(values.dateStart),
                    dateEnd: dateEnd,
                    note: values.note,
                  }
                }, refetchQueries: [
                    {query: GET_ACCOUNT_CLASSPASSES_QUERY, variables: { accountId: accountId}}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    const classpassId = data.createAccountClasspass.accountClasspass.id
                    history.push(`/relations/accounts/${accountId}/classpasses/edit/${classpassId}`)
                    toast.success((t('relations.account.classpasses.toast_add_success')), {
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
      </Card>
    </RelationsAccountProfileBase>
  ) 
}

export default withTranslation()(withRouter(AccountClasspassAdd))
