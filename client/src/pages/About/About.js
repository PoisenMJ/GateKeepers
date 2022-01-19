import React from 'react';
import { Accordion } from 'react-bootstrap';
import './About.css';

const About = () => {
    return (
        <div id="about" className="text-center">
            <Accordion defaultActiveKey={1}>
                <Accordion.Item eventKey={0} className="about-accordion-item">
                    <Accordion.Header className="about-accordion-header">ABOUT</Accordion.Header>
                    <Accordion.Body className="about-accordion-body">
                        Gatekeepers is a hub for creators to sell their own clothes and handmade creations.
                        It aims to produce unique and eye catching fashion pieces.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={1} className="about-accordion-item">
                    <Accordion.Header className="about-accordion-header">FAQ</Accordion.Header>
                    <Accordion.Body className="about-accordion-body">
                            <span>COUNTRIES:</span><br/>
                            <span style={{fontSize: '.95rem'}} className="text-muted">Currently shipping to GB, US and EU. Planning to expand soon.</span><br/><br/>
                            <span>DELIVERY:</span><br/>
                            <span style={{fontSize: '.95rem'}} className="text-muted">Delivery times depend on each creator you will recieve an email with an estimate.</span><br/><br/>
                            <span>AVAILABILITY:</span><br/>
                            <span style={{fontSize: '.95rem'}} className="text-muted">Product availability depends on each creator they will post a date for when products will be available or restocked.</span>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={2} className="about-accordion-item">
                    <Accordion.Header className="about-accordion-header">INFO</Accordion.Header>
                    <Accordion.Body className="about-accordion-body">
                        Gatekeepers was created with the sole purpose of bridging the gap between creators and consumers.
                        Stopping the whole 'gatekeeping' culture behind many different fashion communities.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={3} className="about-accordion-item">
                    <Accordion.Header className="about-accordion-header">CREATOR</Accordion.Header>
                    <Accordion.Body className="about-accordion-body">
                        <span className="text-muted">maksie_aki created gatekeepers.</span>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {/* <span id="about-title" className="fs-1">☞ABOUT☜</span>
            <hr className="mx-5"/>
            <span id="about-content" >GateKeepers is a community of alternative and different creators with unique ideas
                of which they express through clothing and accessories. Everything from gothic, emo, indie to cyberpunk
                there are creators of all sorts, you may even find some creators you already know and like.</span> */}
        </div>
    )
}

export default About;