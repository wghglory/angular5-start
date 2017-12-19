# Test

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
