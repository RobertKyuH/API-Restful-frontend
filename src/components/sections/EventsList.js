import React, { Component } from 'react'
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import EventsAddForm from './EventsAddForm';
import AEAddAthletToEventAddForm from './AEAddAthletToEventForm';
import {Dropdown} from 'react-bootstrap'
let ReactBsTable  = require('react-bootstrap-table');
let BootstrapTable = ReactBsTable.BootstrapTable;
let TableHeaderColumn = ReactBsTable.TableHeaderColumn;

class EventsList extends Component{

    constructor(props){
        super(props);
        this.state = {
            isFetching: false,
            events_with_participants: [],
            current_event_participants: [],
            current_event_id: -1,
            athlets: []
        };

        this.setWinnerAthlet = this.setWinnerAthlet.bind(this);
        this.getAthletById = this.getAthletById.bind(this);

    }

    componentDidMount()
    {
        this.fetchEvents();
        this.fetchAllAthlets();
        this.timer = setInterval(() => this.fetchEvents(), 1000); // 5 seconds delay
    }

    componentWillUnmount(){
        clearInterval(this.timer);
        this.timer = null;
    }

    fetchEvents(){
        this.setState({...this.state, isFetching: true});

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")}
        }


        fetch("http://localhost:3005/api/individual_events/getAllEventsWithParticipatingAthlets", requestOptions)
        .then(response=>response.json())
        .then(result =>{
            this.setState({events_with_participants: result, isFetching: false})
        })
        .catch(e => {
            console.log("BLAD ATHLETS: " + e);
            this.setState({...this.state, isFetching: false});
        });
    };

    fetchAllAthlets(){
        console.log("FETCH ATHLETS TOKEN: " + localStorage.getItem("accessToken"));
        this.setState({...this.state, isFetching: true});
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")}
        }

        fetch("http://localhost:3005/api/athlets/getAll", requestOptions)
        .then(response=>response.json())
        .then(athlets =>{
            this.setState({athlets})
        })
        .catch(e => {
            console.log(e);
            this.setState({...this.state});
        }); 
    }
    
    deleteEvent(event_id){
        console.log("DELETE" + event_id);
        console.log("DELETE TOKEN: " + localStorage.getItem("accessToken"));
        const requestOptions = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")},
          body: JSON.stringify(
            {
                id: event_id
            })
        }
        fetch("http://localhost:3005/api/individual_events/delete", requestOptions)
          .then(response=> response.json())
          .then(resp=> console.log(resp));
    }

    deleteEventButtonFormatter(cell, row){
        return <Button type="submit" onClick={() => 
            this.deleteEvent(row.id)}> Delete Event </Button>;
    }

    deleteAthletFromEvent(athlet_idd, event_idd){
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")},
            body: JSON.stringify(
              {
                athlet_id: athlet_idd,
                individual_event_id: event_idd
              })
          }
          fetch("http://localhost:3005/api/athlets_individual_events/deleteAthletFromEvent", requestOptions)
            .then(response=> response.json())
            .then(resp=> console.log(resp));
    }

    deleteAthletFromEventButtonFormatter(cell, row){
        return <Button type="submit" onClick={() => 
            this.deleteAthletFromEvent(row.id, this.state.current_event_id)}> Delete Athlet From Event </Button>;
    }

    underInvestigationFormatter(cell, row){
    }

    updateRowByApi(cell, row){
    }

    participantsViewButtonFormatter(cell, row){
        return <Button type="submit" onClick={() => 
            this.setParticipantsTable(row.athlets, row.id)}> See </Button>;
    }

    setParticipantsTable(participating_athlets, event_id){
        this.setState({current_event_participants: participating_athlets});
        this.setState({current_event_id: event_id});
    }

    athletAddToEventButtonFormatter(cell, row){
        return <Button type="submit" onClick={() => 
            this.setParticipantsTable(row.athlets)}> Add </Button>;
    }

    getAthletById(athlet_id) {
        const temp = this.state.athlets.find(x=> x.id === athlet_id);
        if(temp == null)
            return "-"
        return temp["name"] + " " + temp["surname"];
      }


    winnerAthletCellFormatter(cell, row){
    if(row.winner_athlet_id === -1)
    {
        return     <div> Choose Athlet
        <select onChange={this.setWinnerAthlet}>
            <option>------</option>
          {row.athlets.map((athlet) => <option key={"DATA"} value={[athlet.id, row.id]}>{athlet.name}</option>)}
        </select>
      </div>;
    }
    else
        return <div className="font-weight-bold text-warning">{this.getAthletById(1)}</div>;
    }

    setWinnerAthlet(event){
        console.log("setting " + event.target.value[2]);
        
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")},
            body: JSON.stringify(
              {
                athlet_id: event.target.value[0],
                individual_event_id: event.target.value[2]
              })
          }
          fetch("http://localhost:3005/api/individual_events/setEventWinner", requestOptions)
            .then(response=> response.json())
            .then(resp=> console.log(resp));
    }

    render(){

        return(
                <Container fluid>
                    <Row>
                        
                        <Col sm={8}>
                            <BootstrapTable data = {this.state.events_with_participants}
                            striped hover search searchPlaceholder='Write what you want to search' bordered= {true}
                            bodyStyle={ {wordBreak: 'break-all' }}
                            cellEdit={ {mode: "click", blurToSave: true, afterSaveCell: this.updateRowByApi}}>
                                <TableHeaderColumn tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } }  isKey={true} dataField='id' dataAlign='center'>ID</TableHeaderColumn>
                                <TableHeaderColumn tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } }  dataField='name' dataAlign='center'>Name</TableHeaderColumn>
                                <TableHeaderColumn dataSort={true} tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } } dataField='sport_type' dataAlign='center'>Sport Type</TableHeaderColumn>
                                <TableHeaderColumn dataSort={true} tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } }  dataField='beginning_date' dataAlign='center'>Beginning Date</TableHeaderColumn>
                                <TableHeaderColumn dataSort={true} tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } }  dataField='ending_date' dataAlign='center'>Ending Date</TableHeaderColumn>
                                <TableHeaderColumn editable={false} tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } }  dataField='winner_athlet_id' dataAlign='center' dataFormat={this.winnerAthletCellFormatter.bind(this)}>Winner Athlet</TableHeaderColumn>
                                <TableHeaderColumn tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } }  dataField='athlets' dataFormat={this.participantsViewButtonFormatter.bind(this)} editable={false} thStyle={{ whiteSpace: 'normal' }}>View Participants</TableHeaderColumn>
                                <TableHeaderColumn tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } }  dataField='id' dataAlign='center' dataFormat={this.deleteEventButtonFormatter.bind(this)}>Delete Event</TableHeaderColumn>
                            </BootstrapTable>
                        </Col>
                        <Col sm={4}>
                            <BootstrapTable data={this.state.current_event_participants}
                            striped hover search searchPlaceholder='Write what you want to search' bordered= {true}>
                                <TableHeaderColumn  tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } } isKey={true} dataField='id'>ID</TableHeaderColumn>
                                <TableHeaderColumn  tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } } dataField='name'>Name</TableHeaderColumn>
                                <TableHeaderColumn  tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } } dataField='surname'>Surname</TableHeaderColumn>
                                <TableHeaderColumn  tdStyle={ { whiteSpace: 'normal' } } thStyle={ { whiteSpace: 'normal' } } dataFormat={this.deleteAthletFromEventButtonFormatter.bind(this)}>Delete Athlet from Event</TableHeaderColumn>
                            </BootstrapTable>
                            <EventsAddForm></EventsAddForm>
                            <AEAddAthletToEventAddForm></AEAddAthletToEventAddForm>
                        </Col>
                    </Row>
                </Container>
                    
        )
    }
}


  export default EventsList;

