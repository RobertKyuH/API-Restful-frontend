import React, { Component } from 'react';
import AthletsList from './sections/AthletsList'
import EventsList from './sections/EventsList'
import RegisterForm from './sections/RegisterForm'
import {Redirect, Route} from 'react-router-dom'
import ApiManager from '../services/APIManager'

export class Section extends Component{

    render()
    {
        return(

            <section>
                <Route path="/" exact></Route>

                <Route path="/athlets"
                    render={()=> ApiManager.isAuthorized() ? 
                    <AthletsList></AthletsList>
                    : <Redirect to="/"></Redirect>
                    }></Route>

                <Route path="/athletsUnderInvestigation" 
                    render={() => ApiManager.isAuthorized() ? 
                    <AthletsList under_investigation_url={true}></AthletsList>
                    : <Redirect to="/"></Redirect>
                    }></Route>

                <Route path="/events"
                    render={()=> ApiManager.isAuthorized() ?
                    <EventsList></EventsList>
                    : <Redirect to="/"></Redirect>
                    }>
                </Route>
                
                <Route path="/register"
                    render={
                        ()=>
                        <RegisterForm></RegisterForm>
                    }>
                </Route>
            </section>
        )
    }
}