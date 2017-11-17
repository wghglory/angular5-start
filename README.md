# Angular5Start

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

---

1. 环境准备：

    ```bash
    cnpm install -g @angular/cli
    ng set --global packageManager cnpm
    ```

1. 创建新的项目

    ```bash
    ng new angular5-start
    ```

    项目会很快创建完成，接下来你会看到 `Installing packages for tooling via npm`。这里如果你选这了淘宝的cnmp镜像，应该最好在安装完全局Angular cli后设置一下，保证正常下载工具。`ng set --global packageManager cnpm`

1. 在项目中引入bootstrap和jQuery

    ```bash
    cnpm install bootstrap --save
    cnpm install jquery --save
    ```

    然后我们需要操作.angular-cli.json文件，把bootstrap和jQuery添加进去:

    ![img](http://images2015.cnblogs.com/blog/1140602/201705/1140602-20170521135435088-196815303.png)

    > 因为angular用的是微软开发的typescript语言，我们需要在终端做下面的操作，以便让typescript认识bootstrap和jQuery一些字符（比如jQuery的$）：

    ```bash
    cnpm install @types/bootstrap --save-dev
    cnpm install @types/jquery --save-dev
    ```

1. 项目的启动

    ```bash
    ng serve
    # or
    npm start
    ```

    这两个的默认端口都是4200。也可以修改默认的端口: `ng serve -p 3000`

1. 最后项目的打包

    ```bash
    ng build
    ```