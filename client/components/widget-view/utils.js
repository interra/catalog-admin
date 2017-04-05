const react = require('react');

const widgetMap = {
  boolean: {
    checkbox: "CheckboxWidget",
    radio: "RadioWidget",
    select: "SelectWidget",
  },
  string: {
    text: "TextWidget",
    email: "EmailWidget",
    uri: "URLWidget",
    select: "SelectWidget",
    textarea: "TextareaWidget",
    date: "DateWidget",
    color: "ColorWidget",
    file: "FileWidget",
  },
  array: {
    select: "SelectWidget",
    checkboxes: "CheckboxesWidget",
    files: "FileWidget",
  },
};

// Either extend UISchema to include "view: text" or create ViewSchema
// {
//   "primaryEmail" : {
//     "view:widget" : "obfsucatedEmail"
//   },
//   {
//     "telephone" : {
//       "view": false
//     }
//   }
// }

//const formDate = {
//  "primaryEmail": "Chuck",
//  "telephone": "2152221234"
//}

// view widgets
* text
* image
* table
*

// template
* depends on ViewSchema
