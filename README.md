## TutorsVILLE

TutorsVILLE is an online web application to help connect computer science
students with tutors for their courses at the University of Florida.

Users can search across the different computer science courses to find tutors
based on their rating, biography, and availability. Users and tutors alike can
edit their profile to adjust what information is displayed. Finally,
authenticated users can view a tutors contact information to reach them and
schedule a specific tutoring session.

Furthermore, because this application is for the graduate Software Engineering
course a greater emphasis has been placed on good software engineering practices
such as API design, security, error handling, testing, and documentation. API
routes always check the validity of incoming requests (in case of direct HTTP
requests from outside the frontend) and the frontend ensures API errors are
handled gracefully and display to the user. We also incorporated standard
development workflows of using issues, pull requests, project boards, continuous
integration, and code reviews.

Footnote: The original idea was to take things in a more e-commerce direction,
but we realized this was a much larger task than we had time for given the
requirements for things like testing and changed focus after Sprint 2.

- Similar Applications:
    - Knack: https://www.joinknack.com/
    - Freelancer: https://www.freelancer.com/

## Key Links

- Individual Sprint Writeups:
    - [Sprint 1](/sprints/Sprint1.md)
    - [Sprint 2](/sprints/Sprint2.md)
    - [Sprint 3](/sprints/Sprint3.md)
    - [Sprint 4](/sprints/Sprint4.md)
- [Project Board](https://github.com/WillBAnders/TutorsVILLE/projects)
- [Backend API Documentation](/backend/src/router.go)
- [Deployed Website](https://willbanders.dev/TutorsVILLE)

## Video Demos

### Main Application

https://user-images.githubusercontent.com/35618116/164368976-06d5651a-5e6f-45e6-a4b3-704964289664.mp4

### Frontend Testing

https://user-images.githubusercontent.com/35618116/164357590-3f44213e-23a7-483a-bbd8-704ec1873157.mp4

### Backend Testing

https://user-images.githubusercontent.com/35618116/164357515-134efdc3-1c96-4fe5-97ca-c6d5eab402da.mp4

## Tech Stack

- Frontend:
    - React (framework): https://reactjs.org/
    - Material UI (styling): https://mui.com/
    - Jest (unit testing): https://jestjs.io/
    - Cypress (e2e testing): https://cypress.io/
- Backend:
    - Go (language): https://go.dev/
    - Gin (routing): https://gin-gonic.com/
    - Testify (unit testing): https://github.com/stretchr/testify/
- DevOps:
    - GitHub Actions (continuous integration): https://github.com/features/actions
    - GitHub Pages (frontend deployment): https://pages.github.com/
    - Heroku (backend deployment): https://www.heroku.com/

## Team Members

- Blake Anderson: Team lead, API, testing
- Chris Brugal: Frontend lead
- Alexis Dougherty: Backend lead
- Cole Kitroser: Frontend, testing
