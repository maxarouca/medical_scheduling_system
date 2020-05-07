# SOAP SALES CONTROL API

> API developed with Node, Express and Postgres


## TECHNOLOGIES

- Node
- Nodemon
- Express
- Sucrase
- Postgres
- Sequelize
- Bcryptjs
- JWT
- YUP
- Date FNS


API developed for consumption of a product sales control application

## Installation

Clone the project in a folder on your computer and then install the project's dependencies

```sh
git clone https://github.com/maxarouca/soap_sales_control_api
npm install
```

## Running

The api will be available at http://localhost:3333

OBS: It is necessary to have a postgres database available and to change the bank settings in the src / config / database folder

## Available routes

The following routes are available:

#### List SALES - http://localhost:3333/sales (GET)

Returns a list of all registered Sales

#### Create SALE - http://localhost:3333/sales (POST)

Insert a new Sale in the database. A json is expected in the request body containing name, email, whatsapp, city, uf.

```js
{
"quantity": 201,
"date": "2020-05-05T22:42:27.570Z",
"tax": 6,
"is_pay": false,
"total": 311.55,
"unitary_value": 1.55
}

```


#### Edit Sale - http://localhost:3333/sales/:id (PUT)

This endpoint allows you to change a previously registered sale. Receive a JSON with the data to be sent in the format below:

```js
{
"quantity": 201,
"date": "2020-05-05T22:42:27.570Z",
"tax": 6,
"is_pay": false,
"total": 311.55,
"unitary_value": 1.55
}

```

#### Delete Sale - http://localhost:3333/sales/:id (DELETE)

In this endpoint we pass a parameter with the incident id that we want to exclude.

#### List Tax - http://localhost:3333/tax?startDate=2020-01-01&endDate=2020-11-31&tax=6 (GET)

Returns the total sales in a given period, together with the discounted rate and taxes, and the final value.

#### Login - http://localhost:3333/login (POST)

This endpoint allows login to the application through registered email and password. A token is returned which must be used for other requests.

## Contributing

1. Fork it (<https://github.com/maxarouca/soap_sales_control_api>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
