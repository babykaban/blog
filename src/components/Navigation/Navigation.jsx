import React from 'react';
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
									<SubNavMenuListItem active={page === 'about' ? true : false}><a href="/blog/about">About</a></SubNavMenuListItem>
									<SubNavMenuListItem active={page === 'contact' ? true : false}><a href="/blog/contact">Projects</a></SubNavMenuListItem>
									<SubNavMenuListItem active={page === 'contact' ? true : false}><a href="/blog/contact">Contact</a></SubNavMenuListItem>
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
