import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  mark: {
    paddingLeft: 32
  },
  bgGre: {
    background: '#7FC236',
    color: '#000',
    padding: '1px 5px',
    borderRadius: '10px',
    lineHeight: '18px',
    marginRight: 16
  },
  bgGry: {
    background: '#D8D8D8',
    color: '#000',
    padding: '1px 5px',
    borderRadius: '10px',
    lineHeight: '18px'
  }
});

class FacetStatus extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.mark}>
        <span>已学习:<label className={classes.bgGre}>5</label></span>
        <span>未学习:<label className={classes.bgGry}>5</label></span>
      </div>
    );
  }
}

export default withStyles(styles)(FacetStatus);