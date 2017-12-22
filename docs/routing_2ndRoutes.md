# Secondary Routes

## Overview

* Using Secondary Routes
* Defining a Named RouterOutlet
* Configuring Secondary Routes
* Activating Secondary Routes
* Clearing Secondary Outlets

## When?

* Dashboard
* Multi-window user interface
* Notes or comments
* Messages

![](http://om1o84p1p.bkt.clouddn.com/1513947480.png?imageMogr2/thumbnail/!70p)

## Configuring secondary routes

```ts
RouterModule.forChild([
  {
    path: 'messages',
    component: MessageComponent,
    outlet: 'popup'
  }
])
```

## Activating Secondary Routes

Activate a secondary route using an object and setting its outlets property.

* Key: Outlet name
* Value: Link parameters array

Template:

```html
<a [routerLink]="[{ outlets: { popup: ['messages'] } }]">Messages</a>
<a [routerLink]="['/products', product.id, 'edit',
  { outlets: { popup: ['summary', product.id] } }]">Messages</a>
```

Component Class:

```ts
this.router.navigate([{ outlets: { popup: ['messages'] } }]);

this.router.navigate([
  '/products',
  product.id,
  'edit',
  { outlets: { popup: ['summary', product.id] } },
]);

this.router.navigate([
  {
    outlets: {
      primary: ['/products', product.id, 'edit'],
      popup: ['summary', product.id],
    },
  },
]);

this.router.navigateByUrl('/products/5/edit(popup:summary/5)');
```

## Clearing Secondary Outlets

Clear a secondary route using an object and setting its outlets property

* Key: Outlet name
* Value: null

Template:

```html
<a [routerLink]="[{ outlets: { popup: null } }]">x</a>
```

Component Class:

```ts
this.router.navigate([{ outlets: { popup: null } }]);
this.router.navigateByUrl('/login');
```

## Secondary Routes: Named RouterOutlet

```html
<div class="container">
  <router-outlet></router-outlet>
  <router-outlet name='popup'></router-outlet>
</div>
```