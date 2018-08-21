import Paper from '@material-ui/core/Paper';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AssemblePaper from './assemble-paper';
import AssembleListTitlebar from './assemble-list-titlebar';

const styles = theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
    maxHeight: '100vh',
    overflow: 'auto'
  },
  grid: {
    padding: 16
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  toolbar: theme.mixins.toolbar
});

class AssembleList extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Paper>
          <AssembleListTitlebar />
          <AssemblePaper />
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(AssembleList);
