import React, { useContext, useEffect, useState } from 'react';
import "./Home.css";
import { Mobile, Desktop } from '../../components/Query';
import { getCreatorPosts } from '../../controllers/creators';
import { Button } from 'react-bootstrap';
import { FaInstagram, FaShoppingBag, FaTiktok, FaTwitch, FaTwitter } from 'react-icons/fa';
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
    const prevSlide = (id) => {
        if(id === 'top'){
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        } else {
            document.getElementById(id).scrollIntoView();
        }
    }

    const exploreButton = () => {
        navigate('/maksie_aki/own');
    }
    
    return(
        <div id="home-page">
            <Mobile>
                <div id="home-page-first-slide">
                    <div className="home-page-initial-content">
                        <span className="fs-1 fw-bold">GateKeepers</span>
                        <span className="text-lead mb-3 fw-light">Fashion Collection</span>
                        <Button onClick={exploreButton} variant="dark" style={{paddingBottom: '7.5px'}} className="explore-button">
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
                        var lastPost = index == creatorPosts.length - 1;
                        var socialsHTML = (post.creator.links) ?
                        (
                            <div className="socials">
                                {post.creator.links.instagram &&
                                    <a key={post.creator.links.instagram} className="socials-icon" href={post.creator.links.instagram}><FaInstagram size={35} color='#fff'/></a>
                                }{post.creator.links.tiktok &&
                                    <a key={post.creator.links.tiktok} className="socials-icon mb-1" href={post.creator.links.tiktok}><FaTiktok size={35} color='#fff'/></a>
                                }{post.creator.links.twitch &&
                                    <a key={post.creator.links.twitch} className="socials-icon" href={post.creator.links.twitch}><FaTwitch size={35} color='#fff'/></a>
                                }{post.creator.links.twitter &&
                                    <a key={post.creator.links.twitter} className="socials-icon" href={post.creator.links.twitter}><FaTwitter size={35} color='#fff'/></a>
                                }
                            </div>
                        ) : '';
                        var prevID = (index == 0) ? 'top' : 'slide-'+index;
                        return(
                            <div className="slide" id={`slide-${index+1}`} key={index}>
                                <div className="arrow-up-container" onClick={() => prevSlide(prevID)}>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                </div>
                                <div className={`slide-info ${(lastPost)?" last-slide":""}`}>
                                    {socialsHTML}
                                    <div className="slide-creator">
                                        <span className="fs-1 slide-tag">{post.creator.tag.toUpperCase()}</span>
                                        <hr/>
                                        <Button variant="light" className="shop-creator" onClick={() => navigate(`/${post.creator.tag}`)}>
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
                                {!lastPost &&
                                    <div onClick={() => nextSlide(`slide-${index+2}`)} className="arrow-down-container">
                                        <div className="chevron white"></div>
                                        <div className="chevron white"></div>
                                        <div className="chevron white"></div>
                                    </div>
                                }
                            </div>
                        )
                    })}
            </Mobile>
            <Desktop>
                <div id="home-page-first-slide">
                    <div className="home-page-initial-content lg">
                        <span className="fw-bold" style={{fontSize: '4rem'}}>GateKeepers</span>
                        <span className="text-lead mb-3 fw-light" style={{fontSize: '1.25rem'}}>Fashion Collection</span>
                        <Button onClick={exploreButton} variant="dark" style={{paddingBottom: '7.5px'}} className="explore-button">
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
                        var lastPost = index == creatorPosts.length - 1;
                        var socialsHTML = (post.creator.links) ?
                        (
                            <div className="socials">
                                {post.creator.links.instagram &&
                                    <a key={post.creator.links.instagram} className="socials-icon" href={post.creator.links.instagram}><FaInstagram size={45} color='#fff'/></a>
                                }{post.creator.links.tiktok &&
                                    <a key={post.creator.links.tiktok} className="socials-icon mb-1" href={post.creator.links.tiktok}><FaTiktok size={45} color='#fff'/></a>
                                }{post.creator.links.twitch &&
                                    <a key={post.creator.links.twitch} className="socials-icon" href={post.creator.links.twitch}><FaTwitch size={45} color='#fff'/></a>
                                }{post.creator.links.twitter &&
                                    <a key={post.creator.links.twitter} className="socials-icon" href={post.creator.links.twitter}><FaTwitter size={45} color='#fff'/></a>
                                }
                            </div>
                        ) : '';
                        var prevID = (index == 0) ? 'top' : 'slide-'+index;
                        return(
                            <div className="slide" id={`slide-${index+1}`} key={index}>
                                <div className="arrow-up-container" onClick={() => prevSlide(prevID)}>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                </div>
                                <div className={`slide-info ${(lastPost)?" last-slide":""}`}>
                                    {socialsHTML}
                                    <div className="slide-creator">
                                        <span style={{fontSize: '3.5rem'}} className="slide-tag">{post.creator.tag.toUpperCase()}</span>
                                        <hr/>
                                        <Button style={{fontSize: '1.2rem'}} variant="light" className="shop-creator" onClick={() => navigate(`/${post.creator.tag}`)} size='lg'>
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
                                {!lastPost &&
                                    <div onClick={() => nextSlide(`slide-${index+2}`)} className="arrow-down-container">
                                        <div className="chevron white"></div>
                                        <div className="chevron white"></div>
                                        <div className="chevron white"></div>
                                    </div>
                                }
                            </div>
                        )
                    })}
            </Desktop>
        </div>
    )
};

export default Home;