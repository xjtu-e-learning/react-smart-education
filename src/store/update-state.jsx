import axios from 'axios';
import appState from './app-state';

export function updateState(domainId, studentCode) {
  axios({
    method: 'get',
    // url: 'http://202.117.54.42:8080/LearningPathWeb/Path/States/updateUserStates?domainId=' + domainId + '&userId=' + studentCode,
    url: 'http://yotta.xjtushilei.com:9218/LearningPathWeb/Path/States/updateUserStates?domainId=' + domainId + '&userId=' + studentCode,
    responseType: 'text',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
    .then(
      function(response) {
        appState.updateFacetTopicStateList();
        appState.updateTopicStateList();
        console.log('success update states');
      }).catch(function(response) {
      console.log('failed update states');
    }
  );
}