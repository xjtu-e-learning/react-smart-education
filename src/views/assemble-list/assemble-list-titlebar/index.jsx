import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';

const styles = theme => ({});

@inject('appState')
@observer
class AssembleListTitlebar extends React.Component {
  render() {
    const { appState } = this.props;
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            碎片数量： {appState.currentAssembleList.length}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(AssembleListTitlebar);
