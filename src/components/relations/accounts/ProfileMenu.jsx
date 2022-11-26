import React from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'

import { GET_ACCOUNT_QUERY } from './queries'

import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../../HasPermissionWrapper"

let profile_active
let subscriptions_active
let classpasses_active
let classes_active
let documents_active
let tickets_active
let instructor_profile_active
let orders_active
let invoices_active
let bank_account_active
let notes_active
let finance_payment_batch_category_item_active
let accepted_documents_active


function ProfileMenu({t, accountId, activeLink}) {
    const {loading, error, data} = useQuery(GET_ACCOUNT_QUERY, {
        variables: {id: accountId}
    })

    if (loading) return <p>{t('general.loading_with_dots')}</p>
    // Error
    if (error) {
      console.log(error)
      return <p>{t('general.error_sad_smiley')}</p>
    }
    const account = data.account
    console.log('account in profile menu')
    console.log(account)

    return (
      <List.Group transparent={true}>
        {(activeLink === 'profile') ? profile_active = true: profile_active = false}
        {(activeLink === 'subscriptions') ? subscriptions_active = true: subscriptions_active = false}
        {(activeLink === 'classpasses') ? classpasses_active = true: classpasses_active = false}
        {(activeLink === 'classes') ? classes_active = true: classes_active = false}
        {(activeLink === 'documents') ? documents_active = true: documents_active = false}
        {(activeLink === 'tickets') ? tickets_active = true: tickets_active = false}
        {(activeLink === 'instructor_profile') ? instructor_profile_active = true: instructor_profile_active = false}
        {(activeLink === 'orders') ? orders_active = true: orders_active = false}
        {(activeLink === 'invoices') ? invoices_active = true: invoices_active = false}
        {(activeLink === 'bank_account') ? bank_account_active = true: bank_account_active = false}
        {(activeLink === 'notes') ? notes_active = true: notes_active = false}
        {(activeLink === 'finance_payment_batch_category_item') ? 
            finance_payment_batch_category_item_active = true : 
            finance_payment_batch_category_item_active = false }
        {(activeLink === 'accepted_documents') ? accepted_documents_active = true: accepted_documents_active = false}
        

        <List.GroupItem
            key={v4()}
            className="d-flex align-items-center"
            to={"#/relations/accounts/" + accountId + "/profile"}
            icon="user"
            active={profile_active}
        >
            {t('relations.accounts.profile')}
        </List.GroupItem>
        {/* <HasPermissionWrapper 
            permission="view"
            resource="accountmembership">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/memberships"}
                icon="clipboard"
                active={memberships_active}
                >
            {t('relations.account.memberships.title')}
            </List.GroupItem>
        </HasPermissionWrapper> */}
        <HasPermissionWrapper 
            permission="view"
            resource="accountsubscription">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/subscriptions"}
                icon="edit"
                active={subscriptions_active}
                >
            {t('relations.account.subscriptions.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="accountclasspass">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/classpasses"}
                icon="credit-card"
                active={classpasses_active}
                >
            {t('relations.account.classpasses.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="scheduleitemattendance">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/classes"}
                icon="book"
                active={classes_active}
                >
            {t('relations.account.classes.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="scheduleitemenrollment">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/enrollments"}
                icon="refresh-cw"
                active={activeLink === 'enrollments'}
                >
            {t('relations.account.enrollments.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="accountscheduleeventticket">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/event_tickets"}
                icon="clipboard"
                active={tickets_active}
                >
            {t('relations.account.event_tickets.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="accountproduct">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/products"}
                icon="package"
                active={(activeLink === 'products')}
                >
            {t('relations.account.products.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="financeorder">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/orders"}
                icon="file-plus"
                active={orders_active}
                >
            {t('relations.account.orders.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="financequote">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/quotes"}
                icon="file"
                active={(activeLink === "quotes")}
                >
            {t('relations.account.quotes.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="financeinvoice">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/invoices"}
                icon="file-text"
                active={invoices_active}
                >
            {t('relations.account.invoices.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="accountbankaccount">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/bank_accounts"}
                icon="briefcase"
                active={bank_account_active}
                >
            {t('relations.account.bank_accounts.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="accountfinancepaymentbatchcategoryitem">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/finance_payment_batch_category_items"}
                icon="list"
                active={finance_payment_batch_category_item_active}
                >
            {t('relations.account.finance_payment_batch_category_items.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        { (account.instructor) ?
            <HasPermissionWrapper 
                permission="view"
                resource="accountinstructorprofile">
                <List.GroupItem
                    key={v4()}
                    className="d-flex align-items-center"
                    to={"#/relations/accounts/" + accountId + "/instructor_profile"}
                    icon="paperclip"
                    active={instructor_profile_active}
                    >
                {t('relations.account.instructor_profile.title')}
                </List.GroupItem>
            </HasPermissionWrapper>
        : "" }
        <HasPermissionWrapper 
            permission="view"
            resource="accountaccepteddocument">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/accepted_documents"}
                icon="check-square"
                active={accepted_documents_active}
                >
            {t('relations.account.accepted_documents.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="accountdocument">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/documents"}
                icon="file"
                active={documents_active}
                >
            {t('relations.account.documents.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="view"
            resource="accountnote">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/notes"}
                icon="message-square"
                active={notes_active}
                >
            {t('relations.account.notes.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            permission="change"
            resource="account">
            <List.GroupItem
                key={v4()}
                className="d-flex align-items-center"
                to={"#/relations/accounts/" + accountId + "/password"}
                icon="lock"
                active={(activeLink === 'password')}
                >
            {t('relations.account.password.title')}
            </List.GroupItem>
        </HasPermissionWrapper>
    </List.Group>
  )
}

export default withTranslation()(ProfileMenu)