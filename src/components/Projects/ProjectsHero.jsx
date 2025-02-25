import React from 'react';
import { Link } from 'react-router-dom';
import Data from '../../Data';
import {
    Container,
    HeroContainer,
    BodyContainer
} from '../StyledComponents/StyledComponents';

const HomeHero = () => {
    return(
        <HeroContainer
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 2}}
            exit={{ opacity: 0 }}
        >
            <BodyContainer>
                <Container width={80} leftAlign bottom={2}>
                    <h1>{Data.projects.title}</h1>
                </Container>

                <Container leftAlign bottom={6} width={65}>
                    <p>{Data.projects.description}</p>
                </Container>
            </BodyContainer>
        </HeroContainer>
    )
}

export default HomeHero;
