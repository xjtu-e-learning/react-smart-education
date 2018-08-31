import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { inject, observer } from 'mobx-react';
import { Badge } from 'antd';
import { post_log_of_mouseclick_facet } from '../../../log/post-log-SDK';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto'
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  fontsize12: {
    fontSize: '12px'
  },
  fontsize14: {
    fontSize: '14px'
  }
});

@inject('appState')
@observer
class FacetContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickWithFacet = (firstLayerFacetName, topicName, topicId, firstLayerFacetId, studentCode, courseId, domainName, event) => {
    // console.log(event.target.textContent);
    if (event.target.textContent !== '') {
      this.props.appState.setCurrentPage(0);
      this.props.appState.setCurrentFacet(firstLayerFacetName, '', firstLayerFacetId, -1);
      if (studentCode !== -1 && courseId !== -1 && domainName !== undefined) {
        post_log_of_mouseclick_facet('学习页面', '点击-1级分面', topicName, topicId
          , firstLayerFacetName, firstLayerFacetId, null, null, studentCode, courseId, domainName);
      }
    }
    else {
      this.props.appState.setFacetCollapse(firstLayerFacetName);
    }
  };

  handleClick = (firstLayerFacetName, topicName, topicId, firstLayerFacetId, studentCode, courseId, domainName, event) => {
    this.props.appState.setCurrentPage(0);
    this.props.appState.setCurrentFacet(firstLayerFacetName, '', firstLayerFacetId, -1);
    if (studentCode !== -1 && courseId !== -1 && domainName !== undefined) {
      post_log_of_mouseclick_facet('学习页面', '点击-1级分面', topicName, topicId
        , firstLayerFacetName, firstLayerFacetId, null, null, studentCode, courseId, domainName);
    }
  };

  handleClickSecondLayer = (
    firstLayerFacetName, topicName, topicId, firstLayerFacetId, secondLayerFacetName, secondLayerFacetId, studentCode, courseId, domainName
  ) => {
    this.props.appState.setCurrentPage(0);
    this.props.appState.setCurrentFacet(
      firstLayerFacetName,
      secondLayerFacetName,
      firstLayerFacetId,
      secondLayerFacetId
    );
    if (studentCode !== -1 && courseId !== -1 && domainName !== undefined) {
      post_log_of_mouseclick_facet('学习页面', '点击-2级分面', topicName, topicId
        , firstLayerFacetName, firstLayerFacetId, secondLayerFacetName, secondLayerFacetId, studentCode, courseId, domainName);
    }
  };

  render() {
    const { classes, appState } = this.props;
    let studentCode = appState.studentCode;
    let courseId = appState.courseId;
    let domainName = appState.domainName.get();
    if (appState.facetList.get() !== undefined) {
      appState.facetList.get().map(facet => {
        if (
          facet.secondLayerFacets.length !== 0 &&
          appState.facetCollapse[facet.firstLayerFacetName] ===
          undefined
        ) {
          appState.setFacetCollapse(facet.firstLayerFacetName);
        }
      });
    }

    return (
      <div className={classes.root}>
        <List component="nav">
          {appState.facetList.get() !== undefined
            ? appState.facetList.get().map((facet, index) => {
              if (facet.secondLayerFacets.length === 0) {
                // console.log(appState.facetStateList[index]);
                return (
                  <ListItem
                    button
                    key={facet.firstLayerFacetId}
                    onClick={this.handleClick.bind(
                      this,
                      facet.firstLayerFacetName, facet.topicName, facet.topicId, facet.firstLayerFacetId, studentCode, courseId, domainName
                    )}
                  >
                    <div>
                      <Badge
                        status={(appState.facetStateList[index] === '1' && 'success') || (appState.facetStateList[index] === '0' && 'default')}/>
                    </div>
                    <ListItemText
                      disableTypography
                      className={classes.fontsize14}
                      inset
                      primary={facet.firstLayerFacetName}
                    />
                  </ListItem>
                );
              } else {
                const secondLayer = facet.secondLayerFacets.map(
                  secondFacet => (
                    <ListItem
                      button
                      className={classes.nested}
                      key={secondFacet.secondLayerFacetId}
                      onClick={this.handleClickSecondLayer.bind(
                        this,
                        facet.firstLayerFacetName, facet.topicName, facet.topicId, facet.firstLayerFacetId, secondFacet.secondLayerFacetName, secondFacet.secondLayerFacetId, studentCode, courseId, domainName
                      )}
                    >
                      <ListItemIcon>
                        <StarBorder style={{ fontSize: 16, marginRight: 0 }}/>
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        className={classes.fontsize12}
                        inset
                        primary={secondFacet.secondLayerFacetName}
                      />
                    </ListItem>
                  )
                );
                return (
                  <div key={facet.firstLayerFacetId}>
                    <ListItem
                      button
                      onClick={this.handleClickWithFacet.bind(
                        this,
                        facet.firstLayerFacetName, facet.topicName, facet.topicId, facet.firstLayerFacetId, studentCode, courseId, domainName
                      )}
                    >
                      <div>
                        <Badge
                          status={(appState.facetStateList[index] === '1' && 'success') || (appState.facetStateList[index] === '0' && 'default')}/>
                      </div>
                      <ListItemText
                        disableTypography
                        className={classes.fontsize14}
                        inset
                        primary={facet.firstLayerFacetName}
                      />
                      {appState.facetCollapse[
                        facet.firstLayerFacetName
                        ] ? (
                        <ExpandLess/>
                      ) : (
                        <ExpandMore/>
                      )}
                    </ListItem>
                    <Collapse
                      in={
                        !appState.facetCollapse[
                          facet.firstLayerFacetName
                          ]
                      }
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {secondLayer}
                      </List>
                    </Collapse>
                  </div>
                );
              }
            })
            : null}
        </List>
      </div>
    );
  }
}

FacetContent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FacetContent);
