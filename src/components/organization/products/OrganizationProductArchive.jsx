import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { ARCHIVE_ORGANIZATION_PRODUCT, GET_ORGANIZATION_PRODUCTS_QUERY } from "./queries"

import ButtonArchive from '../../ui/ButtonArchive'
import ButtonUnArchive from '../../ui/ButtonUnArchive'


function OrganizationProductArchive({t, match, history, node}) {
  const [archiveProduct] = useMutation(ARCHIVE_ORGANIZATION_PRODUCT)
  const refetchQueries = [
    { query: GET_ORGANIZATION_PRODUCTS_QUERY, variables: { archived: node.archived } },
  ]

  if (!node.archived) {
    return (
      <ButtonArchive
        msgConfirm={t("organization.products.archive_confirm_msg")}
        msgSuccess={t("general.archived")}
        archiveFunction={archiveProduct}
        archiveFunctionVariables={{ 
            variables: {
              input: {
                id: node.id,
                archived: true
              },
            }, 
            refetchQueries: refetchQueries,
          }
        }
      />
    )

  } else {
    return (
      <ButtonUnArchive
        msgConfirm={t("organization.products.unarchive_confirm_msg")}
        msgSuccess={t("general.unarchived")}
        unArchiveFunction={archiveProduct}
        unArchiveFunctionVariables={{ 
            variables: {
              input: {
                id: node.id,
                archived: false
              },
            }, 
            refetchQueries: refetchQueries,
          }
        }
      />
    )
  }
}

export default withTranslation()(withRouter(OrganizationProductArchive))
