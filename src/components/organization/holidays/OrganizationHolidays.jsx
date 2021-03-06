import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import moment from "moment"
import DOMPurify from 'dompurify'
import AppSettingsContext from '../../context/AppSettingsContext'


import {
  Badge,
  Icon,
  Dimmer,
  Button,
  Table
} from "tabler-react";

import confirm_delete from "../../../tools/confirm_delete"
import ContentCard from "../../general/ContentCard"
import OrganizationHolidaysBase from './OrganizationHolidaysBase'

import { GET_HOLIDAYS_QUERY, DELETE_HOLIDAY } from "./queries"


function OrganizationHolidays({t, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const cardTitle = t('organization.holidays.title')
  
  const { loading, error, data, fetchMore } = useQuery(GET_HOLIDAYS_QUERY)
  const [ deleteHoliday ] = useMutation(DELETE_HOLIDAY)

  if (loading) return (
    <OrganizationHolidaysBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationHolidaysBase>
  )

  if (error) return (
    <OrganizationHolidaysBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.holidays.error_loading')}</p>
      </ContentCard>
    </OrganizationHolidaysBase>
  )

  let holidays = data.organizationHolidays

  // Empty list
  if (!holidays.edges.length) { return (
    <OrganizationHolidaysBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.holidays.empty_list')}</p>
      </ContentCard>
    </OrganizationHolidaysBase>
  )}


  return (
    <OrganizationHolidaysBase>
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={holidays.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: holidays.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.organizationHolidays.edges
            const pageInfo = fetchMoreResult.organizationHolidays.pageInfo

            return newEdges.length
              ? {
                  // Put the new levels at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  organizationHolidays: {
                    __typename: previousResult.organizationHolidays.__typename,
                    edges: [ ...previousResult.organizationHolidays.edges, ...newEdges ],
                    pageInfo
                  }
                }
              : previousResult
          }
        })
      }} >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
              <Table.ColHeader>{t('organization.locations.title')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {holidays.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name} 
                    <div className="text-muted">
                      <small dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(node.description) }} />
                    </div>
                  </Table.Col>
                  <Table.Col>
                    {moment(node.dateStart).format(dateFormat)}
                  </Table.Col>
                  <Table.Col>
                    {moment(node.dateEnd).format(dateFormat)}
                  </Table.Col>
                  <Table.Col>
                    {node.organizationLocations.edges.map(({ node: location }) => (
                       <div><Badge color="primary" className="mr-1">{location.name}</Badge></div>
                    ))}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={`/organization/holidays/edit/${node.id}/locations`}>
                      <Button className='btn-sm' 
                              color="secondary">
                        {t('organization.holidays.locations.title_edit')}
                      </Button>
                    </Link>
                    <Link to={`/organization/holidays/edit/${node.id}`}>
                      <Button className='btn-sm' 
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    </Link>
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.delete')} 
                      href=""
                      onClick={() => {
                        confirm_delete({
                          t: t,
                          msgConfirm: t("organization.holidays.holiday_delete_confirm_msg"),
                          msgDescription: <p>{node.name}</p>,
                          msgSuccess: t('organization.holidays.payment_deleted'),
                          deleteFunction: deleteHoliday,
                          functionVariables: { 
                            variables: {
                              input: {
                                id: node.id
                              }
                            }, 
                            refetchQueries: [
                              {query: GET_HOLIDAYS_QUERY },
                            ]
                          }
                        })
                    }}>
                      <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationHolidaysBase>
  )
}



export default withTranslation()(withRouter(OrganizationHolidays))