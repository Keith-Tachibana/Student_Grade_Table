import React, { Component, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isEmpty: false,
      wrongUsername: false,
      wrongPassword: false
    };
  }

  async loginUser (credentials) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const request = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers
      })
      .then(response => response.json());
    } catch (error) {
      console.error(error.message);
    }
  }

  render() {
    return (
      <React.Fragment>
        <header className="container-fluid mb-4">
          <div className="row">
            <div className="col-12 text-center">
              <h1>Office Suite</h1>
            </div>
          </div>
        </header>
        <main>
          <form className="mx-auto" onSubmit={handleSubmit}>
            <div className="mb-3 form-row">
              <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
              <div className="col-sm-10 form-group">
                <input type="text" className="form-control" onChange={event => setUsername(event.target.value)} />
              </div>
            </div>
            <div className="mb-3 form-row">
              <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
              <div className="col-sm-10 form-group">
                <input type="password" className="form-control" onChange={event => setPassword(event.target.value)} />
              </div>
            </div>
            <div className="mb-3 form-row">
              <div className="col-12">
                <button type="submit" name="submit">Submit</button>
              </div>
            </div>
          </form>
        </main>
      </React.Fragment>
    );
  }



}
