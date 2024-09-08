<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
   <h1>TestContainers Mongo</h1>

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

A package of Ts.ED framework. See website: https://tsed.io/

This package allows you to test your code using the [TestContainers](https://node.testcontainers.org/) library.

# Installation

To use the `@tsed/testcontainers-mongo` package, you need to install the package:

```sh [npm]
npm install --save-dev @tsed/testcontainers-mongo
```

```sh [yarn]
yarn add --dev @tsed/testcontainers-mongo
```

```sh [pnpm]
pnpm add --dev @tsed/testcontainers-mongo
```

```sh [bun]
bun add --dev @tsed/testcontainers-mongo
```

### Configuration

Add or update your jest or vitest configuration file to add a global setup file:

#### Jest

```ts
// jest.config.js
module.exports = {
  globalSetup: ["jest.setup.js"],
  globalTeardown: ["jest.teardown.js"]
};

// jest.setup.js
const {TestContainersMongo} = require("@tsed/testcontainers-mongo");
module.exports = async () => {
  await TestContainersMongo.startMongoServer();
};

// jest.teardown.js
const {TestContainersMongo} = require("@tsed/testcontainers-mongo");
module.exports = async () => {
  await TestContainersMongo.stopMongoServer();
};
```

### Vitest

```ts
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: [import.meta.resolve("@tsed/testcontainers-mongo/vitest/setup")]
  }
});
```

:::

## Usage

### @tsed/mongoose

#### Unit test

Use the `TestContainersMongo.create` method to start the mongo server before your test:

```ts
import {PlatformTest} from "@tsed/common";
import {Property, Required} from "@tsed/schema";
import {Model, MongooseModel, ObjectID, PostHook, PreHook, Unique} from "@tsed/mongoose";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

@Model({schemaOptions: {timestamps: true}})
@PreHook("save", (user: UserModel, next: any) => {
  user.pre = "hello pre";

  next();
})
@PostHook("save", (user: UserModel, next: any) => {
  user.post = "hello post";

  next();
})
export class UserModel {
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @Unique()
  email: string;

  @Property()
  pre: string;

  @Property()
  post: string;
}

describe("UserModel", () => {
  beforeEach(() => TestContainersMongo.create());
  afterEach(() => TestContainersMongo.reset("users")); // clean users collection after each test

  it("should run pre and post hook", async () => {
    const userModel = PlatformTest.get<MongooseModel<UserModel>>(UserModel);

    // GIVEN
    const user = new userModel({
      email: "test@test.fr"
    });

    // WHEN
    await user.save();

    // THEN
    expect(user.pre).toEqual("hello pre");
    expect(user.post).toEqual("hello post");
  });
});
```

#### Integration test

Just use the `TestContainersMongo.bootstrap` method to start the mongo server before your test:

```ts
beforeEach(() => TestContainersMongo.bootstrap(Server, {}));
```

### Mikro ORM

TestContainersMongo provides a method to get the connection options for MikroORM:

```ts
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {defineConfig} from "@mikro-orm/mongodb";
import {PlatformTest} from "@tsed/common";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

beforeEach(async () => {
  const mongoSettings = TestContainersMongo.getMongoConnectionOptions();
  const bstrp = PlatformTest.bootstrap(Server, {
    disableComponentScan: true,
    imports: [MikroOrmModule],
    mikroOrm: [
      defineConfig({
        clientUrl: mongoSettings.url,
        driverOptions: mongoSettings.connectionOptions,
        entities: [User],
        subscribers: [UnmanagedEventSubscriber1, new UnmanagedEventSubscriber2()]
      })
    ]
  });
});
```

## Contributors

Please read [contributing guidelines here](https://tsed.io/contributing.html)

<a href="https://github.com/tsedio/tsed/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2022 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.