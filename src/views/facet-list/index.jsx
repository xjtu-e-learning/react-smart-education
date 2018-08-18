import Drawer from '@material-ui/core/Drawer/Drawer';
import List from '@material-ui/core/List/List';
import Typography from '@material-ui/core/Typography/Typography';
import Divider from '@material-ui/core/Divider/Divider';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { inject, observer } from 'mobx-react';
import FacetContent from './facet-content';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: 'white',
    marginTop: 80,
    borderTop: '1px solid rgb(0,0,0,0.12)',
    borderBottom: '1px solid rgb(0,0,0,0.12)',
    height: 'auto',
    minHeight: 600,
    maxHeight: 1000
  },
  topicName: {
    lineHeight: '43px',
    textAlign: 'center'
  },
  toolbar: theme.mixins.toolbar
});

@inject('appState')
@observer
class FacetList extends Component {
  render() {
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: this.props.classes.drawerPaper
        }}
      >
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              {this.props.appState.currentTopic.topicName}
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider className={this.props.classes.divider} />
        <FacetContent />
      </Drawer>
    );
  }
}

export default withStyles(styles)(FacetList);
