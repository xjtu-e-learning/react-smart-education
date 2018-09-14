import Drawer from '@material-ui/core/Drawer/Drawer';
import Typography from '@material-ui/core/Typography/Typography';
import Divider from '@material-ui/core/Divider/Divider';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { inject, observer } from 'mobx-react';
import FacetContent from './facet-content';
import FacetTree from './facet-tree';
import FacetStatus from './facet-status';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: 'white',
    marginTop: 80,
    borderTop: '1px solid rgb(0,0,0,0.12)',
    borderBottom: '1px solid rgb(0,0,0,0.12)',
    height: document.body.clientHeight - 480
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
        <Divider className={this.props.classes.divider}/>
        <FacetContent/>
        <FacetStatus/>
        <Divider className={this.props.classes.divider}/>
        <FacetTree currentFacetTree={this.props.appState.currentFacetTree.get()}/>
      </Drawer>
    );
  }
}

export default withStyles(styles)(FacetList);
