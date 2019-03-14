// import React from 'react';
// import d3 from 'd3';
//this javascript file to show the subject tree
//用于显示分面树

// Variables
const step_trunk_height = 90;
const base_trunk_height = 70;
const length_x3x4 = 60;
const length_top_branch = 10;
const angle_top_branch = 0.05;
const length_trunk_to_branch = 55;
const angle_step_branch = 0.1;
const length_base_start_twig = 45;
const angle_twig_step_a3 = 0.8;
const angle_twig_step_a4 = 0.6;
const angle_leaf_step_a3 = 1.6;
const angle_leaf_step_a4 = 0.6;
const fixedTwig = 35;
const twigLength = 20;
const twig_space = 50;
const fixedLeaf = 8;
//树叶长度
const leafLength = 12;
//树叶间距
const leaf_space = 12;
const space_time_leaf = 2;
// const space_time_twig = 2;
// const length_text_line = 15;//碎片知识每行的字数
const trunk_text_size = '16px';
const trunk_text_width = '2px';
const text_seed_x = 13;
const text_seed_y = 18;
const color_trunk = '#330000';
// const color_branch = '#330000';
const color_twig = '#330000';
// const color_hilight_twig = 'brown';
const color_leaf = 'green';
// const color_hilight_leaf = 'yellow';
//树干宽度
const width_trunk = 7;
//枝干宽度
const width_branch = 7;
//树枝宽度
const width_twig = 7;
//高亮树枝宽度
// const width_hilight_twig = 8;
//树叶宽度
const width_leaf = 5;
//高亮树叶宽度
// const width_hilight_leaf = 6;
const width_qtip = 350;
const length_start_leaf_x_level_0 = 55;
const length_start_leaf_x_level_1 = 25;
//Width and height
// const multiple = 1;

// Functions
export function buildTree(data, root, multiple) {
  let branches = [];
  let leaves = [];
  let num_branchs = data['childrenNumber'];
  let num_leaves, num_twigs, num_sprouts, leaf_id = '', leaf_content = '', url = '';
  for (let i = 0; i < num_branchs; i++) {
    // 对每个branch计算坐标
    let name_branch = data['children'][i].facetName;
    let branch = calculate_branch_xy(num_branchs, i, root, multiple, name_branch);
    branches.push(branch);
    leaves.push(branch);
    let isContainSecondLayerFacet = data['children'][i].containChildrenFacet;
    //1级分面，且下面没有二级分面
    if (isContainSecondLayerFacet === false) {
      //level的不同影响叶子在树枝上的位置
      let level = 0;
      num_leaves = data['children'][i].childrenNumber;
      for (let j = 0; j < num_leaves; j++) {
        // 对每个leaf计算坐标
        leaf_id = data['children'][i]['children'][j].assembleId;
        leaf_content = data['children'][i]['children'][j].assembleContent;
        url = data['children'][i]['children'][j].url;
        let leaf = calculate_leaf_xy(branch, num_leaves, j, multiple, level, leaf_id, leaf_content, url);
        leaves.push(leaf);
      }
    }
    //1级分面，且下面有二级分面
    else if (isContainSecondLayerFacet === true) {
      let level = 1;
      num_twigs = data['children'][i].childrenNumber;
      for (let j = 0; j < num_twigs; j++) {
        // 对每个twig计算坐标
        let name_twig = data['children'][i]['children'][j].facetName;
        let twig = calculate_twig_xy(branch, num_branchs, i, num_twigs, j, root, multiple, name_twig);
        leaves.push(twig);
        if (multiple > 0.75) {
          branches.push(twig);
        }
        num_leaves = data['children'][i]['children'][j].childrenNumber;
        for (let k = 0; k < num_leaves; k++) {
          // 对每个leaf计算坐标
          leaf_id = data['children'][i]['children'][j]['children'][k].assembleId;
          leaf_content = data['children'][i]['children'][j]['children'][k].assembleContent;
          url = data['children'][i]['children'][j]['children'][k].url;
          let leaf = calculate_leaf_xy(twig, num_leaves, k, multiple, level, leaf_id, leaf_content, url);
          leaves.push(leaf);
        }
      }
    } else {//3层分枝(包含两种情况：都是3层；部分2层、部分3层)

    }
  }
  return { branches: branches, leaves: leaves };
}

