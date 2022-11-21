import React, { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from "moment"

import {
  Alert,
  Card,
  Dimmer,
  Table
} from "tabler-react";

import { dateToLocalISO } from "../../tools/date_tools"
import { capitalize } from '../../tools/string_tools'

import CSDatePicker from './CSDatePicker'
import ContentCard from "../general/ContentCard"
import { GET_CLASSES_QUERY } from "../schedule/classes/queries"

// Action buttons
// import SettingsMailNotificationButtonAddAccount from '../settings/mail/notifications/SettingsMailNotificationButtonAddAccount'

function get_classes_query_variables(date) {
  let queryVars = {}

  if (date) {
    const searchDate = dateToLocalISO(date)

    queryVars.dateFrom = searchDate
    queryVars.dateUntil = searchDate
  }

  queryVars.attendanceCountType = 'ATTENDING_AND_BOOKED'

  return queryVars
}


function SearchClassesOnDate({ 
  t, 
  match, 
  localStorateKeySearchValue="", 
  btnDisableClassesIds=[],
  btnDisabledMessage="",
  btnAction,
 }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  // const [showSearchResults, setShowSearchResults] = useState(false)

  const { loading, error, data, refetch } = useQuery( GET_CLASSES_QUERY, {
    variables: get_classes_query_variables(selectedDate)
  } )

  function renderActionButton(scheduleClassId, date) {
    switch(btnAction) {
      // case "settingsMailNotificationAddAccount":
      //   return <SettingsMailNotificationButtonAddAccount accountId={accountId} />
      default:
        return "btnAction type not defined"
    }
  }

  function Search() {
    return <CSDatePicker 
      // className={(errors.dateStart) ? "form-control is-invalid" : "form-control"} 
      className={"form-control"} 
      selected={selectedDate}
      onChange={(date) => {
        if (date) {
          // setShowSearchResults(true)
          setSelectedDate(date)
          refetch(get_classes_query_variables(date))
        } else {
          // showSearchResults(false)
        }
      }}
      // onBlur={() => setFieldTouched("dateStart", true)}
    />

    // return <InputSearch 
    //   className="mb-2"
    //   initialValueKey={localStorateKeySearchValue}
    //   placeholder={placeholderSearch}
    //   onChange={(value) => {
    //     localStorage.setItem(localStorateKeySearchValue, value)
    //     if (value && !called) {
    //       setShowSearchResults(true)
    //       getAccounts({ variables: get_accounts_query_variables(value)})
    //     } else if (value) {
    //       // This is important, as the current relayStylePagination doesn't include args.
    //       // Don't use getAccounts again, but refetch with different vars.
    //       setShowSearchResults(true)
    //       refetch(get_accounts_query_variables(value))
    //     } else {
    //       setShowSearchResults(false)
    //     }
    //   }}
    // />
  }

  // if (!showSearchResults) {
  //   return <Search />
  // }

  if (loading) return (
    <React.Fragment>
      <Search />
      <div>
        <Dimmer active={true} loader={true} />
      </div>
    </React.Fragment>
  )

  if (error) return (
    <React.Fragment>
      <Search />
      <Alert type="danger">{t("general.error_sad_smiley")}</Alert>
    </React.Fragment>
  )

  if (!data.scheduleClasses.length) return (
    <React.Fragment>
      <Search />
      <Alert type="primary">
        <strong>{t("general.search_no_classes_found")}</strong>
      </Alert>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <Search />
      {(data) ?
      <div className='mt-4'>
        {data.scheduleClasses.map(({ date, classes }) => (
          <React.Fragment key={v4()}>
            <h3>
              {capitalize(moment(date).format("dddd"))} {' '}
              <small className="text-muted">
                    {moment(date).format("LL")} 
              </small>
            </h3>
            {!(classes.length) ? <Card>
                <Card.Body>
                  <h5>{t('schedule.classes.empty_list')} <i className="fa fa-beach"/></h5>
                </Card.Body>
              </Card> 
            :
            "Content here"
            }
          </React.Fragment>
        ))}
      </div>
      // <ContentCard cardTitle={t('general.search_results')}
      //             pageInfo={data.accounts.pageInfo}
      //             hasCardBody={false}
      //             onLoadMore={() => {
      //               fetchMore({
      //                 variables: {
      //                 after: data.accounts.pageInfo.endCursor
      //               },
      //               updateQuery: (previousResult, { fetchMoreResult }) => {
      //                 const newEdges = fetchMoreResult.accounts.edges
      //                 const pageInfo = fetchMoreResult.accounts.pageInfo 

      //                 return newEdges.length
      //                   ? {
      //                       // Put the new accounts at the end of the list and update `pageInfo`
      //                       // so we have the new `endCursor` and `hasNextPage` values
      //                       queryAccountsData: {
      //                         accounts: {
      //                           __typename: previousResult.accounts.__typename,
      //                           edges: [ ...previousResult.accounts.edges, ...newEdges ],
      //                           pageInfo
      //                         }
      //                       }
      //                     }
      //                   : previousResult
      //               }
      //             })
      //           }} >
      //   <Table cards>
      //     <Table.Header>
      //       <Table.Row key={v4()}>
      //         <Table.ColHeader>{t('general.name')}</Table.ColHeader>
      //         <Table.ColHeader>{t('general.email')}</Table.ColHeader>
      //         <Table.ColHeader></Table.ColHeader>
      //       </Table.Row>
      //     </Table.Header>
      //     <Table.Body>
      //       {data.accounts.edges.map(({ node }) => (
      //         <Table.Row key={v4()}>
      //           <Table.Col key={v4()}>
      //             {node.fullName}
      //           </Table.Col>
      //           <Table.Col key={v4()}>
      //             {node.email}
      //           </Table.Col>
      //           <Table.Col key={v4()}>
      //             {(btnDisableAccountIds.includes(node.id)) ? 
      //               <span className="pull-right">{btnDisabledMessage}</span> :
      //               <span className="pull-right">{renderActionButton(node.id)}</span>
      //             }   
      //           </Table.Col>
      //         </Table.Row>
      //       ))}
      //     </Table.Body>
      //   </Table>
      // </ContentCard>
      : "" }
    </React.Fragment>
  )
}

export default withTranslation()(withRouter(SearchClassesOnDate))
