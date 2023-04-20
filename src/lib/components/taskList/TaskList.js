import React, { Component } from 'react';
import Config from 'libs/helpers/config/Config';
import ContentEditable from 'libs/components/common/ContentEditable';
import Registry from 'libs/helpers/registry/Registry';
import { FiEye, FiTrash } from "react-icons/fi";
import moment from 'moment';
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export class VerticalLine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="timeLine-main-data-verticalLine" style={{ left: this.props.left }} />;
  }
}

export class TaskRow extends Component {
  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    if (this.props.onUpdateTask) {
      this.props.onUpdateTask(this.props.item, { name: value });
    }
  };

  render() {
    const { item } = this.props

    return (

      <div >
        <div className='div-column-items'>
          <div className='div-row'>
            <div className='div-arrow'>
              {item.children === 0 ? <div /> : item.children ? <FiChevronDown className='icon-arrow' onClick={() => this.props.onOpenChildren(this.props.item, false)} /> : <FiChevronUp className='icon-arrow' onClick={() => this.props.onOpenChildren(this.props.item, true)} />}
              <text>{item.name}</text>
            </div>

          </div>
          <div className='div-row'>{moment(item.start).format('DD/MM/YYYY')} | {moment(item.end).format('DD/MM/YYYY')}</div>
          <div className='div-row' style={{ width: '33%' }}>
            <div>
              <FiEye className='icon-gantt' onClick={(e) => this.props.onSelectItem(this.props.item, 'open')} />
              <FiTrash className='icon-gantt' style={{ color: 'red' }} onClick={(e) => this.props.onSelectItem(this.props.item, 'delete')} />
            </div>
          </div>
        </div>
      </div>

      // <div
      //   className="timeLine-side-task-row"
      //   style={{
      //     ...Config.values.taskList.task.style,
      //     top: this.props.top,
      //     height: this.props.itemheight
      //   }}
      //   onClick={(e) => this.props.onSelectItem(this.props.item)}
      // >
      //   {this.props.nonEditable ? (
      //     <div tabIndex={this.props.index} style={{ width: '100%' }}>
      //       {this.props.label}
      //     </div>
      //   ) : (
      //     <div>
      //       <div>task 1</div>
      //       <div>02/01/2022 | 02/03/2024</div>
      //       <div>teste</div>
      //     </div>
      //     // <ContentEditable value={this.props.label} index={this.props.index} onChange={this.onChange} />
      //   )}
      // </div>
    );
  }
}

export default class TaskList extends Component {
  constructor(props) {
    super(props);
  }

  getContainerStyle(rows) {
    let new_height = rows > 0 ? rows * this.props.itemheight : 10;
    return { height: new_height };
  }

  renderTaskRow(data) {
    let result = [];
    const groups = Registry.groupData(data, this.props.startRow, this.props.endRow + 1);
    Object.keys(groups).forEach((key, i) => {
      const group = groups[key];
      group.forEach(item => {
        result.push(
          <TaskRow
            key={i + item.id}
            index={item.name + i}
            item={item}
            label={key}
            top={i * this.props.itemheight}
            itemheight={this.props.itemheight}
            isSelected={this.props.selectedItem == item}
            onUpdateTask={this.props.onUpdateTask}
            onOpenChildren={this.props.onOpenChildren}
            onSelectItem={this.props.onSelectItem}
            nonEditable={this.props.nonEditable}
          />
        );
      });
    });
    return result;
  }

  doScroll = () => {
    this.props.onScroll(this.refs.taskViewPort.scrollTop);
  };

  render() {
    let data = this.props.data ? this.props.data : [];
    this.containerStyle = this.getContainerStyle(data.length);
    return (
      <div className="timeLine-side">
        <div className='div-column'>
          <div className='div-row'>
            <text>Nome:</text>
          </div>
          <div className='div-row'>
            <text>Data:</text>
          </div>
          <div className='div-row' style={{ width: '33%' }}>
            <text>Açoes:</text>
          </div>
        </div>
        <div ref="taskViewPort" className="timeLine-side-task-viewPort" onScroll={this.doScroll}>
          <div className="timeLine-side-task-container" style={this.containerStyle}>
            {this.renderTaskRow(data)}
          </div>
        </div>
      </div>
    );
  }
}