function calculate_branch_xy(num_branchs, i, root, multiple, name_branch) {
  let level = (i < (num_branchs / 2)) ? (i + 1) : (num_branchs - i); // branch的高度， 1为最顶端, num_branchs/2为最底端
  let location = ((i < (num_branchs / 2)) ? 'left' : 'right');
  //(num_branchs/2-i) 和 (i+1-num_branchs/2)），从最顶端往下计算branch长度，保证树冠的形状
  let length_first_branch = ((location === 'left') ? (length_top_branch * (num_branchs / 2 - i)) :
    (length_top_branch * (i + 1 - num_branchs / 2)));
  //(num_branchs/2-i) 和 (i+1-num_branchs/2)），从最顶端往下计算角度，保证树冠的形状
  let a = (location === 'left') ? (-Math.PI * (angle_top_branch + angle_step_branch * (num_branchs / 2 - i))) :
    (Math.PI * (angle_top_branch + angle_step_branch * (i + 1 - num_branchs / 2)));
  let location_center = root.x + width_trunk * multiple * num_branchs / 2;
  let x2 = (location === 'left') ? (location_center - (num_branchs / 2 - i) * width_trunk * multiple / 2) : (location_center + (i - num_branchs / 2) * width_trunk * multiple / 2);
  let y2 = root.y - (level * step_trunk_height + base_trunk_height) * multiple;
  let x3 = ((location === 'left') ? (x2 - length_first_branch * multiple) : (x2 + length_first_branch * multiple));
  let y3 = y2;
  //P4的位置在最短处，叶子往上生长
  let x4 = x3 + length_x3x4 * multiple * Math.sin(a);
  let y4 = y3 - length_x3x4 * multiple * Math.cos(a);
  let mx = x2;
  let my = y2 + length_trunk_to_branch * multiple;
  let cx1 = x2;
  let cy1 = y2;
  let cx2 = x3;
  let cy2 = y3;
  let cx3 = ((x3 + x4) / 2 + x4) / 2;
  let cy3 = ((y3 + y4) / 2 + y4) / 2;
  let d, dx, dy = 12;
  let id = root.name + String(i), textpath = '#' + id;
  let name = name_branch;
  if (location === 'left') { //左边的分支 文字的偏移程度
    d = 'M' + cx3 + ' ' + cy3 + ' C' + cx2 + ' ' + cy2 + ' ' + cx1 + ' ' + cy1 + ' ' + mx + ' ' + my;
    dx = 10 * multiple;
  } else { //右边的分支
    d = 'M' + mx + ' ' + my + ' C' + cx1 + ' ' + cy1 + ' ' + cx2 + ' ' + cy2 + ' ' + cx3 + ' ' + cy3;
    dx = 35 * multiple;
  }
  //旋转顺序不同，确保文字的走向；
  return {
    width: width_branch,
    id: id,
    type: 'branch',
    name: name,
    textpath: textpath,
    d: d,
    x: root.x + i * width_trunk * multiple,
    y: root.y,
    x2: mx,
    y2: my,
    x3: x3,
    y3: y3,
    x4: x4,
    y4: y4,
    a: a,
    i: i,
    mx: mx,
    my: my,
    cx1: cx1,
    cy1: cy1,
    cx2: cx2,
    cy2: cy2,
    cx3: cx3,
    cy3: cy3,
    dx: dx,
    dy: dy
  };
  //return {id:'path'+root.name+'_'+String(i),d:"M"+(root.x + i)+" "+root.y+" L"+x2+" "+y2+" L"+x3+" "+y3+" L"+x4+" "+y4, x:root.x+i, y:root.y, x2:mx, y2:my, x3:x3, y3:y3, x4:x4, y4:y4, a:a,type:'branch', name: data['children'][i].name, i:i, mx:mx,my:my,cx1:cx1,cy1:cy1,cx2:cx2, cy2:cy2,cx3:cx3,cy3:cy3,dx:dx,dy:dy,transform:transform};
}

