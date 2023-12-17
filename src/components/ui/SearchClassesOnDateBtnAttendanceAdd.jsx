import React from 'react'
import { gql } from "@apollo/client"
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Alert,
  Button,
  Dimmer,
  Icon, 
} from "tabler-react";


const GET_ACCOUNT_ATTENDANCES_QUERY = gql`
  query ScheduleItemAttendance($account: ID!, $scheduleItem: ID!, $classDate: Date!, $before: String, $after: String) {
    scheduleItemAttendances(first: 20, before: $before, after: $after, account: $account, scheduleItem: $scheduleItem, date: $classDate) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
        }
      } 
    }
  }
`


function SearchClassesOnDateBtnAttendanceAdd({ 
  t, 
  match, 
  accountId,
  scheduleClassId,
  classDate,
 }) {
  const { loading, error, data } = useQuery( GET_ACCOUNT_ATTENDANCES_QUERY, {
    variables: {
      account: accountId,
      scheduleItem: scheduleClassId,
      classDate: classDate
    },
    fetchPolicy: "network-only"
  } )

  if (loading) return (
    <React.Fragment>
        <Dimmer active={true} loader={true} />
    </React.Fragment>
  )

  if (error) return (
    <React.Fragment>
      <Alert type="danger">{t("general.error_sad_smiley")}</Alert>
    </React.Fragment>
  )

  if (data.scheduleItemAttendances.edges.length) return (
      <strong>{t("general.attending")}</strong>
  )

  return (
    <Link to={`/schedule/classes/class/book/${scheduleClassId}/${classDate}/${accountId}`}>
      <Button color="primary" outline size="sm">
        <Icon name="plus" /> {t("general.add")}
      </Button>
    </Link>
  )
}

export default withTranslation()(withRouter(SearchClassesOnDateBtnAttendanceAdd))
