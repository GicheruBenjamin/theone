// src/App/js

import Component from './components/Component'

const body = document.body

const header = Component('header', {
    className: 'header',
    style: {
        backgroundColor: 'var(--color-teallight)',
        color: 'var(--color-tealdark)',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    children: [
        Component('h1', {
            className: 'header__title',
            children: 'The One',
        }),
        Component('nav', {
            className: 'header__nav',
            children: [
                Component('a', {
                    className: 'header__nav__link',
                    href: '#',
                    children: 'Home',
                }),
                Component('a', {
                    className: 'header__nav__link',
                    href: '#',
                    children: 'About',
                }),
                Component('a', {
                    className: 'header__nav__link',
                    href: '#',
                    children: 'Contact',
                }),
            ],

            events: {
                click: (event) => {
                    event.preventDefault();
                    console.log('clicked');
                },
            },
        }),
    ],
});


body.appendChild(header);