function calculate_twig_xy(parent, num_branchs, i, num_twig, j, root, multiple, name_twig) {
  if (num_twig === 1) {
    return {
      id: parent.id,
      d: parent.d,
      x3: (parent.x3 + parent.x4) / 2,
      y3: (parent.y3 + parent.y4) / 2,
      a: parent.a,
      type: 'branch',
      name: parent.name,
      i: i
    };
  }
  let location_branch = ((i < (num_branchs / 2)) ? 'left' : 'right');
  let location_twig = ((j < (num_twig / 2)) ? 'bottom' : 'top');
  let count = (location_twig === 'bottom') ? (j * multiple) : (num_twig - j - 1) * multiple; //确定每片叶子的具体位置时用到count
  let a3 = (location_twig === 'top') ? (parent.a - angle_twig_step_a3) : (parent.a + angle_twig_step_a3);
  let a4 = (location_twig === 'top') ? (parent.a - angle_twig_step_a4) : (parent.a + angle_twig_step_a4);
  let start_twig_x, start_twig_y;
  if (j === 0 || j === num_twig - 1) {
    start_twig_x = parent.x4;
    start_twig_y = parent.y4;
  } else {
    start_twig_x = parent.x3 + (length_base_start_twig + twig_space * (count)) * multiple * Math.sin(parent.a);
    ;//从最靠近主干的地方计算叶子位置
    start_twig_y = parent.y3 - (length_base_start_twig + twig_space * (count)) * multiple * Math.cos(parent.a);
  }
  let x3 = start_twig_x + fixedTwig * multiple * Math.sin(a3);
  let y3 = start_twig_y - fixedTwig * multiple * Math.cos(a3);
  let x4 = x3 + twigLength * multiple * Math.sin(a4);
  let y4 = y3 - twigLength * multiple * Math.cos(a4);
  let mx, my, n;
  if (j === 1 || j === num_twig - 2) {
    n = multiple;
  } else {
    n = multiple * 2;
  }
  if (j === 0 || j === num_twig - 1) {
    mx = ((parent.x3 + start_twig_x) / 2 + start_twig_x) / 2;
    my = ((parent.y3 + start_twig_y) / 2 + start_twig_y) / 2;
  } else {
    mx = parent.x3 + (length_base_start_twig + twig_space * count - twig_space * n) * multiple * Math.sin(parent.a);//从最靠近主干的地方计算叶子位置
    my = parent.y3 - (length_base_start_twig + twig_space * count - twig_space * n) * multiple * Math.cos(parent.a);
  }
  let cx1 = start_twig_x;
  let cy1 = start_twig_y;
  let cx2 = x3;
  let cy2 = y3;
  let cx3 = x4;
  let cy3 = y4;
  let id = parent.id + '_' + String(j);
  let textpath = '#' + id;

  let d, dx, dy = -3;
  let name = name_twig;
  if (location_branch === 'left') { //左边分枝上的tie，只有multiple！=1时才会显示tie上的文字
    dx = 5 + 10 * multiple;
    d = 'M' + cx3 + ' ' + cy3 + ' C' + cx2 + ' ' + cy2 + ' ' + cx1 + ' ' + cy1 + ' ' + mx + ' ' + my;
  } else { //右边的分支
    //dx = 15*multiple*(count+1);
    dx = 8 + 15 * multiple;
    d = 'M' + mx + ' ' + my + ' C' + cx1 + ' ' + cy1 + ' ' + cx2 + ' ' + cy2 + ' ' + cx3 + ' ' + cy3;
  }
  return {
    width: width_twig, d: d, id: id, type: 'twig', name: name, textpath: textpath,
    cx2: cx2, cy2: cy2, x3: x3, y3: y3, x4: x4, y4: y4, a: a4, dx: dx, dy: dy
  };
  //return {d:d, type:'twig', id:id, name:name, cx2:cx2, cy2:cy2,x5:x5,y5:y5,x6:x6,y6:y6, a:a6,flag:flag};
}

