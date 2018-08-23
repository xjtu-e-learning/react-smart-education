import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AssembleTitle from './assemble-title';
import AssembleContentLess from './assemble-content-less';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  grid: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 16,
    paddingBottom: 16,
    overflow: 'auto',
    // height: 896
    height: document.body.clientHeight - 184
    // position: 'absolute'
  },
  paper: {
    // padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  }
});

@inject('appState')
@observer
class AssemblePaper extends React.Component {

  render() {
    const { classes } = this.props;
    const currentAssembleList = this.props.appState.currentAssembleList;
    return (
      <Paper className={classes.grid}>
        {currentAssembleList.length !== 0 &&
        currentAssembleList.map(assemble => (
          <Grid item xs={12} key={assemble.assembleId}>
            <Paper className={classes.paper}>
              <AssembleTitle assemblesource={assemble.sourceName}/>
              <AssembleContentLess assemble={assemble}/>
            </Paper>
          </Grid>
        ))}
      </Paper>
    );
  }
}

export default withStyles(styles)(AssemblePaper);
