/*
Constant and initial variables
 */

const listIcon = "css/img/glyphicons/png/glyphicons-115-list.png";
const thumbnailIcon = "css/img/glyphicons/png/glyphicons-157-show-thumbnails.png";

//Wait until document is fully loaded prior to accessing DOM elements
window.onload = () => {
    //Get loaded DOM elements
    let contentView = document.getElementById("content");
    let viewBtn = document.getElementById("view");

    viewBtn.addEventListener("click", () => {
        toggleView(contentView, viewBtn);
    });
    contentView.addEventListener("transitionend", () => {
        contentView.classList.contains("show") ?
            contentView.classList.remove("show") :
            toggleView(contentView, viewBtn);
    });
    //Add event listener to refresh button
    let refreshBtn = document.getElementById("refresh");
    refreshBtn.addEventListener("click", () => {
        if (confirm("Refresh the current view?")) {
            contentView.innerHTML = "";
            //Refresh the entries with new http request without page reload
            fetchEntries();
        }
    })

    let addBtn = document.getElementById("add");
    addBtn.addEventListener("click", () => {
        //Current date
        let added = new Date().toLocaleDateString();
        //Hardcoded
        let owner = "placeimg.com"
        //Create random string
        let title = (Math.random() + 1).toString(36).substring(5);
        //Fetch random img from placeimg.com
        let src = "https://placeimg.com/640/640/any";
        //Create random integer [0,4]
        let tagCnt = Math.floor(Math.random() * 5);
        addEntry(src, owner, added, title, tagCnt);
    });
}

/*Assign click event listener to every entry*/
function assignListener(entry) {
    //Prevent double messages by making sure each entry has only one click listener assigned
    entry.addEventListener("click", (event) => {
        /*Access class of clicked node of entry*/
        if (event.target.className !== "options icon") {
            /*Use children to remove blank spaces as node elements from array*/
            alert(entry.children[1].children[1].innerHTML);
        } else {
            if (confirm("Delete " + entry.children[1].children[1].innerHTML + " from " +
                entry.children[1].children[0].children[0].innerHTML + "?"
            )) {
                //Remove node completely as emptying HTML still leaves css rules (borders) intact
                entry.parentNode.removeChild(entry);
            }
        }
    });
}

function toggleView(contentView, viewBtn) {
    let listView = contentView.classList.contains("listView");
    let viewShown = contentView.classList.contains("hide");
    if (!viewShown) {
        contentView.classList.add("hide");
    } else {
        contentView.classList.replace("hide", "show");
        if (listView) {
            //Change view
            contentView.classList.replace("listView", "thumbnailView");
            //Delay the button change until the new view fades in
            setTimeout(() => {
                viewBtn.setAttribute("src", thumbnailIcon)
            }, 2000);
        } else {
            //Change view
            contentView.classList.replace("thumbnailView", "listView");
            //Delay the button change until the new view fades in
            setTimeout(() => {
                viewBtn.setAttribute("src", listIcon)
            }, 2000);
        }
    }
}

