class MyFirstComponent extends React.Component {
    render() {
        return <div>Hello World from { this.props.from }</div>
    }
    componentWillReceiveProps(props){
        this.setState({ from: props.from });
    }
}

var store = require('/react/store');


let Provider = ReactRedux.Provider;

MyFirstComponent = ReactRedux.connect(projectState)(MyFirstComponent);

function projectState(state){
    return state;
}

ReactDOM.render(
    <Provider store={store}>
        <MyFirstComponent from="Adam 5" />
    </Provider>,
    document.getElementById('home'));



module.exports = MyFirstComponent;