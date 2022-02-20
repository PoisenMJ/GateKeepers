import React, { useEffect, useState } from 'react';
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
        navigate('/maksie_aki/made');
    }
    
    return(
        <div id="home-page">
            <Mobile>
                <div id="home-page-first-slide">
                    <img src={'/images/background.jpg'} id="home-page-background" alt='background'/>
                    <div className="home-page-initial-content text-center">
                        <div className='text-center w-100'>
                            <h1 className="fw-bold" id="site-title" style={{fontSize: '2.5rem'}}>GATE<span className="text-muted fw-light fst-italic">KEEPERS</span></h1>
                        </div>
                        <h3 className="text-lead mb-3 fw-light" style={{fontSize: '1.25rem'}}>Fashion Collection</h3>
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
                        var socialsHTML1 = (post.links) ?
                        (
                            <div className="socials">
                                {post.links.instagram &&
                                    <a key={post.links.instagram} className="socials-icon" href={post.links.instagram}><FaInstagram size={35} color='#fff'/></a>
                                }{post.links.tiktok &&
                                    <a key={post.links.tiktok} className="socials-icon mb-1" href={post.links.tiktok}><FaTiktok size={35} color='#fff'/></a>
                                }
                            </div>
                        ) : '';
                        var socialsHTML2 = (post.links) ?
                        (
                            <div className="socials">
                                {post.links.twitch &&
                                    <a key={post.links.twitch} className="socials-icon-right" href={post.links.twitch}><FaTwitch size={35} color='#fff'/></a>
                                }{post.links.twitter &&
                                    <a key={post.links.twitter} className="socials-icon-right" href={post.links.twitter}><FaTwitter size={35} color='#fff'/></a>
                                }
                            </div>
                        ):'';

                        var prevID = (index == 0) ? 'top' : 'slide-'+index;
                        return(
                            <div className="slide" id={`slide-${index+1}`} key={index}>
                                <div className="arrow-up-container" onClick={() => prevSlide(prevID)}>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                </div>
                                <div className={`slide-info ${(lastPost)?" last-slide":""}`}>
                                    {socialsHTML1}
                                    <div className="slide-creator">
                                        <span className="fs-1 slide-tag">{post.tag.toUpperCase()}</span>
                                        <p className="custom-divider-white">GK</p>
                                        <Button variant="light" className="shop-creator" onClick={() => navigate(`/${post.tag}/made`)}>
                                            SHOP
                                            <FaShoppingBag style={{marginLeft: '6px', marginBottom: '4px'}}/>
                                        </Button>
                                    </div>
                                    {socialsHTML2}
                                </div>
                                <img
                                    alt='creator-image'
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
                    <img src={'/images/background.jpg'} id="home-page-background"/>
                    <div className="home-page-initial-content lg">
                        <h1 className="fw-bold" id="site-title" style={{fontSize: '4rem'}}>GATE<span className="text-muted fw-light fst-italic">KEEPERS</span></h1>
                        <h3 className="text-lead mb-3 fw-light" style={{fontSize: '1.25rem'}}>Fashion Collection</h3>
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
                        var socialsHTML1 = (post.links) ?
                        (
                            <div className="socials">
                                {post.links.instagram &&
                                    <a key={post.links.instagram} className="socials-icon" href={post.links.instagram}><FaInstagram size={35} color='#fff'/></a>
                                }{post.links.tiktok &&
                                    <a key={post.links.tiktok} className="socials-icon mb-1" href={post.links.tiktok}><FaTiktok size={35} color='#fff'/></a>
                                }
                            </div>
                        ) : '';
                        var socialsHTML2 = (post.links) ?
                        (
                            <div className="socials">
                                {post.links.twitch &&
                                    <a key={post.links.twitch} className="socials-icon-right" href={post.links.twitch}><FaTwitch size={35} color='#fff'/></a>
                                }{post.links.twitter &&
                                    <a key={post.links.twitter} className="socials-icon-right" href={post.links.twitter}><FaTwitter size={35} color='#fff'/></a>
                                }
                            </div>
                        ):'';
                        var prevID = (index == 0) ? 'top' : 'slide-'+index;
                        
                        var col = post.accent.match(/.{1,2}/g);
                        var luma = ((0.299 * parseInt(col[0], 16)) + (0.587 * parseInt(col[1], 16)) + (0.114 * parseInt(col[2], 16)));
                        var textCol = (luma > 0.5) ? '#000': '#fff';

                        return(
                            <div className="slide" id={`slide-${index+1}`} key={index}>
                                <div className="arrow-up-container" onClick={() => prevSlide(prevID)}>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                    <div className="chevron white"></div>
                                </div>
                                <div className={`slide-info ${(lastPost)?" last-slide":""}`}>
                                    {socialsHTML1}
                                    <div className="slide-creator">
                                        <span style={{fontSize: '3.5rem'}} className="slide-tag">{post.tag.toUpperCase()}</span>
                                        <p className="custom-divider-white">GK</p>
                                        <Button style={{fontSize: '1.2rem', backgroundColor: post.accent, color: textCol, borderColor: post.accent}} className="shop-creator" onClick={() => navigate(`/${post.tag}/made`)} size='lg'>
                                            SHOP
                                            <FaShoppingBag style={{marginLeft: '6px', marginBottom: '6px'}}/>
                                        </Button>
                                    </div>
                                    {socialsHTML2}
                                </div>
                                <div className="desktop-slide-images" style={{
                                        top: `calc(100vh * ${index+1})`
                                    }}>
                                    <img
                                        alt='creator-image'
                                        className="slide-image desktop"
                                        src={`/images/${post.image}`}
                                    />
                                    <img
                                        alt='creator-image'
                                        className="slide-image desktop"
                                        src={`/images/${post.image}`}
                                    />
                                    <img
                                        alt='creator-image'
                                        className="slide-image desktop"
                                        src={`/images/${post.image}`}
                                    />
                                </div>
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