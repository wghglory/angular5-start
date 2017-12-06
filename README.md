# Angular5Start

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

```bash
# component
ng g c customer [-d] # customer.component.ts, -d is short for --dry-run so we can see results.

# directives, will be added into DECLARATIONS in app.module.ts
ng g d search-box  # search-box.directive.ts, this will be created at the same level of app.module.ts
ng g d search-box --flat false -d  # create search-box folder

# service, will be added into PROVIDERS in app.module.ts
ng g s user  # create user.service.ts at the same level of app.module.ts, BUT NOT REGISTERED IT since CLI is not sure which module needs it (WARNING)

## if we know which module needs the service, we can point it out. Below injects user service into app.module
ng g s user -m app.module

# class
ng g cl models/customer

# interface
ng g i models/customer

# enum
ng g e models/gender

# pipe, will be added into DECLARATIONS in app.module.ts
ng g p shared/hello  # in shared folder, hello.pipe.ts

# module
ng g m login  # NEED TO MANUALLY ADD MODULE TO app.module.
ng g c login  # this will automatically add loginComponent to app.module
ng g c login -m login/login.module  # add loginComponent to login.module !!!
ng g c login/login  # add loginComponent to login folder's login.module !!!

# guard
ng g guard auth
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

```bash
npm i source-map-explorer --save-dev

# to see the detail of our app code
./node_modules/.bin/source-map explorer dist/main.bundle.js
```

Build | `ng build` | `ng build -prod`
---------|----------|---------
 Environment | environment.ts | environment.prod.ts
 Cache-busting | only images references in css | all files build
 source-map | yes | no
 extracted css | css to js | yes, css is css
 Uglification | no | yes
 tree-shaking | no | yes
 AOT | no | yes

> add source-map in production build, rarely used, but it can check the final code detail with `source-map-explorer`

```bash
ng build --prod -sm
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

`router-link` 如果不能被识别，如下处理

```diff
+ import { NO_ERRORS_SCHEMA } from '@angular/core'

beforeEach(async()=>{
  TestBed.configureTestingModule({
    imports: [
      RouterTestingModule
    ],
+    schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();
})
```

### code coverage

```bash
ng test --code-coverage --colors --progress --watch --sourcemaps
ng test -sr # good for CI server(single-run)

ng test --cc # code coverage
```

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

---

1. 环境准备：

    ```bash
    cnpm install -g @angular/cli
    npm list -g @angular/cli --depth=0
    ng set --global packageManager cnpm
    ```

1. 创建新的项目

    ```bash
    ng new angular5-start [--routing --style scss --prefix myPrefixName]
    ng new angular5-start [--skip-tests]
    ng new projectName [--dry-run] # 不创建文件，用于观看会产生什么文件
    ng new projectName [--skip-install]

    ng new --help
    ```

    项目会很快创建完成，接下来你会看到 `Installing packages for tooling via npm`。这里如果你选这了淘宝的cnmp镜像，应该最好在安装完全局Angular cli后设置一下，保证正常下载工具。`ng set --global packageManager cnpm`

1. 在项目中引入 bootstrap 和 jQuery

    ```bash
    cnpm install bootstrap --save
    cnpm install jquery --save
    ```

    然后我们需要操作 `.angular-cli.json` 文件，把 bootstrap 和 jQuery 添加进去:

    ![img](http://images2015.cnblogs.com/blog/1140602/201705/1140602-20170521135435088-196815303.png)

    > 因为 angular 用的是微软开发的 typescript，我们需要在终端做下面的操作，以便让 typescript 认识 bootstrap 和 jQuery 一些字符（比如jQuery的$）：

    ```bash
    cnpm install @types/bootstrap --save-dev
    cnpm install @types/jquery --save-dev
    ```

1. 项目的启动

    ```bash
    ng serve -o   # open default browser
    # or
    npm start
    ```

    这两个的默认端口都是4200。也可以修改默认的端口: `ng serve -p 3000`

1. 最后项目的打包

    ```bash
    ng build
    ```

### setting angular cli's config

```bash
ng set defaults.styleExt scss [-g]
```

### linting

```bash
ng lint
ng lint [--help]
ng lint [--format stylish]
ng lint [ --fix]
```

## Routing

创建项目时候自动创建 app-routing module，并引入到了 app.module:

```bash
ng new project --routing
```

app-routing.module.ts demo:

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterListComponent } from './characters/character-list.component';
import { CharacterComponent } from './characters/character.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { VehicleListComponent } from './vehicles/vehicle-list.component';
import { VehicleComponent } from './vehicles/vehicle.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'characters', },
  { path: 'characters', component: CharacterListComponent },
  { path: 'characters/:id', component: CharacterComponent },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicles/:id', component: VehicleComponent },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routableComponents = [
  CharacterListComponent,
  CharacterComponent,
  VehicleListComponent,
  VehicleComponent,
  PageNotFoundComponent
];
```

### Nested routing

1. 创建 admin module 和 admin-routing module。admin module 引入了 admin-routing module
1. 创建 email component 并把它注册到 admin module
1. 手动把 admin module 添加到 app module

```bash
ng g m admin --routing  # admin.module.ts and admin-routing.module.ts
ng g c admin/email  # note this will add email into admin.module
```

> admin-routing 是一个 nested routing。

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: CharacterListComponent,
    children: [
      { path: '', component: PageNotFoundComponent },
      { path: 'email', component: EmailComponent },
   ]
  }
];
```

> 项目中 app-routing 为什么要指向某个 module？
