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


const dists = ["uniform", "left-skewed", "right-skewed"]; //data distributions //TBD: normal distribution might be added
// var tasks = ["compare", "max", "min"];   //TBD: "match" might be added
const tasks = ["compare", "match", "max", "min"];
const ratios = [1.5, 2, 2.5, 3, 3.5, 4];
// const values = [1.5, 2, 2.5, 3, 3.5, 4];   //TODO: mix and min values
const sizes = [3, 10]; //grid size
const trials = [1, 2];
const pages_compare = [
    "compare/position.html",
    "compare/length.html",
    "compare/color.html",
    "compare/horizontal_motion.html",
    "compare/vertical_motion.html",
    "compare/flicker.html",
    "compare/expansion.html",
    "compare/area.html",
    "compare/angle.html"
];
const pages_max = [
    "max/position.html",
    "max/length.html",
    "max/color.html",
    "max/horizontal_motion.html",
    "max/vertical_motion.html",
    "max/flicker.html",
    "max/expansion.html",
    "max/area.html",
    "max/angle.html"
];

const pages_min = [
    "min/position.html",
    "min/length.html",
    "min/color.html",
    "min/horizontal_motion.html",
    "min/vertical_motion.html",
    "min/flicker.html",
    "min/expansion.html",
    "min/area.html",
    "min/angle.html"
];

const pages_match = [
    "match/position.html",
    "match/length.html",
    "match/color.html",
    "match/horizontal_motion.html",
    "match/vertical_motion.html",
    "match/flicker.html",
    "match/expansion.html",
    "match/area.html",
    "match/angle.html"
    ];

let items = [];
let pages = [];
for (const trial of trials) {
    // for (const dist of dists) {
        for (const size of sizes) {
            for (const task of tasks) {
               if (task == "compare"){
                // console.log("1");
                pages = pages_compare;
               } else if (task == "match") {
                // console.log("2");
                pages = pages_match;
               } else if (task == "max") {
                // console.log("3");
                pages = pages_max;
               } else if (task == "min") {
                // console.log("4");
                pages = pages_min;
               }
               for (const page of pages) {
                    if (task == "compare") {
                        for (const ratio of ratios) {
                            if (ratio == 1.5 || ratio == 2){
                                items.push([task, page, "uniform", size, ratio, trial]);
                            }
                            if (ratio == 2.5 || ratio == 3) {
                                items.push([task, page, "right-skewed", size, ratio, trial]);
                            }
                            if (ratio == 3.5 || ratio == 4) {
                                items.push([task, page, "left-skewed", size, ratio, trial]);
                            }
                        }
                    } else if (task == "max") {
                        for (const ratio of ratios) {
                            if (ratio == 1.5) {
                                items.push([task, page, "uniform", size, ratio, trial]);
                            } else if (ratio == 2.5) {
                                items.push([task, page, "right-skewed", size, ratio, trial]);
                            } else if (ratio == 3.5) {
                                items.push([task, page, "left-skewed", size, ratio, trial]);
                            }
                        }
                    } else if (task == "min") {
                        for (const ratio of ratios) {
                            if (ratio == 2) {
                                items.push([task, page, "uniform", size, ratio, trial]);
                            } else if (ratio == 3) {
                                items.push([task, page, "right-skewed", size, ratio, trial]);
                            } else if (ratio == 4) {
                                items.push([task, page, "left-skewed", size, ratio, trial]);
                            }
                        }
                    } else if (task == "match") {     //TODO: change based on the values selected for matching
                        for (const ratio of ratios) {
                            if (ratio == 1.5 || ratio == 2){
                                items.push([task, page, "uniform", size, ratio, trial]);
                            }
                            if (ratio == 2.5 || ratio == 3) {
                                items.push([task, page, "right-skewed", size, ratio, trial]);
                            }
                            if (ratio == 3.5 || ratio == 4) {
                                items.push([task, page, "left-skewed", size, ratio, trial]);
                            }
                        }
                    }
                }
            }
        }
    // }
}

//Debugging-start

// //printing the items on console

// for (const item of items) {
//     console.log(item);
// }

// //downloading a csv file containing all the items

// // Join the array elements with line breaks to create a CSV string
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


//TODO
const page_to_name = {
    // "./area.html": "Area",
    // "./angle.html": "Angle",
    // "./color.html": "Color",
    // "./length.html": "Length",
    // "./position.html": "Position",
    // "./expansion.html": "Expansion",
    // "./flicker.html": "Flicker",
    // "./horizontal_motion.html": "Horizontal Motion", //changed by shae, previously "Vibration"
    // "./vertical_motion.html": "Vertical Motion"
    "compare/area.html": "Area",
    "match/area.html": "Area",
    "max/area.html": "Area",
    "min/area.html": "Area",
    "compare/angle.html": "Angle",
    "match/angle.html": "Angle",
    "max/angle.html": "Angle",
    "min/angle.html": "Angle",
    "compare/color.html": "Color",
    "compare/length.html": "Length",
    "match/length.html": "Length",
    "max/length.html": "Length",
    "min/length.html": "Length",
    "compare/position.html": "Position",
    "match/position.html": "Position",
    "max/position.html": "Position",
    "min/position.html": "Position",
    "compare/expansion.html": "Expansion",
    "match/expansion.html": "Expansion",
    "max/expansion.html": "Expansion",
    "min/expansion.html": "Expansion",
    "compare/flicker.html": "Flicker",
    "match/flicker.html": "Flicker",
    "max/flicker.html": "Flicker",
    "min/flicker.html": "Flicker",
    "compare/horizontal_motion.html": "Horizontal Motion", //changed by shae, previously "Vibration"
    "match/horizontal_motion.html": "Horizontal Motion",
    "max/horizontal_motion.html": "Horizontal Motion",
    "min/horizontal_motion.html": "Horizontal Motion",
    "compare/vertical_motion.html": "Vertical Motion",
    "match/vertical_motion.html": "Vertical Motion",
    "max/vertical_motion.html": "Vertical Motion",
    "min/vertical_motion.html": "Vertical Motion"
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

    // document.getElementById("head").innerHTML = `${
    //     page_to_name[rand_item[0][1]] //changed by Shae
    //     // "Angle"
    // }`;

    rand_item[0][1] = "./min/length.html"; //for debugging purposes
    rand_item[0][0] = "min";
    
    document
        .getElementById("content")
        .setAttribute(
        "src",
        `${rand_item[0][1]}?task=${rand_item[0][0]}&dist=${rand_item[0][2]}&size=${rand_item[0][3]}&ratio=${rand_item[0][4]}&trial=${rand_item[0][5]}&id=${participant_id}`
        );
}
