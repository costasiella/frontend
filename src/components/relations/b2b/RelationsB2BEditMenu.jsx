import React from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'

import { GET_ACCOUNT_QUERY } from './queries'

import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../../HasPermissionWrapper"


function RelationsB2BEditMenu({t, businessId, activeLink}) {
    // const {loading, error, data} = useQuery(GET_ACCOUNT_QUERY, {
    //     variables: {id: accountId}
    // })

    // if (loading) return <p>{t('general.loading_with_dots')}</p>
    // // Error
    // if (error) {
    //   console.log(error)
    //   return <p>{t('general.error_sad_smiley')}</p>
    // }
    // const account = data.account
    // console.log('account in profile menu')
    // console.log(account)

    return (
      <List.Group transparent={true}>     
        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to={"#/relations/b2b/" + businessId + "/edit"}
            icon="home"
            active={(activeLink === 'edit')}
        >
            {t('general.edit')}
        </List.GroupItem>
        <HasPermissionWrapper 
            permission="view"
            resource="financeinvoice">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/b2b/" + businessId + "/invoices"}
                icon="file-text"
                active={(activeLink === 'invoices')}
                >
            {t('general.invoices')}
            </List.GroupItem>
        </HasPermissionWrapper>
    </List.Group>
  )
}

export default withTranslation()(RelationsB2BEditMenu)