# Code scaffolding

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
