import React from 'react';
import {
    BodyContainer,
    Container,
    HeroContainer
} from '../components/StyledComponents/StyledComponents';
import Navigation from '../components/Navigation/Navigation.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Link from '../components/Utility/Link';
import Data from '../Data';

const Contact = () => {
    return (
        <>
            <Navigation page="contact" />
            <BodyContainer>
                <HeroContainer
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 2}}
                    exit={{ opacity: 0 }}
                >
                <Container flex top={6}>
                    <Container width={60} bottom={6}>
                        <h1>{Data.contact.title}</h1>
                        <p>{Data.contact.description} <nobr><Link external text={Data.contact.email} route={`mailto:${Data.contact.email}`} />.</nobr></p>
                    </Container>
                </Container>
                </HeroContainer>
            </BodyContainer>
            <Footer />
        </>
    );
}

export default Contact;
