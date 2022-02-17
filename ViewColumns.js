
import React from 'react';
import createModalCt from '../modal/createModal';
import { msgAlert } from '..';
import { Container, Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';

class ModalViewColumns extends React.Component {

  constructor() {
    super()
    this.state = {
      show: true,
      text: "",
      errorSrc: false,
      selectActive: null,
      selectInavtive: null,
      colsActive: [],
      colsInactive: [],
    }
  }
  componentDidMount() {
    let cols = this.props.columns || [];

    let colsActive = cols.filter(i => i.hidden !== true) || [];
    let colsInactive = cols.filter(i => i.hidden !== false) || [];

    this.setState({
      colsActive: colsActive,
      colsInactive: colsInactive
    });



  }
  componentWillUnmount() {
    // clearInterval(this.timerRefresh);
  }

  hideModal() {
    this.setState({
      show: false
    });
    this.props.resolve(false);
  }

  onSelectActive(col) {
    this.setState({
      selectActive: col
    });
  }

  onSelectInactive(col) {
    this.setState({
      selectInactive: col
    });
  }

  onMoveLeft() {

    if (this.state.selectInactive) {
      let colsInactive = this.state.colsInactive.filter(i => i != this.state.selectInactive) || [];

      let colActive = this.state.selectInactive;

      colActive.hidden = false;

      let colsActive = this.state.colsActive;

      colsActive.push(colActive);

      this.setState({
        colsActive: colsActive,
        colsInactive: colsInactive,

        selectInavtive: null
      }, () => {
        this.forceUpdate();
      });
    } else {
      msgAlert({
        title: 'Error',
        desc: "No se tiene seleccionado ningun item a mover."
      });
    }


  }

  onMoveRight() {

    if (this.state.selectActive){
      let colsActive = this.state.colsActive.filter(i => i != this.state.selectActive) || [];
  
      let colInactive = this.state.selectActive;
  
      colInactive.hidden = true
  
      let colsInactive = this.state.colsInactive;
  
      colsInactive.push(colInactive);
  
      this.setState({
        colsActive: colsActive,
        colsInactive: colsInactive,
  
        selectActive: null
      }, () => {
        this.forceUpdate();
      });
    }else{
      msgAlert({
        title: 'Error',
        desc: "No se tiene seleccionado ningun item a mover."
      });
    }
  }

  confirm() {
  /*
  */
    let allColumns = this.state.colsActive.concat(this.state.colsInactive);
    this.setState({
      show: false
    });
    
    this.props.resolve(allColumns);
    
  }

  cancel() {
    this.setState({
      show: false
    });
    this.props.resolve(false);
  }
  render() {
    let src = this.state.errorSrc && this.props.thumbailSrc ? this.props.thumbailSrc : this.props.src;
    return (
      <Modal
        show={this.state.show}
        onHide={this.cancel.bind(this)}
        animation={true}
        centered={true}
        backdrop="static"
        keyboard={true}
        dialogClassName={"search-modal-dialog"}
      >
        <Modal.Header closeButton>
          <Modal.Title>Columnas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='wx-table-viewcolumns'>
            <div className='list'>
              {
                this.state.colsActive ? this.state.colsActive.map((col) => {
                  let select = col == this.state.selectActive ? "selected" : "";
                  return (<div key={col.id} className={`item-col ' ${select}`} onClick={this.onSelectActive.bind(this, col)}>{col.text}</div>)
                }) : null
              }
            </div>
            <div className='content-menu'>
              <div className='menu'>
                <Button variant="outline-primary" onClick={this.onMoveLeft.bind(this)}><i className="far fa-arrow-alt-circle-left"></i></Button>
                <Button variant="outline-primary" onClick={this.onMoveRight.bind(this)}><i className="far fa-arrow-alt-circle-right"></i></Button>
                <Button variant="outline-primary"><i className="far fa-arrow-alt-circle-up"></i></Button>
                <Button variant="outline-primary"><i className="far fa-arrow-alt-circle-up"></i></Button>
              </div>
            </div>
            <div className='list'>
              {
                this.state.colsActive ? this.state.colsInactive.map((col) => {
                  let select = col == this.state.selectInactive ? "selected" : "";
                  return (<div key={col.id} className={`item-col ' ${select}`} onClick={this.onSelectInactive.bind(this, col)}>{col.text}</div>)
                }) : null
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.cancel.bind(this)}><i className="far fa-save"></i></Button>
          <Button variant="secondary" onClick={this.cancel.bind(this)}>Cancelar</Button>
          <Button variant="primary" onClick={this.confirm.bind(this)}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
    )
  }

}

export default createModalCt(ModalViewColumns);