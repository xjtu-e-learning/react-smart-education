import { observable, computed, action, autorun } from 'mobx';
import axios from 'axios';
import { asyncComputed } from 'computed-async-mobx';

export const PATH_BASE = 'http://202.117.54.42:8082';
const PATH_getDomainByCourseId = '/wangyuan/getDomainByCourseId';
const PATH_topicGetTopicsByDomainName = '/topic/getTopicsByDomainName';
const PATH_recommendationGetByDomainIdAndUserId =
  '/recommendation/getByDomainIdAndUserId';
const PATH_facetGetFacetsByDomainNameAndTopicNames =
  '/facet/getFacetsByDomainNameAndTopicNames';

class AppState {
  @observable
  courseId = -1;

  @action
  setCourseId(courseId) {
    this.courseId = courseId;
  }

  domainId = asyncComputed(undefined, 0, async () => {
    if (this.courseId !== -1) {
      const response = await axios.get(PATH_BASE + PATH_getDomainByCourseId, {
        params: {
          courseId: this.courseId
        }
      });
      const result = await response.data.data.wiki;
      if (result == null) return undefined;
      return result.domainId;
    }
  });

  domainName = asyncComputed(undefined, 0, async () => {
    if (this.courseId !== -1) {
      const response = await axios.get(PATH_BASE + PATH_getDomainByCourseId, {
        params: {
          courseId: this.courseId
        }
      });
      const result = await response.data.data.wiki;
      if (result == null) return undefined;
      return result.domainName;
    }
  });

  recommendationList = asyncComputed(undefined, 0, async () => {
    let test = this.topicList.get();
    if (
      this.domainId.get() !== undefined &&
      this.studentCode !== -1 &&
      this.topicList.get() !== undefined
    ) {
      const response = await axios.get(
        PATH_BASE + PATH_recommendationGetByDomainIdAndUserId,
        {
          params: {
            domainId: this.domainId.get(),
            userId: this.studentCode
          }
        }
      );
      const result = await response.data.data.recommendationTopics;
      if (result == null) return undefined;
      let recarrays = [];
      result.split(';').forEach(element => {
        let recarray = [];
        element.split(',').forEach(element1 => {
          test.forEach(topic => {
            if (topic.topicId === Number(element1)) {
              recarray.push({
                topicId: topic.topicId,
                topicName: topic.topicName
              });
            }
          });
        });
        recarrays.push(recarray);
      });
      return recarrays;
    }
  });

  @observable
  courserWareName = '';

  @action
  setCourseWareName(courseWareName) {
    this.courserWareName = courseWareName;
  }

  @observable
  courseCode = '';

  @action
  setCourseCode(courseCode) {
    this.courseCode = courseCode;
  }

  @observable
  studentCode = -1;

  @action
  setStudentCode(studentCode) {
    this.studentCode = studentCode;
  }

  @observable
  courseWareId = -1;

  @action
  setCourseWareId(courseWareId) {
    this.courseWareId = courseWareId;
  }

  @observable
  currentRecommendation = '主题推荐方式';

  @action
  setCurrentRecommendation(currentRecommendation) {
    this.currentRecommendation = currentRecommendation;
  }

  @observable
  currentTopic = { topicId: -1, topicName: '' };

  @action
  setCurrentTopicId(currentTopicId) {
    this.currentTopic.topicId = currentTopicId;
  }

  @action
  setCurrentTopicName(currentTopicName) {
    this.currentTopic.topicName = currentTopicName;
  }

  @computed
  get currentRecommendationList() {
    if (this.recommendationList.get() === undefined) return undefined;
    switch (this.currentRecommendation) {
      case '主题推荐方式':
        return this.recommendationList.get()[0];
      case '最短学习路径':
        return this.recommendationList.get()[0];
      case '有效学习路径':
        return this.recommendationList.get()[1];
      case '补全学习路径':
        return this.recommendationList.get()[2];
      case '热度学习路径':
        return this.recommendationList.get()[3];
      default:
        return this.recommendationList.get()[0];
    }
  }

  topicList = asyncComputed(undefined, 0, async () => {
    if (this.domainName.get() !== undefined) {
      const response = await axios.get(
        PATH_BASE + PATH_topicGetTopicsByDomainName,
        {
          params: {
            domainName: this.domainName.get()
          }
        }
      );
      const result = await response.data;
      return result.data;
    }
  });

  facetList = asyncComputed(undefined, 0, async () => {
    if (this.currentTopic.topicName !== '' && this.domainName !== undefined) {
      const response = await axios.get(
        PATH_BASE + PATH_facetGetFacetsByDomainNameAndTopicNames,
        {
          params: {
            domainName: this.domainName.get(),
            topicNames: this.currentTopic.topicName
          }
        }
      );
      const result = await response.data;
      return result.data[this.currentTopic.topicName];
    }
  });
}

const appState = new AppState();

autorun(() => {
  console.log(appState.facetList.get());
});

export default appState;