import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
    Page,
    Grid,
    Container,
  } from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import InputSearch from "../../general/InputSearch"
import { get_list_query_variables } from "./tools"
import ButtonAdd from '../../ui/ButtonAdd';
import SiteWrapper from "../../SiteWrapper"


const RelationsB2BBase = ({t, history, refetch, children }) => (
  <SiteWrapper>
    <div className="my-3 my-md-5">
      <Container>
        <Page.Header title={t("relations.title")}>
          <div className="page-options d-flex">
            <InputSearch 
              initialValueKey={CSLS.RELATIONS_BUSINESSES_SEARCH}
              placeholder="Search..."
              onChange={(value) => {
                console.log(value)
                localStorage.setItem(CSLS.RELATIONS_BUSINESSES_SEARCH, value)
                refetch(get_list_query_variables())
              }}
            />
            <ButtonAdd addUrl="/relations/b2b/add" className='ml-2 '/>
          </div>
        </Page.Header>
        <Grid.Row>
          <Grid.Col md={12}>
            {children}
          </Grid.Col>
        </Grid.Row>
      </Container>
    </div>
  </SiteWrapper>
)


  export default withTranslation()(withRouter(RelationsB2BBase))