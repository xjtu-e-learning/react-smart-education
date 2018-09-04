import { observable, computed, action, autorun, runInAction } from 'mobx';
import axios from 'axios';
import { asyncComputed } from 'computed-async-mobx';

// export const PATH_BASE = 'http://202.117.54.42:8082';
export const PATH_BASE = 'http://yotta.xjtushilei.com:8083';
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
const PATH_assembleGetAssemblesByFacetIdAndUserIdAndPagingAndSorting =
  '/assemble/getAssemblesByFacetIdAndUserIdAndPagingAndSorting';
const PATH_assembleGetAssemblesByTopicIdAndUserIdAndPagingAndSorting =
  '/assemble/getAssemblesByTopicIdAndUserIdAndPagingAndSorting';
export const PATH_evaluationSaveAssembleEvaluation =
  '/evaluation/saveAssembleEvaluation';

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
  currentFacet = { firstLayer: '', secondLayer: '', firstLayerId: -1, secondLayerId: -1 };

  @action
  setCurrentFacet(firstLayer, secondLayer, firstLayerId, secondLayerId) {
    this.currentFacet.firstLayer = firstLayer;
    this.currentFacet.secondLayer = secondLayer;
    this.currentFacet.firstLayerId = firstLayerId;
    this.currentFacet.secondLayerId = secondLayerId;
  }

  @action
  setCurrentSecondFacet(secondLayer, secondLayerId) {
    this.currentFacet.secondLayer = secondLayer;
    this.currentFacet.secondLayerId = secondLayerId;
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

  @action
  setTextOrVideo(value) {
    this.textOrVideo = value;
  }

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
      this.setInitial();
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

  facetsList = asyncComputed(undefined, 0, async () => {
    let domainName = this.domainName.get();
    let recommendationList = this.recommendationList.get();
    let topics = [];
    if (recommendationList !== undefined) {
      recommendationList.map(recarray => {
        recarray.map(topic => {
          for (let i = 0; i < topics.length; i++) {
            if (topics[i] === topic.topicName) {
              return;
            }
          }
          topics.push(topic.topicName);
        });
      });
      let topicNames = '';
      topics.map(topic => {
        topicNames += topic + ',';
      });
      const response = await axios.get(
        PATH_BASE + PATH_facetGetFacetsByDomainNameAndTopicNames,
        {
          params: {
            domainName: domainName,
            topicNames: topicNames
          }
        });
      return response.data.data;
    }
  });

  @observable
  currentPage = '0';

  @action
  setCurrentPage(value) {
    this.currentPage = value;
  }

  @observable
  currentPageSize = '10';

  @action
  setCurrentPageSize(value) {
    this.currentPageSize = value;
  }

  @action
  setCurrentPageAndPageSize(current, pageSize) {
    this.currentPage = current;
    this.currentPageSize = pageSize;
  }

  @observable
  totalElements = '0';

  @action
  setTotalElements(value) {
    this.totalElements = value;
  }

  currentAssembles = asyncComputed(undefined, 0, async () => {
    if (this.studentCode !== -1) {
      if (this.currentFacet.secondLayerId !== -1) {
        const response = await axios.post(
          PATH_BASE + PATH_assembleGetAssemblesByFacetIdAndUserIdAndPagingAndSorting +
          '?facetId=' +
          this.currentFacet.secondLayerId +
          '&userId=' +
          this.studentCode +
          '&requestType=' +
          (this.textOrVideo === 0 ? 'text' : 'video') +
          '&page=' +
          this.currentPage +
          '&size=' +
          this.currentPageSize +
          '&ascOrder=false');
        this.setTotalElements(response.data.data.totalElements);
        return response.data.data;
      } else if (this.currentFacet.firstLayerId !== -1) {
        const response = await axios.post(
          PATH_BASE + PATH_assembleGetAssemblesByFacetIdAndUserIdAndPagingAndSorting +
          '?facetId=' +
          this.currentFacet.firstLayerId +
          '&userId=' +
          this.studentCode +
          '&requestType=' +
          (this.textOrVideo === 0 ? 'text' : 'video') +
          '&page=' +
          this.currentPage +
          '&size=' +
          this.currentPageSize +
          '&ascOrder=false');
        this.setTotalElements(response.data.data.totalElements);
        return response.data.data;
      } else if (this.currentTopic.topicId !== -1) {
        const response = await axios.post(
          PATH_BASE + PATH_assembleGetAssemblesByTopicIdAndUserIdAndPagingAndSorting +
          '?topicId=' +
          this.currentTopic.topicId +
          '&userId=' +
          this.studentCode +
          '&requestType=' +
          (this.textOrVideo === 0 ? 'text' : 'video') +
          '&page=' +
          this.currentPage +
          '&size=' +
          this.currentPageSize +
          '&ascOrder=false');
        this.setTotalElements(response.data.data.totalElements);
        return response.data.data;
      }
    }
    return undefined;
  });

  @observable
  initial = 0;

  @action
  setInitial() {
    this.initial = 1;
  }
}

const appState = new AppState();

autorun(() => {
  if (appState.domainId !== undefined && appState.currentTopic.topicId !== -1 && appState.studentCode !== -1 && appState.initial === 0) {
    appState.updateFacetTopicStateList();
  }
});

export default appState;
