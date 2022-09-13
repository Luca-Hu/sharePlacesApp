// This Readme file is the same as "sharePlacesApp-Frontend"'s Readme

1、Introduction To SharePlacesApp

SharePlaces App is a MERN application.

**I built this fullstack React.js application with Node.js, Express.js & MongoDB.**

It is an amazing Web application for Real Time photo sharing, which is similar to apps like Instagram in function. You can create your own account (password will be hashed) and post the pictures you want to share on your own homepage. The application also allows you to edit and delete your own images. Meanwhile, the GoogleMap API will automatically locate your typed address on the map, and anyone can view the Google Map location corresponding to each picture.

This web application has been deployed on Heroku, so you can access it through the link below:

https://shareplacesappyihu.web.app/

< Please wait patiently for the reponse of page. >

Before you enter this link, please read the follow information to learn more about this application.

-----------------------------------

2、The technologies involved in this project


I use VSCode IDE to build this application. The backend part uses Express.js framework, and the frontend part uses React.js framework.

Details: 

- FrontEnd: **React.js, RESTful API (GoogleMap API)**
- Server: **Node.js/Express.js**
- Database: **MongoDB**
- Authentication & Authorization: J**WT(JSON Web Token) in React**
- BackEnd Standalone Deployment: **Heroku**
- FrontEnd Standalone Deployment: **Firebase Hosting**

------------------------------

3、Access to Test


It has been deployed on Heroku so you can access it through this link：

https://shareplacesappyihu.web.app/

< Please wait patiently for the reponse of page. >

< Note: Since no cloud like AWS S3 is used to save images, all images will not be permanently saved, which is a drawback. >

The homepage is "ALL USERS" page, you can click the user-photos to browser their post(s). If you want use "ADD PLACE" module to create a new post, or use "MY PLACE" module to browser/edit/delete your post(s), you need sign up or sign in.

You can click "Authentication" button in the nav bar to login default user1 's account : **Email: test1@test.com ， Password:tester**

< Tips: All default users' initial password is "tester", you can login other default users' account: test(1~6)@test.com >

You also can sign-up a new account, your account will auto-login after signup successfully.


-----------

4、 Main Functions of This Application 

- 1、Authentication & Authorization

As a visitor, you can enter other user's homepage, view their posted picture and click the "View On Map" button to check the location on Google Map. But visitor can not edit/delete other user's places.

- 2、User Sign-up & Sign-in

 You can click "Authentication" button at the top right to signup/login. If you signup, you will login automatically.
 
- 3、Edit & Delete your post

 You can edit your post information or delete your post in "My Places".

- 4、Upload Images To Share

After you login, you can access to two modules: "My Places" and "Add Place". In "Add Place" module, you can create new post to share where you are and add your review. In "My Places" module, you can edit/delete your places.

- 5、Locate address By Google Map API

When you create new post of place, you need to type a valid address or unique keywords so that the Google Map API can automatically locate an accrate address on map. You can view the result by click the "View On Map" button after posting. 

- 6、Auto Log-in/Log-out ( By using Token )

The application uses the site Token to maintain auto-login and auto-logout within an hour. Even if you don't actively logout, your account will be automatically logged out after an hour.


----------------------------------

5、 Demonstration

- This Web Application's HomePage("All Users" module). You can click other user's photo to browser their posts:

![image](https://user-images.githubusercontent.com/69294450/189479638-db253fdd-0ee5-40b8-b038-1304184b990d.png)

- Everyone can View the Google Map location corresponding to each picture by clicking "View On Map" button:

![image](https://user-images.githubusercontent.com/69294450/189479574-0895fb61-e5c7-4736-869a-b078df825955.png)

- After login, you can edit/delete your places in "My Places" module:

![image](https://user-images.githubusercontent.com/69294450/189479663-17c426e2-86e5-46cb-b72f-306d964254e5.png)

- After login, you can share your places in "New Place" module:

![image](https://user-images.githubusercontent.com/69294450/189479911-5dc6c36f-7491-4e35-9f62-f1e34cd2f069.png)

- Password saved as Hash value in database:

![image](https://user-images.githubusercontent.com/69294450/189479116-17341d3b-8e5a-42a0-b153-7526eb64b652.png)


// --------------------------------------

5、If you have any questions or advices, please feel free to contact me.

My Linken Account：  < https://linkedin.com/in/yihu-tech >

My Email： yihu@smu.edu 
