/*!

 * sticky-form v0.0.1 (https://github.com/tjolin-awe/sticky-form)

 * Copyright (c) 2018 Thomas Jolin

 * Licensed under MIT (https://github.com/tjolin-awe/sticky-form/master/LICENSE)

 */



/**

 * @description Caches and restores form values for embedded mobile applications
 * @version 0.0.1
 * @author Thomas Jolin

 */﻿
if (typeof jQuery === 'undefined') {
    throw new Error('sticky-form requires the jQuery library.');
}



(function ($) {
    'use strict';
    $.fn.ApplicationCache = function (options) {

        if (!this.is('form')) {
            throw new Error('ApplicationCache only works when applied to a form element.');
        }

        if (localStorage == null) {
            console.log("ApplicationCache only works when local storage is available.");
            return null;
        }

        var $form = this;

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

        var GetField = function (element) {

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

        var SetField = function (element, value) {

           
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

        var LoadField = function (element) {
        
            var field = $form.id + '-' + $(element).data("cache");
            var value = localStorage.getItem(field);

            if (value != null) {
                SetField($(element), value);
                settings.onFieldRestored(field, value);
            }
        }

        var SetPage = function (page) {

            if (localStorage != null) {

                localStorage.setItem("page", page);
                window.location = page;
            }
        }

        var SaveField = function (element) {

            var field = $form.id + '-' + $(element).data("cache");
            var value = GetField($(element));

            if (value != null) {
                localStorage.setItem(field, value);
                settings.onFieldCached(field, value);
            }
        }

        var CallBack = function(element) {

            var id = '#' + $(element).attr('id');       
            var description = $(element).data('description');

            SaveField($(id));
            SaveField($(description));


            settings.onSuccess.call(element);

        }

        var SubmitChange = function (element) {

            var parameter = $(element).data('parameter');
            var id = '#' + $(element).attr('id');       

            
            if (parameter) {
                settings.onSubmit($(element), CallBack);
            }
            else {
                SaveField($(id));       // Save free field
            }
        }

        var ClearField = function (element) {
            var field = $(element).data("cache");
            localStorage.removeItem(field);
        }

        $(document).on('click', '.cached-field-clear', function (event) {


            var elements = $form.find("*").filter(function () {
                return $(this).data("cache") !== undefined;
            });

            $(elements).each(function () {
                ClearField($(this));
            });

            settings.onCacheCleared();
        });

        $form.on('change', '.cached-field', function (event) {
            SubmitChange($(this));
        });

        $form.on('blur', '.cached-field', function (event) {
            SubmitChange($(this));

            localStorage.SaveField($form.id);
        });

        if (settings.autorestore == true) {

            var elements = $(this).find("*").filter(function () {
                return $(this).data("cache") !== undefined;
            });

            $(elements).each(function () {
                LoadField($(this));
            });

            settings.onCacheRestored();
        }

        return this;
    };
}(jQuery));
