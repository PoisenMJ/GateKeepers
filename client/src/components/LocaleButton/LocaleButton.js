import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { LocaleContext } from '../../services/LocaleContext';
import "./LocaleButton.css";

const LocaleButton = () => {
    const { locale, setLocale } = useContext(LocaleContext);

    var unselectedLocales = (locale == 'GB') ? ['US', 'EU']
        : (locale == 'US') ? ['GB', 'EU'] : ['GB', 'US'];
    
    const changeLocale = (newLocale) => {
        setLocale(newLocale);
    }

    return (
        <div id="locale-button"
            style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                top: '10px'
            }}>
            <Dropdown>
                <Dropdown.Toggle variant="light" className="dropdown-toggle-locale fs-3">
                    {locale}
                </Dropdown.Toggle>
                <Dropdown.Menu variant="light" className="dropdown-menu-locale">
                    {unselectedLocales && unselectedLocales.map((val, index) => 
                    {
                        return <Dropdown.Item onClick={() => changeLocale(val)} className="fs-4 dropdown-item-locale" key={index}>{val}</Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default LocaleButton;