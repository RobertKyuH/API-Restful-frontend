import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class RegisterForm extends Component{

  constructor(props){
    super(props);

    this.sign_up_code = "the_sport_association";

    this.state ={
        errors: "",
        email: "",
        password: "",
        sign_up_code: "",
        result: []
    }

  }

  submitRequestHandler = (event) => {
      event.preventDefault();
      let form = event.target;

      if(form.formSignUpCode.value === "the_sport_association"){

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Headers' : 'true', 'Accept' :'application.json'},
            body: JSON.stringify(
              {
                  email: form.formEmail.value,
                  password: form.formPassword.value
              })
          }

        fetch("http://localhost:3005/api/auth/signup", requestOptions)
        .then(response => response.json())
        .then(json => this.setState({errors: json.message}))
        .catch(err=> console.log(err));
      }
      else{
          this.setState({errors: "Check sign up code!"});
      }

      // todo: obsluga zarejestrowania
  }

  onEmailChange(event)
  {
      this.setState({email: event.target.value});
  }

  onPasswordChange(event)
  {
      this.setState({password: event.target.value});
  }

  onSignUpCodeChange(event)
  {
      this.setState({sign_up_code: event.target.value});
  }


  render()
  {
    return(
      <div className='App d-flex flex-column align-items-center'>
          <h1>Register</h1>
          <Form style={{ width: '300px' }} onSubmit={this.submitRequestHandler}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control name="formEmail" value={this.state.value} onChange={() => this.onEmailChange} type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control name="formPassword" value={this.state.value} onChange={() => this.onPasswordChange} type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Sign-Up Code</Form.Label>
              <Form.Control name="formSignUpCode" type='text'/>
            </Form.Group>
            <Button type='submit'>Submit Review</Button>
          </Form>
          <h6>{this.state.errors}</h6>
    </div>
    )
  }
}


export default RegisterForm;