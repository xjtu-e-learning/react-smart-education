import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import KnowledgeForestModal from './knowledge-forest-modal';
import KnowledgeForestRecommendation from './knowledge-forest-recommendation';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class ModalTabs extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange} centered>
            <Tab label="认知路径"/>
            <Tab label="推荐路径"/>
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><KnowledgeForestModal/></TabContainer>}
        {value === 1 && <TabContainer><KnowledgeForestRecommendation/></TabContainer>}
      </div>
    );
  }
}

ModalTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ModalTabs);