/// <reference types="cypress" />

describe('general testing', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
  

  beforeEach(() => {

  })
  //Cypress.config("waitAfterEachCommand", 2000)

  //Courses
  it('goes to courses page and confirm number of courses', () => {
    cy.visit('localhost:3000')
    cy.contains('See Courses').click()
    cy.findByTitle('buttonStack').children().should('have.length', 10)
  })

  it('COP returns 5 on course page', () => {
    cy.visit('localhost:3000/courses')
    cy.findByTitle('SearchBarInput').type('COP')
    cy.findByTitle('buttonStack').children().should('have.length', 5)
  })






  //Tutors
  it('Return to homepage', () => {
    cy.visit('localhost:3000/tutors')
    cy.contains('TutorsVILLE').click()
    cy.url().should('eq', "http://localhost:3000/")
  })

  it('Check Alice tutor page', () => {
    cy.visit('localhost:3000/tutors/Alice')
    cy.findByTitle('Avatar_and_Name');
    cy.should('contain', "Alice Smith");
    cy.findByTitle('Username_and_Rating');
    cy.should('contain', "@Alice");
    cy.findByTitle('Rating').should('have.attr', 'aria-label', "5 Stars");
    cy.findByTitle('Email_Address').should('contain', "alicemsmith@gmail.com");
    cy.findByTitle('Phone_Number').should('contain', "(567) 890-1234");
  })





  //Auth tests
  it('Go to sign in page', () => {
    cy.visit('localhost:3000')
    cy.contains('Sign In').click()
    cy.url().should('eq', "http://localhost:3000/SignIn")
  })

  it('Go to sign up page', () => {
    cy.visit('localhost:3000')
    cy.contains('Sign Up').click()
    cy.url().should('eq', "http://localhost:3000/SignUp")
  })

  it('Go to sign up page from sign in', () => {
    cy.visit('localhost:3000/Signin')
    cy.contains('Don\'t have an account? Sign Up').click()
    cy.url().should('eq', "http://localhost:3000/signup")
  })

  it('Go to sign in page from sign up', () => {
    cy.visit('localhost:3000/Signup')
    cy.contains('Already have an account? Sign in').click()
    cy.url().should('eq', "http://localhost:3000/signin")
  })

  it('Submit sign up page', () => {
    cy.visit('localhost:3000/SignUp')
    cy.findByTitle('username').type('COP')
    cy.findByTitle('password').type('12!Abe')
    cy.findByTitle('submit').click()
    cy.url().should('eq', "http://localhost:3000/")
  })

  it('Submit sign up page and go to sign in automatically', () => {
    cy.visit('localhost:3000/SignUp')
    cy.findByTitle('username').type('Abe')
    cy.findByTitle('password').type('12!Abe')
    cy.findByTitle('submit').click()
    cy.url().should('eq', "http://localhost:3000/")
  })
/*
  it('Create an account, edit profile, check new profile', () => {
    cy.visit('localhost:3000/SignUp')
    cy.findByTitle('username').type('COP')
    cy.findByTitle('password').type('12!Abe')
    cy.findByTitle('submit').click()
    cy.visit('localhost:3000/profile')
    cy.findByTitle('firstname').type('Jon')
    cy.findByTitle('lastname').type('Arbuckle')
    cy.findByTitle('email').type('jon.arbuckle@gmail.com')
    cy.findByTitle('phone').type('352-352-3523')
    cy.contains('update').click();
    cy.reload();
    cy.findByTitle('firstname').should('eq', 'Jon')
    cy.findByTitle('lastname').should('eq', 'Arbuckle')
    cy.findByTitle('email').should('eq', 'jon.arbuckle@gmail.com')
    cy.findByTitle('phone').should('eq', '352-352-3523')
  })
*/
  it('Log in as tutor, add self to class, click on profile', () => {
    cy.visit('localhost:3000/SignIn')
    cy.findByTitle('username').type('Bob')
    cy.findByTitle('password').type('password')
    cy.findByTitle('submit').click()
    cy.contains('See Courses').click()
    cy.contains('COT-3100').click()
    let before;
    let after;
    cy.findByTitle('addbutton').click();
    cy.findByTitle('tutorlist').children().should('have.length', 2)
    cy.contains("Bob").click()
    cy.url().should('eq', 'http://localhost:3000/tutors/Bob')

  })

  it('Log in as tutor, remove self to class', () => {
    cy.visit('localhost:3000/SignIn')
    cy.findByTitle('username').type('Bob')
    cy.findByTitle('password').type('password')
    cy.findByTitle('submit').click()
    cy.contains('See Courses').click()
    cy.contains('COT-3100').click()
    let before;
    let after;
    cy.findByTitle('removebutton').click();
    cy.findByTitle('tutorlist').children().should('have.length', 1)

  })

  it('Error Page', () =>{
    cy.visit('localhost:3000/gotoerror')
    cy.contains('Error')
  })

  /*it('Sign up, sign in, check for one cookie', () => {
    cy.visit('localhost:3000/SignUp')
    cy.findByTitle('username').type('Abe')
    cy.findByTitle('password').type('12!Abe')
    cy.findByTitle('submit').click()

    cy.findByTitle('username').type('Abe')
    cy.findByTitle('password').type('12!Abe')
    cy.findByTitle('submit').click()

    cy.url().should('eq', "http://localhost:3000/")
    cy.getCookies()
      .should('have.length', 1)
      .then((cookies) => {
        expect(cookies[0]).to.have.property('name', 'jwt')
      })
  })*/
/*
  it('Sign up, Sign in, Sign out, check for empty cookies, make sure signout was recognized by frontend', () => {
    cy.visit('localhost:3000/SignUp')
    cy.findByTitle('username').type('Abe2')
    cy.findByTitle('password').type('12!Abe')
    cy.findByTitle('submit').click()

    cy.findByTitle('username').type('Abe2')
    cy.findByTitle('password').type('12!Abe')
    cy.findByTitle('submit').click()


    cy.findByTitle('menu').click()
    cy.findByTitle('signout').click()


    cy.url().should('eq', "http://localhost:3000/")
    cy.getCookies().should('have.length', 0)

    cy.findByTitle('signupbutton').should('be.visible')
    cy.findByTitle('signinbutton').should('be.visible')

  })
*/
})
