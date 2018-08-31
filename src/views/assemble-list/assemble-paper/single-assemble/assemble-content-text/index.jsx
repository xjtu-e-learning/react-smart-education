import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { post_log_of_mouseclick_assemble } from '../../../../../log/post-log-SDK';
import { updateState } from '../../../../../store/update-state';
import AssembleContentFooter from '../assemble-content-footer';
import Divider from '@material-ui/core/Divider/Divider';
import Drawer from '@material-ui/core/Drawer/Drawer';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: 16
  },
  mouse: {
    cursor: 'pointer'
  },
  divider: {
    marginTop: 16,
    marginBottom: 16
  }
});

class AssembleContentText extends React.Component {

  handleClick = (topicName, topicId, firstLayerFacetName, firstLayerFacetId, secondLayerFacetName, secondLayerFacetId, assembleId, studentCode, courseId, domainName, domainId) => {
    this.props.setSet({ replicate: !this.props.replicate });
    updateState(domainId, studentCode);
    post_log_of_mouseclick_assemble('学习页面', topicName, topicId,
      firstLayerFacetName, firstLayerFacetId, secondLayerFacetName, secondLayerFacetId, assembleId, studentCode, courseId, domainName);
  };

  render() {
    const { classes, assemble, studentCode, courseId, domainName, domainId } = this.props;
    const assemblecontent =
      assemble !== undefined
        ? assemble.assembleContent
        : '';

    return (
      <div>
        <Paper className={classes.root} elevation={2}>
          {this.props.replicate === true ? (
            <div onClick={this.handleClick.bind(this, assemble.topicName, assemble.topicId,
              assemble.firstLayerFacetName, assemble.firstLayerFacetId, assemble.secondLayerFacetName, assemble.secondLayerFacetId, assemble.assembleId,
              studentCode, courseId, domainName, domainId
            )} className={classes.mouse}>
              <HTMLEllipsis
                unsafeHTML={assemblecontent}
                maxLine="5"
                ellipsisHTML="<a>...查看更多</a>"
                basedOn="letters"
              />
            </div>
          ) : (
            <div>
              <div dangerouslySetInnerHTML={{ __html: assemblecontent }}/>
              <Divider className={this.props.classes.divider}/>
              <AssembleContentFooter setSet={this.props.setSet} replicate={this.props.replicate}/>
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(AssembleContentText);
