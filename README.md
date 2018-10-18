# sticky-form

This plugin caches and restores form fields in embedded web applications on apple devices.   

## Getting Started



### Prerequisites

sticky-form requires jQuery. 

```
<script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="crossorigin="anonymous"></script>
```

### Installing

Include the sticky-form plugin on you page 

```
<script src="scripts/sticky-form.js"></script>
```

Add the class "cached-field" and a "data-cache" attribute to each element you want to cache on the form

```
<input id="txtBranchName" class="cached-field" data-cache="branchname" />
```

To initialize the plug

```
  if ($('#myForm').length) {
       $('#myForm').StickyForm();
  }
```

see the [demo.html](demo.html) file for details




## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details




