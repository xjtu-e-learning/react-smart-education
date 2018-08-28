import { observable, computed, action, autorun, flow, runInAction } from 'mobx';
import axios from 'axios';
import { asyncComputed } from 'computed-async-mobx';

export const PATH_BASE = 'http://202.117.54.42:8082';
const PATH_getDomainByCourseId = '/wangyuan/getDomainByCourseId';
const PATH_topicGetTopicsByDomainName = '/topic/getTopicsByDomainName';
const PATH_recommendationGetByDomainIdAndUserId =
  '/recommendation/getByDomainIdAndUserId';
const PATH_facetGetFacetsByDomainNameAndTopicNames =
  '/facet/getFacetsByDomainNameAndTopicNames';
const PATH_assembleGetAssemblesByDomainNameAndTopicNamesAndUserIdSplitByType =
  '/assemble/getAssemblesByDomainNameAndTopicNamesAndUserIdSplitByType';
const PATH_dependencyGetDependenciesByDomainNameSaveAsGexf =
  '/dependency/getDependenciesByDomainNameSaveAsGexf';
const PATH_topicStateGetByDomainIdAndUserIdGroupTopicId =
  '/topicState/getByDomainIdAndUserIdGroupTopicId';
const PATH_topicGetCompleteTopicByNameAndDomainNameWithHasFragment =
  '/topic/getCompleteTopicByNameAndDomainNameWithHasFragment';
const PATH_facetStateGetByDomainIdAndTopicIdAndUserId =
  '/facetState/getByDomainIdAndTopicIdAndUserId';

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
      this.updateTopicStateListWithDomainId(result.domainId);
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

  @observable
  currentFacet = { firstLayer: '', secondLayer: '' };

  @action
  setCurrentFacet(firstLayer, secondLayer) {
    this.currentFacet.firstLayer = firstLayer;
    this.currentFacet.secondLayer = secondLayer;
  }

  @action
  setCurrentSecondFacet(secondLayer) {
    this.currentFacet.secondLayer = secondLayer;
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
    if (this.currentTopic.topicName !== '' && this.domainName.get() !== undefined) {
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

  currentFacetTree = asyncComputed(undefined, 0, async () => {
    if (this.domainName.get() !== undefined && this.currentTopic.topicName !== '') {
      const response = await axios.post(
        PATH_BASE +
        PATH_topicGetCompleteTopicByNameAndDomainNameWithHasFragment +
        '?domainName=' +
        this.domainName.get() +
        '&topicName=' +
        this.currentTopic.topicName +
        '&hasFragment=emptyAssembleContent');
      const result = await response.data;
      return result.data;
    }
  });

  currentTopicAssembleList = asyncComputed(undefined, 0, async () => {
    if (
      this.domainName.get() !== undefined &&
      this.currentTopic.topicName !== '' &&
      this.studentCode !== -1
    ) {
      const response = await axios.post(
        PATH_BASE +
        PATH_assembleGetAssemblesByDomainNameAndTopicNamesAndUserIdSplitByType +
        '?domainName=' +
        this.domainName.get() +
        '&topicNames=' +
        this.currentTopic.topicName +
        '&userId=' +
        this.studentCode
      );
      const result = await response.data;
      return result.data[this.currentTopic.topicName];
    }
  });

  @computed
  get currentAssembleList() {
    let assembleList = { 'text': [], 'video': [] };
    if (this.currentTopicAssembleList.get() !== undefined) {
      const currentTopicAssembleList = this.currentTopicAssembleList.get();
      if (this.currentFacet.firstLayer === '') {
        return this.currentTopicAssembleList.get();
      } else {
        const firstLayer = this.currentFacet.firstLayer;
        if (this.currentFacet.secondLayer === '') {
          currentTopicAssembleList.text.forEach(assemble => {
            if (assemble.firstLayerFacetName === firstLayer) {
              assembleList.text.push(assemble);
            }
          });
          currentTopicAssembleList.video.forEach(assemble => {
            if (assemble.firstLayerFacetName === firstLayer) {
              assembleList.video.push(assemble);
            }
          });
          return assembleList;
        } else {
          const secondLayer = this.currentFacet.secondLayer;
          currentTopicAssembleList.text.forEach(assemble => {
            if (
              assemble.firstLayerFacetName === firstLayer &&
              assemble.secondLayerFacetName === secondLayer
            ) {
              assembleList.text.push(assemble);
            }
          });
          currentTopicAssembleList.video.forEach(assemble => {
            if (
              assemble.firstLayerFacetName === firstLayer &&
              assemble.secondLayerFacetName === secondLayer
            ) {
              assembleList.video.push(assemble);
            }
          });
          return assembleList;
        }
      }
    }
    return assembleList;
  }

  @observable
  facetCollapse = {};

  @action
  setFacetCollapse(facetname) {
    if (this.facetCollapse[facetname] === undefined) {
      this.facetCollapse[facetname] = false;
    } else {
      this.facetCollapse[facetname] = !this.facetCollapse[facetname];
    }
  }

  @observable
  textOrVideo = 0;

  @observable
  knowledgeForestVisible = false;

  @action
  setKnowledgeForestVisible(param) {
    this.knowledgeForestVisible = param;
  }

  graphXml = asyncComputed(undefined, 0, async () => {
    if (this.domainName.get() !== undefined) {
      const response = await axios.post(
        PATH_BASE + PATH_dependencyGetDependenciesByDomainNameSaveAsGexf + '?domainName=' + this.domainName.get()
      );
      const result = await response.data;
      return result.data;
    }
  });

  @computed get DomainId() {
    return this.domainId.get();
  }

  @observable topicStateList = [];

  @action
  async updateTopicStateList() {
    if (this.studentCode !== -1 && this.DomainId !== undefined) {
      try {
        const response = await axios.get(PATH_BASE + PATH_topicStateGetByDomainIdAndUserIdGroupTopicId,
          {
            params: {
              domainId: this.DomainId,
              userId: this.studentCode
            }
          });
        runInAction(() => {
          const result = response.data;
          this.topicStateList = [].concat(result.data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  @action
  async updateTopicStateListWithDomainId(domainId) {
    if (this.studentCode !== -1) {
      try {
        const response = await axios.get(PATH_BASE + PATH_topicStateGetByDomainIdAndUserIdGroupTopicId,
          {
            params: {
              domainId: domainId,
              userId: this.studentCode
            }
          });
        runInAction(() => {
          const result = response.data;
          this.topicStateList = [].concat(result.data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  @observable facetStateList = [];

  @action
  async updateFacetTopicStateList() {
    if (this.domainId !== undefined && this.currentTopic.topicId !== -1 && this.studentCode !== -1) {
      try {
        const response = await axios.get(PATH_BASE + PATH_facetStateGetByDomainIdAndTopicIdAndUserId,
          {
            params: {
              domainId: this.DomainId,
              topicId: this.currentTopic.topicId,
              userId: this.studentCode
            }
          });
        runInAction(() => {
          const result = response.data;
          this.facetStateList = result.data.states.split(',');
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const appState = new AppState();

autorun(() => {
  // console.log(appState.currentTopic.topicId);
  // appState.facetStateList.map(state => {
  //   console.log(state);
  // });
});

export default appState;
