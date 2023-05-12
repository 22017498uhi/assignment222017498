# assignment222017498

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation Steps](#installation-steps)
    * [Usage](#usage)
* [Introduction](#introduction)
* [Methodology](#methodology)
    * [Feature details - Live Chat](#feature-details---live-chat)
    * [Feature details - Video FAQs](#feature-details---video-faqs)
    * [Feature details - Answers popularity](#feature-details---answers-popularity)
* [Evaluation](#evaluation)

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
This project is related to the website [iWantToStudyEngineering](https://i-want-to-study-engineering.org/). This website helps students in preparation for engineering exams and courses by providing different engineering questions on various areas such as mathematics, physics etc. For each of these questions it also provides various videos to help them solve these questions and provide knowledge on general engineering concepts.

The purpose of this project is to build three new features on this website. The first feature is to provide a live chat feature between consumers of the website who are generally students and site admins who are engineering experts. This feature would allow students to ask experts any questions related to a question or engineering concept. To keep live chats streamlined, users would only be allowed to initiate a chat from a video on a question page so that communication is focused on that question, specifically that video. This is because it is not a social media style website and time of engineering experts is very valuable as its a non-profit website.

Second feature is linked with above live chat feature. As mentioned earlier, live chat conversations happen related to a specific video. Many users might ask the same question and admins would have to repeat the same answers in the live chat. To overcome this situation, Admins can choose to mark their live chat message as an FAQ. This marked FAQ message then would be automatically shown on video popup so that any new students can see these FAQ's and it would help them clarify their doubts without having to use the live chat.

The third and the last feature is related to helping the students in answer selection process. It's like providing a hint for solving the question. students can click on a button to see the answers popularity i.e. see the percentage of users selecting a particular answer option. This would help the students in narrowing their potential answer from 5 choices to 2-3 choices.


## Methodology
This project is built using [React](https://react.dev/) which is front-end javascript framework and back-end database is build using [Firebase](https://firebase.google.com/). Firebase provides clint SDKs which makes it easy to fetch and update firebase data directly from react components.

Apart from these two fundamental technologies, below libraries are also used.

| Library        | Purpose      |    
| ------------- |:-------------:| 
| [React Bootstrap](https://react-bootstrap.github.io/)     | It adds react style wrapper on top of vanilla bootstrap so that working with standard bootstrap elements such as Popovers, Navbars, Modals become much easier, and code also becomes much more readable. |
| [Bootstrap 5.3 CSS](https://getbootstrap.com/docs/5.3/getting-started/introduction/)      | For styling the UI, bootstrap 5.3 CSS file is added, vanilla bootstrap components are not added as it's provided by above library(react-bootstrap).     | 
| [better-react-mathjax](https://github.com/fast-reflexes/better-react-mathjax)  | This library provides a react component which makes it easy to utilize Mathjax features. [MathJax](https://www.mathjax.org/) is library which provides easy way to display mathematical formulas on a webpage. Mathematical text on question summary and answers are shown using this.    | 
| [react-chartjs-2](https://react-chartjs-2.js.org/) | It adds react style wrapper on top of [Chart.js](https://www.chartjs.org/). Chartjs is an open-source library used for displaying charts on webpages. Answer popularity feature UI is built using this.     | 
| [ReactPlayer](https://www.npmjs.com/package/react-player) | Provides react component for playing videos. Used in Hints section of the Questions page.

Below diagram shows how Headermenu and Question page is broken down into components.

![IWSE - question page hierarchy](https://github.com/22017498uhi/assignment222017498/assets/113307467/f0acf57f-646f-493b-a769-e4773783bb6d)

As shown above, when user is logged in and access the question page, two components are rendered.
* HeaderNav
* Outlet

Outlet renders the ```QuestionPage``` which contains below components.
* **QuestionSection** -> shows question title, image, and summary text.

* **HintsSection** -> shows hint videos and popup functionality which shows either summary image or video depending upon the button clicked.

* **AnswerSection** -> shows answer options as buttons, a button to validate answer and another button link to show answer popularity.

HeaderNav Contains below components:

* **ChatWindow** : When user clicks on "Chats" header menu, it calls Popover component of react-bootstrap. Inside popover body, this *ChatWindow* component is called. This is wrapper/parent for *ChatroomList* and *ChatroomChat* components. It shows either of these components based on global context property ```selectedChatRoom```. If a chatroom is selected, then show *ChatroomChat* otherwise show *ChatroomList*.

* **ChatroomList** : This shows list of chatrooms. If its admin user, then shows all chatrooms otherwise show only logged-in user's chatrooms. 

* **ChatroomChat** : This shows UI related to individual chatroom. It shows all chat messages related to this chatroom. It also has code related to marking any message as FAQ's which is only visible to **Admin** users.

Below table explains collections created in **firestore** to build these features.

| Collection        | Purpose      |    
| ------------- |:-------------:| 
| Questions | stores the data related to questions such as question title, image, hints videos, answers. currently on stores data related to "balances" question.|
| users | when user logs in, their details are captured into this collection. It also holds a flag to indicate if a user is Admin or not.
| chatrooms | message added by user against a video creates a chatroom. this makes communication streamlined and focused to video.
| chatmessages | individual message within a chatroom is stored in this collection. it stores message text, image (optional) and message author.
| videofaqs | message marked as FAQ's by admin user gets created as a document in this collection. 


This site also utilizes firebase's storage solution and utilizes below folders.

![storage firebase](https://github.com/22017498uhi/assignment222017498/assets/113307467/5f9db416-56cc-4b68-bdb5-b471272372f3)

* **chatimages** -> image added against chat messages are stored here.
* **quesimages** -> image related to questions are stored here. must have same naming convention as question name.
* **quesvideos** -> videos related to hints are stored here. must have same naming convention as videos array in question document. 

**Development Tickets**

 This link contains development tickets related to setup of the react app, firebase and question page : https://github.com/users/22017498uhi/projects/3/views/1?filterQuery=feature%3ACore


## Feature details - Live Chat
This feature provides live chat capability between website user and admins.

### **Demo**
On a question page, user "Jane Doe" clicks on any video as shown below to see that video on a popup.

After that user can click on "Confused?" button if they have any query. Upon clicking on the button, textbox appear where they would add their message and press "Send". Confirmation message appears once message is sent.

![add confused message](https://github.com/22017498uhi/assignment222017498/assets/113307467/e0978d8a-be34-42f0-b2ec-7e6ca34c2a8d)

When admin user comes to the website, they can see the message by clicking on "Chats" header menu. They can see the latest message sent at top. They can also see details like who sent it, for which question and for which video. Upon clicking the chatroom, they can see the message send by end user and can respond to it. Chatroom also has capability of adding images along with text messages.

![admin check chatroom message](https://github.com/22017498uhi/assignment222017498/assets/113307467/9cf7cd3b-6505-4315-9797-d193ae080995)

### **Technical Implementation Details**
When user clicks on "Confused?" button on a video popup and sends their message, It creates a document under ```chatrooms``` collection in firestore. It stores below details for a chatroom document. These fields help in identifying which user sent the message, for which question and video.

![chatroom fields firestore](https://github.com/22017498uhi/assignment222017498/assets/113307467/f764a3f9-2a60-42d6-b01b-ff359b4a1d65)

Once chatroom document is created, another document gets in collection ```chatmessages``` as shown below. It stores details such as text of the message, which chatroom it belongs to and who sent it and when.

![chatmessage fields firestore](https://github.com/22017498uhi/assignment222017498/assets/113307467/d8bae812-4521-4b13-bebe-6b0f4716b263)

### **Development Tickets**
Link to development Tickets for this feature: https://github.com/users/22017498uhi/projects/3/views/1?filterQuery=feature%3A%22Live+Chat%22

## Feature details - Video FAQs
When admin is chatting with user, they can choose to add their message to FAQ's section on the video popup.

### Demo
As shown below, **Admin** has opened their chat with the user. Admin has responded with a message which they can add as FAQ's by pressing ```Add to FAQ's``` button. Once it is added as FAQs, admin can see the message "Already added to FAQ's". Same message is shown when admin comes back to this chat next time, indicating that they have already added this message as FAQs.

![add to faq](https://github.com/22017498uhi/assignment222017498/assets/113307467/0950a6bc-0d74-420b-8ade-60a6c9ab8b48)

Now when any user opens that video , above FAQ will appear next to the video as shown below. It also shows how UI would look like when there are multiple FAQ's and if it contains an image.

![faq end user view](https://github.com/22017498uhi/assignment222017498/assets/113307467/ec6f561b-41d0-4052-bc52-c64a5f9b9ae2)

### **Technical Implementation Details**

On chat window, when admin sends the message reply, they see extra button under their message "Add to FAQ's". normal users do not see this button. This is controlled via a flag under their profile which is stored in ```users``` collection as shown below.

![user fields firestore](https://github.com/22017498uhi/assignment222017498/assets/113307467/b59de2e0-7860-4ef4-8162-683e67f11bc5)


Once admin clicks on a message to add it as FAQ's, a document gets created under collection ```videofaqas``` and it contains details such as FAQ question (a message before admin's message, typically user's message), Admin's message details (text and image if any) and which video and question it belongs to as shown below.

![faq fields firestore](https://github.com/22017498uhi/assignment222017498/assets/113307467/a45214f7-3af7-442e-b580-79f0ed371494)

### **Development Tickets**
Link to development Tickets for this feature: https://github.com/users/22017498uhi/projects/3/views/1?filterQuery=feature%3A%22FAQ%27s%22


## Feature details - Answers popularity
This feature is related to answers section of questions page.
### Demo
On answers section of the question page, user will see "Check Answer popularity" link. Upon clicking on the link, user will see answer popularity for each answer as shown below. Answer popularity percentage means how many users are selecting that answer out of all responses.

![answerpopularity click](https://github.com/22017498uhi/assignment222017498/assets/113307467/17931c4d-398e-42b8-a33f-58816dabf511)

### Technical Implementation Details
This feature is implemented within **AnswerSection** component which resides within **QuestionPage** page. As shown below, when the component loads on the page, question data is fetched from firebase firestore "Questions" collection using [UseEffect](https://react.dev/reference/react/useEffect) reacthook.  Once data question data is received, ```totalUserResponsesCount``` state is calculated from answers array within the question data. each answer from the answers array contains a property ```userResponsesCount```. hence, **totalUserResponsesCount** is total of response count for each answer. This total is utilized to calculate the percentage. formula is ``` percentage = userResponsesCount / totalUserResponsesCount ```

When user clicks on "Check Answer popularity" link, percentage response for each answer is shown besides answer text. These percentages are already there on UI during page load, but they are initally hidden using state ```showAnswerPopularity```. when user click on the link, this state becomes *true* and UI content is made visible.

Percentage on the UI is shown using ```Doughnut``` component provided by "react-chartjs-2" which internally utilizes "Chart.js" as mentioned in the Methodology section.

Another part of this feature is to capture the user's response. and update in firestore. Whenever user selects any answer and clicks on "CHECK MY ANSWER" button, ```validateAnswer``` function is triggered which receives the index of the button clicked, using the index, answer array's specific element is fetched and it's ** serResponsesCount** property is incremented by 1. After that this updated answer array is sent to update the data for the question in firestore.

### **Development Tickets**
Link to development Tickets for this feature: https://github.com/users/22017498uhi/projects/3/views/1?filterQuery=feature%3A%22Answer+Popularity%22


## Evaluation
My approach for building these features was to first get the basic question page working as expected and make it data driven from firestore questions collection so that these features would work for any other question without any code tweaks or issues (however, questionId "balances" is still hardcoded and I should have read it from the URL).

Once question page was working with video popup, I added confused button and form for submitting the message and designed how I would store this message into firestore. I decided to add a layer of "chatroom" which would store details of which video and question user is adding query against. This was essential part of design which would allow users of website to submit queries for different videos and they would appear as separate chatrooms under chat list. It makes admin's life also much easier as they can easily identify who sent the message, against which video and question so that they know the context of the chat as website may contain hundreds of questions.

Next part I worked on was chat window which I initially created as a single component which was called inside header Popover. Once I was happy with all the functionality such as showing list of chatrooms, individual chat room and ability to send messages, I broke them down into mini components. Ideally, I should have broken it down from start but sometimes thought of modularity strikes you when you are implementing it and suddenly you realize that this code is massive and should be broken down into smaller pieces/components.

Last feature was simpler to implement which is answer popularity feature. I haven't shown response percentage by default as per design screenshots as I thought that showing it always would result in poor experience for the users as it causes spoilers. Users can use this as a hint feature when they are unable to solve it. But I think this feature should be implemented initially for admin users so that they can track how users are responding to the questions and try to improve on answer options to make it more challenging or less depending on the situation. i.e. if there is a question where all the users are selecting the right answer 90% of time and all other options are selected <10% then admins can remove those answer options and add more challenging ones.

Overall, I feel all the features are useful for both website user and admin. As an improvement, I would give admins an ability to edit the FAQ message before its added to the video.

