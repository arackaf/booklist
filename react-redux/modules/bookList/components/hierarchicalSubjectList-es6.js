const Collapse = ReactBootstrap.Collapse;

class HierarchicalSubjectItem extends React.Component {
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
                        <a onClick={() => this.toggleChildren()}><i className="fa fa-arrows-v"></i></a>&nbsp;
                        <span>{this.props.name}</span>&nbsp;
                        <a onClick={() => this.props.onEdit(this)}><i className="fa fa-edit"></i></a>
                        <Collapse in={this.state.childrenVisible}>
                            <div>
                                <HierarchicalSubjectList subjects={this.props.children} />
                            </div>
                        </Collapse>
                    </div>: <span>{this.props.name}</span>}
            </li>
        )
    }
}

class HierarchicalSubjectList extends React.Component {
    render() {
        return (
            <ul>
                { this.props.subjects.map(s => <HierarchicalSubjectItem onEdit={this.props.onEdit} key={`s-${s._id}`} {...s} />) }
            </ul>
        )
    }
}

module.exports = HierarchicalSubjectList;