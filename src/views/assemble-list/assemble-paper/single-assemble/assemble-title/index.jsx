import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Badge } from 'antd';
import ListItem from '@material-ui/core/ListItem/ListItem';

const styles = {
  root: {
    flexGrow: 1,
    marginTop: 16
  },
  toolbar: {
    minHeight: 48
  },
  purple: {
    backgroundColor: '#b869f3',
    color: '#fff',
    borderRadius: 10,
    fontSize: 12,
    paddingLeft: 5,
    paddingRight: 5
  },
  blue: {
    backgroundColor: '#83befd',
    color: '#fff',
    borderRadius: 10,
    fontSize: 12,
    paddingLeft: 5,
    paddingRight: 5
  },
  H5: {
    marginBottom: 0
  }
};

class AssembleTitle extends React.Component {
  render() {
    const { classes, evaluation, positive } = this.props;
    const source = this.props.assemblesource;
    const facetname = this.props.assemblefacetname;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar className={classes.toolbar}>
            <div>
              <Badge
                status={(evaluation !== 0 && 'success') || (evaluation === 0 && 'default')}/>
            </div>
            <h5 className={classes.H5}>
              分面：
            </h5>
            <label className={classes.blue}>{facetname}</label>
            <h5 className={classes.H5}>
              数据源：
            </h5>
            <label className={classes.purple}>{source}</label>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

AssembleTitle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AssembleTitle);