function calculate_leaf_xy(parent, num_leaves, k, multiple, level, leaf_id, leaf_content, url) {
  let location_leaf = ((k < (num_leaves / 2)) ? 'bottom' : 'top');
  let count = (location_leaf === 'bottom') ? (k * multiple) : (num_leaves - k - 1) * multiple; //确定每片叶子的具体位置时用到count
  let a3 = (location_leaf === 'top') ? (parent.a - angle_leaf_step_a3) : (parent.a + angle_leaf_step_a3);
  let a4 = (location_leaf === 'top') ? (parent.a - angle_leaf_step_a4) : (parent.a + angle_leaf_step_a4);
  let start_leaf_x, start_leaf_y;
  let mx, my, n = space_time_leaf * multiple;
  if (level === 0) {
    start_leaf_x = parent.x3 + (length_start_leaf_x_level_0 + leaf_space * (count)) * multiple * Math.sin(parent.a);//从最靠近主干的地方计算叶子位置
    start_leaf_y = parent.y3 - (length_start_leaf_x_level_0 + leaf_space * (count)) * multiple * Math.cos(parent.a);
    mx = parent.x3 + (length_start_leaf_x_level_0 + leaf_space * count - leaf_space * 3.0) * multiple * Math.sin(parent.a);
    my = parent.y3 - (length_start_leaf_x_level_0 + leaf_space * count - leaf_space * 3.0) * multiple * Math.cos(parent.a);
  } else if (level === 1) {
    start_leaf_x = parent.x3 + (length_start_leaf_x_level_1 + leaf_space * (count)) * multiple * Math.sin(parent.a);//从最靠近主干的地方计算叶子位置
    start_leaf_y = parent.y3 - (length_start_leaf_x_level_1 + leaf_space * (count)) * multiple * Math.cos(parent.a);
    mx = parent.x3 + (length_start_leaf_x_level_1 + leaf_space * count - leaf_space * n) * multiple * Math.sin(parent.a);//从最靠近主干的地方计算叶子位置
    my = parent.y3 - (length_start_leaf_x_level_1 + leaf_space * count - leaf_space * n) * multiple * Math.cos(parent.a);
  }
  if (k === 0 || k === num_leaves - 1) {
    mx = ((parent.x3 + start_leaf_x) / 2 + start_leaf_x) / 2;
    my = ((parent.y3 + start_leaf_y) / 2 + start_leaf_y) / 2;
  }
  let x3 = start_leaf_x + fixedLeaf * multiple * Math.sin(a3);
  let y3 = start_leaf_y - fixedLeaf * multiple * Math.cos(a3);
  let x4 = x3 + leafLength * multiple * Math.sin(a4);
  let y4 = y3 - leafLength * multiple * Math.cos(a4);
  let cx1 = start_leaf_x;
  let cy1 = start_leaf_y;
  let cx2 = x3;
  let cy2 = y3;
  let cx3 = x4;
  let cy3 = y4;
  let d = 'M' + mx + ' ' + my + ' C' + cx1 + ' ' + cy1 + ' ' + cx2 + ' ' + cy2 + ' ' + cx3 + ' ' + cy3;
  let id = parent.id + '_' + String(k);
  let name = leaf_content;
  return {
    width: width_leaf * multiple,
    d: d,
    type: 'leaf',
    id: id,
    name: name,
    cx2: cx2,
    cy2: cy2,
    parent: parent,
    url: url
  };
  //return {d:"M"+cx1+" "+cy1+" L"+x3+" "+y3+" L"+x4+" "+y4,type:'leaf'};
}

