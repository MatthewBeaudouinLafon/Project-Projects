var slideIndex = 1;
var slides = document.getElementsByClassName("mySlides");
var counter = document.getElementsByClassName('slide-counter');
showSlides(slideIndex);

function showSlides(n) {
    var i;
    // var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}

    for (i = 0; i < slides.length; i++) {
       if (slides[i] != null) {
        slides[i].visibility = "hidden";
        slides[i].style.display = "none";
       }
    }

    if (slides[slideIndex-1] != null) {
        slides[slideIndex-1].visibility = "visible";
        slides[slideIndex-1].style.display = "block";
    }

    var slideCounter = document.getElementById("slide-counter");

    if (slideCounter) { 
        var t = slideIndex + " / " + slides.length;      // Create a text node
        slideCounter.innerHTML = t;           // Append <p> to <div> with id="myDIV"
    }
    
}

function updateSlides () {
    counter = "<p>" + slideIndex + "/" + slides.length + "</p>";
}
    // var i;
    // var slides = document.getElementsByClassName("mySlides");
    // var counter = document.getElementsByClassName("slide-counter");
    // var total = slides.length;
    // var current = 1;

    // if (n > slides.length) {slideIndex = 1}    
    // if (n < 1) {slideIndex = slides.length}

    
    // slideIndex++;
    // if (slideIndex > slides.length) {slideIndex = 1;}    
    
    // // setTimeout(showSlides, 2000); // Change image every 2 seconds

export const plusSlides = (n)=>{
    showSlides(slideIndex += n);
}

export const minusSlides = (n) => {
    showSlides(slideIndex -= n);
}

export const getIndex = () => {
    return slideIndex;
}

export const getTotalSlides = () => {
    return slides.length;
}

export const countSlides = () => {
    updateSlides();
}