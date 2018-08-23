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
  },
  tabsIndicator: {
    backgroundColor: '#5facfd'
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1
    },
    '&$tabSelected': {
      color: '#5facfd',
      fontWeight: theme.typography.fontWeightMedium
    },
    '&:focus': {
      color: '#5facfd'
    }
  },
  tabSelected: {}
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
            classes={{ indicator: classes.tabsIndicator }}
      >
        <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="富文本"/>
        <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="视频"/>
      </Tabs>
    );
  }
}

TextVideoTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TextVideoTab);