import React, { useContext } from 'react'
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
import { represent_instructor_role } from "../tools"
import AppSettingsContext from '../../../../context/AppSettingsContext'
import confirm_delete from "../../../../../tools/confirm_delete"

import ContentCard from "../../../../general/ContentCard"
import ClassEditBase from "../ClassEditBase"

import { GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, DELETE_SCHEDULE_CLASS_INSTRUCTOR } from "./queries"


function ScheduleClassInstructors({ t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const classId = match.params.class_id
  const menuActiveLink = "instructors"
  const cardTitle = t('schedule.classes.instructors.title')
  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, {
    variables: {scheduleItem: classId}
  })
  const [ deleteScheduleItemAccount ] = useMutation(DELETE_SCHEDULE_CLASS_INSTRUCTOR)

  const ButtonAdd = <HasPermissionWrapper permission="add" resource="scheduleiteminstructor">
    <Link to={`/schedule/classes/all/instructors/${classId}/add` } >
      <Button color="primary btn-block mb-6">
      <Icon prefix="fe" name="plus-circle" /> {t('schedule.classes.instructors.add')}
      </Button>
    </Link>
  </HasPermissionWrapper>

  // Loading
  if (loading) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={ButtonAdd}
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
      sidebarButton={ButtonAdd}
    >
      <Card.Body>
        <p>{t('schedule.classes.instructors.error_loading')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  // Empty list
  if (!data.scheduleItemAccounts.edges.length) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={ButtonAdd}
    >
      <Card.Body>
        <p>{t('schedule.classes.instructors.empty_list')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  return (
    <ClassEditBase 
    menuActiveLink={menuActiveLink} 
    defaultCard={false}
    sidebarButton={ButtonAdd}
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
        }} >
        <div>
          <Table cards>
            <Table.Header>
              <Table.Row>
                <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
                <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
                <Table.ColHeader>{t('general.instructor')}</Table.ColHeader>
                <Table.ColHeader>{t('general.instructor_2')}</Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.scheduleItemAccounts.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  {console.log(node)}
                  <Table.Col key={v4()}> 
                    {moment(node.dateStart).format(dateFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}> 
                    {(node.dateEnd) ? moment(node.dateEnd).format(dateFormat) : ""}
                  </Table.Col>
                  <Table.Col>
                    {node.account.fullName} <br />
                    <span className="text-muted">
                      {represent_instructor_role(t, node.role)}
                    </span>
                  </Table.Col>
                  <Table.Col>
                    {node.account2 ?
                      <span>
                        {node.account2.fullName} <br />
                        <span className="text-muted">
                          {represent_instructor_role(t, node.role2)}
                        </span>
                      </span> : ""
                    }
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={`/schedule/classes/all/instructors/${classId}/edit/${node.id}`}>
                      <Button className='btn-sm' 
                              color="secondary"
                      >
                        {t('general.edit')}
                      </Button>
                    </Link>
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <button className="icon btn btn-link btn-sm" 
                        title={t('general.delete')} 
                        href=""
                        onClick={() => {
                          confirm_delete({
                            t: t,
                            msgConfirm: t('schedule.classes.instructors.delete_confirm_msg'),
                            msgDescription: <p>{t('schedule.classes.instructors.delete_confirm_description')}</p>,
                            msgSuccess: t('schedule.classes.instructors.deleted'),
                            deleteFunction: deleteScheduleItemAccount,
                            functionVariables: { variables: {
                              input: {
                                id: node.id
                              }
                            }, refetchQueries: [
                              {query: GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, variables: { scheduleItem: match.params.class_id }}
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
    </ClassEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleClassInstructors))