function getId() {
    // Check if participant ID exists inal  locstorage
    if (localStorage.getItem("participant_id")) {
        participant_id = localStorage.getItem("participant_id");
    } else {
        // Generate a new participant ID
        participant_id = Math.floor(Math.random() * 1000);
        // Store the participant ID in local storage for future sessions
        localStorage.setItem("participant_id", participant_id);
    }

    console.log(`getId() completed, id: ${participant_id}`);
    load_page();
}


var dists = ["uniform", "left-skewed", "right-skewed"]; //data distributions //TBD: normal distribution might be added
var tasks = ["compare", "max", "min"];   //TBD: "match" might be added
var ratios = [1.5, 2, 2.5, 3, 3.5, 4];
var values = [1.5, 2, 2.5, 3, 3.5, 4];   //TODO: mix and min values
var sizes = [3, 10]; //grid size
var trials = [1, 2];
var pages = [
    "./position.html",
    "./length.html",
    "./color.html",
    "./vibration.html",
    "./vertical_motion.html",
    "./flicker.html",
    "./expansion.html",
    "./area.html",
    "./angle.html"
];
var pages_max = [
    "./position.html",
    "./length.html",
    "./color.html",
    "./vibration.html",
    "./vertical_motion.html",
    "./flicker.html",
    "./expansion.html",
    "./area.html",
    "./angle.html"
];
var pages_min = [
    "./position.html",
    "./length.html",
    "./color.html",
    "./vibration.html",
    "./vertical_motion.html",
    "./flicker.html",
    "./expansion.html",
    "./area.html",
    "./angle.html"
    ];

var items = [];
for (const trial of trials) {
    for (const dist of dists) {
        for (const size of sizes) {
            for (const task of tasks) {
               if (task == "compare") {
                for (const page of pages) {
                    for (const ratio of ratios) {
                        items.push([task, page, dist, size, ratio, trial]);
                    }
                }
               } else if (task == "max") {
                for (const page of pages_max) {
                    for (const value of values) {
                        items.push([task, page, dist, size, value, trial]);
                    }
                }
               } else if (task == "min") {
                for (const page of pages_min) {
                    for (const value of values) {
                        items.push([task, page, dist, size, value, trial]);
                    }
                }
               }  
            }
        }
    }
}

//Debugging-start

//printing the items on console

// for (const item of items) {
//     console.log(item);
// }

//downloading a csv file containing all the items

// Join the array elements with line breaks to create a CSV string
// const csvString = items.join('\n');

// // Create a Blob (binary large object) containing the CSV data
// const blob = new Blob([csvString], { type: 'text/csv' });

// // Create a download link for the CSV file
// const a = document.createElement('a');
// a.href = URL.createObjectURL(blob);
// a.download = 'output.csv';

// // Trigger a click event on the download link to prompt the user to download the file
// a.click();

//Debugging-finish


var page_to_name = {
    "./area.html": "Area",
    "./angle.html": "Angle",
    "./color.html": "Color",
    "./length.html": "Length",
    "./position.html": "Position",
    "./expansion.html": "Expansion",
    "./flicker.html": "Flicker",
    "./vibration.html": "Horizontal Motion", //changed by shae, previously "Vibration"
    "./vertical_motion.html": "Vertical Motion"
};

function load_page() {
    // console.log(`parent domain: ${document.domain}`); //Commented by Shae
    if (items.length == 0) {
        window.setTimeout(
        () => window.location.assign(`./end.html?id=${participant_id}`),
        500
        );
    }
    var rand_item = items.splice(Math.floor(Math.random() * items.length), 1);
    // console.log(rand_item); //debugging
    console.log(rand_item[0][1], items.length);  //commented by Shae

    document.getElementById("head").innerHTML = `${
        page_to_name[rand_item[0][1]] //changed by Shae
    }`;
    
    rand_item[0][1] = "./length.html"; //for debugging purposes
    document
        .getElementById("content")
        .setAttribute(
        "src",
        `${rand_item[0][1]}?task=${rand_item[0][0]}&dist=${rand_item[0][2]}&size=${rand_item[0][3]}&ratio=${rand_item[0][4]}&trial=${rand_item[0][5]}&id=${participant_id}`
        );
}