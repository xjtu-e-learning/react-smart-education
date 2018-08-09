import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0 // So the Typography noWrap works
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

class AssembleList extends Component {
  render() {
    return (
      <main className={this.props.classes.content}>
        <div className={this.props.classes.toolbar} />
        <Paper>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="title" color="inherit">
                碎片数量
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid className={this.props.classes.grid} container spacing={24}>
            <Grid item xs={12}>
              <Paper className={this.props.classes.paper}>xs=12</Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={this.props.classes.paper}>xs=6</Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={this.props.classes.paper}>xs=6</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={this.props.classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={this.props.classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={this.props.classes.paper}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={this.props.classes.paper}>xs=3</Paper>
            </Grid>
          </Grid>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(AssembleList);
