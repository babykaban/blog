import React from 'react';
import { motion } from "framer-motion";
import SocialButton from '../Social/SocialButton';
import Data from '../../Data';

const SocialButtons = () => {
    return (
        <motion.div
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            style={{ display: 'flex', gap: '1rem' }} // Add spacing between buttons
        >
            <SocialButton
                social="linkedin"
                icon="linkedin-in" // Ensure this icon prop is correctly used in SocialButton
                link={`https://www.linkedin.com/in/${Data.social.linkedin}`}
            />
            <SocialButton
                social="github"
                icon="github" // Ensure this icon prop is correctly used in SocialButton
                link={`https://www.github.com/${Data.social.github}`}
            />
            <SocialButton
                social="x"
                icon="x" // Ensure this icon prop is correctly used in SocialButton
                link={`https://www.x.com/${Data.social.x}`}
            />
        </motion.div>
    );
}

export default SocialButtons;
