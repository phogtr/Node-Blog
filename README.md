# Node-Blog

A full blog-web application where different users can register and login, then they can make, edit, or delete their posts.

The entire project is done by using MongoDB, Express, and Node.js.

---

![overall page](/public/uploads/readme-image/image0.JPG)

![overall page](/public/uploads/readme-image/image1.JPG)

![overall page](/public/uploads/readme-image/image2.JPG)

![overall page](/public/uploads/readme-image/image3.JPG)

---

## Features

- **User Authentication**: When registered, user's password is hashed then stored in the database (which means the actual password does not appear in the database). When login, using _local strategy_, which decrypts the password, making sure the email and password are corrected then allow user to sign-in. (./config/passport.js for the details)

  - Some of the page and options are protected, required the user to login to access it. When user tries to access those pages by changing the url, the site will redirect the user back to the login page instead.

- **Responsive**: The application was built using _Bootstrap_ so it's work on any mobile devices. Any images that were posted to the site would be scaled correctly.

- **Validation**: Using _express-session_ and _connect-flash_, when filling out the form incorrectly, there will be a small notification (flash) at the top, displaying the errors for the user. Also, when login, edit, or make a new post successfully, the site will redirect the user to a page with a small notification at the top as well.

- **Searching**: Search field used regular expression and case-insensitive to search, so user does not have to accurately type the full text. _Advance Search_ allows user to search for a post specifically by a author.

- **Image file upload**: When the user upload an image, the file is stored in the file system with a long string name. This string is stored in the database instead. When rendering the image, the site compares these two strings and if they are matched then display the image.

---

## Navbar

- `Home`: Link to the homepage.
- `Search-bar`: Select one of the two options from the dropdown selection: `Title` or `Author`. Then, start searching (based on the selected option) by clicking the search-icon.
- `User`: If not sign-in, it will display as Guest. When click on it, the dropdown shows two option, `Login` and `Register`. After signing-in, it will changed to the name that the user registered. The dropdown display different options: `Profile`, `Dashboard`, `New Post`, `Logout`.

  - `Register`: User enter the _username_ that would display on the navbar and their post. The _email address_ is used to confirm when login. The two _password_ field requires to be at least 6 characters or more. User's password is secured by using **bcrypt** library, which hash the password and stored it in the database, so it's not possible to know the password just by looking in the database.

  - `Login`: User enter the email and password that they registed. (back-end-works description is at the Features section above)

  - `Profile`: Basic infomation of the user, name and email. User can change their name or email here. (Email is checked to make sure it's unique)

  - `Dashboard`: Display all the posts that were made by the user. Search bar on right-side allows user to search for their own posts.

  - `New Post`: Here, user can make a new post about anything they like. Title field is required, other fields are optional.

  - `Logout`: User sign-out, redirect them back to the login page with a little successful-notification at the top.

---

## Body

- Display all the posts made by all the users. They are sorted by the most recent time that they were made.

- _Advance Search_ on the right-side allows user to narrow down the search to be more accurate.

- User can click on the title of the post, which displays two more options `Edit` and `Delete`. These options only appear if the post was made by user.

  - `Edit`: User can update their post here. The form look almost identical to the _new post_ form.

  - `Delete`: Delete the current post. Alert the user for the confirmation before deleting. **Note**: Since there is no "DELETE" request, I attached the attribute Id of the post to a html tag, then I used AJAX to send the request so that it's possible to do this option. (./public/delete.js for the details)

---

## To-Do Improve the Application

- When updating the profile info, requires the user to input their password.
- Allows user to change their password.
- Implement a forgot password.
- Implement a remember me.
- Pagination.
- Find a way to store the image file to the database instead of in a file system.
- Deploy the app to heroku.
