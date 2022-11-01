import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Button,
  GalleryCard,
  Grid,
  Icon
} from "tabler-react";

import { GET_ORGANIZATION_QUERY, UPDATE_ORGANIZATION } from '../queries'
import OrganizationBrandingBase from "./OrganizationBrandingBase"
import OrganizationBrandingEditColorsForm from "./OrganizationBrandingEditColorsForm"


function OrganizationBranding({t, match, history}) {
  const id = match.params.id
  const { loading, error, data } = useQuery(GET_ORGANIZATION_QUERY, {
    variables: {
      id: id
  }})
  const [ updateOrganization ] = useMutation(UPDATE_ORGANIZATION)

  if (loading) return (
    <OrganizationBrandingBase>
      {t("general.loading_with_dots")}
    </OrganizationBrandingBase>
  )
  if (error) return (
    <OrganizationBrandingBase>
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </OrganizationBrandingBase>
  )

  const organization = data.organization

  return (
 
    <OrganizationBrandingBase>
        <Grid.Row>
          <Grid.Col md={4}>
            <GalleryCard>
              <h5>{t('organization.branding.logo_login')}</h5>
              <GalleryCard.Image
                src={organization.urlLogoLogin}
              >
              </GalleryCard.Image>
              <GalleryCard.Details>
                <Link to={`/organization/edit/${id}/branding/logoLogin`}>
                  <Button block color="secondary">
                    {t("organization.branding.link_change")} <Icon name="chevron-right" />
                  </Button>
                </Link>
              </GalleryCard.Details>
            </GalleryCard>
          </Grid.Col>
          <Grid.Col md={4}>
            <GalleryCard>
              <h5>{t('organization.branding.logo_invoice')}</h5>
              <GalleryCard.Image
                src={organization.urlLogoInvoice}
              >
              </GalleryCard.Image>
              <GalleryCard.Details>
                <Link to={`/organization/edit/${id}/branding/logoInvoice`}>
                  <Button block color="secondary">
                    {t("organization.branding.link_change")} <Icon name="chevron-right" />
                  </Button>
                </Link>
              </GalleryCard.Details>
            </GalleryCard>
          </Grid.Col>
          <Grid.Col md={4}>
            <GalleryCard>
              <h5>{t('organization.branding.logo_email')}</h5>
              <GalleryCard.Image
                src={organization.urlLogoEmail}
              >
              </GalleryCard.Image>
              <GalleryCard.Details>
                <Link to={`/organization/edit/${id}/branding/logoEmail`}>
                  <Button block color="secondary">
                    {t("organization.branding.link_change")} <Icon name="chevron-right" />
                  </Button>
                </Link>
              </GalleryCard.Details>
            </GalleryCard>
          </Grid.Col>
          <Grid.Col md={4}>
            <GalleryCard>
              <h5>{t('organization.branding.logo_shop_header')}</h5>
              <GalleryCard.Image
                src={organization.urlLogoShopHeader}
              >
              </GalleryCard.Image>
              <GalleryCard.Details>
                <Link to={`/organization/edit/${id}/branding/logoShopHeader`}>
                  <Button block color="secondary">
                    {t("organization.branding.link_change")} <Icon name="chevron-right" />
                  </Button>
                </Link>
              </GalleryCard.Details>
            </GalleryCard>
          </Grid.Col>
          <Grid.Col md={4}>
            <GalleryCard>
              <h5>{t('organization.branding.logo_self_checkin')}</h5>
              <GalleryCard.Image
                src={organization.urlLogoSelfCheckin}
              >
              </GalleryCard.Image>
              <GalleryCard.Details>
                <Link to={`/organization/edit/${id}/branding/logoSelfCheckin`}>
                  <Button block color="secondary">
                    {t("organization.branding.link_change")} <Icon name="chevron-right" />
                  </Button>
                </Link>
              </GalleryCard.Details>
            </GalleryCard>
          </Grid.Col>
        </Grid.Row>
        {/* Colors */}
        <Grid.Row>
          <Grid.Col md={12}>
            <h3>{t('organization.branding.title_colors')}</h3>
            <Formik
              initialValues={{ 
                colorBackground: organization.brandingColorBackground, 
                colorText: organization.brandingColorText, 
                colorAccent: organization.brandingColorAccent, 
                colorSecondary: organization.brandingColorSecondary, 
              }}
              // validationSchema={LEVEL_SCHEMA}
              onSubmit={(values, { setSubmitting }) => {
                  updateOrganization({ variables: {
                    input: {
                      id: id,
                      brandingColorBackground: values.colorBackground,
                      brandingColorText: values.colorText,
                      brandingColorAccent: values.colorAccent,
                      brandingColorSecondary: values.colorSecondary,
                    }
                  }, refetchQueries: [
                      {query: GET_ORGANIZATION_QUERY, variables: {id: id }}
                  ]})
                  .then(({ data }) => {
                      console.log('got data', data);
                      setSubmitting(false)
                      toast.success((t('organization.branding.toast_save_colors_success')), {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                    }).catch((error) => {
                      toast.error((t('general.toast_server_error')) +  error, {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                      console.log('there was an error sending the query', error)
                      setSubmitting(false)
                    })
              }}
              >
              {({ isSubmitting, errors }) => (
                <OrganizationBrandingEditColorsForm 
                  isSubmitting={isSubmitting}
                  errors={errors}
                />
              )}
            </Formik>
          </Grid.Col>
        </Grid.Row>
    </OrganizationBrandingBase>
  )
}


export default withTranslation()(withRouter(OrganizationBranding))