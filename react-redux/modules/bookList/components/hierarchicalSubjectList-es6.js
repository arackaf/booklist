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
                        <a onClick={() => this.toggleChildren()}>{this.props.name}</a>&nbsp;
                        <a onClick={() => this.props.onEdit(this.props._id)}><i className="fa fa-edit"></i></a>
                        <Collapse in={this.state.childrenVisible}>
                            <div>
                                <HierarchicalSubjectList onEdit={this.props.onEdit} subjects={this.props.children} />
                            </div>
                        </Collapse>
                    </div>
                    :
                    <div>
                        <span>{this.props.name}</span>&nbsp;
                        <a onClick={() => this.props.onEdit(this.props._id)}><i className="fa fa-edit"></i></a>
                    </div>}
            </li>
        )
    }
}

class HierarchicalSubjectList extends React.Component {
    render() {
        return (
            <ul>
                { this.props.subjects.map(s => <HierarchicalSubjectItem onEdit={this.props.onEdit} key={s._id} {...s} />) }
            </ul>
        )
    }
}

module.exports = HierarchicalSubjectList;