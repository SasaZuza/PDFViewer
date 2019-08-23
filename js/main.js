// Setting the variable of PDF URL
const url = "../docs/pdf.pdf";

// This represents the doc that we get with pdfJS
let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

// Fetching PDF and putting it into canvas
const scale = 1.5,
  canvas = document.querySelector("#pdf-render"),
  ctx = canvas.getContext("2d");

// Render the page
const renderPage = num => {
  // Setting pageIsRendering to true
  pageIsRendering = true;

  // Getting the page number
  pdfDoc.getPage(num).then(page => {
    // Set scale - height and width in canvas of pdf doc
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Creating variable for rendering ctx and viewport
    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    // Adding render method to render PDF content
    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      // Check if page number is pending
      if (pageNumIsPending !== null) {
        renderPage(pageIsRendering);
        pageNumIsPending = null;
      }
    });

    // Output current page number
    document.querySelector("#page-num").textContent = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// Show Prev Page function
const showPrevPage = () => {
  // Check if current num of page is 1 or less and then return that page
  if (pageNum <= 1) {
    return;
    // Else when clicking Prev page button go to previous page
  } else {
    pageNum--;
    queueRenderPage(pageNum);
  }
};

// Show Next Page function
const showNextPage = () => {
  // Check if current num of page is 1 or greater and then PDF doc max num of pages
  if (pageNum >= pdfDoc.numPages) {
    return;
    // Else when clicking Next Page button go to next page
  } else {
    pageNum++;
    queueRenderPage(pageNum);
  }
};

// Get the PDF document with this method and promise
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    // Adding number of total pages of PDF doc to screen
    document.querySelector("#page-count").textContent = pdfDoc.numPages;

    // Rendering initial page num - it is starting from page No 1
    renderPage(pageNum);
  })
  .catch(err => {
    // Display error by creating div, taking style and adding error message
    const div = document.createElement("div");
    div.className = "error";
    div.appendChild(document.createTextNode(err.message));
    document.querySelector("body").insertBefore(div, canvas);
    // Remove top bar on error page
    document.querySelector(".top-bar").style.display = "none";
  });

// Button events for Next and Previous page
document.querySelector("#prev-page").addEventListener("click", showPrevPage);
document.querySelector("#next-page").addEventListener("click", showNextPage);
