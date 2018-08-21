import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

class AssembleListTitlebar extends React.Component {
  render() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            碎片数量
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(AssembleListTitlebar);
