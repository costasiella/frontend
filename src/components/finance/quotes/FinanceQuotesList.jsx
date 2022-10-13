import React, { useContext } from 'react'
import { useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Icon,
  Button,
  Table, 
  Text
} from "tabler-react";

import AppSettingsContext from '../../context/AppSettingsContext'
import { get_list_query_variables } from "./tools"
import FinanceQuoteStatus from "../../ui/FinanceQuoteStatus"
import { GET_QUOTES_QUERY, DELETE_FINANCE_QUOTE } from "./queries"
import confirm_delete from "../../../tools/confirm_delete"
import moment from 'moment'

function FinanceQuotesList({t, history, match, quotes, showColRelation=false}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const [ deleteFinanceQuote ] = useMutation(DELETE_FINANCE_QUOTE)

  return (
    <Table cards>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.status')}</Table.ColHeader>
            <Table.ColHeader>{t('finance.quotes.quote_number')} & {t('finance.quotes.summary')}</Table.ColHeader>
            {showColRelation && <Table.ColHeader>{t('finance.quotes.relation')}</Table.ColHeader>}
            <Table.ColHeader>{t('finance.quotes.date')} & {t('finance.quotes.expiration')}</Table.ColHeader>
            <Table.ColHeader>{t('general.total')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {quotes.edges.map(({ node }) => (
            <Table.Row key={v4()}>
              <Table.Col key={v4()}>
                <FinanceQuoteStatus status={node.status} /> <br />
                {(node.business && !showColRelation) && 
                  <Link to={"/relations/b2b/" + node.business.id + "/edit"}>
                    <small><Icon name="home" /> {node.business.name}</small>
                  </Link>
                }
              </Table.Col>
              <Table.Col key={v4()}>
                <Link to={"/finance/quotes/edit/" + node.id}>
                  {node.quoteNumber}
                </Link><br />
                <Text.Small color="gray">{node.summary.trunc(28)}</Text.Small>
              </Table.Col>
              {showColRelation &&
                <Table.Col key={v4()}>
                  { node.account && 
                    <Link to={"/relations/accounts/" + node.account.id + "/profile"}>
                      <Icon name="user" /> {node.account.fullName} <br />
                    </Link> 
                  }
                  { node.business && 
                    <Link to={"/relations/b2b/" + node.business.id + "/edit"}>
                      <small><Icon name="home" /> {node.business.name}</small>
                    </Link>
                  }
                </Table.Col>
              }
              <Table.Col key={v4()}>
                {moment(node.dateSent).format(dateFormat)} <br />
                {moment(node.dateExpire).format(dateFormat)}
              </Table.Col>
              <Table.Col key={v4()}>
                {node.totalDisplay}
              </Table.Col>
              <Table.Col className="text-right" key={v4()}>
                <Link to={"/finance/quotes/edit/" + node.id}>
                  <Button className='btn-sm' 
                          color="secondary">
                    {t('general.edit')}
                  </Button>
                </Link>
                <button className="icon btn btn-link btn-sm" 
                  title={t('general.delete')} 
                  href=""
                  onClick={() => {
                    confirm_delete({
                      t: t,
                      msgConfirm: t("finance.quotes.delete_confirm_msg"),
                      msgDescription: <p>{node.quoteNumber}</p>,
                      msgSuccess: t('finance.quotes.deleted'),
                      deleteFunction: deleteFinanceQuote,
                      functionVariables: { 
                        variables: {
                          input: {
                            id: node.id
                          }
                        }, 
                        refetchQueries: [
                          {query: GET_QUOTES_QUERY, variables: get_list_query_variables() } 
                        ]
                      }
                    })
                }}>
                  <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                </button>
            </Table.Col>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default withTranslation()(withRouter(FinanceQuotesList))