import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Dimmer,
  Table,
  Card
} from "tabler-react";

import AppSettingsContext from '../../../../context/AppSettingsContext'
import ButtonAdd from "../../../../ui/ButtonAdd"
import ButtonEdit from "../../../../ui/ButtonEdit"

import ContentCard from "../../../../general/ContentCard"
import ClassEditBack from "../ClassEditBack"
import ClassEditBase from "../ClassEditBase"
import ScheduleClassPriceDelete from './ScheduleClassPriceDelete'

import { GET_SCHEDULE_ITEM_PRICES_QUERY } from "./queries"


function ScheduleClassPrices({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const classId = match.params.class_id
  const menuActiveLink = "prices" 
  const cardTitle = t('schedule.classes.prices.title')
  const pageHeaderButtonList = <React.Fragment>
    <ClassEditBack />
    <ButtonAdd addUrl={`/schedule/classes/all/prices/${classId}/add`} className="ml-2" />
  </React.Fragment>

  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_ITEM_PRICES_QUERY, {
    variables: { scheduleItem: classId }
  })

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
        <p>{t('schedule.classes.prices.error_loading')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  // Empty list
  if (!data.scheduleItemPrices.edges.length) { return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('schedule.classes.prices.empty_list')}</p>
      </Card.Body>
    </ClassEditBase>
  )}

  return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      pageHeaderButtonList={pageHeaderButtonList}
      defaultCard={false}
    >
    <ContentCard 
      cardTitle={cardTitle}
      // headerContent={headerOptions}
      hasCardBody={false}
      pageInfo={data.scheduleItemPrices.pageInfo}
      onLoadMore={() => {
      fetchMore({
        variables: {
          after: data.scheduleItemPrices.pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.scheduleItemPrices.edges
          const pageInfo = fetchMoreResult.scheduleItemPrices.pageInfo

          return newEdges.length
            ? {
                // Put the new locations at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                data: { 
                  scheduleItemPrices: {
                    __typename: previousResult.scheduleItemPrices.__typename,
                    edges: [ ...previousResult.scheduleItemPrices.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
              <Table.ColHeader>{t('general.dropin')}</Table.ColHeader>
              <Table.ColHeader>{t('general.trial')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.scheduleItemPrices.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                {console.log(node)}
                <Table.Col key={v4()}> 
                  {moment(node.dateStart).format(dateFormat)}
                </Table.Col>
                <Table.Col key={v4()}> 
                  {(node.dateEnd) ? moment(node.dateEnd).format(dateFormat) : ""}
                </Table.Col>
                <Table.Col>
                  {(node.organizationClasspassDropin) ? node.organizationClasspassDropin.name : ""}
                </Table.Col>
                <Table.Col>
                  {(node.organizationClasspassTrial) ? node.organizationClasspassTrial.name : ""}
                </Table.Col>
                <Table.Col className="text-right" key={v4()}>
                  <ButtonEdit editUrl={`/schedule/classes/all/prices/${classId}/edit/${node.id}`} />
                  <ScheduleClassPriceDelete id={node.id} />
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


export default withTranslation()(withRouter(ScheduleClassPrices))