import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Contacts API', () => {
    const testContact = {
        name: 'uniqueName',
        contact: 999999999
    }

    const updatedTestContact = {
        name: 'uniqueNameChanged',
        contact: 999999991
    }

    let testContactId;

    describe('POST /api/contacts', () => {
        it('should create a new contact', (done) => {
            chai.request(app)
                .post('/api/contacts')
                .send({name: testContact.name, contact: testContact.contact})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eq(testContact.name);
                    res.body.should.have.property('contact').eq(testContact.contact);
                    res.body.should.have.property('_id');
                    testContactId = res.body._id
                    done();
                });
        });
    });

    describe('GET /api/contacts/all', () => {
        it('should get all contacts', (done) => {
            chai.request(app)
                .get('/api/contacts/all')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                    done();
                });
        });
    });

    describe('PUT /api/contacts', () => {
        it('should update testContact', (done) => {
            chai.request(app)
                .put(`/api/contacts/${testContactId}`)
                .send(updatedTestContact)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eq('successful update');
                    done();
                });
        });
    });

    describe('DELETE /api/contacts', () => {
        it('should delete an existing contact', (done) => {
            chai.request(app)
                .delete(`/api/contacts/${testContactId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eq('successful delete');
                    done();
                });
        });
    });
});