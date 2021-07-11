import _ from 'lodash';
import './App.css';

const App = ({ name }) => `
    <h3>The function was lazy loaded on click of the Know more button, by importing from another function with parameter of "Harshith Venkatesh"
    </h3>
    <h2> ${_.join(['Welcome', name], ' ')}!</h2>
    <h3>Have a great day ahead!</h3>
    
   
    `;

export default App;
