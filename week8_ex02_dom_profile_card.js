//Grab Elements
const updateNameBtn = document.querySelector('#updateNameBtn');
const profileName = document.querySelector('#profileName');
const updateRoleBtn = document.querySelector('#updateRoleBtn');
const profileRole = document.querySelector('#profileRole');
const toggleStatusBtn = document.querySelector('#toggleStatusBtn');
const profileCard = document.querySelector('#profileCard');
const profileImage = document.querySelector('#pprofileImage');

//updateNameBtn functionality
updateNameBtn.addEventListener('click', () => {
  const newName = prompt("Please enter new profile name:") 
  profileName.textContent = newName;  
});

//updateRoleBtn functionality
updateRoleBtn.addEventListener('click', () => {
  const newRole = prompt("Please enter your new role:");
  profileRole.textContent = newRole;
});

//Toggle Active Status Button
toggleStatusBtn.addEventListener('click', () => {
  //Toggles the class on or off when the button is clicked
  profileCard.classList.toggle('active-status');
});

//Creating changeImageBtn
const changeImageBtn = document.createElement('button');

//Attributes and labels 
changeImageBtn.id = 'changeimageBtn';
changeImageBtn.textContent = 'Change Profile Image';

//Append new button inside the profileCard container
profileCard.appendChild(changeImageBtn);

//changeImageBtn functionality
changeImageBtn.addEventListener('click', () => {
  const newImageUrl = prompt("Please enter a new image URL:")
  profileImage.src = newImageUrl;
});