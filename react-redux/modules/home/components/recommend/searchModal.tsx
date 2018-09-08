import React, { Component } from "react";
import Modal from "simple-react-bootstrap/lib/modal";

export default class SearchModal extends Component<{ isOpen: boolean; onHide: any }, any> {
  render() {
    let { isOpen, onHide } = this.props;
    return null;
    // return (
    //   <Modal className="fade" show={isOpen} onHide={onHide}>
    //     <Modal.Header>
    //       <button type="button" className="close" onClick={onHide} aria-label="Close">
    //         <span aria-hidden="true">&times;</span>
    //       </button>
    //       <h4 className="modal-title">Search your books</h4>
    //     </Modal.Header>
    //     <Modal.Body>
    //       <form onSubmit={this.applyFilters}>
    //         <div className="row">
    //           <div className="col-xs-6">
    //             <div className="form-group">
    //               <label>Title</label>
    //               <input defaultValue={this.props.search} ref={el => (this.searchEl = el)} placeholder="Search title" className="form-control" />
    //             </div>
    //           </div>

    //           <div className="col-xs-6">
    //             <div className="form-group">
    //               <label>Is read?</label>
    //               <br />
    //               <div style={{ display: "inline" }} className="radio">
    //                 <label>
    //                   <input type="radio" defaultChecked={this.props.isRead == ""} ref={el => (this.isReadE = el)} name="isRead" />
    //                   Either
    //                 </label>
    //               </div>
    //               <div style={{ display: "inline", marginLeft: "20px" }} className="radio">
    //                 <label>
    //                   <input type="radio" defaultChecked={this.props.isRead == "1"} name="isRead" />
    //                   Yes
    //                 </label>
    //               </div>
    //               <div style={{ display: "inline", marginLeft: "20px" }} className="radio">
    //                 <label>
    //                   <input type="radio" defaultChecked={this.props.isRead == "0"} ref={el => (this.isRead0 = el)} name="isRead" />
    //                   No
    //                 </label>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <button style={{ display: "none" }} />
    //         <input type="submit" style={{ display: "inline", visibility: "hidden" }} />
    //       </form>

    //       <div className="row" style={{ position: "relative" }}>
    //         <div className="col-xs-3">
    //           <SelectAvailable
    //             placeholder="Tags"
    //             search={this.state.searchTagsValue}
    //             onSearchChange={this.setTagSearchVal}
    //             items={this.props.allTagsSorted}
    //             currentlySelected={this.state.tags}
    //             onSelect={this.selectTag}
    //             filter={filterTags}
    //           />
    //         </div>
    //         <div className="col-xs-9">
    //           <div>
    //             {this.state.tags.map(_id => this.props.tagHash[_id]).map(t => (
    //               <RemovableLabelDisplay key={t._id} className="margin-left" item={t} doRemove={() => this.removeTag(t)} />
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       <br />

    //       {!this.state.noSubjectsFilter ? (
    //         <>
    //           <div className="row" style={{ position: "relative" }}>
    //             <div className="col-xs-3">
    //               <SelectAvailable
    //                 placeholder="Subjects"
    //                 search={this.state.searchSubjectsValue}
    //                 onSearchChange={this.setSubjectSearchVal}
    //                 items={this.props.subjectsUnwound}
    //                 currentlySelected={this.state.subjects}
    //                 onSelect={this.selectSubject}
    //                 filter={filterSubjects}
    //               />
    //             </div>
    //             <div className="col-xs-9">
    //               <div>
    //                 {this.state.subjects.map(_id => this.props.subjectHash[_id]).map(s => (
    //                   <RemovableLabelDisplay key={s._id} className="margin-left" item={s} doRemove={() => this.removeSubject(s)} />
    //                 ))}
    //               </div>
    //             </div>
    //           </div>
    //           <div className="checkbox">
    //             <label>
    //               <input type="checkbox" ref={el => (this.childSubEl = el)} defaultChecked={!!this.props.searchChildSubjects} /> Also search child
    //               subjects
    //             </label>
    //           </div>
    //         </>
    //       ) : null}

    //     </Modal.Body>
    //     <Modal.Footer>
    //       <BootstrapButton preset="primary" className="pull-left" onClick={this.applyFilters}>
    //         Filter
    //       </BootstrapButton>
    //       <BootstrapButton preset="default" onClick={onHide}>
    //         Close
    //       </BootstrapButton>
    //     </Modal.Footer>
    //   </Modal>
    // );
  }
}
