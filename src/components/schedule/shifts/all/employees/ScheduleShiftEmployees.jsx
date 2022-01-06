// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Icon,
  Dimmer,
  Button,
  Table,
  Card
} from "tabler-react";
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import confirm_delete from "../../../../../tools/confirm_delete"

import ContentCard from "../../../../general/ContentCard"
import ShiftEditBase from "../ShiftEditBase"

import { GET_SCHEDULE_SHIFT_ACCOUNTS_QUERY, DELETE_SCHEDULE_SHIFT_ACCOUNT } from "./queries"


function ScheduleShiftEmployees({ t, match, history}) {
  const shiftId = match.params.shift_id
  const menuActiveLink = "employees"
  const cardTitle = t('schedule.shifts.employees.title')
  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_SHIFT_ACCOUNTS_QUERY, {
    variables: {scheduleItem: shiftId}
  })
  const [ deleteScheduleItemAccount ] = useMutation(DELETE_SCHEDULE_SHIFT_ACCOUNT)

  const ButtonAdd = <HasPermissionWrapper permission="add" resource="scheduleitemaccount">
    <Link to={`/schedule/shifts/all/employees/${shiftId}/add` } >
      <Button color="primary ml-2">
      <Icon prefix="fe" name="plus-circle" /> {t('general.add')}
      </Button>
    </Link>
  </HasPermissionWrapper>

  // Loading
  if (loading) return (
    <ShiftEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={ButtonAdd}
    >
      <Card.Body>
        <Dimmer active={true} loader={true} />
      </Card.Body>
    </ShiftEditBase>
  )
  // Error
  if (error) return (
    <ShiftEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={ButtonAdd}
    >
      <Card.Body>
        <p>{t('schedule.shifts.employees.error_loading')}</p>
      </Card.Body>
    </ShiftEditBase>
  )

  // Empty list
  if (!data.scheduleItemAccounts.edges.length) return (
    <ShiftEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      pageHeaderButtonList={ButtonAdd}
    >
      <Card.Body>
        <p>{t('schedule.shifts.employees.empty_list')}</p>
      </Card.Body>
    </ShiftEditBase>
  )

  return (
    <ShiftEditBase 
    menuActiveLink={menuActiveLink} 
    defaultCard={false}
    pageHeaderButtonList={ButtonAdd}
    >
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={data.scheduleItemAccounts.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: data.scheduleItemAccounts.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.scheduleItemAccounts.edges
            const pageInfo = fetchMoreResult.scheduleItemAccounts.pageInfo

            return newEdges.length
              ? {
                  // Put the new locations at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  data: { 
                    scheduleItemAccounts: {
                      __typename: previousResult.scheduleItemAccounts.__typename,
                      edges: [ ...previousResult.scheduleItemAccounts.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                }
              : previousResult
            }
          })
        }} 
      >
        <div>
          <Table cards>
            <Table.Header>
              <Table.Row>
                <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
                <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
                <Table.ColHeader>{t('general.employee')}</Table.ColHeader>
                <Table.ColHeader>{t('general.employee_2')}</Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.scheduleItemAccounts.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  {console.log(node)}
                  <Table.Col key={v4()}> 
                    {moment(node.dateStart).format('LL')}
                  </Table.Col>
                  <Table.Col key={v4()}> 
                    {(node.dateEnd) ? moment(node.dateEnd).format('LL') : ""}
                  </Table.Col>
                  <Table.Col>
                    {node.account.fullName}
                  </Table.Col>
                  <Table.Col>
                    { node.account2 ? node.account2.fullName : "" }
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={`/schedule/shifts/all/employees/${shiftId}/edit/${node.id}`}>
                      <Button className='btn-sm' 
                              color="secondary"
                      >
                        {t('general.edit')}
                      </Button>
                    </Link>
                    <button className="icon btn btn-link btn-sm" 
                        title={t('general.delete')} 
                        href=""
                        onClick={() => {
                          confirm_delete({
                            t: t,
                            msgConfirm: t('schedule.shifts.employees.delete_confirm_msg'),
                            msgDescription: <p>{t('schedule.shifts.employees.delete_confirm_description')}</p>,
                            msgSuccess: t('schedule.shifts.employees.deleted'),
                            deleteFunction: deleteScheduleItemAccount,
                            functionVariables: { variables: {
                              input: {
                                id: node.id
                              }
                            }, refetchQueries: [
                              {query: GET_SCHEDULE_SHIFT_ACCOUNTS_QUERY, variables: { scheduleItem: shiftId }}
                            ]}
                        })}}
                    >
                      <span className="text-red">
                        <Icon prefix="fe" name="trash-2" />
                      </span>
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </ContentCard>      
    </ShiftEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleShiftEmployees))