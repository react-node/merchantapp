import React from 'react';
import {
  
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import AddStore from './AddStore'
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
 
}));

const AddStoreView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Add Store"
    >
    <Container maxWidth="lg">
        {/* <Grid
          container
          spacing={3}
        >
          
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          > */}
            <AddStore />
          {/* </Grid>
        </Grid> */}
      </Container>
    </Page>
  );
};

export default AddStoreView;
