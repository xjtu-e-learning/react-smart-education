import { select, selectAll } from 'd3-selection';
import appState from '../../../store/app-state.js';

let angles = [];
let xs = [];
let ys = [];
let minHeight = 0;
let Height = [400, 390, 380, 365, 350, 335, 320, 300, 280, 260, 240, 220, 200, 180];
let foldLength = [];
let branchLimits = 7;

// 画布长宽
let canvasWidth = 240;
let canvasHeight = 350;
// 一级分面宽度
let firstLayerWidth = 16;

// 一级分面间隔
let firstLayerInterval = 4;

// 一级分面弯曲的初始角度
let initialAngle = 125;

// 一级分面之间角度差
let deltaAngle = 16;

// 1:Dust Red 2:Volcano 3:Sunset Orange 4:Calendula Cold 5:Sunrise Yellow 6:Lime 7:Polar Green 8:Cyan 9:Daybreak Blue 10:Geek Blue 11:Golden Purple 12:Magenta
// color = ["#D32731","#DA5526","#E18B29","#E7AC2F","#F1DA38","#B1D837","#7FC236","#6EC1C1","#548FFB","#3E55E7","#6431CC","#CB3392"]
let color = ['#B50010', '#E3A407', '#618FE3', '#E14773', '#547400', '#7C21FF', '#7F572B', '#7CC7C0'];
// 一级分面数量
let FirstLayerNum = 0;

export function drawTree(data, canvas, multiple) {
  // multiple
  let height = Height.map(h => h * multiple);

  canvas.selectAll('g').remove();
  data = processData(data, height);
  FirstLayerNum = data.length;
  if (data.length > 7) {
    minHeight = height[height.length - 2];
  } else {
    minHeight = height[height.length - 1];
  }

  angles = [];
  xs = [];
  ys = [];
  foldLength = [];

  let g = canvas.append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    // 计算一级分枝左上角纵坐标
    .attr('y', function(d) {
      ys.push(canvasHeight - d.h);
      return canvasHeight - d.h;
    })
    // 计算一级分枝左上角横坐标
    .attr('x', function(d, i) {
      // 如果一级分枝数量是奇数
      if (FirstLayerNum % 2) {
        let x = canvasWidth / 2 - firstLayerWidth / 2 - (firstLayerInterval + firstLayerWidth) * (FirstLayerNum - 1) / 2 + (firstLayerInterval + firstLayerWidth) * i;
        xs.push(x);
        return x;
      }
      // 如果一级分枝数量是偶数
      else {
        let x = canvasWidth / 2 + firstLayerInterval / 2 - (firstLayerWidth + firstLayerInterval) * FirstLayerNum / 2 + (firstLayerInterval + firstLayerWidth) * i;
        xs.push(x);
        return x;
      }
    })
    .attr('height', function(d) {
      return d.h;
    })
    .attr('width', firstLayerWidth)
    // 各分枝颜色
    .attr('fill', function(d, i) {
      return color[i];
    });

  // 画一级分枝弯折部分
  let g1 = canvas.append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('y', function(d) {
      return canvasHeight - d.h;
    })
    .attr('x', function(d, i) {
      // return i*30;
      if (FirstLayerNum % 2) {
        let x = canvasWidth / 2 - firstLayerWidth / 2 - (firstLayerInterval + firstLayerWidth) * (FirstLayerNum - 1) / 2 + (firstLayerInterval + firstLayerWidth) * i;
        if (x === canvasWidth / 2 - firstLayerWidth / 2) {
          return x;
        }
        else if (x < canvasWidth / 2) {
          return x + firstLayerWidth;
        }
        else {
          return x - firstLayerWidth;
        }
      }
      else {
        let x = canvasWidth / 2 + firstLayerInterval / 2 - (firstLayerWidth + firstLayerInterval) * FirstLayerNum / 2 + (firstLayerInterval + firstLayerWidth) * i;
        if (x < canvasWidth / 2) {
          return x + firstLayerWidth;
        }
        else {
          return x - firstLayerWidth;
        }
      }
    })
    .attr('height', function(d, i) {
      if (FirstLayerNum === 1) {
        foldLength.push(d.h / 3);
        return d.h / 4;
      }
      foldLength.push(d.h / 4);
      return d.h / 4;
    })
    .attr('width', firstLayerWidth)
    .attr('fill', function(d, i) {
      return color[i];
    })
    .attr('transform', function(d, i) {
      let y = canvasHeight - d.h;
      if (FirstLayerNum % 2) {
        let x = canvasWidth / 2 - firstLayerWidth / 2 - (firstLayerInterval + firstLayerWidth) * (FirstLayerNum - 1) / 2 + (firstLayerInterval + firstLayerWidth) * i;
        if (x === canvasWidth / 2 - firstLayerWidth / 2) {
          angles.push(180);
          return 'rotate(180 ' + canvasWidth / 2 + ',' + y + ')';
        }
        else if (x < canvasWidth / 2) {
          angles.push(initialAngle + deltaAngle * i);
          return 'rotate(' + (initialAngle + deltaAngle * i) + ' ' + (x + firstLayerWidth) + ',' + y + ')';
        }
        else {
          angles.push(-initialAngle - deltaAngle * (FirstLayerNum - i - 1));
          return 'rotate(' + (-initialAngle - deltaAngle * (FirstLayerNum - i - 1)) + ' ' + x + ',' + y + ')';
        }
      }
      else {
        let x = canvasWidth / 2 + firstLayerInterval / 2 - (firstLayerWidth + firstLayerInterval) * FirstLayerNum / 2 + (firstLayerInterval + firstLayerWidth) * i;
        if (x < canvasWidth / 2) {
          angles.push(initialAngle + deltaAngle * i);
          return 'rotate(' + (initialAngle + deltaAngle * i) + ' ' + (x + firstLayerWidth) + ',' + y + ')';
        }
        else {
          angles.push(-initialAngle - deltaAngle * (FirstLayerNum - i - 1));
          return 'rotate(' + (-initialAngle - deltaAngle * (FirstLayerNum - i - 1)) + ' ' + x + ',' + y + ')';
        }
      }
    });

  let texts = canvas.append('g')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('font-size', '14px')
    .attr('y', function(d) {
      return canvasHeight - d.h;
    })
    .attr('x', function(d, i) {
      return xs[i];
    })
    .attr('fill', 'white');
  for (let i = 0; i < FirstLayerNum; i++) {
    select(texts._groups[0][i])
      .selectAll('tspan')
      .data(data[i].facetName.split(''))
      .enter()
      .append('tspan')
      .attr('x', xs[i] + (firstLayerWidth - 14) / 2)
      .attr('dy', '1.2em')
      .text(function(d) {
        return d;
      });
  }

  let circles = canvas.append('g')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d, i) {
      return xs[i] + firstLayerWidth / 2 + Math.cos(Math.PI * (270 - angles[i]) / 180) * foldLength[i] * 1.5;
    })
    .attr('cy', function(d, i) {
      console.log(d);
      return ys[i] - Math.sin(Math.PI * (270 - angles[i]) / 180) * foldLength[i] * 1.5;
    })
    .attr('r', 16)
    .attr('fill', function(d, i) {
      return color[i];
    })
    .on('click', function(d) {
      if (d.facetId === -1) return;
      appState.setCurrentPage(0);
      appState.setCurrentFacet(d.facetName, '', d.facetId, -1);
    });

}

