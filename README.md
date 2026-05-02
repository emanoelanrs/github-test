# github-test

Sample project to demonstrate how to test the GitHub application.

## Pre-requirements

It is required to have Node.js, npm, and git installed to run this project.

> I used versions `v24.13.0`, `11.11.0`, and `2.42.1` of Node.js, npm, and git respectively. I suggest you use the same or later versions.

## Installation

Run `npm install` (or `npm i` for the short version) to install the dev dependencies.

## Tests

> **Note:** Before running the tests, make a copy of the `cypress.env.example.json` file as `cypress.env.json`, which you must update with valid credentials.
>
> The `cypress.env.json` file is included on [`.gitignore`](./.gitignore) and you're safe that confidential info won't be versioned.

Run `npm test` (or `npm t` for the short version) to run the test in headless mode.

Or, run `npm run cy:open` to open Cypress in interactive mode.

## Support this project

If you want to support this project, leave a ⭐.

___

This project was created with 💚 by [Emanoela Neris](https://github.com/emanoelanrs).
