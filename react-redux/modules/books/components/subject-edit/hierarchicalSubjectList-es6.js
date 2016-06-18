import BootstrapButton from 'root-components/bootstrapButton';
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
                        <a onClick={() => this.props.onEdit(this.props._id)}><i className="fa fa-edit"></i></a>&nbsp;
                        <a onClick={() => this.toggleChildren()}>{this.props.name}</a>
                        <Collapse in={this.state.childrenVisible}>
                            <div>
                                <HierarchicalSubjectList style={{ paddingLeft: 25 }} onEdit={this.props.onEdit} subjects={this.props.children} />
                            </div>
                        </Collapse>
                    </div>
                    :
                    <div>
                        <a onClick={() => this.props.onEdit(this.props._id)}><i className="fa fa-edit"></i></a>&nbsp;
                        <span>{this.props.name}</span>

                    </div>}
            </li>
        )
    }
}

class HierarchicalSubjectList extends React.Component {
    render() {
        return (
            <div>
                <ul style={{ ...(this.props.style || {}), listStyle: 'none' }}>
                    { this.props.subjects.map(s => <HierarchicalSubjectItem onEdit={this.props.onEdit} key={s._id} {...s} />) }
                </ul>
            </div>
        )
    }
}

export default HierarchicalSubjectList;