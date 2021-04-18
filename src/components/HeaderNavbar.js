import React, { Component } from 'react';
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap';
import {NavLink, Redirect, useHistory} from 'react-router-dom'
import Feedback from 'react-bootstrap/esm/Feedback';
import App from '../App';
import {Router} from 'react-router-dom'
import ApiManager from '../services/APIManager'


export class HeaderNavbar extends Component{

    
    constructor(props){
        super(props);

        this.state = {
            isLoggedIn: false,
            shouldRedirect: false,
            errors: ""
        }

        this.Logout = this.Logout.bind(this);
        this.LoginByApi = this.LoginByApi.bind(this);

        this.renderLogin = this.renderLogin.bind(this);
        this.renderLogout = this.renderLogout.bind(this);
    }

    LoginByApi(event){

        event.preventDefault();
        let form = event.target;
  
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Headers' : 'true', 'Accept' :'application.json'},
            body: JSON.stringify(
            {
                email: form.formEmail.value,
                password: form.formPassword.value
            })
        }
  
        fetch("http://localhost:3005/api/auth/signin", requestOptions)
        .then(response => response.json())
        .then(json => {
            console.log("error valid tgoken: " + json.accessToken);
            if(json.accessToken != undefined){
                console.log("XD");
                localStorage.setItem("accessToken", json.accessToken);
                this.setState({isLoggedIn: true});
            }
            else{
                console.log(" ** ")
                localStorage.setItem("accessToken", "null");
                this.setState({isLoggedIn: false});
                this.setState({errors: json.message});
            }
        }
            
        )
        .catch(err=> console.log(err));
    
    }

    Logout(event){
        console.log("logout");
        event.preventDefault();
        localStorage.setItem("accessToken", "null");
        this.setState({shouldRedirect: true});

    }

    renderLogin(){
        return (
            <Form inline onSubmit={this.LoginByApi}>
                <Form.Group>
                <Form.Label className="text-danger"> {this.state.errors} </Form.Label>
                </Form.Group>
                <FormControl name="formEmail" type="text" placeholder="Email" className="mr-sm-2" />
                <FormControl name="formPassword" type="text" placeholder="Password" className="mr-sm-2" />
                <Button type="submit" variant="outline-success">Sign In</Button>
            </Form>
        );
    }

    renderLogout(){
        return (      
            <Form inline>
                <Button onClick={this.Logout} type="submit" variant="outline-success">Logout</Button>
            </Form>
        );

    }



    render(){
        if(this.state.shouldRedirect)
        {
            this.setState({shouldRedirect: false});
            return(<Redirect to={"/"}></Redirect>);
        }
            return (
                <div>
                    <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="/">Athlets Website</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <NavLink to="/athlets" className="nav-link" activeClassName="active">
                                            Athlets
                                </NavLink>
                                <NavLink to="/athletsUnderInvestigation" className="nav-link" activeClassName="active" style={{color: 'green', textDecoration: 'none', fontWeight: 'bold'}}>
                                            Athlets Under Investigation
                                </NavLink>

                                <NavLink to="/events" className="nav-link" activeClassName="active">
                                            Events
                                </NavLink>

                                <NavLink to="/register" className="nav-link font-weight-bold text-danger" activeClassName="active">
                                            Register
                                </NavLink>
                            </Nav>
                            {
                                ApiManager.isAuthorized() ? this.renderLogout() : this.renderLogin()
                            }
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            );
        }

}
