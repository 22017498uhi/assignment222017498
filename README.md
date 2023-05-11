# assignment222017498

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation Steps](#installation)
* [Usage](#usage)
* [Test details](#test-details)
    * [getQuestionData Tests](#getquestiondata-tests)
    * [attemptQuestion Tests](#attemptquestion-tests)



<!-- ABOUT THE PROJECT -->
## About The Project
This project shows TDD (test driven development) approach. In this approach, test cases for couple of functions are written first then the actual function is coded. these test cases are built using Jest. Click on below link to read more about it.
* [Jest](https://jestjs.io/)



<!-- GETTING STARTED -->
## Getting Started

This section shows the prerequisites required and steps on how to get this project running locally on your device.

## Prerequisites

This project requires NodeJS and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
6.4.1
v8.16.0
```

## Installation Steps

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/22017498uhi/assignment122017498.git
```
Navigate to the project directory.
```sh
$ cd assignment122017498
```

Install NPM packages.
```sh
npm install
```


<!-- USAGE EXAMPLES -->
## Usage
Run below command to execute the tests and see the results.
```
npm test -- --verbose=true
```

The extra option "--verbose=true" is added so that detailed result can be seen.

## Test details
This project contains below two functions.
* getQuestionData -> This function takes questiondID string as input and returns related JSON object from the data.js file.
* attemptQuestion -> This function takes index of the answer selected and returns whether it was correct or incorrect.

### getQuestionData Tests
One of the fundamental functionalities of [i-want-to-study-engineering](https://i-want-to-study-engineering.org/q/balances) is to fetch and show data related to a question based on its questionID.
Hence it's critical that valid questionID is be supplied, else user would not see any data on the page.

This project contains below tests related to input param of this function.
* When no argument is supplied
* When incorrect type "number" is supplied
* When null is supplied
* When invalid string such as "abcd" is supplied
* When valid string is supplied, for example, "balances"

Also, after valid questionID is passed, it is essential that response contains important data related to question title, hint section, answer section etc. Hence, I have covered below tests related to this.
* When response contains "questions" property as expected 
* When response contains "hints" property as expected
* When response contains "answer" property
* When response contains "answer" property which should be an array with atleast 2 elements

For above last test, it is essential that response contains at least 2 answer choices in the array because if it returns only 0 or 1 answer choice, then we won't be able to ask user to make any selection!

### attemptQuestion Tests
Attempting question is one of the major action users perform on this site. Hence below tests are covered for this function. 

Input Related
* When no input argument is passed
* When non number "abcd" is passed as argument, returns error response "valid number must be supplied."
* When valid number argument is passed, for example 1

Response Related
* When correct answer is selected, return "Your answer is correct."
* When incorrect answer is selected, return "Your answer is incorrect." 
