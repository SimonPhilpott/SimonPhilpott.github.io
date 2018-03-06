//06-02-18 with added split categories '/'

//URL globals
var loc = window.location.toString();
var URLpath = window.location.pathname.toString();
var URLfilter = loc.split('&');
//Content table globals 
var docTable = document.querySelectorAll("div.filter-wrap")[0].getElementsByTagName("table")[0];
var docTableRows = docTable.getElementsByTagName("tr");
var cellBreaks = docTable.getElementsByTagName("br"),
    index;
var filterArray = [];
var docColumn = false;
var descColumn = false;

// JavaScript base class functions
function addClasses(el, cls) {
    for (var i = 0; i < el.length; ++i) {
        if (!el[i].className.match('(?:^|\\s)' + cls + '(?!\\S)')) { el[i].className += ' ' + cls; }
    }
}

function removeClasses(el, cls) {
    for (var i = 0; i < el.length; ++i) {
        el[i].className = el[i].className.replace(new RegExp('(?:^|\\s)' + cls + '(?!\\S)'), '');
    }
}

// *FIX*  Remove the Lotus Notes BR tags from table cells which breaks functionality.
for (index = cellBreaks.length - 1; index >= 0; index--) {
    cellBreaks[index].parentNode.removeChild(cellBreaks[index]);
}

//Build the required elements
(function createPrerequisiteElems() {
    noFilter = document.createElement('div');
    noFilter.className = 'filter-no-item';
    noFilter.innerText = "Sorry, no items match your filter selection(s).";
    filterMask = document.createElement('div');
    filterMask.className = 'filter-mask';
    docTable.parentNode.appendChild(noFilter);
    docTable.parentNode.appendChild(filterMask);
})();

//Scan the target table and build the global variables
(function scanTable() {
    var columns = docTable.getElementsByTagName("th");
    var cells = docTable.getElementsByTagName("td");
    for (var i = 0; i < cells.length; ++i) {
        cellImg = cells[i].getElementsByTagName("img")[0];
        //*FIX* Columns do not require img gifs to size column widths - as per loutus notes output as this is made within the table head, removed as this was breaking the string capture
        //cellImg.style.marginLeft = "-5px";
        cellImg.style.display = "none"; // this removes the gif that Lotus notes tables add when sizing table columns by using a gif image?!?!?. 
    }
    for (var i = 0; i < columns.length; ++i) {
        if (typeof String.prototype.trim != 'function') { // detect native implementation of trim()
            String.prototype.trim = function() {
                return this.replace(/^\s+/, '').replace(/\s+$/, '');
            };
        }
        var columnTitles = columns[i].outerText.replace(/&/g, "and").replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        columnTitles = columnTitles.trim().replace(/ /g, "_");
        //*FIX* Table head text syntax now matches between IE and Chrome due to different interpretations of Lotus notes HTML output
        filterArray.push(columnTitles);
        // removeItem function not needed replaced with a general stronger scan for the prescence of the document title or description columns using docColumn/descColumn true/false

        window[filterArray[i] + "Array"] = [];
        window[filterArray[i] + "Container"] = document.querySelectorAll("span#" + filterArray[i] + "Checkboxes")[0];
    }
    for (var i in filterArray) { // Runs a check for a Document title and description column
        if (filterArray[i] == 'Document') {
            filterArray.splice(i, 1);
            docColumn = true
        }
        if (filterArray[i] == 'Description') {
            filterArray.splice(i, 1);
            descColumn = true
        }

        window.resetURLFilter = "?OpenDocument&" + filterArray.join('&').toString().replace(/&Client/g, "").replace(/&Dates/g, "");
        break;
    }
})();
// can't instate until the arrays syntax matches between IE and Chrome
//Add the URL string to provide the option to filter via URL
(function setURL() {
    if (document.location.href.indexOf("?OpenDocument") > -1) {
        //Do nothing, the URL filter syntax is already part of the URL
    } else {
        location.replace(URLpath + resetURLFilter);
    }
})();

