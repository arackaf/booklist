let Provider = ReactRedux.Provider;

import { store } from '../store';

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

export default Header;