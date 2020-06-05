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
const PATH_hotTopicGetHotTopicsByDomainId =
  '/hotTopic/getHotTopicsByDomainId';
export const PATH_evaluationSaveAssembleEvaluation =
  '/evaluation/saveAssembleEvaluation';

/** AppState类，存储应用中的状态 */
class AppState {
  /**
   * window height
   * @type {number}
   */
  @observable
  clientHeight = document.body.clientHeight;

  @action
  setClientHeight() {
    this.clientHeight = document.body.clientHeight;
  }

  /**
   * 网院课程Id
   * @type {number}
   */
  @observable
  courseId = -1;

  /**
   * 设置网院课程Id操作
   * @param {number} courseId - 网院课程Id
   */
  @action
  setCourseId(courseId) {
    this.courseId = courseId;
  }

  /**
   * 根据网院课程Id，获取领域Id
   * @param {number} courseId - 网院课程Id
   * @type {PromisedComputedValue<any>}
   */
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

  /**
   * 根据网院课程Id，获取领域Name
   * @param {number} courseId
   * @type {PromisedComputedValue<any>}
   */
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

  /**
   * Top主题
   */
  hotTopics = asyncComputed(undefined, 0, async () => {
    if (this.domainId.get() !== undefined) {
      const response = await axios.get(PATH_BASE + PATH_hotTopicGetHotTopicsByDomainId, {
        params: {
          domainId: this.domainId.get()
        }
      });
      const result = await response.data.data.hotTopics;
      if (result == null) return undefined;
      return result.split(',');
    }
  });

  /**
   * 全覆盖路径
   */
  allLearningPath = asyncComputed(undefined, 0, async () => {
    let topicList = this.topicList.get();
    if (this.domainId.get() !== undefined && this.studentCode !== -1 && this.topicList.get()) {
      const response = await axios.get('http://yotta.xjtushilei.com:8083/dependency/LearningPathWeb',
        {
          params: {
            domainId: this.domainId.get(),
            userId: this.studentCode
          }
        });
      const result = await response.data.data;
      if (result == null) return undefined;
      let recarray = [];
      result.split(',').forEach(element1 => {
        topicList.forEach(topic => {
          if (topic.topicId === Number(element1)) {
            recarray.push({
              topicId: topic.topicId,
              topicName: topic.topicName
            });
          }
        });
      });
      return recarray;
    }
  });

