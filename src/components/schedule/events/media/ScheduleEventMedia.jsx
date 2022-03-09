import React from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'

import {
  Avatar,
  Button,
  Table,
  Card,
} from "tabler-react";

import { GET_SCHEDULE_EVENT_MEDIAS_QUERY } from './queries'
import ScheduleEventEditListBase from "../edit/ScheduleEventEditListBase"
import ScheduleEventMediaDelete from "./ScheduleEventMediaDelete"
import ButtonAdd from '../../../ui/ButtonAdd';


function ScheduleEventMedia({t, match, history}) {
  const eventId = match.params.event_id
  const activeLink = "media"

  const pageHeaderOptions = <ButtonAdd 
    addUrl={`/schedule/events/edit/${eventId}/media/add`} 
    className="ml-2"
  />

  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_EVENT_MEDIAS_QUERY, {
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

  const scheduleEventMedias = data.scheduleEventMedias
  const pageInfo = data.scheduleEventMedias.pageInfo

  // Empty list
  if (!scheduleEventMedias.edges.length) { return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      <Card.Body>
        <p>{t('schedule.events.media.empty_list')}</p>
      </Card.Body>
    </ScheduleEventEditListBase>
  )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: scheduleEventMedias.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.scheduleEventMedias.edges
        const pageInfo = fetchMoreResult.scheduleEventMedias.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              scheduleEventMedias: {
                __typename: previousResult.scheduleEventMedias.__typename,
                edges: [ ...previousResult.scheduleEventMedias.edges, ...newEdges ],
                pageInfo
              }
            }
          : previousResult
      }
    })
  }

  return (
    <ScheduleEventEditListBase activeLink={activeLink} pageInfo={pageInfo} onLoadMore={onLoadMore} pageHeaderOptions={pageHeaderOptions}>
      <Table>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader></Table.ColHeader> 
            <Table.ColHeader>{t('general.description')}</Table.ColHeader>
            <Table.ColHeader>{t('general.sort_order')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {scheduleEventMedias.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  <Avatar size="lg" imageURL={node.urlImageThumbnailSmall} />
                </Table.Col>
                <Table.Col>
                  {node.description}
                </Table.Col>
                <Table.Col>
                  {node.sortOrder}
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/schedule/events/edit/${eventId}/media/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <ScheduleEventMediaDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </ScheduleEventEditListBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventMedia))
