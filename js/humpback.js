/*
* humpback.
*
* @author			: Toni Ruckwood
* @version			: 0.8.0
* @create date		: 01 Feb 2016
* @modified date	: 
*/


'use strict';

var humpback = {
    
    supported : false,      /* CSS3 filter support. */
    vendorPrefix : '',      /* Vendor prefix string to be used. */
    filterGroup : {},       /* Custom filter groups. */

    /* Normalize the filter. */
    normalize : function (filterString) {
        
        /* Replace one or more whitespace characters with a single space. */
        filterString = filterString.replace(/\s+/g, ' ');

        /* Remove any space before the opening parenthesis. */
        filterString = filterString.replace(/ \(/g, '(');

        /* Trim excess whitespace at either end and convert to lower-case. */
        filterString = filterString.replace(/^ ?(.*?) ?$/, '$1').toLowerCase();

        /* Remove any vendor prefixes. */
        filterString = filterString.replace(/\-(?:moz|ms|o|webkit)\-/g, '');

        return (filterString);
    },


    /* Validate the filter against CSS3 syntax. */
    valid : function (filterString) {
        
        var filterList = filterString.split(' '),
            counter = 0,
            i,
            j;
        
        for (i = 0, j = filterList.length; i < j; i += 1) {
            if (/^(?:blur|brightness|contrast|grayscale|hue\-rotate|invert|opacity|saturate|sepia)\([0-9\.]+ ?(?:%|deg|px)?\)$/.test(filterList[i])) {
                counter += 1;
            } else if (/^drop-shadow\([a-z0-9\.\(\)#,%]*\)$/.test(filterList[i])) {
                counter += 1;
            } else if (/^url\([a-z0-9\-\._~\:\/\?#\[\]@\!\$&'\(\)\*\+,;=%]+\)$/.test(filterList[i])) {
                counter += 1;
            } else {
                return false;
            }
        }
        
        /* If the counter is less than the number of filters then we obviously have an invalid filter. */
        if (counter < filterList.length) {
            return false;
        }
        
        return true;
    },


    /* Create a custom filter group. */
    group : function (groupName, filterString) {
        
        /* Keep the filter group names simple by allowing only alpha numeric characters and hyphens. */
        groupName = groupName.replace(/[^a-z0-9\-]/ig, '');

        /* Normalize the filter group string. */
        filterString = humpback.normalize(filterString);

        /* If the filter is valid then add it to the filter group object. */
        if (humpback.valid(filterString)) {
            humpback.filterGroup[groupName] = filterString;
        }
    },

    
    /* Apply the filter. */
    filter : function (objectName, filterName) {
        
        var filterString = humpback.normalize(filterName),
            objects = document.querySelectorAll(objectName), /*By using querySelectorAll, even for single elements, we create an array for everything that is passed through.*/
            i,
            j,
            filterString,
            currentStyle;

        /*All CSS3 filters passed through contain the filter attributes, whereas our filter groups are just passed as a name. So, we need to identify them and retrieve the relevant filter attributes for them.*/
        if (filterString.indexOf('(') === -1) {
            filterString = humpback.filterGroup[filterString];
        }

        for (i = 0, j = objects.length; i < j; i += 1) {
            filterString = humpback.vendorPrefix + 'filter:' + filterString;

            /*If the current element has any existing inline styles then retrieve them and separate them from our filter with a space.*/
            currentStyle = objects[i].getAttribute('style');
            if (currentStyle !== null) {
                /*If any filters have already been added then remove them first.*/
                humpback.remove(objectName);
                currentStyle = objects[i].getAttribute('style') + ' ';
            } else {
                currentStyle = '';
            }
            objects[i].setAttribute('style', currentStyle + filterString);
        }

    },

    
    /* Remove the filter. */
    remove : function (elements) {
        
        var targetElements = document.querySelectorAll(elements),
            i,
            j,
            targetElementStyle,
            filterString;

        for (i = 0, j = targetElements.length; i < j; i += 1) {

            /*Get the current element's style attribute*/
            targetElementStyle = targetElements[i].getAttribute('style');

            /*If the element has a style attribute then remove any CSS filters, leaving non-CSS filter styles intact*/
            if (targetElementStyle !== 'undefined') {
                filterString = humpback.vendorPrefix + 'filter:';
                targetElementStyle = targetElementStyle.replace(filterString, '');
                targetElementStyle = targetElementStyle.replace(/(?:blur|brightness|contrast|drop\-shadow|grayscale|hue\-rotate|invert|opacity|saturate|sepia|url) ?\(.*?\);?/g, '');
                targetElementStyle = targetElementStyle.replace(/ {2,}/, ' ');
                targetElements[i].setAttribute('style', targetElementStyle);
            }

        }

    },


    init : function () {
        
        /*Test filter support by creating a temporary element, adding a filter style, adding it to the DOM (it appears you need to do this for getComputedStyle to work) and reading back the style attributes*/

        var htmlElement = document.getElementsByTagName('html')[0],
            testElement = document.createElement('span');
        
        testElement.id = 'filterTest';

        /*Add both the W3C and Webkit versions of the test filter*/
        testElement.style.filter = 'grayscale(1)';
        testElement.style.webkitFilter = 'grayscale(1)';

        /*Add the test element to the DOM. Use the HTML element as it's the only one we can be sure is there without checking*/
        htmlElement.appendChild(testElement);

        /*Check the test element for the filter, updating the 'supported' variable and vendor prefix where applicable*/
        if (window.getComputedStyle(testElement).filter !== 'none') {
            humpback.supported = true;
        } else if (window.getComputedStyle(testElement).webkitFilter !== 'none') {
            humpback.supported = true;
            humpback.vendorPrefix = '-webkit-';
        }

        /*Remove the test element from the DOM*/
        htmlElement.removeChild(testElement);

    }

};
