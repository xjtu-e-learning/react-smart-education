import React from 'react';
import { Pagination } from 'antd';
import { withStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  div: {
    padding: 8,
    textAlign: 'center'
  }
});

@inject('appState')
@observer
class AssemblePagination extends React.Component {

  onShowSizeChange = (current, pageSize) => {
    // console.log(current, pageSize);
    this.props.appState.setCurrentPageAndPageSize(current - 1, pageSize);
  };

  onChange = (current, pageSize) => {
    this.props.appState.setCurrentPage(current - 1);
  };

  render() {
    const { classes } = this.props;
    let totalElements = Number(this.props.appState.totalElements);
    return (
      <div className={classes.div}>
        <Pagination showSizeChanger onChange={this.onChange} onShowSizeChange={this.onShowSizeChange}
                    total={totalElements} defaultCurrent={Number(this.props.appState.currentPage) + 1}/>
      </div>
    );
  }
}

export default withStyles(styles)(AssemblePagination);