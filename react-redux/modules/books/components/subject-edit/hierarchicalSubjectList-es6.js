import React from 'react';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import { Collapse } from 'react-bootstrap';

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
                        <span className="label label-default" style={{ backgroundColor: this.props.backgroundColor, color: this.props.textColor }}>
                            <a style={{ color: 'white' }} onClick={() => this.props.onEdit(this.props._id)}><i className="fa fa-fw fa-pencil"></i></a>&nbsp;{this.props.name}
                            <a style={{ color: 'white' }} onClick={() => this.toggleChildren()}><i className={'fa fa-fw fa-angle-' + (this.state.childrenVisible ? 'up' : 'down')}></i></a>
                        </span>

                        <Collapse in={this.state.childrenVisible}>
                            <div>
                                <HierarchicalSubjectList style={{ paddingLeft: 25 }} onEdit={this.props.onEdit} subjects={this.props.children} />
                            </div>
                        </Collapse>
                    </div>
                    :
                    <div>
                        <span className="label label-default" style={{ backgroundColor: this.props.backgroundColor, color: this.props.textColor }}>
                            <a style={{ color: 'white' }} onClick={() => this.props.onEdit(this.props._id)}><i className="fa fa-fw fa-pencil"></i></a>
                            &nbsp;{this.props.name}
                        </span>
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