import React from 'react';
import {
	BodyContainer,
	Container
} from '../components/StyledComponents/StyledComponents';
import Navigation from '../components/Navigation/Navigation.jsx';
import AboutHero from '../components/About/AboutHero';
import AboutDescription from '../components/About/AboutDescription';
//import AboutResume from '../components/About/AboutResume.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Button from '../components/Utility/Button';
import { Link } from 'react-router-dom';

const About = () => {
    return (
		<>
			<Navigation page="about" />
			<BodyContainer>
				<AboutHero />
				<AboutDescription />
				<Container flex center>
					<Link to="/contact">
						<Button
							right
							text="Get in touch"
						/>
					</Link>
				</Container>
			</BodyContainer>
			<Footer />
		</>
    );
}

export default About;