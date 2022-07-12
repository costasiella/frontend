import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import moment from 'moment';

import {
  Button,
  Card,
  Table,
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import { GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNTS_QUERY } from './queries'
import ScheduleEventEditListBase from "../edit/ScheduleEventEditListBase"
// import ScheduleEventTicketListBase from "./ScheduleEventTicketListBase"
import ScheduleEventSubscriptionGroupDiscountDelete from "./ScheduleEventSubscriptionGroupDiscountDelete"
import ButtonAdd from '../../../ui/ButtonAdd';


function ScheduleEventSubscriptionGroupDiscounts({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  console.log(appSettings)
  
  const eventId = match.params.event_id
  const activeLink = "subscription_group_discounts"

  const pageHeaderOptions = <ButtonAdd 
    addUrl={`/schedule/events/edit/${eventId}/subscription_group_discounts/add`} 
    className="ml-2"
  />

  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNTS_QUERY, {
    variables: {
      scheduleEvent: eventId
    }
  })
  
  if (loading) return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      {t("general.loading_with_dots")}
    </ScheduleEventEditListBase>
  )
  if (error) return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </ScheduleEventEditListBase>
  )

  console.log('query data')
  console.log(data)

  const scheduleEventSubscriptionGroupDiscounts = data.scheduleEventSubscriptionGroupDiscounts
  const pageInfo = data.scheduleEventSubscriptionGroupDiscounts.pageInfo

  // Empty list
  if (!scheduleEventSubscriptionGroupDiscounts.edges.length) { return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      <Card.Body>
        <p>{t('schedule.events.subscription_group_discounts.empty_list')}</p>
      </Card.Body>
    </ScheduleEventEditListBase>
  )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: scheduleEventSubscriptionGroupDiscounts.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.scheduleEventSubscriptionGroupDiscounts.edges
        const pageInfo = fetchMoreResult.scheduleEventSubscriptionGroupDiscounts.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              scheduleEventSubscriptionGroupDiscounts: {
                __typename: previousResult.scheduleEventSubscriptionGroupDiscounts.__typename,
                edges: [ ...previousResult.scheduleEventSubscriptionGroupDiscounts.edges, ...newEdges ],
                pageInfo
              }
            }
          : previousResult
      }
    })
  }

  return (
    <ScheduleEventEditListBase 
      activeLink={activeLink} 
      pageInfo={pageInfo} 
      onLoadMore={onLoadMore} 
      pageHeaderOptions={pageHeaderOptions}
    >
      <Table cards>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.subscription_group')}</Table.ColHeader>
            <Table.ColHeader>{t('schedule.events.earlybirds.discountPercentage')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {scheduleEventSubscriptionGroupDiscounts.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {/* {moment(node.dateStart).format(dateFormat)} */}
                </Table.Col>
                <Table.Col>
                  {node.discountPercentage} %
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/schedule/events/edit/${eventId}/subscription_group_discount/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <ScheduleEventSubscriptionGroupDiscountDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </ScheduleEventEditListBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventSubscriptionGroupDiscounts))
