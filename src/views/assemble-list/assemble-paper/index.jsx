import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AssembleTitle from './assemble-title';
import AssembleContentText from './assemble-content-text';
import AssembleContentVideo from './assemble-content-video';
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
    const { classes, appState } = this.props;
    const currentAssembleList = appState.currentAssembleList;
    const studentCode = appState.studentCode;
    const courseId = appState.courseId;
    const domainName = appState.domainName.get();
    return (
      <Paper className={classes.grid}>
        {currentAssembleList.text.length !== 0 && appState.textOrVideo === 0 &&
        currentAssembleList.text.map(assemble => (
          <Grid item xs={12} key={assemble.assembleId}>
            <Paper className={classes.paper}>
              <AssembleTitle assemblesource={assemble.sourceName}/>
              <AssembleContentText assemble={assemble} studentCode={studentCode} courseId={courseId}
                                   domainName={domainName}/>
            </Paper>
          </Grid>
        ))}
        {currentAssembleList.video.length !== 0 && appState.textOrVideo === 1 &&
        currentAssembleList.video.map(assemble => (
          <Grid item xs={12} key={assemble.assembleId}>
            <Paper className={classes.paper}>
              <AssembleTitle assemblesource={assemble.sourceName}/>
              <AssembleContentVideo assemble={assemble}/>
            </Paper>
          </Grid>
        ))}
      </Paper>
    );
  }
}

export default withStyles(styles)(AssemblePaper);
