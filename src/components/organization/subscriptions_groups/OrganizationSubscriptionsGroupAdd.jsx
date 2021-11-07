// @flow

import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'

import { GET_SUBSCRIPTION_GROUPS_QUERY, ADD_SUBSCRIPTION_GROUP } from './queries'
import { SUBSCRIPTION_GROUP_SCHEMA } from './yupSchema'
import OrganizationSubscriptionGroupForm from './OrganizationSubscriptionsGroupForm'

import {
  Card,
} from "tabler-react"
import HasPermissionWrapper from "../../HasPermissionWrapper"

import OrganizationSubscriptionsGroupsBase from './OrganizationSubscriptionsGroupsBase';

function OrganizationSubscriptionGroupAdd({t, history}) {
  const returnUrl = "/organization/subscriptions/groups"
  const [addSubscriptionGroup] = useMutation(ADD_SUBSCRIPTION_GROUP)

  return (
    <OrganizationSubscriptionsGroupsBase showBack={true}>
      <Card>
        <Card.Header>
          <Card.Title>{t('organization.subscription_groups.title_add')}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={{ name: '', description: '' }}
          validationSchema={SUBSCRIPTION_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            addSubscriptionGroup({ variables: {
              input: {
                name: values.name, 
                description: values.description,
              }
            }, refetchQueries: [
                {query: GET_SUBSCRIPTION_GROUPS_QUERY}
            ]})
            .then(({ data }) => {
                console.log('got data', data);
                history.push(returnUrl)
                toast.success((t('organization.subscription_groups.toast_add_success')), {
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
            {({ isSubmitting, errors }) => (
              <OrganizationSubscriptionGroupForm
                isSubmitting={isSubmitting}
                errors={errors}
                returnUrl={returnUrl}
              />
            )}
        </Formik>
      </Card>
    </OrganizationSubscriptionsGroupsBase>
  )
}

export default withTranslation()(withRouter(OrganizationSubscriptionGroupAdd))