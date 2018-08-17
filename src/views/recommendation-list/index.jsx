import React, { Component } from 'react';
import List from '@material-ui/core/List/List';
import Divider from '@material-ui/core/Divider/Divider';
import Drawer from '@material-ui/core/Drawer/Drawer';
import { withStyles } from '@material-ui/core/styles';

import RecommendationButton from './recommendation-button';
import RecommendationContent from './recommendation-content';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: '#212329'
  },
  button: {
    margin: theme.spacing.unit,
    backgroundColor: '#212329'
  },
  divider: {
    backgroundColor: '#7AAAFB'
  },
  toolbar: theme.mixins.toolbar
});

class RecommendationList extends Component {
  render() {
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: this.props.classes.drawerPaper
        }}
      >
        <div className={this.props.classes.toolbar} />
        <List>
          <RecommendationButton />
        </List>
        <Divider className={this.props.classes.divider} />
        <RecommendationContent />
      </Drawer>
    );
  }
}

export default withStyles(styles)(RecommendationList);
