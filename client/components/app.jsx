import React, { Component } from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './header';
import Login from './login';
import GradeTable from './gradeTable';
import GradeForm from './gradeForm';
import ConfirmationModal from './confirmationModal';
//import useToken from '../api/useToken';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grades: [],
      currentlyEditing: {
        name: '',
        course: '',
        grade: '',
        gradeId: null,
        update: false
      },
      gradeIdToDelete: null,
      displayConfirmationModal: false,
      deleteMessage: null,
      displayConfirmationMessage: false,
      confirmationMessage: null
    };
    this.addGrade = this.addGrade.bind(this);
    this.deleteGrade = this.deleteGrade.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.handleDeleteCancel = this.handleDeleteCancel.bind(this);
    this.updateGrade = this.updateGrade.bind(this);
    this.clearUpdate = this.clearUpdate.bind(this);
  }

  componentDidMount() {
    this.getGrades();
  }

  componentDidUpdate() {
    this.getAverageGrade();
  }

  async getGrades() {
    try {
      const response = await fetch('/api/grades');
      const grades = await response.json();
      this.setState({
        grades
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async addGrade(newEntry, update) {
    if (!update) {
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const response = await fetch('/api/grades', {
          method: 'POST',
          body: JSON.stringify(newEntry),
          headers
        });
        const result = await response.json();
        this.setState({
          grades: this.state.grades.concat(result),
          confirmationMessage: "The grade was added successfully.",
          displayConfirmationMessage: true
        }, () => setTimeout(() => this.setState({
            displayConfirmationMessage: false
          }), 3000)
        );
      } catch (error) {
        console.error(error.message);
      }
    } else {
      try {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const response = await fetch(`/api/grades/${newEntry.gradeId}`, {
          method: 'PUT',
          body: JSON.stringify(newEntry),
          headers
        });
        const result = await response.json();
        this.setState(previous => {
          const newGrades = previous.grades.map(grade => grade.gradeId === result.id ? result : grade);
          return {
            grades: newGrades,
            confirmationMessage: "The grade was updated successfully.",
            displayConfirmationMessage: true
          };
        }, () => this.getGrades() && setTimeout(() => this.setState({
          displayConfirmationMessage: false
        }), 3000));
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  showDeleteModal(id) {
    const gradeToDelete = this.state.grades.find(grade => grade.gradeId === id);
    this.setState({
      gradeIdToDelete: id,
      confirmationMessage: null,
      deleteMessage: `Are you sure you want to delete the grade of ${gradeToDelete.grade} for ${gradeToDelete.name} in the course, "${gradeToDelete.course}"?`,
      displayConfirmationModal: true
    })
  }

  handleDeleteConfirm() {
    if (this.state.gradeIdToDelete) {
      this.deleteGrade(this.state.gradeIdToDelete);
    }``
    this.setState({
      deleteMessage: null,
      gradeIdToDelete: null,
      confirmationMessage: "The grade was deleted successfully.",
      displayConfirmationModal: false,
      displayConfirmationMessage: true
    }, () => setTimeout(() => this.setState({
      displayConfirmationMessage: false
    }), 3000));
  }

  handleDeleteCancel() {
    this.setState({
      displayConfirmationModal: false
    });
  }

  async deleteGrade(id) {
    try {
      const { grades } = this.state;
      const deletedGrades = grades.filter(grade => grade.gradeId !== id);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      await fetch(`/api/grades/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(deletedGrades),
        headers
      });
      this.setState({
        grades: deletedGrades
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  updateGrade(id) {
    const { grades } = this.state;
    const [updatedGrade] = grades.filter(grade => grade.gradeId === id);
    this.setState({
      currentlyEditing: updatedGrade
    });
  }

  getAverageGrade() {
    const { grades } = this.state;
    const average = grades.reduce((accumulator, currentValue) => accumulator + currentValue.grade, 0) / grades.length;
    const displayAvg = isNaN(average) ? 'N/A' : average.toFixed(1);
    return displayAvg;
  }

  clearUpdate() {
    this.setState({
      currentlyEditing: {
        name: '',
        course: '',
        grade: '',
        gradeId: null,
        update: false
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <Header averageGrade={this.getAverageGrade()} />
        <main>
          <div className="container-fluid">
            <div className="row empty-div">
              {this.state.displayConfirmationMessage ? <div className="alert alert-success" role="alert">{this.state.confirmationMessage}</div> : null}
            </div>
            <div className="row grade-container">
              <GradeTable
                grades={this.state.grades}
                deleteGrade={this.showDeleteModal}
                updateGrade={this.updateGrade}
              />
              <GradeForm
                addGrade={this.addGrade}
                currentlyEditing={this.state.currentlyEditing}
                clearUpdate={this.clearUpdate}
              />
            </div>
            <ConfirmationModal
              showModal={this.state.displayConfirmationModal}
              confirmModal={this.handleDeleteConfirm}
              hideModal={this.handleDeleteCancel}
              id={this.state.gradeIdToDelete}
              message={this.state.deleteMessage}
            />
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
