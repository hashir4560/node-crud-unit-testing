const assert = require('assert');
const supertest = require('supertest');
const app = require('../server'); // assuming your Express app is exported from 'server.js'
const fs = require('fs');
const path = require('path');

const request = supertest(app);

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

describe('User API', () => {
    before(() => {
        // Create a sample users file for testing
        const sampleUsers = [{ id: 1, name: 'John', email: 'john@example.com' }];
        fs.writeFileSync(usersFilePath, JSON.stringify(sampleUsers));
    });

    after(() => {
        // Clean up after testing
        fs.unlinkSync(usersFilePath);
    });

    describe('GET /api/users', () => {
        it('should get all users', (done) => {
            request.get('/api/users')
                .expect(200)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert(Array.isArray(res.body));
                    assert(res.body.length >= 1);
                    done();
                });
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get a single user by ID', (done) => {
            request.get('/api/users/1')
                .expect(200)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(typeof res.body, 'object');
                    assert.strictEqual(res.body.id, 1);
                    done();
                });
        });

        it('should return 404 if user ID does not exist', (done) => {
            request.get('/api/users/999')
                .expect(404)
                .end((err, res) => {
                    assert.strictEqual(res.status, 404);
                    assert.strictEqual(res.body.message, 'User not found');
                    done();
                });
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', (done) => {
            request.post('/api/users')
                .send({ name: 'Test User', email: 'test@example.com' })
                .expect(201)
                .end((err, res) => {
                    assert.strictEqual(res.status, 201);
                    assert.strictEqual(typeof res.body, 'object');
                    assert.strictEqual(res.body.name, 'Test User');
                    assert.strictEqual(res.body.email, 'test@example.com');
                    done();
                });
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update an existing user', (done) => {
            request.put('/api/users/1')
                .send({ name: 'Updated User', email: 'updated@example.com' })
                .expect(200)
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(typeof res.body, 'object');
                    assert.strictEqual(res.body.name, 'Updated User');
                    assert.strictEqual(res.body.email, 'updated@example.com');
                    done();
                });
        });

        it('should return 404 if user ID does not exist', (done) => {
            request.put('/api/users/999')
                .send({ name: 'Updated User', email: 'updated@example.com' })
                .expect(404)
                .end((err, res) => {
                    assert.strictEqual(res.status, 404);
                    assert.strictEqual(res.body.message, 'User not found');
                    done();
                });
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete an existing user', (done) => {
            request.delete('/api/users/1')
                .expect(204)
                .end((err, res) => {
                    assert.strictEqual(res.status, 204);
                    done();
                });
        });

        it('should return 404 if user ID does not exist', (done) => {
            request.delete('/api/users/999')
                .expect(404)
                .end((err, res) => {
                    assert.strictEqual(res.status, 404);
                    assert.strictEqual(res.body.message, 'User not found');
                    done();
                });
        });
    });
});
