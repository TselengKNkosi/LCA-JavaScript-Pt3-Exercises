//Grab Elements
const button = document.querySelector('#generateButton');
const resetBtn = document.querySelector("#resetButton");
const ingredients = document.querySelectorAll('#ingredientsList li');
const display = document.querySelector('#spellArea');

//Colourful Styling 
//-- colour randomiser function
function randomPastelColour() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 90;
  const lightness = 80;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

//making the Button Work
//function that listens for a click
button.addEventListener('click', () => {
  //select a random ingredient
  const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];

  //Countdown Logic
  let countdown =3;
  display.textContent = countdown; //Default = 3 on screen initially

  const timer = setInterval(() => {
    countdown--;

    if (countdown > 0) {
      display.textContent = countdown;
    } else {
      clearInterval(timer);

      //display random ingredient
  display.textContent = randomIngredient.textContent;

  //Applying random colour function
  display.style.backgroundColor = randomPastelColour();
    }
  }, 1000);
   
});

//Reset Button Logic 
resetBtn.addEventListener('click', () => {
  display.textContent = ""; //Clears the text
  //Reset the background
  display.style.backgroundColor = "";
})
