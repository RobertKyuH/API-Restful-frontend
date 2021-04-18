import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class AEAddAthletToEventAddForm extends Component{

  constructor(props){
    super(props);
    this.state ={
      athlets: [],
      events: []
    }

    
  }

  componentDidMount(){
    this.fetchAthletsAndEvents();
    this.timer = setInterval(() => this.fetchAthletsAndEvents(), 5000);
  }


  fetchAthletsAndEvents(){
    console.log("NEW TEST" + localStorage.getItem("accessToken"));
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")}
    };
    this.setState({...this.state, isFetching: true});
    fetch("http://localhost:3005/api/athlets/getAll", requestOptions)
        .then(response=>response.json())
        .then(athlets =>{
            this.setState({athlets})
        })
        .catch(e => {
            console.log(e);
            this.setState({...this.state});
        });
    
    fetch("http://localhost:3005/api/individual_events/getAll", requestOptions)
    .then(response=>response.json())
    .then(events =>{
        this.setState({events})
    })
    .catch(e => {
        console.log(e);
        this.setState({...this.state});
    }); 
  }


  submitRequestHandler = (event) => {
      event.preventDefault();

      let form = event.target;

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")},
        body: JSON.stringify(
          {
              athlet_id: form.formAthletID.value,
              individual_event_id: form.formEventID.value
          })
      }
      fetch("http://localhost:3005/api/athlets_individual_events/addAthletToEvent", requestOptions)
        .then(response=> response.json())
        .then(resp=> console.log(""));
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
          <h1>Add Athlet to Event</h1>
          <Form style={{ width: '300px' }} onSubmit={this.submitRequestHandler}>

            <Form.Group>
              <Form.Label>Choose athlet</Form.Label>
              <Form.Control name="formAthletID" as='select'>
                  {this.state.athlets.map((athlet, i)=>{
                    return(<option value={athlet.id}>{athlet.name} {athlet.surname}</option>)
                  })}
                </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Choose event</Form.Label>
                <Form.Control name="formEventID" as='select'>
                  {this.state.events.map((event, i)=>{
                    return(<option value={event.id}>{event.name} {event.sport_type}</option>)
                  })}
                </Form.Control>
            </Form.Group>
            <Button type='submit'>Submit Review</Button>
          </Form>
    </div>
    )
  }
}


export default AEAddAthletToEventAddForm;