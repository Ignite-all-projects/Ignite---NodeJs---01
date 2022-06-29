const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

/**
 * cpf - string
 * name - string
 * id - uui
 * statement []
 */

const customers = [];

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some((custumer) => custumer.cpf === cpf)

  if(customerAlreadyExists) {
    return response.status(400).json({error: "Custumer already exists!"});
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

app.get("/statement/:cpf", (request, response) => {
    const {cpf} = request.params;

    const custumer = customers.find(custumer => custumer.cpf === cpf);


    return response.json(custumer.statement)
})

app.listen(3333);
