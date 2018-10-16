import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import TextVideoTab from './text-video-tab';

const styles = theme => ({
  assemblenum: {
    flexGrow: 1
  }
});

@inject('appState')
@observer
class AssembleListTitlebar extends React.Component {
  render() {
    const { appState } = this.props;
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography className={this.props.classes.assemblenum} variant="h6" color="inherit">
            当前页碎片数量： {appState.currentAssembles.get() !== undefined ? appState.currentAssembles.get().content.length : 0}
          </Typography>
          <TextVideoTab/>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(AssembleListTitlebar);
