import React, { useEffect, useState } from "react";
import {
  FaInstagram,
  FaShoppingBag,
  FaTiktok,
  FaTwitter,
  FaAngleDoubleDown,
  FaAngleDoubleUp
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Col, Row } from "react-bootstrap";
import styles from "./Home.module.css"; 
import PageTemplate from "../../components/PageTemplate";
import { getGatekeeperPosts } from "../../controllers/gatekeepers";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import Divider from "../../components/Divider";
import { MAX_BREAKPOINTS } from "../../utils/breakpoints";

const Slide = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  left: 0;
  top: ${(props) => props.top || 0};
`;

const SlideContent = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 25px;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  justify-content: center;
  @media (max-width: ${MAX_BREAKPOINTS.lg}) {
    width: 100%;
  }
`;

const Tag = styled.h3`
  font-size: 4.5rem;
  @media (max-width: 1400px) {
    font-size: 3rem;
  }
  @media (max-width: 1000px) {
    font-size: 2.25rem;
  }
`;

const GatekeeperImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: opacity(0.9);
`;
const GatekeeperImageLast = styled(GatekeeperImage)`
  @media (max-width: ${MAX_BREAKPOINTS.lg}) {
    display: none;
  }
`

// const BackgroundImage = styled.img`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   object-fit: cover;
// `;

const HomeTextParent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 5rem;
`;
const TitleParent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 4rem;
  margin-bottom: 0;
`;

const SubText = styled.sub`
  font-weight: 400;
  letter-spacing: 11px;
  word-spacing: 8px;
  left: 5px;
`;

function Home() {
  const navigate = useNavigate();
  const [creatorPosts, setCreatorPosts] = useState([]);

  useEffect(() => {
    getGatekeeperPosts().then((_data) => {
      setCreatorPosts(_data);
    });
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView();
  }

  // const exploreButton = () => {
  //   navigate("/maksie_aki/made");
  // };

  return (
    <PageTemplate>
      <TopNavbar type="Home" />
      {/* <BackgroundImage src="/images/backgrounddark.jpg" /> */}
      <Slide top={0} id="slide_0">
        <HomeTextParent className="bg-primary">
          <TitleParent>
            <Title className="text-light">GATEK</Title>
            <Title className="text-info">33</Title>
            <Title className="text-light">PERS</Title>
          </TitleParent>
          <SubText className="text-info fs-4">Custom Collection</SubText>
        </HomeTextParent>
        <FaAngleDoubleDown
          onClick={() => scrollTo(`slide_1`)}
          color="white"
          size={45}
          className={styles.downArrow}
        />
      </Slide>
      {creatorPosts &&
        creatorPosts.map((post, index) => (
          <Slide id={`slide_${index+1}`} top={`${(index + 1) * 100}vh`}>
            <SlideContent
              className={`d-flex gatekeeper-slide-content ${
                (index + 1) % 2 === 0 ? "even-slide" : "odd-slide"
              }`}
            >
              <div className="d-flex flex-column justify-content-evenly align-items-center">
                {post.links.instagram && (
                  <a className={styles.gatekeeperSocial} href={post.links.instagram}>
                    <FaInstagram size={40} />
                  </a>
                )}
                {post.links.tiktok && (
                  <a className={styles.gatekeeperSocial} href={post.links.tiktok}>
                    <FaTiktok size={40} />
                  </a>
                )}
                {post.links.twitter && (
                  <a className={styles.gatekeeperSocial} href={post.links.twitter}>
                    <FaTwitter size={40} />
                  </a>
                )}
              </div>
              <div className="mx-3">
                <Tag>{post.tag.toUpperCase()}</Tag>
                <Divider text="GK" color="#000" thickness="3px"/>
                <Button variant="dark"
                  size="lg"
                  className="w-100 mb-2"
                  type="button"
                  onClick={() => navigate(`/${post.tag}/shop`)}
                >
                  SHOP
                  <FaShoppingBag className="icon-5" />
                </Button>
              </div>
            </SlideContent>
            <Row className="g-0 h-100">
              <Col sm={12} md={12} lg={4} xl={4} xxl={4}>
                <GatekeeperImage
                  src={`/images/${post.image}`}
                  loading="lazy"
                  alt="gatekeeper"
                />
              </Col>
              <Col sm={12} md={12} lg={4} xl={4} xxl={4}/>
              <Col sm={12} md={12} lg={4} xl={4} xxl={4}>
                <GatekeeperImageLast
                  src={`/images/${post.image}`}
                  loading="lazy"
                  alt="gatekeeper"
                />
              </Col>
            </Row>
            <FaAngleDoubleUp
              onClick={() => scrollTo(`slide_${index}`)}
              color="black"
              size={45}
              className={styles.upArrow}
            />
            {index < creatorPosts.length - 1 &&
                <FaAngleDoubleDown
                  onClick={() => scrollTo(`slide_${index+2}`)}
                  color="black"
                  size={45}
                  className={styles.downArrow}
                />
            }
          </Slide>
        ))}
    </PageTemplate>
  );
}

export default Home;
