import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'

import {
  Dimmer,
  Card,
  Table
} from "tabler-react";

import { toast } from 'react-toastify'

import ContentCard from "../../../../general/ContentCard"
import ClassEditBack from '../ClassEditBack'
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

  const pageHeaderButtonList = <ClassEditBack />

  // Loading
  if (loading) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <Dimmer active={true} loader={true} />
      </Card.Body>
    </ClassEditBase>
  )
  // Error
  if (error) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('schedule.classes.subscriptions.error_loading')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  // Empty list
  if (!data.scheduleItemOrganizationSubscriptionGroups.edges.length) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('schedule.classes.subscriptions.empty_list')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      defaultCard={false} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <ContentCard 
        cardTitle={cardTitle}
        // headerContent={headerOptions}
        pageInfo={data.scheduleItemOrganizationSubscriptionGroups.pageInfo}
        hasCardBody={false}
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
          <Table cards>
            <Table.Header>
              <Table.Row>
                <Table.ColHeader>{t('general.subscription_group')}</Table.ColHeader>
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
                      {({ isSubmitting, setSubmitting, errors, values, setFieldTouched, setFieldValue, submitForm }) => (
                        <ScheduleClassSubscriptionForm
                          isSubmitting={isSubmitting}
                          setSubmitting={setSubmitting}
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