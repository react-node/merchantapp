import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import StorefrontIcon from '@material-ui/icons/Storefront';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

const TasksProgress = ({ className,totalActiveStoresCount, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              ACTIVE STORES
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
             {totalActiveStoresCount}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <StorefrontIcon />
            </Avatar>
          </Grid>
        </Grid>
        
      </CardContent>
    </Card>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string
};

export default TasksProgress;
