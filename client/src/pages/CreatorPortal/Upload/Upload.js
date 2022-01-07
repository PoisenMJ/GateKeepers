import React from 'react';
import { Form } from 'react-bootstrap';
import './Upload.css';

const Upload = () => {
    return (
        <div>
            <Form>
                <Form.Control type="text" placeholder="Product Name"/>
            </Form>
        </div>
    )
}

export default Upload;