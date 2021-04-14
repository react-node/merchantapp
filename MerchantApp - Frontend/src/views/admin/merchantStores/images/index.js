import { Container, makeStyles } from '@material-ui/core'
import React from 'react'
import Page from 'src/components/Page'
import StoresImagesView from './storeImages'
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
 
const MerchantStoresImagesView =()=>{
    const classes = useStyles()

    return (<Page
        className={classes.root}
        title="User Details"
        >
            <Container maxWidth={false}>
                <StoresImagesView />
            </Container>
        </Page>)
}

export default MerchantStoresImagesView