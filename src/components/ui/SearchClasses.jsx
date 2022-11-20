import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Alert,
  Dimmer,
  Table
} from "tabler-react";

import CSDatePicker from './CSDatePicker'
import ContentCard from "../general/ContentCard"
import InputSearch from '../general/InputSearch'
import { GET_CLASSES_QUERY } from "../schedule/classes/queries"

// Action buttons
// import SettingsMailNotificationButtonAddAccount from '../settings/mail/notifications/SettingsMailNotificationButtonAddAccount'

function get_classes_query_variables(date) {
  if (date) {
    queryVars.dateFrom = date
    queryVars.dateUntil= date
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
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [ getClasses, { called, loading, error, data, refetch, fetchMore } ] = useQuery( GET_CLASSES_QUERY )

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
      selected={new Date()}
      onChange={(date) => {
        if (date) {
          setShowSearchResults(true)
          refetch({ variables: get_classes_query_variables(date)})
        } else {
          showSearchResults(false)
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

  if (!showSearchResults) {
    return <Search />
  }

  if (called && loading) return (
    <React.Fragment>
      <Search />
      <ContentCard cardTitle={t('general.search_results')}>
        <Dimmer active={true} loader={true} />
      </ContentCard>
    </React.Fragment>
  )

  if (called && error) return (
    <React.Fragment>
      <Search />
      <Alert type="danger">{t("general.error_sad_smiley")}</Alert>
    </React.Fragment>
  )

  if (called && !data.scheduleClasses.length) return (
    <React.Fragment>
      <Search />
      <Alert type="primary">
        <strong>{t("general.search_class_not_found")}</strong>
      </Alert>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <Search />
      {(data) ?
      "Content here"
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


export default withTranslation()(withRouter(SearchAccounts))
