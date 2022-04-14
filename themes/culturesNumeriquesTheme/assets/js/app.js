import "./bootstrap.js";
import "masonry-layout";
import imagesLoaded from "imagesloaded";



var grids = document.querySelectorAll('.grid-masonry');



grids.forEach(grid=>{
    var msnry = new Masonry( grid, {
        // itemSelector: '.grid-item',
        // columnWidth: '.grid-sizer',
        percentPosition: true
    });

    imagesLoaded( grid ).on( 'progress', function() {
        // layout Masonry after each image loads
        msnry.layout();
    });
})