  /**
   * 自定义路径
   */
  defineLearningPath = asyncComputed(undefined, 0, async () => {
    let test = this.topicList.get();
    if (
      this.domainId.get() !== undefined &&
      this.studentCode !== -1 &&
      this.topicList.get() !== undefined &&
      this.chosenTopic.topicId !== -1 &&
      this.currentRecommendation !== '零基础'
    ) {
      const response = await axios.get(
        'http://yotta.xjtushilei.com:8083/LearningPathWeb/defineLearningPath',
        {
          params: {
            domainId: this.domainId.get(),
            userId: this.studentCode,
            termId: this.chosenTopic.topicId
          }
        }
      );
      const result = await response.data.data;
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

  /**
   * 根据领域Id和用户Id以及该领域下的topicList拼接出推荐列表
   * @param {number} domainId
   * @param {number} studentCode
   * @param {array<{topicId:number,topicName:string}>} topicList
   * @type {PromisedComputedValue<any>}
   */
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

  /**
   * app对应于网院的软件名（暂未用上）
   * @type {string}
   */
  @observable
  courseWareName = '';

  /**
   * 设置courseWare
   * @param courseWareName
   */
  @action
  setCourseWareName(courseWareName) {
    this.courseWareName = courseWareName;
  }

  /**
   *  网院标注课程的另外一种Id （暂未用上）
   * @type {string}
   */
  @observable
  courseCode = '';

  /**
   * 设置courseId
   * @param courseCode
   */
  @action
  setCourseCode(courseCode) {
    this.courseCode = courseCode;
  }

  /**
   * 用户Id
   * @type {number}
   */
  @observable
  studentCode = -1;

  /**
   * 设置用户Id
   * @param studentCode
   */
  @action
  setStudentCode(studentCode) {
    this.studentCode = studentCode;
  }

  /**
   * app对应于网院的软件Id （暂未用上）
   * @type {number}
   */
  @observable
  courseWareId = -1;

  /**
   * 设置courseId
   * @param courseWareId
   */
  @action
  setCourseWareId(courseWareId) {
    this.courseWareId = courseWareId;
  }

  /**
   * 当前主题推荐方式
   * @type {string}
   */
  @observable
  currentRecommendation = '零基础';

  /**
   * 设置当前主题推荐方式
   * @param currentRecommendation
   */
  @action
  setCurrentRecommendation(currentRecommendation) {
    this.currentRecommendation = currentRecommendation;
  }

  /**
   * 当前主题的信息
   * @type {{topicId: number, topicName: string}}
   */
  @observable
  currentTopic = { topicId: -1, topicName: '' };

  /**
   * 设置当前主题的Id
   * @param {number} currentTopicId
   */
  @action
  setCurrentTopicId(currentTopicId) {
    this.currentTopic.topicId = currentTopicId;
  }

  /**
   * 设置当前主题的Name
   * @param {string} currentTopicName
   */
  @action
  setCurrentTopicName(currentTopicName) {
    this.currentTopic.topicName = currentTopicName;
  }

  /**
   * 当前分面信息
   * @type {{firstLayer: string, secondLayer: string, firstLayerId: number, secondLayerId: number}}
   */
  @observable
  currentFacet = { firstLayer: '', secondLayer: '', firstLayerId: -1, secondLayerId: -1 };

  /**
   * 设置当前分面信息
   * @param {string} firstLayer
   * @param {string} secondLayer
   * @param {number} firstLayerId
   * @param {number} secondLayerId
   */
  @action
  setCurrentFacet(firstLayer, secondLayer, firstLayerId, secondLayerId) {
    this.currentFacet.firstLayer = firstLayer;
    this.currentFacet.secondLayer = secondLayer;
    this.currentFacet.firstLayerId = firstLayerId;
    this.currentFacet.secondLayerId = secondLayerId;
  }

  /**
   * 设置当前二级分面信息
   * @param {string} secondLayer
   * @param {string} secondLayerId
   */
  @action
  setCurrentSecondFacet(secondLayer, secondLayerId) {
    this.currentFacet.secondLayer = secondLayer;
    this.currentFacet.secondLayerId = secondLayerId;
  }

  /**
   * 根据当前推荐方式，返回推荐主题序列
   * @param {string} currentRecommendation
   * @returns {array<{topicId:number,topicName:string}>}
   */
  @computed
  get currentRecommendationList() {
    if (this.allLearningPath === undefined || this.allLearningPath.get() === undefined) return undefined;
    switch (this.currentRecommendation) {
      case '零基础':
        return this.allLearningPath.get();
      case '场景驱动学习':
        return (this.defineLearningPath.get() !== undefined && this.defineLearningPath.get()[0]) || this.allLearningPath.get();
      case '速成学习':
        return (this.defineLearningPath.get() !== undefined && this.defineLearningPath.get()[1]) || this.allLearningPath.get();
      default:
        return this.allLearningPath.get();
    }
  }

  /**
   * 当前选中主题
   */
  @observable chosenTopic = { topicName: '选择知识主题', topicId: -1 };

  @action chooseTopic(topicname, topicid) {
    this.chosenTopic = { topicName: topicname, topicId: topicid };
  }

  /**
   * 待选中主题
   */
  @observable choosingTopic = { topicName: '选择知识主题', topicId: -1 };

  @action setChoosingTopic(topicname, topicid) {
    this.choosingTopic = { topicName: topicname, topicId: topicid };
  }

  /**
   * topicList Modal
   */
  @observable topicListVisible = false;

  @action setTopicListVisible(param) {
    this.topicListVisible = param;
  }

  /**
   * 获取领域下主题序列
   * @param {string} domainName
   * @type {PromisedComputedValue<any>}
   */
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

  /**
   * 获取主题的分面列表
   * @param {string} domainName
   * @param {topicNames} topicNames
   * @type {PromisedComputedValue<any>}
   */
  // facetList = asyncComputed(undefined, 0, async () => {
  //   if (this.currentTopic.topicName !== '' && this.domainName.get() !== undefined) {
  //     const response = await axios.get(
  //       PATH_BASE + PATH_facetGetFacetsByDomainNameAndTopicNames,
  //       {
  //         params: {
  //           domainName: this.domainName.get(),
  //           topicNames: this.currentTopic.topicName
  //         }
  //       }
  //     );
  //     const result = await response.data;
  //     return result.data[this.currentTopic.topicName];
  //   }
  // });

  @computed get facetList() {
    return (this.currentTopic.topicName !== '' && this.facetsList.get() !== undefined) ? this.facetsList.get()[this.currentTopic.topicName] : undefined;
  }
  /**
   * 获取当前主题分面树数据
   * @param {string} domainName
   * @param {string} topicName
   * @type {PromisedComputedValue<any>}
   */
  currentFacetTree = asyncComputed(undefined, 0, async () => {
    if (this.domainName.get() !== undefined && this.currentTopic.topicName !== '') {
      const response = await axios.post(
        PATH_BASE +
        PATH_topicGetCompleteTopicByNameAndDomainNameWithHasFragment +
        '?domainName=' +
        this.domainName.get() +
        '&topicName=' +
        this.currentTopic.topicName.split('+').join('%2B') +
        '&hasFragment=emptyAssembleContent');
      const result = await response.data;
      return result.data;
    }
  });

  /**
   * 获取当前用户当前主题的碎片数据 {text:[{}],video:[{}]}
   * @param {string} domainName
   * @param {topicName} topicName
   * @param {number} userId
   * @type {PromisedComputedValue<any>}
   */
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
        this.currentTopic.topicName.split('+').join('%2B') +
        '&userId=' +
        this.studentCode
      );
      const result = await response.data;
      return result.data[this.currentTopic.topicName];
    }
  });

  /**
   * 根据当前用户所选层级（主题、一级分面、二级分面），过滤currentTopicAssembleList
   * @param {{text:array<{}>,video:array<{}>}} currentTopicAssembleList
   * @param {string} firstLayerFacetName
   * @param {string} secondLayerFacetName
   * @returns {*}
   */
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

  /**
   * 分面展开折叠状态存储列表
   * @type {array<{facetname: boolean}>}
   */
  @observable
  facetCollapse = {};

  /**
   * 设置分面折叠状态
   * @param facetname
   */
  @action
  setFacetCollapse(facetname) {
    if (this.facetCollapse[facetname] === undefined) {
      this.facetCollapse[facetname] = false;
    } else {
      this.facetCollapse[facetname] = !this.facetCollapse[facetname];
    }
  }

  /**
   * 富文本：0 视频：1
   * @type {number}
   */
  @observable
  textOrVideo = 0;

  /**
   * 设置是富文本还是视频
   * @param value
   */
  @action
  setTextOrVideo(value) {
    this.textOrVideo = value;
  }

  /**
   * 知识森林modal
   * @type {boolean}
   */
  @observable
  knowledgeForestVisible = false;

  /**
   * 设置知识森林modal显示与否
   * @param param
   */
  @action
  setKnowledgeForestVisible(param) {
    this.knowledgeForestVisible = param;
  }

  /**
   * 知识森林地图数据
   * @param {string} domainName
   * @type {PromisedComputedValue<any>}
   */
  graphXml = asyncComputed(undefined, 0, async () => {
    if (this.domainName.get() !== undefined) {
      const response = await axios.post(
        PATH_BASE + PATH_dependencyGetDependenciesByDomainNameSaveAsGexf + '?domainName=' + this.domainName.get()
      );
      const result = await response.data;
      return result.data;
    }
  });

  /**
   * 返回DomainId
   * @returns {T}
   * @constructor
   */
  @computed get DomainId() {
    return this.domainId.get();
  }

  /**
   * 主题状态列表
   * @type {Array}
   */
  @observable topicStateList = [];

  /**
   * 手动更新主题状态列表
   * @param {number} userId
   * @param {string} domainId
   * @returns {Promise<void>}
   */
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

  /**
   * 分面状态列表
   * @type {Array}
   */
  @observable facetStateList = [];

  /**
   * 手动更新分面状态列表（不用computed是由于点击碎片需要手动更新）
   * @param {number} domainId
   * @param {topicId} topicId
   * @param {number} userId
   * @returns {Promise<void>}
   */
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

  /**
   * 获取推荐序列的所有主题的分面，用于popover
   * @params {string} domainName
   * @params {array<array<{topic:number,topicName:string}>>} recommendationList
   * @type {PromisedComputedValue<any>}
   */
  facetsList = asyncComputed(undefined, 0, async () => {
    let domainName = this.domainName.get();
    let allLearningPath = this.allLearningPath.get();
    let topics = [];
    if (allLearningPath !== undefined) {
      allLearningPath.forEach(topic => {
        for (let i = 0; i < topics.length; i++) {
          if (topics[i] === topic.topicName) {
            return;
          }
        }
        topics.push(topic.topicName);
        return;
      });
      let topicNames = '';
      topics.forEach(topic => {
        topicNames += topic + ',';
        return;
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

  /**
   * 知识碎片当前页数
   * @type {string}
   */
  @observable
  currentPage = '0';

  /**
   * 设置知识碎片当前页数
   * @param {number} value
   */
  @action
  setCurrentPage(value) {
    this.currentPage = value;
  }

  /**
   * 知识碎片每页显示数量
   * @type {string}
   */
  @observable
  currentPageSize = '10';

  /**
   * 设置知识碎片每页显示数量
   * @param value
   */
  @action
  setCurrentPageSize(value) {
    this.currentPageSize = value;
  }

  /**
   * 设置知识碎片当前页数与每页显示数量
   * @param current
   * @param pageSize
   */
  @action
  setCurrentPageAndPageSize(current, pageSize) {
    this.currentPage = current;
    this.currentPageSize = pageSize;
  }

  /**
   * 当前状态下知识碎片总数
   * @type {string}
   */
  @observable
  totalElements = '0';

  /**
   * 设置当前状态下知识碎片总数
   * @param value
   */
  @action
  setTotalElements(value) {
    this.totalElements = value;
  }

  /**
   * 当前状态知识碎片序列
   * @param {number} facetId
   * @param {number} userId
   * @param {string} requestType
   * @param {number} page
   * @param {number} size
   * @type {PromisedComputedValue<any>}
   */
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

  /**
   *
   * @type {number}
   */
  @observable
  initial = 0;

  /**
   *
   */
  @action
  setInitial() {
    this.initial = 1;
  }
}

const appState = new AppState();

autorun(() => {
  if (appState.domainId !== undefined && appState.currentTopic.topicId !== -1 && appState.studentCode !== -1 && appState.initial === 0) {
    appState.updateFacetTopicStateList();
    appState.updateTopicStateList();
    appState.setInitial();
  }
  // console.log(appState.currentRecommendation);
});

export default appState;
