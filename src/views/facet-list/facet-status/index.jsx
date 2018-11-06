import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';

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

@inject('appState')
@observer
class FacetStatus extends React.Component {
  render() {
    const { classes, appState } = this.props;

    let studied = 0;
    let facetState = appState.facetStateList.slice();
    let stateLength = facetState.length;
    if (stateLength > 0) {
      facetState.forEach(function(val) {
        studied += parseInt(val, 10);
      });

    }

    return (
      <div className={classes.mark}>
        <span>已学习:<label className={classes.bgGre}>{studied}</label></span>
        <span>未学习:<label className={classes.bgGry}>{stateLength-studied}</label></span>
      </div>
    );
  }
}

export default withStyles(styles)(FacetStatus);