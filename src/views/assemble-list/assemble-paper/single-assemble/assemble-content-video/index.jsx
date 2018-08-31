import React from 'react';
import { Player } from 'video-react';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import 'video-react/dist/video-react.css';

const styles = theme => ({});

@inject('appState')
@observer
class AssembleContentVideo extends React.Component {
  extractVideoUrl = (content) => {
    let pattern = new RegExp('http.*mp4');
    return pattern.exec(content) !== null ? pattern.exec(content)[0] : null;
  };

  render() {
    return (
      <div>
        {
          this.extractVideoUrl(this.props.assemble.assembleText) !== null && (
            <Player
              playsInline
              src={this.extractVideoUrl(this.props.assemble.assembleText)}
            >
            </Player>
          )
        }
      </div>);
  }
}

export default withStyles(styles)(AssembleContentVideo);
