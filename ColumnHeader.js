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


export const ColumnHeader = (props) => {
    let { width = 200, text, align = "left", headerAlign , onOrder, dataIndex, order, colMenu, resizeColumnEnd, resizeColumnStart, resizeColumnDrag, config } = props
    let colRef = useRef(null);
    const nodeRef = React.useRef(null);


    // // const mouseDown = (x) => {
    //     window.addEventListener('mousemove', Resize, false);
    //     window.addEventListener('mouseup', stopResize, false);
    //     console.log(width);
    // }

    // const Resize = (x) => {

    //     //console.log(resizeCol.current.offsetLeft);
    //     //console.log('mouseMove ->', x.clientX);
    //     width = x.clientX - resizeCol.current.offsetLeft;
    //     console.log(width);
    // }

    // const stopResize = (x) => {
    //     window.removeEventListener('mousemove', Resize, false);
    //     window.removeEventListener('mouseup', stopResize, false);
    //     console.log(width);
    // }

    // const openMenu = (x) => {
    //     window.x = x;
    // }

    const onClick = (l, i) => {
        onOrder(dataIndex);

    }
    const onResizeStop = (e, data) => {
        // console.log("onResizeStop",props)
        // console.log("onResizeStop", e)
        // console.log("onResizeStop", data)
        // console.log(data.x, data.y, data.deltaX, data.deltaY, data.lastX, data.lastY)
        if (resizeColumnEnd) {
            resizeColumnEnd(config, data.x)
        }
    }
    const onResizeStart = (e, data) => {
        if (resizeColumnStart) {
            let clientRect = colRef.current.getBoundingClientRect();
            resizeColumnStart(config, data, clientRect)
        }
        // console.log("onResizeStart", e)
        // console.log("onResizeStart", data)
        // console.log(data.x, data.y, data.deltaX, data.deltaY, data.lastX, data.lastY)
        // if (resizeColumnEnd) {
        //     resizeColumnEnd(config, data.x)
        // }
        // console.log(e,data);
    }

    const onResizeDrag = (e, data) => {
        if (resizeColumnDrag) {
            let clientRect = colRef.current.getBoundingClientRect();
            resizeColumnDrag(config, data, clientRect)
        }
        // console.log("onResizeDrag",props)
        // x: number, y: number,
        // deltaX: number, deltaY: number,
        // lastX: number, lastY: number

        // console.log("onResizeDrag", e)
        // console.log("onResizeDrag", data)
        // if (resizeColumnEnd) {
        //     resizeColumnEnd(config, data.x)
        // }
        // console.log(data.x,data.y,data.deltaX,data.deltaY,data.lastX,data.lastY)
    }

    let colAlign = headerAlign || align;
    return (


        <Col ancho={width} ref={colRef}>
            <ColContent>
                <Text align={colAlign} onClick={onClick}>
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
            <Dropdown className="menu" onClick={(e) => { colMenu(e, props) }}><i className="fas fa-caret-down"></i></Dropdown>



            <DraggableCore
                // {...draggableOpts}
                // key={`resizableHandle-${handleAxis}`}
                nodeRef={nodeRef}
                onStop={onResizeStop}
                onStart={onResizeStart}
                onDrag={onResizeDrag}
            >

                <Resizable 
                    ref={nodeRef}
                />
            </DraggableCore>

        </Col>
    );
}