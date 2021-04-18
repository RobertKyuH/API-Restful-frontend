import React, { Component } from 'react'
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AthletsAddForm from './AthletsAddForm';
let ReactBsTable  = require('react-bootstrap-table');
let BootstrapTable = ReactBsTable.BootstrapTable;
let TableHeaderColumn = ReactBsTable.TableHeaderColumn;

class AthletsList extends Component{

    constructor(props){
        super(props);
        this.state = {
            isFetching: false,
            athlets: []
        };
    }

    componentDidMount()
    {
        this.fetchAthlets();
        this.timer = setInterval(() => this.fetchAthlets(), 5000); // 5 seconds delay
    }

    componentWillUnmount(){
        clearInterval(this.timer);
        this.timer = null;
    }

    fetchAthlets(){
        this.setState({...this.state, isFetching: true});

        // Check if want to get under investigation
        if(this.props.under_investigation_url === true)
        {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")}
            }

            fetch("http://localhost:3005/api/athlets/getAllUnderInvestigation", requestOptions)
            .then(response=>response.json())
            .then(result =>{
                this.setState({athlets: result, isFetching: false})
            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, isFetching: false});
            });
        }
        else
        {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")}
            }

            fetch("http://localhost:3005/api/athlets/getAll", requestOptions)
            .then(response=>response.json())
            .then(result =>{
                this.setState({athlets: result, isFetching: false})
            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, isFetching: false});
            });
        }
    };


    deleteAthlet (athlet_id){
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")},
            body: JSON.stringify(
              {
                  id: athlet_id
              })
          }
          fetch("http://localhost:3005/api/athlets/delete", requestOptions)
            .then(response=> response.json())
            .then(resp=> console.log(resp));

    }

    nationalityFormatter(cell, row) {
        return cell.name;
    }
    
    deleteButtonFormatter(cell, row){
        return <Button type="submit" onClick={() => 
            this.deleteAthlet(row.id)}> Delete </Button>;
    }

    underInvestigationFormatter(cell, row){

        if(row.under_investigation == true)
            return <div className="font-weight-bold text-danger">Yes</div>;
        else
            return <div className="font-weight-bold text-warning">No</div>;
    }

    updateRowByApi(cell, row){

        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-access-token' : localStorage.getItem("accessToken")},
            body: JSON.stringify(
              {
                "id": cell.id,
                "name": cell.name,
                "surname": cell.surname,
                "sport_type": cell.sport_type,
                "under_investigation": cell.under_investigation
              })
          }
          fetch("http://localhost:3005/api/athlets/update", requestOptions)
            .then(response=> response.json())
            .then(resp=> console.log(resp));
    }

     

    render(){
            return(
                <Container fluid>
                <Row>
                    <Col sm={8}>
                        <BootstrapTable data = {this.state.athlets}
                        striped hover search searchPlaceholder='Write what you want to search' bordered= {true}
                        cellEdit={ {mode: "click", blurToSave: true, afterSaveCell: this.updateRowByApi}}>
                            <TableHeaderColumn isKey={true} dataField='id' dataAlign='center'>ID</TableHeaderColumn>
                            <TableHeaderColumn dataField='name' dataAlign='center'>Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='surname' dataAlign='center'>Surame</TableHeaderColumn>
                            <TableHeaderColumn dataSort={true} dataField='sport_type' dataAlign='center'>Sport Type</TableHeaderColumn>
                            <TableHeaderColumn dataField='nationality' dataAlign='center' dataFormat={this.nationalityFormatter}>Nationality</TableHeaderColumn>
                            <TableHeaderColumn dataField='under_investigation' dataAlign='center' dataFormat={this.underInvestigationFormatter.bind(this)}>Under Invesigation</TableHeaderColumn>
                            <TableHeaderColumn dataField='id' dataAlign='center' dataFormat={this.deleteButtonFormatter.bind(this)}>Delete</TableHeaderColumn>
                        </BootstrapTable>
                    </Col>
                    <Col sm={4}>
                        <AthletsAddForm></AthletsAddForm>
                    </Col>
                </Row>
                </Container>
            );
    }
}


  export default AthletsList;