import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { select } from 'd3-selection';
import { drawTree } from './facet-tree-ng';

const styles = themes => ({
  canvas: {
    width: 240,
    height: 350,
    position: 'fixed',
    bottom: 0
  }
});

class FacetTree extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = { k: 0 };
    this.lastdata = null;
  }

  setSet = (obj) => {
    this.setState(obj);
  };

  update(data) {
    if (data !== this.lastdata) {
      this.lastdata = data;
      const canvas = select('div#canvas').select('svg');
      drawTree(data, canvas, 0.6);
    }

  }

  UNSAFE_componentWillReceiveProps({ currentFacetTree }) {
    if (currentFacetTree !== undefined) {
      this.update(currentFacetTree);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { classes } = this.props;

    return (
      <div id='canvas' className={classes.canvas}>
        <svg style={{ width: '100%', height: '100%' }}/>
      </div>
    );
  }
}

FacetTree.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FacetTree);