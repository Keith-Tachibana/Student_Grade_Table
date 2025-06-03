# Student Grade Table
A simple CRUD (Create, Read, Update, Delete) application designed for teachers to keep track of their student's progress. Uses a PostgreSQL database in the back-end that is protected from potential SQL injection attacks.
## Technologies Used
|                 Dependency          |    Version    |
|-------------------------------------|--------------:|
| @Babel/Core                         |     7.8.7     |
| @Babel/Plugin-Transform-React-JSX   |     7.8.3     |
| Babel-Loader                        |     8.0.6     |
| Bootstrap                           |     4.4.1     |
| CORS                                |     2.8.5     | 
| Express                             |     4.17.1    |
| FontAwesome                         |     5.11.2    |
| PG                                  |     7.18.2    |
| React                               |    16.13.0    |
| React-Bootstrap                     |    2.10.10    |
| React-DOM                           |    16.13.0    |
| Webpack                             |     4.42.0    |
| Webpack-CLI                         |     3.3.11    |
## Live Demo
Try the application live on [my porftolio website](https://grades.keith-tachibana.com/).
## Features
- Teachers can view a list of recorded grades
- Teachers can view the average grade for the class
- Teachers can add a grade to the table
- Teachers can delete a grade from the table
- Teachers can edit the student name, course name, or student grade from the table
## Preview
![Student Grade Table Preview](preview.gif "Student Grade Table Preview")
## Development
#### System Requirements
|    Requirement    |       Version       |
|-------------------|--------------------:|
| Nginx             |   1.10 or higher    |
| Node              |    10 or higher     |
| NPM               |     6 or higher     |
| PM2               |     4 or higher     |
| PostgreSQL        |    10 or higher     |
| Ubuntu Server     | 18.04 LTS or higher |
#### Getting Started
1. Assuming your current working directory is your user home directory, clone the repoistory
  ```shell
  git clone https://github.com/Keith-Tachibana/Student_Grade_Table.git
  ```
2. Change directory to cloned folder
  ```shell
  cd Student_Grade_Table/
  ```
3. Install all dependencies with NPM
  ```shell
  npm install
  ```
4. Start PostgreSQL server
  ```shell
  sudo service postgresql start
  ```
5. Create the database
  ```shell
  createdb studentGradeTable
  ```
6. Import the schema
  ```shell
  psql -d studentGradeTable -f schema.sql
  ```
7. Import the example data
  ```shell
  psql -d studentGradeTable -f data.sql
  ```
8. Edit your nginx default site configuration to reverse proxy the Express.js server
  ```shell
  cd /etc/nginx/sites-available
  sudo nano default
  ```
   - 8a. In the "server" code block, add this underneath the first location definition
        ```shell
        location /api {
          include proxy_params;
          proxy_pass http://127.0.0.1:3000;
        }
        ```
   - 8b. Save your changes (`Ctrl + O`) and exit (`Ctrl + X`)
   - 8c. Link your default site to the sites-enabled directory (if not already done):
        ```shell
        sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
        ```
9. Check nginx configuration is correct
  ```shell
  sudo nginx -t
  ```
   - 9a. If so, start nginx service
        ```shell
        sudo systemctl start nginx
        ```
   - 9b. Otherwise, go back and correct the edits you made above, then run step 9 again

10. Go back to the project's root directory, assuming it's located in your user home directory
  ```shell
  cd ~/Student_Grade_Table/
  ```

11. Transpile React components using Webpack
  ```shell
  npm run build
  ```

12. Start the Express.js server using the PM2 module and the built-in NPM scripts
  ```shell
  pm2 start --name "studentGradeTable" npm -- start
  ```
    *You may have to prefix the above command with "sudo" if you get a permissions error

13. Open your default web browser and navigate to http://localhost:3001/ to see the result!
