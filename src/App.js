import './App.css';

import { Component } from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import { HeaderNavbar } from './components/HeaderNavbar';
import { Section } from './components/Section';

class App extends Component{

        constructor(props){
                super(props);
        }


        // Athlets list


        render()
        {
                return(
                <Router>
                        <div>
                        <HeaderNavbar></HeaderNavbar>
                        <Section></Section>
                        </div>
                </Router>

                )
        }

}

export default App;
