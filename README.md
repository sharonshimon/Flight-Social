# Flight-Social

FlightSocial is a modern social networking platform designed for travelers and enthusiasts to connect, share experiences, and interact through posts, comments, and group activities. The platform allows users to explore groups based on countries or interests, manage personal profiles, follow other users, and gain insights from a statistics dashboard.


User Authentication: Login and secure access to the platform

Profile Management: View and edit user profiles, including personal details and posts

Groups & Communities:

Explore groups by country or theme

Join and leave groups dynamically

Posts & Comments:

Create, view, and comment on posts

Follow other users to receive updates

Statistics Dashboard: Insightful charts and metrics about user activity and posts

Admin Controls: CRUD operations for users and groups (restricted to administrators)

Technologies

Frontend: React, React Router DOM, MUI (Material UI), Axios

Backend: Node.js, Express

Database: MongoDB Atlas

State Management: React Hooks (useState, useEffect, useMemo)

Other Tools: JWT authentication, RESTful API design

____

API Endpoints

Users

POST /users/register – Register a new user

POST /users/login – Authenticate user

GET /users – List all users (admin)

PUT /users/:id – Update user

DELETE /users/:id – Delete user

Groups

GET /groups – List all groups

POST /groups – Create a new group

POST /groups/:id/join – Join a group

POST /groups/:id/leave – Leave a group

Posts

GET /posts – List all posts

POST /posts – Create a post

PUT /posts/:id – Update a post

DELETE /posts/:id – Delete a post

Statistics

GET /stats/postsByMonth – Posts per month

GET /stats/postsByCountry – Posts count per country/group

___

FlightSocial/
│
├── backend/
│   ├── models/          # MongoDB schemas (User, Group, Post)
│   ├── routes/          # Express routes
│   ├── controllers/     # Route logic
│   └── server.js        # Express app setup
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page-level components (Profile, ExploreGroups, Stats)
│   │   ├── services/    # Axios API services
│   │   ├── assets/      # Images, icons, etc.
│   │   ├── App.js       # Main React router
│   │   └── index.js     # React entry point
│
└── README.md


Usage

Register a new account or log in with existing credentials.

Explore groups and join your interests.

Create posts and comment on others’ posts.

Use the profile page to edit personal details and view followers.

Access the statistics dashboard to track activity trends.

Future Improvements

Implement real-time notifications for comments and posts

Add chat functionality between group members

Integrate media uploads for posts and profiles

Enhance analytics dashboard with advanced filters

Mobile-responsive UI enhancements

License

This project is licensed under the MIT License.