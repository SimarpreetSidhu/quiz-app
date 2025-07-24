//instruction for button "shareMyResult". 
//what happens when user clink the button?
//instruction below
$(document).ready(function () {
   $('#share-button').on('click', function () {
      const shareUrl = $(this).data('url'); 
      window.open(shareUrl, '_blank');
    })
});


