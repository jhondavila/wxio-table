
import React from 'react';
import createModalCt from '../modal/createModal';
import { msgAlert } from '..';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button } from 'react-bootstrap';
import { ListDrag, ListItemDrag } from '../form/ListDrag';


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

  moveField(field, index, hidden) {
    let oldIndex = hidden ? this.state.colsInactive.indexOf(field) : this.state.colsActive.indexOf(field);

    if (oldIndex > -1) {
      const targetRow = hidden ? this.state.colsInactive.splice(oldIndex, 1)[0] : this.state.colsActive.splice(oldIndex, 1)[0];

      hidden ? this.state.colsInactive.splice(index, 0, targetRow) : this.state.colsActive.splice(index, 0, targetRow);

      this.forceUpdate();

    }

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

    if (this.state.selectActive) {
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
    } else {
      msgAlert({
        title: 'Error',
        desc: "No se tiene seleccionado ningun item a mover."
      });
    }
  }

  moveUp() {

    if (this.state.selectActive) {

      let model = this.state.selectActive;

      let oldIndex = this.state.colsActive.indexOf(model);
      let newIndex = oldIndex == 0 ? 0 : oldIndex - 1;

      this.moveTo(model, newIndex, this.state.colsActive);
    } else if (this.state.selectInactive) {
      let model = this.state.selectInactive;

      let oldIndex = this.state.colsInactive.indexOf(model);
      let newIndex = oldIndex == 0 ? 0 : oldIndex - 1;

      this.moveTo(model, newIndex, this.state.colsInactive);

    } else {
      msgAlert({
        title: 'Error',
        desc: "No se tiene seleccionado ningun item a mover."
      });
    }
  }
  moveDown() {

    if (this.state.selectActive) {

      let model = this.state.selectActive;

      let cloneArray = this.state.colsActive.slice(0);
      let oldIndex = cloneArray.indexOf(model);
      let newIndex = oldIndex + 1;

      this.moveTo(model, newIndex, this.state.colsActive);

    } else if (this.state.selectInactive) {
      let model = this.state.selectInactive;

      let cloneArray = this.state.colsInactive.slice(0);
      let oldIndex = cloneArray.indexOf(model);
      let newIndex = oldIndex + 1;

      this.moveTo(model, newIndex, this.state.colsInactive);
    } else {
      msgAlert({
        title: 'Error',
        desc: "No se tiene seleccionado ningun item a mover."
      });
    }
  }


  moveTo(model, index, data) {
    let oldIndex = data.indexOf(model);
    if (oldIndex > -1) {
      const targetRow = data.splice(oldIndex, 1)[0];
      data.splice(index, 0, targetRow);
      this.forceUpdate();
    }
  }

  onAddChooser(params) {

    let { from, target, item } = params;
    let index = item.index || 0;

    if (target == "activecolumn") {
      let NewColsInactive = this.state.colsInactive.filter(i => i != item.field) || [];
      let CellActive = item.field;

      CellActive.hidden = true
      let NewColsActive = this.state.colsActive;

      NewColsActive.splice(index, 0, CellActive);

      this.setState({
        colsActive: NewColsActive,
        colsInactive: NewColsInactive,
      }, () => {
        this.forceUpdate();
      });
    }
    else {

      let NewColsActive = this.state.colsActive.filter(i => i != item.field) || [],
        CellInactive = item.field;

      CellInactive.hidden = true

      let NewColsInactive = this.state.colsInactive;

      NewColsInactive.splice(index, 0, CellInactive);

      this.setState({
        colsActive: NewColsActive,
        colsInactive: NewColsInactive,
      }, () => {
        this.forceUpdate();
      });

    };

  }


  save() {
    
    let allColumns = this.state.colsActive.concat(this.state.colsInactive);
    this.setState({
      show: false
    });
    
    this.props.resolve(allColumns);
  }
  
  confirm() {

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
      <DndProvider backend={HTML5Backend}>
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
              <div className="list">
                <strong> Columnas visibles </strong>
                <ListDrag name="activecolumn" group={"activecolumn"}>

                  {
                    this.state.colsActive ? this.state.colsActive.map((col, colIdx) => {
                      // console.log(col,colIdx)
                      let select = col == this.state.selectActive ? "selected" : "";
                      return (<ListItemDrag
                        data={{ index: colIdx, from: 'activecolumn' }}
                        field={col}
                        key={`${col.id}-active`}
                        className={`item-col ' ${select}`}
                        onClick={this.onSelectActive.bind(this, col)}
                        text={col.text}
                        group={'activecolumn'}
                        moveField={this.moveField.bind(this)}
                        onAddChooser={this.onAddChooser.bind(this)}
                      // from={''}
                      />)
                    }) : null
                  }
                </ListDrag>
              </div>
              <div className='content-menu'>
                <div className='menu'>
                  <Button variant="outline-primary" onClick={this.onMoveLeft.bind(this)}><i className="far fa-arrow-alt-circle-left"></i></Button>
                  <Button variant="outline-primary" onClick={this.onMoveRight.bind(this)}><i className="far fa-arrow-alt-circle-right"></i></Button>
                  <Button variant="outline-primary" onClick={this.moveUp.bind(this)}><i className="far fa-arrow-alt-circle-up"></i></Button>
                  <Button variant="outline-primary" onClick={this.moveDown.bind(this)}><i className="far fa-arrow-alt-circle-down"></i></Button>
                </div>
              </div>
              <div className="list">
                <strong>Pool de columnas</strong>
                <ListDrag name="inactivecolumn" group={"inactivecolumn"}>
                  {
                    this.state.colsInactive ? this.state.colsInactive.map((col, colIdx) => {
                      let select = col == this.state.selectActive ? "selected" : "";
                      return (
                        <ListItemDrag
                          data={{ index: colIdx, from: 'inactivecolumn' }}
                          field={col}
                          key={`${col.id}-inactive`}
                          className={`item-col ' ${select}`}
                          onClick={this.onSelectActive.bind(this, col)}
                          text={col.text}
                          group={'inactivecolumn'}
                          moveField={this.moveField.bind(this)}
                          onAddChooser={this.onAddChooser.bind(this)}

                        />)
                    }) : null
                  }
                </ListDrag>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {
              this.props.onSaveView ? (<Button variant="secondary" onClick={this.save.bind(this)}><i className="far fa-save"></i></Button>) : null
            }
            <Button variant="secondary" onClick={this.cancel.bind(this)}>Cancelar</Button>
            <Button variant="primary" onClick={this.confirm.bind(this)}>Aceptar</Button>
          </Modal.Footer>
        </Modal>
      </DndProvider>
    )
  }

}

export default createModalCt(ModalViewColumns);