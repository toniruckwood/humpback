# humpback
Version 0.8.0

## What is it?
humpback is a JavaScript library for applying and managing CSS3 filters.


## Main features
* Just 1.8Kb minified.
* No dependancies.
* Add, remove, group, normalize and validate filters.
* Check for filter support.
* Select elements using CSS selector notation.
* Automatic handling of vendor prefixes.
* Use single or multiple filters.


## Getting started
Place the humpback directory in your preffered location and link to it from your document:

```html
<script src="/yourpath/humpback/js/humpback.min.js"></script>
```
Once you've done that just initiate humpback with:

```javascript
humpback.init();
```

Keep your applications loading and running as fast as possible, by only initiating humpback when you actually need it at DOM ready, window load or directly the first time you you need to use humpback.


## Applying filters
Apply filters to one or more target elements, using the **filter** method:

```javascript
humpback.filter ('[Target element(s)]', '[CSS Filter(s) and values]');
```

targeting your elements using CSS selector syntax:

```javascript
humpback.filter('#mainContent > ul li.active', 'blur(2px)');
```

Use single or multiple filters, seperating multiple filters with spaces:

```javascript
humpback.filter('#sidebar img', 'blur(2px) grayscale(100%) contrast(110%)');
```

When applying custom filter groups there's no need to supply the individual filters, just the group name:

```javascript
humpback.filter('ul > li', 'myGroup');
```

## Removing filters

Removing filters works in a similar manner as applying them. Call humpback.remove with elements you wish to remove filters from:

```javascript
humpback.remove ('[Target element(s)]');
```

```javascript
humpback.remove('#mainContent > ul li.active');
```

## Custom filter groups

Create custom filter groups by passing a name for the group and a space seperated list of filters you want to assign to the group.

```javascript
humpback.group('myGroup', 'grayscale(50%) blur(2px)');
```

Group names may only contain the characters a-z, 0-9 and -.

## Checking for support

Check for CSS3 filter support in the current browser with the boolean humpback.supported:

```javascript
if (humpback.supported) {
    //Do something with filters.
}
```

## Vendor prefixes

humpback automatically adds or deletes CSS vendor prefixes where needed. So, just use CSS compliant syntax and Humpack will take care of the prefixes.

You can use humpback.vendorPrefix to return a string containing any CSS vendor prefix required by the current browser e.g. Google's Chrome will return '-webkit-'.

## Validating filters

Pass a string containing one or more CSS3 filters to humpback.validate() and it'll return a boolean value for the validity of your filter e.g.

```javascript
humpback.validate('grayscale(50%) blur(2px)');
```

## Normalizing filters
You can normalize filters, removing excess white space and vendor prefixes by using humpback.normalize:

```javascript
humpback.normalize('grayscale(50%)  -webkit-blur(2px) ');
```

will return the string 'grayscale(50%) blur(2px)'

## Still todo

* Refactor.
* Demo.
* Tests.


## Copyright and license

Copyright 2015 Toni Ruckwood. Licensed under the Apache License, Version 2.0.
