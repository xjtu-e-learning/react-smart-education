import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import AppBar from '@material-ui/core/AppBar';
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Navigation from './navigation/';
import CourseInfo from './course-info';

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
  },
  linkto: {
    color: '#fff',
    '&:hover': {
      color: '#fff'
    }
  }
});

class TitleBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="absolute" className={classes.appBar}>
        <ToolBar className={classes.toolBar}>
          <div className={classes.toolBarTitle}>
            <Typography
              variant="h6"
              color="inherit"
              align="center"
              className={classes.toolBarTitleContent}
              noWrap
            >
              <a className={classes.linkto} target='_self' href='http://yotta.xjtushilei.com:888/homepage/'>智慧教育示范应用</a>
            </Typography>
          </div>
          <Navigation/>
          <CourseInfo/>
        </ToolBar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(TitleBar);
