import request from 'supertest';
import app from '../../src/index'; 
import jwt from 'jsonwebtoken';
import { config } from '../../src/config/config';
import { MongoUser } from '../../src/models/mongoUser.model';
import mongoose from 'mongoose';
import { connectToMongoDatabase } from '../../src/data/databaseMongo';


//Connect to mongo Database before all
beforeAll(async () => {
    await connectToMongoDatabase(config.DB_TEST_URI_FINAL);
});

//After all tests, disconnect from database
afterAll(async () => {
    await mongoose.disconnect();

});


describe("JWT and role protections", () => {
  
  describe('User Routes AUTH', () => {
  
    let adminToken: string;
    let userToken: string;

    beforeAll(async () => {
      MongoUser.deleteMany({});
      adminToken = jwt.sign({ user: { role: 'Admin' } }, config.jwtSecret);
      userToken = jwt.sign({ user: { role: 'User' } }, config.jwtSecret);
    });
    afterAll(async () => {
      await MongoUser.deleteMany({});
    });

    describe('POST /users/signIn', () => {
      it('should work if a normal user wants to create a normal user', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"User"
        }
  
        const response = await request(app)
          .post('/users/signIn')
          .set('Authorization', `Bearer ${userToken}`)
          .send(newUser);
        expect(response.status).toBe(201);
      });


      it('should return an error if a normal user tries to create a admin', async () => {
        const newUser = {
            username:"newAdmin",
            password:"newAdminPassword",
            email:"newAdmin@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .post('/users/signIn')
          .set('Authorization', `Bearer ${userToken}`)
          .send(newUser);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({});
      });

      it('should work if a admin wants to create a normal user', async () => {
        const newUser = {
            username:"newUser2",
            password:"newUserPassword2",
            email:"newUser2@gmail.com",
            role:"User"
        }
  
        const response = await request(app)
          .post('/users/signIn')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newUser);
        expect(response.status).toBe(201);
      });


      it('should work if a admin wants to create a admin', async () => {
        const newUser = {
            username:"newAdmin2",
            password:"newAdminPassword2",
            email:"newAdmin2@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .post('/users/signIn')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newUser);
        expect(response.status).toBe(201);
      });

      it('should work if someone without token tries to create a user', async () => {
        const newUser = {
          username:"newUser2",
          password:"newUserPassword2",
          email:"newUser200@gmail.com",
          role:"User"
        }
  
        const response = await request(app)
          .post('/users/signIn')
          .send(newUser);
        expect(response.status).toBe(201);
      });

      it('should return an error if someone without token tries to create an admin', async () => {
        const newUser = {
            username:"newAdmin3",
            password:"newAdminPassword3",
            email:"newAdmin3@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .post('/users/signIn')
          .send(newUser);
        expect(response.status).toBe(401);
      });
    });






    
    describe('PUT /users/:id', () => {


      let adminId:mongoose.Types.ObjectId;
      let userId:mongoose.Types.ObjectId;
      let adminToken: string;
      let userToken: string;
      beforeEach(async () => {
        await MongoUser.deleteMany({});
        const admin = new MongoUser({ username: 'auth', email: 'authest@gmail.com', password: 'IlovesOats', role: 'Admin' });
        await admin.save();
        adminId = admin._id;
        adminToken = jwt.sign({ user: { _id: adminId, role: 'Admin' } }, config.jwtSecret);
      
        const user = new MongoUser({ username: 'auth2', email: 'authest2@gmail.com', password: 'IlovesOats', role: 'User' });
        await user.save();
        userId = user._id;
        userToken = jwt.sign({ user: { _id: userId, role: 'User' } }, config.jwtSecret);
      });
    
      
    
      afterEach(async () => {
        await MongoUser.deleteMany({});
      });

      it('should work if a admin wants to modify himself', async () => {
        const newUser = {
          username:"newUser",
          password:"newUserPassword",
          email:"newUser@gmail.com",
          role:"User"
        }
        
        
        const response = await request(app)
          .put(`/users/${adminId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newUser);
        expect(response.status).toBe(200);
      });

      
      it('should work if user wants to modify himself', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"User"
        }
  
        const response = await request(app)
          .put(`/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(newUser);
        expect(response.status).toBe(200);
      });

      it('it should not work if a user wants to modify himself into an admin', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .put(`/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(newUser);
        expect(response.status).toBe(403);
      });


      
      it('it should not work if a user wants to modify someone else', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .put(`/users/${adminId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(newUser);
        expect(response.status).toBe(403);
      });

      it('it should work if a admin wants to modify someone else', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .put(`/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newUser);
        expect(response.status).toBe(200);
      });

      it('it should not work if someone without token wants to modify a user', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .put(`/users/${userId}`)
          .send(newUser);
        expect(response.status).toBe(401);
      });
      
      it('it should not work if someone without token wants to modify a Admin', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .put(`/users/${adminId}`)
          .send(newUser);
        expect(response.status).toBe(401);
      });
    });




    describe('DELETE /users/:id', () => {


      let adminId:mongoose.Types.ObjectId;
      let userId:mongoose.Types.ObjectId;
      let adminToken: string;
      let userToken: string;
      beforeEach(async () => {
        await MongoUser.deleteMany({});
        const admin = new MongoUser({ username: 'auth', email: 'authest@gmail.com', password: 'IlovesOats', role: 'Admin' });
        await admin.save();
        adminId = admin._id;
        adminToken = jwt.sign({ user: { _id: adminId, role: 'Admin' } }, config.jwtSecret);
      
        const user = new MongoUser({ username: 'auth2', email: 'authest2@gmail.com', password: 'IlovesOats', role: 'User' });
        await user.save();
        userId = user._id;
        userToken = jwt.sign({ user: { _id: userId, role: 'User' } }, config.jwtSecret);
      });
    
      afterEach(async () => {
        await MongoUser.deleteMany({});
      });

      it('should work if a admin wants to delete himself', async () => {
        const newUser = {
          username:"newUser",
          password:"newUserPassword",
          email:"newUser@gmail.com",
          role:"User"
        }
        
        const response = await request(app)
          .delete(`/users/${adminId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newUser);
        expect(response.status).toBe(204);
      });

      
      it('should work if user wants to delete himself', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"User"
        }
  
        const response = await request(app)
          .delete(`/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(newUser);
        expect(response.status).toBe(204);
      });
      
      it('it should not work if a user wants to delete someone else', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .delete(`/users/${adminId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(newUser);
        expect(response.status).toBe(403);
      });

      it('it should work if a admin wants to delete someone else', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .delete(`/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(newUser);
        expect(response.status).toBe(204);
      });

      it('it should not work if someone without token wants to delete a user', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .delete(`/users/${userId}`)
          .send(newUser);
        expect(response.status).toBe(401);
      });
      
      it('it should not work if someone without token wants to delete a Admin', async () => {
        const newUser = {
            username:"newUser",
            password:"newUserPassword",
            email:"newUser@gmail.com",
            role:"Admin"
        }
  
        const response = await request(app)
          .delete(`/users/${adminId}`)
          .send(newUser);
        expect(response.status).toBe(401);
      });
    });
  });
});