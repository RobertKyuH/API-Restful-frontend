import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class EventsAddForm extends Component{

  constructor(props){
    super(props);
    this.state ={
      name: '',
      sport_type: '',
      beginning_date: '',
      ending_date: ''
    }

    
  }

  componentDidMount(){
    
  }

  submitRequestHandler = (event) => {
      event.preventDefault();
      let form = event.target;

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")},
        body: JSON.stringify(
          {
              name: form.formName.value,
              sport_type: form.formSportType.value,
              beginning_date: form.formStartingDate.value,
              ending_date: form.formEndingDate.value
          })
      }
      fetch("http://localhost:3005/api/individual_events/create", requestOptions)
        .then(response=> response.json())
        .then(resp=> console.log(resp));
  }

  onNameChange(event)
  {
      this.setState({name: event.target.value});
  }

  onSurnameChange(event)
  {
      this.setState({surname: event.target.value});
  }

  onSportTypeChange(event)
  {
      this.setState({sport_type: event.target.value});
  }

  render()
  {
    return(
      <div className='App d-flex flex-column align-items-center'>
          <h1>Add Event to system</h1>
          <Form style={{ width: '300px' }} onSubmit={this.submitRequestHandler}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control name="formName" type='text' value={this.state.value} onChange={() => this.onNameChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Sport Type</Form.Label>
              <Form.Control name="formSportType" type='text'value={this.state.value} onChange={() => this.onSurnameChange}/>
            </Form.Group>
            <Form.Group controlId="dob">
              <Form.Label>Starting Date</Form.Label>
              <Form.Control type="date" name="formStartingDate" placeholder="Date of Birth" />
            </Form.Group>
            <Form.Group controlId="dob">
              <Form.Label>Ending Date</Form.Label>
              <Form.Control type="date" name="formEndingDate" placeholder="Date of Birth" />
            </Form.Group>
            <Button type='submit'>Submit Event</Button>
          </Form>
    </div>
    )
  }
}


export default EventsAddForm;