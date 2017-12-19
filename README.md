# Angular 5 Start

architect:

![architect](http://om1o84p1p.bkt.clouddn.com/1512908364.png?imageMogr2/thumbnail/!70p)

components:

![components](http://om1o84p1p.bkt.clouddn.com/1513671864.png?imageMogr2/thumbnail/!70p)

modules:

![modules](http://om1o84p1p.bkt.clouddn.com/1513671926.png?imageMogr2/thumbnail/!70p)

## TOC

* [scaffolding](./docs/cli_scaffolding.md)
* [test](./docs/test.md)
* [validation](./docs/validation.md)
* [react to changes](./docs/react_to_changes.md)
* [duplicate input element.md](./docs/duplicate_form_element.md.md)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.2.

## Start a new project

1. 环境准备：

    ```bash
    cnpm install -g @angular/cli
    npm list -g @angular/cli --depth=0
    ng set --global packageManager cnpm
    ```

1. 创建新的项目

    ```bash
    # 最常用
    ng new angular5-start [--routing --style scss --prefix myPrefixName --skip-install]

    ng new angular5-start [--skip-tests]
    ng new projectName [--dry-run] # 不创建文件，用于观看会产生什么文件
    ng new projectName [--skip-install]

    ng new --help
    ```

    项目会很快创建完成，接下来你会看到 `Installing packages for tooling via npm`。这里如果你选这了淘宝的cnmp镜像，应该最好在安装完全局Angular cli后设置一下，保证正常下载工具。`ng set --global packageManager cnpm`

1. 在项目中引入 bootstrap 3.3.7 和 jQuery

    ```bash
    cnpm install bootstrap --save
    cnpm install jquery --save

    yarn add bootstrap
    ```

    然后我们需要操作 `.angular-cli.json` 文件，把 bootstrap 和 jQuery 添加进去:

    如果使用cnpm：

    ![img](http://images2015.cnblogs.com/blog/1140602/201705/1140602-20170521135435088-196815303.png)

    使用 yarn 或者 npm：

    ```json
    "styles": [
      "../node_modules/bootstrap/dist/css/bootstrap.min.css",
      "styles.css"
    ],
    ```

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

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

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

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
