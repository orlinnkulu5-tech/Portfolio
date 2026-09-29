// var secret = 7;

// var answer = prompt (“Please guess the secret number (1-20)”);

// // Convert the string guess to an integer so that we can compare
// var guess = parseInt (answer);

// /////////////////////////////////////////////////////////

// Please add an if statement which checks if the guess is correct, if it is, then display a message: Correct Guess!, otherwise “Sorry, incorrect Guess!

// How can you combine line 2 and 3 into one line

// Expand the program to do this in a while loop, only exiting when the guess was correct

// While the guess is incorrect, test also if it is too low or too high and display the message “Incorrect, too low” or “Incorrect, too high”.

// When you are done make the secret number random.
var secret = Math.floor(Math.random() * 20) + 1;
console.log(secret);
var input = prompt ("please guess the secret number (1-20)");
var guess = parseInt (input);

while (guess !== secret&& guess !== null) {
  if (guess < secret) {
    alert ("Incorrect, too low");
}else{ 
    alert ("Incorrect, too high");
  }
  input = prompt ("please guess the secret number (1-20)");
  guess = parseInt (input);
}
if (input !== null) {
alert ("game over, correct guess!");
} else {
  alert ("correct guess!");
}
           
