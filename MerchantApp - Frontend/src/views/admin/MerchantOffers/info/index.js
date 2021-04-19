import { Container, makeStyles } from '@material-ui/core'
import React from 'react'
import Page from 'src/components/Page'
import OffersInfoView from './offersInfo'
const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    },
    productCard: {
      height: '100%'
    }
  }));
 
const MerchantOffersInfoView =()=>{
    const classes = useStyles()

    return (<Page
        className={classes.root}
        title="Merchant Offer Details"
        >
            <Container maxWidth={false}>
                <OffersInfoView />
            </Container>
        </Page>)
}

export default MerchantOffersInfoView