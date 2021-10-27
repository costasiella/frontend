// @flow

import React, { Component } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { Formik } from 'formik'

import {
  Alert,
  Page,
  Grid,
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Container,
  Table
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import { TimeStringToJSDateOBJ } from '../../../../../tools/date_tools'
// import { confirmAlert } from 'react-confirm-alert'; // Import
import { toast } from 'react-toastify'
import { class_edit_all_subtitle } from "../tools"

import ContentCard from "../../../../general/ContentCard"
import ClassEditBase from "../ClassEditBase"
import ScheduleClassSubscriptionForm from "./ScheduleClassSubscriptionForm"

import { SCHEDULE_CLASS_SUBSCRIPTION_SCHEMA } from './yupSchema'
import { GET_SCHEDULE_CLASS_SUBSCRIPTIONS_QUERY, UPDATE_SCHEDULE_CLASS_SUBSCRIPTION } from "./queries"


function ScheduleClassSubscriptions({t, match, history}) {
  const classId = match.params.class_id
  const menuActiveLink = "subscriptions"
  const cardTitle = t('schedule.classes.subscriptions.title')
  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_CLASS_SUBSCRIPTIONS_QUERY, { 
    variables: { scheduleItem: classId }
  })
  const [ updateScheduleClassSubscription ] = useMutation(UPDATE_SCHEDULE_CLASS_SUBSCRIPTION)

  const sidebarButton = <HasPermissionWrapper permission="add" resource="scheduleitemsubscription">
    <Link to={"/schedule/classes/all/subscriptions/" + classId + "/add" } >
      <Button color="primary btn-block mb-6">
      <Icon prefix="fe" name="plus-circle" /> {t('schedule.classes.subscriptions.add')}
      </Button>
    </Link>
  </HasPermissionWrapper>

  // Loading
  if (loading) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={sidebarButton}
    >
      <Dimmer active={true} loader={true} />
    </ClassEditBase>
  )
  // Error
  if (error) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={sidebarButton}
    >
      <p>{t('schedule.classes.subscriptions.error_loading')}</p>
    </ClassEditBase>
  )

  // Empty list
  if (!data.scheduleItemOrganizationSubscriptionGroups.edges.length) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={sidebarButton}
    >
      <p>{t('schedule.classes.subscriptions.empty_list')}</p>
    </ClassEditBase>
  )

  return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      defaultCard={false} 
      sidebarButton={sidebarButton}
    >
      <ContentCard 
        cardTitle={cardTitle}
        // headerContent={headerOptions}
        pageInfo={data.scheduleItemOrganizationSubscriptionGroups.pageInfo}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: data.scheduleItemOrganizationSubscriptionGroups.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.scheduleItemOrganizationSubscriptionGroups.edges
            const pageInfo = fetchMoreResult.scheduleItemOrganizationSubscriptionGroups.pageInfo

            return newEdges.length
              ? {
                  // Put the new locations at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  data: { 
                    scheduleItemOrganizationSubscriptionGroups: {
                      __typename: previousResult.scheduleItemOrganizationSubscriptionGroups.__typename,
                      edges: [ ...previousResult.scheduleItemOrganizationSubscriptionGroups.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                }
              : previousResult
            }
          })
        }} >
        <div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.ColHeader>{t('general.subscription')}</Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.scheduleItemOrganizationSubscriptionGroups.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  {console.log(node)}
                  <Table.Col key={v4()}> 
                    {node.organizationSubscriptionGroup.name}
                  </Table.Col>
                  <Table.Col>
                    <Formik
                      initialValues={{  
                        enroll: node.enroll,
                        shopBook: node.shopBook,
                        attend: node.attend
                      }}
                      validationSchema={SCHEDULE_CLASS_SUBSCRIPTION_SCHEMA}
                      onSubmit={(values, { setSubmitting }) => {
                          console.log(values)
                          updateScheduleClassSubscription({ 
                            variables: {
                              input: {
                                id: node.id,
                                enroll: values.enroll,
                                shopBook: values.shopBook,
                                attend: values.attend
                              }
                            }, 
                            refetchQueries: [
                              { query: GET_SCHEDULE_CLASS_SUBSCRIPTIONS_QUERY, 
                                variables: { scheduleItem: classId }
                            }
                          ]})
                          .then(({ data }) => {
                              console.log('got data', data);
                              toast.success((t('schedule.classes.subscriptions.toast_edit_success')), {
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
                      {({ isSubmitting, errors, values, setFieldTouched, setFieldValue, submitForm }) => (
                        <ScheduleClassSubscriptionForm
                          isSubmitting={isSubmitting}
                          setFieldTouched={setFieldTouched}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          values={values}
                          submitForm={submitForm}
                        >
                          {console.log(errors)}
                          {console.log(values)}
                        </ScheduleClassSubscriptionForm>
                      )}
                    </Formik>
                  </Table.Col>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          </div>
        </ContentCard>
      </ClassEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassSubscriptions))