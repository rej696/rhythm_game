# React Single Page Application Rythmn Game

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Tutorials
- [Node JS backend tutorial](https://medium.com/weekly-webtips/create-and-deploy-your-first-react-web-app-with-a-node-js-backend-ec622e0328d7)
- [sqlite node.js tutorial](https://www.computerhope.com/issues/ch002076.htm)
- [node.js backend database tutorial](https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/)
- [synth tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth)
- [key event handler for react](https://www.npmjs.com/package/react-keyboard-event-handler)
- [install node version manager this app uses 14.15.1](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)


## Requirements

### Must

- Components
    - game
        - starts the master clock, feeds it to the music engine and the game engine
    - block factory
        - create blocks at time intervals
    - blocks (notes)
        - move down a rail
    - block trash can
        - remove blocks from screen at bottom of rail
    - target zones
        - color/noise based on accuracy
        - scoring system recorded in database
    - rails
        - map to a key on the keyboard
    - music track
        - plays a given note 
    - score tracker
        - record scores from target zone
        - talk to blocks/target zone to get combos/misses
    - scoreboard
        - session score log
        - send data to a back end to a database (late game) intermittently


### Should

### Could

### Won't

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
