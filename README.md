# [PROJECT DATABASE (PDB)](https://pdb-client.herokuapp.com/)

## About:

The Project Database (PDB) is a project management platform. It has been designed to support Piping distribuitors from the Energy Industry in the execution of complex projects such as long term agrements or CAPEX and MRO's.

### Scope:

Typically, projects having multiple MTO's, a large number of items, multiple inspection locations, multiple deliveries happening over a long period of time, multiple stock locations and frabrication shops. 

### How does it work:

The Project Database (PDB) is devided into 4 interconected modules: Expediting, Inspection, Shipping and Warehouse. It allows employees from these various departement to perform their daily task while keeping all the information in a central spot.

### What are the advantages:

1. Allow employees from different branches (and sitting in different regions) to work on the same project.
2. Grant users access to project modules based on their designated roles.
3. Have access and update information in real time, (no more spreadsheets shared by email between departement).
4. Mass upload / update information from your ERP system, spread sheets.
5. Allow employees to fully configure the screens as per their requirement.
6. Upload client templates and generate custom reports as per client requirements.
7. Upload / Download Material Test Certificates (assign heatNrs to: NFI, location, picking list, colli).
8. Keep track of stock movement / Generate History reports showing all transactions between warehouse locations.

### What type of reports can be generated:

Module | Reports
--- | ---
Expediting | Expediting Status Report, Performance Report.
Inspection | Notification for Inspection.
Shipping | Packing List, Shipping Marks, Shipping Invoice.
Warehouse | Stock History.


## External links
* [proposal](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Proposal.pdf)
* [mock-up](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Mock-up.pdf)
* [er-diagram](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/entity+relationship+diagram.svg)
* [planning](https://vanleeuwenpublic.s3.eu-west-3.amazonaws.com/proposal/Planning+Rev14.xlsx)
* [approvals](APPROVAL.md)
* [todo list](TODO.md)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them:

nodejs:

```
https://nodejs.org/en/
```

gitbash:

```
https://git-scm.com/downloads
```

Make sure you have already cloned the back end of this app:

```
https://github.com/Sampaguitas/pdb_server
```

### Installing

Clone repository:

```
$ git clone https://github.com/Sampaguitas/pdb_client.git
```

Install dependencies:

```
$ npm install
```

Run the app:

```
$ npm run dev
```

## Deployment

For Deploying with Git to Heroku, click on the following link and follow the instructions: 

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
