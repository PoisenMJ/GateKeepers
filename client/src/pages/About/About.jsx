import React from 'react';
import { Accordion } from 'react-bootstrap';
import styled from 'styled-components';
import PageTemplate from '../../components/PageTemplate';
import styles from './About.module.css';

const Parent = styled.div`
    height: 80vh;
    padding: 0rem 1rem 2rem 1rem;
    display: grid;
    align-items: center;
    margin: auto;
    text-align: center;
    @media (min-width: 1224px) {
        width: 40%;
        place-self: center;
    }
`;

function About() {
    return (
        <PageTemplate navbarType="Home">
            <Parent>
                <Accordion defaultActiveKey={1}>
                    <Accordion.Item eventKey={0} className={styles.item}>
                        <Accordion.Header className={styles.header}>ABOUT</Accordion.Header>
                        <Accordion.Body className={[styles.body, "fs-5"]}>
                            Gatekeepers is a hub for creators to sell their own clothes and handmade creations.
                            It aims to produce unique and eye catching fashion pieces.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={1} className={styles.item}>
                        <Accordion.Header className={styles.header}>FAQ</Accordion.Header>
                        <Accordion.Body className={styles.body}>
                                <span className="fs-5 fw-bold">SHIPPING:</span><br/>
                                    <span className="text-muted">
                                        Each creator will ship to countries of their choosing you can view the list of each creators shipping countries under their respective product pages. They may update what countries they ship to depending on demand.
                                    </span><br/><br/>
                                <span className="fs-5 fw-bold">DELIVERY:</span><br/>
                                <span className="text-muted">Delivery times is roughly a week you will recieve an email with the tracking number when it has been posted.</span><br/><br/>
                                <span className="fs-5 fw-bold">AVAILABILITY:</span><br/>
                                <span className="text-muted">Product availability depends on each creator they will post a date for when products will be available or restocked.</span>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={2} className={styles.item}>
                        <Accordion.Header className={styles.header}>INFO</Accordion.Header>
                        <Accordion.Body className={[styles.body, "fs-5"]}>
                            Gatekeepers was created with the sole purpose of bridging the gap between creators and consumers.
                            Stopping the whole &rsquo;gatekeeping&rsquo; culture behind many different fashion communities.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={3} className={styles.item}>
                        <Accordion.Header className={styles.header}>CREATOR</Accordion.Header>
                        <Accordion.Body className={styles.body}>
                            <span className="fs-5 text-muted">maksie_aki created gatekeepers.</span>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Parent>
        </PageTemplate>
    )
}

export default About;