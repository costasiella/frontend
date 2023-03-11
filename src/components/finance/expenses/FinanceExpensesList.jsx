
import React, { useContext } from 'react'
import { useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Icon,
  Badge,
  Button,
  Table
} from "tabler-react";

import AppSettingsContext from '../../context/AppSettingsContext'
import HasPermissionWrapper from '../../HasPermissionWrapper'
import FileProtectedDownloadTableButton from '../../ui/FileProtectedDownloadTableButton'
import ButtonConfirm from '../../ui/ButtonConfirm'
// import { get_list_query_variables } from "./tools"
// import FinanceExpensesStatus from "../../ui/FinanceExpenseStatus"
import { GET_EXPENSES_QUERY, DUPLICATE_FINANCE_EXPENSE, DELETE_FINANCE_EXPENSE } from "./queries"
import confirm_delete from "../../../tools/confirm_delete"
import moment from 'moment'

function FinanceExpensesList({t, history, match, expenses, showColRelation=false}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const [ duplicateFinanceExpense ] = useMutation(DUPLICATE_FINANCE_EXPENSE)
  const [ deleteFinanceExpense ] = useMutation(DELETE_FINANCE_EXPENSE)

  return (
    <Table cards>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.date')}</Table.ColHeader>
            <Table.ColHeader className="cs-finance-expenses-col-summary">{t('general.summary')} & {t('general.description')}</Table.ColHeader>
            {/* {showColRelation && <Table.ColHeader>{t('general.supplier')}</Table.ColHeader>} */}
            <Table.ColHeader>{t('general.amount')} & {t("general.tax")}</Table.ColHeader>
            <Table.ColHeader>{t('general.glaccount_short')} & {t('general.costcenter')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {expenses.edges.map(({ node }) => (
            <Table.Row key={v4()}>
              <Table.Col key={v4()}>
                {moment(node.date).format(dateFormat)} <br />
                {node.supplier && <Badge color="default">{node.supplier.name}</Badge>}
              </Table.Col>
              <Table.Col>
                {node.summary} <br />
                <small className='text-muted'>{node.description}</small>
              </Table.Col>
              {/* <Table.Col>
                {node.supplier && node.supplier.name}
              </Table.Col> */}
              <Table.Col>
                {node.totalAmountDisplay} <Badge color="default">{node.percentageDisplay}</Badge><br />
                <small className="text-small">{node.totalTaxDisplay} <Badge color="default">{node.percentageDisplay}</Badge></small>
              </Table.Col>
              <Table.Col>
                {node.financeGlaccount && <span>
                  <Badge color="default">{node.financeGlaccount.name} {node.financeGlaccount.code && <span>({node.financeGlaccount.code})</span>}</Badge>
                </span>} <br />
                <small className="text-small">
                  {node.financeCostcenter && <span>
                    <Badge color="default">{node.financeCostcenter.name} {node.financeCostcenter.code && <span>({node.financeCostcenter.code})</span>}</Badge>
                  </span>}
                </small>
              </Table.Col>
              <Table.Col className="text-right" key={v4()}>
                {/* Download */}
                <FileProtectedDownloadTableButton protectedMediaUrl={node.urlProtectedDocument} />
                {/* Duplicate */}
                <HasPermissionWrapper key={v4()} permission="add" resource="financeexpense">
                    <ButtonConfirm
                      title={t("finance.expenses.confirm_duplicate")}
                      msgConfirm={<p><b>{moment(node.date).format(dateFormat)} - {node.summary}</b><br/> {node.description}</p>}
                      msgSuccess={(t("finance.expenses.toast_duplicate_success"))}
                      actionFunction={duplicateFinanceExpense} 
                      actionFunctionVariables={{
                        variables: {input: {id: node.id}},
                        refetchQueries: [
                          { query: GET_EXPENSES_QUERY }
                        ]
                      }}
                      buttonClass="btn-secondary"
                      buttonIcon={<Icon name="copy" />}
                      buttonText={t("general.duplicate")}
                      buttonTextColor=""
                    />
                  </HasPermissionWrapper>
                {/* Edit */}
                <Link to={"/finance/expenses/edit/" + node.id}>
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
                      msgConfirm: t("finance.expenses.delete_confirm_msg"),
                      msgDescription: <p>{node.expenseNumber}</p>,
                      msgSuccess: t('finance.expenses.deleted'),
                      deleteFunction: deleteFinanceExpense,
                      functionVariables: { 
                        variables: {
                          input: {
                            id: node.id
                          }
                        }, 
                        refetchQueries: [
                          {query: GET_EXPENSES_QUERY } 
                          // {query: GET_EXPENSES_QUERY, variables: get_list_query_variables() } 
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

export default withTranslation()(withRouter(FinanceExpensesList))