function checkState(checkbox) { // Disables and fades un-selectable checkboxes, then re-enables if de-selected
    var checkboxContainers = checkbox.parentNode.parentNode.getElementsByClassName("inputContainer");
    if (checkbox.checked) {
        for (i = 0; i < checkboxContainers.length; ++i) {
            var allCheckboxes = checkboxContainers[i].getElementsByTagName("input")[0];
            checkboxContainers[i].style.opacity = "0.5";
            allCheckboxes.setAttribute('disabled', 'disabled');
        };
        checkbox.parentNode.style.opacity = "1";
        checkbox.removeAttribute('disabled');
    } else {
        for (i = 0; i < checkboxContainers.length; ++i) {
            var allCheckboxes = checkboxContainers[i].getElementsByTagName("input")[0];
            checkboxContainers[i].style.opacity = "1";
            allCheckboxes.removeAttribute('disabled');
        };
    }
}
filterNameArray = [];

function makeCheckbox(filterName, inCategory, checkedStatus) { /*filterName = columnArray[l], inCategory = categoryContainer[l+1], checkedStatus = true/false*/
    if (filterNameArray.indexOf(filterName) === -1) {
        filterNameArray.push(filterName);
        inputContainer = document.createElement('span');
        inputContainer.setAttribute("class", "inputContainer");
        inputContainer.setAttribute("id", filterName + "Container");
        if (inputContainer.id == "Container") {
            inputContainer.style.display = "none";
        }
        newfilter = document.createElement('input');
        newfilter.setAttribute("type", "checkbox");
        newfilter.setAttribute("id", filterName);
        newfilter.setAttribute("name", filterName + "-filter");
        newfilter.setAttribute("class", "filter-input");
        newfilter.setAttribute("onclick", "checkState(this)")
        newfilter.checked = checkedStatus;
        var filterLabel = document.createElement('label');
        var filterLabelFor = filterName;
        if (typeof String.prototype.trim != 'function') { // detect native implementation of trim()
            String.prototype.trim = function() {
                return this.replace(/^\s+/, '').replace(/\s+$/, '');
            };
        }
        filterLabelFor = filterLabelFor.trim();
        filterLabel.setAttribute("for", filterLabelFor);
        filterLabel.setAttribute("class", "filter-label");
        filterLabel.innerText = filterName.replace(/_/g, " ");
        if (filterLabel.innerText == "Turner and Townsend") {
            filterLabel.innerText = "Turner & Townsned";
        }
        inCategory.appendChild(inputContainer);
        inputContainer.appendChild(newfilter);
        inputContainer.appendChild(filterLabel);
        var theFor = filterLabel.getAttribute("for");
        var theForNum = theFor.match(/\d+/g);
        var forFirstChar = theFor.charAt(0);
        if (forFirstChar.search(/\d+/g) != -1) {
            filterLabel.setAttribute("for", "num" + theForNum[0]);
        }
    }
}
//Inclusive or Exclusive filter function
function contentFilter(filterID, filterType) {
    filterTarget = filterID;
    // create the filter category group titles, containers and checkboxes
    var filterCategories = document.createElement('span');
    var showHideFilterBtn = document.createElement('a');
    var appliedFilter = document.createElement('div');
    appliedFilter.setAttribute("id", "appliedFilterList");
    showHideFilterBtn.setAttribute("class", "button cyan downArrow");
    showHideFilterBtn.setAttribute("title", "show/hide the table filter options");
    showHideFilterBtn.setAttribute("style", "width:220px; margin-bottom:5px;");
    showHideFilterBtn.setAttribute("id", "hideShowTableFilters");
    showHideFilterBtn.setAttribute("onclick", "toggleFilterButton(this); showHideDocFilter()");
    showHideFilterBtn.innerHTML = "Show the resource table filters<span></span>";
    filterCategories.setAttribute("class", "filter-categories");
    filterCategories.setAttribute("id", "filterOptions");
    filterCategories.style.display = "block";
    filterCategories.style.overflow = "hidden";
    filterCategories.style.height = "0";
    var targetID = document.getElementById(filterID.replace(/#/g, ""));
    targetID.insertBefore(filterCategories, targetID.firstChild); // Create the category container as the first element within the selected filterID, above the content to be filtered
    targetID.insertBefore(showHideFilterBtn, targetID.firstChild);
    targetID.insertBefore(appliedFilter, targetID.firstChild);
    //targetID.insertBefore(appliedFilter, showHideFilterBtn.nextSibling);
    document.querySelector(filterTarget + ' .filter-categories').onclick = filterContent; //If a checkbox is clicked, populate the filter array

    // create a checkbox container
    var checkboxContainer = document.createElement('span');
    checkboxContainer.setAttribute("class", "checkboxContainer");
    filterCategories.appendChild(checkboxContainer);
    // create a filter title
    var filterGroup = document.createElement('span');
    filterGroup.setAttribute("class", "filterGroup");
    checkboxContainer.appendChild(filterGroup);
    filterGroup.innerText = "None";
    //create the checkbox and label container	
    var inputContainer = document.createElement('span');
    inputContainer.setAttribute("class", "inputContainer");
    checkboxContainer.appendChild(inputContainer);
    // create the reset filter checkbox
    var filterAll = document.createElement('input');
    filterAll.setAttribute("type", "checkbox");
    filterAll.setAttribute("id", "filter-all");
    filterAll.setAttribute("name", "filter-1");
    filterAll.setAttribute("class", "filter-input filter-all");
    filterAll.checked = true;
    inputContainer.appendChild(filterAll);
    var filterAllLabel = document.createElement('label');
    filterAllLabel.setAttribute("for", "filter-all");
    filterAllLabel.setAttribute("class", "filter-label");
    filterAllLabel.innerText = "Reset filter";
    inputContainer.appendChild(filterAllLabel);
    //create the category checkboxes
    var inputContainer, newFilter;
    (function setCategoryTitleWidths() {
        var filterGroups = document.querySelector(filterTarget + ' .filterGroup');
        var maxWidth = 0;
        for (i = 0; i < filterGroups.length; ++i) {
            maxWidth = Math.max(maxWidth, filterGroups[i].offsetWidth)
        };
        for (i = 0; i < filterGroups.length; ++i) {
            filterGroups[i].style.width = maxWidth + "px";
        };
    });
    for (var i = 0; i < filterArray.length; ++i) {
        var newCheckboxContainer = checkboxContainer.cloneNode(true);
        filterCategories.appendChild(newCheckboxContainer);
        var checkboxContainerID = filterArray[i] + "Checkboxes";
        newCheckboxContainer.setAttribute("id", checkboxContainerID);
        var filterTitle = newCheckboxContainer.querySelectorAll("span")[0];
        filterTitle.innerText = filterArray[i].replace(/_/g, " ");
        //remove the reset filter checkbox from the set of checkboxes
        var resetCheckboxDuplicate = newCheckboxContainer.querySelectorAll("span.inputContainer")[0];
        resetCheckboxDuplicate.parentNode.removeChild(resetCheckboxDuplicate);
    }
    var categoryContainer = document.getElementsByClassName("checkboxContainer");
    var columnArray;
    for (var j = 1, row; row = docTable.rows[j]; j++) { // loop through all table rows, except for the table header
        row.className += "filter-item"; //  add the base row filter class
        var k = 0; // If the document title or description columns exists then skip the column to compile the row class name list
        if (docColumn == true) {
            k++;
        }
        if (descColumn == true) {
            k++;
        }

        for (var col; col = row.cells[k]; k++) { // loop through all cells for each row APART FROM FIRST TWO, DOC NAME AND DESCRIPTION (NOT NEEDED);
            if (typeof String.prototype.trim != 'function') { // detect native implementation of trim()
                String.prototype.trim = function() {
                    return this.replace(/^\s+/, '').replace(/\s+$/, '');
                };
            }
            var rowClassName = col.innerText;
            rowClassName = rowClassName.trim();
            row.className += " " + rowClassName.replace(/ /g, "_").replace(/&/g, "and").replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\]/gi, ''); // apply the filterable classes to each row (i.e. the cell content)
        }
        columnArray = (row.className.replace(/filter-item/g, "").replace(/(^[\s]+|[\s]+$)/g, "").split(" ")); //create new arrays using the table row content		
        for (var l = 0; l < columnArray.length; ++l) {
            //console.log("Row classes " + columnArray[l]);
            if (columnArray[l].indexOf("/") !== -1) {
                var categorySplit = columnArray[l].split("_/_");
                for (var m = 0; m < categorySplit.length; ++m) {
                    var category = categorySplit[m];
                    makeCheckbox(categorySplit[m], categoryContainer[l + 1], false);
                    row.className = row.className.replace(/_\/_/g, " ");
                }
            } else {
                makeCheckbox(columnArray[l], categoryContainer[l + 1], false);
            }
        }

    }
    /*NEW POSITION*/
    for (var m = 0; m < categoryContainer.length; ++m) {
        if (categoryContainer[m].id == "SectorCheckboxes") {
            var sectorNodes = categoryContainer[m].childNodes;
            for (var n = 0; n < sectorNodes.length; ++n) {
                if (sectorNodes[n].id == "MultiContainer") {
                    if (sectorNodes[n].id != "InfrastructureContainer") {
                        makeCheckbox("Infrastructure", categoryContainer[m], false)
                    }
                    if (sectorNodes[n].id != "Real_estateContainer") {
                        makeCheckbox("Real_estate", categoryContainer[m], false)
                    }
                    if (sectorNodes[n].id != "Natural_ResourcesContainer") {
                        makeCheckbox("Natural_resources", categoryContainer[m], false)
                    }
                }
            }
        } else
        if (categoryContainer[m].id == "RegionCheckboxes") {
            categoryContainer[m].getElementsByClassName("filterGroup")[0].id = "regionTitleGroup";
            var regionNodes = categoryContainer[m].getElementsByClassName("inputContainer");
            var sortOrder = ["North_AmericaContainer", "Latin_AmericaContainer", "UK_and_IrelandContainer", "EuropeContainer", "AfricaContainer", "Middle_EastContainer", "AsiaContainer", "Australia_and_New_ZealandContainer"];
            for (var p = 0; p < regionNodes.length; ++p) {
                if (regionNodes[p].id == "GlobalContainer") {
                    if (regionNodes[p].id != "North_AmericaContainer") {
                        makeCheckbox("North_America", categoryContainer[m], false)
                    }
                    if (regionNodes[p].id != "Latin_AmericaContainer") {
                        makeCheckbox("Latin_America", categoryContainer[m], false)
                    }
                    if (regionNodes[p].id != "UK_and_IrelandContainer") {
                        makeCheckbox("UK_and_Ireland", categoryContainer[m], false)
                    }
                    if (regionNodes[p].id != "EuropeContainer") {
                        makeCheckbox("Europe", categoryContainer[m], false)
                    }
                    if (regionNodes[p].id != "AfricaContainer") {
                        makeCheckbox("Africa", categoryContainer[m], false)
                    }
                    if (regionNodes[p].id != "Middle_EastContainer") {
                        makeCheckbox("Middle_East", categoryContainer[m], false)
                    }
                    if (regionNodes[p].id != "AsiaContainer") {
                        makeCheckbox("Asia", categoryContainer[m], false)
                    }
                    if (regionNodes[p].id != "Australia_and_New_ZealandContainer") {
                        makeCheckbox("Australia_and_New_Zealand", categoryContainer[m], false)
                    }
                }
            }
            var regionArray = Array.prototype.slice.call(regionNodes);
            regionArray.sort(function(a, b) {
                return sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id);

            });
            for (var r = 0; r < regionArray.length; ++r) {
                categoryContainer[m].appendChild(regionArray[r]);
            }
        } else
            var sortedDates;
        if (categoryContainer[m].id == "DatesCheckboxes") { //Unused date sorting, commented out because date is not an unwanted filter category
            /*var dateNodes = categoryContainer[m].childNodes;
            var dateArray = Array.prototype.slice.call( dateNodes );
            dateNodes = dateArray.sort(function(a, b) {
                return a.id.localeCompare(b.id);
            });
            for (var q = 0; q < dateArray.length; ++q){
            	categoryContainer[m].appendChild(dateArray[q]);
            }*/
            categoryContainer[m].style.display = "none";
        }
        if (categoryContainer[m].id == "ClientCheckboxes") {
            categoryContainer[m].style.display = "none";
        }

    }
    /*END NEW POSITION*/
    var inputContainers = document.querySelectorAll(filterTarget + ' .inputContainer');
    var checkboxContainer = document.querySelectorAll(filterTarget + ' .checkboxContainer');
    var theFilters = document.querySelectorAll(filterTarget + ' .filter-input');
    var theLabels = document.querySelectorAll(filterTarget + ' .filter-label');

    function replaceNum(theElements) {
        for (var i = 0; i < theElements.length; ++i) { //if the ID or Class of the elements contain numbers, add "num" in front of the number
            var theID = theElements[i].id;
            var theClass = theElements[i].className;
            var theClassSplit = theClass.split(" ");
            var theIdNum = theID.match(/\d+/g);
            var idFirstChar = theID.charAt(0);
            if (idFirstChar.search(/\d+/g) != -1) {
                theElements[i].id = theElements[i].id.replace(theIdNum[0], "num" + theIdNum[0]);
            }
            for (var j = 0; j < theClassSplit.length; ++j) {
                var theClassNum = theClassSplit[j].match(/\d+/g);
                var classFirstChar = theClassSplit[j].charAt(0);
                if (classFirstChar.search(/\d+/g) != -1) {
                    theElements[i].className = theElements[i].className.replace(theClassNum[0], "num" + theClassNum[0]);
                }
            }
        }
    }

    replaceNum(inputContainers);
    replaceNum(theFilters);
    replaceNum(theLabels);
    replaceNum(docTableRows);

    function overpopulateRegionSector(theElements) {
        for (var i = 0; i < theElements.length; ++i) {
            if (theElements[i].className.indexOf("Multi") > -1) {
                theElements[i].className += " Real_estate Infrastructure Natural_resources";
            }
            if (theElements[i].className.indexOf("Global") > -1) {
                theElements[i].className += " North_America Latin_America UK_and_Ireland Europe Africa Middle_East Asia Australia_and_New_Zealand";
            }
        }
    }
    overpopulateRegionSector(docTableRows);
    var checkboxes = document.querySelectorAll(filterTarget + ' .filter-input'); // Checkbox click event
    for (var i = 1; i < URLfilter.length; ++i) { // Check the URL for filter matches and apply
        for (var j = 1; j < checkboxes.length; ++j) { // ignore the reset checkbox
            if (URLfilter[i] == (checkboxes[j].id)) {
                checkboxes[j].click();
            }
        }
    }
    // filter function applied by class
    function filterContent(evt) {
        evt = evt || window.event;
        var elem = evt.target || evt.srcElement,
            wrap = document.querySelectorAll(filterTarget + ' .filter-wrap'),
            items = document.querySelectorAll(filterTarget + ' .filter-item'),
            inputs = document.querySelectorAll(filterTarget + ' .filter-input'),
            filters = [],
            noitem = document.querySelectorAll(filterTarget + ' .filter-no-item'),
            mask = document.querySelectorAll(filterTarget + ' .filter-mask');
        addClasses(mask, 'filter-mask-active');
        (function() {
            removeClasses(mask, 'filter-mask-active');
        })();


        if (elem.className.match('(?:^|\\s)filter-all(?!\\S)')) { // #filter-all
            for (var i = 1; i < inputs.length; ++i) { // loop the checkboxes, ignore [0] - #filter-all
                inputs[i].checked = false; // uncheck all other [1+] inputs
                inputs[i].removeAttribute('disabled');
                inputs[i].parentNode.style.opacity = "1";
            }
            (function() {
                removeClasses(items, 'selected');
                removeClasses(wrap, 'filtered-' + filterType);
                removeClasses(noitem, 'filter-no-item-active');
            })();
        } else { // if another filter is checked
            inputs[0].checked = false; // uncheck [0] - #filter-all
            for (var i = 1; i < inputs.length; ++i) { // loop the checkboxes, ignore [0] - #filter-all
                var checkedBox = inputs[i];
                var checkedBoxContainer = checkedBox.parentNode.parentNode;
                var containerCheckboxes = checkedBoxContainer.querySelectorAll('.inputContainer');
                var containerCheckboxesArray = [].slice.call(containerCheckboxes);
                var theBox = containerCheckboxesArray.indexOf(checkedBox.parentNode);
                if (inputs[i].checked) {
                    filters.push(inputs[i].id); // add checked checkboxes to filters array
                    var currentFilter = filters.join(',  <span class="glyph">&#9745;</span> ').toString().replace(/_/g, " ").replace(/Turner and Townsend/g, "Turner & Townsend");
                    document.getElementById('appliedFilterList').innerHTML = "<p><span>The current applied resource table filters are: </span><span class='glyph'>&#9745;</span> " + currentFilter + " <span>expand the filter dropdown to make changes.</span></p>";
                }
            }
            (function() {
                removeClasses(items, 'selected');
                addClasses(wrap, 'filtered-' + filterType);
                if (filterType == 'exclusive') {
                    for (var i = 0; i < filters.length; ++i) {
                        addClasses(document.querySelectorAll(filterTarget + ' .filter-item.' + filters[i]), 'selected');
                    }
                    document.querySelectorAll(filterTarget + ' .selected').length == items.length ? addClasses(noitem, 'filter-no-item-active') : removeClasses(noitem, 'filter-no-item-active');
                } else if (filterType == 'inclusive') {
                    if (filters.length > 0) {
                        addClasses(document.querySelectorAll(filterTarget + ' .filter-item.' + filters.join('.')), 'selected');

                    }
                    document.querySelectorAll(filterTarget + ' .selected').length == 0 ? addClasses(noitem, 'filter-no-item-active') : removeClasses(noitem, 'filter-no-item-active');
                }
                var checkCount = 0;
                for (var i = 0; i < inputs.length; ++i) {
                    checkCount += inputs[i].checked ? 1 : 0;
                }
                if (checkCount == 0) {
                    document.getElementById('appliedFilterList').innerHTML = "<p><span>Expand the filter dropdown to refine the resource table.</span></p>";
                    for (var i = 1; i < inputs.length; ++i) {
                        inputs[0].checked = true;
                        var checkedBox = inputs[i];
                        var checkedBoxContainer = checkedBox.parentNode.parentNode;
                        var containerCheckboxes = checkedBoxContainer.querySelectorAll('.inputContainer');
                        var containerCheckboxesArray = [].slice.call(containerCheckboxes);
                        for (var j = 0; j < containerCheckboxesArray.length; ++j) {
                            containerCheckboxesArray[j].getElementsByTagName('input')[0].removeAttribute('disabled');
                            containerCheckboxesArray[j].style.opacity = "1";
                        }
                    }
                }
                if (inputs[0].checked) {
                    removeClasses(wrap, 'filtered-' + filterType);
                    removeClasses(noitem, 'filter-no-item-active');
                }
                inputs[0].addEventListener('change', function() {
                    if (inputs[0].checked) {
                        document.getElementById('appliedFilterList').innerHTML = "<p><span>Expand the filter dropdown to refine the resource table.</span></p>";
                    }
                });
            })();
        }
    } //END filterContent
    var filterGroupTitles = document.getElementsByClassName('filterGroup');
    var maxWidth = 0;
    for (i = 0; i < filterGroupTitles.length; ++i) {
        maxWidth = Math.max(maxWidth, filterGroupTitles[i].offsetWidth);
    };
    for (i = 0; i < filterGroupTitles.length; ++i) {
        filterGroupTitles[i].style.width = maxWidth + 10 + "px";
    };
} //END contentFilter

function showHideDocFilter() {
    var theTable = document.getElementById('filterOptions');
    if (theTable.style.height == 'auto') {
        theTable.style.height = '0';
    } else {
        theTable.style.height = 'auto';
    }
}

function toggleFilterButton(el) {
    if (el.className == "button cyan upArrow") {
        el.className = "button cyan downArrow";
        el.innerHTML = "Show the resource table filters<span></span>";
    } else {
        el.className = "button cyan upArrow";
        el.innerHTML = "Hide the resource table filters<span></span>";
    }
}


// JavaScript Document