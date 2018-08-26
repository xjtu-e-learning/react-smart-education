import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { draw_tree, buildTree } from './buildsimpletree';
import { select } from 'd3-selection';

const styles = themes => ({
  canvas: {
    width: 240,
    height: 400,
    position: 'fixed',
    bottom: 0
  }
});

class FacetTree extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  update(data) {
    select('div#canvas').selectAll('svg').remove();
    const canvas = select('div#canvas')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');
    let seed = {
      x: 110,
      y: 380,
      name: data.topicName !== undefined ? data.topicName : ''
    };
    let tree = buildTree(data, seed, 0.8);
    draw_tree(tree, seed, canvas, 0.8);
  }

  componentDidMount() {
    const { currentFacetTree } = this.props;
    if (currentFacetTree !== undefined) {
      this.update(currentFacetTree);
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
      <div id='canvas' className={classes.canvas}></div>
    );
  }
}

FacetTree.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FacetTree);