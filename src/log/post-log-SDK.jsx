import axios from 'axios';

const log_server_url = 'http://yotta.xjtushilei.com:8090';

/**
 * 记录访客日志
 */
export function post_log_of_visit() {
  let params = {};
  if (document) {
    params.domain = document.domain || '';
    params.url = document.URL || '';
    params.title = document.title || '';
    params.referrer = document.referrer || '';
  }
  if (window && window.screen) {
    params.sh = window.screen.height || 0;
    params.sw = window.screen.width || 0;
    params.cd = window.screen.colorDepth || 0;
  }
  if (navigator) {
    params.lang = navigator.language || '';
  }
  // console.log(params)
  axios({
    url: log_server_url + '/log/visit',
    method: 'POST',
    responseType: 'text',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      'Verification-referrer': document.referrer || ''
    }
  })
    .then(function(response) {
      console.log(response);
    });
}

/**
 * 传输用户行为日志
 * @param studentCode 学生id
 * @param pageKind 当前所在页面(学习页面，知识森林页面，未知)
 * @param actionType 行为分类（点击-1级分面，点击-2级分面，点击-主题，点击-碎片，跳转,点击推荐路径类型,点击鸟瞰图，点击视频）
 * @param courseId 课程id
 * @param courseName 课程名字
 * @param topicName 主题名字
 * @param topicId 主题id
 * @param facetNameLevel1Name 1级分面名字
 * @param facetNameLevel1Id 1级分面id
 * @param facetNameLevel2Name 2级分面名字
 * @param facetNameLevel2Id 2级分面id
 * @param fragmentId 碎片id
 * @param jumpTargetType 跳转url类型（内部文件，内部视频，外部网页链接，本系统链接）
 * @param jumpTargetUrl 跳转url
 * @param recommendationMethod 推荐路径类型
 */
function post_log_of_action(studentCode, pageKind, actionType,
                            courseId, courseName, topicName, topicId,
                            facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id,
                            fragmentId, jumpTargetType, jumpTargetUrl, recommendationMethod) {
  let params = {};
  params.user_id = studentCode;
  params.operationSourceId = pageKind;
  params.operationId = actionType;
  params.courseId = courseId;
  params.courseName = courseName;
  params.topicName = topicName;
  params.topicId = topicId;
  params.facetNameLevel1Name = facetNameLevel1Name;
  params.facetNameLevel1Id = facetNameLevel1Id;
  params.facetNameLevel2Name = facetNameLevel2Name;
  params.facetNameLevel2Id = facetNameLevel2Id;
  params.fragmentId = fragmentId;
  params.recommendationMethod = recommendationMethod;
  params.jumpTargetType = jumpTargetType;
  params.jumpTargetUrl = jumpTargetUrl;
  switch (params.operationSourceId) {
    case '学习页面':
      params.operationSourceId = 1;
      break;
    case '知识森林页面':
      params.operationSourceId = 2;
      break;
    default:
      //未知
      params.operationSourceId = 0;
  }
  switch (params.operationId) {
    case '点击-主题':
      params.operationId = 1;
      break;
    case '点击-1级分面':
      params.operationId = 2;
      break;
    case '点击-2级分面':
      params.operationId = 3;
      break;
    case '点击-碎片':
      params.operationId = 4;
      break;
    case '跳转':
      params.operationId = 5;
      break;
    case '点击推荐路径类型':
      params.operationId = 6;
      break;
    case '点击鸟瞰图':
      params.operationId = 7;
      break;
    case '点击视频':
      params.operationId = 8;
      break;
    default:
      //未知
      params.operationId = 0;
  }
  switch (params.jumpTargetType) {
    case '内部文件':
      params.jumpTargetType = 1;
      break;
    case '内部视频':
      params.jumpTargetType = 2;
      break;
    case '本系统链接':
      params.jumpTargetType = 3;
      break;
    case '外部网页链接':
      params.jumpTargetType = 4;
      break;
    case null:
      params.jumpTargetType = null;
      break;
    default:
      //未知
      params.jumpTargetType = 0;
  }
  // console.log(JSON.stringify(params))
  axios({
    url: log_server_url + '/log/action',
    method: 'POST',
    responseType: 'text',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Verification-referrer': document.referrer || ''
    },
    data: JSON.stringify(params)
  })
    .then(function(response) {
      console.log(response);
    });
}

/**
 * 点击主题
 * @param {当前所在页面} pageKind
 * @param {主题名} topicName
 * @param {主题id} topicId
 * @param studentCode
 * @param courseId
 * @param domainName
 */
export function post_log_of_mouseover_topic(pageKind, topicName, topicId, studentCode, courseId, domainName) {
  let actionType = '点击-主题';
  post_log_of_action(studentCode, pageKind, actionType,
    courseId, domainName, topicName, topicId,
    null, null, null, null,
    null, null, null, null);

}

/**
 * 点击分面
 * @param {当前所在页面} pageKind
 * @param {行为分类} actionType
 * @param topicName 主题名字
 * @param topicId 主题id
 * @param facetNameLevel1Name 1级分面名字
 * @param facetNameLevel1Id 1级分面id
 * @param facetNameLevel2Name 2级分面名字
 * @param facetNameLevel2Id 2级分面id
 * @param studentCode
 * @param courseId
 * @param domainName
 */
export function post_log_of_mouseclick_facet(pageKind, actionType, topicName, topicId, facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id, studentCode, courseId, domainName) {
  post_log_of_action(studentCode, pageKind, actionType,
    courseId, domainName, topicName, topicId,
    facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id,
    null, null, null, null);
}

/**
 * 点击碎片
 * @param {当前所在页面} pageKind
 * @param topicName 主题名字
 * @param topicId 主题id
 * @param facetNameLevel1Name 1级分面名字
 * @param facetNameLevel1Id 1级分面id
 * @param facetNameLevel2Name 2级分面名字
 * @param facetNameLevel2Id 2级分面id
 * @param {碎片id} fragmentId
 * @param studentCode
 * @param courseId
 * @param domainName
 */
export function post_log_of_mouseclick_assemble(pageKind, topicName, topicId, facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id, fragmentId, studentCode, courseId, domainName) {
  let actionType = '点击-碎片';
  post_log_of_action(studentCode, pageKind, actionType,
    courseId, domainName, topicName, topicId,
    facetNameLevel1Name, facetNameLevel1Id, facetNameLevel2Name, facetNameLevel2Id,
    fragmentId, null, null, null);
}

export function post_log_of_mouseclick_URL(pageKind, jumpTargetType, jumpTargetUrl, studentCode, courseId, domainName) {
  let actionType = '跳转';
  post_log_of_action(studentCode, pageKind, actionType,
    courseId, domainName, null, null,
    null, null, null, null,
    null, jumpTargetType, jumpTargetUrl, null);
}

/**
 * 推荐路径
 */
export function post_log_of_mouseclick_recommendation(pageKind, recommendationMethod, studentCode, courseId, domainName) {
  let actionType = '点击推荐路径类型';
  post_log_of_action(studentCode, pageKind, actionType,
    courseId, domainName, null, null,
    null, null, null, null,
    null, null, null, recommendationMethod);
}

/**
 * 点击鸟瞰图
 */
export function post_log_of_mouseclick_Global_Graph(pageKind, studentCode, courseId, domainName) {
  let actionType = '点击鸟瞰图';
  post_log_of_action(studentCode, pageKind, actionType,
    courseId, domainName, null, null,
    null, null, null, null,
    null, null, null, null);
}