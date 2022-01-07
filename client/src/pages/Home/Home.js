import React, { useEffect, useState } from 'react';
import "./Home.css";
import Mobile from '../../components/Mobile';
import { getCreatorPosts } from '../../controllers/creators';
import { Button } from 'react-bootstrap';
import { FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    let navigate = useNavigate();
    const [creatorPosts, setCreatorPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            var posts = await getCreatorPosts();
            setCreatorPosts(posts);
        }
        fetchPosts();
    }, []);

    const nextSlide = (id) => {
        document.getElementById(id).scrollIntoView();
    }

    const exploreButton = () => {
        navigate('/maksie_aki/own');
    }

    return(
        <div id="home-page">
            <Mobile>
                <div id="home-page-first-slide">
                    <div className="home-page-initial-content">
                        <span className="fs-1 fw-bold">GateKeepers Inc.</span>
                        <span className="text-lead mb-3 fw-light">Fashion Collection</span>
                        <Button onClick={exploreButton} variant="outline-dark" style={{paddingBottom: '7.5px'}} className="explore-button">
                            Explore
                            <span className="arrow"></span>
                        </Button>
                    </div>
                    <div onClick={() => nextSlide('slide-1')} className="arrow-down-container">
                        <div className="chevron"></div>
                        <div className="chevron"></div>
                        <div className="chevron"></div>
                    </div>
                </div>
                    {creatorPosts && creatorPosts.map((post, index) => {
                        var socialsHTML = (post.creator.links.length > 0) ?
                        (
                            <div className="socials">
                                {post.creator.links.map((link, index2) => {
                                    if(link.instagram){
                                        return(
                                            <img key={link.instagram} className="socials-icon" href={link.instagram} src="/images/socials/instagram.png"/>
                                        )
                                    } else if(link.tiktok){
                                        return(
                                            <img key={link.tiktok} className="socials-icon" href={link.tiktok} src="/images/socials/tiktok.png"/>
                                        )
                                    }
                                })}
                            </div>
                        ) : '';
                        return(
                            <div className="slide" id={`slide-${index+1}`} key={index}>
                                <div className="slide-info">
                                    {socialsHTML}
                                    <div className="slide-creator">
                                        <span className="fs-1 slide-tag">{post.creator.tag.toUpperCase()}</span>
                                        <hr/>
                                        <Button variant="light" className="shop-creator">
                                            SHOP
                                            <FaShoppingBag style={{marginLeft: '6px', marginBottom: '4px'}}/>
                                        </Button>
                                    </div>
                                </div>
                                <img
                                    className="slide-image"
                                    src={`/images/${post.image}`}
                                    style={{
                                        top: `calc(100vh * ${index+1})`
                                    }}
                                />
                                <div onClick={() => nextSlide(`slide-${index+2}`)} className="arrow-down-container">
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                </div>
                            </div>
                        )
                    })}
            </Mobile>
        </div>
    )
};

export default Home;