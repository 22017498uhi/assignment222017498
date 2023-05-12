# assignment222017498

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation Steps](#installation-steps)
    * [Usage](#usage)
* [Introduction](#introduction)



<!-- GETTING STARTED -->
## Getting Started

This section shows the prerequisites required and steps on how to get this project running locally on your device.

### Prerequisites

This project requires NodeJS and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
6.4.1
v8.16.0
```

### Installation Steps

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/22017498uhi/assignment222017498.git
```
Navigate to the project directory.
```sh
$ cd assignment222017498
```

Install NPM packages.
```sh
npm install
```

<!-- USAGE EXAMPLES -->
### Usage
Run below command to start the website on your locally on your browser.
```
npm start
```

<!-- ABOUT THE PROJECT -->
## Introduction
This project is related to the website [iWantToStudyEngineering](https://i-want-to-study-engineering.org/). This website helps students in preparation for engineering exams and courses by providing different engineering questions on various areas suchas mathematics, physics etc. For each of these questions it also provides various videos to help them solve these questions and also provide knowledge on general engineering concepts.

The purpose of this project is to build three new features on this website. The first feature is to provide a live chat feature between consumers of the website who are generally students and site admins who are engineering experts. This feature would allow students to ask experts any questions related to a question or engineering concept. To keep live chats streamlined, users would only be allowed to initiate a chat from a video on a question page so that communicatin is focused around that question and specifically that video. this is because it is not a social media style website and time of engineering experts is very valuable as its a non-profit website.

Second feature is linked with above live chat feature. As mentioned earilier, live chat conversations happen related to a question specific or engineering concept related videos. Many users might ask the same question and admins would have to repeat the same answers in the live chat. To overcome this situation, Admins can choose to mark their live chat message as an FAQ. This marked FAQ message then would be automatically shown on video popup so that any new students can see these FAQ's related a video and it would help them clarify their doubts without having to use the live chat.

The third and the last feature is related to helping the students in answer selection process. It's like providing a hint for solving the question. students can click on a button to see the answers popularity i.e see the percentage of users selecting a perticualr answer option. This would help the students in narrowing the their potential answer from 5 choices to 2-3 choices.


## Methodology
This project is built using [React](https://react.dev/) which is front-end javascript framework and back-end database is build using [Firebase](https://firebase.google.com/). Firebase provides clint SDKs which makes it really easy to fetch and update firebase data direcly from react components.

Apart from these two fundamental technologies, below libraries are also used.

| Library        | Purpose      |    
| ------------- |:-------------:| 
| [React Bootstrap](https://react-bootstrap.github.io/)     | It adds react style wrapper on top of vanilla bootstrap so that working with standard bootstrap elements such as Popovers, Navbars, Modals become much easier and code also becomes much more readable. |
| [Boostrap 5.3 CSS](https://getbootstrap.com/docs/5.3/getting-started/introduction/)      | For styling the UI, boostrap 5.3 CSS file is added, vanilla bootstrap components are not added as it's provided by above library(react-bootstrap).     | 
| [better-react-mathjax](https://github.com/fast-reflexes/better-react-mathjax)  | This library provides a react component which makes it easy to utlize Mathjax features. [MathJax](https://www.mathjax.org/) is library which provides easy way to display mathematical formulas on a webpage. Mathematical text on question summary and answers are shown using this.    | 
| [react-chartjs-2](https://react-chartjs-2.js.org/) | It adds react style wrapper on top of [Chart.js](https://www.chartjs.org/). Chartjs is an open-source library used for displaying charts on webpages. Answer popularity feature UI is built using this.     | 

technologies used.
overall component hierarchy diagram

### feature details - Live Chat
talk about how chat can be initated via confused button.

### feature details - Video FAQs
how admin can add chat messages as FAQs

### feature details - Answers popularity
dsadssadda

## Evaluation
