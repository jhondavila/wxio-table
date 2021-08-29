import React from 'react';
import "./style.scss"
class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // text: "",
            xPos: `0px`,
            yPos: `0px`,
            showMenu: false
        };
    }
    componentDidMount() {
        console.log("componentDidMount")
        document.addEventListener("click", this.handleClick);
        document.addEventListener("contextmenu", this.handleContextMenu);
    }
    handleClick = (e) => {
        if (this.suspendClick) {
            return;
        }
        if (this.state.showMenu) this.setState({ showMenu: false, isShow: false });
    };
    handleContextMenu = (e) => {
        if (this.state.showMenu) this.setState({ showMenu: false, isShow: false });
    };
    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
        document.removeEventListener("contextmenu", this.handleContextMenu);
    }
    show(e) {
        e.preventDefault();
        this.suspendClick = true;
        this.setState({
            xPos: `${e.pageX}px`,
            yPos: `${e.pageY}px`,
            showMenu: true,
        }, () => {
            setTimeout(() => {
                this.suspendClick = false;
            }, 150);
        });
    }
    onPress(type) {
        this.props.onClick(type);
        // this.emit("itemclick", type)
    }
    hide() {
        this.setState({
            showMenu: false
        });
    }
    render() {
        const { showMenu, xPos, yPos } = this.state;
        // console.log(showMenu)
        if (showMenu) {
            return (
                <div className="wx-menu d-flex flex-column" style={{
                    top: yPos,
                    left: xPos,
                }}>
                    {
                        this.renderMy()
                    }
                </div>
            );
        } else {
            return null;
        }
    }
    renderMy() {
        return (
            this.props.children
        )
    }
}

export default Menu;