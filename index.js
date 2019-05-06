const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: './data/lambda.sqlite3',
    },
    useNullAsDefault: true, // needed for sqlite
};

const db = knex(knexConfig);
  
const server = express();
  
server.use(helmet());
server.use(express.json());

server.post('/api/cohorts', (req, res) => {
    db('cohorts')
    .insert(req.body)
    .then(ids => {
        const id = ids[0];
        db('cohorts')
        .where({ id })
        .first()
        .then(cohort => {
            res.status(201).json(cohort);
        })
        .catch(err => {
            res.status(500).json(err)
        })
    })
})

server.get('/api/cohorts', (req, res) => {
    db('cohorts')
    .then(cohorts => {
        res.status(200).json(cohorts);
    })
    .catch(error => {
        res.status(500).json(error);
    })
})

server.get('/api/cohorts/:id', (req, res) => {
    const { id } = req.params;
    db('cohorts')
     .where({ id })
     .first()
     .then(cohort => {
        if (cohort) {
            res.status(200).json(cohort)
        } else {
            res.status(404).json({ message: 'Cohort Not Found'})
        }
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

server.get('/api/cohorts/:id/students', (req, res) => {
    const { id } = req.params
    db('students') 
        .join('cohorts', 'cohorts.id', 'students.cohort_id')
        .select('students.id', 'students.name', 'cohorts.name')
        .where('students.cohort_id', id) 
        .then(cohortStudents => {
            if (cohortStudents.length === 0) {
                res.status(404).json({ message: 'That student is not in this cohort'})
            } else {
                res.status(200).json(cohortStudents)
            }
        })
        .catch(err => {
            res.status(500).json({ error: "Request Failed"})
        })
})

server.delete('/api/cohorts/:id', (req, res) => {
    db('cohorts')
     .where({ id: req.params.id })
     .del()
     .then(count => {
        if (count > 0) {
            res.status(204).end()
        } else {
            res.status(404).json({ message: 'Not Found'})
        }
     })
    .catch(err => {
    res.status(500).json({ error: 'error' })
    })
})

server.put('/api/cohorts/:id', (req, res) => {
    db('cohorts')
     .where({ id: req.params.id })
     .update(req.body)
     .then(count => {
        if (count > 0) {
            res.status(200).json(count)
        } else {
            res.status(404).json({ message: 'Cohort Not Found'})
        }
    })
    .catch(err => {
      res.status(500).json({ message: 'error'})
    })
})


const port = 3400;

server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});