require('dotenv/config');
const express = require('express');
const db = require('./database');

const app = express();

app.use(express.json());

app.get('/api/grades', (req, res, next) => {
  const sql = `
    SELECT *
      FROM "grades"
  ORDER BY "gradeId" ASC;
  `;
  db.query(sql)
    .then(result => {
      const grades = result.rows;
      console.log("Grades:", grades);
      res.status(200).json(grades);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.get('/api/grades/:gradeId', (req, res, next) => {
  const { gradeId } = req.params;
  if (!parseInt(gradeId, 10)) {
    return res.status(400).json({
      error: '"gradeId" must be a positive integer.'
    });
  }
  const sql = `
    SELECT *
      FROM "grades"
  ORDER BY "gradeId" ASC
      WHERE "gradeId" = $1;
  `;
  const params = [gradeId];
  db.query(sql, params)
    .then(result => {
      const grade = result.rows[0];
      if (!grade) {
        res.status(404).json({
          error: `Cannot find grade with gradeId ${gradeId}.`
        });
      } else {
        res.status(200).json(grade);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.post('/api/grades', (req, res, next) => {
  const { name, course, grade } = req.body;
  if (!name || !course || !grade) {
    return res.status(400).json({
      error: 'Must include name, course, AND grade.'
    });
  } else if (parseInt(grade, 10) < 0) {
    return res.status(400).json({
      error: 'Grade must be a positive integer.'
    });
  }
  const values = [name, course, grade];
  const sql = `
    INSERT INTO "grades" ("name", "course", "grade")
         VALUES ($1, $2, $3)
      RETURNING *;
  `;
  db.query(sql, values)
    .then(result => {
      const grade = result.rows[0];
      res.status(201).send(grade);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.put('/api/grades/:gradeId', (req, res, next) => {
  const { name, course, grade } = req.body;
  const { gradeId } = req.params;
  if (!parseInt(gradeId, 10)) {
    return res.status(400).json({
      error: '"gradeId" must be a positive integer.'
    });
  } else if (grade < 0) {
    return res.status(400).json({
      error: 'Grade must be a positive integer.'
    });
  }
  const values = [name, course, grade, gradeId];
  const sql = `
    UPDATE "grades"
       SET "name" = $1, "course" = $2, "grade" = $3
     WHERE "gradeId" = $4
 RETURNING *;
  `;
  db.query(sql, values)
    .then(result => {
      const grade = result.rows;
      if (!grade) {
        res.status(404).json({
          error: `Cannot find grade with gradeId ${gradeId}.`
        });
      } else {
        res.status(200).json(grade);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.delete('/api/grades/:gradeId', (req, res, next) => {
  const { gradeId } = req.params;
  if (!parseInt(gradeId, 10)) {
    return res.status(400).json({
      error: '"gradeId" must be a positive integer.'
    });
  }
  const params = [gradeId];
  const sql = `
    DELETE FROM "grades"
          WHERE "gradeId" = $1
      RETURNING *;
  `;
  db.query(sql, params)
    .then(result => {
      const grade = result.rows[0];
      if (!grade) {
        res.status(404).json({
          error: `Cannot find grade with gradeId ${gradeId}.`
        });
      } else {
        res.status(204).json(grade);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.get('/api/health-check', (req, res, next) => {
  db.query(`select 'successfully connected' as "message"`)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});
