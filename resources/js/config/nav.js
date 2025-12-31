const navConfig = {
    logo: {
        text: 'SafeBatch',
        link: '/'
    },
    menu: [
        {
            label: 'Solutions',
            link: '#',
            hasDropdown: true,
            dropdown: {
                columns: [
                    {
                        title: 'Products',
                        items: [
                            {
                                title: 'Monitoring',
                                description: 'Set up a smart Food Safety System with customized monitoring tasks in 15 minutes',
                                link: '#'
                            },
                            {
                                title: 'Traceability',
                                description: 'Discover Traceability System to manage and plan your production with ease',
                                link: '#'
                            },
                            {
                                title: 'HACCP',
                                description: 'Create your HACCP system and download the HACCP Plan in less than 1 hour',
                                link: '#'
                            }
                        ]
                    },
                    {
                        title: 'Industries',
                        items: [
                            {
                                title: 'Restaurants',
                                description: 'See how SafeBatch streamlines restaurant food safety operations and helps companies grow',
                                link: '#'
                            },
                            {
                                title: 'Retail',
                                description: 'See how SafeBatch simplifies food safety monitoring and compliance for retail',
                                link: '#'
                            },
                            {
                                title: 'Healthcare',
                                description: 'See how SafeBatch makes it easy to keep care home residents safe',
                                link: '#'
                            }
                        ]
                    },
                    {
                        title: 'Top features',
                        items: [
                            {
                                title: 'Smart Setup',
                                description: 'Set up your system in minutes by answering some simple questions about your business',
                                link: '#'
                            },
                            {
                                title: 'Educative Instructions',
                                description: 'Help your team complete daily tasks correctly with photo or video instructions',
                                link: '#'
                            },
                            {
                                title: 'Smart Notifications',
                                description: 'Mobile app notifications help your team keep track of and complete tasks on time',
                                link: '#'
                            },
                            {
                                title: 'Real-Time Overview',
                                description: 'Save time on supervision with a simple food safety status overview of all your locations',
                                link: '#'
                            },
                            {
                                title: 'Monitoring Logbook',
                                description: 'Get a detailed overview of your completed tasks and protect your brand by staying compliant',
                                link: '#'
                            },
                            {
                                title: 'Sensor Integrations',
                                description: 'Easily connect with smart devices and temperature sensors to make monitoring faster',
                                link: '#'
                            },
                            {
                                title: 'See all features',
                                description: '',
                                link: '#',
                                isLink: true
                            }
                        ]
                    }
                ]
            }
        },
        {
            label: 'Resources',
            link: '#',
            hasDropdown: true,
            dropdown: [
                {
                    title: 'Free Templates',
                    description: 'More than 200 food safety posters, checklists, charts, logs and tools to download for free',
                    link: '#'
                },
                {
                    title: 'Blog',
                    description: 'Read useful tips about how to serve 100% safe food',
                    link: '#'
                },
                {
                    title: 'Case Studies',
                    description: 'Find out how our clients benefited from using the SafeBatch system',
                    link: '#'
                },
                {
                    title: 'Food Safety eBooks',
                    description: 'Access a collection of eBooks to gain essential knowledge for effective food safety',
                    link: '#'
                },
                {
                    title: 'Explainer videos',
                    description: 'See how SafeBatch can easily digitize and support your food safety management system',
                    link: '#'
                },
                {
                    title: 'Knowledge Base',
                    description: 'All the resources you need to implement and use SafeBatch',
                    link: '#'
                }
            ]
        },
        {
            label: 'Company',
            link: '#',
            hasDropdown: true,
            dropdown: [
                {
                    title: 'About Us',
                    description: 'Learn more about SafeBatch and get in touch with us',
                    link: '/about'
                },
                {
                    title: 'Contact Us',
                    description: 'Get in touch to work together toward your business\'s food safety standards',
                    link: '#'
                },
                {
                    title: 'Partner Program',
                    description: 'Join our Partner Program to earn commission for every client you refer',
                    link: '#'
                },
                {
                    title: 'Integrate with Us',
                    description: 'Join SafeBatch\' growing ecosystem of Integration Partners',
                    link: '#'
                }
            ]
        },
        {
            label: 'Pricing',
            link: '#',
            hasDropdown: false
        }
    ],
    actions: {
        search: {
            placeholder: 'Search',
            enabled: true
        },
        buttons: [
            {
                label: 'GET STARTED FREE',
                link: '#',
                type: 'primary'
            },
            {
                label: 'Login',
                link: '#',
                type: 'link'
            }
        ]
    }
};

export default navConfig;

