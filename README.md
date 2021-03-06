![alt text](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/pdb.svg "Project Database (PDB)")

## About:

The Project Database (PDB) is a project management platform. It has been designed to support bulk piping distribuitors from the Energy Industry in the execution of complex projects such as Long Term Agrements and CAPEX.

### Types of Projects:

Typically, projects having: multiple material take off, a large number of items, multiple inspection locations, multiple deliveries happening over a long period of time, multiple stock locations and multiple frabricators to be delivered. 

### How does it work:

The Project Database (PDB) is divided into 4 interconected modules: Expediting, Inspection, Shipping and Warehouse. It allows employees from these various departement to perform their daily tasks while keeping all the information in a central spot.

### What are the advantages:

1. Accessibility:

   Having the information stored in one database and accessible via internet has a huge advantage: Employees from different operating companies (and located in different regions) can work on the same project, access and update information in real time. Each project is unique, but the procedure remains the same so colleages can quickly take over if an employee is on leave. there is no need to worry about dates and number formats as the data is displayed as per your computer locales.

2. Flexibility:

   The screen tables have been designed to be as convinient as an excel file: User can fully customise them, decide which fields should be displayed, rename them or create new ones. They can apply filters, sort the table and navigate between cells using their keyboard or mouse just as they would in excel. The data can be updated directly in the table cells, However it is also possible to download a raw extract of and preform a bulk update after modifying the data in excel. Reports can also be fully customised as per client or project requirements. 

3. Time Efficiency:

   When a project is created, the expediting departement can quickly load the information in the database via excel files. Based on your ERP system, a number of fields can be direclty extracted and do not need to be inserted manually such as the article wheights and HS codes. Each departement can also imediately generate reports when asked by their client, or download MTC's for client approvals.

4. Designed for the industry:

   ERP systems are great tools but have their limitations: Retreive the list of heat numbers per NFI, location, picking ticket, colli. It is sometime also not possible to differenciate general stocks from dedicated stocks, generate an history report of all stock transactions from the time goods have been received till the time goods are packed (stock transfers, stock corrections/reevaluation). In some projects, the materials are stored in multiple warhouses or outside the company premises; warehouse locations are not referenced in the ERP system... This web application has been designed to fill that gap.

### What type of reports can be generated:

Module | Reports
--- | ---
Expediting | Expediting Status Report, Performance Report.
Inspection | Notification for Inspection, Material Test Certificate.
Shipping | Packing List, Shipping Mark, Shipping Invoice.
Warehouse | Stock History, Picking Ticket.


## External links

This web application has been developed for [Van Leeuwen Pipe and Tube Group](https://www.vanleeuwen.com/en/); here are some external links to the proposal, mock-up, plannig and approvals.

* [proposal](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Proposal.pdf)
* [mock-up](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Mock-up.pdf)
* [er-diagram](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/entity+relationship+diagram.svg)
* [planning](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Planning+Rev16.pdf)
* [approvals](APPROVAL.md)
* [to do list](TODO.md)
* [manual](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Manual.pdf)

The application can be accessed via the following link: [https://pdb-client.herokuapp.com/](https://pdb-client.herokuapp.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See the [deployment](https://github.com/Sampaguitas/pdb_client/blob/master/README.md#deployment) section to deploy your app on Heroku.

### Prerequisites

You will need to install [nodejs](https://nodejs.org/en/) and [gitbash](https://git-scm.com/downloads) (to execute git commands if you are running on windows).

Make sure that you have already set up the back_end of this app: [https://github.com/Sampaguitas/pdb_server](https://github.com/Sampaguitas/pdb_server).

### Installing

Clone this repository:

```
$ git clone https://github.com/Sampaguitas/pdb_client.git
```

Install all dependencies:

```
$ npm install
```
In your **webpack.config.js** file, under externals: change 'https://pdb-server.herokuapp.com' with the address of your back_end application. This will allow your front_end to make API calls to your back_end application once deployed.

```
externals: {
   config: JSON.stringify({
      apiUrl: process.env.NODE_ENV === 'dev' ? 'http://localhost:5000' : 'https://pdb-server.herokuapp.com',
      version: require('./package.json').version
   })
},
```

Run the app:

```
$ npm run dev
```
If everithing whent well, you should see the following logs in your terminal:

![alt text](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/setup/bundling.png "boundling")

Now clear the git info with the following command:

```
git init
```

And push your application to a new Git repo... 

## Deployment

While setting up the back_end, we have created a pipeline in Heroku and two applications:

![alt text](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/setup/staging.png "staging")

Click on your front_end application and under the deploy tab, click on use github (then link it to your git repo):

![alt text](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/setup/use+github.png "use github")

We do not have config vars to be set for the front_end application.

## Built With

* [node.js](https://nodejs.org/en/) - JavaScript runtime
* [npm](https://www.npmjs.com) - Dependency Management
* [react](reactjs.org) - The web framework used
* [redux](https://redux.js.org/) - Predictable container for application state

This application contains 282 files and 64,720 lines of code (98,162 including back_end).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details about our code of conduct and how to submit pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Sampaguitas/pdb_client/tags). 

## Authors

**Timothee Desurmont** - *Business Development Manager* - [View profile](https://www.linkedin.com/in/timothee-desurmont-82243245/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
