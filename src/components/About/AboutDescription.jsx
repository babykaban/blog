import React from 'react';
import { Container } from '../StyledComponents/StyledComponents';
import Data from '../../Data';

const AboutHero = () => {
    return(
        <Container >
            <Container width={80} bottom={2}>
                <h1>About</h1>
            </Container>
            <Container width={80}>
                <p>{Data.about.description}</p>
            </Container>
        </Container>

    )
}

export default AboutHero;
