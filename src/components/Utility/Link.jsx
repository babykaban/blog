import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '../StyledComponents/StyledComponents';

const InlineLink = (props) => {
    return(
        <Link as={RouterLink} to={props.route} target={props.external ? '_blank' : null} rel="noopener noreferrer">
            {props.text}
        </Link>
    )
}

export default InlineLink;