// functions for draw
// function highlight(d) {
//   $('.qtip:hidden').remove();
//   let colour, width;
//   if (d.type === 'leaf') {
//     colour = d3.event.type === 'mouseover' ? color_hilight_leaf : color_leaf;
//     width = d3.event.type === 'mouseover' ? width_hilight_leaf * multiple : width_leaf * multiple;
//   } else {
//     colour = d3.event.type === 'mouseover' ? color_hilight_twig : color_twig;
//     width = d3.event.type === 'mouseover' ? width_hilight_twig * multiple : width_twig * multiple;
//   }
//   let display = d3.event.type === 'mouseover' ? null : 'none';
//   let type = d.type;
//   if (multiple < 0.75) {
//     return;
//   }//保证缩小时只显示分面树的主题，不高亮显示twig和叶子的内容
//   d3.select('#' + d.id).style('stroke', colour);
//   d3.select('#' + d.id).style('stroke-width', width);
// }

export function draw_tree(tree, seed, svgobj, multiple) {
  let g = svgobj.append('g')
    .attr('class', 'tree');
  g.selectAll('line') //树干部分
    .data(tree['branches'])
    .enter()
    .append('line')
    .attr('x1', function(d) {
      return d.x;
    })
    .attr('y1', function(d) {
      return d.y;
    })
    .attr('x2', function(d) {
      return d.x2;
    })
    .attr('y2', function(d) {
      return d.y2;
    })
    .style('stroke', color_trunk)
    .style('stroke-width', width_trunk);
  g.selectAll('path') //分枝和叶子部分
    .data(tree['leaves'])
    .enter()
    .append('path')
    .attr('id', function(d) {
      return d.id;
    })
    .attr('class', function(d) {
      return d.type;
    })
    .attr('d', function(d) {
      return d.d;
    })
    .attr('fill', 'none')
    .style('stroke', function(d) {
      return (d.type === 'leaf') ? (color_leaf) : (color_twig);
    })
    .style('stroke-width', function(d) {
      return d.width;
    });
  // .on('mouseover', highlight)
  // .on('mouseout', highlight);
  //.on('click',click);
  //带关闭按钮的提示 且延时3秒关闭
  //显示碎片的提示信息
  // g.selectAll('path')
  //   .on('mouseenter', function(d) {
  //     $(this).qtip({
  //       content: {
  //         text: '<div class=\'leafMessage\'><p>' + d.name + '</p><p><a href=' + d.url + ' target=\'_blank\'>详情</a></p><div>',
  //         /*title: d.id,
  //         button: "关闭"  */
  //         title: {
  //           text: d.id,
  //           button: '关闭'
  //         }
  //       },
  //       position: {
  //         my: 'top middle',
  //         at: 'bottom right'
  //       },
  //       show: {
  //         event: 'click',
  //         solo: true
  //       },
  //       hide: {
  //         event: false,    //设置不自动关闭 可配合inactive组合使用
  //         inactive: 3000   //设置延时关闭
  //       },
  //       style: {
  //         classes: 'qtip-light qtip-shadow qtip-rounded',
  //         tip: {
  //           corner: true,
  //           border: true
  //         }
  //       }
  //     });
  //   });
  if (multiple >= 0.75) {
    g.selectAll('text')//分支部分
      .data(tree['branches'])
      .enter()
      .append('text')
      .attr('dx', function(d) {
        return d.dx;
      })
      .attr('dy', function(d) {
        return d.dy;
      })
      .append('textPath')
      .attr('xlink:href', function(d) {
        return d.textpath;
      })
      .text(function(d) {
        return d.name;
      });
  }
  //根节点
  g.append('text')
    .text(seed.name)
    .attr('x', seed.x + 15 - text_seed_x * seed.name.length / 2)
    .attr('y', seed.y + text_seed_y)
    .style('stroke-width', trunk_text_width)
    .style('font-size', trunk_text_size);
}
