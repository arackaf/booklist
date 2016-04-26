const Modal = ReactBootstrap.Modal;

import BootstrapButton from 'root-components/bootstrapButton';
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
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                { editSubjectsPacket.editingSubject ? `Edit ${editSubjectsPacket.editingSubject.name}` : 'New Subject' }
                            </div>
                            <div className="panel-body">
                                <form>
                                    <div className="form-group">
                                        <label>Subject name</label>
                                        <input className="form-control" value={editSubjectsPacket.newSubjectName} onChange={(e) => this.props.setNewSubjectName(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Parent</label>
                                        <select className="form-control" value={editSubjectsPacket.newSubjectParent} onChange={(e) => this.props.setNewSubjectParent(e.target.value)}>
                                            <option value="">None</option>
                                            { editSubjectsPacket.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                        </select>
                                    </div>
                                    <BootstrapButton preset="primary" onClick={e => { this.props.createOrUpdateSubject(); e.preventDefault();} }>Save</BootstrapButton>
                                    <BootstrapButton className="pull-right" preset="danger" onClick={e => { this.props.deleteSubject(); e.preventDefault();} }>Delete</BootstrapButton>
                                </form>
                            </div>
                        </div>
                        : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton onClick={this.props.stopEditingSubjects}>Close</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

const subjectEditModalConnected = ReactRedux.connect(state => state, { ...actionCreators })(subjectEditModal);

export default subjectEditModalConnected;