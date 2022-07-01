const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());


const customers = [];

//middleware
function verifyIfExistAccountCPF(request, response, next) {
  const {cpf} = request.headers;

  const customer = customers.find(custumer => custumer.cpf === cpf);  

  
  if(!customer) {
    return response.status(400).json({ error: "custumer not found "})
  }

  request.customer = customer;

  return next();
}

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

// app.use(verifyIfExistAccountCPF);

app.get("/statement", verifyIfExistAccountCPF, (request, response) => {
    const { customer} = request;

    return response.json(customer.statement)
});


app.post("/deposit", verifyIfExistAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    console.log(request)

    const { customer } = request;
  
    
    const statementOperation = {
      description, 
      amount,
      created_at: new Date(),
      type: 'credit'
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
})

app.listen(3333);
