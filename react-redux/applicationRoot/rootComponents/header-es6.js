let Provider = ReactRedux.Provider;

let { store } = require('../store');

function projectState(state){
    return state;
}

class Header extends React.Component {
    render() {
        return (
            <div>{ this.props.root.module }</div>
        );
    }
}

Header = ReactRedux.connect(projectState)(Header);

module.exports = Header;