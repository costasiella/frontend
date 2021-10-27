// @flow

import React from 'react'
import { useMutation, useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'

import { GET_SUBSCRIPTION_GROUP_SUBSCRIPTIONS_QUERY, ADD_CARD_TO_GROUP, DELETE_CARD_FROM_GROUP } from './queries'


import {
  Alert,
  Icon,
  Button,
  Card,
  Dimmer,
  Table,
} from "tabler-react";

import ContentCard from '../../general/ContentCard'
import OrganizationSubscriptionsGroupsBase from './OrganizationSubscriptionsGroupsBase';

function OrganizationSubscriptionGroupEditSubscriptions({t, match, history}) {
  const groupId = match.params.id
  const returnUrl = "/organization/subscriptions/groups"
  const cardTitle = t('organization.subscription_group_subscriptions.title_edit')
  const { loading, error, data } = useQuery(GET_SUBSCRIPTION_GROUP_SUBSCRIPTIONS_QUERY, {
    variables: { id: groupId }
  })
  const [ addCardToGroup ] = useMutation(ADD_CARD_TO_GROUP)
  const [ deleteCardFromGroup ] = useMutation(DELETE_CARD_FROM_GROUP)

  if (loading) return (
    <OrganizationSubscriptionsGroupsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationSubscriptionsGroupsBase>
  )
  // Error
  if (error) return (
    <OrganizationSubscriptionsGroupsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationSubscriptionsGroupsBase>
  )

  console.log('query data')
  console.log(data)
  const subscriptions = data.organizationSubscriptions
  const group = data.organizationSubscriptionGroup

  let group_subscriptions = {}
  if (group.organizationSubscriptions.edges) {
    group.organizationSubscriptions.edges.map(({ node }) => (
      group_subscriptions[node.id] = true
    ))
  }

  console.log("group_subscriptions")
  console.log(group_subscriptions)


  return (
    <OrganizationSubscriptionsGroupsBase>
      <Card title={cardTitle}>
      {
      (!subscriptions.edges) ? "" : 
        <Card.Body>
          <Alert type="primary">
            <strong>{t('general.group')}</strong> {group.name}
          </Alert>
          <Table>
            <Table.Header>
              <Table.Row key={v4()}>
                <Table.ColHeader>{t('')}</Table.ColHeader>
                <Table.ColHeader>{t('general.name')}</Table.ColHeader>
                <Table.ColHeader>{t('')}</Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
                {subscriptions.edges.map(({ node }) => (
                  <Table.Row key={v4()}>
                    <Table.Col key={v4()}>
                      {(node.id in group_subscriptions) ? 
                        <Icon name="check-circle" className="text-green" /> : <Icon name="x-circle" className="text-red" />
                      }
                    </Table.Col>
                    <Table.Col key={v4()}>
                      {node.name}
                    </Table.Col>
                    {console.log((node.id in group_subscriptions))}
                    {(!(node.id in group_subscriptions)) ?
                      // Add
                      <Table.Col className="text-right text-green" key={v4()}>
                        <Button color="link"
                          size="sm"
                          title={t('general.add_to_group')} 
                          href=""
                          onClick={() => {
                            console.log("clicked add")
                            let pass_id = node.id
                            addCardToGroup({ variables: {
                              input: {
                                organizationSubscription: pass_id,
                                organizationSubscriptionGroup: groupId
                              }
                        }, refetchQueries: [
                            {query: GET_SUBSCRIPTION_GROUP_SUBSCRIPTIONS_QUERY, variables: {"id": groupId, "archived": false }}
                        ]}).then(({ data }) => {
                          console.log('got data', data);
                          toast.success(t('general.added_to_group'), {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        }).catch((error) => {
                          toast.error((t('general.toast_server_error')) +  error, {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                          console.log('there was an error sending the query', error);
                        })
                        }}>
                          <Icon prefix="fe" name="plus-circle" /> { ' ' }
                          {t('general.add_to_group')} 
                        </Button>
                      </Table.Col>
                      :
                      // Delete
                      <Table.Col className="text-right text-red" key={v4()}>
                        <Button color="link"
                          size="sm"
                          title={t('general.delete_from_group')} 
                          href=""
                          onClick={() => {
                            console.log("clicked delete")
                            console.log(node.id)
                            let pass_id = node.id
                            deleteCardFromGroup({ variables: {
                              input: {
                                organizationSubscription: pass_id,
                                organizationSubscriptionGroup: groupId
                              }
                        }, refetchQueries: [
                            {query: GET_SUBSCRIPTION_GROUP_SUBSCRIPTIONS_QUERY, variables: {"id": groupId, "archived": false }}
                        ]}).then(({ data }) => {
                          console.log('got data', data);
                          toast.success(t('general.deleted_from_group'), {
                            position: toast.POSITION.BOTTOM_RIGHT
                          })
                        }).catch((error) => {
                          toast.error((t('general.toast_server_error')) +  error, {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                          console.log('there was an error sending the query', error);
                        })
                        }}>
                          <Icon prefix="fe" name="minus-circle" /> { ' ' }
                          {t('general.delete_from_group')}
                        </Button>
                      </Table.Col>
                      }
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </Card.Body>
      }
    </Card>
  </OrganizationSubscriptionsGroupsBase>
  )
}

export default withTranslation()(withRouter(OrganizationSubscriptionGroupEditSubscriptions))