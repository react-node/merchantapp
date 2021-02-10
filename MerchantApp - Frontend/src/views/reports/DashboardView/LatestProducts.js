import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {GOOGLE_STORAGE_PUBLIC_URL} from '../../../utils/config'


const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
}));

const LatestProducts = ({ className,storesData, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        subtitle={`${storesData.length} in total`}
        title="Latest Stores"
      />
      <Divider />
      <List>
        {storesData.map((store, i) => (
          <ListItem
            divider={i < storesData.length - 1}
            key={store._id}
          >
            <ListItemAvatar>
              <Avatar
                alt={store.name}
                className={classes.image}
                src={GOOGLE_STORAGE_PUBLIC_URL+store.owner+"/"+store.profilepic}
              />
            </ListItemAvatar>
         
            <ListItemText
              primary={`${store.name}, ${store.address}`}
              secondary={`Updated ${moment(store.updatedAt).fromNow()}`}
            />
            <IconButton
              edge="end"
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string
};

export default LatestProducts;
