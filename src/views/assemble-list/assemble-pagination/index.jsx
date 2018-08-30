import React from 'react';
import { Pagination } from 'antd';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  div: {
    padding: 8,
    textAlign: 'center'
  }
});

class AssemblePagination extends React.Component {

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.div}>
        <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} total={500}/>
      </div>
    );
  }
}

export default withStyles(styles)(AssemblePagination);