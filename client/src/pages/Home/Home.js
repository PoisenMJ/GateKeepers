import React, { useEffect, useState } from 'react';
import "./Home.css";
import { Mobile, Desktop } from '../../components/Query';
import { getCreatorPosts } from '../../controllers/creators';
import { Button } from 'react-bootstrap';
import { FaAngleDown, FaAngleUp, FaInstagram, FaShoppingBag, FaTiktok, FaTwitch, FaTwitter } from 'react-icons/fa';
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
        <>
            <div id="initial-home-slide-parent">
                <div id="home-page-header">
                    <div className="d-flex d-print-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex" id="home-page-header-text">
                        <h1>Gate</h1>
                        <h1 id="home-page-header-second">Keepers</h1>
                    </div>
                    <h2 id="home-page-small-text">Fashion Collection</h2>
                </div><img id="home-slide" src={'/images/backgrounddark.jpg'}/>
                <div className="down-arrow-home-parent">
                    <a href="#slide_0">
                        <FaAngleDown className="arrow-home white" size={34}/>
                        <FaAngleDown className="arrow-home white" size={34}/>
                        <FaAngleDown className="arrow-home white" size={34}/>
                    </a>
                </div>
            </div>
            {creatorPosts && creatorPosts.map((post, index) => {
                return (
                    <div id={`slide_${index}`} className='home-slide' style={{top: `${(index+1)*100}vh`}}>
                        <div className={`d-flex gatekeeper-slide-content ${(index+1)%2 == 0?'even-slide':'odd-slide'}`}>
                            <div className="d-flex flex-column justify-content-evenly align-items-center gatekeeper-socials">
                                {post.links.instagram &&
                                    <a className="gatekeeper-social" href={post.links.instagram}><FaInstagram className="fs-3"/></a>
                                }
                                {post.links.tiktok &&
                                    <a className="gatekeeper-social" href={post.links.tiktok}><FaTiktok className="fs-3"/></a>
                                }
                                {post.links.twitter &&
                                    <a className="gatekeeper-social" href={post.links.twitter}><FaTwitter className="fs-3"/></a>
                                }
                            </div>
                            <div className="gatekeeper-name-shop"><span className="fs-2">{post.tag.toUpperCase()}</span>
                                <p className="custom-divider mb-1">GK</p>
                                <button className="btn btn-dark w-100 mb-2" type="button" onClick={() => navigate(`/${post.tag}/made`)}>
                                    SHOP<FaShoppingBag className="icon-8"/></button>
                            </div>
                        </div>
                        <div className="row g-0 h-100">
                            <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4"><img className="home-gatekeeper-image" src={`/images/${post.image}`} loading="lazy"/></div>
                            <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4"><img className="d-none d-print-block d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block home-gatekeeper-image" src={`/images/${post.image}`} loading="lazy"/></div>
                            <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4"><img className="d-none d-print-block d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block home-gatekeeper-image" src={`/images/${post.image}`} loading="lazy"/></div>
                        </div>
                        <div className="up-arrow-home-parent">
                            <a href={(index===0)?"#initial-home-slide-parent":"#slide_"+(index-1)}>
                                <FaAngleUp className="arrow-home" size={34}/>
                                <FaAngleUp className="arrow-home" size={34}/>
                                <FaAngleUp className="arrow-home" size={34}/>
                            </a>
                        </div>
                        {index < creatorPosts.length-1 &&
                            <div className="down-arrow-home-parent">
                                <a href={"#slide_"+(index+1)}>
                                    <FaAngleDown className="arrow-home" size={34}/>
                                    <FaAngleDown className="arrow-home" size={34}/>
                                    <FaAngleDown className="arrow-home" size={34}/>
                                </a>
                            </div>
                        }
                    </div>
                )
            })}
        </>
    )
};

export default Home;