function processData(arr, height) {

  let branchWithSecondLayer = [];
  let branchWithoutSecondLayer = [];

  // 按有无二级分面对一级分面进行筛选
  arr.children.forEach((element) => {
    if (element.containChildrenFacet === true) {
      branchWithSecondLayer.push(element);
    } else {
      branchWithoutSecondLayer.push(element);
    }
  });
  // 没有二级分面的一级分面按二级分面下的碎片数量降序
  branchWithoutSecondLayer.sort(sortBranch);
  // 有二级分面的一级分面按二级分面数量降序
  branchWithSecondLayer.sort(sortBranch);
  // 对排序后的一级分面进行拼接
  let sortedBranch = branchWithSecondLayer.concat(branchWithoutSecondLayer);

  // 将降序的数组重排，权重大的在中间
  let resultBranch = [];
  if (sortedBranch.length < branchLimits + 1) {
    for (let i = 0; i < sortedBranch.length; i += 2) {
      if (i < sortedBranch.length) {
        sortedBranch[i].h = height[height.length + i - sortedBranch.length];
        resultBranch.unshift(sortedBranch[i]);
      }
      else {
        return resultBranch;
      }
      if (i + 1 < sortedBranch.length) {
        sortedBranch[i + 1].h = height[height.length + i - sortedBranch.length + 1];
        resultBranch.push(sortedBranch[i + 1]);
      }
      else {
        return resultBranch;
      }
    }
  }
  else {
    let combinedBranch = {
      children: [],
      containChildrenFacet: true,
      facetId: -1,
      facetName: '其他分面',
      h: height[height.length - 1],
      parentFacetId: null,
      topicId: null,
      type: 'branch'
    };
    for (let i = 0; i < branchLimits; i += 2) {
      if (i < branchLimits) {
        sortedBranch[i].h = height[height.length + i - branchLimits - 1];
        resultBranch.unshift(sortedBranch[i]);
      }
      else {
        break;
      }
      if (i + 1 < branchLimits) {
        sortedBranch[i + 1].h = height[height.length + i - branchLimits];
        resultBranch.push(sortedBranch[i + 1]);
      }
      else {
        break;
      }
    }
    for (let i = branchLimits; i < sortedBranch.length; i++) {
      combinedBranch.children.push(sortedBranch[i]);
    }
    resultBranch.push(combinedBranch);
  }
  return resultBranch;
}

function sortBranch(a, b) {
  return b.children.length - a.children.length;
}
