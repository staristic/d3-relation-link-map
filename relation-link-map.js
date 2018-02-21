function RelationLinkMapPainting(options) {
  this.config = {
    paddingTop: 5,
    paddingLeft: 0,
    paddingBottom: 5,
    paddingRight: 0,
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 20,
      verticlePadding: 10,
      horizonPadding: 10,
      maxTextWidth: 320,
      marginBottom: 5,
      textAlign: 'middle',
      fontFamily: '"century-std", "noto-serif-patch", "source-han-serif-tc"',
      color: ['black'],
      backgroundColor: ['transparent'],
      stripe: false,
      cursor: 'initial'
    },
    node: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 20,
      verticlePadding: 5,
      horizonPadding: 5,
      maxTextWidth: 50,
      margin: 10,
      textAlign: 'middle',
      fontFamily: '"century-std", "noto-serif-patch", "source-han-serif-tc"',
      color: ['black'],
      backgroundColor: ['#FF5368', '#FFB55D', '#F8E71C', '#B7F661', '#50E3C2', '#4DEBDF'],
      stripe: true,
      cursor: 'pointer'
    },
    line: {
      opacity: 0.5
    },
    focusMode: {
      reorder: true,
      unrelatedNode: 'disappear' // disappear OR fade
    },
    rwd: {
      on: true,
      limit: 10000,
      colMargin: [1]
    }
  }
  
  let config = this.config
  if (typeof options === 'object') {
    for (let i in config) {
      if(['title', 'node', 'focusMode', 'line', 'rwd'].indexOf(i) >= 0) {
        if (typeof options[i] === 'object') {
          for (let j in options[i]) {
            if(['fontFamily', 'color', 'reorder', 'unrelatedNode', 'on'].indexOf(j) >= 0) {
              if (typeof options[i][j] !== 'undefined') {
                // TODO: check format
                config[i][j] = options[i][j]
              }
            } else {
              let tempSize = getSizePx(options[i][j])
              config[i][j] = tempSize === false ? config[i][j] : tempSize
            }
          }
        }
      } else {
        if (typeof options[i] !== 'undefined') {
          let tempSize = getSizePx(options[i])
          config[i] = tempSize === false ? config[i] : tempSize
        }
      }
    }
  }
  const nodeStartY = config.paddingTop + config.title.lineHeight + 2 * config.title.verticlePadding + config.title.marginBottom

  function getPlotX(id, direct) {
    return parseFloat(d3.select('#' + id).attr('x')) + parseFloat((direct === 'right' ? d3.select('#' + id).attr('width') : 0))
  }

  function getPlotY(id) {
    return parseFloat(d3.select('#' + id).attr('y')) + 0.5 * parseFloat(d3.select('#' + id).attr('height'))
  }

  function getArraySum(a) {
    let sum = 0
    for(let w of a) {
      sum += w
    }
    return sum
  }

  function getNodeX(widthInfo, col, elementWidth) {
    let x = config.paddingLeft
    if(config.rwd.on) {
      let space = (elementWidth - getArraySum(widthInfo) - config.paddingRight) / getArraySum(config.rwd.colMargin)
      for(let i = 0; i < col; i++) {
        x += (widthInfo[i] + space * config.rwd.colMargin[i])
      }
    } else {
      for(let i = 0; i < col; i++) {
        x += (widthInfo[i] + config.rwd.colMargin[i])
      }
    }
    return x
  }

  function getTextX(x, nodeConfig, nodeWidth, colIndex) {
    if(nodeConfig.textAlign === 'left') {
      return {
        x: x + nodeConfig.horizonPadding,
        align: 'start'
      }
    }
    if(nodeConfig.textAlign === 'middle' || nodeConfig.textAlign === 'center') {
      return {
        x: x + nodeWidth / 2,
        align: 'middle'
      }
    }
    if(nodeConfig.textAlign === 'right') {
      return {
        x: x + nodeWidth - nodeConfig.horizonPadding,
        align: 'end'
      }
    }
  }

  function getLineColor(link) {
    let color1 = d3.select('#' + link[0]).style('fill')
    let color2 = d3.select('#' + link[1]).style('fill')
    return color1 === 'transparent' ? color2 : color1
  }

  function getColorInfo(type, col, row) {
    if(!config[type].stripe) {
      return {
        color: config[type].color[row % config[type].color.length],
        backgroundColor: config[type].backgroundColor[row % config[type].backgroundColor.length]
      }
    } else {
      return {
        color: config[type].color[row % config[type].color.length],
        backgroundColor: col % 2 === 0 ? 'transparent' : config[type].backgroundColor[row % config[type].backgroundColor.length]
      }
    }
  }

  function getLineBreak(parent, text, fontSize, maxWidth) {
    parent.append('text')
      .style('font-size', fontSize + 'px')
      .attr('id', 'getLineBreak')
      .text(text)
    let lineBreak = Math.floor(d3.select('#getLineBreak').node().getComputedTextLength() / maxWidth) + 1
    d3.select('#getLineBreak').remove()
    return lineBreak
  }

  function getTextOriginWidth(parent, text, fontSize, maxWidth) {
    parent.append('text')
      .style('font-size', fontSize + 'px')
      .attr('id', 'getTextOriginWidth')
      .text(text)
    let textLen = parseFloat(d3.select('#getTextOriginWidth').node().getComputedTextLength())
    d3.select('#getTextOriginWidth').remove()
    return textLen
  }

  function addRelatedClass(nodeA, nodeB) {
    let originClass = d3.select('#' + nodeA).attr('class')
    d3.select('#' + nodeA).attr('class', originClass + ' related-group-' + nodeB)
    d3.select('#' + nodeA + ' rect').attr('class', originClass + ' related-group-' + nodeB)
    d3.selectAll('#' + nodeA + ' text').attr('class', originClass + ' related-group-' + nodeB)
    d3.selectAll('#' + nodeA + ' tspan').attr('class', originClass + ' related-group-' + nodeB)
    originClass = d3.select('#' + nodeB).attr('class')
    d3.select('#' + nodeB).attr('class', originClass + ' related-group-' + nodeA)
    d3.select('#' + nodeB + ' rect').attr('class', originClass + ' related-group-' + nodeA)
    d3.selectAll('#' + nodeB + ' text').attr('class', originClass + ' related-group-' + nodeA)
    d3.selectAll('#' + nodeB + ' tspan').attr('class', originClass + ' related-group-' + nodeA)
  }

  function drawLink(g, links) {
    for(let link of links) {
      for(let pair of link) {
        let class1 = 'related-group-' + pair[0]
        let class2 = 'related-group-' + pair[1]
        addRelatedClass(pair[0], pair[1])
        g.append('line')
          .attr('x1', getPlotX(pair[0], 'right'))
          .attr('x2', getPlotX(pair[1], 'left'))
          .attr('y1', getPlotY(pair[0]))
          .attr('y2', getPlotY(pair[1]))
          .attr('class', 'interactive ' + class1 + ' ' + class2)
          .style('stroke', getLineColor(pair))
          .style('stroke-width', 2)
          .style('opacity', config.line.opacity)
          .style('stroke-linecap', 'round')
      }
    }
  }

  function getColWidthInfo(parent, data) {
    // TODO: case long text
    let max = []
    let title = []
    for(let i = 0; i < data.length; i++) {
      let nodeWidth = config.node.maxTextWidth + 2 * config.node.horizonPadding
      let titleWidth = getTextOriginWidth(parent, (typeof data[i].title === 'string' ? data[i].title : ''), config.title.fontSize, config.title.maxTextWidth) + 2 * config.title.horizonPadding
      title.push(titleWidth)
      max.push(nodeWidth >= titleWidth ? nodeWidth : titleWidth)
    }
    return [max, title]
  }

  function rePositionNode(averegeMargin, colIndex, columns) {
    let nowY = nodeStartY
    for(let ele of columns[colIndex]) {
      let originY = parseFloat(d3.select('#' + ele.id).attr('y'))
      d3.select('#' + ele.id).attr('y', nowY)
      d3.select('#' + ele.id + ' rect').attr('y', nowY)
      d3.selectAll('#' + ele.id + ' text').each(function(d, i) {
        let textY = parseFloat(d3.select(this).attr('y'))
        d3.select(this).attr('y', textY + (nowY - originY))
      })
      nowY += (parseFloat(d3.select('#' + ele.id).attr('height')) + averegeMargin)
    }
  }

  function getAverage(totalHeight, elements) {
    if(elements.length === 1) {
      return (totalHeight - d3.select('#' + elements[0].id).attr('height')) / 2
    }
    let tempHeight = totalHeight
    for(let ele of elements) {
      tempHeight -= parseFloat(d3.select('#' + ele.id).attr('height'))
    }
    return tempHeight / (elements.length - 1)
  }

  function setNewPosition(positionInfo, dir) {
    d3.select('#' + positionInfo.id).attr('y', positionInfo.y)
    d3.select('#' + positionInfo.id + ' rect').attr('y', positionInfo.y)
    d3.select('#' + positionInfo.id).attr('height', positionInfo.h)
    d3.select('#' + positionInfo.id + ' rect').attr('height', positionInfo.h)
    d3.selectAll('#' + positionInfo.id + ' text').each(function(d, i) {
      d3.select(this).attr('y', positionInfo.ty + i * config.node.lineHeight)
    })
    d3.selectAll('line.related-group-' + positionInfo.id).each(function(d, i) {
      if(parseFloat(d3.select(this).attr('x1')) === positionInfo.rx) {
        d3.select(this).attr('y1', positionInfo.y + 0.5 * positionInfo.h)
      } else if(parseFloat(d3.select(this).attr('x1')) === positionInfo.lx) {
        d3.select(this).attr('y1', positionInfo.y + 0.5 * positionInfo.h)
      } else if(parseFloat(d3.select(this).attr('x2')) === positionInfo.rx) {
        d3.select(this).attr('y2', positionInfo.y + 0.5 * positionInfo.h)
      } else if(parseFloat(d3.select(this).attr('x2')) === positionInfo.lx) {
        d3.select(this).attr('y2', positionInfo.y + 0.5 * positionInfo.h)
      }
    })
  }

  function reorder(core, colIndex, coreColIndex, links, columns, columnsMarginInfo) {
    if(colIndex < 0 || colIndex >= columns.length || columns[colIndex].length <= 1) {
      return
    }
    let coreY = parseFloat(d3.select('#' + core).attr('y'))
    let newOrder = []
    let tempId = []
    let tempRelatedId = []
    let top = 1000000
    for(let n of columns[colIndex]) {
      top = parseFloat(d3.select('#' + n.id).attr('y')) < top ? parseFloat(d3.select('#' + n.id).attr('y')) : top
      newOrder.push({
        rx: parseFloat(d3.select('#' + n.id).attr('x')),
        lx: parseFloat(d3.select('#' + n.id).attr('x')) + parseFloat(d3.select('#' + n.id).attr('width')),
        y: parseFloat(d3.select('#' + n.id).attr('y'))
      })
      tempId.push(n.id)
    }
    newOrder.sort(function(a, b) {
      return Math.abs(parseInt(a.y) - coreY) - Math.abs(parseInt(b.y) - coreY)
    })
    let col = colIndex < coreColIndex ? colIndex : coreColIndex
    let coreSide = colIndex < coreColIndex ? 1 : 0
    for(let link of links[col]) {
      if(link[coreSide] === core) {
        tempId.splice(tempId.indexOf(link[(coreSide + 1) % 2]), 1)
        tempRelatedId.push(link[(coreSide + 1) % 2])
      }
    }
    tempRelatedId.push.apply(tempRelatedId, tempId)
    for(let i = 0; i < tempRelatedId.length; i++) {
      newOrder[i].id = tempRelatedId[i]
      newOrder[i].h = parseFloat(d3.select('#' + tempRelatedId[i]).attr('height'))
    }
    newOrder.sort(function(a, b) {
      return parseInt(a.y) - parseInt(b.y)
    })
    for(let i = 0; i < tempRelatedId.length; i++) {
      if(i === 0) {
        newOrder[i].y = top
      } else {
        newOrder[i].y = newOrder[i - 1].y + newOrder[i - 1].h + columnsMarginInfo[colIndex]
      }
      newOrder[i].ty = newOrder[i].y + config.node.verticlePadding + (config.node.lineHeight / 2)
      setNewPosition(newOrder[i], core, coreSide)
    }
  }

  function emphasis(parent, target, links, columns, columnsMarginInfo) {
    let colIndex = 0
    for(let i = 0; i < columns.length; i++) {
      for(let j = 0; j < columns[i].length; j++) {
        if(columns[i][j].id === target) {
          colIndex = i
          break
        }
      }
    }
    if(config.focusMode.unrelatedNode === 'disappear') {
      parent.selectAll('.interactive').style('opacity', 0)
    }
    if(config.focusMode.unrelatedNode === 'fade') {
      parent.selectAll('.interactive').style('opacity', 0.5)
    }
    parent.selectAll('.related-group-' + target).style('opacity', 1)
    if(config.focusMode.reorder) {
      reorder(target, colIndex + 1, colIndex, links, columns, columnsMarginInfo)
      reorder(target, colIndex - 1, colIndex, links, columns, columnsMarginInfo)
    }
  }

  function getSizePx(sizeString) {
    // ex: 12px 1.5rem
    if (typeof sizeString === 'number') {
      if(sizeString >= 0) {
        return sizeString
      } else {
        return false
      }
    }
    const getNumberPart = /^[0-9]+?(?=px$|rem$)/g
    let tempMatch = sizeString.match(getNumberPart)
    if(tempMatch && tempMatch.length === 1) {
      let size = parseFloat(tempMatch[0])
      if(sizeString.includes('px')) {
        return size
      }
      if(sizeString.includes('rem')) {
        return size * rem
      }
    } else {
      return false
    }
  }

  function getEmPixels(element) {
    const important = '!important;'
    const style = 'position:absolute' + important + 'visibility:hidden' + important + 'width:1em' + important + 'font-size:1em' + important + 'padding:0' + important
    let extraBody
    if (!element) {
      // Emulate the documentElement to get rem value
      element = extraBody = document.createElement('body')
      extraBody.style.cssText = 'font-size:1em' + important
      document.documentElement.insertBefore(extraBody, document.body)
    }
    // Create and style a test element
    let testElement = document.createElement('i')
    testElement.style.cssText = style
    element.appendChild(testElement)
    // Get the client width of the test element
    let px = testElement.clientWidth
    if (extraBody) {
      // Remove the extra body element
      document.documentElement.removeChild(extraBody)
    } else {
      // Remove the test element
      element.removeChild(testElement)
    }
    // Return the em value in pixels
    return px
  }

  function drawNode(parent, nodeConfig, colIndex, x, y, width, nodeInfo, colorInfo, id, clickable, links, columns, columnsMarginInfo) {
    let classString = 'related-group-' + id
    if(nodeInfo.type !== 'title') {
      classString += ' interactive'
    }
    let lineBreak = getLineBreak(parent, nodeInfo.text, nodeConfig.fontSize, nodeConfig.maxTextWidth)
    let newNode = parent.append('g')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', nodeConfig.lineHeight * lineBreak + (2 * nodeConfig.verticlePadding))
      .attr('class', classString)
      .attr('id', id)
      .style('fill', colorInfo.backgroundColor)
    newNode.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', nodeConfig.lineHeight * lineBreak + (2 * nodeConfig.verticlePadding))
      .attr('class', classString)
      .style('cursor', nodeConfig.cursor)
      .style('fill', colorInfo.backgroundColor)
      .on('click', function(x) {
        if(clickable) {
          emphasis(parent, nodeInfo.id, links, columns, columnsMarginInfo)
        }
      })
    let textXInfo = getTextX(x, nodeConfig, width, colIndex)
    for(let i = 0; i < lineBreak; i++) {
      newNode.append('text')
        .attr('x', textXInfo.x)
        .attr('y', y + nodeConfig.verticlePadding + (nodeConfig.lineHeight / 2) + (nodeConfig.lineHeight * i))
        .attr('fill', nodeConfig.color)
        .attr('text-anchor', textXInfo.align)
        .attr('dominant-baseline', 'central')
        .attr('class', classString)
        .style('font-size', nodeConfig.fontSize + 'px')
        .style('font-weight', nodeConfig.fontWeight)
        .style('cursor', nodeConfig.cursor)
        .on('click', function(x) {
          if(clickable) {
            emphasis(parent, nodeInfo.id, links, columns, columnsMarginInfo)
          }
        })
        .append('tspan')
        .attr('text-anchor', textXInfo.align)
        .attr('class', classString)
        .text(nodeInfo.text.substring((i / lineBreak) * nodeInfo.text.length, ((i + 1) / lineBreak) * nodeInfo.text.length))
        .on('click', function(x) {
          if(clickable) {
            emphasis(parent, nodeInfo.id, links, columns, columnsMarginInfo)
          }
        })
    }
    return nodeConfig.lineHeight * lineBreak + (2 * nodeConfig.verticlePadding)
  }
  
  function getRandomString() {
    const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let result = ''
    for(let i = 0; i < 6; i++){
      result += string[parseInt(Math.random() * 10000) % 52]
    }
    return result
  }
  
  function initData(info) {
    // clone it and make id unique
    let magic = getRandomString()
    let result = {
      links: [],
      nodes: []
    }
    for(let col of info.nodes) {
      let temp = {
        title: col.title,
        elements: []
      }
      for(let node of col.elements) {
        temp.elements.push({
          id: 'node' + node.id + magic,
          text: node.text
        })
      }
      result.nodes.push(temp)
    }
    for(let links of info.links) {
      let temp = []
      for(let link of links) {
        temp.push(['node' + link[0] + magic, 'node' + link[1] + magic])
      }
      result.links.push(temp)
    }
    return result
  }

  this.draw = function($el, info) {
    let data = initData(info)
    d3.select($el).select('svg').remove()
    let g = d3.select($el).append('svg').append('g')
    const rem = getEmPixels()
    const windowWidth = window.innerWidth
    config.rwd.colMargin = []
    while(config.rwd.colMargin.length < data.nodes.length - 1) {
      config.rwd.colMargin.push(1)
    }
    // set elements
    let columns = []
    for(let node of data.nodes) {
      columns.push(node.elements)
    }
    let colWidthTemp = getColWidthInfo(g, data.nodes)
    let colWidthInfo = colWidthTemp[0]
    let titleWidthInfo = colWidthTemp[1]
    let isRWDMode = config.rwd.on && windowWidth < config.rwd.limit
    let width
    if(isRWDMode) {
      width = $el.getBoundingClientRect().width
    } else {
      width = config.paddingLeft + config.paddingRight
      for(let i of config.rwd.colMargin) {
        width += i
      }
      for(let i of colWidthInfo) {
        width += i
      }
    }
  
    // columns of nodes
    let maxNodeY = 0
    let maxCol = 0
    let columnsMarginInfo = []
    
    for(let [colIndex, col] of columns.entries()) {
      let x = getNodeX(colWidthInfo, colIndex, $el.getBoundingClientRect().width)
      // title
      let titleInfo = {
        text: data.nodes[colIndex].title,
        id: 'title' + colIndex,
        type: 'title'
      }
      drawNode(g, config.title, colIndex, x, config.paddingTop, titleWidthInfo[colIndex], titleInfo, getColorInfo('title', colIndex, 0))
      // nodes
      let tempY = nodeStartY
      for(let [rowIndex, row] of col.entries()) {
        let nodeHeight = drawNode(g, config.node, colIndex, x + titleWidthInfo[colIndex] / 2 - (config.node.maxTextWidth + 2 * config.node.horizonPadding) / 2, tempY, config.node.maxTextWidth + 2 * config.node.horizonPadding, row, getColorInfo('node', colIndex, rowIndex), row.id, true, data.links, columns, columnsMarginInfo)
        tempY += nodeHeight + config.node.margin
      }
      tempY -= config.node.margin
      maxCol = tempY > maxNodeY ? colIndex : maxCol
      maxNodeY = tempY > maxNodeY ? tempY : maxNodeY
    }
    d3.select($el).select('svg').attr('viewBox', [0, 0, width, maxNodeY + config.paddingBottom].join(' '))
    for(let [colIndex, col] of columns.entries()) {
      if(maxCol !== colIndex) {
        columnsMarginInfo[colIndex] = getAverage(maxNodeY - nodeStartY, col)
        rePositionNode(columnsMarginInfo[colIndex], colIndex, columns)
      } else {
        columnsMarginInfo[colIndex] = config.node.margin
      }
    }
    // links
    drawLink(g, data.links)
    // click other event
    d3.select('body').on('click touchstart', function(x) {
      function returnToOrigin() {
        d3.selectAll('.interactive').style('opacity', 1)
        d3.selectAll('line').style('opacity', config.line.opacity)
      }
      let classContent = d3.event.target.className
      let tagName = d3.event.target.tagName
      if(typeof classContent === 'object') {
        if(tagName === 'line') {
          returnToOrigin()
        }
        if(!classContent.baseVal || classContent.baseVal === '') {
          returnToOrigin()
        }
        if(classContent.baseVal && !classContent.baseVal.match(/interactive/g)) {
          returnToOrigin()
        }
      } else {
        returnToOrigin()
      }
    })
  }
  
}
