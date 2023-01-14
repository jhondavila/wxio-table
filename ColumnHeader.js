import React, { useRef } from 'react';
import Styled from 'styled-components';
// import { Resizable as ResizableReact, ResizableBox } from 'react-resizable';
import { DraggableCore } from 'react-draggable';
const Col = Styled.div`
    position: relative;
    display: inline-block;
    border-right: 1px solid #e1e1e1;
    padding: 0px;
    width: ${({ ancho }) => ancho + "px"};

    :hover {
        background-color: rgb(240, 236, 170);
    }

    :hover .menu {
        display: flex;
    }
`
const ColContent = Styled.div`
    display: flex
`;

const Resizable = Styled.div`
    cursor: col-resize;
    height: 100%;
    position: absolute;
    float: right;
    right: 0px;
    top: 0px;
    width: 4px;
`;

const Dropdown = Styled.div`
    height: 100%;
    border-left: 1px solid #ddd;
    position: absolute;
    float: right;
    right: 0px;
    top: 0px;
    align-items: center;
    width: 20px;
    justify-content: center;
    display: none;
`;

const MenuContext = Styled.div`
    display: none;
    position: fixed;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 4;

    & a {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;

        : hover {
            background-color: #ddd
        }
    }
`;

const Text = Styled.div`
    display:inline-block;
    padding: 8px;
    white-space: nowrap;
    overflow   : hidden;
    text-align : ${({ align }) => align};
    text-overflow: ellipsis;
    flex: 1;
`

export class ColumnHeader extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			dragging : false,
			activeResize : null
		}
	}
	render() {
		let { width = 200, text, align = "left", headerAlign, onOrder, dataIndex, order, colMenu, resizeColumnEnd, resizeColumnStart, resizeColumnDrag, config ,tableRef} = this.props;
		let colAlign = headerAlign || align;
		let boundClientRect =  this.colHeader ? this.colHeader.getBoundingClientRect():  {};
		let tableClientRect = tableRef.getBoundingClientRect();
		return (
			<Col ancho={width} ref={c => this.colHeader = c}>
				{this.state.dragging ? <div className='bar-start' style={{left : boundClientRect.left , top : boundClientRect.top, height : tableClientRect.height-10}}></div> : null}
				<ColContent>
					<Text align={colAlign} onClick={this.onClick.bind(this)}>
						{text}
						{
							order && order.property == dataIndex ?
								order.direction == "ASC" ?
									<i className="far fa-long-arrow-alt-up sort-direction"></i>
									:
									<i className="far fa-long-arrow-alt-down sort-direction"></i>

								: null
						}

					</Text>

				</ColContent>
				<Dropdown className="menu" onClick={(e) => { colMenu(e, this.props) }}><i className="fas fa-caret-down"></i></Dropdown>



				<DraggableCore
					nodeRef={this.draggable}
					onStop={this.onResizeStop.bind(this)}
					onStart={this.onResizeStart.bind(this)}
					onDrag={this.onResizeDrag.bind(this)}
				>
					<Resizable
						ref={this.draggable}
					/>
				</DraggableCore>
				{this.state.dragging ? <div className='bar-end' style={{left : this.state.activeResize || boundClientRect.right, top : boundClientRect.top , height : tableClientRect.height-10}}></div> : null}
			</Col>
		);
	}
	onResizeStop(e, data){
		this.setState({
			dragging : false
		})
		let {resizeColumnEnd , config} = this.props;
		resizeColumnEnd(config,data.x);
	}
	onResizeDrag(e,data){
		let headerXPos = data.x;
		let clientRect = this.colHeader.getBoundingClientRect();
		this.setState({
			activeResize : clientRect.x + headerXPos
		});
	}
	onResizeStart(){
		this.setState({
			dragging : true,
			activeResize : null
		})
	}

	openMenu(x) {
		window.x = x;
	}

	onClick(l, i) {
		let {dataIndex,onOrder} = this.props;
		onOrder(dataIndex);

	}
}
