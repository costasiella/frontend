import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'
import { v4 } from 'uuid'
import DOMPurify from 'dompurify'
import {
  Card,
  Grid,
} from "tabler-react";

import { GET_SHOP_ANNOUNCEMENTS_QUERY } from "./queries"
import ShopHomeBase from "./ShopHomeBase"


function ShopHome({ t, match, history }) {
  
  const { loading, error, data } = useQuery(GET_SHOP_ANNOUNCEMENTS_QUERY);

  if (loading) return (
    <ShopHomeBase>
      {t("general.loading_with_dots")}
    </ShopHomeBase>
  )
  if (error) return (
    <ShopHomeBase>
      {t("shop.home.announcements.error_loading")}
    </ShopHomeBase>
  )

  const announcements = data.organizationAnnouncements

  return (
    <ShopHomeBase title={t("shop.home.title")}>
      <Grid.Row cards deck>
        {(announcements.edges.length) ? announcements.edges.map(({ node }) => (
          <Grid.Col xs={12} sm={12} md={6} key={v4()}>
            <Card title={node.title}>
              <Card.Body>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(node.content) }}></div>
              </Card.Body>
            </Card> 
          </Grid.Col>
        )) : ""
        }
      </Grid.Row>
    </ShopHomeBase>
  )
}


export default withTranslation()(withRouter(ShopHome))