import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ showModal, hideModal, confirmModal, id, message }) => {
  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header>
        <Modal.Title>Delete Confirmation</Modal.Title>
        <div className="close" onClick={hideModal}>&times;</div>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger" role="alert">{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={hideModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => confirmModal(id)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmationModal;
