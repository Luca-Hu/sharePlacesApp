// This Readme file is the same as "sharePlacesApp-Frontend"'s Readme

1、Introduction


This Web Application's name is sharePlacesApp.

It is a fullstack React.js application with Node.js, Express.js & MongoDB (MERN).  

It is an amazing Web application for Real Time photo sharing, which is similar to apps like Instagram in function. You can create your own account (password will be hashed) and post the pictures you want to share on your own homepage. The application also allows you to edit and delete your own images. Meanwhile, the GoogleMap API will automatically locate your typed address on the map, and anyone can view the Google Map location corresponding to each picture.

It has been deployed on Heroku, so you can access it through the link below:

https://shareplacesappyihu.web.app/

Before you enter this link, please read the follow information to learn more about this application.

-----------------------------------

2、The technologies involved in this project


I use VSCode IDE to build this application. The backend part uses Express.js framework, and the frontend part uses React.js framework.

Details: 

- FrontEnd: React.js, RESTful API (GoogleMap)
- Server: Node.js/Express.js
- Database: MongoDB
- Authentication & Authorization: JWT(JSON Web Token) in React
- BackEnd Standalone Deployment: Heroku  
- FrontEnd Standalone Deployment: Firebase Hosting 

------------------------------

3、Access to Test


It has been deployed on Heroku so you can access it through this link：

https://shareplacesappyihu.web.app/

(Note: Since no cloud like AWS S3 is used to save images, all images will not be permanently saved, which is a drawback.）


You can login default user1 's account : Email: test1@test.com ， Password:tester

(Tips: All default users' initial password is "tester", you can login other default users' account: test(1~6)@test.com )


-----------

4、 Main Functions of This Application 

- As a visitor, you can enter other user's homepage and view their posted picture and Google Map location corresponding to each picture.

- You can click "Authentication" button at the top right to signup/login. If you signup, you will login automatically.

- After you login, you can access to two modules: "My Places" and "Add Place". In "Add Place" module, you can create new post to share where you are and add your review. In "My Places" module, you can edit/delete your places.

- The application uses the site Token to maintain auto-login and auto-logout within an hour. Even if you don't actively logout, your account will be automatically logged out after an hour.


----------------------------------

5、 Demonstration

- This Web Application's HomePage :

![image](https://user-images.githubusercontent.com/69294450/189479638-db253fdd-0ee5-40b8-b038-1304184b990d.png)

- Everyone can View the Google Map location corresponding to each picture:

![image](https://user-images.githubusercontent.com/69294450/189479574-0895fb61-e5c7-4736-869a-b078df825955.png)

- After login, you can edit/delete your places in "My Places" module:

![image](https://user-images.githubusercontent.com/69294450/189479663-17c426e2-86e5-46cb-b72f-306d964254e5.png)

- After login, you can share your places in "New Place" module:

![image](https://user-images.githubusercontent.com/69294450/189479911-5dc6c36f-7491-4e35-9f62-f1e34cd2f069.png)

- Password saved as Hash value in database:

![image](https://user-images.githubusercontent.com/69294450/189479116-17341d3b-8e5a-42a0-b153-7526eb64b652.png)


// --------------------------------------

5、If you have any questions or advices, please let me know.

My Linken Account： www.linkedin.com/in/yi-hu-58852321a

My Email： yihu@smu.edu 
