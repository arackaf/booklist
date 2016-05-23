import AjaxButton from 'root-components/ajaxButton';
import BootstrapButton from 'root-components/bootstrapButton';

const Modal = ReactBootstrap.Modal;

class ManualBookEntry extends React.Component {
    save(){

    }
    closeModal(){
        this.props.onClosing()
    }
    render(){
        return (
            <Modal show={!!this.props.isOpen} onHide={() => this.closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Manually enter a book
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton preset="primary" running={false} runningText='Saving' onClick={() => this.save()}>Set</AjaxButton>
                    <BootstrapButton preset="default" onClick={() => this.closeModal()}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ManualBookEntry;