import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../Logo/Logo';
import {
	NavContainer,
	Nav,
	SubNavMenu,
	SubNavMenuList,
	SubNavMenuListItem
} from '../../components/Navigation/Style';
import { BodyContainer } from '../StyledComponents/StyledComponents';

class Navigation extends React.Component {

	render() {
		const { page } = this.props;

    	return (
			<nav>
				<NavContainer>
					<BodyContainer>
						<Nav>
							<Logo color={this.props.logoColor} size="36px" />
							<SubNavMenu>
								<SubNavMenuList>
									<SubNavMenuListItem active={page === 'about' ? true : false}><Link to="/about">About</Link></SubNavMenuListItem>
									<SubNavMenuListItem active={page === 'projects' ? true : false}><Link to="/projects">Projects</Link></SubNavMenuListItem>
									<SubNavMenuListItem active={page === 'contact' ? true : false}><Link to="/contact">Contact</Link></SubNavMenuListItem>
									{/*<SubNavMenuListItem active={page === 'test' ? true : false}><Link to="/test">Test</Link></SubNavMenuListItem>*/}
								</SubNavMenuList>
							</SubNavMenu>
						</Nav>
					</BodyContainer>
				</NavContainer>
			</nav>
    	)
  	}
}

export default Navigation;
