import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AssembleTitle from './assemble-title';
import AssembleContentLess from './assemble-content-less';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  grid: {
    padding: 16
  },
  paper: {
    // padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  }
});

@inject('appState')
@observer
class AssemblePaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { replicate: true };
  }

  setSet = obj => {
    this.setState(obj);
  };

  render() {
    const { classes } = this.props;
    const currentAssembleList = this.props.appState.currentAssembleList;
    return (
      <Grid className={classes.grid} container spacing={24}>
        {currentAssembleList.length !== 0
          ? currentAssembleList.map(assemble => (
              <Grid item xs={12} key={assemble.assembleId}>
                <Paper className={classes.paper}>
                  <AssembleTitle />
                  <AssembleContentLess assemble={assemble} />
                </Paper>
              </Grid>
            ))
          : null}
      </Grid>
    );
  }
}

export default withStyles(styles)(AssemblePaper);
