import React from 'react'
import { withTranslation } from 'react-i18next'
import ButtonBack from "../../ui/ButtonBack"


function ShopAccountBack({ t, returnUrl="/shop/account" }) {
  
  return (
    <ButtonBack returnUrl={returnUrl} />
  )
}

export default withTranslation()(ShopAccountBack)
