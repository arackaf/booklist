const Modal = ReactBootstrap.Modal;

import BootstrapButton from '/react-redux/applicationRoot/rootComponents/bootstrapButton';
import * as actionCreators from '../../actions/actionCreators';
import HierarchicalSubjectList from './hierarchicalSubjectList';

class subjectEditModal extends React.Component {
    render(){
        let editSubjectsPacket = this.props.editSubjectsPacket;

        return (
            <Modal show={!!editSubjectsPacket} onHide={this.props.stopEditingSubjects}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit subjects
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <BootstrapButton onClick={this.props.newSubject} preset="info-xs">New subject</BootstrapButton>
                    <br />
                    <br />
                    <HierarchicalSubjectList style={{ paddingLeft: 5 }} subjects={this.props.subjects} onEdit={_id => this.props.editSubject(_id)} />

                    { editSubjectsPacket && editSubjectsPacket.editing ?
                        <div>
                            { editSubjectsPacket.editingSubject ? `Edit subject ${editSubjectsPacket.editingSubject.name}` : 'New Subject' }
                            <br/>
                            New name: <input value={editSubjectsPacket.newSubjectName} onChange={(e) => this.props.setNewSubjectName(e.target.value)} />
                            New Parent:
                            <select value={editSubjectsPacket.newSubjectParent} onChange={(e) => this.props.setNewSubjectParent(e.target.value)}>
                                <option value="">None</option>
                                { editSubjectsPacket.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                            </select>
                            <BootstrapButton onClick={this.props.createOrUpdateSubject}>Save</BootstrapButton>
                        </div>
                        : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.props.stopEditingSubjects}>Close</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const subjectEditModalConnected = ReactRedux.connect(state => state, { ...actionCreators })(subjectEditModal);

export default subjectEditModalConnected;