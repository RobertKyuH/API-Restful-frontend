import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class AthletsAddForm extends Component{

  constructor(props){
    super(props);
    this.state ={
      name: '',
      surname: '',
      sport_type: '',
      nationality: '',
      api_nationalities_list: []
    }

    
  }

  componentDidMount(){
    this.fetchNationalities();
  }

  fetchNationalities(){
    this.setState({...this.state, isFetching: true});
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")}
    }
    fetch("http://localhost:3005/api/nationalities/getAll", requestOptions)
        .then(response=>response.json())
        .then(api_nationalities_list =>{
            this.setState({api_nationalities_list})
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
              name: form.formName.value,
              surname: form.formSurname.value,
              sport_type: form.formSportType.value,
              nationalityId: form.formNationality.value,
              under_investigation: form.formUnderInvestigation.checked
          })
      }
      fetch("http://localhost:3005/api/athlets/create", requestOptions)
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
          <h1>Add athlet to system</h1>
          <Form style={{ width: '300px' }} onSubmit={this.submitRequestHandler}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control name="formName" type='text' value={this.state.value} onChange={() => this.onNameChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Surname</Form.Label>
              <Form.Control name="formSurname" type='text'value={this.state.value} onChange={() => this.onSurnameChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Sport Type</Form.Label>
              <Form.Control name="formSportType" type='text'value={this.state.value} onChange={() => this.onSportTypeChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Nationality</Form.Label>
                <Form.Control name="formNationality" as='select'>
                  {this.state.api_nationalities_list.map((nationality, i)=>{
                    return(<option value={nationality.id}>{nationality.name}</option>)
                  })}
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Under investigation</Form.Label>
              <Form.Check name="formUnderInvestigation"></Form.Check>
            </Form.Group>
            <Button type='submit'>Submit Review</Button>
          </Form>
    </div>
    )
  }
}


export default AthletsAddForm;