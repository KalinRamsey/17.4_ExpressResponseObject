const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');

describe('GET /apps', () => {
  it('should return a 400 if sort method not valid', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'ERROR' })
      .expect(400, 'Sort must be one of "Rating" or "App"');
  })
  it('should return a 400 if genre not valid', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'ERROR' })
      .expect(400, 'Chosen genre not available. Please select from the following:\nAction\nPuzzle\nStrategy\nCasual\nArcade\nCard');
  })
  it('should return an array of objects', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an('array').that.have.lengthOf.at.least(1);
        expect(res.body[0]).to.be.an('object');
      })
  })
  it('should return an array of objects whose names include search parameters', () => {
    
    let searchParams = "ro";
    
    return supertest(app)
      .get('/apps')
      .query({ search: searchParams })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an('array').that.have.lengthOf.at.least(1);

        let containsSearchParams = true;

        for (let i = 0; i < res.body.length; i++){
          if(!res.body[i].App.includes(searchParams)){
            constainsSearchParams = false;
          }
        }

        expect(containsSearchParams).to.be.true;
      })
  })
})