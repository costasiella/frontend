import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'


import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../../HasPermissionWrapper"


function RelationsB2BEditMenu({t, businessId, activeLink}) {
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