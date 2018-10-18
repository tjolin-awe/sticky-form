/*!

 * sticky-form v0.0.1 (https://github.com/tjolin-awe/sticky-form)

 * Copyright (c) 2018 Thomas Jolin

 * Licensed under MIT (https://github.com/tjolin-awe/sticky-form/master/LICENSE)

 */

if (typeof jQuery === 'undefined') {
    throw new Error('"StickyForm" requires the jQuery library.');
}



(function ($) {
    'use strict';
    $.fn.StickyForm = function (options) {

        if (!this.is('form')) {
            throw new Error('"StickyForm" only works when applied to a form element.');
        }

        if (localStorage == null) {
            console.log('"StickyForm" only works when local storage is available.');
            return;
        }

        var $form = $(this);

        var page = localStorage.getItem("page");


        if (page !== null) {
            if (page !== window.location.href) {
                window.location = page;
            }
        }

        var defaults = {
            autorestore: true,
            onCacheRestored: function () { return; },
            onCacheCleared: function () { return; },
            onFieldCached: function () { return; },
            onFieldRestored: function () { return; },
            onSubmit: function () { return; },
            onSuccess: function () { return; },
            onFail: function () { return; }
        };

        var settings = $.extend(true, defaults, options);


        function translateField(element) {

            console.log($(element).data("cache"));
            return $form.attr('id') + '-' + $(element).data("cache");

        }


        function getFieldValue(element) {

            if (!$(element))
                return;

            if ($(element).is('input')) {

                if ($(element).attr('type') == "checkbox") {
                    return $(element).prop('checked');
                }
                else {
                    return $(element).val();

                }
            }

            if ($(element).is('textarea')) {

                return element.val();
            }
            if ($(element).is('select')) {
                return $(element).val();
            }

            if ($(element).is('span')) {

                return $(element).text();
            }



            throw new Error("Unsupported field type!" + $(element).attr('type'));

        }

        function setFieldValue(element, value) {

            if ($(element).is('input')) {

                if ($(element).attr('type') == "checkbox") {
                    $(element).prop('checked', value);
                    return true;
                }
                else {
                    $(element).val(value);
                    return true;
                }
            }
            if ($(element).is('textarea')) {
                $(element).val(value).trigger('change');
                return true;
            }
            if ($(element).is('select')) {
                $(element).val(value).trigger('change');
                return true;
            }
            if ($(element).is('span')) {
                $(element).text(value);
                return true;
            }

            return false;
        }

        var RestoreField = function (element) {

            var field = translateField(element);
            var value = localStorage.getItem(field);

            if (value != null) {
                setFieldValue($(element), value);
                settings.onFieldRestored(field, value);
            }
        }

        var SetPage = function (page) {

            localStorage.setItem("page", page);
        }

        var CacheField = function (element) {

            SetPage(window.location);

            var field = translateField(element);
            var value = getFieldValue(element);

            if (value != null) {
                localStorage.setItem(field, value);
                settings.onFieldCached(field, value);
            }
        }

        var CallBack = function (element) {

            var id = '#' + $(element).attr('id');
            var description = $(element).data('description');

            CacheField($(id));
            CacheField($(description));


            settings.onSuccess.call(element);

        }

        function submitChange(element) {

            var parameter = $(element).data('parameter');
            var id = '#' + $(element).attr('id');


            if (parameter) {
                settings.onSubmit($(element), CallBack);
            }
            else {
                CacheField($(id));       // Save free field
            }
        }

        var ClearField = function (element) {

            localStorage.removeItem(translateField(element));
        }

        var ClearFormCache = function () {



            var elements = $form.find("*").filter(function () {
                return $(this).data("cache") !== undefined;
            });

            $(elements).each(function () {
                ClearField($(this));
            });


            console.log('clearing form tag');
            localStorage.removeItem('page');

            settings.onCacheCleared();
        }


        $(document).on('click', '.cached-field-clear', function (event) {

            ClearFormCache();
        });

        $form.on('change', '.cached-field', function (event) {
            submitChange($(this));
        });

        $form.on('blur', '.cached-field', function (event) {
            submitChange($(this));
        });

        if (settings.autorestore == true) {

            var elements = $(this).find("*").filter(function () {
                return $(this).data("cache") !== undefined;
            });

            $(elements).each(function () {
                RestoreField($(this));
            });

            settings.onCacheRestored();
        }


        // clear cache on unload
        window.onbeforeunload = function (e) {
            ClearFormCache();

        }


        $form.on('submit', function () {
            ClearFormCache();
        });


        var a = document.getElementsByTagName("a");
        for (var i = 0, len = a.length; i < len; i++) {
            if (a[i].getAttribute("href")) {
                a[i].onclick = function () {

                    ClearFormCache();
                    window.location = this.getAttribute("href");
                    return false;
                }
            }
        }

        var addToPostBack = function (func) {
            var previous__doPostBack = __doPostBack;
            if (typeof __doPostBack != 'function') {
                __doPostBack = func;
            } else {
                __doPostBack = function (t, a) {
                    if (func(t, a)) previous__doPostBack(t, a);
                }
            }
        };

        addToPostBack(function (t, a) {
            ClearFormCache();
        });


        page = null;
        return this;
    };
}(jQuery));