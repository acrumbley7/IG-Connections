var followersBefore = [];
var followingBefore = [];
var followersAfter = [];
var followingAfter = [];
var notFollowingBack = [];
var unfollowed = [];


document.getElementById('download-button').addEventListener('click', () => {
    generateFiles();
});

const modal = document.getElementById("instructions-modal");

document.getElementById("instructions-button").addEventListener("click", () => {
  modal.style.display = "block";
});

document.querySelector(".close-button").addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

document.getElementById('submit-button').addEventListener('click', () => {
    clear()
    const beforeFolder = document.getElementById("before-folder");
    const afterFolder = document.getElementById("after-folder");
    parseFolders(beforeFolder, afterFolder);
});

async function parseFolders(before, after) {
    for (let i = 0; i < before.files.length; i++) {
        const file = before.files[i];
        if (file.name === "followers_1.json") {
            const text = await file.text(); 
            const json = JSON.parse(text);
            buildArray(json, followersBefore);
        } 
    }
    for (let i = 0; i < after.files.length; i++) {
        const file = after.files[i];
        if (file.name === "followers_1.json") {
            const text = await file.text();
            const json = JSON.parse(text);
            buildArray(json, followersAfter);
        } else if (file.name === "following.json") {
            const text = await file.text(); 
            const json = JSON.parse(text)['relationships_following'];
            buildArray(json, followingAfter);
        }
    }
    document.getElementById("before-folder").value = "";
    document.getElementById("after-folder").value = "";
    processData();
}

function clear() {
    followersBefore.length = 0;
    followingBefore.length = 0;
    followersAfter.length = 0;
    followingAfter.length = 0;
    notFollowingBack.length = 0;
    unfollowed.length = 0;
    document.getElementById("not-following-back-label").textContent = "Users Not Following You Back:";
    document.getElementById("unfollowed-label").textContent = "Users That Unfollowed You:";
}

function buildArray(folder, array) {
    for (let i = 0; i < folder.length; i++) {
        const user = folder[i];
        array.push(user.string_list_data[0].value);
    }
}

async function processData() {
    notFollowingBack = followingAfter.filter(x => !followersAfter.includes(x));
    unfollowed = followersBefore.filter(x => !followersAfter.includes(x));
    displayResults();
    document.getElementById('download-button').disabled = false;
}

function displayResults() {
    document.getElementById("not-following-back-label").textContent += ` (${notFollowingBack.length})`;
    document.getElementById("unfollowed-label").textContent += ` (${unfollowed.length})`;
    if (unfollowed.length > 12) {
        paginate('unfollowed', unfollowed);
    } else {
        document.getElementById("unfollowed").innerHTML = unfollowed.join('\n');
    }
    if (notFollowingBack.length > 12) {
        paginate('not-following-back', notFollowingBack);
    } else {
        document.getElementById("not-following-back").textContent = notFollowingBack.join('\n');
    }
}

function paginate(elementId, data) {
    const itemsPerPage = 12;
    let currentPage = 1;

    function renderPage() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const listElement = document.getElementById(elementId);
        listElement.innerHTML = data.slice(start, end).join('\n');

        listElement.scrollTop = 0;

        renderPaginationControls();
    }

    function renderPaginationControls() {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';

        const parent = document.getElementById(elementId).parentNode;
        const existingControls = parent.querySelector('.pagination-controls');
        if (existingControls) {
            parent.removeChild(existingControls);
        }

        const pageInfo = document.createElement('div');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        pageInfo.style.marginBottom = '10px';
        pageInfo.style.fontWeight = 'bold';
        paginationControls.appendChild(pageInfo);

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            currentPage--;
            renderPage();
        });
        paginationControls.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            currentPage++;
            renderPage();
        });
        paginationControls.appendChild(nextButton);

        parent.appendChild(paginationControls);
    }

    renderPage();
}

function generateFiles() {
    const zip = new JSZip();

    // Add "unfollowed" data to a text file
    zip.file("unfollowed.txt", unfollowed.join('\n'));

    // Add "notFollowingBack" data to a text file
    zip.file("not_following_back.txt", notFollowingBack.join('\n'));

    // Generate the ZIP file and download
    zip.generateAsync({ type: "blob" }).then((content) => {
        // Create a download link and trigger it
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "IG-Connections-Lists.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

