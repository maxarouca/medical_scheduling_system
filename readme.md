# MEDICAL SCHEDULING SYSTEM

> API developed with Node, Express using JSON files as a database

## TECHNOLOGIES

- Node
- Nodemon
- Express
- Sucrase
- Bcryptjs
- JWT
- YUP
- Date FNS
- Date FNS Timezone

API developed to control appointment schedules of a medical clinic.

## Installation

Clone the project in a folder on your computer and then install the project's dependencies

```sh
git clone https://github.com/maxarouca/medical_scheduling_system
npm install
```

## Running

The api will be available at http://localhost:3333

## Available routes

The following routes are available:

#### Register - http://localhost:3333/users (POST)

This endpoint allows the registration of users. It is necessary to send a JSON in the format below.

```
{
	"name": "Jhon Doe",
	"email": "jhon@gmail.com",
	"password": "123456"
}
```

#### Update User - http://localhost:3333/users (PUT)

This endpoint allows updating a user, such as changing the password. It is necessary to send a JSON in the format below.

```
{
	"name": "Jhon Doe",
	"email": "jhon@gmail.com",
	"oldPpassword": "123456",
	"password": "1234567",
	"confirmPassword": "1234567"
}
```

#### Login - http://localhost:3333/login (POST)

This endpoint allows login to the application through registered email and password. A token is returned which must be used for other requests.

```
{
	"email": "jhon@gmail.com",
	"password": "123456"
}
```

#### List SCHEDULES - http://localhost:3333/schedules (GET)

Returns a list of all registered schedules.

#### List SCHEDULES by date range - http://localhost:3333/schedules/interval?startDate=2020-05-01&endDate=2020-05-10 (GET)

returns a list of schedules within a date range. This route expects two parameters, _startDate_, with the start date, and _endDate_, with the end date, both in iso string format.

#### Create SCHEDULES - http://localhost:3333/schedules (POST)

Insert a new Schedule in the database. A json is expected in the request body containing day, daily, weekly, weekDay and intervals.

- If _daily_ is `true`, scheduling will be done on a daily basis.
- If _weekly_ is `true`, scheduling will be done on a weekly basis. In this case, it will be necessary to inform the days of the week available in the _weekDay_ field, in the format of an array of days of the week, conforme exemplo abaixo:

```js
{

	"day": "2020-05-10T10:30:00.911Z",
	"daily": false,
	"weekly": false,
	"weekDay": null,
	"intervals": [
		{
			"start":"2020-05-10T10:30:00.911Z",
		 "end":"2020-05-10T11:30:00.911Z"
		}
	]
}

```

Example of array with days of the week.

```js
{

	"day": null,
	"daily": false,
	"weekly": true,
	"weekDay": ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
	"intervals": [
		{
			"start":"2020-05-10T10:30:00.911Z",
		 "end":"2020-05-10T11:30:00.911Z"
		}
	]
}

```

#### Delete SCHEDULES - http://localhost:3333/schedules/:id (DELETE)

In this endpoint we pass a parameter with the incident id that we want to exclude.

## Contributing

1. Fork it (<https://github.com/maxarouca/medical_scheduling_system>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
