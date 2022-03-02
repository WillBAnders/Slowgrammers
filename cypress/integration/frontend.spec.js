/// <reference types="cypress" />

describe('general testing', () => {
  beforeEach(() => {
    
  })

  it('goes to tutor page and confirm number of tutors', () => {
    cy.visit('localhost:3000')
    cy.contains('See Tutors').click()
    cy.findByTitle('tutorlist').children().should('have.length', 5)
  })

  it('Mon returns 5 on course page', () => {
    cy.visit('localhost:3000/tutors')
    cy.findByTitle('SearchBarInput').type('Mon')
    cy.findByTitle('tutorlist').children().should('have.length', 4)
  })

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

  it('Return to homepage', () => {
    cy.visit('localhost:3000/tutors')
    cy.contains('TutorsVILLE').click()
    cy.url().should('eq', "http://localhost:3000/")
  })

  it('Check Alice tutor page', () =>{
    cy.visit('localhost:3000/tutors/Alice')
    cy.findByTitle('Avatar_and_Name');
    cy.should('contain', "Alice Smith");
    cy.findByTitle('Username_and_Rating');
    cy.should('contain', "@Alice");
    cy.findByTitle('Rating').should('have.attr', 'aria-label', "5 Stars");
    cy.findByTitle('Email_Address').should('contain', "alicemsmith@gmail.com");
    cy.findByTitle('Phone_Number').should('contain', "(567) 890-1234");
  })
})
