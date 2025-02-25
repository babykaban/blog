import React from 'react';
import { marked } from 'marked';
import {
    BodyContainer,
    Container,
    Image
} from '../../components/StyledComponents/StyledComponents';
import Navigation from '../../components/Navigation/Navigation.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './BlogPost.css'; // Import the CSS file

class BlogPost extends React.Component {

    state = {
        markdown: ''
    }

    componentDidMount() {
        const post_images = this.props.content_images ? this.props.content_images.map(img => require(`../../assets/img/${img}`)) : [];

        fetch(this.props.content)
            .then(response => response.text())
            .then(text => {
                let updatedText = text;
                post_images.forEach((image, index) => {
                    const regex = new RegExp(`image_${index}\\.png`, 'g');
                    updatedText = updatedText.replace(regex, image);
                });
                this.setState({
                    markdown: marked(updatedText)
                });
            });
    }

    render() {
        const { markdown } = this.state;

        return (
            <Container>
                <ProgressBar />
                <Navigation />
                <BodyContainer>
                    <Container small top={12}>
                        <h1>{this.props.title}</h1>
                        <p>{this.props.date}</p>
                        <Image src={this.props.image} />
                        <div id={`post_${this.props.id}`} dangerouslySetInnerHTML={{ __html: markdown }} className="markdown-content"></div>
                    </Container>
                </BodyContainer>
                <Footer />
		    </Container>
        )
    }
}

export default BlogPost;