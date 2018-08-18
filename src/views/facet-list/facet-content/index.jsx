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

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
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

  handleClickWithFacet = event => {
    if (event.target.innerText !== undefined) {
      let facetname = event.target.innerText;
      this.props.appState.setFacetCollapse(facetname);
    }
  };

  handleClick = event => {};

  render() {
    const { classes } = this.props;

    if (this.props.appState.facetList.get() !== undefined) {
      this.props.appState.facetList.get().map(facet => {
        if (
          facet.secondLayerFacets.length !== 0 &&
          this.props.appState.facetCollapse[facet.firstLayerFacetName] ===
            undefined
        ) {
          this.props.appState.setFacetCollapse(facet.firstLayerFacetName);
        }
      });
    }

    return (
      <div className={classes.root}>
        <List component="nav">
          {this.props.appState.facetList.get() !== undefined
            ? this.props.appState.facetList.get().map(facet => {
                if (facet.secondLayerFacets.length === 0) {
                  return (
                    <ListItem
                      button
                      key={facet.firstLayerFacetId}
                      onClick={this.handleClick}
                    >
                      <div>
                        <Badge status="success" />
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
                        onClick={this.handleClick}
                      >
                        <ListItemIcon>
                          <StarBorder />
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
                      <ListItem button onClick={this.handleClickWithFacet}>
                        <div>
                          <Badge status="success" />
                        </div>
                        <ListItemText
                          disableTypography
                          className={classes.fontsize14}
                          inset
                          primary={facet.firstLayerFacetName}
                        />
                        {this.props.appState.facetCollapse[
                          facet.firstLayerFacetName
                        ] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Collapse
                        in={
                          !this.props.appState.facetCollapse[
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
