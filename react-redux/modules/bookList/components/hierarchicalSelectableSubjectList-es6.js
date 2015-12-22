const Collapse = ReactBootstrap.Collapse;

class HierarchicalSelectableSubjectItem extends React.Component {
    constructor(){
        super();
        this.state = { childrenVisible: false };
    }
    toggleChildren(){
        this.setState({childrenVisible: !this.state.childrenVisible});
    }
    render(){
        return (
            <li key={this.props._id}>
                {this.props.children.length ?
                    <div>
                        <i onClick={() => this.props.toggleFilteredSubject(this.props._id)} className={'fa ' + (this.props.subjectsFilterModal.subjects.has(this.props._id) ? 'fa-check-square-o' : 'fa-square-o')} style={{ cursor: 'pointer' }}></i>
                        <a onClick={() => this.toggleChildren()}>{this.props.name}</a>&nbsp;
                        <Collapse in={this.state.childrenVisible}>
                            <div>
                                <HierarchicalSelectableSubjectList toggleFilteredSubject={this.props.toggleFilteredSubject} subjectsFilterModal={this.props.subjectsFilterModal} subjects={this.props.children} />
                            </div>
                        </Collapse>
                    </div>
                    :
                    <div>
                        <i onClick={() => this.props.toggleFilteredSubject(this.props._id)} className={'fa ' + (this.props.subjectsFilterModal.subjects.has(this.props._id) ? 'fa-check-square-o' : 'fa-square-o')} style={{ cursor: 'pointer' }}></i>
                        <span>{this.props.name}</span>&nbsp;
                    </div>}
            </li>
        )
    }
}

class HierarchicalSelectableSubjectList extends React.Component {
    render() {
        return (
            <ul>
                { this.props.subjects.map(s => <HierarchicalSelectableSubjectItem toggleFilteredSubject={this.props.toggleFilteredSubject} subjectsFilterModal={this.props.subjectsFilterModal} key={s._id} {...s} />) }
            </ul>
        )
    }
}

module.exports = HierarchicalSelectableSubjectList;