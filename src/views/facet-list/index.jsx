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
import { Popover } from 'antd';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: 'white',
    marginTop: 80,
    borderTop: '1px solid rgb(0,0,0,0.12)',
    // borderBottom: '1px solid rgb(0,0,0,0.12)',
    height: document.body.clientHeight - 480
  },
  JavaFacet: {
    //color: 'white',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '136px'
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
  constructor(props) {
    super(props);
  }

  render() {
    const { appState, classes } = this.props;
    let courseId = appState.courseId;
    //Java课程
    if (courseId === '5') {
      return (
        <Drawer
          variant="permanent"
          classes={{
            paper: this.props.classes.drawerPaper
          }}
          PaperProps={{ style: { height: this.props.appState.clientHeight - 430 } }}
        >
          <AppBar position="static" color="default">
            <Toolbar>
              <Popover content={this.props.appState.currentTopic.topicName} trigger={'hover'}
                       key={this.props.appState.currentTopic.topicId} placement="rightTop">
                <Typography variant="h6" color="inherit" className={classes.JavaFacet}>
                  {this.props.appState.currentTopic.topicName}
                </Typography>
              </Popover>
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
    //其他课程
    else {
      return (
        <Drawer
          variant="permanent"
          classes={{
            paper: this.props.classes.drawerPaper
          }}
          PaperProps={{ style: { height: this.props.appState.clientHeight - 430 } }}
        >
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" color="inherit">
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
}

export default withStyles(styles)(FacetList);
