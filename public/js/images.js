const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMore = document.getElementById("show-more-btn");

// API
let keyword = "";
let page = 1;

async function searchImages() {
  keyword = searchBox.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=aWrZH9kgeYu77VuXe2L3MRVaTUtj2A92BqcvzTMJRHk&per_page=12`;

     const response = await fetch(url);
     // console.log(response); readable stream
     const data = await response.json();
     // console.log(data);

    if(page === 1){
        searchResult.innerHTML = "";
    }

     const realData = data.results;
      //  console.log(realData);
     //   displaying images
     realData.map((itr) => {
     const image = document.createElement("img");
     image.src = itr.urls.small;
     const imageLink = document.createElement("a");
     imageLink.href = itr.links.html;
     imageLink.target = "_blank";

    // now appending image inside <a> tag
    imageLink.appendChild(image);
    // appending to the main div in html
    searchResult.appendChild(imageLink);
  });
  // handling show more button
  showMore.style.display = "block";
}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  searchImages();
});

// if showmore button clicked
showMore.addEventListener("click",() => {
    page++;
    searchImages();
})