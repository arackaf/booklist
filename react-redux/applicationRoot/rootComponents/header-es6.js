import { Provider, connect } from 'react-redux';
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

Header = connect(projectState)(Header);

export default Header;