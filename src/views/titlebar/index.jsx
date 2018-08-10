import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import AppBar from '@material-ui/core/AppBar';
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#F2F6FC'
  },
  toolBar: {
    padding: 0
  },
  toolBarTitle: {
    backgroundColor: '#5facfe',
    width: drawerWidth,
    height: 64
  },
  toolBarTitleContent: {
    lineHeight: '64px',
    height: '64px',
    fontSize: '24px'
  }
});

class TitleBar extends Component {
  render() {
    return (
      <AppBar position="absolute" className={this.props.classes.appBar}>
        <ToolBar className={this.props.classes.toolBar}>
          <div className={this.props.classes.toolBarTitle}>
            <Typography
              variant="title"
              color="inherit"
              align="center"
              className={this.props.classes.toolBarTitleContent}
              noWrap
            >
              智慧教育示范应用
            </Typography>
          </div>
        </ToolBar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(TitleBar);
