//Fetch entry list from stored JSON with XMLHttp Request
let xmlhttp = new XMLHttpRequest();
const dataUrl = "https://raw.githubusercontent.com/dieschnittstelle/org.dieschnittstelle.iam.css_jsl_jsr/master/data/listitems.json";

//Load current entries to HTML when opening a page
fetchEntries();

function fetchEntries() {
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let entries = JSON.parse(this.responseText);
            addToContent(entries);
        }
    };
    xmlhttp.open("GET", dataUrl, true);
    xmlhttp.send();
}

//Create new children nodes in "Content" section with JSON and Entry template
function addToContent(entries) {
    let template = document.getElementById("entryTemplate");
    let content = document.getElementById("content");
    for (let entry in entries) {
        addEntry(entries[entry].src,
            entries[entry].owner,
            entries[entry].added,
            entries[entry].title,
            entries[entry].numOfTags
        );
    }
}

function addEntry(source, owner, added, title, tagCnt) {
    let template = document.getElementById("entryTemplate");
    let content = document.getElementById("content");
    //Make a true copy of entry template
    let entryClone = template.content.cloneNode(true);
    content.append(entryClone);
    //Change img src, owner, creation date and title of cloned template
    let lastEntry = content.lastElementChild;
    lastEntry.children[0].children[0].setAttribute("src", source);
    lastEntry.children[1].children[0].children[0].innerHTML = owner;
    lastEntry.children[1].children[0].children[1].innerHTML = added;
    lastEntry.children[1].children[1].innerHTML = title;
    lastEntry.children[1].children[2].children[1].innerHTML = tagCnt;
    //Make sure each entry has only one assigned listener
    assignListener(lastEntry);
}


