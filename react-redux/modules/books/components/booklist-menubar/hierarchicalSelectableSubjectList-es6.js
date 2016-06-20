import { Collapse } from 'react-bootstrap';

class HierarchicalSelectableSubjectItem extends React.Component {
    constructor(){
        super();
        this.state = { childrenVisible: false };
    }
    toggleChildren(){
        this.setState({childrenVisible: !this.state.childrenVisible});
    }
    render(){
        let childrenVisible = this.state.childrenVisible;

        return (
            <li key={this.props._id}>
                <div>
                    <div className="checkbox" style={{ display: 'inline-block', marginTop: 0, marginBottom: 0 }}>
                        <label>
                            <input type="checkbox" onChange={() => this.props.toggleFilteredSubject(this.props._id)} checked={this.props.selectedSubjects[this.props._id]} />
                            {this.props.name}
                        </label>
                        { this.props.children.length ? <a style={{ marginLeft: 5 }} onClick={() => this.toggleChildren()}><i className={'fa fa-' + (childrenVisible ? 'angle-double-up' : 'angle-double-down')}></i></a> : null }
                    </div>

                    { this.props.children.length ?
                    <Collapse in={childrenVisible}>
                        <div>
                            <HierarchicalSelectableSubjectList style={{ paddingLeft: 25 }} selectedSubjects={this.props.selectedSubjects} toggleFilteredSubject={this.props.toggleFilteredSubject} subjects={this.props.children} />
                        </div>
                    </Collapse> : null }
                </div>
            </li>
        )
    }
}

class HierarchicalSelectableSubjectList extends React.Component {
    render() {
        return (
            <ul style={{ ...(this.props.style || {}), listStyle: 'none' }}>
                { this.props.subjects.map(s => <HierarchicalSelectableSubjectItem selectedSubjects={this.props.selectedSubjects} toggleFilteredSubject={this.props.toggleFilteredSubject} subjects={this.props.subjects} key={s._id} {...s} />) }
            </ul>
        )
    }
}

export default HierarchicalSelectableSubjectList;