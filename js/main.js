//Grabbing html Elements for Login Page Functionality
const modal = document.querySelector('.modal');
const usernameInput = document.querySelector('#uname');
const passwordInput = document.querySelector('#pwd');

/** validateLogin() function
 * 
 * 1. Gets the username and password entered by user
 * 2. Compares entered information against stored credentials
 * 3. If valid = User is redirected to index.html
 */

function validateLogin(event) {
  //Preventing the browser from refreshing the page automatically - so that the js function can run
  event.preventDefault();
  //1. Fetching the details entered by the user
  const username = usernameInput.value;
  const password = passwordInput.value;

  //2. Comparing entered values to hardcoded credentials
  if (username === 'admin' && password === 'password123') {
    alert("Login Successful\nRedirecting to Home Page...");

    //3. Redirecting user Home Page
    window.location.href = "index.html";
    
  } else {
    //Invalid Credentials
    console.log('Invalid Credentials');
    modal.style.display = 'block';
    
  };
};

/**dismissModal() function
 * 
 * 1. Gets the modal element
 * 2. Hides the error modal
 * 3. User can try and login again
 */

function dismissModal() {
  modal.style.display = 'none';
};

//--- Home Page Navigation Toggle ---

let sideBarOpen = false;

/** toggleNav() function
 * 
 * 1. Toggle the sideBarOpen state - switch between true/false
 * 2. if true = expand the sidebar
 * 3. if false = collapse sidebar
 */

function toggleNav() {
  //Grabbing html sidebar element
  const sidebar = document.querySelector('.nav-sidebar');

  sideBarOpen = !sideBarOpen; //!true = false and vice versa
  
  //Applying different CSS stylings based on the state of the sidebar
  if (sideBarOpen == true) {
    sidebar.style.width = '250px';
    sidebar.querySelector('ul').style.visibility = "visible";
  } else {
    sidebar.style.width = '50px';
    sidebar.querySelector('ul').style.visibility = 'hidden';
  };
  
};