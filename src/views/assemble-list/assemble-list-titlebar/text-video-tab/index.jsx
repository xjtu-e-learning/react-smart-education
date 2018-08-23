import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

@inject('appState')
@observer
class TextVideoTab extends React.Component {

  handleChange = (event, value) => {
    this.props.appState.textOrVideo = value;
  };

  render() {
    const { classes } = this.props;
    const value = this.props.appState.textOrVideo;

    return (
      <Tabs value={value} onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
      >
        <Tab label="富文本"/>
        <Tab label="视频"/>
      </Tabs>
    );
  }
}

TextVideoTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TextVideoTab);