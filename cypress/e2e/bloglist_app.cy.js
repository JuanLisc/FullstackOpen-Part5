describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      name: 'Juan Lischetti',
      username: 'JuanLis',
      password: 'Juan1234'
    };

    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user);
    cy.visit('');
  });

  it('Login form is shown', function() {
    cy.contains('Login').click();
    cy.get('#username');
    cy.get('#password');
    cy.get('#login-button');
  });

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('Login').click();
      cy.get('#username').type('JuanLis');
      cy.get('#password').type('Juan1234');
      cy.get('#login-button').click();

      cy.contains('Successfully logged in! Welcome back, JuanLis.');
    });

    it('fails with wrong credentials', function() {
      cy.contains('Login').click();
      cy.get('#username').type('JuanLis');
      cy.get('#password').type('wrongpass');
      cy.get('#login-button').click();

      cy.get('#notification')
        .should('contain', 'Username or password incorrect!')
        .and('have.css', 'color', 'rgb(255, 0, 0)');

      cy.get('html').should('not.contain', 'Successfully logged in! Welcome back, JuanLis.');
    });
  });

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'JuanLis', password: 'Juan1234' });
    });

    it('A blog can be created', function() {
      cy.get('#show-button').click();
      cy.get('#title-input').type('A blog created by Cypress');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type('http://www.cypress.com');

      cy.get('#create-button').click();
      cy.contains('A blog created by Cypress');
    });

    describe('and several blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'First blog', author: 'Cypress1', url: 'nourl.com', likes: 10 });
        cy.createBlog({ title: 'Second blog', author: 'Cypress2', url: 'nourl.com' });
        cy.createBlog({ title: 'Third blog', author: 'Cypress3', url: 'nourl.com', likes: 5 });
      });

      it('one user can like one of those', function () {
        cy.contains('First blog').contains('View').click();
        cy.get('.likeButton').click();
        cy.contains('Likes: 1');
      });

      it('a user can delete a blog that he created', function() {
        cy.contains('Second blog').contains('View').click();
        cy.get('#deleteButton').click();
        cy.on('window:confirm', () => true);
        cy.visit('');
        cy.get('html').should('not.contain', 'Second blog');
      });

      it('only de creator of the blog can see the delete button', function() {
        cy.contains('Log out').click();

        const otherUser = {
          name: 'Outsider',
          username: 'Other',
          password: 'password'
        };
        cy.request('POST', `${Cypress.env('BACKEND')}/users/`, otherUser);
        cy.visit('');
        cy.contains('Login').click();
        cy.get('#username').type(otherUser.username);
        cy.get('#password').type(otherUser.password);
        cy.get('#login-button').click();

        cy.contains('First blog').contains('View').click();
        cy.get('html').should('not.contain', 'Delete Blog');
      });

      it('the blogs are ordered according to likes from most liked to least', function() {
        cy.get('.blog').eq(0).should('contain', 'First blog'); // 10 likes
        cy.get('.blog').eq(1).should('contain', 'Third blog'); // 5 likes
        cy.get('.blog').eq(2).should('contain', 'Second blog'); // 0 likes
      });
    });
  });

});