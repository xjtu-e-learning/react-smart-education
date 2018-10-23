import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer/Drawer';
import { withStyles } from '@material-ui/core/styles';

import KnowledgeForest from './knowledge-forest';
import Recommendation from './recommendation';

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
        <div className={this.props.classes.toolbar}/>
        <Recommendation/>
        <KnowledgeForest/>
      </Drawer>
    );
  }
}

export default withStyles(styles)(RecommendationList);
