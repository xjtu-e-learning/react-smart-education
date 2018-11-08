import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import KnowledgeForestModal from './knowledge-forest-modal';
import KnowledgeForestRecommendation from './knowledge-forest-recommendation';
import { inject, observer } from 'mobx-react';

function TabContainer(props) {
  return (
    <div style={{ padding: 8 * 3 }}>
      {props.children}
    </div>
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

@inject('appState')
@observer
class ModalTabs extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentWillMount() {
    if (this.props.appState.currentRecommendation === '零基础' || this.props.appState.chosenTopic.topicId === -1) this.setState({ value: 0 });
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange} centered>
            <Tab label="认知路径"/>
            {this.props.appState.currentRecommendation !== '零基础' && this.props.appState.chosenTopic.topicId !== -1 &&
            <Tab label="推荐路径"/>}
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