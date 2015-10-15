class MyFirstComponent extends React.Component {
    render() {
        return <div>Hello World from { this.props.from }</div>
    }
}

ReactDOM.render(<MyFirstComponent />, document.getElementById('home'));

module.exports = MyFirstComponent;