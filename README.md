# [PROJECT DATABASE (PDB)](https://pdb-client.herokuapp.com/)

## About:

The Project Database (PDB) is a project management platform. It has been designed to support bulk piping distribuitors from the Energy Industry in the execution of complex projects such as long term agrements, CAPEX and MRO's.

### Type of Projects:

Typically, projects having multiple MTO's, a large number of items, multiple inspection locations, multiple deliveries happening over a long period of time, multiple stock locations and frabrication shops. 

### How does it work:

The Project Database (PDB) is devided into 4 interconected modules: Expediting, Inspection, Shipping and Warehouse. It allows employees from these various departement to perform their daily task while keeping all the information in a central spot.

### What are the advantages:

1. Accessibility:

   Having the information stored in one database and accessible via internet has a huge advantage: Employees from different branches (located in different regions) can work on the same project, access and update information in real time. Each project is unique, but the procedure remains the same so colleages can quickly take over if an employee is out of the office. 

2. Flexibility:

   The screen tables have been designed to be has convinient as an excel file: User can fully customise them, decide which fields should be displayed, rename them or create new ones. They can apply filters, sort the table and navigate between cells using their keyboard or mouse just as they would in excel. The data can be updated directly from the cells, However it is also possible to download are raw extract of selected rows and preform a bulk update after modifying the data in excel. Reports can also be fully customised as per client or project requirements. 

3. Timesaving:

   When a project is created, the expediting departement can quickly load the information in the database via excel files. Based on your ERP system, a number of fields can be direclty extracted and do not need to be inserted manually such as the article wheights and HS codes. Each departement can also imediately generate reports when ask by the client, or download MTC's for client approvals.

4. Designed for the industry requirements:

   ERP systems are great tools but have their limitations. it is sometime not possible to differenciate the company's general stocks from dedicated stocks, generate an history report of all stock movements from time goods have been receipt till the goods are packed (stock transfers, stock corrections/reevaluation). Retrive the list of Heat Numbers per NFI, Location, Picking List, Colli. In some projects, the material is not even stored in the companies premises and the warehouse locations are not referenced in the system. This web application has been designed to fill this gap. 

### What type of reports can be generated:

Module | Reports
--- | ---
Expediting | Expediting Status Report, Performance Report.
Inspection | Notification for Inspection.
Shipping | Packing List, Shipping Marks, Shipping Invoice.
Warehouse | Stock History.


## External links

This web application has been developed for Van Leeuwen Pipe and Tube Group; here are some external links to the proposal, mock-up, plannig and approvals.

* [proposal](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Proposal.pdf)
* [mock-up](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Mock-up.pdf)
* [er-diagram](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/entity+relationship+diagram.svg)
* [planning](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Planning+Rev14.xlsx)
* [approvals](APPROVAL.md)
* [to do list](TODO.md)

The application can be access via the following link: [https://pdb-client.herokuapp.com/](https://pdb-client.herokuapp.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See the [deployment](https://github.com/Sampaguitas/pdb_client/blob/master/README.md#deployment) section to deploy your app on Heroku.

### Prerequisites

You will need to install nodejs and gitbash:

nodejs:

```
https://nodejs.org/en/
```

gitbash:

```
https://git-scm.com/downloads
```

Make sure that you have already cloned the back end of this app:

```
https://github.com/Sampaguitas/pdb_server
```

### Installing

Clone this repository:

```
$ git clone https://github.com/Sampaguitas/pdb_client.git
```

Install all dependencies:

```
$ npm install
```

Run the app:

```
$ npm run dev
```

## Deployment

To deploy your Git repository on Heroku, click on the following link and follow the instructions: 

[https://devcenter.heroku.com/articles/git](https://devcenter.heroku.com/articles/git)

## Built With

* [node.js](https://nodejs.org/en/) - JavaScript runtime
* [npm](https://www.npmjs.com) - Dependency Management
* [react](reactjs.org) - The web framework used

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Sampaguitas/pdb_client/tags). 

## Authors

**Timothee Desurmont** - *Business Development Manager* - [View profile](https://www.linkedin.com/in/timothee-desurmont-82243245/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
