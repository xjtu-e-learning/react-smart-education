import React, { Component } from 'react';
import List from '@material-ui/core/List/List';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider/Divider';
import Drawer from '@material-ui/core/Drawer/Drawer';
import { withStyles } from '@material-ui/core/styles';

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
          <Button
            variant="contained"
            size="large"
            color="primary"
            className={this.props.classes.button}
          >
            主题推荐方式
          </Button>
        </List>
        <Divider className={this.props.classes.divider} />
        <List />
      </Drawer>
    );
  }
}

export default withStyles(styles)(RecommendationList);
