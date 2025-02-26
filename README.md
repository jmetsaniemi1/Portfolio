# Personal Portfolio Website

A modern, interactive portfolio website showcasing my journey from logistics to software development. Built with vanilla JavaScript, HTML, and CSS.

## Features

- **Dark/Light Mode Toggle**: Smooth transition between themes with custom video backgrounds
- **Interactive CV Modal**: Animated CV presentation with typewriter effect
- **Responsive Design**: Fully responsive layout for all screen sizes
- **Custom Animations**: Including scroll animations and interactive elements
- **Project Showcase**: Interactive project cards with detailed information
- **Contact Form**: Integrated email functionality using EmailJS
- **Login modal and register modal**: Ability to register and login to your own page with credentials
- **Authentication System**: Secure login and registration functionality with MongoDB backend
  - Login Modal with form validation
  - Registration Modal for new users
  - Password encryption and secure storage
  - Session management

  

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- GSAP (GreenSock Animation Platform) ( not in use yet )
- Typed.js
- EmailJS
- Render.com
- MongoDB Database

## Project Structure

portfolio/    
│      
├── .github/         
│    
├── CSS/    
│   └── style.css     
│       
├── ICONS/      
│      
├── JAVASCRIPT/       
│ └── script.js      
│       
├── VIDEOS/       
│ ├── darkmode_background_transition-2.mp4         
│ └── lightmode_background_transition-2.mp4       
│         
├── Photos/      
│ └── [image assets]       
│       
├── my-mongo-project/      
│ ├── models/      
│ └── server.js     
│     
├── node_modules/       
│       
├── package.json       
├── package-lock.json        
└── index.html        


## Key Features Explained

### Theme Switching
- Custom video transitions between dark and light modes
- Persistent theme selection using localStorage
- Smooth UI element transitions

### Interactive CV
- Typewriter animation effect for content presentation
- Skip animation option
- Responsive modal design
- Professional document styling

### Contact Form
- Email integration with EmailJS
- Form validation
- Success/error handling
- Spam protection

### Login and Register Modals
- Modern, responsive modal design
- Smooth animations and transitions
- Real-time form validation
  - Password strength requirements
  - Email format validation
  - Username availability check
- Error handling with user-friendly messages
- Remember me functionality
- Secure password visibility toggle
- Automatic redirect after successful authentication
- Cross-browser compatibility
- Mobile-optimized interface

### Authentication System
- Secure user registration with email validation
- Password hashing and encryption
- JWT-based authentication
- Protected routes and content
- MongoDB user data storage
- Session management with secure cookies
- Password reset functionality
- Input validation and sanitization
- Rate limiting for security

## Future Improvements

- [ ] Add more interactive project examples
- [x] Implement backend functionality
- [ ] Add blog section
- [ ] Enhance accessibility features
- [ ] Add more animation options
- [ ] Implement OAuth social login options
- [ ] Add user profile customization

## Local Development

1. Clone the repository

bash
git clone [repository-url]

2. Open index.html in your browser
3. For email functionality, set up EmailJS credentials

## Contact

Johannes Metsäniemi
- Email: jmetsaniemi@me.com
- LinkedIn: [https://www.linkedin.com/in/johannes-metsäniemi-266079aa/]

