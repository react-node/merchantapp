import React from 'react';
import {
    Avatar,
    ButtonBase,
    colors,
    Grid,
    makeStyles,
    Paper,
    Typography
} from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { GOOGLE_STORAGE_PUBLIC_URL } from 'src/utils/config';


  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    avatar: {
      height: 200,
      width: "100%"
    },
    paper: {
        padding: theme.spacing(2),
        maxWidth: "100%",
      },
      image: {
        width: 128,
        height: 128,
      },
      img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      },
      statsIcon:{
          color:colors.green[300]
      },
      editIcon:{
          color: colors.blue[300]
      }
  }));
const StoreInfo =({store})=>{
    const classes = useStyles();
    return (
            <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                <Avatar
                    alt={store.name}
                    src={GOOGLE_STORAGE_PUBLIC_URL+store.owner+"/"+store.profilepic}
                    variant="square"
                    className={classes.avatar}
                />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography gutterBottom variant="h4" >
                        {store.name}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                        {store.address}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                        </Typography>
                    </Grid>
                    </Grid>
                    <Grid item>
                    <Typography variant="subtitle1"> 
                        <ButtonBase disabled >
                            <VerifiedUserIcon
                            className={classes.statsIcon}
                            color="action"
                            />
                        </ButtonBase>
                    </Typography>
                    </Grid>
                </Grid>
                </Grid>
            </Paper>
            </div>
    
    )
}

export default StoreInfo