import React, { useState, useEffect } from 'react';
import {
	BodyContainer,
	Container,
} from '../components/StyledComponents/StyledComponents';
import Navigation from '../components/Navigation/Navigation.jsx';
import Footer from '../components/Footer/Footer.jsx';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import { marked } from 'marked';
import './Test.css';

import markdowncontent from '../posts/sample.md';

const post_images = [
    'editor_picture_4.png',
    'editor_picture_4.png',
    'editor_picture_4.png',
].map(img => require(`../assets/img/${img}`));

const Test = () => {
	const [markdown, setMarkdown] = useState('');

	useEffect(() => {
		fetch(markdowncontent)
			.then(response => response.text())
			.then(text => {
				let updatedText = text;
				post_images.forEach((image, index) => {
					const regex = new RegExp(`post_${index + 1}\\.png`, 'g');
					updatedText = updatedText.replace(regex, image);
				});
				setMarkdown(marked(updatedText));
			});
	}, []);

	return (
		<Container>
			<ProgressBar />
			<Navigation page="test" />
			<BodyContainer>
				<Container small top={12}>
					<h1>Sample Title</h1>
					<p>Sample Date</p>
					<div className="markdown-content" dangerouslySetInnerHTML={{ __html: markdown }}></div>
				</Container>
			</BodyContainer>
			<Footer />
		</Container>
	);
}

export default Test;